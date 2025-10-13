import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import ForgotPassword from "./pages/ForgotPassword";
import useGetCurrentUser from "./hooks/useGetCurrentUser";
import { useDispatch, useSelector } from "react-redux";
import Home from "./pages/Home";
import useGetCity from "./hooks/useGetCity";
import CreateEditShop from "./pages/CreateEditShop";
import useGetMyShop from "./hooks/useGetMyShop";
import AddItem from "./pages/AddItem";
import EditItem from "./pages/EditItem";
import useGetShopByCity from "./hooks/useGetShopByCity";
import useGetItemByCity from "./hooks/useGetItemByCity";
import CartPage from "./pages/CartPage";
import CheckOut from "./pages/CheckOut";
import OrderPlaced from "./pages/OrderPlaced";
import MyOrder from "./pages/MyOrder";
import useGetMyOrders from "./hooks/useGetMyOrders";
import useUpdateLocation from "./hooks/useUpdateLocation";
import TrackOrder from "./pages/TrackOrder";
import Shop from "./pages/Shop";
import { useEffect } from "react";
import { io } from "socket.io-client";
import { setSocket } from "./redux/userSlice";

//Exporting Server URL so other pages can use it
export const serverUrl = "http://localhost:5000";

const App = () => {
  useGetCurrentUser();
  useGetCity();
  useGetMyShop();
  useGetShopByCity();
  useGetItemByCity();
  useGetMyOrders();
  useUpdateLocation();

  const { userData, loading } = useSelector((state) => state.user);
  const { ownerLoading } = useSelector((state) => state.owner);

  //Redux Dispatch
  const dispatch = useDispatch()

  useEffect(()=>{
   const socketInstance = io(serverUrl, {withCredentials: true})
   dispatch(setSocket(socketInstance))
   socketInstance.on('connect', (socket) => {
    if (userData) {
      socketInstance.emit('identity', {userId: userData._id})
    }
   })
   return () => {
    socketInstance.disconnect()
   }
  },[userData?._id])

  const isLoading = loading || ownerLoading;
  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/signup"
        element={!userData ? <SignUp /> : <Navigate to={"/"} />}
      />
      <Route
        path="/signin"
        element={!userData ? <SignIn /> : <Navigate to={"/"} />}
      />
      <Route
        path="/forgot-password"
        element={!userData ? <ForgotPassword /> : <Navigate to={"/"} />}
      />
      <Route
        path="/"
        element={userData ? <Home /> : <Navigate to={"/signin"} />}
      />
      <Route
        path="/create-edit-shop"
        element={userData ? <CreateEditShop /> : <Navigate to={"/signin"} />}
      />

      <Route
        path="/add-food"
        element={userData ? <AddItem /> : <Navigate to={"/signin"} />}
      />

      <Route
        path="/edit-item/:itemId"
        element={userData ? <EditItem /> : <Navigate to={"/signin"} />}
      />

      <Route
        path="/cart"
        element={userData ? <CartPage /> : <Navigate to={"/signin"} />}
      />

      <Route
        path="/checkOut"
        element={userData ? <CheckOut /> : <Navigate to={"/signin"} />}
      />

      <Route
        path="/order-placed"
        element={userData ? <OrderPlaced /> : <Navigate to={"/signin"} />}
      />
      <Route
        path="/my-orders"
        element={userData ? <MyOrder /> : <Navigate to={"/signin"} />}
      />

      <Route
        path="/track-order/:orderId"
        element={userData ? <TrackOrder /> : <Navigate to={"/signin"} />}
      />

      <Route
        path="/shop/:shopId"
        element={userData ? <Shop /> : <Navigate to={"/signin"} />}
      />
    </Routes>
  );
};

export default App;
