import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { loginstore,logoutstore } from "@/redux/storeslice";

function useFakeAuth() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true); // ✅ Added loading state

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get("http://localhost:5000/store/fakeauth", {
          withCredentials: true,
        });
        if (res.status === 200) {
          dispatch(loginstore(res.data));
          console.log('log from fakeauth',res.data);
          
        } else {
          dispatch(logoutstore());
        }
      } catch (error) {
        console.log(error);
        dispatch(logoutstore());
      } finally {
        setLoading(false); 
      }
    };

    checkAuth();
  }, [dispatch]); 

  return { loading }; 
}

export default useFakeAuth;