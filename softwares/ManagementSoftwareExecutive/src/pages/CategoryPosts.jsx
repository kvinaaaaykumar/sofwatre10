import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { AiToolsData } from "../assets/post/assets2";
import png from "../assets/post/frame.png";

const CategoryPosts = () => {
  const { categoryName } = useParams();
  const decodedCategory = decodeURIComponent(categoryName);

   const handleDownload = (mainUrl, frameUrl, name) => {
    const mainImg = new Image();
    const frameImg = new Image();

    mainImg.crossOrigin = "anonymous";
    frameImg.crossOrigin = "anonymous";

    mainImg.src = mainUrl;
    frameImg.src = frameUrl;

    mainImg.onload = () => {
      frameImg.onload = () => {
        const canvasWidth = 500;
        const canvasHeight = 300 + 200; // top image + bottom image heights

        const canvas = document.createElement("canvas");
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        const ctx = canvas.getContext("2d");

        // Draw top image (first image)
        ctx.drawImage(mainImg, 0, 0, canvasWidth, 410);

        // Draw bottom image (second image)
        ctx.drawImage(frameImg, 0, 300, canvasWidth, 200);

        // Trigger download
        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = `${name}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      };
    };
  };

  // Function to capitalize first letter of each word
  const capitalizeWords = (str) =>
    str.replace(/\b\w/g, (char) => char.toUpperCase());

  const filteredPosts = AiToolsData.filter(
    (post) => post.category === decodedCategory
  );

  const [loading, setLoading] = useState(true);

  // Preload all images for this category
  useEffect(() => {
    const imagePromises = filteredPosts.map(
      (post) =>
        new Promise((resolve) => {
          const img = new Image();
          img.src = post.Icon;
          img.onload = resolve;
          img.onerror = resolve;
        })
    );

    Promise.all(imagePromises).then(() => {
      setLoading(false);
    });
  }, [filteredPosts]);

  return (
    <div className="px-4 sm:px-8 lg:px-12 my-12">
      <div className="text-center mb-10">
        <h2 className="text-slate-700 text-3xl sm:text-4xl font-bold">
          {capitalizeWords(decodedCategory)} Posts
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
        {filteredPosts.map((post, index) => (
          <div
            key={index}
            className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
          >
            <div className="relative">
              {loading ? (
                <div className="w-full h-full bg-gray-200 animate-pulse" />
              ) : (
                <>
                  <img
                    src={post.Icon}
                    alt={capitalizeWords(post.category)}
                    className="w-full h-auto mb-2"
                  />
                  <img src={png} alt="Frame" className="mt-[-100px]" />
                </>
              )}
            </div>

            <div className="p-3 bg-gray-50 text-center">
              {loading ? (
                <div className="h-4 w-2/3 mx-auto bg-gray-200 animate-pulse rounded" />
              ) : (
                <h3 className="text-sm sm:text-lg font-semibold">
                  {index + 1}. {capitalizeWords(post.category)}
                </h3>
              )}
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-3 p-4 bg-gray-50 border-t border-gray-100">
              {loading ? (
                <>
                  <div className="h-10 rounded-full bg-gray-200 animate-pulse w-full" />
                  <div className="h-10 rounded-full bg-gray-200 animate-pulse w-full" />
                </>
              ) : (
                <>
                  <button
                    onClick={() =>
                      handleDownload(
                        post.Icon,
                        png, // ✅ use frame correctly
                        post.category || "image"
                      )
                    }
                    className="w-full px-5 py-2 text-sm sm:text-base bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    Download
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryPosts;
