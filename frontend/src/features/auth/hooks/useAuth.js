import { register, login , getMe ,logout } from "../services/auth.api";
import { useDispatch } from "react-redux";
import { setError, setLoading, setUser , setLogout } from "../auth.slice";
import { setCartItems } from "../../cart/store/cart.slice";
export const useAuth = () => {
  const dispatch = useDispatch();

  const handleRegister = async (fullName, email, password, contactNo) => {
    dispatch(setLoading(true));
    try {
      const data = await register(fullName, email, password, contactNo);
      localStorage.setItem("login",true)
      dispatch(setUser(data.user));
      dispatch(setLogout(false))
      dispatch(setError(null))
    } catch (err) {
      dispatch(setError(err?.response?.data.err[0]?.msg || err.message || "Registration failed"));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleLogin = async (identifier, password) => {
    dispatch(setLoading(true));
    try {
      let email, contactNo;
      identifier.includes("@") ? email = identifier : contactNo = identifier;
      const data = await login(email, contactNo, password);
      localStorage.setItem("login",true)
      dispatch(setUser(data.user));
      dispatch(setLogout(false))
      dispatch(setError(null))
    } catch (err) {

      dispatch(setError(err?.response?.data.err[0]?.msg || err.message || "Login failed"));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleGetMe = async()=>{
    try{
      dispatch(setLoading(true))
      const data = await getMe();
      dispatch(setUser(data?.user))
    }
    catch(err){
      dispatch(setError(err.message))
    }
    finally{
      dispatch(setLoading(false))
    }
  }
  const handleLogout = async()=>{
    try{
      dispatch(setLoading(true))
      const data = await logout();
      const isGoogleLogin = localStorage.getItem("google_login")
      const isLogin =  localStorage.getItem("login")
      if(isGoogleLogin){
        localStorage.removeItem("google_login")
      }
      if(isLogin){
        localStorage.removeItem("login")
      }
      dispatch(setLogout(true))
      dispatch(setCartItems([]))
      dispatch(setUser(null))
    }
    catch(err){
      dispatch(setError(err.message))
    }
    finally{
      dispatch(setLoading(false))
    }
  }
  const handleLoginForGoogle = async() =>{
    const setGoogleLogin = localStorage.setItem("google_login",true)
    console.log(setGoogleLogin)
  }

  return { handleRegister, handleLogin, handleGetMe,handleLogout,handleLoginForGoogle};
};

