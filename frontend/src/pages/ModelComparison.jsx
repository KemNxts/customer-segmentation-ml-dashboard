import { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function ModelComparison() {
  const [data, setData] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:8001/model-metrics')
      .then((res) => setData(res.data))
      .catch((err) => console.error(err));
  }, []);

  if (!data) return (
    <div className="flex items-center justify-center p-10">
      <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  const modelsArray = Object.entries(data).map(([name, metrics]) => ({
    name,
    accuracy: (metrics.accuracy * 100).toFixed(2),
    precision: (metrics.precision * 100).toFixed(2),
    recall: (metrics.recall * 100).toFixed(2),
    f1: (metrics.f1_score * 100).toFixed(2),
    rawImportance: metrics.feature_importance || {}
  }));

  const bestModelIndex = modelsArray.reduce((bestIdx, current, idx) => 
    parseFloat(current.f1) > parseFloat(modelsArray[bestIdx].f1) ? idx : bestIdx, 0);

  const bestModel = modelsArray[bestModelIndex];
  
  const featureImp = Object.entries(bestModel.rawImportance)
    .map(([feat, val]) => ({ name: feat, value: val }))
    .sort((a,b) => b.value - a.value);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
      <div className="overflow-x-auto w-full">
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
        <div className="h-64 w-full pl-6 border-l border-white/5">
          <h3 className="text-sm font-bold text-textMuted mb-4">Feature Importance ({bestModel.name})</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={featureImp} layout="vertical" margin={{ left: -20, right: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
              <XAxis type="number" stroke="#94a3b8" fontSize={12} />
              <YAxis dataKey="name" type="category" stroke="#94a3b8" width={100} tick={{fill: '#e2e8f0', fontSize: 11}} />
              <Tooltip cursor={{fill: '#334155', opacity: 0.4}} contentStyle={{backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', color: '#fff'}} />
              <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={16} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}