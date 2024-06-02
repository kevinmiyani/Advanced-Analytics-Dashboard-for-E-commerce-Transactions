import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";

const CustomerPopup = ({
  open,
  handleClose,
  customer,
  onAdd,
  onUpdate,
  onDelete,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
  });

  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name,
        email: customer.email,
        address: customer.address,
      });
    }
  }, [customer]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = () => {
    if (customer) {
      onUpdate({ ...customer, ...formData });
    } else {
      onAdd(formData);
    }
    handleClose();
  };

  const handleDelete = () => {
    onDelete(customer);
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{customer ? "Update Customer" : "Add Customer"}</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          name="name"
          label="Name"
          fullWidth
          value={formData.name}
          onChange={handleChange}
        />
        {!customer && (
          <TextField
            margin="dense"
            name="email"
            label="Email"
            fullWidth
            value={formData.email}
            onChange={handleChange}
          />
        )}
        <TextField
          margin="dense"
          name="address"
          label="Address"
          fullWidth
          value={formData.address}
          onChange={handleChange}
        />
        {!customer && (
          <TextField
            margin="dense"
            name="password"
            label="password"
            fullWidth
            value={formData.password}
            onChange={handleChange}
          />
        )}
      </DialogContent>
      <DialogActions>
        {customer && (
          <Button onClick={handleDelete} color="secondary">
            Delete
          </Button>
        )}
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary">
          {customer ? "Update" : "Add"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CustomerPopup;
