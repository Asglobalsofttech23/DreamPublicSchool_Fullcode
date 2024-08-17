import React, { useEffect, useState } from 'react';
import axios from 'axios';
import config from '../../config';
import { Grid, TextField, Button, MenuItem, Paper, Typography, Snackbar, Alert } from '@mui/material';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';

const StyledPaper = styled(Paper)({
  padding: '16px',
  textAlign: 'center',
  color: 'black',
  backgroundColor: 'lightgray',
  borderRadius: '8px',
  boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
});

function FeesAllocmanu() {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [tuitionFees, setTuitionFees] = useState('');
  const [firstInstallment, setFirstInstallment] = useState('');
  const [secondInstallment, setSecondInstallment] = useState('');
  const [errorClass, setErrorClass] = useState('');
  const [errorFees, setErrorFees] = useState('');
  const [errorFirstInstallment, setErrorFirstInstallment] = useState('');
  const [errorSecondInstallment, setErrorSecondInstallment] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const navigate = useNavigate();

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = () => {
    axios.get(`${config.apiURL}/feeAllocation/getclassessforfess`)
      .then((res) => {
        setClasses(res.data);
      })
      .catch((err) => {
        console.log("Error fetching class data", err);
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'class_id') {
      setSelectedClass(value);
      setErrorClass('');
    } else if (name === 'tuition_fees') {
      setTuitionFees(value);
      setErrorFees('');
    } else if (name === 'first_installment') {
      setFirstInstallment(value);
      setErrorFirstInstallment('');
    } else if (name === 'second_installment') {
      setSecondInstallment(value);
      setErrorSecondInstallment('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedClass) {
      setErrorClass('Please select a class');
      return;
    }

    if (!tuitionFees) {
      setErrorFees('Please enter tuition fees');
      return;
    }

    if (!firstInstallment) {
      setErrorFirstInstallment('Please enter the first installment');
      return;
    }

    if (!secondInstallment) {
      setErrorSecondInstallment('Please enter the second installment');
      return;
    }

    const formData = {
      cls_id: selectedClass,
      tution_fees: tuitionFees,
      first_installment: firstInstallment,
      second_installment: secondInstallment,
    };

    axios.post(`${config.apiURL}/feeAllocation/feesallocationforclass`, formData)
      .then((res) => {
        setSnackbarMessage('Fees Allocated Successfully');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        fetchClasses();  // Refresh classes after successful post
      })
      .catch((err) => {
        setSnackbarMessage('Failed to Allocate Fees');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
        console.log("Error:", err);
        console.log("Data not sent:", formData);
      });
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <div>
      <h1>Fees Allocation Form</h1>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              select
              name="class_id"
              label="Class"
              error={!!errorClass}
              helperText={errorClass}
              onChange={handleChange}
              value={selectedClass}
            >
              {classes.map((classItem) => (
                <MenuItem key={classItem.cls_id} value={classItem.cls_id}>
                  {classItem.cls_name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="number"
              label="Tuition Fees"
              variant="outlined"
              name="tuition_fees"
              error={!!errorFees}
              helperText={errorFees}
              onChange={handleChange}
              value={tuitionFees}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="number"
              label="First Installment"
              variant="outlined"
              name="first_installment"
              error={!!errorFirstInstallment}
              helperText={errorFirstInstallment}
              onChange={handleChange}
              value={firstInstallment}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="number"
              label="Second Installment"
              variant="outlined"
              name="second_installment"
              error={!!errorSecondInstallment}
              helperText={errorSecondInstallment}
              onChange={handleChange}
              value={secondInstallment}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              style={{ marginTop: '20px', backgroundColor: '#4CAF50', color: 'white' }}
            >
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>
      <br /><br />
      <Grid container spacing={2}>
        {classes.map((data) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={data.cls_id}>
            <StyledPaper>
              <Typography variant="h6">{data.cls_name}</Typography>
              <Typography variant="body1">Tuition Fees: {data.tution_fees}</Typography>
              <Typography variant="body1">First Installment: {data.firstinstallment}</Typography>
              <Typography variant="body1">Second Installment: {data.secondinstallment}</Typography>
            </StyledPaper>
          </Grid>
        ))}
      </Grid>

      {/* Snackbar for success or error messages */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default FeesAllocmanu;
