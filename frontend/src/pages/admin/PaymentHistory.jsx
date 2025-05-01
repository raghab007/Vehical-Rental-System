import React from "react";

function PaymentHistory() {
  // Sample payment data
  const payments = [
    {
      id: "TX123456",
      date: "2023-10-01",
      amount: "$50.00",
      status: "Completed",
    },
    {
      id: "TX123457",
      date: "2023-10-02",
      amount: "$75.00",
      status: "Pending",
    },
    {
      id: "TX123458",
      date: "2023-10-03",
      amount: "$100.00",
      status: "Completed",
    },
    {
      id: "TX123459",
      date: "2023-10-04",
      amount: "$45.00",
      status: "Failed",
    },
  ];

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Payment History</h1>

      {/* Payment Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Transaction ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {payments.map((payment) => (
              <tr key={payment.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {payment.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {payment.date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {payment.amount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      payment.status === "Completed"
                        ? "bg-green-100 text-green-800"
                        : payment.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {payment.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PaymentHistory;