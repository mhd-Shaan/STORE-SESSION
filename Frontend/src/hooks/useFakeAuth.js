import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { loginstore, logoutstore } from "@/redux/storeslice";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

function useFakeAuth() {
  const { store } = useSelector((state) => state.store);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const errorShown = useRef(false);
  

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get("http://localhost:5000/store/fakeauth", {
          withCredentials: true,
        });

        if (res.data.status === "approved") {
          dispatch(loginstore(res.data));
        } else if (res.data.status === "rejected") {
          dispatch(logoutstore());
          await axios.post("http://localhost:5000/store/logout", {}, { withCredentials: true });
        }
      } catch (error) {
        if (!errorShown.current && error.response?.data?.error) {
          toast.error(error.response.data.error);
          errorShown.current = true;
        }else{
          console.log(error.message);
        }

        dispatch(logoutstore());
        // await axios.post("http://localhost:5000/store/logout", {}, { withCredentials: true });
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [dispatch]);
  return { loading };
}

export default useFakeAuth;
