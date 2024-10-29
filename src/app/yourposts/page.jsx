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
import Image from "next/image";

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

  const formatDescription = (description) => {
    const words = description.split(" ");
    const formattedDescription = [];

    for (let i = 0; i < words.length; i += 15) {
      formattedDescription.push(words.slice(i, i + 15).join(" "));
    }

    return formattedDescription;
  };

  return (
    <div className="flex flex-col items-center justify-center feed p-4 w-screen">
      {posts.length === 0 ? (
        <h1 className="text-white mt-20 text-4xl">You Have No Posts</h1>
      ) : (
        posts.map((post) => (
          <div
            key={post.id}
            className="mt-40 flex flex-col items-center min-h-64 min-w-1/2 post mb-4 bg-gray-800 p-4 rounded-lg"
          >
            <p className="font-serif text-white text-6xl">{post.title}</p>
            <p className="font-serif text-white text-3x1">
              {formatDescription(post.description).map((line, index) => (
                <span key={index}>
                  {line}
                  <br />
                </span>
              ))}
            </p>

            {post.imageUrl && (
              <img
                src={post.imageUrl}
                className="mt-2 object-cover max-w-[500px] max-h-[500px]"
                alt={post.title}
              />
            )}
            {/* Display likes and dislikes count */}
            <div className="flex flex-row space-between space-x-4 text-white mt-2">
              <Image
                src="/images/SuperAmyyLove_sticker.png"
                alt="Thumbs Up"
                width={40}
                height={40}
              />
              {post.likes || 0}
              <Image
                src="/images/SuperAmyy_Reee320.png"
                alt="Thumbs Down"
                width={40}
                height={40}
              />{" "}
              {post.dislikes || 0}
              <Image
                src="/images/Comments.png"
                alt="Thumbs Up"
                width={40}
                height={40}
              />
              {post.comments || 0}
            </div>

            <div className="flex space-x-4 mt-2">
              <button
                onClick={() => handleCommentButton(post.id)}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                View Your Post
              </button>
              <button
                onClick={() => handleDeletePost(post.id)}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Delete Post
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default YourPosts;
