"use client";

import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@firebase/config";
import { useRouter } from "next/navigation";
import { doc, setDoc } from "firebase/firestore";
import { firestore } from "@firebase/config";

const Settings = () => {
  const [user] = useAuthState(auth);
  const [username, setUsername] = useState();
  const [gender, setGender] = useState("Not specified");
  const router = useRouter();

  if (!user) {
    // If no user is logged in, redirect to sign-in page
    // router.push("/signin");
    // return null;
  }

  const saveChanges = async () => {
    if (user) {
      try {
        // Create a document in Firestore with the user's ID and store the extra data
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

  return (
    <div className="bg-gray-900">
      <div className="w-full max-w-4xl bg-gray-800 p-10 rounded-lg shadow-xl">
        <h1 className="text-white text-3xl mb-8">Settings</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="mb-4">
            <label className="text-white block mb-2">Email</label>
            <input
              type="email"
              value={user.email}
              readOnly
              className="w-full p-3 bg-gray-700 rounded text-white"
            />
          </div>

          <div className="mb-4">
            <label className="text-white block mb-2">Username</label>
            <input
              type="text"
              value={user.username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="w-full p-3 bg-gray-700 rounded text-white"
            />
          </div>

          <div className="mb-4">
            <label className="text-white block mb-2">
              Gender (NOT WORKING YET)
            </label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full p-3 bg-gray-700 rounded text-white"
            >
              <option value="Not specified">Not specified</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Profile picture input */}
          <div className="mb-6">
            <label className="text-white block mb-2">
              Profile Picture (NOT WORKING YET)
            </label>
            <input
              type="file"
              accept="image/*"
              className="w-full p-3 bg-gray-700 rounded text-white"
            />
          </div>
        </div>

        {/* Save changes button */}
        <button
          onClick={saveChanges}
          className="w-full p-3 bg-indigo-600 rounded text-white hover:bg-indigo-500"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default Settings;
