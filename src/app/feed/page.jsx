"use client";
import { useState, useEffect } from "react";
import { firestore } from "@firebase/config";
import { useRouter } from "next/navigation";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  getDoc,
  updateDoc,
  arrayRemove,
  arrayUnion,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@firebase/config";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [usernames, setUsernames] = useState({});
  const [user] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    const q = query(
      collection(firestore, "posts"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const fetchedPosts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const userIdSet = new Set(fetchedPosts.map((post) => post.userID));
      const userNamesToFetch = Array.from(userIdSet);
      const usernameMap = {};

      await Promise.all(
        userNamesToFetch.map(async (userID) => {
          const userDoc = await getDoc(doc(firestore, "users", userID));
          if (userDoc.exists()) {
            usernameMap[userID] = userDoc.data().username;
          }
        })
      );

      setUsernames(usernameMap);
      setPosts(fetchedPosts);
    });

    return () => unsubscribe();
  }, []);

  const handleLikeButton = async (
    postId,
    currentLikes,
    userLikes,
    currentDislikes,
    userDislikes
  ) => {
    if (userLikes.includes(user.uid)) {
      console.log("You have already liked this post.");
      return;
    }

    if (userDislikes.includes(user.uid)) {
      try {
        const postRef = doc(firestore, "posts", postId);
        await updateDoc(postRef, {
          dislike: currentDislikes - 1,
          userDislikes: arrayRemove(user.uid),
        });
      } catch (error) {
        console.error("Error subtracting a dislike: ", error);
      }
    }

    try {
      const postRef = doc(firestore, "posts", postId);
      await updateDoc(postRef, {
        like: currentLikes + 1,
        userLikes: arrayUnion(user.uid),
      });
    } catch (error) {
      console.error("Error updating likes: ", error);
    }
  };

  const handleDislikeButton = async (
    postId,
    currentDislikes,
    userDislikes,
    currentLikes,
    userLikes
  ) => {
    if (userDislikes.includes(user.uid)) {
      console.log("You have already disliked this post.");
      return;
    }

    if (userLikes.includes(user.uid)) {
      try {
        const postRef = doc(firestore, "posts", postId);
        await updateDoc(postRef, {
          like: currentLikes - 1,
          userLikes: arrayRemove(user.uid),
        });
      } catch (error) {
        console.error("Error subtracting a like: ", error);
      }
    }

    try {
      const postRef = doc(firestore, "posts", postId);
      await updateDoc(postRef, {
        dislike: currentDislikes + 1,
        userDislikes: arrayUnion(user.uid),
      });
    } catch (error) {
      console.error("Error updating dislikes: ", error);
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
          className="flex flex-col items-center min-h-64  min-w-1/2 post mb-4 bg-gray-800 p-4 rounded-lg"
        >
          {/* Align "Posted by" to the left */}
          <p className="text-gray-400 text-left mb-2">
            Posted by: {usernames[post.userID] || "Loading..."}
          </p>

          {/* Post Title and Description */}
          <p className="font-serif text-white text-6xl">{post.title}</p>
          <p className="font-serif text-white text-3x1">{post.description}</p>

          {post.imageUrl && (
            <img
              src={post.imageUrl}
              className="mt-2 object-cover max-w-[500px] max-h-[500px]"
              alt={post.title}
            />
          )}

          <p className="text-white mt-2">
            Likes: {post.like || 0} Dislikes: {post.dislike || 0} Comments:{" "}
            {post.numOfComments}
          </p>

          <div className="flex space-x-4 mt-2">
            <button
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-4 rounded"
              onClick={() =>
                handleLikeButton(
                  post.id,
                  post.like,
                  post.userLikes || [],
                  post.dislike,
                  post.userDislikes || []
                )
              }
            >
              Like
            </button>

            <button
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-4 rounded"
              onClick={() =>
                handleDislikeButton(
                  post.id,
                  post.dislike,
                  post.userDislikes || [],
                  post.like,
                  post.userLikes || []
                )
              }
            >
              Dislike
            </button>

            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded"
              onClick={() => handleCommentButton(post.id)}
            >
              Comment
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Feed;
