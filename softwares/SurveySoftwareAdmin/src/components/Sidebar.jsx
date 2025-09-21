import { Protect, useClerk, useUser } from "@clerk/clerk-react";
import {
  ChartLine,
  Eraser,
  Hash,
  House,
  Image,
  ImagePlus,
  LogOut,
  PieChartIcon,
  SquarePen,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import logo from "../assets/logo.png";
import { MdOutlineCreateNewFolder } from "react-icons/md";
import { TbDownload } from "react-icons/tb";
import { FiDatabase } from "react-icons/fi";
import { AiOutlineSafety } from "react-icons/ai";





const navItems = [
  { to: "/ai", label: "Dashboard", Icon: House },
  { to: "/ai/createentry", label: "Create Entry", Icon: SquarePen },
  { to: "/ai/totalentry", label: "Total Entry", Icon: MdOutlineCreateNewFolder },
  { to: "/ai/downloadentry", label: "Download Entry", Icon: TbDownload },
  { to: "/ai/entrydetails", label: "Entry Details", Icon: FiDatabase },
  { to: "/ai/postpage", label: "All Post", Icon: ImagePlus },
  { to: "/ai/postcategory", label: "Post Category", Icon: Image },
  { to: "/ai/cart", label: "All Chart", Icon: PieChartIcon },
  { to: "/ai/advancechart", label: "Advance Chart", Icon: ChartLine },
  { to: "/ai/payment", label: "Payment", Icon: AiOutlineSafety },
];

const Sidebar = ({ sidebar, setSidebar }) => {
  const { user } = useUser();
  const { signOut, openUserProfile } = useClerk();

  return (
    <div
      className={`fixed top-16 left-0 shadow-md bottom-0 w-60 bg-white border-r border-gray-200 flex flex-col justify-between transition-all duration-300 ease-in-out z-30
        ${sidebar ? "translate-x-0" : "max-sm:-translate-x-full"}
      `}
    >
      <div className="my-7 w-full">
        <img src={logo} a
        lt="logo" className="w-13 rounded-full mx-auto" />
        <h1 className="mt-1 text-center">Krishan Gahlot</h1>
        <p className="text-sm text-center text-gray-600">
          {user.fullName} role Mr. Admin
        </p>

        <div className="px-6 mt-5 text-sm text-gray-600 font-medium">
          {navItems.map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/ai"}
              onClick={() => setSidebar(false)}
              className={({ isActive }) =>
                `px-3.5 py-2.5 flex items-center gap-3 rounded ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : ""
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : ""}`} />
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>

      <div className="w-full border-t border-gray-200 p-4 px-7 flex items-center justify-between">
        <div
          onClick={openUserProfile}
          className="flex gap-2 items-center cursor-pointer"
        >
          <img src={user.imageUrl} className="w-8 rounded-full" alt="" />
          <div>
            <h1 className="text-sm font-medium">{user.fullName}</h1>
            <p className="text-xs text-gray-500">
              <Protect plan="premium" fallback="Premium">
                Premium
              </Protect>{" "}
              Plan
            </p>
          </div>
        </div>
        <LogOut
          onClick={signOut}
          className="w-4.5 text-gray-400 hover:text-gray-700 transition cursor-pointer"
        />
      </div>
    </div>
  );
};

export default Sidebar;
