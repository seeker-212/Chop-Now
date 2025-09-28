import React from "react";
import { useEffect } from "react";
import { serverUrl } from "../App";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setOwnerLoading, setMyShopData } from "../redux/ownerSlice.js";

const useGetMyShop = () => {
  //Use Dispatch
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);

  //This useEffect fetches the current logged in user
  useEffect(() => {
    if (userData?.role === "owner") {
      const fetchShop = async () => {
        dispatch(setOwnerLoading(true));
        try {
          const result = await axios.get(`${serverUrl}/api/shop/get-shop`, {
            withCredentials: true,
          });
          dispatch(setMyShopData(result.data));
        } catch (error) {
          console.error(error);
        } finally {
          dispatch(setOwnerLoading(false));
        }
      };
      fetchShop();
    } else {
      // If not owner, just clear shop state
      dispatch(setMyShopData(null));
      dispatch(setOwnerLoading(false));
    }
  }, [userData]);
};

export default useGetMyShop;
