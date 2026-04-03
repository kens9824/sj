import { useState, useEffect } from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
    PieChart, Pie, Cell,
    BarChart, Bar
} from 'recharts';
import {
    Activity,
    CheckCircle2,
    XCircle,
    Layers,
    TrendingUp,
    Clock
} from 'lucide-react';
import { fetchDashboardStats } from '../api/dashboardApi';

export default function Dashboard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchDashboardStats()
            .then(setData)
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );

    if (error) return (
        <div className="p-8 bg-red-50 border border-red-200 rounded-2xl text-red-700 font-bold text-center">
            Error loading dashboard: {error}
        </div>
    );

    const stats = data?.stats || { total_measurements: 0, ok_count: 0, ng_count: 0, total_configs: 0 };
    const okRate = stats.total_measurements > 0 ? ((stats.ok_count / stats.total_measurements) * 100).toFixed(1) : 0;

    const pieData = [
        { name: 'OK', value: parseInt(stats.ok_count), color: '#10b981' },
        { name: 'NG', value: parseInt(stats.ng_count), color: '#ef4444' }
    ];

    const trendData = data?.trends || [];
    const topConfigs = data?.topConfigs || [];

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Live Dashboard</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Real-time measurement insights and quality metrics</p>
                </div>
                <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-xl text-blue-700 dark:text-blue-400 font-bold border border-blue-100 dark:border-blue-800">
                    <Clock size={18} />
                    <span>Last updated: Just now</span>
                </div>
            </div>

            {/* Grid for Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    icon={<Activity className="text-blue-600" size={24} />}
                    label="Total Measurements"
                    value={stats.total_measurements}
                    trend="+12%"
                    color="blue"
                />
                <StatCard
                    icon={<CheckCircle2 className="text-green-600" size={24} />}
                    label="OK Results"
                    value={stats.ok_count}
                    trend={`${okRate}% Rate`}
                    color="green"
                />
                <StatCard
                    icon={<XCircle className="text-red-600" size={24} />}
                    label="NG Results"
                    value={stats.ng_count}
                    trend="Critical"
                    color="red"
                />
                <StatCard
                    icon={<Layers className="text-purple-600" size={24} />}
                    label="Active Configs"
                    value={stats.total_configs}
                    trend="Static"
                    color="purple"
                />
            </div>

            {/* Main Charts Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Trend Chart */}
                <div className="lg:col-span-2 bg-white dark:bg-[#1e293b] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-[#334155]">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                            <TrendingUp size={20} className="text-blue-600" />
                            Quality Trend (7 Days)
                        </h3>
                    </div>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={trendData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                                <Legend />
                                <Line type="monotone" dataKey="ok" stroke="#10b981" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} name="OK" />
                                <Line type="monotone" dataKey="ng" stroke="#ef4444" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} name="NG" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Distribution Pie Chart */}
                <div className="bg-white dark:bg-[#1e293b] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-[#334155]">
                    <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-6">Overall Distribution</h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-4 space-y-2">
                        <div className="flex justify-between items-center px-4 py-2 bg-green-50 dark:bg-green-900/10 rounded-lg">
                            <span className="text-green-700 dark:text-green-400 font-semibold">Total OK</span>
                            <span className="font-bold dark:text-white">{stats.ok_count}</span>
                        </div>
                        <div className="flex justify-between items-center px-4 py-2 bg-red-50 dark:bg-red-900/10 rounded-lg">
                            <span className="text-red-700 dark:text-red-400 font-semibold">Total NG</span>
                            <span className="font-bold dark:text-white">{stats.ng_count}</span>
                        </div>
                    </div>
                </div>

                {/* Top Configs Bar Chart */}
                <div className="lg:col-span-3 bg-white dark:bg-[#1e293b] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-[#334155]">
                    <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-6">Top Configurations by Volume</h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={topConfigs} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={12} width={120} />
                                <Tooltip cursor={{ fill: 'transparent' }} />
                                <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={30} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ icon, label, value, trend, color }) {
    const colorClasses = {
        blue: 'bg-blue-50 dark:bg-blue-900/10 text-blue-600 border-blue-100 dark:border-blue-900/30',
        green: 'bg-green-50 dark:bg-green-900/10 text-green-600 border-green-100 dark:border-green-900/30',
        red: 'bg-red-50 dark:bg-red-900/10 text-red-600 border-red-100 dark:border-red-900/30',
        purple: 'bg-purple-50 dark:bg-purple-900/10 text-purple-600 border-purple-100 dark:border-purple-900/30',
    };

    return (
        <div className={`p-6 rounded-2xl border ${colorClasses[color]} bg-white dark:bg-[#1e293b] shadow-sm transform transition hover:scale-105 duration-300`}>
            <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl bg-white dark:bg-[#0f172a] shadow-sm border border-inherit`}>
                    {icon}
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
                    <div className="flex items-center gap-2">
                        <h4 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{value}</h4>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${color === 'red' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                            {trend}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
