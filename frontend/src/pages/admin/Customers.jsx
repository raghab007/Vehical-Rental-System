import { useState, useEffect } from 'react';

function Customers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('http://localhost:4000/admin/user');
                if (!response.ok) {
                    throw new Error('Failed to fetch users');
                }
                const data = await response.json();
                setUsers(data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    if (loading) {
        return <div style={{ padding: "1.5rem" }}>Loading...</div>;
    }

    if (error) {
        return <div style={{ padding: "1.5rem" }}>Error: {error}</div>;
    }

    return (
        <div style={{ padding: "1.5rem" }}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "1rem", color: "#1f2937" }}>
                Customers
            </h2>
            <div style={{ backgroundColor: "#ffffff", borderRadius: "0.5rem", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)", padding: "1.5rem" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr style={{ borderBottom: "1px solid #e5e7eb" }}>
                        <th style={{ textAlign: "left", padding: "0.75rem", fontSize: "0.875rem", fontWeight: "600", color: "#374151" }}>Id</th>
                            <th style={{ textAlign: "left", padding: "0.75rem", fontSize: "0.875rem", fontWeight: "600", color: "#374151" }}>Name</th>
                            <th style={{ textAlign: "left", padding: "0.75rem", fontSize: "0.875rem", fontWeight: "600", color: "#374151" }}>Email</th>
                            <th style={{ textAlign: "left", padding: "0.75rem", fontSize: "0.875rem", fontWeight: "600", color: "#374151" }}>Phone</th>
                            <th style={{ textAlign: "left", padding: "0.75rem", fontSize: "0.875rem", fontWeight: "600", color: "#374151" }}>Address</th>
                            <th style={{ textAlign: "left", padding: "0.75rem", fontSize: "0.875rem", fontWeight: "600", color: "#374151" }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                               
                                <td style={{ padding: "0.75rem", fontSize: "0.875rem", color: "#374151" }}>{user.id}</td>
                                <td style={{ padding: "0.75rem", fontSize: "0.875rem", color: "#374151" }}>
                                    {user.firstName} {user.lastName}
                                </td>
                                <td style={{ padding: "0.75rem", fontSize: "0.875rem", color: "#374151" }}>{user.email}</td>
                                <td style={{ padding: "0.75rem", fontSize: "0.875rem", color: "#374151" }}>{user.contactNumber}</td>
                                <td style={{ padding: "0.75rem", fontSize: "0.875rem", color: "#374151" }}>{user.address}</td>
                                <td style={{ padding: "0.75rem", fontSize: "0.875rem", color: "#374151" }}>
                                    <button
                                        style={{
                                            color: "#3b82f6",
                                            background: "none",
                                            border: "none",
                                            cursor: "pointer",
                                            fontSize: "0.875rem",
                                            transition: "color 0.3s",
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.color = "#1d4ed8"}
                                        onMouseLeave={(e) => e.currentTarget.style.color = "#3b82f6"}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        style={{
                                            color: "#ef4444",
                                            background: "none",
                                            border: "none",
                                            cursor: "pointer",
                                            fontSize: "0.875rem",
                                            marginLeft: "0.5rem",
                                            transition: "color 0.3s",
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.color = "#dc2626"}
                                        onMouseLeave={(e) => e.currentTarget.style.color = "#ef4444"}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Customers;