import { useState, useEffect, useRef } from 'react';
import { getAllForms } from '../api/formApi';
import {
    Plus,
    RotateCw,
    Tag,
    Hash,
    BarChart3,
    CheckCircle2,
    XCircle,
    X,
    Calendar,
    Eye,
    FileSpreadsheet,
    Layers,
    Pencil
} from 'lucide-react';
import SlipForm from './SlipForm';
import { formatDate, getDateRangePreset } from '../utils/dateUtils';

export default function FormList() {
    const [forms, setForms] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
    const [search, setSearch] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [rangeType, setRangeType] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingForm, setEditingForm] = useState(null);
    const [showDateInputs, setShowDateInputs] = useState(false);
    const startDateRef = useRef(null);
    const endDateRef = useRef(null);

    useEffect(() => {
        const handler = setTimeout(() => {
            fetchForms(1);
        }, 500);
        return () => clearTimeout(handler);
    }, [search, startDate, endDate]);

    useEffect(() => {
        fetchForms(pagination.page);

        const handleNewMeasurement = () => {
            fetchForms(pagination.page);
        };

        window.addEventListener('new_measurement_added', handleNewMeasurement);
        return () => {
            window.removeEventListener('new_measurement_added', handleNewMeasurement);
        };
    }, [pagination.page]);

    const fetchForms = async (page = 1) => {
        setLoading(true);
        try {
            const result = await getAllForms({ page, limit: 10, search, startDate, endDate });
            setForms(result.data);
            setPagination(result.pagination);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleFormSuccess = () => {
        setIsModalOpen(false);
        setEditingForm(null);
        fetchForms(1);
    };

    const handleEdit = (form) => {
        setEditingForm(form);
        setIsModalOpen(true);
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

    const handleCreate = () => {
        setEditingForm(null);
        setIsModalOpen(true);
    };

    if (error) return <div className="text-center p-8 text-red-500 font-semibold">{error}</div>;

    return (
        <div className="w-full max-w-6xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden p-6 relative">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800">Configure Files</h2>
                    <p className="text-sm text-gray-400 mt-1">Manage and monitor your measurement configurations</p>
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
                    <div className="relative w-44">
                        <input
                            type="text"
                            placeholder="Search..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm transition-all shadow-sm"
                        />
                        <Tag className="absolute left-3 top-2.5 text-gray-400" size={14} />
                    </div>

                    <select
                        value={rangeType}
                        onChange={(e) => handleRangeChange(e.target.value)}
                        className="px-3 py-2 rounded-lg border border-gray-200 outline-none text-sm focus:ring-2 focus:ring-blue-500 transition-all bg-white font-medium text-gray-700 min-w-[120px] shadow-sm"
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
                            <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg shadow-sm hover:border-blue-400 transition-all focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 overflow-hidden animate-in slide-in-from-right-2 duration-200">
                                <div className="pl-3 pr-2 flex items-center justify-center border-r border-gray-200 bg-white cursor-pointer" onClick={() => setShowDateInputs(false)}>
                                    <Calendar size={14} className="text-blue-500" />
                                </div>
                                <div className="flex items-center px-1 py-1 gap-1">
                                    <div
                                        className="relative w-[85px] h-7 flex items-center justify-center cursor-pointer hover:bg-white rounded transition-colors"
                                        onClick={() => startDateRef.current?.showPicker()}
                                    >
                                        <span className="text-[11px] text-gray-700 font-bold whitespace-nowrap pointer-events-none">
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
                                    <div className="text-gray-300 font-bold mx-0.5">/</div>
                                    <div
                                        className="relative w-[85px] h-7 flex items-center justify-center cursor-pointer hover:bg-white rounded transition-colors"
                                        onClick={() => endDateRef.current?.showPicker()}
                                    >
                                        <span className="text-[11px] text-gray-700 font-bold whitespace-nowrap pointer-events-none">
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
                                className="p-2.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all border border-gray-200 bg-white shadow-sm flex items-center justify-center"
                                title="Expand Date Range"
                            >
                                <Calendar size={18} />
                            </button>
                        )}
                    </div>

                    {(search || startDate || endDate) && (
                        <button
                            onClick={() => {
                                setSearch('');
                                setStartDate('');
                                setEndDate('');
                                setRangeType('');
                                setShowDateInputs(false);
                            }}
                            className="p-2.5 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                            title="Clear filters"
                        >
                            <X size={18} />
                        </button>
                    )}

                    <div className="border-l border-gray-200 h-6 mx-1"></div>

                    <button
                        onClick={() => fetchForms(pagination.page)}
                        className="p-2.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all border border-gray-100 flex-shrink-0"
                        title="Refresh list"
                        disabled={loading}
                    >
                        <RotateCw size={18} className={loading ? 'animate-spin' : ''} />
                    </button>

                    <button
                        onClick={handleCreate}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold shadow-md transition-all transform hover:scale-105 active:scale-95 flex items-center gap-1.5 flex-shrink-0"
                    >
                        <Plus size={18} />
                        <span className="text-sm">New</span>
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-100 text-sm uppercase text-gray-500 font-bold">
                            <th className="px-4 py-4 text-center">
                                <span className="flex items-center justify-center gap-1">
                                    <Hash size={14} /> ID
                                </span>
                            </th>
                            <th className="px-6 py-4">
                                <span className="flex items-center gap-1">
                                    <Tag size={14} /> Name
                                </span>
                            </th>
                            <th className="px-6 py-4 text-center">
                                <span className="flex items-center justify-center gap-1">
                                    <FileSpreadsheet size={14} /> Lot No.
                                </span>
                            </th>
                            <th className="px-6 py-4 text-center">
                                <span className="flex items-center justify-center gap-1">
                                    <Hash size={14} /> Serial
                                </span>
                            </th>
                            <th className="px-6 py-4 text-center">
                                <span className="flex items-center justify-center gap-1">
                                    <Layers size={14} /> Diamonds
                                </span>
                            </th>
                            <th className="px-6 py-4 text-center">
                                <span className="flex items-center justify-center gap-1">
                                    <BarChart3 size={14} /> Total
                                </span>
                            </th>
                            <th className="px-4 py-4 text-center">
                                <span className="flex items-center justify-center gap-1 text-green-600">
                                    <CheckCircle2 size={14} /> OK
                                </span>
                            </th>
                            <th className="px-4 py-4 text-center">
                                <span className="flex items-center justify-center gap-1 text-red-600">
                                    <XCircle size={14} /> NG
                                </span>
                            </th>
                            <th className="px-6 py-4">
                                <span className="flex items-center gap-1">
                                    <Calendar size={14} /> Date
                                </span>
                            </th>
                            <th className="px-6 py-4 text-center">
                                <span className="flex items-center justify-center gap-1">
                                    <Eye size={14} /> Actions
                                </span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading && forms.length === 0 ? (
                            <tr>
                                <td colSpan="10" className="px-6 py-12 text-center">
                                    <div className="flex flex-col items-center gap-2">
                                        <RotateCw className="animate-spin text-blue-500" size={24} />
                                        <span className="text-gray-400 text-sm">Loading configurations...</span>
                                    </div>
                                </td>
                            </tr>
                        ) : forms.length === 0 ? (
                            <tr>
                                <td colSpan="10" className="px-6 py-8 text-center text-gray-400">
                                    No configurations found matching "{search}"
                                </td>
                            </tr>
                        ) : (
                            forms.map((form) => (
                                <tr key={form.id} className="hover:bg-blue-50/30 transition-colors group">
                                    <td className="px-6 py-4 text-sm font-medium text-gray-400 text-center">#{form.id}</td>
                                    <td className="px-6 py-4 text-sm font-semibold text-gray-800">{form.name}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600 font-mono text-center">{form.lot_no}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600 font-mono text-center">{form.serial_counter}</td>
                                    <td className="px-6 py-4 text-sm text-gray-800 text-center font-bold">
                                        <span className="bg-blue-100 text-blue-700 px-2.5 py-1 rounded-md text-xs">
                                            {form.no_of_diamond}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-800 text-center font-bold">
                                        <span className="bg-purple-100 text-purple-700 px-2.5 py-1 rounded-md text-xs">
                                            {form.total_measurement}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 text-sm text-center font-bold">
                                        <span className="bg-green-100 text-green-700 px-2.5 py-1 rounded-md text-xs">
                                            {form.ok_count || 0}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 text-sm text-center font-bold">
                                        <span className="bg-red-100 text-red-700 px-2.5 py-1 rounded-md text-xs">
                                            {form.ng_count || 0}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {formatDate(form.created_at)}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex items-center justify-center gap-1">
                                            <button
                                                onClick={() => handleEdit(form)}
                                                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full inline-flex items-center transition-all"
                                                title="Edit Configuration"
                                            >
                                                <Pencil size={18} />
                                            </button>
                                            {form.image_filename ? (
                                                <a
                                                    href={`http://localhost:5000/asset/image/${form.image_filename}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-full inline-flex items-center transition-all"
                                                    title="View Image"
                                                >
                                                    <Eye size={18} />
                                                </a>
                                            ) : (
                                                <span className="p-2 text-gray-300 italic text-xs">No Img</span>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {pagination.total > 0 && (
                <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-100">
                    <span className="text-sm text-gray-400">
                        Showing <span className="font-semibold text-gray-600">{(pagination.page - 1) * pagination.limit + 1}</span> to <span className="font-semibold text-gray-600">{Math.min(pagination.page * pagination.limit, pagination.total)}</span> of <span className="font-semibold text-gray-600">{pagination.total}</span>
                    </span>

                    {pagination.totalPages > 1 && (
                        <div className="flex gap-2">
                            <button
                                disabled={pagination.page <= 1}
                                onClick={() => fetchForms(pagination.page - 1)}
                                className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-all"
                            >
                                Previous
                            </button>
                            <button
                                disabled={pagination.page >= pagination.totalPages}
                                onClick={() => fetchForms(pagination.page + 1)}
                                className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-all"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="animate-in zoom-in-95 duration-200">
                        <SlipForm
                            editingForm={editingForm}
                            onSuccess={handleFormSuccess}
                            onClose={() => {
                                setIsModalOpen(false);
                                setEditingForm(null);
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
