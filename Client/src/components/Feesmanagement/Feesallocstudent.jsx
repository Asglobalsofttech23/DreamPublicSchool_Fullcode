import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import config from '../../config';
import { Box, Grid, Card, CardContent, Typography, CardActions, Button } from '@mui/material';

function Feesallocstudent() {
  const [classes, setClasses] = useState([]); // Initialize with an empty array

  useEffect(() => {
    axios.get(`${config.apiURL}/clsAndSec/getclass`)
      .then((res) => {
        setClasses(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        console.log("classes err :", err);
      });
  }, []); // Add dependency array to run the effect only once

  return (
    <Grid container spacing={2}>
      {classes.map((cls) => (
        <Grid item xs={12} sm={6} md={4} key={cls.cls_id}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="div">
                {cls.cls_name}
              </Typography>
            </CardContent>
            <CardActions>
              <Link to={`/feespage/${cls.cls_id}`} style={{ textDecoration: 'none' }}>
                <Button size="small" color="primary">View Fees</Button>
              </Link>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

export default Feesallocstudent;
