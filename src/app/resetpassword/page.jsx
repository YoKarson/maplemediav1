"use client";

import { useState } from "react";
import { auth } from "@firebase/config";
import { sendPasswordResetEmail } from "firebase/auth";
import Link from "next/link";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState(null);

  const handleResetPassword = async () => {
    if (!email) {
      setMessage("Please enter a valid email.");
      return;
    }

    try {
      setIsSending(true);
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset link sent. Please check your inbox.");
      setEmail("");
    } catch (error) {
      console.error("Error sending password reset email:", error);
      setMessage("Failed to send reset link. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-gray-800 p-10 rounded-lg shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-semibold text-white mb-6 text-center">
          Reset Your Password
        </h1>
        <input
          type="email"
          placeholder="Enter your email..."
          className="w-full p-3 rounded-lg mb-4 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {message && (
          <p className="text-center text-sm text-red-500 mb-4">{message}</p>
        )}
        <button
          onClick={handleResetPassword}
          className={`w-full p-3 rounded-lg font-semibold text-white bg-blue-500 hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 ${
            isSending ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={isSending}
        >
          {isSending ? "Sending..." : "Send Password Reset Link"}
        </button>
        <Link href="/signin">
          <button className="mt-5 w-full p-3 rounded-lg font-semibold text-white bg-blue-500 hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105">
            Return to Sign In
          </button>
        </Link>
      </div>
    </div>
  );
};

export default ResetPassword;
