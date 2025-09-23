import React from "react";
import { useEffect } from "react";
import { serverUrl } from "../App";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setLoading, setUserData } from "../redux/userSlice.js";

const useGetCurrentUser = () => {
  //Use Dispatch
  const dispatch = useDispatch();

  //This useEffect fetches the current logged in user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/user/current-user`, {
          withCredentials: true,
        });
        dispatch(setUserData(result.data));
      } catch (error) {
        console.error(error);
      } finally {
        dispatch(setLoading(false));
      }
    };
    fetchUser();
  }, []);
};

export default useGetCurrentUser;
