import { Routes, Route } from "react-router-dom";
import Overview from "./pages/Overview";
import CustomerDetail from "./pages/CustomerDetail";
import ModelComparison from "./pages/ModelComparison";
import Analytics from "./pages/analytics";
import LandingPage from "./pages/LandingPage";
import DashboardLayout from "./layouts/DashboardLayout";

function App() {
  return (
    <Routes>

      {/* Landing Page */}
      <Route path="/" element={<LandingPage />} />

      {/* Dashboard Pages */}
      <Route
        path="/dashboard"
        element={
          <DashboardLayout>
            <Overview />
          </DashboardLayout>
        }
      />

      <Route
        path="/customers"
        element={
          <DashboardLayout>
            <CustomerDetail />
          </DashboardLayout>
        }
      />

      <Route
        path="/models"
        element={
          <DashboardLayout>
            <ModelComparison />
          </DashboardLayout>
        }
      />

      <Route
        path="/analytics"
        element={
          <DashboardLayout>
            <Analytics />
          </DashboardLayout>
        }
      />

    </Routes>
  );
}

export default App;