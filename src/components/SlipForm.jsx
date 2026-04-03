import { useState, useEffect } from 'react';
import { submitForm, updateForm } from '../api/formApi';
import { X, Save, Tag, Hash, Image as ImageIcon, Layers } from 'lucide-react';

export default function SlipForm({ onSuccess, onClose, editingForm }) {
    const [formData, setFormData] = useState({
        name: '',
        lot_no: '',
        serial_counter: '',
        no_of_diamond: '',
    });
    const [imageFile, setImageFile] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        if (editingForm) {
            setFormData({
                name: editingForm.name || '',
                lot_no: editingForm.lot_no || '',
                serial_counter: editingForm.serial_counter || '',
                no_of_diamond: editingForm.no_of_diamond || '',
            });
        }
    }, [editingForm]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setImageFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setMessage(null);

        try {
            const data = new FormData();
            data.append('name', formData.name);
            data.append('lot_no', formData.lot_no);
            data.append('serial_counter', formData.serial_counter);
            data.append('no_of_diamond', formData.no_of_diamond);

            if (imageFile) {
                data.append('image', imageFile);
            } else if (editingForm && editingForm.image_filename) {
                // Keep existing image filename if no new file is selected
                data.append('image_filename', editingForm.image_filename);
            }

            const result = editingForm
                ? await updateForm(editingForm.id, data)
                : await submitForm(data);

            setMessage({ type: 'success', text: result.message });

            if (!editingForm) {
                setFormData({ name: '', lot_no: '', serial_counter: '', no_of_diamond: '' });
                setImageFile(null);
                e.target.reset();
            }

            if (onSuccess) {
                setTimeout(() => {
                    onSuccess();
                }, 1000);
            }
        } catch (err) {
            setMessage({ type: 'error', text: err.message });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="w-full max-w-lg bg-white dark:bg-[#1e293b] rounded-2xl shadow-xl p-8 transition-colors duration-300">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                    {editingForm ? 'Edit Configuration' : 'New Configuration'}
                </h2>
                {onClose && (
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-[#334155] rounded-full text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                        type="button"
                    >
                        <X size={24} />
                    </button>
                )}
            </div>

            {message && (
                <div className={`mb-4 p-3 rounded-lg text-sm font-medium ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-[#334155] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white dark:bg-[#0f172a] text-gray-800 dark:text-gray-100"
                        placeholder="Enter name"
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Lot No.</label>
                    <input
                        type="text"
                        name="lot_no"
                        value={formData.lot_no}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-[#334155] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white dark:bg-[#0f172a] text-gray-800 dark:text-gray-100"
                        placeholder="Enter lot number"
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Serial Counter</label>
                    <input
                        type="text"
                        name="serial_counter"
                        value={formData.serial_counter}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-[#334155] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white dark:bg-[#0f172a] text-gray-800 dark:text-gray-100"
                        placeholder="Enter serial counter"
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">No. of Diamond</label>
                    <input
                        type="number"
                        name="no_of_diamond"
                        value={formData.no_of_diamond}
                        onChange={handleChange}
                        required
                        min="0"
                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-[#334155] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white dark:bg-[#0f172a] text-gray-800 dark:text-gray-100"
                        placeholder="Enter number of diamonds"
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Upload Image</label>

                    {/* Image Preview Area */}
                    {(imageFile || (editingForm && editingForm.image_filename)) && (
                        <div className="mb-3 relative w-32 h-32 rounded-lg overflow-hidden border border-gray-100 dark:border-[#334155] shadow-sm bg-gray-50 dark:bg-[#0f172a]">
                            <img
                                src={imageFile ? URL.createObjectURL(imageFile) : `http://localhost:5000/asset/image/${editingForm.image_filename}`}
                                alt="Preview"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute top-0 left-0 bg-black/40 text-white text-[10px] px-1.5 py-0.5 font-bold uppercase tracking-wider">
                                {imageFile ? 'New' : 'Current'}
                            </div>
                        </div>
                    )}

                    <div className="relative group">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 dark:file:bg-blue-900/30 file:text-blue-700 dark:file:text-blue-400 hover:file:bg-blue-100 dark:hover:file:bg-blue-900/40 transition cursor-pointer"
                        />
                        <ImageIcon className="absolute right-3 top-2 text-gray-300 dark:text-gray-600 pointer-events-none" size={18} />
                    </div>
                    {editingForm && !imageFile && (
                        <p className="text-[11px] text-gray-400 mt-1">Leave blank to keep existing image</p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={submitting}
                    className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
                >
                    <Save size={20} />
                    {submitting ? 'Processing...' : editingForm ? 'Update Configuration' : 'Create Configuration'}
                </button>
            </form>
        </div>
    );
}
