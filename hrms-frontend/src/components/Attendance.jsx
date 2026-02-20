import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../api';

export default function Attendance() {
    const { id } = useParams(); 
    const [records, setRecords] = useState([]);
    
    // NEW: State to hold the employee's name
    const [employeeName, setEmployeeName] = useState('Loading...'); 
    
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({ date: '', status: 'Present' });
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');

    // Fetch both records and the employee name
    const fetchData = async () => {
        try {
            // 1. Fetch attendance records
            const attRes = await api.get(`/attendance/${id}`);
            setRecords(attRes.data);

            // 2. Fetch employee list to get the specific name
            const empRes = await api.get('/employees/');
            const currentEmp = empRes.data.find(e => e.id === parseInt(id));
            
            if (currentEmp) {
                setEmployeeName(currentEmp.full_name);
            } else {
                setEmployeeName('Unknown Employee');
            }
        } catch (err) {
            console.error("Failed to fetch data", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await api.post('/attendance/', {
                employee_id: parseInt(id),
                date: formData.date,
                status: formData.status
            });
            
            // Clear the date field after successful submit/update
            setFormData({ ...formData, date: '' }); 
            
            // Refresh the table to show the updated status
            const attRes = await api.get(`/attendance/${id}`);
            setRecords(attRes.data);
        } catch (err) {
            alert(err.response?.data?.detail || "Failed to mark/update attendance.");
        }
    };

    const totalPresentDays = records.filter(r => r.status === 'Present').length;

    const filteredRecords = records.filter(record => {
        const isAfterFrom = fromDate ? record.date >= fromDate : true;
        const isBeforeTo = toDate ? record.date <= toDate : true;
        return isAfterFrom && isBeforeTo;
    });

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                {/* NEW: Displaying the employee's name dynamically */}
                <h2 className="text-2xl font-bold text-gray-800">
                    {employeeName}'s Attendance
                </h2>
                <Link to="/" className="text-blue-600 hover:underline text-sm font-medium">&larr; Back to Directory</Link>
            </div>

            {/* Total Present Days Summary Card */}
            <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg flex items-center justify-between">
                <div>
                    <h3 className="text-blue-800 font-semibold">Total Present Days</h3>
                    <p className="text-sm text-blue-600">All-time record for this employee</p>
                </div>
                <div className="text-3xl font-bold text-blue-700">{totalPresentDays}</div>
            </div>

            {/* Form to Mark Attendance */}
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex gap-4 items-end">
                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input type="date" required value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className="w-full border border-gray-300 rounded-md p-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                </div>
                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} className="w-full border border-gray-300 rounded-md p-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white">
                        <option value="Present">Present</option>
                        <option value="Absent">Absent</option>
                    </select>
                </div>
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition">Mark Attendance</button>
            </form>

            {/* Attendance History Table with Date Range Filter */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50 flex flex-wrap items-center gap-4">
                    <span className="text-sm font-medium text-gray-600">Filter Range:</span>
                    
                    <div className="flex items-center gap-2">
                        <label className="text-xs text-gray-500 uppercase tracking-wider">From</label>
                        <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="border border-gray-300 rounded p-1.5 text-sm outline-none focus:border-blue-500" />
                    </div>

                    <div className="flex items-center gap-2">
                        <label className="text-xs text-gray-500 uppercase tracking-wider">To</label>
                        <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="border border-gray-300 rounded p-1.5 text-sm outline-none focus:border-blue-500" />
                    </div>

                    {(fromDate || toDate) && (
                        <button onClick={() => { setFromDate(''); setToDate(''); }} className="text-sm text-red-500 hover:text-red-700 hover:underline font-medium ml-auto">
                            Clear Filters
                        </button>
                    )}
                </div>

                {loading ? (
                    <div className="p-8 text-center text-gray-500">Loading records...</div>
                ) : filteredRecords.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">No records found for this date range.</div>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="p-4 font-medium text-gray-600">Date</th>
                                <th className="p-4 font-medium text-gray-600">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredRecords.map(record => (
                                <tr key={record.id} className="hover:bg-gray-50 transition">
                                    <td className="p-4 text-gray-800">{record.date}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-sm font-medium ${record.status === 'Present' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{record.status}</span>
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