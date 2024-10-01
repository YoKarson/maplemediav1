"use client";
import "@styles/globals.css";

import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore } from "@firebase/config";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import Feed from "./feed/page";

const Home = () => {
  const [user] = useAuthState(auth);
  const [username, setUsername] = useState(""); // State for storing username
  const router = useRouter();

  // Fetch the username from Firestore when the user is logged in
  useEffect(() => {
    const fetchUsername = async () => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(firestore, "users", user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUsername(userData.username); // Set the username from Firestore
          }
        } catch (error) {
          console.error("Error fetching username:", error);
        }
      }
    };

    fetchUsername();
  }, [user]);

  return (
    <div className="mt-20 min-h-screen bg-gray-900 text-white">
      <div className="flex justify-center items-center p-4 space-x-4">
        <h1 className="text-3xl mb-4">
          Welcome, {username ? username : "Anonmygo"}!
        </h1>
      </div>

      <Feed />
    </div>
  );
};

export default Home;
