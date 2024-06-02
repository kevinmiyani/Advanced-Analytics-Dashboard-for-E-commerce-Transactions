import React, { useState, useEffect } from "react";
import {
  Paper,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableSortLabel,
  TablePagination,
  Button,
} from "@mui/material";
import { payment, transaction } from "../../config/call";
import Profileimage from "../../assets/profile.png";
import TransactionPopup from "../../components/TransactionPopup";
import { useDispatch, useSelector } from "react-redux";
import LoadingPage from "../../components/LoadingPage";
import { toast } from "react-toastify";
import { setUser } from "../../redux/actions/authActions";
import { useNavigate } from "react-router-dom";

const CustomerStack = () => {
  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [orderBy, setOrderBy] = useState("name");
  const [order, setOrder] = useState("asc");
  const [showProfile, setshowProfile] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userDetails = useSelector((state) => state.auth.user);
  const checkoutHandler = async (amount, id) => {
    await payment.checkout({ amount: amount }).then((res) => {
      const options = {
        key: process.env.REACT_APP_ROZARPAY_KEY,
        amount: amount * 100,
        currency: "INR",
        name: userDetails.name,
        description: "Payment of product",
        image: Profileimage,
        order_id: res.data.order,
        callback_url: `${process.env.REACT_APP_BASE_URL}/api/payment/paymentverification`,
        prefill: {
          name: userDetails.name,
          email: userDetails.email,
          contact: "9999999999",
        },
        notes: {
          address: "Razorpay Corporate Office",
        },
        theme: {
          color: "#121212",
        },
        handler: async function (response) {
          if (response.razorpay_payment_id) {
            await transaction
              .updateTransactions(id, {
                status: "Completed",
              })
              .then((res) => {
                fetchData();
                toast.success("Transaction Done successful!");
              })
              .catch((err) => {
                console.log(err);
                toast.error("Transaction Fail");
              });
          } else {
            toast.error("Transaction Fail");
          }
        },
      };
      const razor = new window.Razorpay(options);
      razor.open();
    });
  };

  useEffect(() => {
    setLoading(true);
    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.setItem("access_token", "");
    localStorage.setItem("access_type", "");
    dispatch(setUser(null));
    navigate("/");
    window.location.reload();
  };

  const fetchData = () => {
    transaction
      .getCustomerTransactions()
      .then((res) => {
        setTransactions(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const handleRequestSort = (property) => {
    const isAscending = orderBy === property && order === "asc";
    setOrder(isAscending ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleTogglePRofile = () => {
    setshowProfile(!showProfile);
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
        customerId: userDetails.data._id,
        quantity: newTransaction.quantity,
        totalPrice: newTransaction.totalPrice,
        status: "Pending",
      })
      .then((res) => {
        console.log("res", res.data);
        fetchData();
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
    console.log("updatedTransaction", updatedTransaction);
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

    setTransactions(
      transactions.filter(
        (transaction) => transaction._id !== transactionToDelete._id
      )
    );
  };

  const sortedTransactions = transactions.sort((a, b) => {
    if (orderBy === "name") {
      return order === "asc"
        ? a.productId.name.localeCompare(b.productId.name)
        : b.productId.name.localeCompare(a.productId.name);
    } else if (orderBy === "price") {
      return order === "asc"
        ? a.totalPrice - b.totalPrice
        : b.totalPrice - a.totalPrice;
    } else if (orderBy === "quantity") {
      return order === "asc"
        ? a.quantity - b.quantity
        : b.quantity - a.quantity;
    } else {
      return 0;
    }
  });

  return (
    <div>
      {loading ? (
        <LoadingPage />
      ) : (
        <div className="container mx-auto px-4 py-8">
          <nav className="bg-white relative border-gray-200 dark:bg-gray-900">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
              <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
                Customer Dashboard
              </span>
              <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
                <button
                  type="button"
                  className="flex text-sm bg-gray-800 rounded-full md:me-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                  onClick={handleTogglePRofile}
                >
                  <span className="sr-only">Open user menu</span>
                  <img
                    className="w-8 h-8 rounded-full"
                    src={Profileimage}
                    alt="user photo"
                  />
                </button>
              </div>
            </div>
            <div
              className={`z-50 ${
                showProfile ? "block" : "hidden"
              } absolute right-1 my-1 mx-1 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600`}
            >
              <div className="px-4 py-3">
                <span className="block text-sm text-gray-900 dark:text-white">
                  {userDetails.data.name}
                </span>
                <span className="block text-sm  text-gray-500 truncate dark:text-gray-400">
                  {userDetails.data.email}
                </span>
              </div>
              <ul className="py-2" aria-labelledby="user-menu-button">
                <li>
                  <button
                    onClick={handleLogout}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                  >
                    Sign out
                  </button>
                </li>
              </ul>
            </div>
          </nav>

          <Paper className="p-4 mb-8 mt-10">
            <div className="flex">
              <Typography variant="h5">All Transactions</Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleOpenPopup()}
                sx={{ marginLeft: 5 }}
              >
                Add Transaction
              </Button>
            </div>
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
                  {sortedTransactions
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((transaction, index) => (
                      <TableRow key={index} style={{ cursor: "pointer" }}>
                        <TableCell>{transaction.productId.name}</TableCell>
                        <TableCell>₹{transaction.totalPrice}</TableCell>
                        <TableCell>{transaction.quantity}</TableCell>
                        <TableCell>
                          {transaction.status === "Pending" ? (
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={() =>
                                checkoutHandler(
                                  transaction.totalPrice,
                                  transaction._id
                                )
                              }
                            >
                              Pay
                            </Button>
                          ) : (
                            <>{transaction.status}</>
                          )}
                        </TableCell>
                        <TableCell>
                          {transaction.status === "Pending" ? (
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={() => handleOpenPopup(transaction)}
                            >
                              Edit
                            </Button>
                          ) : (
                            <>Not Edited</>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={transactions.length}
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

export default CustomerStack;
