import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
} from "@mui/material";
import { customer, Product } from "../config/call";
import { useSelector } from "react-redux";

const TransactionPopup = ({
  open,
  handleClose,
  transaction,
  onAdd,
  onUpdate,
  onDelete,
}) => {
  const isNewTransaction = !transaction;
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const userDetails = useSelector((state) => state.auth.user);

  const [updatedTransaction, setUpdatedTransaction] = useState({
    productId: "",
    productName: "",
    customerId: userDetails.role === "CUSTOMER" ? userDetails.data._id : "",
    customerName: userDetails.role === "CUSTOMER" ? userDetails.data.name : "",
    quantity: "",
    totalPrice: "",
    status: "",
    transactionDate: userDetails.role === "CUSTOMER" ? "Pending" : "",
  });

  useEffect(() => {
    // Fetch product list from API
    Product.getAllProducts().then((productData) => {
      setProducts(productData.data);
    });

    // Fetch customer list from API
    customer.getAllCustomer().then((customerData) => {
      setCustomers(customerData.data);
    });

    if (transaction) {
      const { productId, customerId, _id, quantity, totalPrice, status } =
        transaction;
      setUpdatedTransaction({
        _id: _id,
        productId: productId._id,
        productName: productId.name,
        customerId: customerId._id,
        customerName: customerId.name,
        quantity: quantity,
        totalPrice,
        status,
      });
    } else {
      setUpdatedTransaction({
        productId: "",
        productName: "",
        customerId: "",
        customerName: "",
        quantity: "",
        totalPrice: "",
        status: "",
        transactionDate: "",
      });
    }
  }, [transaction]);

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setUpdatedTransaction({ ...updatedTransaction, [name]: value });
  };

  const handleFieldChangesetid = (name, value) => {
    var obj = updatedTransaction;
    obj[name] = value;
    setUpdatedTransaction(obj);
  };

  const handleSave = () => {
    if (isNewTransaction) {
      onAdd(updatedTransaction);
    } else {
      onUpdate(updatedTransaction);
    }
    handleClose();
  };

  const handleDelete = () => {
    onDelete(transaction);
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {isNewTransaction ? "Add New Transaction" : "Edit Transaction"}
      </DialogTitle>
      <DialogContent dividers>
        {isNewTransaction && (
          <>
            <Select
              name="productName"
              value={updatedTransaction.productName}
              onChange={handleFieldChange}
              fullWidth
              margin="normal"
            >
              <MenuItem value="">Select Product</MenuItem>
              {products.map((product) => (
                <MenuItem
                  key={product._id}
                  value={product.name}
                  onClick={() =>
                    handleFieldChangesetid("productId", product._id)
                  }
                >
                  {product.name}
                </MenuItem>
              ))}
            </Select>
            {userDetails.role === "ADMIN" && (
              <Select
                name="customerName"
                value={updatedTransaction.customerName}
                onChange={handleFieldChange}
                fullWidth
                margin="normal"
                sx={{
                  marginTop: 2,
                }}
              >
                <MenuItem value="">Select Customer</MenuItem>
                {customers.map((customer) => (
                  <MenuItem
                    key={customer._id}
                    value={customer.name}
                    onClick={() =>
                      handleFieldChangesetid("customerId", customer._id)
                    }
                  >
                    {customer.name}
                  </MenuItem>
                ))}
              </Select>
            )}
          </>
        )}
        <TextField
          label="Quantity"
          name="quantity"
          value={updatedTransaction.quantity}
          onChange={handleFieldChange}
          type="number"
          fullWidth
          margin="normal"
        />
        <TextField
          label="Total Price"
          name="totalPrice"
          value={updatedTransaction.totalPrice}
          onChange={handleFieldChange}
          type="number"
          fullWidth
          margin="normal"
        />
        {userDetails.role === "ADMIN" && (
          <Select
            name="status"
            value={updatedTransaction.status}
            onChange={handleFieldChange}
            fullWidth
            margin="normal"
          >
            <MenuItem value="Completed">Complete</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
          </Select>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSave} color="primary">
          {isNewTransaction ? "Add" : "Update"}
        </Button>
        {!isNewTransaction && userDetails.role === "ADMIN" && (
          <Button onClick={handleDelete} color="error">
            Delete
          </Button>
        )}
        <Button onClick={handleClose} color="secondary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TransactionPopup;
