"use client";

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

  /*if (!user) {
    router.push("/signin");
    return null;
  }
*/
  return (
    <div className="w-96 min-h-screen bg-gray-900 text-white">
      <div className="p-4">
        <h1 className="text-3xl mb-4">Welcome, {username}</h1>
        <button
          onClick={() => {
            signOut(auth);
            router.push("/signin");
          }}
          className="bg-blue-600 hover:bg-blue-700 p-2 rounded text-white transition duration-200"
        >
          Log Out
        </button>

        <button
          onClick={() => {
            router.push("/createpost");
          }}
          className="bg-green-600 hover:bg-green-700 p-2 rounded text-white transition duration-200"
        >
          Create Post
        </button>
      </div>

      {/* Feed */}
      <Feed />
    </div>
  );
};

export default Home;
