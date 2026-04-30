import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FileSpreadsheet,
    RotateCw,
    Hash,
    Tag,
    Activity,
    Calendar,
    Eye,
    CheckCircle2,
    XCircle,
    X,
    HelpCircle,
    Trash2
} from 'lucide-react';
import { deleteMeasurement, getAllMeasurements } from '../api/formApi';
import { toast } from 'react-hot-toast';
import { formatDateTime, formatDate, getDateRangePreset } from '../utils/dateUtils';

export default function MeasurementList() {
    const [measurements, setMeasurements] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [rangeType, setRangeType] = useState(''); // today, yesterday, 7days, 15days, month
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showDateInputs, setShowDateInputs] = useState(false);
    const startDateRef = useRef(null);
    const endDateRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handler = setTimeout(() => {
            fetchMeasurements(1);
        }, 500);
        return () => clearTimeout(handler);
    }, [search, status, startDate, endDate]);

    useEffect(() => {
        fetchMeasurements(pagination.page);

        const handleNewMeasurement = () => {
            fetchMeasurements(pagination.page);
        };

        window.addEventListener('new_measurement_added', handleNewMeasurement);
        return () => {
            window.removeEventListener('new_measurement_added', handleNewMeasurement);
        };
    }, [pagination.page]);

    const fetchMeasurements = async (page = 1) => {
        setLoading(true);
        try {
            const result = await getAllMeasurements({ page, limit: 10, search, status, startDate, endDate });
            setMeasurements(result.data);
            setPagination(result.pagination);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this measurement and its CSV file?')) return;

        try {
            await deleteMeasurement(id);
            toast.success('Measurement deleted successfully');
            fetchMeasurements(pagination.page);
        } catch (err) {
            toast.error(err.message);
        }
    };

    const handleRangeChange = (type) => {
        setRangeType(type);
        if (type) {
            const { start, end } = getDateRangePreset(type);
            setStartDate(start);
            setEndDate(end);
        } else {
            setStartDate('');
            setEndDate('');
        }
    };

    if (error) return <div className="text-center p-8 text-red-500 font-semibold">{error}</div>;

    return (
        <div className="w-full max-w-6xl mx-auto bg-white dark:bg-[#1e293b] rounded-2xl shadow-xl overflow-hidden p-6 transition-colors duration-300">
            <div className="flex items-center justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Measurement</h2>
                    <p className="text-sm text-gray-400 dark:text-gray-400 mt-1">History of all processed CSV measurements</p>
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    <div className="relative w-48">
                        <input
                            type="text"
                            placeholder="Search..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 dark:border-[#334155] bg-white dark:bg-[#0f172a] focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm transition-all text-gray-700 dark:text-gray-200"
                        />
                        <Tag className="absolute left-3 top-2.5 text-gray-400 dark:text-gray-500" size={14} />
                    </div>

                    <select
                        value={rangeType}
                        onChange={(e) => handleRangeChange(e.target.value)}
                        className="px-3 py-2 rounded-lg border border-gray-200 dark:border-[#334155] outline-none text-sm focus:ring-2 focus:ring-blue-500 transition-all bg-white dark:bg-[#0f172a] font-medium text-gray-700 dark:text-gray-200 min-w-[120px]"
                    >
                        <option value="">Range</option>
                        <option value="today">Today</option>
                        <option value="yesterday">Yesterday</option>
                        <option value="7days">7 Days</option>
                        <option value="15days">15 Days</option>
                        <option value="month">Month</option>
                    </select>

                    <div className="flex items-center gap-2">
                        {(showDateInputs || startDate || endDate) ? (
                            <div className="flex items-center bg-gray-50 dark:bg-[#0f172a] border border-gray-200 dark:border-[#334155] rounded-lg shadow-sm hover:border-blue-400 transition-all focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 overflow-hidden animate-in slide-in-from-right-2 duration-200">
                                <div className="pl-3 pr-2 flex items-center justify-center border-r border-gray-200 dark:border-[#334155] bg-white dark:bg-[#1e293b] cursor-pointer" onClick={() => setShowDateInputs(false)}>
                                    <Calendar size={14} className="text-blue-500 dark:text-blue-400" />
                                </div>
                                <div className="flex items-center px-1 py-1 gap-1">
                                    <div
                                        className="relative w-[85px] h-7 flex items-center justify-center cursor-pointer hover:bg-white dark:hover:bg-[#1e293b] rounded transition-colors"
                                        onClick={() => startDateRef.current?.showPicker()}
                                    >
                                        <span className="text-[11px] text-gray-700 dark:text-gray-300 font-bold whitespace-nowrap pointer-events-none">
                                            {startDate ? formatDate(startDate) : 'DD/MM/YY'}
                                        </span>
                                        <input
                                            ref={startDateRef}
                                            type="date"
                                            value={startDate}
                                            onChange={(e) => {
                                                setStartDate(e.target.value);
                                                setRangeType('');
                                            }}
                                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                            title="Start Date"
                                        />
                                    </div>
                                    <div className="text-gray-300 dark:text-gray-600 font-bold mx-0.5">/</div>
                                    <div
                                        className="relative w-[85px] h-7 flex items-center justify-center cursor-pointer hover:bg-white dark:hover:bg-[#1e293b] rounded transition-colors"
                                        onClick={() => endDateRef.current?.showPicker()}
                                    >
                                        <span className="text-[11px] text-gray-700 dark:text-gray-300 font-bold whitespace-nowrap pointer-events-none">
                                            {endDate ? formatDate(endDate) : 'DD/MM/YY'}
                                        </span>
                                        <input
                                            ref={endDateRef}
                                            type="date"
                                            value={endDate}
                                            onChange={(e) => {
                                                setEndDate(e.target.value);
                                                setRangeType('');
                                            }}
                                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                            title="End Date"
                                        />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={() => setShowDateInputs(true)}
                                className="p-2.5 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-[#334155] rounded-lg transition-all border border-gray-200 dark:border-[#334155] bg-white dark:bg-[#0f172a] shadow-sm flex items-center justify-center"
                                title="Expand Date Range"
                            >
                                <Calendar size={18} />
                            </button>
                        )}
                    </div>

                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="px-3 py-2 rounded-lg border border-gray-200 dark:border-[#334155] outline-none text-sm focus:ring-2 focus:ring-blue-500 transition-all bg-white dark:bg-[#0f172a] font-medium text-gray-700 dark:text-gray-200 shadow-sm hover:border-gray-300 dark:hover:border-[#475569]"
                    >
                        <option value="">Status</option>
                        <option value="OK">OK</option>
                        <option value="NG">NG</option>
                    </select>

                    {(search || status || startDate || endDate) && (
                        <button
                            onClick={() => {
                                setSearch('');
                                setStatus('');
                                setStartDate('');
                                setEndDate('');
                                setRangeType('');
                                setShowDateInputs(false);
                            }}
                            className="p-2.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                            title="Clear"
                        >
                            <X size={18} />
                        </button>
                    )}

                    <div className="border-l border-gray-200 dark:border-[#334155] h-6 mx-1"></div>

                    <button
                        onClick={() => fetchMeasurements(pagination.page)}
                        className="p-2.5 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-[#334155] rounded-lg transition-all border border-gray-100 dark:border-[#334155] flex-shrink-0"
                        title="Refresh"
                        disabled={loading}
                    >
                        <RotateCw size={18} className={loading ? 'animate-spin' : ''} />
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 dark:bg-[#1e293b]/50 border-b border-gray-100 dark:border-[#334155] text-sm uppercase text-gray-500 dark:text-gray-400 font-bold">
                            <th className="px-4 py-4 text-center">
                                <span className="flex items-center justify-center gap-1">
                                    <Hash size={14} /> ID
                                </span>
                            </th>
                            <th className="px-6 py-4">
                                <span className="flex items-center gap-1">
                                    <Tag size={14} /> Configure File
                                </span>
                            </th>
                            <th className="px-6 py-4">
                                <span className="flex items-center gap-1">
                                    <FileSpreadsheet size={14} /> Program
                                </span>
                            </th>
                            <th className="px-6 py-4 text-center">
                                <span className="flex items-center justify-center gap-1">
                                    <Activity size={14} /> Result
                                </span>
                            </th>
                            <th className="px-6 py-4 text-center">
                                <span className="flex items-center justify-center gap-1">
                                    <Calendar size={14} /> Date
                                </span>
                            </th>
                            <th className="px-6 py-4 text-center">
                                <span className="flex items-center justify-center gap-1">
                                    <Eye size={14} /> Action
                                </span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-[#334155]">
                        {loading && measurements.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="px-6 py-12 text-center">
                                    <div className="flex flex-col items-center gap-2">
                                        <RotateCw className="animate-spin text-blue-500" size={24} />
                                        <span className="text-gray-400 dark:text-gray-500 text-sm">Loading measurements...</span>
                                    </div>
                                </td>
                            </tr>
                        ) : measurements.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="px-6 py-8 text-center text-gray-400 dark:text-gray-500">
                                    {(search || status || startDate || endDate)
                                        ? "No measurements found matching your filters."
                                        : "No measurements available yet."}
                                </td>
                            </tr>
                        ) : (
                            measurements.map((m) => (
                                <tr key={m.id} className="hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors group">
                                    <td className="px-6 py-4 text-sm font-medium text-gray-400 dark:text-gray-500 text-center">#{m.id}</td>
                                    <td className="px-6 py-4 text-sm font-semibold text-gray-800 dark:text-gray-200">{m.form_name}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 truncate max-w-[200px]" title={m.program_name}>
                                        {m.program_name}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${m.overall_result === 'OK'
                                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                                            : m.overall_result === 'NG'
                                                ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                                                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                                            }`}>
                                            {m.overall_result === 'OK' && <CheckCircle2 size={12} />}
                                            {m.overall_result === 'NG' && <XCircle size={12} />}
                                            {!['OK', 'NG'].includes(m.overall_result) && <HelpCircle size={12} />}
                                            {m.overall_result || 'N/A'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-500 text-center">
                                        {formatDateTime(m.created_at)}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => navigate(`/?id=${m.id}`)}
                                                className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full inline-flex items-center transition-all"
                                                title="View Slip"
                                            >
                                                <Eye size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(m.id)}
                                                className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full inline-flex items-center transition-all"
                                                title="Delete Measurement"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            {pagination.total > 0 && (
                <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-100 dark:border-[#334155]">
                    <span className="text-sm text-gray-400 dark:text-gray-500 font-sans">
                        Showing <span className="font-semibold text-gray-600 dark:text-gray-300">{(pagination.page - 1) * pagination.limit + 1}</span> to <span className="font-semibold text-gray-600 dark:text-gray-300">{Math.min(pagination.page * pagination.limit, pagination.total)}</span> of <span className="font-semibold text-gray-600 dark:text-gray-300">{pagination.total}</span>
                    </span>

                    {pagination.totalPages > 1 && (
                        <div className="flex gap-2">
                            <button
                                disabled={pagination.page <= 1}
                                onClick={() => fetchMeasurements(pagination.page - 1)}
                                className="px-4 py-2 border border-gray-200 dark:border-[#334155] rounded-lg text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#334155] disabled:opacity-50 transition-all font-sans"
                            >
                                Previous
                            </button>
                            <button
                                disabled={pagination.page >= pagination.totalPages}
                                onClick={() => fetchMeasurements(pagination.page + 1)}
                                className="px-4 py-2 border border-gray-200 dark:border-[#334155] rounded-lg text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#334155] disabled:opacity-50 transition-all font-sans"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
