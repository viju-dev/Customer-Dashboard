import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Box,
  InputAdornment,
  IconButton,
  TextField,
  Tooltip,
  Menu,
  MenuItem,
  Select,
  MenuItem as MuiMenuItem,
  FormControl,
  InputLabel,
  Button,
  Typography,
} from "@mui/material";
import {
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
} from "@mui/icons-material";
import axios from "axios";

const CustomerTable = () => {
  const [rows, setRows] = useState([]); // Data for the table
  const [page, setPage] = useState(0); // Current page number
  const [pageSize, setPageSize] = useState(20); // Rows per page
  const [rowCount, setRowCount] = useState(0); // Total rows for pagination
  const [loading, setLoading] = useState(false); // Loading state for API call
  const [anchorEl, setAnchorEl] = useState(null); // Menu anchor
  const [search, setSearch] = useState(""); // Search text
  const [sortDirection, setSortDirection] = useState("asc");
  const [sortColumn, setSortColumn] = useState("name");

  const fetchCustomers = async (page, pageSize, sortColumn, sortDirection) => {
    setLoading(true); // Show loading state
    try {
      const response = await axios.get(
        "http://192.168.0.103:8080/Customer/getAll",
        {
          params: {
            page,
            size: pageSize,
            sortBy: sortColumn,
            direction: sortDirection,
          },
        }
      );

      const customers = response.data.payload.data.content.map((customer) => ({
        id: customer.id,
        name: customer.name,
        age: customer.age,
        gender: customer.gender,
        contact: customer.contact,
      }));

      setRows(customers);
      setRowCount(response.data.payload.data.totalElements);
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      setLoading(false); // Stop loading state
    }
  };

  useEffect(() => {
    fetchCustomers(page, pageSize, sortColumn, sortDirection);
    // fetchCustomers(page, pageSize, search);
  }, [page, pageSize, search, sortColumn, sortDirection]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPageSize(Number(event.target.value));
    setPage(0);
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleSort = (column) => {
    const newSortDirection =
      sortColumn === column && sortDirection === "asc" ? "desc" : "asc";
    setSortColumn(column);
    setSortDirection(newSortDirection);
  };

  const handleExport = async (option) => {
    const fileType = option.toLowerCase();
    const url = `http://192.168.0.103:8080/Customer/exportData?type=${fileType}`;
    window.open(url, "_blank");
  };

  const openMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const closeMenu = () => {
    setAnchorEl(null);
  };

  return (
    <Box
      sx={{ padding: "20px", backgroundColor: "azure", borderRadius: "8px" }}
    >
      {/* #f9f9f9 */}
      {/* Header Section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <Typography variant="h4" gutterBottom>
          Customer Dashboard
        </Typography>

        {/* Export Dropdown */}
        <Tooltip title="Export Options">
          <IconButton onClick={openMenu}>
            <MoreVertIcon />
          </IconButton>
        </Tooltip>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={closeMenu}>
          <MenuItem
            onClick={() => {
              handleExport("CSV");
              closeMenu();
            }}
          >
            Export to CSV
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleExport("Excel");
              closeMenu();
            }}
          >
            Export to Excel
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleExport("PDF");
              closeMenu();
            }}
          >
            Export to PDF
          </MenuItem>
        </Menu>
      </Box>

      {/* Table */}
      <Paper sx={{ overflow: "hidden", borderRadius: "8px" }}>
        <TableContainer className="">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell
                  onClick={() => handleSort("id")}
                  style={{ cursor: "pointer" }}
                >
                  ID{" "}
                  {sortColumn === "id"
                    ? sortDirection === "asc"
                      ? "↓"
                      : "↑"
                    : ""}
                </TableCell>
                <TableCell
                  onClick={() => handleSort("name")}
                  style={{ cursor: "pointer" }}
                >
                  Name{" "}
                  {sortColumn === "name"
                    ? sortDirection === "asc"
                      ? "↓"
                      : "↑"
                    : ""}
                </TableCell>
                <TableCell
                  onClick={() => handleSort("age")}
                  style={{ cursor: "pointer" }}
                >
                  Age{" "}
                  {sortColumn === "age"
                    ? sortDirection === "asc"
                      ? "↓"
                      : "↑"
                    : ""}
                </TableCell>
                <TableCell
                  onClick={() => handleSort("gender")}
                  style={{ cursor: "pointer" }}
                >
                  Gender{" "}
                  {sortColumn === "gender"
                    ? sortDirection === "asc"
                      ? "↓"
                      : "↑"
                    : ""}
                </TableCell>
                <TableCell
                  onClick={() => handleSort("contact")}
                  style={{ cursor: "pointer" }}
                >
                  Contact{" "}
                  {sortColumn === "contact"
                    ? sortDirection === "asc"
                      ? "↓"
                      : "↑"
                    : ""}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.id}</TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.age}</TableCell>
                    <TableCell>{row.gender}</TableCell>
                    <TableCell>{row.contact}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <TablePagination
          component="div"
          count={rowCount}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={pageSize}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[10, 20, 50, 100]}
        />
      </Paper>
    </Box>
  );
};

export default CustomerTable;
