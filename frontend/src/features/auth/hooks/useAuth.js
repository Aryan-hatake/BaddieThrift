import { register, login } from "../services/auth.api";
import { useSelector, useDispatch } from "react-redux";
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

  return { handleRegister, handleLogin };
};

