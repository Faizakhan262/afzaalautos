import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Box, Badge, Button, Stack, useMediaQuery, useTheme } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { selectUserInfo } from '../../user/UserSlice';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { selectCartItems } from '../../cart/CartSlice';
import { selectLoggedInUser } from '../../auth/AuthSlice';
import { selectWishlistItems } from '../../wishlist/WishlistSlice';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import TuneIcon from '@mui/icons-material/Tune';
import { selectProductIsFilterOpen, toggleFilters } from '../../products/ProductSlice';
import { selectCategories } from '../../categories/CategoriesSlice';
import logo from '../../../assets/images/logo.jpeg'
export const Navbar = ({ isProductList = false }) => {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const userInfo = useSelector(selectUserInfo);
  const cartItems = useSelector(selectCartItems);
  const loggedInUser = useSelector(selectLoggedInUser);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const is480 = useMediaQuery(theme.breakpoints.down(480));
  const categories = useSelector(selectCategories)
  const wishlistItems = useSelector(selectWishlistItems);
  const isProductFilterOpen = useSelector(selectProductIsFilterOpen);
  const location = useLocation();
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  const handleToggleFilters = () => {
    dispatch(toggleFilters());
  };
  const settings = [
    { name: 'Home', to: loggedInUser?.isAdmin ? '/admin/dashboard' : '/' },
    { name: 'Profile', to: '/profile' },
    { name: loggedInUser?.isAdmin ? 'Orders' : 'My orders', to: loggedInUser?.isAdmin ? '/admin/orders' : '/orders' },
    { name: 'Logout', to: '/logout' },
    ...(loggedInUser?.isAdmin ? [
      { name: 'Add Product', to: '/admin/add-product' },
      { name: 'Panel', to: '/admin/panel' }

    ] : []),
  ];
  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: "#000000",
        boxShadow: 'none',
        color: '#D4AF37',
        width: '1440px',
        height: '73px',
        mx: 'auto',
      }}
    >
      <Toolbar
        sx={{
          p: 1,
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            width: '1270px',
            height: '38px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <img
            src={logo}
            alt="Ecommerce Outlook"
            style={{
              width: '60px',
              height: '60px',
              color: loggedInUser?.isAdmin ? 'white' : 'inherit',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
            }}
          />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              width: '200px',
              fontWeight: 700,
              color: loggedInUser?.isAdmin ? 'white' : 'inherit',
              textDecoration: 'none',
              display: 'flex',
              flexDirection: 'column',
              fontFamily: 'cursive',
              lineHeight: 1.2,
            }}
          >
            Afzaal<br />Autos
          </Typography>

          <Stack
            direction="row"
            spacing={4}
            sx={{
              width: '100%',
              py: 2,
              px: 1,
              marginLeft: "10px",
            }}
          >
            {categories.map((category) => (
              <Typography
                key={category._id}
                component={Link}
                to={`/category/${category._id}`}
                sx={{
                  textDecoration: 'none',
                  color: 'inherit',
                  '&:hover': {
                    borderBottom: '3px solid  #D4AF37',
                  },
                }}
              >
                {category.name}
              </Typography>
            ))}
          </Stack>

          <Stack
            direction="row"
            alignItems="center"
            spacing={2}
            sx={{
              width: '347px',
              height: '38px',
              justifyContent: 'flex-end',
            }}
          >
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt={userInfo?.name} src="null" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting.name} onClick={handleCloseUserMenu}>
                  <Typography
                    component={Link}
                    color={'text.primary'}
                    sx={{ textDecoration: 'none' }}
                    to={setting.to}
                    textAlign="center"
                  >
                    {setting.name}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>

            <Typography variant="body1" fontWeight={400}>
              {is480 ? `${userInfo?.name?.split(' ')[0]}` : `Hey, ${userInfo?.name}`}
            </Typography>

            {loggedInUser?.isAdmin && (
              <Button
                variant="contained"
                sx={{
                  backgroundColor: 'white',
                  color: "#000000",
                  '&:hover': { backgroundColor: 'lightgray' },
                }}
              >
                Admin
              </Button>
            )}

            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
            >
              {cartItems?.length > 0 && (
                <Badge badgeContent={cartItems.length} color="error">
                  <IconButton onClick={() => navigate('/cart')}   >
                    <ShoppingCartOutlinedIcon sx={{

                      color: '#D4AF37',
                      '&:hover': { backgroundColor: 'lightgray' },
                    }} />
                  </IconButton>
                </Badge>
              )}

              {!loggedInUser?.isAdmin && (
                <Badge badgeContent={wishlistItems?.length} color="error">
                  <IconButton component={Link} to="/wishlist">
                    <FavoriteBorderIcon sx={{
                      color: '#D4AF37',
                      '&:hover': { backgroundColor: 'lightgray' },
                    }} />
                  </IconButton>
                </Badge>
              )}
              {isProductList && (
                <IconButton onClick={handleToggleFilters}>
                  <TuneIcon sx={{ color: isProductFilterOpen ? 'white' : '#D4AF37' }} />
                </IconButton>
              )}
            </Stack>
          </Stack>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
