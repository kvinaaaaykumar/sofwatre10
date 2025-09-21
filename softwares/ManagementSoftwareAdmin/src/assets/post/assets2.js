// assets/post/assets2.js
const imageFiles = import.meta.glob('../assest/post/**/**/*.{jpg,png,jpeg}', { eager: true });

export const AiToolsData = Object.entries(imageFiles).map(([path, module]) => {
  // Example path: "../assest/post/1 english/1.png"
  const parts = path.split('/');
  const category = parts[parts.length - 2]; // folder name as category

  return {
    Icon: module.default, // actual image URL
    category
  };
});
