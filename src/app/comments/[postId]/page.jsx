"use client";

import { useState, useEffect } from "react";
import { firestore } from "@firebase/config"; // Your Firebase config
import {
  collection,
  addDoc,
  updateDoc,
  onSnapshot,
  serverTimestamp,
  doc,
  getDoc,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@firebase/config";

const Comments = ({ params }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [user] = useAuthState(auth);
  const [post, setPost] = useState(null); // State for post data
  const { postId } = params; // Get postId from the URL
  const [username, setUsername] = useState("");

  // Fetch comments
  useEffect(() => {
    if (!postId) return; // Prevent fetching before postId is available

    const commentsRef = collection(firestore, "posts", postId, "comments");

    const unsubscribe = onSnapshot(commentsRef, (snapshot) => {
      const fetchedComments = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log("Fetched Comments:", fetchedComments); // Debug log
      setComments(fetchedComments);
    });

    return () => unsubscribe();
  }, [postId]);

  // Fetch post data
  useEffect(() => {
    const fetchPost = async () => {
      if (!postId) return;
      const postRef = doc(firestore, "posts", postId);
      const postDoc = await getDoc(postRef);
      if (postDoc.exists()) {
        setPost(postDoc.data());
      }
    };

    fetchPost();
  }, [postId]);

  // Handle adding new comment
  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const postRef = doc(firestore, "posts", postId);

      // Ensure the user is authenticated before trying to access user.uid
      if (!user) {
        console.error("User is not authenticated");
        return;
      }

      // Safely access numOfComments and default to 0 if it's not defined
      const currentNumOfComments = post?.numOfComments || 0;

      // Update numOfComments in the post document
      await updateDoc(postRef, {
        numOfComments: currentNumOfComments + 1,
      });

      // Add the new comment to the comments collection
      await addDoc(collection(firestore, "posts", postId, "comments"), {
        text: newComment,
        userID: user.uid, // Use user.uid as userId
        username: username || "Anonmygo",
        createdAt: serverTimestamp(),
      });

      // Clear the comment input
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment: ", error);
    }
  };

  // Fetch the username from Firestore when the user is logged in
  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const userDoc = await getDoc(
          doc(firestore, "posts", postId, "comments")
        );
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUsername(userData.username || "Anonmygo"); // Set the username from Firestore
        }
      } catch (error) {
        console.error("Error fetching username:", error);
      }
    };

    fetchUsername();
  }, [postId]);

  return (
    <div className="comments p-4 bg-gray-800 rounded-lg mt-40">
      {post ? (
        <div className="post-details mb-4">
          <p className="font-serif text-white">
            Posted by: {post.username || "Anonmygo"}
          </p>
          <p className="font-serif text-white text-6xl">{post.title}</p>
          <p className="font-serif text-white text-3xl">{post.description}</p>
          {post.imageUrl && (
            <img
              src={post.imageUrl}
              className="mt-2 object-cover max-w-[500px] max-h-[500px]"
              alt={post.title}
            />
          )}
        </div>
      ) : (
        <p className="text-gray-400">Loading post...</p>
      )}
      <textarea
        placeholder="Add a comment"
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        className="w-full mb-2 p-2 bg-gray-700 text-white rounded"
      />
      <button
        onClick={handleAddComment}
        className="bg-indigo-600 p-2 rounded text-white"
      >
        Submit Comment
      </button>

      <h2 className="text-white mt-4">Comments</h2>
      <div>
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="comment p-2 mb-2 bg-gray-700 rounded"
            >
              <h2 className="text-gray-400">
                Posted by: {username || "Anonmygo"}
              </h2>

              <p className="text-white">{comment.text}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No comments yet.</p>
        )}
      </div>
    </div>
  );
};

export default Comments;
