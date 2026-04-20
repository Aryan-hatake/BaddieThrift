import { register, login , getMe } from "../services/auth.api";
import { useDispatch } from "react-redux";
import { setError, setLoading, setUser } from "../auth.slice";

export const useAuth = () => {
  const dispatch = useDispatch();

  const handleRegister = async (fullName, email, password, contactNo) => {
    dispatch(setLoading(true));
    try {
      const data = await register(fullName, email, password, contactNo);
      dispatch(setUser(data.user));
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
      dispatch(setUser(data.user));
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
      dispatch(setUser(data.user))
    }
    catch(err){
      dispatch(setError(err))
    }
    finally{
      dispatch(setLoading(false))
    }
  }

  return { handleRegister, handleLogin, handleGetMe};
};

