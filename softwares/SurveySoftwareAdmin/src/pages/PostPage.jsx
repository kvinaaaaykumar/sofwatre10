import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { AiToolsData } from "../assets/post/assets2";
import png from "../assets/post/frame.png";

const PostPage = () => {
  const { category } = useParams();

  const filteredPosts = category
    ? AiToolsData.filter(
        (post) => post.category.toLowerCase() === category.toLowerCase()
      )
    : AiToolsData;

  const [loading, setLoading] = useState(true);

  // This is now a single shared image for ALL cards
  const [secondImage, setSecondImage] = useState(png);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempSecondImage, setTempSecondImage] = useState("");

  const capitalizeWords = (str) =>
    str.replace(/\b\w/g, (char) => char.toUpperCase());

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

  // Open modal
  const handleEditOpen = () => {
    setTempSecondImage(secondImage);
    setIsModalOpen(true);
  };

  // Save modal changes
  const handleSaveChanges = () => {
    setSecondImage(tempSecondImage);
    setIsModalOpen(false);
  };

  // Change image from file input
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempSecondImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="px-4 sm:px-8 lg:px-12 my-12">
      <div className="text-center mb-10">
        <h2 className="text-slate-700 text-3xl sm:text-4xl font-bold">
          {category ? `Posts in "${capitalizeWords(category)}"` : "All Posts"}
        </h2>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm transform "
            >
              {/* Main Image */}
              <div className="relative">
                {loading ? (
                  <div className="w-full aspect-square bg-gray-200 animate-pulse" />
                ) : (
                  <>
                    <img
                      src={post.Icon}
                      alt={capitalizeWords(post.title || post.category)}
                      className="w-full h-auto mb-2"
                    />
                    <img
                      src={secondImage}
                      alt="Frame"
                      className="mt-[-100px]"
                    />
                  </>
                )}
              </div>

              {/* Title */}
              <div className="p-4 bg-gray-50 text-center border-b border-gray-100">
                {loading ? (
                  <div className="h-5 w-2/3 mx-auto bg-gray-200 animate-pulse rounded" />
                ) : (
                  <h3 className="text-lg font-semibold text-gray-800">
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
                          secondImage,
                          post.category || "image"
                        )
                      }
                      className="w-full px-5 py-2 text-sm sm:text-base bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-sm hover:shadow-md transition-all duration-200"
                    >
                      Download
                    </button>

                    {/* <button
                      onClick={handleEditOpen}
                      className="w-full px-5 py-2 text-sm sm:text-base bg-green-500 hover:bg-green-600 text-white rounded-full shadow-sm hover:shadow-md transition-all duration-200"
                    >
                      Edit
                    </button> */}
                  </>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No posts found for this category.
          </p>
        )}
      </div>

      {/* Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">
              Change Second Image (All Cards)
            </h3>

            {/* Image Preview */}
            <div className="mb-4">
              <img
                src={tempSecondImage}
                alt="Preview"
                className="w-full h-auto rounded-lg mb-2"
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-500"
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveChanges}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostPage;
