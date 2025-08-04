"use client";

import { useState, useEffect } from "react";
import { db } from '../../lib/firebase';
import { collection, addDoc, getDocs } from "firebase/firestore";

interface ImageData {
  imageUrl: string;
  name?: string;
  type?: string;
  size?: number;
}

export default function HomePage() {
  const [image, setImage] = useState<File | null>(null);
  const [images, setImages] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState(false);

  const uploadImage = async () => {
    if (!image) return alert("Please select a file!");

    setLoading(true);
    const formData = new FormData();
    formData.append("file", image);

    const res = await fetch("/api/upload", { method: "POST", body: formData });

    if (!res.ok) {
      const text = await res.text();
      alert("Upload failed: " + text);
      setLoading(false);
      return;
    }

    const data = await res.json();
    console.log("Upload Response:", data);

    const imageUrl = data.url;
    if (!imageUrl) {
      alert("Upload failed: No image URL returned.");
      setLoading(false);
      return;
    }

    // Save only serializable metadata to Firestore
    await addDoc(collection(db, "images"), {
      imageUrl,
      name: data.originalName,
      type: data.type,
      size: data.size,
      uploadedAt: new Date(),
    });

    setImage(null);
    setLoading(false);
    fetchImages();
  };

  const fetchImages = async () => {
    const snapshot = await getDocs(collection(db, "images"));
    const urls = snapshot.docs.map((doc) => doc.data() as ImageData);
    setImages(urls);
  };

  useEffect(() => {
    fetchImages();
  }, []);

  return (
    <div className="p-10 text-center">
      <h1 className="text-2xl font-bold mb-5">Next.js + Cloudinary + Firestore</h1>

      <input
        type="file"
        onChange={(e) => setImage(e.target.files?.[0] || null)}
        className="mb-3"
      />
      <button
        onClick={uploadImage}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        {loading ? "Uploading..." : "Upload"}
      </button>

      <h2 className="text-xl font-semibold mt-10">Gallery</h2>
      <div className="flex flex-wrap justify-center gap-4 mt-5">
        {images.map((img, i) => (
          <div key={i} className="flex flex-col items-center">
            <img src={img.imageUrl} alt={img.name || "Uploaded"} width="150" className="rounded shadow" />
            <p className="text-xs mt-1">{img.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
