import React from "react";
import { useEffect } from "react";
import { serverUrl } from "../App";
import axios from 'axios'

const useGetCurrentUser = () => {
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/user/current-user`, {
          withCredentials: true,
        });
        console.log(result);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUser();
  }, []);
};

export default useGetCurrentUser;
