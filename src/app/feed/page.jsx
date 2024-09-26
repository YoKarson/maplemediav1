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
    console.log("This is the userLikes array: ", userLikes);

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
        userLikes: arrayUnion(user.uid), // Add user ID to userLikes array
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
    console.log("This is the userDislikes array: ", userDislikes);

    // checking if the userDislikes array has the current user already inside
    if (userDislikes.includes(user.uid)) {
      console.log("You have already disliked this post.");
      return;
    }

    // if the current user is inside the userLike array
    // then we need to remove them from it and decrement a like
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

    // increment dislike and add the current userid to userDislike array
    try {
      const postRef = doc(firestore, "posts", postId);
      await updateDoc(postRef, {
        dislike: currentDislikes + 1,
        userDislikes: arrayUnion(user.uid),
      });
    } catch (error) {
      console.error("Error updating dislikes: ", error);
    }

    console.log("This is the userLikes array: ", userLikes);
  };

  const handleCommentButton = (postId) => {
    router.push(`/comments/${postId}`); // Navigate to the comments page with postId
  };

  return (
    <div className="feed p-4">
      {posts.map((post) => (
        <div key={post.id} className="post mb-4 bg-gray-800 p-4 rounded-lg">
          <p className="text-gray-400">
            Posted by: {usernames[post.userID] || "Loading..."}
          </p>
          <h1 className="text-white text-lg">{post.title}</h1>
          <p className="text-white">{post.description}</p>
          <img src={post.imageUrl} className="mt-2" alt={post.title} />
          <p>
            Likes: {post.like || 0} Dislikes: {post.dislike || 0} Comments:
            {post.numOfComments}
          </p>
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
          >
            Like
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
          >
            Dislike
          </button>
          <button onClick={() => handleCommentButton(post.id)}>Comment</button>
        </div>
      ))}
    </div>
  );
};

export default Feed;
