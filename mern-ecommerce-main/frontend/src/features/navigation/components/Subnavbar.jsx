import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useMediaQuery, useTheme } from '@mui/material';
import { useSelector } from 'react-redux';
import { selectLoggedInUser } from '../../auth/AuthSlice';
export const Subnavbar = ({ isProductList = false }) => {

  const loggedInUser = useSelector(selectLoggedInUser);
  const theme = useTheme();
  const is480 = useMediaQuery(theme.breakpoints.down(480));

  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: '#D4AF37',
        height: '42px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: 'none',
      }}
    >
      <Toolbar
        sx={{
          minHeight: '48px',
          display: 'flex',
          justifyContent: 'center',
          width: '100%',
          maxWidth: '1440px',
          mx: 'auto',
        }}
      >
        <Typography
          variant="body1"
          component="div"
          sx={{
            width: '750px',
            height: '15px',
            color: 'white',
            fontSize: '12px',
            fontWeight: 500,
            textAlign: 'center',
            letterSpacing: '2px'
          }}
        >
          Gear Up for Adventure! 50% OFF on Bike Parts + Free Delivery
        </Typography>
      </Toolbar>
    </AppBar>
  );
};