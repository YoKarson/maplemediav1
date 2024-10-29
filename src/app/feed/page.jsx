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
import Image from "next/image";

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
    if (!user) {
      alert("Sorry, only logged in users can Like posts.");
      return;
    }

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
    if (!user) {
      alert("Sorry, only logged in users can Dislike posts.");
      return;
    }

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
    if (!user) {
      alert("Sorry, only logged in users can view/comment on posts.");
      return;
    }

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
      {posts.map((post) => (
        <div
          key={post.id}
          className="flex flex-col items-center min-h-64  min-w-1/2 post mb-4 bg-gray-800 p-4 rounded-lg"
        >
          {/* Align "Posted by" to the left */}
          <p className="text-gray-400 text-left mb-2">
            Posted by: {usernames[post.userID] || "Anonmygo"}
          </p>

          {/* Post Title and Description */}
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

          <div className="flex flex-row space-between">
            <div className="flex space-x-4 mt-2">
              <button
                onClick={() =>
                  handleLikeButton(
                    post.id,
                    post.like,
                    post.userLikes || [],
                    post.dislike,
                    post.userDislikes || []
                  )
                }
                className="flex items-center space-x-2" // Add flex and space between
              >
                <Image
                  src="/images/SuperAmyyLove_sticker.png"
                  alt="Thumbs Up"
                  width={40}
                  height={40}
                />
                <span>{post.like || 0}</span> {/* Wrap the count in a span */}
              </button>

              <button
                onClick={() =>
                  handleDislikeButton(
                    post.id,
                    post.dislike,
                    post.userDislikes || [],
                    post.like,
                    post.userLikes || []
                  )
                }
                className="flex items-center space-x-2" // Add flex and space between
              >
                <Image
                  src="/images/SuperAmyy_Reee320.png"
                  alt="Thumbs Down"
                  width={40}
                  height={40}
                />
                <span>{post.dislike || 0}</span>{" "}
                {/* Wrap the count in a span */}
              </button>

              <button
                onClick={() => handleCommentButton(post.id)}
                className="flex items-center space-x-2"
              >
                {" "}
                {/* Add flex and space between */}
                <Image
                  src="/images/Comments.png"
                  alt="Thumbs Up"
                  width={40}
                  height={40}
                />
                <span>{post.numOfComments}</span>{" "}
                {/* Wrap the count in a span */}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Feed;
