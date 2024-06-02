import React, { useEffect, useState } from "react";
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
  Box,
} from "@mui/material";
import { customer } from "../../config/call";
import CustomerPopup from "../../components/CustomerPopup";
import LoadingPage from "../../components/LoadingPage";
import { toast } from "react-toastify";

const CustomerScreen = () => {
  const [allCustomerData, setAllCustomerData] = useState([]);
  const [selectedYear, setSelectedYear] = useState("All");
  const [selectedMonthRange, setSelectedMonthRange] = useState("All");
  const [years, setYears] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [orderBy, setOrderBy] = useState("name");
  const [order, setOrder] = useState("asc");
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [averageCustomersPerMonth, setAverageCustomersPerMonth] = useState(0);
  const [popupOpen, setPopupOpen] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchData();
  }, []);

  const fetchData = () => {
    customer.getAllCustomer().then((res) => {
      const yearsSet = new Set();

      const formattedCustomerData = res.data.map((customer) => {
        const date = new Date(customer.createdAt);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        yearsSet.add(year);

        return {
          ...customer,
          createdAt: date,
          year: year,
          month: month,
        };
      });

      setYears(Array.from(yearsSet));
      setAllCustomerData(formattedCustomerData);
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

  const getFilteredCustomerData = () => {
    return allCustomerData.filter((customer) => {
      const inYear =
        selectedYear === "All" || customer.year === parseInt(selectedYear);
      const inMonthRange =
        selectedMonthRange === "All" ||
        (selectedMonthRange === "1-6"
          ? customer.month >= 1 && customer.month <= 6
          : customer.month >= 7 && customer.month <= 12);
      return inYear && inMonthRange;
    });
  };

  const filteredCustomerData = getFilteredCustomerData();

  useEffect(() => {
    const totalCustomersCount = filteredCustomerData.length;
    const totalMonths = filteredCustomerData.reduce((monthsSet, customer) => {
      const monthYear = `${customer.month}-${customer.year}`;
      monthsSet.add(monthYear);
      return monthsSet;
    }, new Set()).size;

    const avgCustomers =
      totalMonths > 0 ? totalCustomersCount / totalMonths : 0;

    setTotalCustomers(totalCustomersCount);
    setAverageCustomersPerMonth(avgCustomers);
  }, [filteredCustomerData]);

  const sortedFilteredCustomerData = filteredCustomerData.sort((a, b) => {
    if (orderBy === "name") {
      return order === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    } else if (orderBy === "email") {
      return order === "asc"
        ? a.email.localeCompare(b.email)
        : b.email.localeCompare(a.email);
    } else if (orderBy === "address") {
      return order === "asc"
        ? a.address.localeCompare(b.address)
        : b.address.localeCompare(a.address);
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

  const handleOpenPopup = (customer = null) => {
    setCurrentCustomer(customer);
    setPopupOpen(true);
  };

  const handleClosePopup = () => {
    setPopupOpen(false);
    setCurrentCustomer(null);
  };

  const handleAddCustomer = (newCustomer) => {
    setLoading(true);
    customer
      .addCustomer({
        name: newCustomer.name,
        email: newCustomer.email,
        password: newCustomer.password,
        address: newCustomer.address,
      })
      .then((res) => {
        console.log("res", res.data);
        fetchData();
        setLoading(false);
        toast.success("User Added successful!");
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        toast.error("Fail to Add User ");
      });
  };

  const handleUpdateCustomer = (updatedCustomer) => {
    setLoading(true);
    customer
      .updateCustomer(updatedCustomer._id, {
        name: updatedCustomer.name,
        address: updatedCustomer.address,
      })
      .then((res) => {
        console.log("res", res);
        fetchData();
        setLoading(false);
        toast.success("User Updated successful!");
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        toast.error("Fail to Update User ");
      });
  };

  const handleDeleteCustomer = (customerToDelete) => {
    setLoading(true);
    customer
      .deleteCustomer(customerToDelete._id)
      .then((res) => {
        console.log("res.data", res.data);
        fetchData();
        setLoading(false);
        toast.success("User Deleted successful!");
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        toast.error("Fail to Delete User ");
      });
  };

  return (
    <div>
      {loading ? (
        <LoadingPage />
      ) : (
        <Box sx={{ padding: 3, backgroundColor: "#f5f5f5" }}>
          <div className="flex w-full justify-between items-center mb-8 bg-white p-6 rounded-lg shadow-lg">
            <Typography variant="h4" gutterBottom className="text-center mb-0">
              Customer Overview
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
                Add Customer
              </Button>
            </div>
          </div>

          {/* Customer Stats */}
          <Grid container spacing={2} className="mb-8">
            <Grid item xs={12} sm={6}>
              <Card className="h-full bg-yellow-200">
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    Average Customers per Month
                  </Typography>
                  <Typography variant="h3">
                    {averageCustomersPerMonth.toFixed(2)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Card className="h-full bg-yellow-200">
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    Total Customers
                  </Typography>
                  <Typography variant="h3">{totalCustomers}</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Customer Table */}
          <Paper className="p-4 mb-8">
            <Typography variant="h5" gutterBottom className="mb-4">
              All Customers
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
                        Name
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === "email"}
                        direction={order}
                        onClick={() => handleRequestSort("email")}
                      >
                        Email
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === "address"}
                        direction={order}
                        onClick={() => handleRequestSort("address")}
                      >
                        Address
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>Date</TableCell>

                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortedFilteredCustomerData
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((customer, index) => (
                      <TableRow
                        key={index}
                        onClick={() => handleOpenPopup(customer)}
                        style={{ cursor: "pointer" }}
                      >
                        <TableCell>{customer.name}</TableCell>
                        <TableCell>{customer.email}</TableCell>
                        <TableCell>{customer.address}</TableCell>
                        <TableCell>{formatDate(customer.createdAt)}</TableCell>

                        <TableCell>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleOpenPopup(customer)}
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
                count={filteredCustomerData.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </div>
          </Paper>

          <CustomerPopup
            open={popupOpen}
            handleClose={handleClosePopup}
            customer={currentCustomer}
            onAdd={handleAddCustomer}
            onUpdate={handleUpdateCustomer}
            onDelete={handleDeleteCustomer}
          />
        </Box>
      )}
    </div>
  );
};

export default CustomerScreen;
