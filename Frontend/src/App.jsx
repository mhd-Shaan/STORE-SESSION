import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { Toaster } from "react-hot-toast";
import { Loader } from "lucide-react";
import useFakeAuth from "./hooks/useFakeAuth";

import Home from "./pages/Home";
import StoreRegistration1 from "./pages/StoreRegistration1";
import StoreRegistration2 from "./pages/StoreRegistration2";
import StoreRegistration3 from "./pages/StoreRegistration3";
import StoreLogin from "./pages/StoreLogin";
import AdminPanel from "./pages/AdminPanel";
import Layout from "./component/Layout";
import ProductManagment from "./pages/storepanel/ProductManagment";
import OrderManagment from "./pages/storepanel/OrderManagment";
import Advertisment from "./pages/storepanel/Advertisment";
import AddingProducts from "./pages/storepanel/AddingProducts";

// ProtectedRoute component
function ProtectedRoute() {
  const { store } = useSelector((state) => state.store);
  return store ? <Outlet /> : <Navigate to="/Storelogin" />;
}


function App() {
  const { loading } = useFakeAuth();
  const { store, registrationStep } = useSelector((state) => state.store);

console.log(registrationStep);

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Storelogin" element={store ? <Navigate to="/Adminpanel" /> : <StoreLogin />} />

          <Route path="/Storeregstration1" element={store ? <Navigate to="/Adminpanel" /> : <StoreRegistration1 />} />
          <Route path="/Storeregstration2" element={store ? <Navigate to="/Adminpanel" /> : (registrationStep >= 2 ? <StoreRegistration2 /> : <Navigate to="/Storeregstration1" />)} />
          <Route path="/Storeregstration3" element={store ? <Navigate to="/Adminpanel" /> : (registrationStep >= 3 ? <StoreRegistration3 /> : <Navigate to="/Storeregstration2" />)} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/Adminpanel" element={<AdminPanel />} />
              <Route path="/product-managment" element={<ProductManagment />} />
              <Route path="/order-managment" element={<OrderManagment />} />
              <Route path="/advertisment" element={<Advertisment />} />
              <Route path="/addingproducts" element={<AddingProducts />} />
            </Route>
          </Route>
          
        </Routes>
      </Router>
    </>
  );
}

export default App;
