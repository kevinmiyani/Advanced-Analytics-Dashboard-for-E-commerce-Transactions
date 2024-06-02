import React, { useState, useEffect } from "react";
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

const ProductPopup = ({
  open,
  handleClose,
  product,
  onAdd,
  onUpdate,
  onDelete,
}) => {
  const [isNewProduct, setIsNewProduct] = useState(true);
  const [updatedProduct, setUpdatedProduct] = useState({
    name: "",
    price: "",
    stock: "",
    category: "",
  });

  useEffect(() => {
    if (product) {
      setIsNewProduct(false);
      setUpdatedProduct({ ...product });
    } else {
      setIsNewProduct(true);
      setUpdatedProduct({
        name: "",
        price: "",
        stock: "",
        category: "", // Default value for category
      });
    }
  }, [product]);

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProduct({ ...updatedProduct, [name]: value });
  };

  const handleSave = () => {
    if (isNewProduct) {
      onAdd(updatedProduct);
    } else {
      onUpdate(updatedProduct);
    }
    handleClose();
  };

  const handleDelete = () => {
    onDelete(product);
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {isNewProduct ? "Add New Product" : "Product Information"}
      </DialogTitle>
      <DialogContent dividers>
        {/* Display product details */}
        <TextField
          label="Product Name"
          name="name"
          value={updatedProduct.name}
          onChange={handleFieldChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Price"
          name="price"
          type="number"
          value={updatedProduct.price}
          onChange={handleFieldChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Stock"
          name="stock"
          type="number"
          value={updatedProduct.stock}
          onChange={handleFieldChange}
          fullWidth
          margin="normal"
        />
        <Select
          value={updatedProduct.category}
          onChange={handleFieldChange}
          name="category"
          fullWidth
          margin="normal"
        >
          <MenuItem value="">Select Category</MenuItem>
          <MenuItem value="Electronics">Electronics</MenuItem>
          <MenuItem value="Furniture">Furniture</MenuItem>
          <MenuItem value="Clothing">Clothing</MenuItem>
          <MenuItem value="Accessories">Accessories</MenuItem>
        </Select>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSave} color="primary">
          {isNewProduct ? "Add" : "Update"}
        </Button>
        {!isNewProduct && (
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

export default ProductPopup;
