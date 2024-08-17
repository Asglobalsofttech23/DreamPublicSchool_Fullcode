
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Grid } from '@mui/material';
import { Link } from 'react-router-dom';
import { Box } from '@mui/system';
import { Fade } from 'react-awesome-reveal';
import config from '../../config';

function Allocation() {
  const [classes, setClasses] = useState([]); // Initialize with an empty array

  useEffect(() => {
    axios.get(`${config.apiURL}/clsAndSec/getclass`)
      .then((res) => {
        setClasses(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        console.log("classes err :",err);
      });
  }, []); // Add dependency array to run the effect only once

  const cardStyle = {
    width: '100%',
    height: '70px',
    display: 'flex',
    border:'1px solid gray',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(145deg, #e6f4ff, #74e0da)',
    borderRadius: '15px',
    boxShadow: '5px 5px 15px rgba(0, 0, 0, 0.3)',
    transition: 'transform 0.3s, box-shadow 0.3s',
    '&:hover': {
      transform: 'scale(1.05) rotateY(10deg)',
      boxShadow: '10px 10px 30px rgba(0, 0, 0, 0.5)',
      background: 'linear-gradient(145deg, #e6f4ff, pink)'
    },
    '&:active': {
      transform: 'scale(1.02) rotateY(5deg)',
      boxShadow: '7px 7px 20px rgba(0, 0, 0, 0.4)',
    },
  };

  return (
    <Grid container spacing={2}>
      {classes.map((cls, index) => (
        <Grid item xs={12} sm={6} md={4} key={cls.cls_id}>
          <Fade cascade damping={0.1} delay={index * 100}>
            <Link to={`/studentalloc/${cls.cls_id}`} style={{ textDecoration: 'none' }}>
              <Box sx={cardStyle}>
                {cls.cls_name}
              </Box>
            </Link>
          </Fade>
        </Grid>
      ))}
    </Grid>
  );
}

export default Allocation;


