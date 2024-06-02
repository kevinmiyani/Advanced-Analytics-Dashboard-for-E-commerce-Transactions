import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
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
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableSortLabel,
  TablePagination,
  Button,
} from "@mui/material";
import { transaction } from "../../config/call";
import TransactionPopup from "../../components/TransactionPopup";
import LoadingPage from "../../components/LoadingPage";
import { toast } from "react-toastify";

const TransactionScreen = () => {
  const [allTransactionData, setAllTransactionData] = useState([]);
  const [selectedYear, setSelectedYear] = useState("All");
  const [selectedMonthRange, setSelectedMonthRange] = useState("All");
  const [years, setYears] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [averageTransactionsPerDay, setAverageTransactionsPerDay] = useState(0);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [orderBy, setOrderBy] = useState("name");
  const [order, setOrder] = useState("asc");
  const [popupOpen, setPopupOpen] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    fetchData();
  }, []);

  const fetchData = () => {
    transaction.getAllTransactions().then((res) => {
      const yearsSet = new Set();
      console.log("res", res.data);
      const formattedTransactionData = res.data.map((transaction) => {
        const date = new Date(transaction.transactiondate);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        yearsSet.add(year);

        return {
          ...transaction,
          transactiondate: date,
          year: year,
          month: month,
        };
      });

      setYears(Array.from(yearsSet));
      setAllTransactionData(formattedTransactionData);
      setLoading(false);
    });
  };

  const formatDate = (date) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  const handleMonthRangeChange = (event) => {
    setSelectedMonthRange(event.target.value);
  };

  const handleRequestSort = (property) => {
    const isAscending = orderBy === property && order === "asc";
    setOrder(isAscending ? "desc" : "asc");
    setOrderBy(property);
  };

  const getFilteredTransactionData = () => {
    return allTransactionData.filter((transaction) => {
      const inYear =
        selectedYear === "All" || transaction.year === parseInt(selectedYear);
      const inMonthRange =
        selectedMonthRange === "All" ||
        (selectedMonthRange === "1-6"
          ? transaction.month >= 1 && transaction.month <= 6
          : transaction.month >= 7 && transaction.month <= 12);
      return inYear && inMonthRange;
    });
  };

  const filteredTransactionData = getFilteredTransactionData();

  useEffect(() => {
    const totalTransactionsCount = filteredTransactionData.length;
    const totalDays = filteredTransactionData.reduce((daysSet, transaction) => {
      daysSet.add(transaction.transactiondate.toDateString());
      return daysSet;
    }, new Set()).size;

    const avgTransactions =
      totalDays > 0 ? totalTransactionsCount / totalDays : 0;

    setTotalTransactions(totalTransactionsCount);
    setAverageTransactionsPerDay(avgTransactions);
  }, [filteredTransactionData]);

  const sortedFilteredTransactionData = filteredTransactionData.sort((a, b) => {
    if (orderBy === "name") {
      return order === "asc"
        ? a.productId.name.localeCompare(b.productId.name)
        : b.productId.name.localeCompare(a.productId.name);
    } else if (orderBy === "price") {
      return order === "asc"
        ? a.productId.price - b.productId.price
        : b.productId.price - a.productId.price;
    } else if (orderBy === "quantity") {
      return order === "asc"
        ? a.quantity - b.quantity
        : b.quantity - a.quantity;
    } else {
      return 0;
    }
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenPopup = (transaction = null) => {
    setCurrentTransaction(transaction);
    setPopupOpen(true);
  };

  const handleClosePopup = () => {
    setPopupOpen(false);
    setCurrentTransaction(null);
  };

  const handleAddTransaction = (newTransaction) => {
    setLoading(true);

    transaction
      .addTransactions({
        productId: newTransaction.productId,
        customerId: newTransaction.customerId,
        quantity: newTransaction.quantity,
        totalPrice: newTransaction.totalPrice,
        status: newTransaction.status,
      })
      .then((res) => {
        console.log("res", res.data);
        fetchData();
        setLoading(false);
        toast.success("Transaction Added successful!");
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        toast.error("Fail to Add Transaction ");
      });
  };

  const handleUpdateTransaction = (updatedTransaction) => {
    // Update the transaction in the local state
    setLoading(true);

    transaction
      .updateTransactions(updatedTransaction._id, {
        quantity: updatedTransaction.quantity,
        totalPrice: updatedTransaction.totalPrice,
        status: updatedTransaction.status,
      })
      .then((res) => {
        console.log(res);
        fetchData();
        setLoading(false);
        toast.success("Transaction Updated successful!");
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        toast.error("Fail to Update Transaction ");
      });
  };

  const handleDeleteTransaction = (transactionToDelete) => {
    // Delete the transaction from the local state
    transaction
      .deleteTransaction(transactionToDelete._id)
      .then((res) => {
        console.log("res", res.data);
        fetchData();
        setLoading(false);
        toast.success("Transaction Deleted successful!");
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        toast.error("Fail to Delete Transaction ");
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
              Transaction Overview
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
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleOpenPopup()}
                sx={{ marginLeft: 5 }}
              >
                Add Transaction
              </Button>
            </div>
          </div>

          {/* Customer Stats */}
          <Grid container spacing={2} className="mb-8">
            <Grid item xs={12} sm={6}>
              <Card className="h-full bg-yellow-200">
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    Average Transactions per Month
                  </Typography>
                  <Typography variant="h3">
                    {averageTransactionsPerDay.toFixed(2)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Card className="h-full bg-yellow-200">
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    Total Transactions
                  </Typography>
                  <Typography variant="h3">{totalTransactions}</Typography>
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
              <BarChart
                data={filteredTransactionData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="transactiondate"
                  tickFormatter={(date) => formatDate(date)}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="totalPrice" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>

          <Paper className="p-4 mb-8">
            <Typography variant="h5" gutterBottom className="mb-4">
              All Transactions
            </Typography>
            <div className="overflow-x-auto">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === "name"}
                        direction={order}
                        onClick={() => handleRequestSort("name")}
                      >
                        Product Name
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === "price"}
                        direction={order}
                        onClick={() => handleRequestSort("price")}
                      >
                        Price
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === "quantity"}
                        direction={order}
                        onClick={() => handleRequestSort("quantity")}
                      >
                        Quantity
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortedFilteredTransactionData
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((transaction, index) => (
                      <TableRow
                        key={index}
                        onClick={() => handleOpenPopup(transaction)}
                        style={{ cursor: "pointer" }}
                      >
                        <TableCell>{transaction.productId.name}</TableCell>
                        <TableCell>₹{transaction.totalPrice}</TableCell>
                        <TableCell>{transaction.quantity}</TableCell>
                        <TableCell>{transaction.status}</TableCell>
                        <TableCell>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleOpenPopup(transaction)}
                          >
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredTransactionData.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </div>
          </Paper>

          <TransactionPopup
            open={popupOpen}
            handleClose={handleClosePopup}
            transaction={currentTransaction}
            onAdd={handleAddTransaction}
            onUpdate={handleUpdateTransaction}
            onDelete={handleDeleteTransaction}
          />
        </div>
      )}
    </div>
  );
};

export default TransactionScreen;
