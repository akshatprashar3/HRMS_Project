import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../api';

export default function Attendance() {
    const { id } = useParams(); // Get employee ID from the URL
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({ date: '', status: 'Present' });

    // Fetch existing attendance records
    const fetchRecords = () => {
        api.get(`/attendance/${id}`)
            .then(res => setRecords(res.data))
            .catch(err => console.error("Failed to fetch records", err))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchRecords();
    }, [id]);

    // Submit new attendance
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/attendance/', {
                employee_id: parseInt(id),
                date: formData.date,
                status: formData.status
            });
            setFormData({ ...formData, date: '' }); // Reset date field
            fetchRecords(); // Refresh the table
        } catch (err) {
            alert("Failed to mark attendance.");
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Attendance Records</h2>
                <Link to="/" className="text-blue-600 hover:underline text-sm font-medium">&larr; Back to Directory</Link>
            </div>

            {/* Form to Mark Attendance */}
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex gap-4 items-end">
                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input 
                        type="date" 
                        required
                        value={formData.date}
                        onChange={(e) => setFormData({...formData, date: e.target.value})}
                        className="w-full border border-gray-300 rounded-md p-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                </div>
                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select 
                        value={formData.status}
                        onChange={(e) => setFormData({...formData, status: e.target.value})}
                        className="w-full border border-gray-300 rounded-md p-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
                    >
                        <option value="Present">Present</option>
                        <option value="Absent">Absent</option>
                    </select>
                </div>
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition">
                    Mark Attendance
                </button>
            </form>

            {/* Attendance History Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-gray-500">Loading records...</div>
                ) : records.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">No attendance records found for this employee.</div>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="p-4 font-medium text-gray-600">Date</th>
                                <th className="p-4 font-medium text-gray-600">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {records.map(record => (
                                <tr key={record.id} className="hover:bg-gray-50 transition">
                                    <td className="p-4 text-gray-800">{record.date}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-sm font-medium ${
                                            record.status === 'Present' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                            {record.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}