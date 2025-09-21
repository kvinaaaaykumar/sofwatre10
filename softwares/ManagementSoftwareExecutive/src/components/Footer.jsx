import React from 'react';

const Footer = () => {
  return (
    <footer className="fixed bottom-0 left-0 w-full bg-gray-100 text-gray-600 px-2 md:px-16 lg:px-24 xl:px-32 py-2 z-50 shadow-md">
      <div className="text-center text-xs sm:text-sm">
        © {new Date().getFullYear()} All Rights Reserved | Version 1.0.0 <br className="sm:hidden" />
        <span className="block sm:inline">
          | Powered by <span className="text-blue-600 font-semibold">Softwares Infotech Pvt Ltd</span>
        </span>
      </div>
    </footer>
  );
};

export default Footer;
