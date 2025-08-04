// components/Loader.tsx
import React from "react";

interface LoaderProps {
  message: string;
}

const Loader: React.FC<LoaderProps> = ({ message }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="p-6 bg-white rounded-xl shadow-lg flex flex-col items-center gap-4">
        <span className="loading loading-spinner loading-lg text-primary"></span>
        <p className="text-center text-lg font-medium">{message}</p>
      </div>
    </div>
  );
};

export default Loader;
