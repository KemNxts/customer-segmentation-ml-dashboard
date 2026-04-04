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

            {/* SIDEBAR */}
            {/* SIDEBAR */}
            <div className="w-64 bg-white shadow-md p-5">

                <h1 className="text-xl font-bold mb-6">SegPredict</h1>

                <ul className="space-y-4 text-gray-700">

                    <li>
                        <Link to="/" className="text-blue-600 font-semibold">
                            Dashboard
                        </Link>
                    </li>

                    <li>
                        <Link to="/customers" className="hover:text-blue-600">
                            Customers
                        </Link>
                    </li>

                    <li>
                        <Link to="/models" className="hover:text-blue-600">
                            Models
                        </Link>
                    </li>

                    <li>
                        <Link to="/analytics" className="hover:text-blue-600">
                            Analytics
                        </Link>
                    </li>

                </ul>

            </div>

            {/* MAIN CONTENT */}
            <div className="flex-1 p-6">

                <h1 className="text-2xl font-bold mb-6">
                    Customer Analytics Dashboard
                </h1>

                {/* CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

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

                {/* MODEL COMPARISON */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border mb-8">

                    <h2 className="text-xl font-bold mb-4">
                        Model Comparison
                    </h2>

                    <div className="overflow-x-auto">
                        <table className="min-w-full border border-gray-200 rounded-xl overflow-hidden">

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

                                <tr className="border-t hover:bg-gray-50">
                                    <td className="p-3">Logistic Regression</td>
                                    <td className="text-center">0.74</td>
                                    <td className="text-center">0.71</td>
                                    <td className="text-center">0.31</td>
                                    <td className="text-center">0.43</td>
                                    <td className="text-center">❌</td>
                                </tr>

                                <tr className="border-t hover:bg-gray-50">
                                    <td className="p-3">Gradient Boosting</td>
                                    <td className="text-center">0.75</td>
                                    <td className="text-center">0.67</td>
                                    <td className="text-center">0.39</td>
                                    <td className="text-center text-green-600 font-bold">
                                        0.49
                                    </td>
                                    <td className="text-center text-green-600 font-bold">
                                        ✅
                                    </td>
                                </tr>

                            </tbody>

                        </table>
                    </div>

                </div>

                {/* CHART */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border mt-8">

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