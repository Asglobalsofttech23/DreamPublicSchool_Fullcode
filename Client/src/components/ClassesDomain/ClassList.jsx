import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import config from '../../config';
import { Grid, Card, CardContent, Typography, CardActions, Button, CardMedia } from '@mui/material';
import { styled } from '@mui/system';

const Root = styled('div')(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.default,
  minHeight: '100vh',
}));

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'scale(1.05)',
  },
}));

const CardContentCentered = styled(CardContent)({
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '16px',
});

const Title = styled(Typography)(({ theme }) => ({
  fontSize: '1.5rem',
  fontWeight: 'bold',
  color: theme.palette.text.primary,
  marginBottom: theme.spacing(2),
}));

const LinkStyled = styled(Link)({
  textDecoration: 'none',
});

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: '#fff',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
}));

const PlaceholderImage = styled('div')({
  width: '100%',
  height: 140,
  backgroundColor: '#e0e0e0',
});

function ClassList() {
  const [classesData, setClassesData] = useState([]);

  useEffect(() => {
    axios.get(`${config.apiURL}/clsAndSec/getclass`)
      .then((res) => {
        setClassesData(res.data);
      })
      .catch((err) => {
        console.log("Error fetching classes:", err);
      });
  }, []);

  return (
    <Root>
      <Grid container spacing={4}>
        {classesData.map((cls) => (
          <Grid item xs={12} sm={6} md={4} key={cls.cls_id}>
            <StyledCard>
              <CardMedia>
                {/* <PlaceholderImage /> */}
              </CardMedia>
              <CardContentCentered>
                <Title>
                  {cls.cls_name}
                </Title>
              </CardContentCentered>
              <CardActions style={{ justifyContent: 'center', paddingBottom: '16px' }}>
                <LinkStyled to={`/viewStudents/${cls.cls_id}`}>
                  <StyledButton size="small">View Student Details</StyledButton>
                </LinkStyled>
              </CardActions>
            </StyledCard>
          </Grid>
        ))}
      </Grid>
    </Root>
  );
}

export default ClassList;
