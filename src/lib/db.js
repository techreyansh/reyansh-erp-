/**
 * Supabase table access: one table per entity (no sheet_rows / sheet_name).
 * All tables have: id, created_at, sort_order, record jsonb.
 */
import { supabase } from './supabaseClient';
import config from '../config/config';

export const TABLE_NAMES = {
  // Auth & users
  Users: 'users',
  users: 'users',

  // Clients
  CLIENT: 'clients',
  clients: 'clients',
  PROSPECTS_CLIENTS: 'prospects_clients',
  prospects_clients: 'prospects_clients',

  // Vendors & stock
  Vendor: 'vendors',
  vendors: 'vendors',
  Stock: 'stock',
  stock: 'stock',
  'Material Inward': 'material_inward',
  'Material Issue': 'material_issue',
  BOM: 'bom',
  'Kitting Sheet': 'kitting_sheet',
  'Finished Goods': 'finished_goods',

  // Dispatches
  Dispatches: 'dispatches',
  dispatches: 'dispatches',

  // Purchase flow
  Purchase_Flow: 'purchase_flows',
  PurchaseFlow: 'purchase_flows',
  purchase_flows: 'purchase_flows',
  PurchaseFlowSteps: 'purchase_flow_steps',
  purchase_flow_steps: 'purchase_flow_steps',

  // Sales flow
  SalesFlow: 'sales_flows',
  sales_flows: 'sales_flows',
  SalesFlowSteps: 'sales_flow_steps',
  sales_flow_steps: 'sales_flow_steps',
  LogAndQualifyLeads: 'log_and_qualify_leads',
  InitialCall: 'initial_call',
  SendQuotation: 'send_quotation',
  ApprovePaymentTerms: 'approve_payment_terms',
  SampleSubmission: 'sample_submission',
  GetApprovalForSample: 'get_approval_for_sample',
  ApproveStrategicDeals: 'approve_strategic_deals',
  EvaluateHighValueProspects: 'evaluate_high_value_prospects',
  CheckFeasibility: 'check_feasibility',
  ConfirmStandardAndCompliance: 'confirm_standard_and_compliance',
  FollowUpQuotations: 'follow_up_quotations',
  'Comparative Statement': 'comparative_statement',
  SheetApproveQuotation: 'sheet_approve_quotation',
  RequestSample: 'request_sample',
  InspectMaterial: 'inspect_material',
  MaterialApproval: 'material_approval',
  PlacePO: 'place_po',
  ReturnHistory: 'return_history',
  GenerateGRN: 'generate_grn',
  SchedulePayment: 'schedule_payment',
  ReleasePayment: 'release_payment',

  // Logs & products
  Audit_Log: 'audit_log',
  audit_log: 'audit_log',
  'WhatsApp Message Logs': 'whatsapp_logs',
  whatsapp_logs: 'whatsapp_logs',
  PRODUCT: 'products',
  products: 'products',
  PO_Master: 'po_master',
  po_master: 'po_master',
  Daily_CAPACITY: 'daily_capacity',
  daily_capacity: 'daily_capacity',
  RFQ: 'rfq',
  rfq: 'rfq',
  BOM_Templates: 'bom_templates',
  bom_templates: 'bom_templates',
  SortVendor: 'sort_vendor',
  sort_vendor: 'sort_vendor',
  FollowUpDelivery: 'follow_up_delivery',
  follow_up_delivery: 'follow_up_delivery',
  ReturnMaterial: 'return_material',
  return_material: 'return_material',
  InspectSample: 'inspect_sample',
  inspect_sample: 'inspect_sample',
};

/**
 * Resolve logical sheet/table name to actual table name.
 * @param {string} logicalName - e.g. 'Users', 'CLIENT', config.sheets.users
 * @returns {string} snake_case table name
 */
export function getTableName(logicalName) {
  if (!logicalName) return logicalName;
  const resolved = TABLE_NAMES[logicalName];
  if (resolved) return resolved;
  // Fallback: convert to snake_case (simple)
  return String(logicalName)
    .replace(/\s+/g, '_')
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .toLowerCase();
}

/**
 * Get all rows from a table as flattened objects { id, ...record }.
 * @param {string} tableName - actual table name (e.g. 'users', 'clients')
 * @returns {Promise<Array<{ id: string, ... }>>}
 */
export async function getTableRows(tableName) {
  const name = getTableName(tableName);
  if (config.useLocalStorage) return [];

  const { data: rows, error } = await supabase
    .from(name)
    .select('id, created_at, sort_order, record')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true });

  if (error) {
    console.error(`Error getTableRows(${name}):`, error);
    throw error;
  }

  return (rows || []).map((r) => ({
    id: r.id,
    ...(r.record || {}),
  }));
}

/**
 * Insert a row. Uses record = row and auto sort_order.
 * @param {string} tableName
 * @param {object} row - data object (no id)
 * @returns {Promise<object>}
 */
export async function insertTableRow(tableName, row) {
  const name = getTableName(tableName);
  if (config.useLocalStorage) return {};

  const { data: maxRow } = await supabase
    .from(name)
    .select('sort_order')
    .order('sort_order', { ascending: false })
    .limit(1)
    .maybeSingle();

  const nextOrder = (maxRow?.sort_order ?? -1) + 1;
  const payload = {
    sort_order: nextOrder,
    record: typeof row === 'object' && row !== null && !Array.isArray(row)
      ? row
      : {},
  };

  const { error } = await supabase.from(name).insert(payload);
  if (error) {
    console.error(`Error insertTableRow(${name}):`, error);
    throw error;
  }
  return {};
}

