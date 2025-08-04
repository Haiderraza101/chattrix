"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { db } from "../../../lib/firebase";
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

  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const uploadImage = async (file?: File) => {
    const selectedImage = file || (typeof image !== "string" ? image : null);

    if (!selectedImage) {
      return alert("Please select an image file");
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
        throw new Error(`Upload failed: ${text}`);
      }

      const data = await res.json();
      const imageurl = data.url;

      if (!imageurl) {
        throw new Error("Upload failed: No URL returned");
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
      setImage("/profilepicture.jpg"); // Optional: reset preview
    } catch (err) {
      alert((err as Error).message);
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
    <div className="flex items-center justify-center min-h-screen px-4 bg-gradient-to-br from-blue-100 via-white to-purple-200">
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
              onClick={() => uploadImage()}
              disabled={loading}
              className="text-xs px-3 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              {loading ? "..." : "Upload Image"}
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
              className="w-full text-sm bg-blue-400 hover:bg-blue-500 text-white py-2 rounded-md font-medium transition duration-150"
            >
              {loading ? "Loading" : "Create Account"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
