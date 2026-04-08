import { Link } from "react-router-dom";

export default function DashboardLayout({ children }) {
    return (
        <div className="flex min-h-screen bg-gray-100">

            {/* SIDEBAR */}
            <div className="w-64 bg-white shadow-md p-6">
                <h1 className="text-xl font-bold mb-8">SegPredict</h1>

                <ul className="space-y-4 text-gray-700">
                    <li><Link to="/dashboard">Dashboard</Link></li>
                    <li><Link to="/customers">Customers</Link></li>
                    <li><Link to="/models">Models</Link></li>
                    <li><Link to="/analytics">Analytics</Link></li>
                </ul>
            </div>

            {/* MAIN CONTENT */}
            <div className="flex-1 p-6">
                {children}
            </div>

        </div>
    );
}