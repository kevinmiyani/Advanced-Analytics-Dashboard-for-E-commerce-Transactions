import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  MenuItem,
  Select,
  TextField,
  TableSortLabel,
  Typography,
  Button,
} from "@mui/material";
import { Product } from "../../config/call";
import ProductPopup from "../../components/ProductPopup";
import LoadingPage from "../../components/LoadingPage";
import { toast } from "react-toastify";

const generateDummyMonthlyData = (year) => {
  const categories = ["Electronics", "Furniture", "Clothing", "Accessories"];
  const productData = [];
  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year + 1, 0, 1);
  let currentDate = startDate;

  while (currentDate < endDate) {
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
    const formattedDate = `${currentDate.getFullYear()}-${month}`;

    const monthlyStockData = {
      date: formattedDate,
    };

    categories.forEach((category) => {
      const randomStock = Math.floor(Math.random() * 200) + 1;
      monthlyStockData[category] = randomStock;
    });

    productData.push(monthlyStockData);

    currentDate.setMonth(currentDate.getMonth() + 1);
  }

  return productData;
};

const ProductInfo = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonthRange, setSelectedMonthRange] = useState("All");
  const [monthlyStockData, setMonthlyStockData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("name");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [graphData, setGraphData] = useState([]);
  const [totalStock, setTotalStock] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);

    try {
      const res = await Product.getAllProducts();
      setProductData(res.data);
      const years = res.data.map((product) =>
        new Date(product.createdAt).getFullYear()
      );
      const maxYear = Math.max(...years);
      setSelectedYear(maxYear);
      setMonthlyStockData(generateDummyMonthlyData(maxYear));
      setLoading(false);
    } catch (error) {
      console.error("Error fetching product data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const filteredData = monthlyStockData.filter((data) => {
      if (selectedMonthRange === "All") {
        return true;
      } else {
        const month = parseInt(data.date.split("-")[1]);
        const inMonthRange =
          selectedMonthRange === "1-6" ? month <= 6 : month >= 7;
        return inMonthRange;
      }
    });
    setGraphData(filteredData);

    // Calculate total stock
    const total = filteredData.reduce((acc, data) => {
      return (
        acc +
        Object.values(data)
          .slice(1)
          .reduce((sum, value) => sum + value, 0)
      );
    }, 0);
    setTotalStock(total);
  }, [monthlyStockData, selectedYear, selectedMonthRange]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleYearChange = (event) => {
    const year = event.target.value;
    setSelectedYear(year);
    if (year === "All") {
      setSelectedMonthRange("All"); // Reset month range selection
      setMonthlyStockData(generateDummyMonthlyData(new Date().getFullYear())); // Update data for all years
    } else {
      setMonthlyStockData(generateDummyMonthlyData(parseInt(year))); // Update data for the selected year
    }
  };

  const handleMonthRangeChange = (event) => {
    setSelectedMonthRange(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleRequestSort = (property) => {
    const isAscending = orderBy === property && order === "asc";
    setOrder(isAscending ? "desc" : "asc");
    setOrderBy(property);
  };

  const categories = ["Electronics", "Furniture", "Clothing", "Accessories"];

  const filteredProductData = productData
    .filter(
      (product) =>
        (selectedCategory === "All" || product.category === selectedCategory) &&
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (orderBy === "name") {
        return order === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else if (orderBy === "price") {
        return order === "asc" ? a.price - b.price : b.price - a.price;
      } else if (orderBy === "stock") {
        return order === "asc" ? a.stock - b.stock : b.stock - a.stock;
      } else {
        return order === "asc"
          ? a.category.localeCompare(b.category)
          : b.category.localeCompare(a.category);
      }
    });

  const handleRowClick = (product) => {
    setSelectedProduct(product);
    setIsPopupOpen(true);
  };

  const handleAddNewProduct = () => {
    setSelectedProduct(null);
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setSelectedProduct(null);
  };

  const handleAddProduct = (newProduct) => {
    setLoading(true);

    Product.addProduct({
      category: newProduct.category,
      name: newProduct.name,
      price: newProduct.price,
      stock: newProduct.stock,
    })
      .then((res) => {
        console.log("res", res);
        fetchData();
        setLoading(false);
        toast.success("Product added successful!");
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        toast.error("Fail to add Product ");
      });
  };

  const handleUpdateProduct = (updatedProduct) => {
    setLoading(true);
    Product.updateProduct(updatedProduct._id, {
      category: updatedProduct.category,
      name: updatedProduct.name,
      price: updatedProduct.price,
      stock: updatedProduct.stock,
    })
      .then((res) => {
        console.log("res", res.data);
        fetchData();
        setLoading(false);
        toast.success("Product Updated successful!");
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        toast.error("Fail to Update Product ");
      });
  };

  const handleDeleteProduct = (productToDelete) => {
    setLoading(true);

    Product.deleteProduct(productToDelete._id)
      .then((res) => {
        console.log("res", res);
        setLoading(false);
        toast.success("Product Deleted successful!");

        fetchData();
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        toast.error("Fail to Delete Product ");
      });
  };

  return (
    <div>
      {loading ? (
        <LoadingPage />
      ) : (
        <div className="container mx-auto px-4 py-8">
          <div className="flex w-full justify-between items-center mb-8 bg-white p-6 rounded-lg shadow-lg">
            <Typography variant="h4" gutterBottom className="text-center mb-0">
              Product Information
            </Typography>
            <div className="flex items-center">
              <Select value={selectedYear} onChange={handleYearChange}>
                <MenuItem value="All">All</MenuItem>
                {productData.length > 0 &&
                  productData
                    .map((product) => new Date(product.createdAt).getFullYear())
                    .filter((year, index, self) => self.indexOf(year) === index)
                    .map((year) => (
                      <MenuItem key={year} value={year}>
                        {year}
                      </MenuItem>
                    ))}
              </Select>
              {selectedYear !== "All" && (
                <Select
                  value={selectedMonthRange}
                  onChange={handleMonthRangeChange}
                  className="bg-white ml-4"
                >
                  <MenuItem value="All">All</MenuItem>
                  <MenuItem value="1-6">1-6</MenuItem>
                  <MenuItem value="7-12">7-12</MenuItem>
                </Select>
              )}
              <button
                onClick={handleAddNewProduct}
                type="button"
                class="text-white bg-gradient-to-r ml-5 from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
              >
                Add New Product
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-blue-100 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold">Total Products</h3>
              <p className="text-3xl">{filteredProductData.length}</p>
            </div>
            <div className="bg-green-100 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold">Total Stock</h3>
              <p className="text-3xl">{totalStock}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h3 className="text-2xl font-semibold mb-4">Stock Overview</h3>

            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={graphData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                {categories.map((category, index) => (
                  <Line
                    key={index}
                    type="monotone"
                    dataKey={category}
                    stroke={`#${Math.floor(Math.random() * 16777215).toString(
                      16
                    )}`}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold mb-4">Product Overview</h3>
            <div className="mb-4 flex items-center">
              <TextField
                label="Search by Name"
                variant="outlined"
                value={searchQuery}
                onChange={handleSearchChange}
                className="mr-4"
              />
              <Select
                value={selectedCategory}
                onChange={handleCategoryChange}
                displayEmpty
                className="ml-4"
              >
                <MenuItem value="All">All Categories</MenuItem>
                {categories.map((category, index) => (
                  <MenuItem key={index} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === "name"}
                        direction={orderBy === "name" ? order : "asc"}
                        onClick={() => handleRequestSort("name")}
                      >
                        Product Name
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === "price"}
                        direction={orderBy === "price" ? order : "asc"}
                        onClick={() => handleRequestSort("price")}
                      >
                        Price
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === "stock"}
                        direction={orderBy === "stock" ? order : "asc"}
                        onClick={() => handleRequestSort("stock")}
                      >
                        Stock
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === "category"}
                        direction={orderBy === "category" ? order : "asc"}
                        onClick={() => handleRequestSort("category")}
                      >
                        Category
                      </TableSortLabel>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredProductData
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((product, index) => (
                      <TableRow
                        key={index}
                        onClick={() => handleRowClick(product)}
                      >
                        <TableCell>{product.name}</TableCell>
                        <TableCell>₹{product.price}</TableCell>
                        <TableCell>{product.stock}</TableCell>
                        <TableCell>{product.category}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredProductData.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </div>
          </div>
          <ProductPopup
            open={isPopupOpen}
            handleClose={handleClosePopup}
            product={selectedProduct}
            onAdd={handleAddProduct}
            onUpdate={handleUpdateProduct}
            onDelete={handleDeleteProduct}
          />
        </div>
      )}
    </div>
  );
};

export default ProductInfo;
