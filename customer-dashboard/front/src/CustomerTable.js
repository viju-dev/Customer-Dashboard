import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination,
  Paper, Box, IconButton, Tooltip, Menu, MenuItem, Typography, TextField
} from '@mui/material';
import { MoreVert as MoreVertIcon } from '@mui/icons-material';
import axios from 'axios';
import { CircularProgress } from '@mui/material';


const CustomerTable = () => {
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [rowCount, setRowCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [sortColumn, setSortColumn] = useState('name');
  const [inputPage, setInputPage] = useState(1);
  const [exporting, setExporting] = useState(false);

  const fetchCustomers = async (page, pageSize, sortColumn, sortDirection) => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8080/Customer/getAll', {
        params: { page, size: pageSize, sortBy: sortColumn, direction: sortDirection },
      });

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
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers(page, pageSize, sortColumn, sortDirection);
  }, [page, pageSize, sortColumn, sortDirection]);

  useEffect(() => {
    setInputPage(page + 1);
  }, [page]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPageSize(Number(event.target.value));
    setPage(0);
  };

  const handleSort = (column) => {
    const newSortDirection = sortColumn === column && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortColumn(column);
    setSortDirection(newSortDirection);
  };

  const handleExport = async (option) => {
    const fileType = option.toLowerCase();
    const url = `http://localhost:8080/Customer/exportData?type=${fileType}`;

    try {
      setExporting(true);

      const response = await axios.get(url, {
        responseType: 'blob',
      });

      const blob = new Blob([response.data], { type: response.headers['content-type'] });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `customers_export_${Date.now()}.${fileType === 'pdf' ? 'pdf' : fileType === 'excel' ? 'xlsx' : 'csv'}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export file. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  const openMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const closeMenu = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ padding: '20px', backgroundColor: 'azure', borderRadius: '8px' }}>
      {/* Header Section */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <Typography variant="h4" gutterBottom>Customer Dashboard</Typography>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>

          {/* Show animated export message while exporting */}
          {exporting && (
            <Box sx={{ display: 'flex', alignItems: 'center', marginRight: '10px' }}>
              <CircularProgress size={18} sx={{ marginRight: '6px' }} />
              <Typography variant="body2" sx={{ color: 'gray', fontStyle: 'italic' }}>
                Exporting
              </Typography>
            </Box>
          )}
          <Tooltip title="Export Options">
            <IconButton onClick={openMenu}>
              <MoreVertIcon />
            </IconButton>
          </Tooltip>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={closeMenu}>
            <MenuItem disabled={exporting} onClick={() => { handleExport('CSV'); closeMenu(); }}>Export to CSV</MenuItem>
            <MenuItem disabled={exporting} onClick={() => { handleExport('Excel'); closeMenu(); }}>Export to Excel</MenuItem>
            <MenuItem disabled={exporting} onClick={() => { handleExport('PDF'); closeMenu(); }}>Export to PDF</MenuItem>
          </Menu>
        </Box>
      </Box>

      {/* Table */}
      <Paper sx={{ overflow: 'hidden', borderRadius: '8px' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell onClick={() => handleSort('id')} style={{ cursor: 'pointer' }}>
                  ID {sortColumn === 'id' ? (sortDirection === 'asc' ? '↓' : '↑') : ''}
                </TableCell>
                <TableCell onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>
                  Name {sortColumn === 'name' ? (sortDirection === 'asc' ? '↓' : '↑') : ''}
                </TableCell>
                <TableCell onClick={() => handleSort('age')} style={{ cursor: 'pointer' }}>
                  Age {sortColumn === 'age' ? (sortDirection === 'asc' ? '↓' : '↑') : ''}
                </TableCell>
                <TableCell onClick={() => handleSort('gender')} style={{ cursor: 'pointer' }}>
                  Gender {sortColumn === 'gender' ? (sortDirection === 'asc' ? '↓' : '↑') : ''}
                </TableCell>
                <TableCell onClick={() => handleSort('contact')} style={{ cursor: 'pointer' }}>
                  Contact {sortColumn === 'contact' ? (sortDirection === 'asc' ? '↓' : '↑') : ''}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">Loading...</TableCell>
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

        {/* Page Input and Pagination */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px' }}>
          <TextField
            // TextField to get any specific page number
            label="Go to page"
            type="number"
            size="small"
            variant="standard"
            value={inputPage}
            onChange={(e) => setInputPage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const newPage = parseInt(inputPage, 10) - 1;
                const maxPage = Math.ceil(rowCount / pageSize);
                if (!isNaN(newPage) && newPage >= 0 && newPage < maxPage) {
                  setPage(newPage);
                }
              }
            }}
            inputProps={{ min: 1, max: Math.ceil(rowCount / pageSize) }}
            sx={{ width: 120 }}
          />

          <TablePagination
            component="div"
            count={rowCount}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={pageSize}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[10, 20, 50, 100]}
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default CustomerTable;
