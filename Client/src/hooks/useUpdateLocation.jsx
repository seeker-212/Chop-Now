import React from "react";
import { useEffect } from "react";
import { serverUrl } from "../App";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setAddress, setLocation } from "../redux/mapSlice.js";

const useUpdateLocation = () => {
  //Use Dispatch
  const dispatch = useDispatch();

  //Fetch User Data
  const { userData } = useSelector((state) => state.user);

  //UseEffect
  useEffect(() => {
    const updateLocation = async (lat, lon) => {
      const result = await axios.post(
        `${serverUrl}/api/user/update-location`,
        { lat, lon },
        { withCredentials: true }
      );
      console.log(result.data)
    };
    navigator.geolocation.watchPosition((pos) => {
        updateLocation(pos.coords.latitude, pos.coords.longitude)
    })
  }, [userData]);
};

export default useUpdateLocation;
