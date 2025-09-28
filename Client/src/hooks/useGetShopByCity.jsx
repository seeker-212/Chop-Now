import React from "react";
import { useEffect } from "react";
import { serverUrl } from "../App";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setShopInMyCity } from "../redux/userSlice";


const useGetShopByCity = () => {
    const {city} = useSelector(state => state.user)

   //Use Dispatch
  const dispatch = useDispatch();

  //This useEffect fetches the current logged in user
  useEffect(() => {
    const fetchShop = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/shop/get-by-city/${city}`, {
          withCredentials: true,
        });
        dispatch(setShopInMyCity(result.data));
        console.log(result.data)
      } catch (error) {
        console.error(error);
      } 
    };
    fetchShop();
  }, [city]);
};

export default useGetShopByCity
