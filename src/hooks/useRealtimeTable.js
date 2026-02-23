import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import * as db from '../lib/db';
import config from '../config/config';

/**
 * Normalize a raw DB row (id, created_at, sort_order, record) to flattened shape { id, ...record }.
 * @param {object} row
 * @returns {object}
 */
function rowToRecord(row) {
  if (!row || typeof row !== 'object') return null;
  return {
    id: row.id,
    ...(row.record || {}),
  };
}

/**
 * Reusable hook: subscribe to Postgres changes for a table and keep state in sync.
 * Uses the same table naming as db (getTableName) and the same row shape as getTableRows.
 *
 * @param {string} tableName - Logical or actual table name (e.g. 'users', 'clients', config.sheets.users)
 * @returns {{ data: Array<object>, error: Error | null, loading: boolean, refetch: () => Promise<void> }}
 */
export function useRealtimeTable(tableName) {
  const resolvedTable = tableName ? db.getTableName(tableName) || String(tableName) : null;
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const mountedRef = useRef(true);
  const channelRef = useRef(null);

  const fetchInitial = useCallback(async () => {
    if (!resolvedTable) {
      setData([]);
      setLoading(false);
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const rows = await db.getTableRows(resolvedTable);
      if (mountedRef.current) setData(rows || []);
    } catch (err) {
      if (mountedRef.current) {
        setError(err instanceof Error ? err : new Error(String(err)));
        setData([]);
      }
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, [resolvedTable]);

  useEffect(() => {
    mountedRef.current = true;

    if (!resolvedTable) {
      setData([]);
      setError(null);
      setLoading(false);
      return undefined;
    }

    // LocalStorage mode: no realtime, just fetch once
    if (config.useLocalStorage) {
      fetchInitial();
      return undefined;
    }

    let channel = null;

    const setup = async () => {
      await fetchInitial();
      if (!mountedRef.current) return;

      channel = supabase
        .channel(`realtime:${resolvedTable}:${Math.random().toString(36).slice(2)}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: resolvedTable,
          },
          (payload) => {
            if (!mountedRef.current) return;
            const eventType = payload.eventType || payload.event_type;
            setData((prev) => {
              if (eventType === 'INSERT') {
                const row = rowToRecord(payload.new);
                if (!row?.id) return prev;
                if (prev.some((r) => r.id === row.id)) return prev;
                return [...prev, row];
              }
              if (eventType === 'UPDATE') {
                const row = rowToRecord(payload.new);
                if (!row?.id) return prev;
                return prev.map((r) => (r.id === row.id ? row : r));
              }
              if (eventType === 'DELETE') {
                const id = payload.old?.id;
                if (id == null) return prev;
                return prev.filter((r) => r.id !== id);
              }
              return prev;
            });
          }
        )
        .subscribe((status) => {
          if (status === 'CHANNEL_ERROR' && mountedRef.current) {
            setError(new Error('Realtime subscription error'));
          }
        });

      channelRef.current = channel;
    };

    setup();

    return () => {
      mountedRef.current = false;
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [resolvedTable, fetchInitial]);

  return {
    data,
    error,
    loading,
    refetch: fetchInitial,
  };
}

export default useRealtimeTable;
