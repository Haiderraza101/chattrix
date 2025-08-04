"use client";

import React from "react";

interface PopUpMessageProps {
  message: string;
  isOpen: boolean;
  onClose: () => void;
}

const PopUpMessage: React.FC<PopUpMessageProps> = ({ message, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent
    max-h-100 bg-opacity-40 bottom-130">
      <div className="bg-white rounded-lg p-6 shadow-lg max-w-sm w-full text-center">
        <h2 className="text-lg font-semibold mb-2">Notice</h2>
        <p className="text-sm text-gray-700 mb-4">{message}</p>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default PopUpMessage;
