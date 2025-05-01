import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { FaCheck, FaTimes, FaSpinner } from 'react-icons/fa';

function ExtensionRequests() {
    const [extensions, setExtensions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        fetchExtensions();
    }, []);

    const fetchExtensions = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/extension/all', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            console.log(response.data)
            setExtensions(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching extensions:', error);
            setLoading(false);
        }
    };

    const handleApprove = async (extensionId) => {
        try {
            setProcessing(true);
            await axios.post('http://localhost:4000/api/extension/process', {
                extensionId,
                action: 'approve'
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            fetchExtensions();
        } catch (error) {
            console.error('Error approving extension:', error);
        } finally {
            setProcessing(false);
        }
    };

    const handleReject = async (extensionId) => {
        try {
            setProcessing(true);
            await axios.post('http://localhost:4000/api/extension/process', {
                extensionId,
                action: 'reject'
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            fetchExtensions();
        } catch (error) {
            console.error('Error rejecting extension:', error);
        } finally {
            setProcessing(false);
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'pending':
                return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">Pending</span>;
            case 'approved':
                return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Approved</span>;
            case 'rejected':
                return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">Rejected</span>;
            default:
                return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">Unknown</span>;
        }
    };

    return (
        <div className="w-full px-4 py-6">
            <h1 className="text-2xl font-bold mb-6">Rental Extension Requests</h1>
            
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <FaSpinner className="animate-spin text-4xl text-blue-500" />
                </div>
            ) : (
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="overflow-x-auto w-full">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Customer</th>
                                    <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Vehicle</th>
                                    <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Current End Date</th>
                                    <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Requested at</th>
                                
                                    <th className="px-1 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Requested End Date</th>
                                    <th className="px-1 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Additional Amount</th>
                                    <th className="px-1 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Payment Status</th>
                                    <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Status</th>
                                    <th className="px-1 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {extensions.length === 0 ? (
                                    <tr>
                                        <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                                            No extension requests found
                                        </td>
                                    </tr>
                                ) : (
                                    extensions.map((extension) => (
                                        <tr key={extension.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {extension.rental.user.firstName} {extension.rental.user.lastName}
                                                </div>
                                                <div className="text-sm text-gray-500">{extension.rental.user.email}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {extension.rental.vehicle.vehicleName}
                                                </div>
                                                <div className="text-sm text-gray-500">{extension.rental.vehicle.model}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {format(new Date(extension.rental.endTime), 'MMM dd, yyyy hh:mm a')}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {format(new Date(extension.createdAt), 'MMM dd, yyyy hh:mm a')}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {format(new Date(extension.requestedEndTime), 'MMM dd, yyyy hh:mm a')}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                Rs. {extension.additionalAmount}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {extension.paymentStatus === 'paid' ? (
                                                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Paid</span>
                                                ) : (
                                                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">Pending</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {getStatusBadge(extension.status)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                {extension.status === 'pending' && (
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() => handleApprove(extension.id)}
                                                            disabled={processing}
                                                            className="text-green-600 hover:text-green-900 flex items-center"
                                                        >
                                                            {processing ? (
                                                                <FaSpinner className="animate-spin mr-1" />
                                                            ) : (
                                                                <FaCheck className="mr-1" />
                                                            )}
                                                            Approve
                                                        </button>
                                                        <button
                                                            onClick={() => handleReject(extension.id)}
                                                            disabled={processing}
                                                            className="text-red-600 hover:text-red-900 flex items-center"
                                                        >
                                                            <FaTimes className="mr-1" />
                                                            Reject
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExtensionRequests;