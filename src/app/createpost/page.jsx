"use client";

import { useState } from "react";
import { storage, firestore, auth } from "@firebase/config"; // Assuming this points to your Firebase config
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, getStorage } from "firebase/storage";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);
  const [image, setImage] = useState(null); // Store the file itself
  const [like, setLike] = useState(0);
  const [dislike, setDislike] = useState(0);
  const [userLike, setUserLike] = useState([]);
  const [userDislike, setUserDislike] = useState([]);
  const [numOfComments, setNumOfComments] = useState(0);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]); // Set the image file
  };

  const handleSubmit = async () => {
    setUploading(true);

    try {
      let imageUrl = "";
      const storageRef = getStorage(); // Make sure this is properly imported and configured

      // Upload image to Firebase Storage if there's an image
      if (image) {
        const imageRef = ref(storageRef, `images/${image.name}`);
        await uploadBytes(imageRef, image); // Upload the file
        imageUrl = await getDownloadURL(imageRef); // Get the download URL
      }

      // Store post data in Firestore, including the image URL
      await addDoc(collection(firestore, "posts"), {
        title,
        description,
        imageUrl,
        like,
        dislike,
        userLike: [],
        userDislike: [],
        numOfComments,
        userID: auth.currentUser.uid,
        createdAt: serverTimestamp(),
      });

      setTitle("");
      setDescription("");
      setImage(null);
      setUploading(false);
      setLike(0);
      setDislike(0);
      setUserLike([]);
      setUserDislike([]);
      setNumOfComments(0);

      alert("Post Created Successfully");
    } catch (error) {
      console.error("Error creating post: ", error);
      setUploading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen mt-20 bg-gray-900 min-h-screen p-6 w-screen">
      <div className="min-w-1/2">
        <h1 className="text-white text-4xl font-serif">Create Your Own Post</h1>
        <textarea
          placeholder="Enter title (100 character limit)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full mb-2 p-2 bg-gray-700 text-white rounded"
        />
        <textarea
          placeholder="Enter description (400 character limit)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full mb-2 p-2 bg-gray-700 text-white rounded"
        />
        <input
          type="file"
          onChange={handleImageChange}
          className="text-white"
        />
        <button
          onClick={handleSubmit}
          disabled={uploading}
          className="bg-indigo-600 p-2 rounded text-white"
        >
          {uploading ? "Uploading..." : "Create Post"}
        </button>
      </div>
    </div>
  );
};

export default CreatePost;