/**
 * Update a row by id. Sets record = row.
 * @param {string} tableName
 * @param {string} id - uuid
 * @param {object} row - full record to store
 */
export async function updateTableRowById(tableName, id, row) {
  const name = getTableName(tableName);
  if (config.useLocalStorage) return;

  const { error } = await supabase
    .from(name)
    .update({ record: row || {} })
    .eq('id', id);

  if (error) {
    console.error(`Error updateTableRowById(${name}, ${id}):`, error);
    throw error;
  }
}

/**
 * Delete a row by id.
 * @param {string} tableName
 * @param {string} id
 */
export async function deleteTableRowById(tableName, id) {
  const name = getTableName(tableName);
  if (config.useLocalStorage) return;

  const { error } = await supabase.from(name).delete().eq('id', id);
  if (error) {
    console.error(`Error deleteTableRowById(${name}, ${id}):`, error);
    throw error;
  }
}

/**
 * Update row by 1-based row index (1 = header, 2 = first data row).
 * @param {string} tableName
 * @param {number} rowIndex
 * @param {object} rowData
 */
export async function updateRowByIndex(tableName, rowIndex, rowData) {
  const rows = await getTableRows(tableName);
  const dataIndex = rowIndex - 2;
  const row = rows[dataIndex];
  if (!row?.id) throw new Error(`Row at index ${rowIndex} not found`);
  const existing = { ...row };
  delete existing.id;
  const merged = { ...existing, ...(rowData || {}) };
  delete merged.id;
  await updateTableRowById(tableName, row.id, merged);
}

/**
 * Delete row by 1-based row index.
 * @param {string} tableName
 * @param {number} rowIndex
 */
export async function deleteRowByIndex(tableName, rowIndex) {
  const rows = await getTableRows(tableName);
  const dataIndex = rowIndex - 2;
  const row = rows[dataIndex];
  if (!row?.id) throw new Error(`Row at index ${rowIndex} not found`);
  await deleteTableRowById(tableName, row.id);
}

/**
 * Get column names from first row (for compatibility).
 * @param {string} tableName
 * @returns {Promise<string[]>}
 */
export async function getTableHeaders(tableName) {
  const data = await getTableRows(tableName);
  return data.length > 0 ? Object.keys(data[0]).filter((k) => k !== 'id') : [];
}

/**
 * Insert multiple rows. Each row can be object or array (converted to object).
 * @param {string} tableName
 * @param {Array<object|Array>} rows
 */
export async function batchInsertTableRows(tableName, rows) {
  const name = getTableName(tableName);
  if (config.useLocalStorage || !rows?.length) return;
  let nextOrder = -1;
  const { data: maxRow } = await supabase.from(name).select('sort_order').order('sort_order', { ascending: false }).limit(1).maybeSingle();
  if (maxRow?.sort_order != null) nextOrder = maxRow.sort_order;
  for (let i = 0; i < rows.length; i++) {
    nextOrder += 1;
    const row = rows[i];
    const record = Array.isArray(row) ? Object.fromEntries(row.map((v, j) => [`col_${j}`, v])) : (row && typeof row === 'object' ? row : {});
    await supabase.from(name).insert({ sort_order: nextOrder, record });
  }
}

/**
 * Upload file to Supabase storage. Returns path or local fallback id.
 * @param {File} file
 * @param {string|null} folderId
 * @returns {Promise<string>}
 */
export async function uploadFile(file, folderId = null) {
  if (config.useLocalStorage) return `local_${Date.now()}_${file.name}`;
  try {
    const path = `${folderId || 'uploads'}/${Date.now()}_${Math.random().toString(36).slice(2)}_${file.name}`;
    const { data, error } = await supabase.storage.from('documents').upload(path, file, { upsert: false });
    if (error) throw error;
    return data?.path || path;
  } catch (error) {
    console.warn('Upload failed:', error);
    return `local_${Date.now()}_${file.name}`;
  }
}

/**
 * Get latest dispatch limit range for a date from daily_capacity table.
 * @param {string} tableName - e.g. 'daily_capacity'
 * @param {Date} forDate
 * @returns {Promise<{ startDate: Date, endDate: Date, limit: number }|null>}
 */
export async function getLatestDispatchLimitRange(tableName = 'daily_capacity', forDate = new Date()) {
  const data = await getTableRows(tableName);
  if (!data || data.length === 0) return null;
  let latest = null;
  const checkDate = new Date(forDate);
  data.forEach((row) => {
    const start = row['Start Date'] || row.startDate || row.start_date;
    const end = row['End Date'] || row.endDate || row.end_date;
    const limit = row.Limit || row.limit;
    if (!start || !end || !limit) return;
    const startDate = new Date(start);
    const endDate = new Date(end);
    if (checkDate >= startDate && checkDate <= endDate) {
      latest = { startDate, endDate, limit: parseInt(limit, 10) };
    }
  });
  if (!latest && data.length > 0) {
    const last = data[data.length - 1];
    latest = {
      startDate: new Date(last['Start Date'] || last.startDate || last.start_date),
      endDate: new Date(last['End Date'] || last.endDate || last.end_date),
      limit: parseInt(last.Limit || last.limit, 10),
    };
  }
  return latest;
}

export default {
  getTableName,
  getTableRows,
  insertTableRow,
  updateTableRowById,
  deleteTableRowById,
  updateRowByIndex,
  deleteRowByIndex,
  getTableHeaders,
  batchInsertTableRows,
  uploadFile,
  getLatestDispatchLimitRange,
  TABLE_NAMES,
};
