"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { db } from "../../../lib/firebase";
import { LoaderTwo } from '../../components/ui/loader';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import PopUpMessage from "@/components/popup";

import {
  collection,
  addDoc,
  getDocs,
  orderBy,
  query,
  limit,
} from "firebase/firestore";

interface ImageData {
  imageurl: string;
  name?: string;
  type?: string;
  size?: number;
}

export default function RegisterPage() {
  const [image, setImage] = useState<File | string | null>("/profilepicture.jpg");
  const [uploadedImage, setUploadedImage] = useState<ImageData | null>(null);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [popupMessage, setPopupMessage] = useState<string>("");
const [showPopup, setShowPopup] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const uploadImage = async (file?: File) => {
    const selectedImage = file || (typeof image !== "string" ? image : null);
if (!selectedImage) {
  setPopupMessage("Please select an image file first.");
  setShowPopup(true);
  return;
}

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", selectedImage);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const text = await res.text();
       setPopupMessage(`Upload failed ${text}`);
  setShowPopup(true);
  return;
      }

      const data = await res.json();
      const imageurl = data.url;

      if (!imageurl) {
        setPopupMessage("Upload failed no Url returned");
  setShowPopup(true);
  return;
      }

      const imageDoc: ImageData = {
        imageurl,
        name: data.originalName,
        type: data.type,
        size: data.size,
      };

      await addDoc(collection(db, "images"), {
        ...imageDoc,
        uploadedAt: new Date(),
      });

      setUploadedImage(imageDoc);
      setImage("/profilepicture.jpg");
    } catch (err) {
      setPopupMessage((err as Error).message);
  setShowPopup(true);
      
    } finally {
      setLoading(false);
    }
  };

  const fetchLatestImage = async () => {
    const q = query(
      collection(db, "images"),
      orderBy("uploadedAt", "desc"),
      limit(1)
    );

    const snapshot = await getDocs(q);
    const latest = snapshot.docs[0]?.data() as ImageData | undefined;

    if (latest) {
      setUploadedImage(latest);
    }
  };

  useEffect(() => {
    fetchLatestImage();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-gradient-to-br from-blue-50 via-white to-purple-100">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-sm border border-gray-200">
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div className="flex justify-center mb-1">
            <Image
              src="/chattrix.png"
              width={200}
              height={40}
              alt="Chattrix Logo"
              className="rounded"
            />
          </div>

          <h2 className="text-xl font-semibold text-center text-gray-700">Register</h2>

          <div className="flex flex-col items-center gap-2">
            <img
              src={
                uploadedImage?.imageurl
                  ? uploadedImage.imageurl
                  : typeof image === "string"
                  ? image
                  : "/profilepicture.jpg"
              }
              alt="Profile"
              className="rounded-full w-20 h-20 object-cover border border-gray-200 cursor-pointer hover:opacity-80"
              title="Click to select image"
              onClick={() => fileInputRef.current?.click()}
            />

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setImage(file);
                  uploadImage(file);
                }
              }}
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
              className="text-xs px-3 py-1.5
              font-semibold bg-blue-400 text-white rounded hover:bg-blue-500 transition"
            >
              {loading ?  <CircularProgress size={20} /> : "Upload Image"}
            </button>
          </div>

          <div>
            <input
              type="text"
              placeholder="Full Name"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring focus:ring-blue-200 focus:outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {error.name && <span className="text-xs text-red-500">{error.name}</span>}
          </div>

          <div>
            <input
              type="email"
              placeholder="Email"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring focus:ring-blue-200 focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {error.email && <span className="text-xs text-red-500">{error.email}</span>}
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring focus:ring-blue-200 focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error.password && <span className="text-xs text-red-500">{error.password}</span>}
          </div>

          <div>
            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring focus:ring-blue-200 focus:outline-none"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {error.confirmPassword && (
              <span className="text-xs text-red-500">{error.confirmPassword}</span>
            )}
          </div>

          <div>
            <button
              type="submit"
              className="w-full text-sm bg-blue-400 hover:bg-blue-500 text-white py-2 rounded-md  transition duration-150 font-semibold text-center"
            >
             {loading ? (
  <div className="flex justify-center items-center">
    <CircularProgress size={24} />
  </div>
) : (
  "Create Account"
)}
            </button>
          </div>
        </form>
      </div>
      <PopUpMessage
  message={popupMessage}
  isOpen={showPopup}
  onClose={() => setShowPopup(false)}
/>
    </div>
  );
}
