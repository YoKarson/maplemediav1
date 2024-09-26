"use client";
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@firebase/config";
import "@styles/globals.css";
import Link from "next/link";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const createAccount = async () => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      console.log({ res });
      setEmail("");
      setPassword("");
    } catch (error) {
      console.log("There was an error creating account");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Top Navbar */}
      <nav className="bg-gray-800 p-4 shadow-md">
        <div className="flex justify-between items-center">
          <div className="text-2xl font-bold text-white">Maple Media</div>
          <div className="space-x-4">
            <Link href="/about">
              <button className="text-gray-300 hover:text-white transition duration-200">
                About Me
              </button>
            </Link>
            <Link href="/contact">
              <button className="text-gray-300 hover:text-white transition duration-200">
                Contact
              </button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-gray-800 p-10 rounded-lg shadow-xl w-96">
          <h1 className="text-white text-3xl font-semibold text-center mb-6">
            Sign Up
          </h1>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 mb-4 bg-gray-700 rounded-lg text-white placeholder-gray-400 transition duration-200 focus:outline-none focus:ring focus:ring-indigo-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 mb-4 bg-gray-700 rounded-lg text-white placeholder-gray-400 transition duration-200 focus:outline-none focus:ring focus:ring-indigo-500"
          />
          <button
            onClick={createAccount}
            className="w-full p-3 bg-indigo-600 rounded-lg text-white font-semibold hover:bg-indigo-500 transition duration-200"
          >
            Sign Up
          </button>
          <div className="text-white text-center mt-4">
            <p>Already have an account? </p>
            <Link href="/signin">
              <button className="text-indigo-400 hover:underline">
                Sign In Here
              </button>
            </Link>
          </div>
          <hr className="my-6 border-gray-600" />
          <div className="text-gray-400 text-sm text-center">
            <p>Or sign up with:</p>
            <div className="flex justify-center space-x-4 mt-2">
              <button className="flex items-center bg-white text-gray-800 rounded-lg p-2 hover:bg-gray-200 transition duration-200">
                Google
              </button>
              <button className="flex items-center bg-white text-gray-800 rounded-lg p-2 hover:bg-gray-200 transition duration-200">
                Facebook
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
