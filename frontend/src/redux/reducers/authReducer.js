import {
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  SET_USER,
  LOADING,
} from "../constants/auth";

const initialState = {
  user: null,
  error: null,
  isDataLoaded: false,
};

export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return { ...state, user: action.payload, error: null };
    case LOGIN_FAILURE:
      return { ...state, error: action.payload };
    case SET_USER:
      return { ...state, user: action.payload };
    case LOADING:
      return { ...state, isDataLoaded: action.payload };
    default:
      return state;
  }
}
