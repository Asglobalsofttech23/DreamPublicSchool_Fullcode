import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Button, Dialog, DialogActions, DialogContent, FormControl, Grid, MenuItem, Select, TextField } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import UpdateStudent from './UpdateStudent';
import config from '../../config';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import StudentEnquiryApplication from './StudentEnquiryApplication';
import StudentBookingApplication from './Booking';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

function AllStudents() {
  const [roleData, setRoleData] = useState([]);
  const [clsData, setClsData] = useState([]);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openAddBooking, setOpenAddBooking] = useState(false);
  const [openAddEnquiry, setOpenAddEnquiry] = useState(false);
  const [dlt, setDlt] = useState(false);
  const [updateData, setUpdateData] = useState();
  const [dataPerPage, setDataPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchedVal, setSearchedVal] = useState('');
  const [addData, setAddData] = useState();

  const navigate = useNavigate();

  useEffect(() => {
    Axios.get(`${config.apiURL}/students/getAllStudents`)
      .then((res) => {
        setRoleData(res.data);
        console.log("Response data:", res.data);
      })
      .catch((err) => {
        console.log('Error:', err);
      });
  }, [openUpdate, openAddBooking, openAddEnquiry, dlt]);

  useEffect(() => {
    Axios.get(`${config.apiURL}/clsAndSec/getClass`)
      .then((res) => {
        setClsData(res.data);
      })
      .catch((err) => {
        console.log("Error fetching Class data", err);
      });
  }, []);

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

  const handleUpdate = (id) => {
    const selectData = roleData.find((stu) => stu.stu_id === id);
    if (selectData) {
      setUpdateData(selectData);
      setOpenUpdate(true);
    }
  };

  const handleAddBooking = (student) => {
    setAddData(student);
    setOpenAddBooking(true);
  };

  const handleAddEnquiry = () => {
    setOpenAddEnquiry(true);
  };

  const handleDlt = (id) => {
    Axios.delete(`${config.apiURL}/students/deleteStudent/${id}`)
      .then(() => {
        console.log("Deleted successfully");
        setDlt(prev => !prev);  // Toggle dlt to trigger useEffect
      })
      .catch((err) => {
        console.log('Error:', err);
      });
  };

  const handleChangeDataPerPage = (e) => {
    const newDataPerPage = parseInt(e.target.value, 10);
    setDataPerPage(newDataPerPage);
    setCurrentPage(1);
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

  // Filter the data based on search value
  const filteredData = roleData.filter(search);

  // Paginate the filtered data
  const firstIndexOfData = (currentPage - 1) * dataPerPage;
  const lastIndexOfData = dataPerPage > 0 ? currentPage * dataPerPage : filteredData.length;
  const currentData = filteredData.slice(firstIndexOfData, lastIndexOfData);

  const getClassName = (classId) => {
    const classData = clsData.find(cls => cls.cls_id == classId);
    return classData ? classData.cls_name : 'N/A';
  };

  return (
    <div>
      <Grid container spacing={3}>
        <Grid item xs={4}>
          <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleAddEnquiry}>New Admission</Button>
          <Link to='/uploadExcel' className='ms-2'>
            <Button variant="contained" color="success">Upload Excel</Button>
          </Link>
        </Grid>
        <Grid item xs={4}>
          <TextField label="Search" onChange={(e) => setSearchedVal(e.target.value)} value={searchedVal} />
        </Grid>
        <Grid item xs={4}>
          <FormControl>
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
      <TableContainer component={Paper} className='mt-3'>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>S.no</StyledTableCell>
              <StyledTableCell align="right">Student name</StyledTableCell>
              <StyledTableCell align="right">Date Of Birth</StyledTableCell>
              <StyledTableCell align="right">Class</StyledTableCell>
              <StyledTableCell align="right">Date Of Join</StyledTableCell>
              <StyledTableCell align="right">Aadhar no</StyledTableCell>
              <StyledTableCell align="right">Father name</StyledTableCell>
              <StyledTableCell align="right">Mother name</StyledTableCell>
              <StyledTableCell align="right">Father Mobile</StyledTableCell>
              <StyledTableCell align="right">Mother Mobile</StyledTableCell>
              <StyledTableCell align="right">Gender</StyledTableCell>
              <StyledTableCell align="right">Community</StyledTableCell>
              <StyledTableCell align="right">Address</StyledTableCell>
              <StyledTableCell align="right">Booking Fess</StyledTableCell>
              <StyledTableCell align="right">Tution Fess</StyledTableCell>
              <StyledTableCell align="right">Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentData.map((row, index) => (
              <StyledTableRow key={row.stu_id}>
                <StyledTableCell component="th" scope="row">
                  {firstIndexOfData + index + 1}
                </StyledTableCell>
                <StyledTableCell align="right">{row.stu_name}</StyledTableCell>
                <StyledTableCell align="right">{formatDate(row.dob)}</StyledTableCell>
                <StyledTableCell align="right">{getClassName(row.cls_id)}</StyledTableCell>
                <StyledTableCell align="right">{formatDate(row.date_of_join)}</StyledTableCell>
                <StyledTableCell align="right">{row.aadhar_no}</StyledTableCell>
                <StyledTableCell align="right">{row.father_name}</StyledTableCell>
                <StyledTableCell align="right">{row.mother_name}</StyledTableCell>
                <StyledTableCell align="right">{row.father_mobile}</StyledTableCell>
                <StyledTableCell align="right">{row.mother_mobile}</StyledTableCell>
                <StyledTableCell align="right">{row.gender}</StyledTableCell>
                <StyledTableCell align="right">{row.community}</StyledTableCell>
                <StyledTableCell align="right">{row.address}</StyledTableCell>
                <StyledTableCell align="right">{row.bookingfees}</StyledTableCell>
                <StyledTableCell align="right">{row.tution_fees}</StyledTableCell>
                <StyledTableCell align="right">
                  {/* <Link to={`/payfees/${row.stu_id}`}>
                  <Button variant="contained" color='success' fullWidth startIcon={<AddIcon/>} >
                    Pay Fees
                  </Button>
                  </Link> */}
                
                  <Button variant="contained" color='error' fullWidth startIcon={<DeleteIcon />} onClick={() => handleDlt(row.stu_id)}>
                    Delete
                  </Button>
                  <Button variant="contained" color="primary" fullWidth startIcon={<EditIcon />} onClick={() => handleUpdate(row.stu_id)}>
                    Edit
                  </Button>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Grid container spacing={1} display='flex' justifyContent='center' className='mt-3'>
        <Stack spacing={2}>
          <Pagination count={Math.ceil(filteredData.length / dataPerPage)} page={currentPage} onChange={handlePageChange} variant="outlined" />
        </Stack>
      </Grid>

      <Dialog open={openAddBooking} onClose={() => setOpenAddBooking(false)}>
        <DialogContent>
          <StudentBookingApplication data={addData} onClose={() => setOpenAddBooking(false)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddBooking(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openAddEnquiry} onClose={() => setOpenAddEnquiry(false)}>
        <DialogContent>
          <StudentEnquiryApplication data={addData} onClose={() => setOpenAddEnquiry(false)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddEnquiry(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openUpdate} onClose={() => setOpenUpdate(false)}>
        <DialogContent>
          <UpdateStudent data={updateData} onClose={() => setOpenUpdate(false)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenUpdate(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default AllStudents;
