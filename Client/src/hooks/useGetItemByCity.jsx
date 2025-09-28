import React from "react";
import { useEffect } from "react";
import { serverUrl } from "../App";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setItemInMyCity } from "../redux/userSlice";

const useGetItemByCity = () => {
  const { city } = useSelector((state) => state.user);

  //Use Dispatch
  const dispatch = useDispatch();

  //This useEffect fetches the current logged in user
  useEffect(() => {
    const fetchItem = async () => {
      try {
        const result = await axios.get(
          `${serverUrl}/api/item/get-by-city/${city}`,
          {
            withCredentials: true,
          }
        );
        dispatch(setItemInMyCity(result.data));
        
      } catch (error) {
        console.error(error);
      }
    };
    fetchItem();
  }, [city]);
};

export default useGetItemByCity;
