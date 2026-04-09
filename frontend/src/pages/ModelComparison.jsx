import { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { RefreshCw, CheckCircle, AlertCircle, TrendingUp, TrendingDown } from 'lucide-react';

export default function ModelComparison() {
  const [data, setData] = useState(null);
  const [retraining, setRetraining] = useState(false);
  const [retrainResult, setRetrainResult] = useState({ state: 'idle', oldMetrics: null, newMetrics: null, error: '' });

  const fetchMetrics = () => {
    axios.get('http://localhost:8001/model-metrics')
      .then((res) => setData(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  const handleRetrain = async () => {
    setRetraining(true);
    setRetrainResult({ state: 'processing', oldMetrics: null, newMetrics: null, error: '' });
    
    try {
      const res = await axios.post('http://localhost:8001/retrain');
      const { metrics, old_metrics, status } = res.data;
      if (status === 'success') {
         setRetrainResult({ state: 'success', oldMetrics: old_metrics, newMetrics: metrics, error: '' });
         setData(metrics); // instantly update the table with new data payload
      } else {
         throw new Error("Backend reported failure");
      }
    } catch {
      setRetrainResult({ state: 'error', oldMetrics: null, newMetrics: null, error: "Retraining failed. Please try again." });
    } finally {
      setRetraining(false);
    }
  };

  if (!data && !retraining && retrainResult.state !== 'processing') return (
    <div className="flex items-center justify-center p-10">
      <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  const modelsArray = data ? Object.entries(data).map(([name, metrics]) => ({
    name,
    accuracy: (metrics.accuracy * 100).toFixed(2),
    precision: (metrics.precision * 100).toFixed(2),
    recall: (metrics.recall * 100).toFixed(2),
    f1: (metrics.f1_score * 100).toFixed(2),
    rawImportance: metrics.feature_importance || {}
  })) : [];

  const bestModelIndex = modelsArray.length > 0 ? modelsArray.reduce((bestIdx, current, idx) => 
    parseFloat(current.f1) > parseFloat(modelsArray[bestIdx].f1) ? idx : bestIdx, 0) : 0;

  const bestModel = modelsArray[bestModelIndex] || null;
  
  const featureImp = bestModel ? Object.entries(bestModel.rawImportance)
    .map(([feat, val]) => ({ name: feat, value: val }))
    .sort((a,b) => b.value - a.value) : [];

  const getDeltaIndicator = (oldScore, newScore) => {
      const delta = newScore - oldScore;
      if (Math.abs(delta) < 0.001) return <span className="text-gray-400 text-xs ml-2"> (0.00%)</span>;
      if (delta > 0) return <span className="text-emerald-400 text-xs font-bold ml-2 flex items-center"><TrendingUp className="w-3 h-3 mr-0.5 inline"/>+{(delta*100).toFixed(2)}%</span>;
      return <span className="text-rose-400 text-xs font-bold ml-2 flex items-center"><TrendingDown className="w-3 h-3 mr-0.5 inline"/>{(delta*100).toFixed(2)}%</span>;
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col gap-6 w-full">
      
      {/* HEADER & RETRAIN BUTTON */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5 shadow-lg backdrop-blur-sm">
         <div>
            <h2 className="text-xl font-bold text-white">Model Metrics & Evaluation</h2>
            <p className="text-sm text-textMuted">Compare algorithm efficiency across standard classification metrics.</p>
         </div>
         <button 
           onClick={handleRetrain} 
           disabled={retraining} 
           className="btn-primary flex items-center py-2 px-5 text-sm whitespace-nowrap disabled:opacity-50 transition-all duration-300"
         >
           {retraining ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Training model...
              </>
           ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Retrain Model
              </>
           )}
         </button>
      </div>

      {/* RETRAIN RESULT MESSAGE */}
      {retrainResult.state === 'success' && (
         <div className="glass-card bg-emerald-500/10 border-emerald-500/30 flex items-start p-4 animate-in fade-in slide-in-from-top-2">
            <CheckCircle className="w-6 h-6 text-emerald-500 mr-3 flex-shrink-0 mt-0.5" />
            <div className="flex flex-col w-full">
               <span className="text-emerald-400 font-bold mb-1">Model retrained successfully</span>
               {bestModel && retrainResult.oldMetrics && retrainResult.oldMetrics[bestModel.name] && (
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3 bg-white/5 p-3 rounded-xl border border-white/5">
                   <div>
                     <p className="text-xs text-textMuted uppercase font-bold">Accuracy</p>
                     <p className="text-sm text-white flex items-center">{bestModel.accuracy}% {getDeltaIndicator(retrainResult.oldMetrics[bestModel.name].accuracy, retrainResult.newMetrics[bestModel.name].accuracy)}</p>
                   </div>
                   <div>
                     <p className="text-xs text-textMuted uppercase font-bold">Precision</p>
                     <p className="text-sm text-white flex items-center">{bestModel.precision}% {getDeltaIndicator(retrainResult.oldMetrics[bestModel.name].precision, retrainResult.newMetrics[bestModel.name].precision)}</p>
                   </div>
                   <div>
                     <p className="text-xs text-textMuted uppercase font-bold">Recall</p>
                     <p className="text-sm text-white flex items-center">{bestModel.recall}% {getDeltaIndicator(retrainResult.oldMetrics[bestModel.name].recall, retrainResult.newMetrics[bestModel.name].recall)}</p>
                   </div>
                   <div>
                     <p className="text-xs text-primary-400 uppercase font-bold">F1 Score</p>
                     <p className="text-sm text-primary-300 flex items-center">{bestModel.f1}% {getDeltaIndicator(retrainResult.oldMetrics[bestModel.name].f1_score, retrainResult.newMetrics[bestModel.name].f1_score)}</p>
                   </div>
                 </div>
               )}
            </div>
         </div>
      )}

      {retrainResult.state === 'error' && (
         <div className="glass-card bg-rose-500/10 border-rose-500/30 flex items-center p-4 animate-in fade-in">
            <AlertCircle className="w-6 h-6 text-rose-500 mr-3" />
            <span className="text-rose-400 font-bold">{retrainResult.error}</span>
         </div>
      )}

      {/* METRICS & CHARTS SPLIT */}
      {modelsArray.length > 0 && (
         <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 w-full">
            <div className="overflow-x-auto w-full glass-card h-full">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-textMuted uppercase text-xs tracking-wider">
                    <th className="p-3">Model</th>
                    <th className="p-3">Acc (%)</th>
                    <th className="p-3">Prec (%)</th>
                    <th className="p-3">Rec (%)</th>
                    <th className="p-3 text-primary-400 font-bold">F1 (%)</th>
                  </tr>
                </thead>
                <tbody>
                  {modelsArray.map((model, idx) => (
                    <tr key={model.name} className={`border-b border-white/5 transition-colors hover:bg-white/5 ${idx === bestModelIndex ? 'bg-primary-900/10' : ''}`}>
                      <td className="p-3 font-medium flex items-center space-x-2">
                        {idx === bestModelIndex && <span className="w-2 h-2 rounded-full bg-primary-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]"></span>}
                        <span className="text-white text-sm">{model.name}</span>
                      </td>
                      <td className="p-3 text-sm">{model.accuracy}</td>
                      <td className="p-3 text-sm">{model.precision}</td>
                      <td className="p-3 text-sm">{model.recall}</td>
                      <td className="p-3 text-sm font-bold text-primary-400">{model.f1}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {featureImp.length > 0 && (
              <div className="glass-card w-full min-h-[350px] flex flex-col">
                <h3 className="text-lg font-bold text-white mb-6">Feature Importance ({bestModel.name})</h3>
                <div className="flex-grow">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={featureImp} layout="vertical" margin={{ left: -20, right: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                    <XAxis type="number" stroke="#94a3b8" fontSize={12} />
                    <YAxis dataKey="name" type="category" stroke="#94a3b8" width={100} tick={{fill: '#e2e8f0', fontSize: 11}} />
                    <Tooltip cursor={{fill: '#334155', opacity: 0.4}} contentStyle={{backgroundColor: 'rgba(30, 41, 59, 0.9)', backdropFilter: 'blur(8px)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff'}} />
                    <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={16} isAnimationActive={true} animationDuration={1000} animationEasing="ease-out" />
                  </BarChart>
                </ResponsiveContainer>
                </div>
              </div>
            )}
         </div>
      )}
    </div>
  );
}