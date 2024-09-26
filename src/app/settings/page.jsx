"use client";

import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@firebase/config";
import { useRouter } from "next/navigation";
import { doc, setDoc } from "firebase/firestore";
import { firestore } from "@firebase/config";

const Settings = () => {
  const [user] = useAuthState(auth);
  const [username, setUsername] = useState("");
  const [gender, setGender] = useState("Not specified");
  const router = useRouter();

  // xd

  // Ensure this only runs on the client side
  useEffect(() => {
    if (typeof window !== "undefined" && !user) {
      router.push("/signin");
    }
  }, [user, router]);

  // Save changes to Firestore (client-side only)
  const saveChanges = async () => {
    if (user && typeof window !== "undefined") {
      try {
        await setDoc(doc(firestore, "users", user.uid), {
          username: username,
          gender: gender,
        });
        console.log("User data updated successfully");
      } catch (error) {
        console.error("There was an error saving user data", error);
      }
    }
  };

  return user ? (
    <div className="bg-gray-900 min-h-screen p-6">
      <div className="w-full max-w-4xl mx-auto bg-gray-800 p-10 rounded-lg shadow-md">
        <h2 className="text-white text-2xl mb-6">User Settings</h2>

        <div className="mb-4">
          <label
            className="block text-gray-400 text-sm mb-2"
            htmlFor="username"
          >
            Username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 bg-gray-700 text-white rounded"
            placeholder="Enter your username"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-400 text-sm mb-2">Gender</label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="w-full p-2 bg-gray-700 text-white rounded"
          >
            <option value="Not specified">Not specified</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <button
          onClick={saveChanges}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          Save Changes
        </button>
      </div>
    </div>
  ) : (
    <div className="text-center text-white mt-10">
      Redirecting to sign-in...
    </div>
  );
};

export default Settings;
