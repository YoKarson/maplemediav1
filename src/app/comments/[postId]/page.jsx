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
      const userRef = doc(firestore, "users", userId);

      // Safely access numOfComments and default to 0 if it's not defined
      const currentNumOfComments = post?.numOfComments || 0;

      // Update numOfComments in the post document
      await updateDoc(postRef, {
        numOfComments: currentNumOfComments + 1,
      });

      // Add the new comment to the comments collection
      await addDoc(collection(firestore, "posts", postId, "comments"), {
        text: newComment,
        userID: user.uid,
        createdAt: serverTimestamp(),
      });

      // Clear the comment input
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment: ", error);
    }
  };

  return (
    <div className="comments p-4 bg-gray-800 rounded-lg">
      {post ? (
        <div className="post-details mb-4">
          <h1 className="text-white text-lg">{post.title}</h1>
          <p className="text-gray-400">{post.description}</p>
        </div>
      ) : (
        <p className="text-gray-400">Loading post...</p>
      )}

      <h2 className="text-white mt-4">Comments</h2>
      <div>
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="comment p-2 mb-2 bg-gray-700 rounded"
            >
              <p className="text-white">{comment.text}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-400">No comments yet.</p>
        )}
      </div>
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
    </div>
  );
};

export default Comments;