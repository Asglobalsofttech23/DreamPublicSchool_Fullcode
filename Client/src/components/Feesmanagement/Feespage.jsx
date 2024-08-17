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
import { Button, Checkbox, Dialog, DialogActions, DialogContent, FormControl, Grid, MenuItem, Select, TextField } from '@mui/material';
import { Link, useParams } from 'react-router-dom';
// import EditAlloc from './EditAlloc';
import config from '../../config';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { Add, Edit } from '@mui/icons-material';
import Allotfees from './Allotfees';

function Feespage() {
  const { cls_id } = useParams();
  const [studentData, setStudentData] = useState(null);
  const [error, setError] = useState(null);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [allocUpdateData, setAllocUpdateData] = useState([]);
  const [dataPerPage, setDataPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchedVal, setSearchedVal] = useState('');

  useEffect(() => {
    if (cls_id) {
      Axios.get(`${config.apiURL}/feeAllocation/tutionfeesget/${cls_id}`)
        .then((res) => {
         
          setStudentData(res.data);
          console.log(res.data)
        })
        .catch((err) => {
          setError("Error in fetching data: " + (err.response?.data?.message || err.message));
        });
    } else {
      setError("No class ID provided");
    }
  }, [cls_id, config.apiURL,allocUpdateData,openUpdate]);

  



  const handleUpdate = (id) => {
    const selectedData = studentData.find((alloc) => alloc.stu_id === id);
    if (selectedData) {
      setAllocUpdateData(selectedData);
      setOpenUpdate(true);
    }
  };

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

  const handleSelect = (index) => {
    const updatedData = [...studentData];
    updatedData[index].selected = !updatedData[index].selected;
    setStudentData(updatedData);
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
    return item.stu_name.toLowerCase().includes(searchValue);
  };

  const firstIndexOfData = (currentPage - 1) * dataPerPage;
  const lastIndexOfData = currentPage * dataPerPage;
  const currentData = studentData ? studentData.slice(firstIndexOfData, lastIndexOfData) : [];

  

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <Grid container spacing={3}>
        <Grid item xs={4}>
          
        </Grid>
        <Grid item xs={4}>
          <TextField label="Search" onChange={(e) => setSearchedVal(e.target.value)} value={searchedVal} />
        </Grid>
        <Grid item xs={4}>
         
        </Grid>
      </Grid>
      <TableContainer component={Paper} className='mt-3'>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>S.no</StyledTableCell>
              <StyledTableCell>Students Name</StyledTableCell>
              <StyledTableCell align="right">Tuition Fees</StyledTableCell>
              <StyledTableCell align="right">Booking Fees</StyledTableCell>
              <StyledTableCell align="right">1st installment</StyledTableCell>
              <StyledTableCell align="right">2nd installment</StyledTableCell>
              <StyledTableCell align="right">Scheme</StyledTableCell>
              <StyledTableCell align="right">Pedning Fees</StyledTableCell>
              <StyledTableCell align="right">Action</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentData.filter(search).map((student, index) => (
              <StyledTableRow key={index} >
                
                <StyledTableCell component="th" scope="row">{index+1}</StyledTableCell>
                <StyledTableCell component="th" scope="row">{student.stu_name}</StyledTableCell>
                <StyledTableCell align="right">{student.tution_fees}</StyledTableCell>
                <StyledTableCell align="right">{student.bookingfees}</StyledTableCell>
                <StyledTableCell align="right">{student.firstinstallment}</StyledTableCell>
                <StyledTableCell align="right">{student.secondinstallment}</StyledTableCell>
                <StyledTableCell align="right">{student.scheme}</StyledTableCell>
                <StyledTableCell align="right" style={{color:'red'}}>{student.pending_fees}</StyledTableCell>
                <StyledTableCell align="right">
                  {/* <Button style={{ marginTop: "20px", marginLeft: "10px" }} onClick={() => handleUpdate(student.stu_id)} startIcon={<Edit />} variant='contained' color='info'>Allocate</Button> */}
               <Link to={`/payfees/${student.stu_id}`}>  <Button style={{ marginTop: "20px", marginLeft: "10px" }} startIcon={<Edit />} variant='contained' color='info'>Pay fees</Button></Link> 
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openUpdate} onClose={() => setOpenUpdate(false)}>
        <DialogContent>
          <Allotfees data={allocUpdateData} onClose={() => setOpenUpdate(false)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenUpdate(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Grid container spacing={1} display='flex' justifyContent='center' className='mt-3'>
        <Stack spacing={2}>
          <Pagination count={Math.ceil((studentData ? studentData.length : 0) / dataPerPage)} page={currentPage} onChange={handlePageChange} variant="outlined" />
        </Stack>
      </Grid>
    </div>
  );
}

export default Feespage;
