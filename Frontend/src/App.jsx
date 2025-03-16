import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Home from "./pages/Home";
import StoreRegstration1 from "./pages/StoreRegistration1";
import StoreRegstration2 from "./pages/StoreRegistration2";
import StoreRegistration3 from "./pages/StoreRegistration3";
import StoreLogin from "./pages/StoreLogin";
import AdminPanel from "./pages/AdminPanel";
import { useSelector } from "react-redux";
import useFakeAuth from "./hooks/useFakeAuth";
import { Loader } from "lucide-react";
import Layout from "./component/Layout";
import ProductManagment from "./pages/storepanel/ProductManagment";
import OrderManagment from "./pages/storepanel/OrderManagment";
import Advertisment from "./pages/storepanel/Advertisment";
import AddingProducts from "./pages/storepanel/AddingProducts";

function App() {
  const { loading } = useFakeAuth(); // ✅ Hook now returns loading
  const { store } = useSelector((state) => state.store);
  console.log(store);

  if (loading) {
    return <Loader />; // ✅ Prevent rendering until auth check completes
  }

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <Router>
        <Routes>
          <Route path="/" element={store ?<AdminPanel/>:<Home />} />
          <Route
            path="/Storeregstration1"
            element={store ? <AdminPanel /> : <StoreRegstration1 />}
          ></Route>
          <Route
            path="/Storeregstration2"
            element={store ? <AdminPanel /> : <StoreRegstration2 />}
          ></Route>
          <Route
            path="/Storeregstration3"
            element={store ? <AdminPanel /> : <StoreRegistration3 />}
          ></Route>
          <Route
            path="/Storelogin"
            element={store ? <AdminPanel /> : <StoreLogin />}
          ></Route>
         
<Route element={<Layout/>}>
<Route
            path="/Adminpanel"
            element={store ?  <AdminPanel />  : <StoreLogin />}
          ></Route>
          <Route
  path="product-managment"
  element={<ProductManagment/>}
/>
<Route
  path="order-managment"
  element={<OrderManagment/>}
/>
<Route
  path="advertisment"
  element={<Advertisment/>}
/>
<Route path="addingproducts" element={<AddingProducts/>}></Route>


</Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
