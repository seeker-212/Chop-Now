import React from "react";
import { useEffect } from "react";
import { serverUrl } from "../App";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setOwnerLoading } from "../redux/ownerSlice.js";
import { setMyOrders } from "../redux/userSlice.js";

const useGetMyOrders = () => {
  //Use Dispatch
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);

  //This useEffect fetches the current logged in user
  useEffect(() => {
    const fetchOrders = async () => {
      dispatch(setOwnerLoading(true));
      try {
        const result = await axios.get(`${serverUrl}/api/order/my-orders`, {
          withCredentials: true,
        });
        dispatch(setMyOrders(result.data));
        console.log(result.data);
      } catch (error) {
        console.error(error);
      } finally {
        dispatch(setOwnerLoading(false));
      }
    };
    fetchOrders();
  }, [userData]);
};

export default useGetMyOrders;
