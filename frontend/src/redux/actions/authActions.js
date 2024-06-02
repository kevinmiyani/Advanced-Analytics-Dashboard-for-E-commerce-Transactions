import { auth } from "../../config/call";
import {
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  SET_USER,
  LOADING,
} from "../constants/auth";
import { useDispatch } from "react-redux";

export const login = (user) => async (dispatch) => {
  try {
    dispatch({ type: LOGIN_SUCCESS, payload: user });
  } catch (error) {
    dispatch({ type: LOGIN_FAILURE, payload: error.message });
  }
};

export const setUser = (user) => ({
  type: SET_USER,
  payload: user,
});

export const setLoading = (data) => ({
  type: LOADING,
  payload: data,
});

export const loginUser = (params) => {
  return (dispatch) => {
    auth
      .login(params)
      .then((res) => {
        dispatch(setUser(res?.data));
        dispatch(setLoading(true));
        localStorage.setItem("access_type", res?.data.role);
        localStorage.setItem("access_token", res?.data.token);
      })
      .catch((error) => {
        console.log(error);
      });
  };
};
