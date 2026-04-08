import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer
} from "recharts";
import { Link } from "react-router-dom";

export default function Overview() {

    const chartData = [
        { name: "Logistic Regression", accuracy: 0.74, f1: 0.43 },
        { name: "Gradient Boosting", accuracy: 0.75, f1: 0.49 }
    ];

    return (
        <div className="flex min-h-screen bg-gray-100">


            {/* MAIN */}
            <div className="flex-1 p-6">

                {/* 🔥 HERO SECTION */}
                <div className="bg-gradient-to-br from-gray-100 to-gray-200 p-10 rounded-3xl shadow-inner mb-10">

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

                        <div>
                            <h1 className="text-4xl font-bold text-gray-900 mb-4">
                                Your best processes
                            </h1>

                            <p className="text-gray-600">
                                Smart ML-powered customer insights and analytics dashboard.
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-sm">
                            <h3 className="text-gray-700 font-semibold mb-4">
                                Model Summary
                            </h3>

                            <div className="flex items-center justify-center">
                                <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-400 to-green-400 flex items-center justify-center">
                                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                                        <span className="font-bold text-gray-800">F1</span>
                                    </div>
                                </div>
                            </div>

                        </div>

                    </div>

                </div>

                {/* 🔥 CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">

                    <div className="bg-white p-5 rounded-2xl shadow-sm border hover:shadow-md transition">
                        <p className="text-gray-500 text-sm">Customers</p>
                        <h2 className="text-2xl font-bold">4312</h2>
                    </div>

                    <div className="bg-white p-5 rounded-2xl shadow-sm border hover:shadow-md transition">
                        <p className="text-gray-500 text-sm">Revenue</p>
                        <h2 className="text-2xl font-bold">$8.8M</h2>
                    </div>

                    <div className="bg-white p-5 rounded-2xl shadow-sm border hover:shadow-md transition">
                        <p className="text-gray-500 text-sm">Transactions</p>
                        <h2 className="text-2xl font-bold">19,213</h2>
                    </div>

                    <div className="bg-white p-5 rounded-2xl shadow-sm border hover:shadow-md transition">
                        <p className="text-gray-500 text-sm">Best Model</p>
                        <h2 className="text-xl font-bold text-blue-600">
                            Gradient Boosting
                        </h2>
                    </div>

                </div>

                {/* 🔥 FEATURE SECTION (NEW UI LIKE IMAGE) */}
                <div className="bg-gray-100 p-10 rounded-3xl shadow-inner mb-10">

                    <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">
                        Work even more efficiently
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                        <div className="bg-white p-6 rounded-2xl shadow-md text-center hover:shadow-lg transition">
                            <div className="w-12 h-12 mx-auto mb-4 bg-indigo-500 rounded-lg flex items-center justify-center text-white">🔀</div>
                            <h3 className="font-semibold text-gray-800">Fast switching</h3>
                            <p className="text-gray-600 text-sm mt-2">Switch tools instantly</p>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-md text-center hover:shadow-lg transition">
                            <div className="w-12 h-12 mx-auto mb-4 bg-green-500 rounded-lg flex items-center justify-center text-white">📤</div>
                            <h3 className="font-semibold text-gray-800">Secure sharing</h3>
                            <p className="text-gray-600 text-sm mt-2">Send files safely</p>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-md text-center hover:shadow-lg transition">
                            <div className="w-12 h-12 mx-auto mb-4 bg-orange-500 rounded-lg flex items-center justify-center text-white">📄</div>
                            <h3 className="font-semibold text-gray-800">Smart docs</h3>
                            <p className="text-gray-600 text-sm mt-2">Manage documents</p>
                        </div>

                    </div>

                </div>

                {/* MODEL COMPARISON */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border mb-8">

                    <h2 className="text-xl font-bold mb-4">
                        Model Comparison
                    </h2>

                    <table className="w-full">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-3 text-left">Model</th>
                                <th className="p-3">Accuracy</th>
                                <th className="p-3">Precision</th>
                                <th className="p-3">Recall</th>
                                <th className="p-3">F1</th>
                                <th className="p-3">Best</th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr className="border-t">
                                <td className="p-3">Logistic Regression</td>
                                <td className="text-center">0.74</td>
                                <td className="text-center">0.71</td>
                                <td className="text-center">0.31</td>
                                <td className="text-center">0.43</td>
                                <td className="text-center">❌</td>
                            </tr>

                            <tr className="border-t">
                                <td className="p-3">Gradient Boosting</td>
                                <td className="text-center">0.75</td>
                                <td className="text-center">0.67</td>
                                <td className="text-center">0.39</td>
                                <td className="text-center text-green-600 font-bold">0.49</td>
                                <td className="text-center text-green-600">✅</td>
                            </tr>
                        </tbody>
                    </table>

                </div>

                {/* CHART */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border">

                    <h2 className="text-xl font-bold mb-4">
                        Model Performance Chart
                    </h2>

                    <ResponsiveContainer width="100%" height={350}>
                        <BarChart data={chartData}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="accuracy" fill="#3b82f6" />
                            <Bar dataKey="f1" fill="#22c55e" />
                        </BarChart>
                    </ResponsiveContainer>

                </div>

            </div>
        </div>
    );
}