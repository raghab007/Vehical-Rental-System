import axios from 'axios';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { userSelector } from '../store/atoms';

function VerifyPayment() {
  const [searchParams] = useSearchParams();
  const [downloadReady, setDownloadReady] = useState(false);
  const [userState, setUserState] = useRecoilState(userSelector)
  
  // Get individual parameters
  const pidx = searchParams.get('pidx');
  const txnId = searchParams.get('txnId');
  const amount = searchParams.get('amount');
  const status = searchParams.get("status");
  
  useEffect(() => {
    async function updateRental() {
      try {
        const rentalId = localStorage.getItem("rentalId");
        if (!rentalId) {
          console.warn("No rentalId found in localStorage.");
          return;
        }
        await axios.post("http://localhost:4000/rental/update", {
          rentalId: rentalId,
          amount: parseInt(localStorage.getItem("amount"))
        });
        console.log("Rental update successful.");
        setDownloadReady(true);
      } catch (error) {
        console.error("Error updating rental:", error);
      }
    }
    
    if (status === "Completed") {
      updateRental();
    }
  }, [status]);

  const handleGoToProfile = () => {
    window.location.href = "/profile";
  };

  const handleDownloadBill = () => {
    // Create a simple text representation of the bill
    const billContent = 
                            `Payment Receipt
                            ----------------
                            Payment ID: ${pidx}
                            Transaction ID: ${txnId}
                            Amount: ${amount/100}
                            Status: ${status}
                            Date: ${new Date().toLocaleString()}
                            UserName:${userState.firstName+ " "+userState.lastName}
                            `;

    // Create a blob and download link
    const blob = new Blob([billContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `payment-receipt-${txnId}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">
        {status === "Completed" ? "Payment Successful" : "Payment Failed"}
      </h2>
      
      <div className="mb-6 border p-4 rounded-md bg-gray-50">
        <p className="mb-2"><strong>Payment ID:</strong> {pidx}</p>
        <p className="mb-2"><strong>Transaction ID:</strong> {txnId}</p>
        <p className="mb-2"><strong>Amount:</strong> {amount/100}</p>
        <p className={`font-bold ${status === "Completed" ? "text-green-600" : "text-red-600"}`}>
          <strong>Status:</strong> {status}
        </p>
        <p className='mb-2'><strong>Date: </strong>{new Date().toLocaleString()}</p>
       <p className='mb-2'> <strong>UserName:</strong> {userState.firstName+ " "+userState.lastName}</p>
      </div>
      
      {status === "Completed" ? (
        <div className="flex flex-col gap-4">
          <button 
            onClick={handleGoToProfile}
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Go to Profile
          </button>
          
          <button 
            onClick={handleDownloadBill}
            className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
          >
            Download Receipt
          </button>
        </div>
      ) : (
        <div className="text-center text-red-600 mb-4">
          <p>Your payment could not be processed. Please try again or contact support.</p>
        </div>
      )}
    </div>
  );
}

export default VerifyPayment;