import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, Store, Star, Megaphone, Users, Menu,User } from "lucide-react";
import { useSelector } from "react-redux";
import React from "react";



const Sidebar = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

//    const admin = useSelector((state) => state.admin.admin); // Ensure correct Redux state
// console.log(state.admin.admin);

// if (admin === undefined || admin === null) {
//   return <p>Loading...</p>; // Prevents errors
// }
  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/Adminpanel" },
    { name: "Manage products", icon: User, path: "/product-managment" }, 
    { name: "Manage Store", icon: Store, path: "/order-managment" },
    // { name: "Reviews", icon: Star, path: "/home/manage-reviews" },
    { name: "Advertisement", icon: Megaphone, path: "/advertisment" },
  ];

  return (
    <div
      className={`h-screen bg-white shadow-lg transition-all duration-300 flex flex-col ${
        isCollapsed ? "w-20" : "w-64"
      }`}
      onMouseEnter={() => setIsCollapsed(false)}
      onMouseLeave={() => setIsCollapsed(true)}
    >
      {/* Logo Section */}
      <div className="flex items-center justify-between p-4">
        <img
          src="https://image.freepik.com/free-vector/spare-part-automotive-logo-design-concept_96807-1441.jpg"
          alt="Logo"
          className={`transition-all duration-300 ${isCollapsed ? "w-10" : "w-32"}`}
        />
        {!isCollapsed && (
          <Menu className="w-6 h-6 cursor-pointer" onClick={() => setIsCollapsed(!isCollapsed)} />
        )}
      </div>

      {/* Navigation Items */}
      <ul className="p-2 space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <li key={item.name}>
              <NavLink
                to={item.path}
                className={`flex items-center px-4 py-2 rounded-lg transition-all duration-300 ${
                  isActive ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-blue-100 hover:text-blue-500"
                }`}
              >
                <item.icon className="w-5 h-5" />
                {!isCollapsed && <span className="ml-3">{item.name}</span>}
              </NavLink>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Sidebar;