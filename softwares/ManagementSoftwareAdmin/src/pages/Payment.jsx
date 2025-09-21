import React from "react";
import img from "../payment.jpg";

const Payment = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Payment</h1>
      <img
        src={img}
        alt="Payment"
        className="rounded-lg shadow-md max-w-md w-full"
      />
    </div>
  );
};

export default Payment;
