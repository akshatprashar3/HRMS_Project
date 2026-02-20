import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // <-- This is what was likely missing!
import { api } from '../api';

export default function EmployeeList() {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        api.get('/employees/')
            .then(res => setEmployees(res.data))
            .catch(err => {
                console.error(err);
                setError("Failed to fetch employees.");
            })
            .finally(() => setLoading(false));
    }, []);

    const handleDelete = async (id) => {
        if(window.confirm("Are you sure you want to delete this employee?")) {
            try {
                await api.delete(`/employees/${id}`);
                setEmployees(employees.filter(e => e.id !== id));
            } catch (err) {
                alert("Failed to delete employee.");
            }
        }
    }

    if (loading) return <div className="p-8 text-center text-gray-500 text-lg">Loading employees...</div>;
    if (error) return <div className="p-8 text-center text-red-500 text-lg">{error}</div>;
    if (employees.length === 0) return <div className="p-8 text-center text-gray-500 text-lg bg-white rounded shadow-sm border border-gray-100">No employees found. Click "Add Employee" to get started!</div>;

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                        <th className="p-4 font-medium text-gray-600">Emp ID</th>
                        <th className="p-4 font-medium text-gray-600">Name</th>
                        <th className="p-4 font-medium text-gray-600">Email</th>
                        <th className="p-4 font-medium text-gray-600">Department</th>
                        <th className="p-4 font-medium text-gray-600">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {employees.map(emp => (
                        <tr key={emp.id} className="hover:bg-blue-50 transition-colors">
                            <td className="p-4 text-gray-800">{emp.employee_id}</td>
                            <td className="p-4 text-gray-800 font-medium">{emp.full_name}</td>
                            <td className="p-4 text-gray-600">{emp.email}</td>
                            <td className="p-4 text-gray-600">
                                <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm">
                                    {emp.department}
                                </span>
                            </td>
                            <td className="p-4 flex gap-4">
                                {/* The new Attendance Link */}
                                <Link 
                                    to={`/attendance/${emp.id}`} 
                                    className="text-blue-600 hover:text-blue-800 font-medium text-sm transition"
                                >
                                    Attendance
                                </Link>
                                <button 
                                    onClick={() => handleDelete(emp.id)}
                                    className="text-red-500 hover:text-red-700 font-medium text-sm transition"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}