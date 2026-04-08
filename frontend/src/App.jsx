import Overview from "./pages/Overview";
import CustomerDetail from "./pages/CustomerDetail";
import ModelComparison from "./pages/ModelComparison";
import ModelTest from "./pages/ModelTest";
import Navbar from "./layouts/Navbar";

function App() {
  return (
    <div className="min-h-screen bg-background text-text flex flex-col font-sans relative overflow-x-hidden">
      {/* Background aesthetics */}
      <div className="absolute top-0 left-0 w-full h-96 bg-primary-900/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>

      <Navbar />

      <main className="flex-1 p-4 md:p-6 w-full max-w-[1800px] mx-auto relative z-10 flex flex-col gap-6">
        
        {/* Top Stats Banner */}
        <div className="w-full">
          <Overview />
        </div>

        {/* Middle split: ML Form + Results */}
        <div className="w-full">
          <ModelTest />
        </div>

        {/* Bottom span: Model Comparison Table */}
        <div className="w-full">
          <div className="glass-card p-6">
            <h2 className="text-xl font-bold text-white mb-4">Model Performance Metrics</h2>
            <ModelComparison />
          </div>
        </div>

      </main>
    </div>
  );
}

export default App;