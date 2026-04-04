import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BarChart3, Users, Network, Search } from 'lucide-react';

const navItems = [
    { path: '/overview', name: 'Overview', icon: LayoutDashboard },
    { path: '/rfm', name: 'RFM Analytics', icon: BarChart3 },
    { path: '/segments', name: 'Segmentation', icon: Users },
    { path: '/models', name: 'Models & Metrics', icon: Network },
    { path: '/customer', name: 'Customer Insights', icon: Search },
];

export default function Sidebar() {
    return (
        <div className="w-64 flex-shrink-0 bg-surface/50 border-r border-white/5 backdrop-blur-xl h-full flex flex-col pt-8 pb-4">
            <div className="px-6 mb-8 flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/30">
                    <span className="text-white font-bold text-xl">S</span>
                </div>
                <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-textMuted tracking-tight">
                    SegPredict
                </h1>
            </div>

            <div className="px-4 space-y-2 flex-grow">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `nav-link w-full ${isActive ? 'active shadow-lg shadow-primary-500/10' : ''}`
                        }
                    >
                        <item.icon className="w-5 h-5" />
                        <span className="font-medium">{item.name}</span>
                    </NavLink>
                ))}
            </div>

            <div className="px-6 pb-2">
                <div className="bg-surfaceLight/30 rounded-xl p-4 border border-white/5 shadow-inner">
                    <p className="text-xs text-textMuted text-center font-medium">Production v1.0.0</p>
                    <div className="mt-2 flex items-center justify-center space-x-2">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        <span className="text-xs text-green-500 font-semibold tracking-wider">SYSTEM ONLINE</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
