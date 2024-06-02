import api from "./api";

const auth = {
  login: (data) => api.post("/api/auth/login", data),
  singup: (data) => api.post("/api/auth/register", data),
  getuserbytoken: () => api.post("/api/auth/getuser"),
};

const customer = {
  getCustomercount: () => api.get("/api/customers/getCustomerCounts"),
  getAllCustomer: () => api.get("/api/customers/"),
  addCustomer: (data) => api.post("/api/customers/", data),
  updateCustomer: (id, data) => api.put(`/api/customers/${id}`, data),
  deleteCustomer: (id) => api.delete(`/api/customers/${id}`),
};

const transaction = {
  getAllTransactions: () => api.get("/api/transactions/"),
  getCustomerTransactions: () => api.post("/api/transactions/customerid"),
  addTransactions: (data) => api.post("/api/transactions/", data),
  updateTransactions: (id, data) => api.put(`/api/transactions/${id}`, data),
  deleteTransaction: (id) => api.delete(`/api/transactions/${id}`),
};

const Product = {
  getAllProducts: () => api.get("/api/products/"),
  addProduct: (data) => api.post("/api/products/", data),
  updateProduct: (id, data) => api.put(`/api/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/api/products/${id}`),
};

const payment = {
  checkout: (data) => api.post("/api/payment/checkout", data),
};

const predictdata = {
  getdata: () => api.get("/api/demand-forecast/predict-demand"),
};
export { auth, customer, transaction, Product, payment, predictdata };
