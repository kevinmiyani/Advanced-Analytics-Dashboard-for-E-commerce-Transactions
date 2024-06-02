import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducers/authReducer";
// import productReducer from "./reducers/productReducer";
// import customerReducer from "./reducers/customerReducer";
// import transactionReducer from "./reducers/transactionReducer";

const store = configureStore({
  reducer: {
    auth: authReducer,
    // product: productReducer,
    // customer: customerReducer,
    // transaction: transactionReducer,
  },
});

export default store;
