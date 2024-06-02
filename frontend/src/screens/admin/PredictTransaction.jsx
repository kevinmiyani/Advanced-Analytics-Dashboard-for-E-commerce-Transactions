import React, { useState, useEffect } from "react";
import {
  Typography,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
} from "@mui/material";
import { predictdata } from "../../config/call";
import LoadingPage from "../../components/LoadingPage";
import { toast } from "react-toastify";

const Dashboard = () => {
  const [decodedProducts, setDecodedProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    predictdata
      .getdata()
      .then((res) => {
        setDecodedProducts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

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
          {/* Top Selling Products (Table) */}
          <Paper className="p-4">
            <Typography variant="h5" gutterBottom className="mb-4">
              Quantity Predicted by AI
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Product Price</TableCell>
                    <TableCell>Predicted Quantity</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {decodedProducts
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((product, index) => (
                      <TableRow key={index}>
                        <TableCell>{product.productId.name}</TableCell>
                        <TableCell>{product.productId.price}</TableCell>
                        <TableCell>{product.predicted_quantity}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={decodedProducts.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
