import React from "react";
import { useEffect } from "react";
import { serverUrl } from "../App";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  setCity,
  setCurrentAddress,
  setState,
  setUserData,
} from "../redux/userSlice.js";
import { setAddress, setLocation } from "../redux/mapSlice.js";

const useGetCity = () => {
  //Use Dispatch
  const dispatch = useDispatch();

  //Fetch User Data
  const { userData } = useSelector((state) => state.user);

  //Fetching apikey from env
  const apikey = import.meta.env.VITE_GEOAPIKEY;

  //UseEffect
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        dispatch(setLocation({ lat: latitude, lon: longitude }));

        //Fetching data from geoafify docs
        const result = await axios.get(
          `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=${apikey}`
        );
        console.log(result.data);

        dispatch(
          setCity(
            result?.data?.results[0].city || result?.data?.results[0].county
          )
        );
        dispatch(setState(result?.data?.results[0].state));
        dispatch(
          setCurrentAddress(
            result?.data?.results[0].address_line2 ||
              result?.data?.results[0].address_line1
          )
        );
        dispatch(setAddress(result?.data?.results[0].address_line2));
      },
      (error) => {
        console.error("Geolocation error:", error);
      }
    );
  }, [userData]);
};

export default useGetCity;
