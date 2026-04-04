import { Routes, Route } from "react-router-dom";
import Overview from "./pages/Overview";
import CustomerDetail from "./pages/CustomerDetail";
import ModelComparison from "./pages/ModelComparison";
import Analytics from "./pages/analytics";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Overview />} />
      <Route path="/customers" element={<CustomerDetail />} />
      <Route path="/models" element={<ModelComparison />} />
      <Route path="/analytics" element={<Analytics />} />
    </Routes>
  );
}

export default App;