// components/Loader.tsx
import React from "react";

interface LoaderProps {
  message?: string;
  fullScreen?: boolean;
}

const Loader: React.FC<LoaderProps> = ({ message = "Loading...", fullScreen = false }) => {
  return (
    <div
      className={`flex flex-col justify-center items-center ${fullScreen ? "h-screen" : "w-full py-10"
        }`}
    >
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-500 mb-4"></div>
      <p className="text-lg text-gray-700">{message}</p>
    </div>
  );
};

export default Loader;
