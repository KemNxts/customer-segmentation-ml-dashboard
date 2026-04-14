import { useState } from 'react';
import axios from 'axios';
import { Play, TrendingUp, AlertTriangle, Target, Lightbulb, Loader2, CheckCircle } from 'lucide-react';

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
  const [showSuccessMsg, setShowSuccessMsg] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Allow empty or digits+decimals only to prevent special characters pasting
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const blockInvalidChars = (e) => {
    // Prevent typing exponents, signs, and other invalid characters entirely
    if (['e', 'E', '+', '-'].includes(e.key)) {
      e.preventDefault();
    }
  };

  const handlePredict = async (e) => {
    e.preventDefault();
    
    // Strict > 0 Validation
    for (const [key, val] of Object.entries(formData)) {
      const num = parseFloat(val);
      if (isNaN(num) || num <= 0) {
        setError(`Please enter a valid number greater than 0 for ${key.replace(/([A-Z])/g, ' $1').trim()}.`);
        return;
      }
    }

    setLoading(true);
    setError('');
    setResult(null);

    const payload = {
      Recency: parseFloat(formData.Recency),
      Frequency: parseFloat(formData.Frequency),
      Monetary: parseFloat(formData.Monetary),
      AvgOrderValue: parseFloat(formData.AvgOrderValue),
      PurchaseFreqPerMonth: parseFloat(formData.PurchaseFreqPerMonth)
    };

    try {
      const res = await axios.post('http://localhost:8001/predict/manual', payload);
      setResult(res.data);
      setShowSuccessMsg(true);
      setTimeout(() => setShowSuccessMsg(false), 3000);
    } catch {
      setError("Failed to fetch prediction");
    } finally {
      setLoading(false);
    }
  };

  const generateInsights = (data) => {
    const activeInsights = [];
    const recency = parseFloat(data.Recency) || 0;
    const frequency = parseFloat(data.Frequency) || 0;
    const monetary = parseFloat(data.Monetary) || 0;
    
    if (recency > 0 && recency < 10 && frequency > 5) activeInsights.push("Highly engaged customer. Strong upsell opportunity detected.");
    if (frequency > 0 && frequency < 2 && monetary > 500) activeInsights.push("High-value but inactive user. Re-engagement recommended.");
    if (recency > 60) activeInsights.push("Customer inactive for long period. High churn probability.");
    if (monetary > 0 && monetary < 100) activeInsights.push("Low spending customer. Consider promotional targeting.");
    return activeInsights;
  };

  const currentInsights = generateInsights(formData);

  const getCustomerTypeInfo = (prob) => {
    if (prob >= 0.65) return { type: 'High Value', textClass: 'text-emerald-500', bgClass: 'bg-emerald-500/20', borderClass: 'border-t-emerald-500', shadowClass: 'shadow-[0_0_30px_rgba(16,185,129,0.15)]', riskLevel: 'Low', icon: <TrendingUp className="w-10 h-10 text-emerald-500 mr-4" /> };
    if (prob >= 0.35) return { type: 'Medium Value', textClass: 'text-amber-500', bgClass: 'bg-amber-500/20', borderClass: 'border-t-amber-500', shadowClass: 'shadow-[0_0_30px_rgba(245,158,11,0.15)]', riskLevel: 'Medium', icon: <Target className="w-10 h-10 text-amber-500 mr-4" /> };
    return { type: 'Churn Risk', textClass: 'text-rose-500', bgClass: 'bg-rose-500/20', borderClass: 'border-t-rose-500', shadowClass: 'shadow-[0_0_30px_rgba(244,63,94,0.15)]', riskLevel: 'High', icon: <AlertTriangle className="w-10 h-10 text-rose-500 mr-4" /> };
  };

  const resultInfo = result ? getCustomerTypeInfo(result.probability) : null;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 grid grid-cols-1 xl:grid-cols-2 gap-6">
      
      {/* INPUT FORM SECTION */}
      <div className="flex flex-col gap-6">
        <form onSubmit={handlePredict} className="glass-card space-y-6 relative overflow-hidden flex flex-col">
          <h2 className="text-xl font-bold text-white">Manual Prediction Engine</h2>
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full blur-2xl pointer-events-none"></div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-textMuted mb-2">Recency (Days)</label>
              <input type="number" name="Recency" value={formData.Recency} onChange={handleChange} onKeyDown={blockInvalidChars} min="1" step="1" className="input-field w-full" required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-textMuted mb-2">Frequency (Count)</label>
              <input type="number" name="Frequency" value={formData.Frequency} onChange={handleChange} onKeyDown={blockInvalidChars} min="1" step="1" className="input-field w-full" required />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-semibold text-textMuted mb-2">Monetary Value ($)</label>
              <input type="number" name="Monetary" value={formData.Monetary} onChange={handleChange} onKeyDown={blockInvalidChars} min="0.01" step="0.01" className="input-field w-full" required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-textMuted mb-2">Avg Order Value</label>
              <input type="number" name="AvgOrderValue" value={formData.AvgOrderValue} onChange={handleChange} onKeyDown={blockInvalidChars} min="0.01" step="0.01" className="input-field w-full" required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-textMuted mb-2">Purchases/Month</label>
              <input type="number" name="PurchaseFreqPerMonth" value={formData.PurchaseFreqPerMonth} onChange={handleChange} onKeyDown={blockInvalidChars} min="0.01" step="0.01" className="input-field w-full" required />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full flex justify-center items-center mt-4">
            {loading ? (
               <>
                 <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                 Processing Prediction...
               </>
            ) : (
               <>Run Model / Predict <Play className="ml-2 w-5 h-5 fill-current" /></>
            )}
          </button>
          
          {error && <div className="text-rose-400 bg-rose-500/10 p-4 rounded-lg text-sm font-bold border border-rose-500/20 text-center">{error}</div>}
        </form>

        {/* DUAL-STATE SMART INSIGHTS */}
        <div className="glass-card border-l-4 border-l-blue-400">
           <h3 className="text-white font-bold mb-3 flex items-center">
             <Lightbulb className="w-5 h-5 text-blue-400 mr-2" />
             Smart Insights
           </h3>
           <div className="space-y-2">
             {currentInsights.length > 0 ? (
               currentInsights.map((insight, idx) => (
                 <p key={idx} className="text-sm text-textMuted bg-white/5 p-3 rounded-lg border border-white/5 font-medium leading-relaxed">
                   {insight}
                 </p>
               ))
             ) : (
               <p className="text-sm text-textMuted p-3">Adjust inputs to generate real-time customer behavior insights.</p>
             )}
           </div>
        </div>
      </div>

      {/* RESULTS DISPLAY SECTION */}
      <div className="h-full flex flex-col relative tracking-wide">
        {showSuccessMsg && (
            <div className="absolute top-0 right-0 z-10 animate-in fade-in slide-in-from-top-4 duration-300">
              <span className="bg-emerald-500/90 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center shadow-lg backdrop-blur-md">
                 <CheckCircle className="w-3.5 h-3.5 mr-1" /> Model analysis complete
              </span>
            </div>
        )}

        {result ? (
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500 h-full flex flex-col pt-2">
            <div className={`glass-card border-t-4 ${resultInfo.borderClass} ${resultInfo.shadowClass}`}>
              <div className="flex flex-col space-y-4">
                <div className="flex items-center">
                  {resultInfo.icon}
                  <div className="flex flex-col">
                    <span className="text-textMuted uppercase tracking-widest text-xs font-bold mb-1">Customer Type</span>
                    <span className="text-3xl font-black text-white leading-none">
                      {resultInfo.type}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-start space-x-4 pt-2">
                  <span className={`px-4 py-1.5 rounded-full text-sm font-bold border border-white/5 ${resultInfo.bgClass} ${resultInfo.textClass}`}>
                     Confidence: {(result.probability * 100).toFixed(1)}%
                  </span>
                  <span className="px-4 py-1.5 rounded-full text-sm font-bold bg-white/5 border border-white/5 text-gray-300">
                     Risk Level: <span className={resultInfo.textClass}>{resultInfo.riskLevel}</span>
                  </span>
                </div>
              </div>
            </div>
            
            <div className={`glass-card ${resultInfo.bgClass.replace('/20', '/5')} border-l-4 ${resultInfo.borderClass.replace('border-t-', 'border-l-')} flex-grow shadow-lg`}>
               <h3 className={`uppercase tracking-widest text-xs font-bold mb-3 ${resultInfo.textClass}`}>Recommended Action</h3>
               <p className="text-white font-bold text-xl mb-4">{result.recommendations.strategy}</p>
               <div className="space-y-2">
                 <p className="text-xs text-textMuted uppercase font-bold tracking-wider">Suggested Steps</p>
                 <ul className="list-disc pl-5 text-sm text-gray-300 space-y-2">
                   {result.recommendations.offers.map((o, i) => <li key={i}>{o}</li>)}
                 </ul>
               </div>
            </div>
          </div>
        ) : (
          <div className="glass-card h-full min-h-[400px] flex flex-col items-center justify-center p-8 animate-pulse border-white/5 bg-surfaceLight/20">
            <div className="w-16 h-16 rounded-full border-4 border-dashed border-white/10 mb-6 flex items-center justify-center relative">
               <div className="absolute inset-0 bg-primary-500/10 rounded-full blur-md"></div>
               <Target className="w-6 h-6 text-textMuted opacity-50" />
            </div>
            <div className="space-y-4 w-full max-w-[200px]">
               <div className="h-4 bg-white/10 rounded w-3/4 mx-auto"></div>
               <div className="h-3 bg-white/5 rounded w-1/2 mx-auto"></div>
               <div className="h-3 bg-white/5 rounded w-5/6 mx-auto"></div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
