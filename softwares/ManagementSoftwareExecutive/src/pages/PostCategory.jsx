import React, { useState, useEffect } from "react";
import { AiToolsData } from "../assets/post/assets2";
import { useNavigate } from "react-router-dom";
import png from "../assets/post/frame.png";

const PostCategory = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // Function to capitalize first letter of each word
  const capitalizeWords = (str) =>
    str.replace(/\b\w/g, (char) => char.toUpperCase());

  // Simulate loading time OR wait for images to load
  useEffect(() => {
    const imagePromises = AiToolsData.map(
      (item) =>
        new Promise((resolve) => {
          const img = new Image();
          img.src = item.Icon;
          img.onload = resolve;
          img.onerror = resolve;
        })
    );

    Promise.all(imagePromises).then(() => {
      setLoading(false);
    });
  }, []);

  // Extract unique categories and sort numerically if possible
  const categories = [
    ...new Set(AiToolsData.map((item) => item.category)),
  ].sort((a, b) => {
    const numA = parseInt(a, 10);
    const numB = parseInt(b, 10);

    // If both start with numbers, sort numerically
    if (!isNaN(numA) && !isNaN(numB)) {
      return numA - numB;
    }
    // If one starts with a number and the other doesn't, put number first
    if (!isNaN(numA) && isNaN(numB)) return -1;
    if (isNaN(numA) && !isNaN(numB)) return 1;

    // Otherwise sort alphabetically
    return a.localeCompare(b);
  });

  let currentStart = 1;

  return (
    <div className="px-4 sm:px-8 lg:px-12 my-12">
      <div className="text-center mb-10">
        <h2 className="text-slate-700 text-3xl sm:text-4xl font-bold">
          Social Media Post Categories
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
        {categories.map((cat, index) => {
          const firstImage = AiToolsData.find(
            (item) => item.category === cat
          )?.Icon;
          const postCount = AiToolsData.filter(
            (item) => item.category === cat
          ).length;

          const startNumber = currentStart;
          const endNumber = currentStart + postCount - 1;
          currentStart = endNumber + 1;

          return (
            <div
              key={index}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm transform transition-all duration-300"
              onClick={() => navigate(`/ai/posts/${encodeURIComponent(cat)}`)}
            >
              <div className="aspect-square overflow-hidden">
                {loading ? (
                  <div className="w-full h-full bg-gray-200 animate-pulse" />
                ) : (
                  <>
                    <img
                      src={firstImage}
                      alt={capitalizeWords(cat)}
                      className="w-full h-auto mb-2"
                    />
                    <img src={png} alt="Frame" className="mt-[-100px]" />
                  </>
                )}
              </div>
              <div className="p-3 text-center bg-gray-50">
                {loading ? (
                  <div className="h-4 w-2/3 mx-auto bg-gray-200 animate-pulse rounded" />
                ) : (
                  <h3 className="text-sm sm:text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                    {capitalizeWords(cat)} {startNumber} to {endNumber}
                  </h3>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PostCategory;
