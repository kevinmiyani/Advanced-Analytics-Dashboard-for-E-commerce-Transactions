import React, { useEffect, useState } from "react";
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
  Paper,
  Typography,
  MenuItem,
  Select,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import { customer, transaction } from "../../config/call";
import ProductTable from "../../components/ProductSalesTable";
import LoadingPage from "../../components/LoadingPage";

const AdminDashboard = () => {
  const [customerCount, setCustomerCount] = useState(0);
  const [allTransactionData, setAllTransactionData] = useState([]);
  const [allProductData, setAllProductData] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonthRange, setSelectedMonthRange] = useState("1-6");
  const [years, setYears] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    customer.getCustomercount().then((res) => {
      setCustomerCount(res.data);
    });

    transaction.getAllTransactions().then((res) => {
      const productDatas = [];
      const yearsSet = new Set();
      console.log("res.data", res.data[0]);

      const formattedTransactionData = res.data.map((transaction) => {
        const date = new Date(transaction.transactiondate);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        yearsSet.add(year);

        productDatas.push({
          id: transaction.productId._id,
          name: transaction.productId.name,
          price: transaction.productId.price,
          stock: transaction.productId.stock,
          sales: transaction.quantity,
          year: year,
          month: month,
        });
        setLoading(false);

        return {
          ...transaction,
          transactiondate: formatDate(transaction.transactiondate),
          year: year,
          month: month,
        };
      });

      setYears(Array.from(yearsSet));
      setAllTransactionData(formattedTransactionData);
      setAllProductData(productDatas);
    });
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: "numeric", month: "short", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  const handleMonthRangeChange = (event) => {
    setSelectedMonthRange(event.target.value);
  };

  const filteredTransactionData = allTransactionData.filter((transaction) => {
    const inYear = selectedYear === "All" || transaction.year === selectedYear;
    const inMonthRange =
      selectedMonthRange === "All" ||
      (selectedMonthRange === "1-6"
        ? transaction.month >= 1 && transaction.month <= 6
        : transaction.month >= 7 && transaction.month <= 12);
    return inYear && (selectedYear === "All" || inMonthRange);
  });

  const filteredProductData = allProductData.filter((product) => {
    const inYear = selectedYear === "All" || product.year === selectedYear;
    const inMonthRange =
      selectedMonthRange === "All" ||
      (selectedMonthRange === "1-6"
        ? product.month >= 1 && product.month <= 6
        : product.month >= 7 && product.month <= 12);
    return inYear && (selectedYear === "All" || inMonthRange);
  });

  const totalRevenue = filteredTransactionData.reduce(
    (acc, transaction) => acc + transaction.totalPrice,
    0
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div>
      {loading ? (
        <LoadingPage />
      ) : (
        <div className="container mx-auto px-4 py-8">
          <div className="flex w-full justify-between items-center mb-8 bg-white p-6 rounded-lg shadow-lg">
            <Typography variant="h4" gutterBottom className="text-center mb-0">
              Sales Dashboard
            </Typography>
            <div className="flex items-center">
              <Select
                value={selectedYear}
                onChange={handleYearChange}
                className="bg-white"
              >
                <MenuItem value="All">All</MenuItem>
                {years.map((year) => (
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
            </div>
          </div>

          {/* Customer Stats */}
          <Grid container spacing={3} className="mb-8">
            <Grid item xs={12} sm={6}>
              <Card className="h-full bg-blue-200">
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    Total Customers
                  </Typography>
                  <Typography variant="h3">{customerCount}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Card className="h-full bg-green-200">
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    Total Revenue
                  </Typography>
                  <Typography variant="h3">
                    ₹{totalRevenue.toFixed(2)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Sales Chart */}
          <Paper className="p-4 mb-8">
            <Typography variant="h5" gutterBottom className="mb-4">
              Sales Overview
            </Typography>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart
                data={filteredTransactionData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="transactiondate" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="totalPrice" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </Paper>

          {/* Top Selling Products */}
          <ProductTable
            data={filteredProductData}
            rowsPerPageOptions={[5, 10, 25]}
            page={page}
            rowsPerPage={rowsPerPage}
            handleChangePage={handleChangePage}
            handleChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
