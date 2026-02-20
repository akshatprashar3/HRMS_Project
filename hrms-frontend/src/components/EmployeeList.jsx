import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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

    const totalEmployees = employees.length;
    const totalDepartments = new Set(employees.map(emp => emp.department)).size;

    return (
        <div className="space-y-6">
            {/* Dashboard Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Total Employees</p>
                        <h3 className="text-3xl font-bold text-gray-800">{totalEmployees}</h3>
                    </div>
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-full">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Active Departments</p>
                        <h3 className="text-3xl font-bold text-gray-800">{totalDepartments}</h3>
                    </div>
                    <div className="p-3 bg-green-50 text-green-600 rounded-full">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                    </div>
                </div>
            </div>

            {/* Employee Table */}
            {employees.length === 0 ? (
                <div className="p-8 text-center text-gray-500 text-lg bg-white rounded shadow-sm border border-gray-100">No employees found. Click "Add Employee" to get started!</div>
            ) : (
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
                                        <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm">{emp.department}</span>
                                    </td>
                                    <td className="p-4 flex gap-4">
                                        <Link to={`/attendance/${emp.id}`} className="text-blue-600 hover:text-blue-800 font-medium text-sm transition">Attendance</Link>
                                        <button onClick={() => handleDelete(emp.id)} className="text-red-500 hover:text-red-700 font-medium text-sm transition">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}