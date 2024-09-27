"use client";
import { signOut } from "firebase/auth"; // Import signOut method
import { auth } from "@firebase/config"; // Ensure this path is correct
import { useRouter } from "next/navigation"; // Import useRouter for navigation
import { useState } from "react"; // Import useState for managing state

const SignOut = () => {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false); // State to manage confirmation prompt

  const handleSignOut = async () => {
    try {
      await signOut(auth); // Log the user out
      router.push("/signin"); // Redirect to sign-in page after logging out
    } catch (error) {
      console.error("Error signing out: ", error); // Handle errors if needed
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <h1 className="text-white text-xl mb-4">
          Are you sure you want to sign out?
        </h1>
        <div className="flex justify-around">
          <button
            onClick={handleSignOut}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Yes
          </button>
          <button
            onClick={() => router.push("/")} // Redirect to home page
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            No
          </button>
        </div>
      </div>

      <div></div>
    </div>
  );
};

export default SignOut;
