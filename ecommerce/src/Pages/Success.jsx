import React, { useEffect, useState } from "react";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { useDispatch } from "react-redux";
import { cartItemCount } from "../ReduxStore/AuthSlice";
import { useNavigate } from "react-router-dom";
function PaymentPage() {
  const [status, setStatus] = useState("processing"); 
  const [cart, setCart] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_GET_CART}`, {
        method: "GET",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch cart");
      const data = await res.json();
      setCart(data.message.cart);
      dispatch(cartItemCount(data.message.cart.items.length));
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleCheckout = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_PLACE_ORDER}`, {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Failed to place the order. Please try again.");
      }

      const data = await res.json();
      console.log("Order Response:", data);

      // ✅ Update payment status
      setStatus("success");
      await fetchCart();
      navigate('/orders');
      
    } catch (error) {
      console.error("Error placing order:", error);
      setStatus("failed");
    }
  };

  useEffect(() => {
    const processPayment = async () => {
      await fetchCart();
      await handleCheckout();
    };
    processPayment();
  }, []);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      {status === "processing" && (
        <div className="flex flex-col items-center space-y-4 p-6 bg-white rounded-2xl shadow-lg">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
          <h2 className="text-xl font-semibold text-gray-800">
            Processing your payment...
          </h2>
          <p className="text-gray-500 text-sm text-center">
            Please wait a moment while we confirm your transaction.
          </p>
        </div>
      )}

      {status === "success" && (
        <div className="flex flex-col items-center space-y-4 p-6 bg-white rounded-2xl shadow-lg">
          <CheckCircle2 className="w-12 h-12 text-green-600" />
          <h2 className="text-xl font-semibold text-gray-800">
            Payment Successful 🎉
          </h2>
          <p className="text-gray-500 text-sm text-center">
            Thank you! Your payment has been processed successfully.
          </p>
        </div>
      )}

      {status === "failed" && (
        <div className="flex flex-col items-center space-y-4 p-6 bg-white rounded-2xl shadow-lg">
          <XCircle className="w-12 h-12 text-red-600" />
          <h2 className="text-xl font-semibold text-gray-800">
            Payment Failed ❌
          </h2>
          <p className="text-gray-500 text-sm text-center">
            Oops! Something went wrong. Please try again.
          </p>
          <button
            onClick={() => {
              setStatus("processing");
              handleCheckout();
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      )}
    </div>
  );
}

export default PaymentPage;
