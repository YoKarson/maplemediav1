"use client";
import { useState, useEffect } from "react";
import { firestore } from "@firebase/config";
import { useRouter } from "next/navigation";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@firebase/config";

const YourPosts = () => {
  const [posts, setPosts] = useState([]);
  const [user] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(firestore, "posts"),
      where("userID", "==", user.uid), // Filter by current user's posts
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedPosts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(fetchedPosts);
    });

    return () => unsubscribe();
  }, [user]);

  const handleDeletePost = async (postId) => {
    try {
      await deleteDoc(doc(firestore, "posts", postId));
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
    } catch (error) {
      console.error("Error deleting post: ", error);
    }
  };

  const handleCommentButton = (postId) => {
    router.push(`/comments/${postId}`);
  };

  return (
    <div className="flex flex-col items-center justify-center feed p-4 w-screen">
      {posts.map((post) => (
        <div
          key={post.id}
          className="mt-40 flex flex-col items-center min-h-64 min-w-1/2 post mb-4 bg-gray-800 p-4 rounded-lg"
        >
          <p className="font-serif text-white text-6xl">{post.title}</p>
          <p className="font-serif text-white text-3x1">{post.description}</p>

          {post.imageUrl && (
            <img
              src={post.imageUrl}
              className="mt-2 object-cover max-w-[500px] max-h-[500px]"
              alt={post.title}
            />
          )}

          {/* Display likes and dislikes count */}
          <div className="text-white mt-2">
            <p>👍 Likes: {post.likes || 0}</p>
            <p>👎 Dislikes: {post.dislikes || 0}</p>
          </div>

          <div className="flex space-x-4 mt-2">
            <button
              onClick={() => handleCommentButton(post.id)}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Comments
            </button>
            <button
              onClick={() => handleDeletePost(post.id)}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Delete Post
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default YourPosts;
