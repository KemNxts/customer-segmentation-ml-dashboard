import { useState } from 'react';
import axios from 'axios';
import { Play, TrendingUp, AlertTriangle, Target } from 'lucide-react';

export default function ModelTest() {
  const [formData, setFormData] = useState({
    Recency: 15,
    Frequency: 5,
    Monetary: 1200,
    AvgOrderValue: 240,
    PurchaseFreqPerMonth: 1.2
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: parseFloat(e.target.value) || 0
    });
  };

  const handlePredict = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await axios.post('http://localhost:8001/predict/manual', formData);
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Prediction service error. Backend must have /predict/manual enabled.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 grid grid-cols-1 xl:grid-cols-2 gap-6">
      
      {/* INPUT FORM SECTION */}
      <div className="h-full">
        <form onSubmit={handlePredict} className="glass-card space-y-6 relative overflow-hidden h-full flex flex-col justify-between">
          <h2 className="text-xl font-bold text-white">Manual Prediction Engine</h2>
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full blur-2xl pointer-events-none"></div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-textMuted mb-2">Recency (Days)</label>
              <input type="number" name="Recency" value={formData.Recency} onChange={handleChange} className="input-field w-full" required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-textMuted mb-2">Frequency (Count)</label>
              <input type="number" name="Frequency" value={formData.Frequency} onChange={handleChange} className="input-field w-full" required />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-semibold text-textMuted mb-2">Monetary Value ($)</label>
              <input type="number" name="Monetary" value={formData.Monetary} onChange={handleChange} className="input-field w-full" required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-textMuted mb-2">Avg Order Value</label>
              <input type="number" name="AvgOrderValue" value={formData.AvgOrderValue} onChange={handleChange} step="0.01" className="input-field w-full" required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-textMuted mb-2">Purchases/Month</label>
              <input type="number" name="PurchaseFreqPerMonth" value={formData.PurchaseFreqPerMonth} onChange={handleChange} step="0.1" className="input-field w-full" required />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full py-3 flex justify-center items-center font-bold text-lg mt-4">
            {loading ? (
               <div className="w-6 h-6 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
            ) : (
               <>Run Model / Predict <Play className="ml-2 w-5 h-5 fill-current" /></>
            )}
          </button>
          
          {error && <div className="text-red-400 bg-red-400/10 p-4 rounded-lg text-sm font-medium border border-red-500/20">{error}</div>}
        </form>
      </div>

      {/* RESULTS DISPLAY SECTION */}
      <div className="h-full">
        {result ? (
          <div className="space-y-6 animate-in slide-in-from-right-8 duration-500">
            <div className={`glass-card border-t-4 shadow-xl ${result.predicted_purchase ? 'border-t-green-500 shadow-green-500/10' : 'border-t-red-500 shadow-red-500/10'}`}>
              <div className="flex items-center justify-between mb-4">
                <span className="text-textMuted font-bold uppercase tracking-widest text-sm">Prediction</span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${result.predicted_purchase ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                   PROBABILITY: {(result.probability * 100).toFixed(1)}%
                </span>
              </div>
              <div className="flex items-center">
                {result.predicted_purchase ? (
                  <TrendingUp className="w-10 h-10 text-green-500 mr-4" />
                ) : (
                  <AlertTriangle className="w-10 h-10 text-orange-500 mr-4" />
                )}
                <span className="text-2xl font-black text-white">
                  {result.predicted_purchase ? 'Expected to buy in 30 days' : 'High Flight Risk'}
                </span>
              </div>
            </div>

            <div className="glass-card">
               <h3 className="text-textMuted font-bold uppercase tracking-widest text-sm mb-4">Audience Segmentation</h3>
               <div className="bg-surfaceLight/50 p-4 rounded-xl border border-white/5 flex items-center justify-between">
                  <div>
                    <p className="text-xl font-bold text-white">{result.segment}</p>
                    <p className="text-sm text-textMuted">K-Means Cluster Assignment</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-primary-600/20 border-2 border-primary-500/50 flex items-center justify-center">
                     <span className="text-primary-400 font-bold">C{result.cluster}</span>
                  </div>
               </div>
            </div>
            
            <div className="glass-card bg-blue-500/5 border-l-4 border-l-blue-500">
               <h3 className="text-blue-400 font-bold mb-2">Recommended Strategy</h3>
               <p className="text-white font-medium text-lg mb-4">{result.recommendations.strategy}</p>
               <ul className="list-disc pl-5 text-sm text-textMuted space-y-1">
                 {result.recommendations.offers.map((o, i) => <li key={i}>{o}</li>)}
               </ul>
            </div>
          </div>
        ) : (
          <div className="glass-card h-80 flex flex-col items-center justify-center text-center opacity-50 border-dashed border-2">
            <Target className="w-16 h-16 text-textMuted mb-4 opacity-50" />
            <p className="text-xl font-bold text-textMuted">Awaiting Input</p>
            <p className="text-sm text-textMuted mt-2">Adjust feature parameters and hit Run Model</p>
          </div>
        )}
      </div>

    </div>
  );
}
