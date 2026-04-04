import { useEffect, useState } from 'react';
import axios from 'axios';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid
} from 'recharts';

export default function ModelComparison() {
    const [data, setData] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:8000/model-metrics')
            .then((res) => setData(res.data))
            .catch((err) => console.error(err));
    }, []);

    if (!data) return (
        <div className="flex items-center justify-center p-20">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
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
        parseFloat(current.f1) > parseFloat(modelsArray[bestIdx].f1) ? idx : bestIdx, 0
    );

    const bestModel = modelsArray[bestModelIndex];

    const featureImp = Object.entries(bestModel.rawImportance)
        .map(([feat, val]) => ({ name: feat, value: val }))
        .sort((a, b) => b.value - a.value);

    return (
        <div className="p-6 space-y-8">

            {/* HEADER */}
            <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    Model Comparison
                </h1>
                <p className="text-gray-600">
                    Evaluate machine learning models predicting 30-day purchasing behaviors
                </p>
            </div>

            {/* TABLE */}
            <div className="bg-white p-6 rounded-xl shadow border">

                <h2 className="text-xl font-semibold text-gray-800 mb-6">
                    Evaluation Metrics
                </h2>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">

                        <thead>
                            <tr className="border-b text-gray-600 text-sm uppercase">
                                <th className="p-4">Model Name</th>
                                <th className="p-4">Accuracy (%)</th>
                                <th className="p-4">Precision (%)</th>
                                <th className="p-4">Recall (%)</th>
                                <th className="p-4 font-bold text-blue-600">F1-Score (%)</th>
                            </tr>
                        </thead>

                        <tbody>
                            {modelsArray.map((model, idx) => (
                                <tr
                                    key={model.name}
                                    className={`border-b hover:bg-gray-50 ${idx === bestModelIndex ? 'bg-blue-50' : ''
                                        }`}
                                >
                                    <td className="p-4 font-medium text-gray-800">
                                        {model.name} {idx === bestModelIndex && '(Best)'}
                                    </td>

                                    <td className="p-4 text-gray-700">{model.accuracy}</td>
                                    <td className="p-4 text-gray-700">{model.precision}</td>
                                    <td className="p-4 text-gray-700">{model.recall}</td>

                                    <td className="p-4 font-bold text-blue-600">
                                        {model.f1}
                                    </td>
                                </tr>
                            ))}
                        </tbody>

                    </table>
                </div>
            </div>

            {/* FEATURE IMPORTANCE */}
            {featureImp.length > 0 && (
                <div className="bg-white p-6 rounded-xl shadow border">

                    <h2 className="text-xl font-semibold text-gray-800 mb-2">
                        Feature Importance
                    </h2>

                    <p className="text-gray-600 mb-6 text-sm">
                        Derived from {bestModel.name}
                    </p>

                    <div className="h-80 w-full lg:w-2/3">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={featureImp} layout="vertical">

                                <CartesianGrid strokeDasharray="3 3" horizontal={false} />

                                <XAxis type="number" stroke="#6b7280" />
                                <YAxis
                                    dataKey="name"
                                    type="category"
                                    stroke="#6b7280"
                                    width={150}
                                    tick={{ fill: '#374151' }}
                                />

                                <Tooltip />

                                <Bar
                                    dataKey="value"
                                    fill="#3b82f6"
                                    radius={[0, 4, 4, 0]}
                                    barSize={20}
                                />

                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                </div>
            )}

        </div>
    );
}