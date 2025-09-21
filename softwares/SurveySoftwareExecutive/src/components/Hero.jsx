import React from "react";
import { useNavigate } from 'react-router-dom'

const Hero = () => {
  const navigate = useNavigate()
  return (
    <div className="px-4 sm:px-20 xl:px-32 relative inline-flex flex-col w-full justify-center bg-[url(/gradientBackground.png)] bg-cover bg-no-repeat min-h-screen">
      <div className="text-center mb-6">
        <h1 className="text-3xl sm:text-5xl md:text-6xl 2xl:text-7xl font-semibold mx-auto leading-[1.2]">
          🚀 Get Started 
<br /> {" "}
          <span className="text-primary">Now</span>
        </h1>
       
      </div>

      <div className="flex flex-wrap justify-center gap-4 text-sm max-sm:text-xs">
        <button onClick={()=> navigate('/ai')} className="bg-primary text-white px-10 py-3 rounded-lg hover:scale-102 active:scale-95 transition cursor-pointer"> Start Now</button>
      </div>

      
    </div>

  );
};

export default Hero;
