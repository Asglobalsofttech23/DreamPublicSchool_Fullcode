
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { FormControl, Grid, Select, MenuItem, TextField, Button } from '@mui/material';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import config from "../../config";

const FeesPendingStudentsIndex = () => {
  const [stuData, setStuData] = useState([]);
  const [dataPerPage, setDataPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchedVal, setSearchedVal] = useState('');
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    axios.get(`${config.apiURL}/dashboard/feePendingStudents`)
      .then((res) => {
        setStuData(res.data);
        setTotalPages(Math.ceil(res.data.length / dataPerPage));
      })
      .catch((err) => {
        console.log("Error fetching students data", err);
      });
  }, [dataPerPage]);

  const handleChangeDataPerPage = (e) => {
    const newDataPerPage = parseInt(e.target.value, 10);
    setDataPerPage(newDataPerPage);
    setCurrentPage(1);
    setTotalPages(Math.ceil(stuData.length / newDataPerPage));
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const search = (item) => {
    const searchValue = searchedVal.toLowerCase();
    return Object.values(item).some(
      (value) => value && value.toString().toLowerCase().includes(searchValue)
    );
  };

  const filteredData = stuData.filter(search);
  const displayedData = dataPerPage === 0 ? filteredData : filteredData.slice((currentPage - 1) * dataPerPage, currentPage * dataPerPage);

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));

  const handlePrint = () => {
    const printWindow = window.open('', '', 'height=800,width=1200');
    printWindow.document.write('<html><head><title>Print</title>');
    printWindow.document.write('<style>@media print { .no-print { display: none; } }</style>');
    printWindow.document.write('</head><body >');
    printWindow.document.write(document.getElementById('printableArea').innerHTML);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  return (
    <div>
      <h1 className='text-center'>Pending Students</h1>
      <Grid container spacing={3} alignItems="center">
        <Grid item xs={4}></Grid>
        <Grid item xs={4}>
          <TextField
            label="Search"
            onChange={(e) => setSearchedVal(e.target.value)}
            value={searchedVal}
            fullWidth
          />
        </Grid>
        <Grid item xs={4}>
          <FormControl fullWidth>
            <Select value={dataPerPage} onChange={handleChangeDataPerPage}>
              <MenuItem value={5}>5 Per Page</MenuItem>
              <MenuItem value={10}>10 Per Page</MenuItem>
              <MenuItem value={15}>15 Per Page</MenuItem>
              <MenuItem value={20}>20 Per Page</MenuItem>
              <MenuItem value={0}>All Per Page</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      <Button variant="contained" color="primary" onClick={handlePrint} className="no-print">
        Print
      </Button>
      <TableContainer component={Paper} className='mt-3' id="printableArea">
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>S.no</StyledTableCell>
              <StyledTableCell align="right">Student Name</StyledTableCell>
              <StyledTableCell align="right">Student ID</StyledTableCell>
              <StyledTableCell align="right">Class Name</StyledTableCell>
              <StyledTableCell align="right">Section Name</StyledTableCell>
              <StyledTableCell align="right">Pending Fees</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedData.map((stu, index) => (
              <StyledTableRow key={stu.stu_id}>
                <StyledTableCell>{dataPerPage === 0 ? index + 1 : (currentPage - 1) * dataPerPage + index + 1}</StyledTableCell>
                <StyledTableCell align="right">{stu.stu_name}</StyledTableCell>
                <StyledTableCell align="right">{stu.stu_id}</StyledTableCell>
                <StyledTableCell align="right">{stu.cls_name}</StyledTableCell>
                <StyledTableCell align="right">{stu.sec_name}</StyledTableCell>
                <StyledTableCell align="right">{stu.pending_fees}</StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {dataPerPage !== 0 && (
        <Grid container spacing={1} justifyContent="center" className='mt-3'>
          <Stack spacing={2}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              variant="outlined"
              shape="rounded"
            />
          </Stack>
        </Grid>
      )}
    </div>
  );
};

export default FeesPendingStudentsIndex;
