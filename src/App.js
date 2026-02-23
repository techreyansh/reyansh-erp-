// app main code

import React from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { useUser } from "./context/UserContext";
import FullScreenLogoLoader from "./components/common/FullScreenLogoLoader";
import {
  Box,
  CssBaseline,
  ThemeProvider,
  createTheme,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import { setGlobalErrorNotifier } from "./lib/supabaseErrorHandler";
import { AuthProvider } from "./context/AuthContext";
import { UserProvider } from "./context/UserContext";
import { StepStatusProvider } from './context/StepStatusContext';

import Header from "./components/common/Header";
import Login from "./components/auth/Login";
import Dashboard from "./components/dashboard/Dashboard";
import ProfilePage from "./components/common/ProfilePage";
import SettingsPage from "./components/common/SettingsPage";
import HelpPage from "./components/common/HelpPage";
import SalesOrderIngestion from "./components/poIngestion/POIngestion";
import ClientManager from "./components/common/ClientManager";
import ProspectsClientManager from "./components/common/ProspectsClientManager";
import FlowManagement from "./components/flowManagement/FlowManagement";
import MyTasks from "./components/flowManagement/MyTasks";
import ComingSoon from "./components/common/ComingSoon";
import PrivateRoute from "./components/auth/PrivateRoute";
import CEOOnlyRoute from "./components/auth/CEOOnlyRoute";
import CEOExecutiveDashboard from "./components/ceoDashboard/CEOExecutiveDashboard";
import StorageDebugger from "./components/dev/StorageDebugger";
import SheetInitializer from "./components/admin/SheetInitializer";
import SheetsTroubleshooting from "./components/admin/SheetsTroubleshooting";
import DispatchForm from "./components/dispatch/DispatchForm";
import DispatchManagement from "./components/dispatch/DispatchManagement";
import DispatchTest from "./components/dispatch/DispatchTest";
import ProductManagement from "./components/product/ProductManagement";
import Inventory from "./components/Inventory/Inventory";
import InventoryMainNavigation from "./components/Inventory/InventoryMainNavigation";
import StockSheetNavigation from "./components/Inventory/StockSheetNavigation";
import MaterialInwardNavigation from "./components/Inventory/MaterialInwardNavigation";
import MaterialIssueNavigation from "./components/Inventory/MaterialIssueNavigation";
import FinishedGoodsNavigation from "./components/Inventory/FinishedGoodsNavigation";
import FGMaterialInwardNavigation from "./components/Inventory/FGMaterialInwardNavigation";
import FGMaterialOutwardNavigation from "./components/Inventory/FGMaterialOutwardNavigation";
import FGToBilling from "./components/Inventory/FGToBilling";
import BillOfMaterialsNavigation from "./components/Inventory/BillOfMaterialsNavigation";
import KittingSheetNavigation from "./components/Inventory/KittingSheetNavigation";
import PurchaseFlow from "./components/purchaseFlow/PurchaseFlow";
import PurchaseFlowLayout from "./components/purchaseFlow/PurchaseFlowLayout";
import config from './config/config';
import RaiseIndent from './components/purchaseFlow/RaiseIndent';
// Sales Flow imports
import SalesFlow from "./components/salesFlow/SalesFlow";
import SalesFlowLayout from "./components/salesFlow/SalesFlowLayout";
// Client Orders import
import EnhancedClientOrderTakingSheet from "./components/clientOrders/EnhancedClientOrderTakingSheet";
import SalesFlowSubheader from "./components/salesFlow/SalesFlowSubheader";
import LogAndQualifyLeads from "./components/salesFlow/LogAndQualifyLeads";
import InitialCallAndRequirementGathering from "./components/salesFlow/InitialCallAndRequirementGathering";
import EvaluateHighValueProspects from './components/salesFlow/EvaluateHighValueProspects';
import CheckFeasibility from './components/salesFlow/CheckFeasibility';
import StandardsAndCompliance from './components/salesFlow/StandardsAndCompliance';
import SendQuotation from './components/salesFlow/SendQuotation';
import ApprovePaymentTerms from './components/salesFlow/ApprovePaymentTerms';
import SampleSubmission from './components/salesFlow/SampleSubmission';
import GetApprovalForSample from './components/salesFlow/GetApprovalForSample';
import ApproveStrategicDeals from './components/salesFlow/ApproveStrategicDeals';
import SalesFlowDetails from './components/salesFlow/SalesFlowDetails';
import ApproveIndent from './components/purchaseFlow/steps/ApproveIndent';
import VendorManagement from './components/purchaseFlow/steps/VendorManagement';
import FloatRFQ from './components/purchaseFlow/steps/FloatRFQ';
import FollowupQuotations from './components/purchaseFlow/steps/FollowupQuotations';
import ComparativeStatement from './components/purchaseFlow/steps/ComparativeStatement';
import ApproveQuotation from './components/purchaseFlow/steps/ApproveQuotation';
import RequestSample from "./components/purchaseFlow/steps/RequestSample";
import InspectSample from "./components/purchaseFlow/steps/InspectSample";
import PlacePO from './components/purchaseFlow/steps/PlacePO';
import FollowupDelivery from './components/purchaseFlow/steps/FollowupDelivery';
import RecieveAndInspectMaterial from './components/purchaseFlow/steps/RecieveAndInspectMaterial';
import MaterialApproval from './components/purchaseFlow/steps/MaterialApproval';
import DecisionOnRejection from './components/purchaseFlow/steps/DecisionOnRejection';
import ReturnRejectedMaterial from './components/purchaseFlow/steps/ReturnRejectedMaterial';
import ResendMaterial from './components/purchaseFlow/steps/ResendMaterial';
import GenerateGRN from './components/purchaseFlow/steps/GenerateGRN';
import FinalGRN from './components/purchaseFlow/steps/FinalGRN';
import SubmitInvoice from './components/purchaseFlow/steps/SubmitInvoice';
import SchedulePayment from './components/purchaseFlow/steps/SchedulePayment';
import ReleasePayment from './components/purchaseFlow/steps/ReleasePayment';
import Costing from './components/Costing/Costing';
import SortVendors from './components/purchaseFlow/steps/SortVendors';
import CableProductionModule from './components/cable/CableProductionModule';
import MoldingProductionModule from './components/molding/MoldingProductionModule';
import MoldingMainNavigation from './components/molding/MoldingMainNavigation';
import MoldingDashboardNavigation from './components/molding/MoldingDashboardNavigation';
import PowerCordMasterNavigation from './components/molding/PowerCordMasterNavigation';
import ProductionPlanningNavigation from './components/molding/ProductionPlanningNavigation';
import ProductionManagementNavigation from './components/molding/ProductionManagementNavigation';
import ClientDashboard from './components/clientDashboard/ClientDashboard';
import AdvancedEmployeeDashboard from './components/employeeDashboard/AdvancedEmployeeDashboard';
import DocumentLibrary from './components/DocumentLibrary/DocumentLibrary';
import CRMManagement from './components/crm/CRMManagement';

// Premium Enterprise SaaS Design System (2026) — visual identity only; no logic changes
const theme = createTheme({
  palette: {
    primary: {
      main: "#0D9488",
      light: "#14B8A6",
      dark: "#0F766E",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#475569",
      light: "#64748B",
      dark: "#334155",
      contrastText: "#FFFFFF",
    },
    success: {
      main: "#059669",
      light: "#10B981",
      dark: "#047857",
      lighter: "#D1FAE5",
    },
    error: {
      main: "#DC2626",
      light: "#EF4444",
      dark: "#B91C1C",
      lighter: "#FEE2E2",
    },
    warning: {
      main: "#D97706",
      light: "#F59E0B",
      dark: "#B45309",
      lighter: "#FEF3C7",
    },
    info: {
      main: "#0284C7",
      light: "#0EA5E9",
      dark: "#0369A1",
      lighter: "#E0F2FE",
    },
    background: {
      default: "#F1F5F9",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#0F172A",
      secondary: "#475569",
      disabled: "#94A3B8",
    },
    grey: {
      50: "#F8FAFC",
      100: "#F1F5F9",
      200: "#E2E8F0",
      300: "#CBD5E1",
      400: "#94A3B8",
      500: "#64748B",
      600: "#475569",
      700: "#334155",
      800: "#1E293B",
      900: "#0F172A",
    },
    divider: "rgba(15, 23, 42, 0.08)",
  },
  typography: {
    fontFamily: '"Plus Jakarta Sans", "DM Sans", -apple-system, BlinkMacSystemFont, sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: "2.25rem",
      lineHeight: 1.25,
      letterSpacing: "-0.025em",
    },
    h2: {
      fontWeight: 700,
      fontSize: "1.875rem",
      lineHeight: 1.3,
      letterSpacing: "-0.02em",
    },
    h3: {
      fontWeight: 600,
      fontSize: "1.5rem",
      lineHeight: 1.35,
      letterSpacing: "-0.015em",
    },
    h4: {
      fontWeight: 600,
      fontSize: "1.25rem",
      lineHeight: 1.4,
    },
    h5: {
      fontWeight: 600,
      fontSize: "1.125rem",
      lineHeight: 1.45,
    },
    h6: {
      fontWeight: 600,
      fontSize: "1rem",
      lineHeight: 1.5,
    },
    body1: {
      fontSize: "0.9375rem",
      lineHeight: 1.6,
      letterSpacing: "0.01em",
    },
    body2: {
      fontSize: "0.875rem",
      lineHeight: 1.55,
      letterSpacing: "0.01em",
    },
    button: {
      fontWeight: 600,
      fontSize: "0.875rem",
      letterSpacing: "0.02em",
      textTransform: "none",
    },
    caption: {
      fontSize: "0.8125rem",
      lineHeight: 1.5,
      letterSpacing: "0.02em",
    },
  },
  shape: {
    borderRadius: 8,
  },
  spacing: 8,
  shadows: [
    "none",
    "0 1px 2px rgba(15, 23, 42, 0.04)",
    "0 2px 4px rgba(15, 23, 42, 0.04), 0 1px 2px rgba(15, 23, 42, 0.03)",
    "0 4px 6px -2px rgba(15, 23, 42, 0.05), 0 2px 4px -2px rgba(15, 23, 42, 0.04)",
    "0 6px 10px -2px rgba(15, 23, 42, 0.06), 0 2px 6px -2px rgba(15, 23, 42, 0.04)",
    "0 8px 12px -4px rgba(15, 23, 42, 0.06), 0 4px 8px -2px rgba(15, 23, 42, 0.04)",
    "0 12px 16px -4px rgba(15, 23, 42, 0.07), 0 4px 8px -2px rgba(15, 23, 42, 0.04)",
    "0 16px 24px -4px rgba(15, 23, 42, 0.08), 0 6px 10px -2px rgba(15, 23, 42, 0.04)",
    "0 20px 28px -4px rgba(15, 23, 42, 0.08), 0 8px 12px -2px rgba(15, 23, 42, 0.05)",
    "0 24px 32px -4px rgba(15, 23, 42, 0.09), 0 10px 14px -2px rgba(15, 23, 42, 0.05)",
    "0 28px 36px -4px rgba(15, 23, 42, 0.1), 0 12px 16px -2px rgba(15, 23, 42, 0.05)",
    "0 32px 40px -4px rgba(15, 23, 42, 0.1), 0 14px 18px -2px rgba(15, 23, 42, 0.05)",
    "0 36px 44px -4px rgba(15, 23, 42, 0.11), 0 16px 20px -2px rgba(15, 23, 42, 0.05)",
    "0 40px 48px -4px rgba(15, 23, 42, 0.11), 0 18px 22px -2px rgba(15, 23, 42, 0.05)",
    "0 44px 52px -4px rgba(15, 23, 42, 0.12), 0 20px 24px -2px rgba(15, 23, 42, 0.06)",
    "0 48px 56px -4px rgba(15, 23, 42, 0.12), 0 22px 26px -2px rgba(15, 23, 42, 0.06)",
    "0 52px 60px -4px rgba(15, 23, 42, 0.13), 0 24px 28px -2px rgba(15, 23, 42, 0.06)",
    "0 56px 64px -4px rgba(15, 23, 42, 0.13), 0 26px 30px -2px rgba(15, 23, 42, 0.06)",
    "0 60px 68px -4px rgba(15, 23, 42, 0.14), 0 28px 32px -2px rgba(15, 23, 42, 0.06)",
    "0 64px 72px -4px rgba(15, 23, 42, 0.14), 0 30px 34px -2px rgba(15, 23, 42, 0.07)",
    "0 68px 76px -4px rgba(15, 23, 42, 0.15), 0 32px 36px -2px rgba(15, 23, 42, 0.07)",
    "0 72px 80px -4px rgba(15, 23, 42, 0.15), 0 34px 38px -2px rgba(15, 23, 42, 0.07)",
    "0 76px 84px -4px rgba(15, 23, 42, 0.16), 0 36px 40px -2px rgba(15, 23, 42, 0.07)",
    "0 80px 88px -4px rgba(15, 23, 42, 0.16), 0 38px 42px -2px rgba(15, 23, 42, 0.08)",
    "0 84px 92px -4px rgba(15, 23, 42, 0.17), 0 40px 44px -2px rgba(15, 23, 42, 0.08)",
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          fontWeight: 600,
          fontSize: "0.875rem",
          padding: "10px 20px",
          boxShadow: "none",
          transition: "background-color 0.18s cubic-bezier(0.22, 1, 0.36, 1), border-color 0.18s ease, box-shadow 0.18s ease, transform 0.1s ease",
          "&:hover": {
            boxShadow: "0 2px 8px rgba(13, 148, 136, 0.2)",
          },
          "&:active": {
            transform: "scale(0.98)",
            boxShadow: "0 1px 4px rgba(13, 148, 136, 0.15)",
          },
          "&.MuiLoadingButton-loading": {
            "& .MuiButton-startIcon, & .MuiButton-endIcon": { opacity: 0.6 },
          },
        },
        contained: {
          "&:hover": {
            boxShadow: "0 4px 12px rgba(13, 148, 136, 0.25)",
          },
        },
        outlined: {
          borderWidth: "1.5px",
          "&:hover": {
            borderWidth: "1.5px",
            backgroundColor: "rgba(13, 148, 136, 0.04)",
          },
        },
        text: {
          "&:hover": {
            backgroundColor: "rgba(13, 148, 136, 0.06)",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          border: "1px solid rgba(15, 23, 42, 0.06)",
        },
        elevation1: {
          boxShadow: "0 2px 4px rgba(15, 23, 42, 0.04), 0 1px 2px rgba(15, 23, 42, 0.03)",
        },
        elevation2: {
          boxShadow: "0 4px 6px -2px rgba(15, 23, 42, 0.05), 0 2px 4px -2px rgba(15, 23, 42, 0.04)",
        },
        elevation3: {
          boxShadow: "0 8px 12px -4px rgba(15, 23, 42, 0.06), 0 4px 8px -2px rgba(15, 23, 42, 0.04)",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          border: "1px solid rgba(15, 23, 42, 0.06)",
          boxShadow: "0 2px 4px rgba(15, 23, 42, 0.04), 0 1px 2px rgba(15, 23, 42, 0.03)",
          transition: "transform 0.2s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.2s ease, border-color 0.2s ease",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0 8px 16px -4px rgba(15, 23, 42, 0.06), 0 4px 8px -2px rgba(15, 23, 42, 0.04)",
            borderColor: "rgba(15, 23, 42, 0.1)",
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: "1px solid rgba(15, 23, 42, 0.06)",
          padding: "12px 16px",
          fontSize: "0.875rem",
        },
        head: {
          fontWeight: 600,
          backgroundColor: "rgba(248, 250, 252, 0.9)",
          color: "#0F172A",
          fontSize: "0.75rem",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          "&:hover": {
            backgroundColor: "rgba(13, 148, 136, 0.03)",
          },
          "&.Mui-selected": {
            backgroundColor: "rgba(13, 148, 136, 0.06)",
            "&:hover": {
              backgroundColor: "rgba(13, 148, 136, 0.09)",
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 500,
          fontSize: "0.75rem",
          height: "26px",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 8,
            transition: "box-shadow 0.2s ease, border-color 0.18s ease",
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#0D9488",
              borderWidth: "1.5px",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#0D9488",
              borderWidth: "2px",
              boxShadow: "0 0 0 3px rgba(13, 148, 136, 0.12)",
            },
            "&.Mui-error.Mui-focused .MuiOutlinedInput-notchedOutline": {
              boxShadow: "0 0 0 3px rgba(220, 38, 38, 0.12)",
            },
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 500,
          fontSize: "0.875rem",
          minHeight: 48,
          transition: "color 0.18s ease",
          "&.Mui-selected": {
            fontWeight: 600,
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          transition: "transform 0.22s cubic-bezier(0.22, 1, 0.36, 1), width 0.22s ease",
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          transition: "background-color 0.18s ease, transform 0.1s ease",
          "&:hover": {
            backgroundColor: "rgba(13, 148, 136, 0.08)",
          },
          "&:active": {
            transform: "scale(0.97)",
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: "0 1px 3px rgba(15, 23, 42, 0.06)",
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: "1px solid rgba(15, 23, 42, 0.06)",
          transition: "transform 0.22s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.22s ease",
        },
      },
    },
    MuiModal: {
      styleOverrides: {
        root: {
          "& .MuiBackdrop-root": {
            transition: "opacity 0.2s ease",
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          transition: "opacity 0.2s ease, transform 0.2s cubic-bezier(0.22, 1, 0.36, 1)",
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          transition: "opacity 0.15s ease, transform 0.15s cubic-bezier(0.22, 1, 0.36, 1)",
        },
      },
    },
    MuiPopover: {
      styleOverrides: {
        paper: {
          transition: "opacity 0.15s ease, transform 0.15s cubic-bezier(0.22, 1, 0.36, 1)",
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          transition: "transform 0.1s ease",
          "&:active .MuiSwitch-thumb": {
            transform: "scale(0.98)",
          },
        },
        switchBase: {
          transition: "transform 0.2s cubic-bezier(0.22, 1, 0.36, 1), left 0.2s cubic-bezier(0.22, 1, 0.36, 1)",
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          transition: "color 0.18s ease, transform 0.1s ease",
          "&:active": {
            transform: "scale(0.95)",
          },
        },
      },
    },
  },
});

// Private Route component
const PrivateRouteComponent = ({ children }) => {
  return <PrivateRoute>{children}</PrivateRoute>;
};

function AppContent() {
  const { loading: authLoading } = useAuth();
  const { loading: userLoading } = useUser();
  const location = useLocation();
  if (authLoading || userLoading) return <FullScreenLogoLoader />;
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: "background.default",
      }}
    >
      <Header />
      <Box component="main" sx={{ flex: 1, py: 3, px: { xs: 2, sm: 3 }, maxWidth: "100%" }}>
        <Box
          key={location.pathname}
          className="motion-page-enter"
          sx={{ width: "100%", minHeight: 0 }}
        >
          <Routes>
                  <Route path="/login" element={<Login />} />

                  <Route path="/dashboard" element={
                    <PrivateRouteComponent>
                      <Dashboard />
                    </PrivateRouteComponent>
                  } />
                  <Route path="/ceo-command" element={
                    <CEOOnlyRoute>
                      <CEOExecutiveDashboard />
                    </CEOOnlyRoute>
                  } />
                  <Route path="/profile" element={
                    <PrivateRouteComponent>
                      <ProfilePage />
                    </PrivateRouteComponent>
                  } />
                  <Route path="/settings" element={
                    <PrivateRouteComponent>
                      <SettingsPage />
                    </PrivateRouteComponent>
                  } />
                  <Route path="/help" element={
                    <PrivateRouteComponent>
                      <HelpPage />
                    </PrivateRouteComponent>
                  } />

                  <Route path="/clients" element={
                    <PrivateRouteComponent>
                      <ClientManager />
                    </PrivateRouteComponent>
                  } />

                  <Route path="/prospects-clients" element={
                    <PrivateRouteComponent>
                      <ProspectsClientManager />
                    </PrivateRouteComponent>
                  } />

                  <Route path="/client-dashboard" element={
                    <PrivateRouteComponent>
                      <ClientDashboard />
                    </PrivateRouteComponent>
                  } />

                  <Route path="/products" element={
                    <PrivateRouteComponent>
                      <ProductManagement />
                    </PrivateRouteComponent>
                  } />

                  <Route path="/client-orders" element={
                    <PrivateRouteComponent>
                      <EnhancedClientOrderTakingSheet />
                    </PrivateRouteComponent>
                  } />

                  <Route path="/po-ingestion" element={
                    <PrivateRouteComponent>
                      <SalesOrderIngestion />
                    </PrivateRouteComponent>
                  } />
                  
                  <Route path="/flow-management" element={
                    <PrivateRouteComponent>
                      <FlowManagement />
                    </PrivateRouteComponent>
                  } />
                  
                  <Route path="/my-tasks" element={
                    <PrivateRouteComponent>
                      <ComingSoon 
                        title="My Tasks"
                        subtitle="Task Management Feature Coming Soon"
                        description="We're building a comprehensive task management system that will help you track and manage all your assigned tasks in one place. This feature will include task prioritization, status tracking, due dates, and much more!"
                        showBackButton={true}
                        showNotifyButton={false}
                      />
                    </PrivateRouteComponent>
                  } />

                  <Route path="/cable-production" element={
                    <PrivateRouteComponent>
                      <Navigate to="/cable-production/dashboard" replace />
                    </PrivateRouteComponent>
                  } />
                  <Route path="/cable-production/dashboard" element={
                    <PrivateRouteComponent>
                      <CableProductionModule />
                    </PrivateRouteComponent>
                  } />
                  <Route path="/cable-production/production-planning" element={
                    <PrivateRouteComponent>
                      <CableProductionModule />
                    </PrivateRouteComponent>
                  } />
                  <Route path="/cable-production/machine-scheduling" element={
                    <PrivateRouteComponent>
                      <CableProductionModule />
                    </PrivateRouteComponent>
                  } />

                  {/* Old Molding Route (kept for backward compatibility) */}
                  <Route path="/molding-production" element={
                    <PrivateRouteComponent>
                      <MoldingProductionModule />
                    </PrivateRouteComponent>
                  } />

                  {/* New Molding Routes Structure */}
                  <Route path="/molding" element={
                    <PrivateRouteComponent>
                      <MoldingMainNavigation />
                    </PrivateRouteComponent>
                  } />

                  <Route path="/molding/dashboard" element={
                    <PrivateRouteComponent>
                      <MoldingDashboardNavigation />
                    </PrivateRouteComponent>
                  } />

                  <Route path="/molding/power-cord-master" element={
                    <PrivateRouteComponent>
                      <PowerCordMasterNavigation />
                    </PrivateRouteComponent>
                  } />

                  <Route path="/molding/production-planning" element={
                    <PrivateRouteComponent>
                      <ProductionPlanningNavigation />
                    </PrivateRouteComponent>
                  } />

                  <Route path="/molding/production-management" element={
                    <PrivateRouteComponent>
                      <ProductionManagementNavigation />
                    </PrivateRouteComponent>
                  } />

                  <Route path="/purchase-flow" element={
                    <PrivateRouteComponent>
                      <StepStatusProvider>
                        <PurchaseFlowLayout />
                      </StepStatusProvider>
                    </PrivateRouteComponent>
                  }>
                    <Route index element={<PurchaseFlow />} />
                    <Route path="raise-indent" element={<RaiseIndent />} />
                    <Route path="approve-indent" element={<ApproveIndent />} />
                    <Route path="float-rfq" element={<FloatRFQ />} />
                    <Route path="followup-quotations" element={<FollowupQuotations />} />
                    <Route path="comparative-statement" element={<ComparativeStatement />} />
                    <Route path="approve-quotation" element={<ApproveQuotation />} />
                    <Route path="request-sample" element={<RequestSample />} />
                    <Route path="inspect-sample" element={<InspectSample />} />
                    <Route path="place-po" element={<PlacePO />} />
                    <Route path="followup-delivery" element={<FollowupDelivery />} />
                    <Route path="recieve-inspect-material" element={<RecieveAndInspectMaterial />} />
                    <Route path="material-approval" element={<MaterialApproval />} />
                    <Route path="decision-on-rejection" element={<DecisionOnRejection />} />
                    <Route path="return-rejected-material" element={<ReturnRejectedMaterial />} />
                    <Route path="resend-material" element={<ResendMaterial />} />
                    <Route path="generate-grn" element={<GenerateGRN />} />
                    <Route path="final-grn" element={<FinalGRN />} />
                    <Route path="submit-invoice" element={<SubmitInvoice />} />
                    <Route path="schedule-payment" element={<SchedulePayment />} />
                    <Route path="release-payment" element={<ReleasePayment />} />
                    <Route path="sort-vendors" element={<SortVendors />} />
                  </Route>

                  <Route
                    path="/vendor-management"
                    element={
                      <PrivateRouteComponent>
                        <VendorManagement />
                      </PrivateRouteComponent>
                    }
                  />

                  <Route
                    path="/inventory"
                    element={
                      <PrivateRouteComponent>
                        <InventoryMainNavigation />
                      </PrivateRouteComponent>
                    } />

                  {/* Separate Inventory Module Routes */}
                  <Route
                    path="/inventory/stock-sheet"
                    element={
                      <PrivateRouteComponent>
                        <StockSheetNavigation />
                      </PrivateRouteComponent>
                    } />

                  <Route
                    path="/inventory/stock-sheet/material-inward"
                    element={
                      <PrivateRouteComponent>
                        <MaterialInwardNavigation />
                      </PrivateRouteComponent>
                    } />

                  <Route
                    path="/inventory/stock-sheet/material-outward"
                    element={
                      <PrivateRouteComponent>
                        <MaterialIssueNavigation />
                      </PrivateRouteComponent>
                    } />

                  <Route
                    path="/inventory/stock-sheet/fg-material-inward"
                    element={
                      <PrivateRouteComponent>
                        <FGMaterialInwardNavigation />
                      </PrivateRouteComponent>
                    } />

                  <Route
                    path="/inventory/stock-sheet/fg-material-outward"
                    element={
                      <PrivateRouteComponent>
                        <FGMaterialOutwardNavigation />
                      </PrivateRouteComponent>
                    } />

                  <Route
                    path="/inventory/finished-goods"
                    element={
                      <PrivateRouteComponent>
                        <FinishedGoodsNavigation />
                      </PrivateRouteComponent>
                    } />

                  <Route
                    path="/inventory/bill-of-materials"
                    element={
                      <PrivateRouteComponent>
                        <BillOfMaterialsNavigation />
                      </PrivateRouteComponent>
                    } />

                  <Route
                    path="/inventory/bill-of-materials/kitting-sheet"
                    element={
                      <PrivateRouteComponent>
                        <KittingSheetNavigation />
                      </PrivateRouteComponent>
                    } />

                  <Route
                    path="/inventory/kitting-sheet"
                    element={
                      <PrivateRouteComponent>
                        <KittingSheetNavigation />
                      </PrivateRouteComponent>
                    } />

                  <Route
                    path="/inventory/fg-to-billing"
                    element={
                      <PrivateRouteComponent>
                        <FGToBilling />
                      </PrivateRouteComponent>
                    } />

                  {/* Legacy Inventory Route (for backward compatibility) */}
                  <Route
                    path="/inventory/legacy"
                    element={
                      <PrivateRouteComponent>
                        <Inventory />
                      </PrivateRouteComponent>
                    } />

                  {/* Sales Flow Routes */}
                  <Route path="/sales-flow" element={
                    <PrivateRouteComponent>
                      <SalesFlowLayout />
                    </PrivateRouteComponent>
                  }>
                    <Route index element={<SalesFlow />} />
                    <Route path="log-and-qualify-leads" element={<LogAndQualifyLeads />} />
                    <Route path="initial-call" element={<InitialCallAndRequirementGathering />} />
                    <Route path="evaluate-high-value-prospects" element={<EvaluateHighValueProspects />} />
                    <Route path="check-feasibility" element={<CheckFeasibility />} />
                    <Route path="confirm-standards" element={<StandardsAndCompliance />} />
                    <Route path="send-quotation" element={<SendQuotation />} />
                    <Route path="approve-payment-terms" element={<ApprovePaymentTerms />} />
                    <Route path="sample-submission" element={<SampleSubmission />} />
                    <Route path="get-approval-for-sample" element={<GetApprovalForSample />} />
                    <Route path="approve-strategic-deals" element={<ApproveStrategicDeals />} />
                    <Route path="order-booking" element={
                      <Box sx={{ p: 3, textAlign: 'center' }}>
                        <Typography variant="h4">Order Booking</Typography>
                        <Typography variant="body1" sx={{ mt: 2 }}>This step is under development.</Typography>
                      </Box>
                    } />
                    <Route path="details" element={<SalesFlowDetails />} />
                    {/* Legacy routes for backward compatibility */}
                    <Route path="create-lead" element={<LogAndQualifyLeads />} />
                  </Route>
                  
                  <Route path="/sales-flow/plan-manufacturing" element={
                    <PrivateRouteComponent>
                      <Box sx={{ p: 3, textAlign: 'center' }}>
                        <Typography variant="h4">Plan & Execute Manufacturing</Typography>
                        <Typography variant="body1" sx={{ mt: 2 }}>This step is under development.</Typography>
                      </Box>
                    </PrivateRouteComponent>
                  } />
                  
                  <Route path="/sales-flow/pack-dispatch" element={
                    <PrivateRouteComponent>
                      <Box sx={{ p: 3, textAlign: 'center' }}>
                        <Typography variant="h4">Pack & Dispatch Material</Typography>
                        <Typography variant="body1" sx={{ mt: 2 }}>This step is under development.</Typography>
                      </Box>
                    </PrivateRouteComponent>
                  } />
                  
                  <Route path="/sales-flow/generate-invoice" element={
                    <PrivateRouteComponent>
                      <Box sx={{ p: 3, textAlign: 'center' }}>
                        <Typography variant="h4">Generate Invoice</Typography>
                        <Typography variant="body1" sx={{ mt: 2 }}>This step is under development.</Typography>
                      </Box>
                    </PrivateRouteComponent>
                  } />
                  
                  <Route path="/sales-flow/update-client" element={
                    <PrivateRouteComponent>
                      <Box sx={{ p: 3, textAlign: 'center' }}>
                        <Typography variant="h4">Update Client on Dispatch</Typography>
                        <Typography variant="body1" sx={{ mt: 2 }}>This step is under development.</Typography>
                      </Box>
                    </PrivateRouteComponent>
                  } />
                  
                  <Route path="/sales-flow/follow-up-feedback" element={
                    <PrivateRouteComponent>
                      <Box sx={{ p: 3, textAlign: 'center' }}>
                        <Typography variant="h4">Follow up for Feedback & Repeat Order</Typography>
                        <Typography variant="body1" sx={{ mt: 2 }}>This step is under development.</Typography>
                      </Box>
                    </PrivateRouteComponent>
                  } />
                  
                  <Route path="/sales-flow/follow-up-payment" element={
                    <PrivateRouteComponent>
                      <Box sx={{ p: 3, textAlign: 'center' }}>
                        <Typography variant="h4">Follow-up on Balance Payment</Typography>
                        <Typography variant="body1" sx={{ mt: 2 }}>This step is under development.</Typography>
                      </Box>
                    </PrivateRouteComponent>
                  } />
                  
                  <Route path="/sales-flow/view-details" element={
                    <PrivateRouteComponent>
                      <Box sx={{ p: 3, textAlign: 'center' }}>
                        <Typography variant="h4">Sales Flow Details</Typography>
                        <Typography variant="body1" sx={{ mt: 2 }}>This view is under development.</Typography>
                      </Box>
                    </PrivateRouteComponent>
                  } />

                  <Route
                    path="/setup-sheets"
                    element={
                      <PrivateRouteComponent>
                        <Box sx={{ maxWidth: 1200, mx: "auto", px: 2 }}>
                          <Typography variant="h4" sx={{ mb: 3 }}>
                            Database Setup
                          </Typography>
                          <SheetInitializer />
                        </Box>
                      </PrivateRouteComponent>
                    }
                  />

                  <Route
                    path="/troubleshoot-sheets"
                    element={
                      <PrivateRouteComponent>
                        <Box sx={{ maxWidth: 1200, mx: "auto", px: 2 }}>
                          <Typography variant="h4" sx={{ mb: 3 }}>
                            Troubleshoot connection
                          </Typography>
                          <SheetsTroubleshooting />
                        </Box>
                      </PrivateRouteComponent>
                    }
                  />

                  {config.useLocalStorage && (
                    <Route
                      path="/storage-debug"
                      element={
                        <PrivateRouteComponent>
                          <Box sx={{ maxWidth: 1200, mx: "auto", px: 2 }}>
                            <Typography variant="h4" sx={{ mb: 3 }}>
                              Document Storage Debugger
                            </Typography>
                            <StorageDebugger />
                          </Box>
                        </PrivateRouteComponent>
                      }
                    />
                  )}

                  <Route
                    path="/dispatch"
                    element={
                      <PrivateRouteComponent>
                        <DispatchForm />
                      </PrivateRouteComponent>
                    }
                  />

                  <Route
                    path="/dispatch-management"
                    element={
                      <PrivateRouteComponent>
                        <DispatchManagement />
                      </PrivateRouteComponent>
                    }
                  />

                  <Route
                    path="/dispatch-test"
                    element={
                      <PrivateRouteComponent>
                        <DispatchTest />
                      </PrivateRouteComponent>
                    }
                  />

                  <Route
                    path="/costing"
                    element={
                      <PrivateRouteComponent>
                        <Costing />
                      </PrivateRouteComponent>
                    }
                  />

                  <Route
                    path="/client-dashboard"
                    element={
                      <PrivateRouteComponent>
                        <ClientDashboard />
                      </PrivateRouteComponent>
                    }
                  />

                  <Route
                    path="/employee-dashboard"
                    element={
                      <PrivateRouteComponent>
                        <AdvancedEmployeeDashboard />
                      </PrivateRouteComponent>
                    }
                  />

                  <Route
                    path="/document-library"
                    element={
                      <PrivateRouteComponent>
                        <DocumentLibrary />
                      </PrivateRouteComponent>
                    }
                  />

                  <Route
                    path="/crm"
                    element={
                      <PrivateRouteComponent>
                        <CRMManagement />
                      </PrivateRouteComponent>
                    }
                  />

                  <Route path="/" element={<Navigate to="/login" replace />} />
                  <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
        </Box>
              </Box>
              <Box
                component="footer"
                sx={{
                  py: 2.5,
                  px: 3,
                  mt: "auto",
                  backgroundColor: "grey.100",
                  borderTop: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Typography variant="body2" color="text.secondary" align="center" sx={{ letterSpacing: "0.02em" }}>
                  Reyansh Factory Operations Monitoring System &copy;{" "}
                  {new Date().getFullYear()}
                </Typography>
              </Box>
            </Box>
  );
}

function GlobalErrorToaster({ children }) {
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: "",
    severity: "error",
  });
  React.useEffect(() => {
    setGlobalErrorNotifier((message, severity) => {
      setSnackbar({ open: true, message, severity: severity || "error" });
    });
    return () => setGlobalErrorNotifier(null);
  }, []);
  const handleClose = () => setSnackbar((s) => ({ ...s, open: false }));
  return (
    <>
      {children}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleClose} severity={snackbar.severity} variant="filled" sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalErrorToaster>
        <AuthProvider>
          <UserProvider>
            <StepStatusProvider>
              <BrowserRouter>
                <AppContent />
              </BrowserRouter>
            </StepStatusProvider>
          </UserProvider>
        </AuthProvider>
      </GlobalErrorToaster>
    </ThemeProvider>
  );
}

export default App;
