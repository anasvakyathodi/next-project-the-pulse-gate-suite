import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  TablePagination,
} from "@mui/material";
import { useDataLayerValue } from "./../context/DataLayer";
import moment from "moment";
import { useState } from "react";
import { getTableData } from "../actions/users";
import ReviewArticle from "./reviewArticle";
const CustomTable = () => {
  const [{ user, tableData, count }, dispatch] = useDataLayerValue();
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [open, setOpen] = useState(false);
  const [reviewData, setReviewData] = useState(null);
  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
    getTableData({ pageNumber: newPage, rowsPerPage: rowsPerPage }, dispatch);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    getTableData(
      { pageNumber: page, rowsPerPage: parseInt(event.target.value, 10) },
      dispatch
    );
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleReview = (data: any) => {
    if (user.userType !== "admin") {
      return;
    }
    setReviewData(data);
    setOpen(true);
  };

  return (
    <>
      <ReviewArticle open={open} handleClose={handleClose} data={reviewData} />
      <TableContainer
        component={Paper}
        sx={{ maxHeight: "485px", overflowY: "auto" }}
      >
        <Table sx={{ minWidth: 500 }} size="medium" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell align="center">Status</TableCell>
              {user?.userType === "admin" && (
                <TableCell align="center">Author Name</TableCell>
              )}
              <TableCell align="center">Article Title</TableCell>
              {user?.userType !== "admin" && (
                <TableCell align="center">Remarks</TableCell>
              )}
              <TableCell align="center">Submission Time</TableCell>
              <TableCell align="center">Time since submission</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.map((row: any) => (
              <TableRow
                key={row._id}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  cursor: "pointer",
                }}
                onClick={() => handleReview(row)}
              >
                <TableCell component="th" scope="row" align="center">
                  {row.status === "no action" && (
                    <Box
                      sx={{
                        borderRadius: "50%",
                        backgroundColor: "red",
                        width: "14px",
                        height: "14px",
                        margin: "auto",
                      }}
                    />
                  )}
                  {row.status === "accepted" && (
                    <Box
                      sx={{
                        borderRadius: "50%",
                        backgroundColor: "green",
                        width: "14px",
                        height: "14px",
                        margin: "auto",
                      }}
                    />
                  )}
                  {row.status === "rejected" && (
                    <Box
                      sx={{
                        borderRadius: "50%",
                        backgroundColor: "brown",
                        width: "14px",
                        height: "14px",
                        margin: "auto",
                      }}
                    />
                  )}
                </TableCell>
                {user.userType === "admin" && (
                  <TableCell align="center">{row.authorName}</TableCell>
                )}
                <TableCell align="center">{row.title}</TableCell>
                {user.userType !== "admin" && (
                  <TableCell align="center">
                    {row.remarks ? row.remarks : "No remarks"}
                  </TableCell>
                )}
                <TableCell align="center">
                  {moment(row.submissionTime).format("DD/MM/YYYY HH:mm:ss")}
                </TableCell>
                <TableCell align="center">
                  {moment(row.submissionTime).fromNow(true)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={count}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );
};

export default CustomTable;