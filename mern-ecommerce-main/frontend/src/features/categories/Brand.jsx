import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,Grid,Typography,CircularProgress,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { axiosi } from "../../config/axios";
import { fetchAllBrands } from '../brands/BrandApi';
import { ProductCard } from '../products/components/ProductCard';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectWishlistItems,
  createWishlistItemAsync,
  deleteWishlistItemByIdAsync,
  selectWishlistItemAddStatus,
  selectWishlistItemDeleteStatus
} from '../wishlist/WishlistSlice';
import { selectLoggedInUser } from '../auth/AuthSlice';
import banner2 from '../../assets/images/banner2.jpg';
export const Brand = () => {
  const { brandId } = useParams();
  const [products, setProducts] = useState([]);
  const [brandName, setBrandName] = useState('');
  const [loading, setLoading] = useState(true);
  const loggedInUser = useSelector(selectLoggedInUser);
  const wishlistItems = useSelector(selectWishlistItems);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useDispatch();
  const fetchProductsByBrand = async (brandId) => {
    const res = await axiosi.get(`/products?brand=${brandId}`);
    return res.data;
  };
const handleAddRemoveFromWishlist = (e, productId) => {
    if (e.target.checked) {
      const data = { user: loggedInUser?._id, product: productId };
      dispatch(createWishlistItemAsync(data));
    } else {
      const index = wishlistItems.findIndex(item => item.product._id === productId);
      dispatch(deleteWishlistItemByIdAsync(wishlistItems[index]._id));
    }
  };
  useEffect(() => {
    const loadBrandAndProducts = async () => {
      setLoading(true);
      try {
        const [productsData, brands] = await Promise.all([
          fetchProductsByBrand(brandId),
          fetchAllBrands()
        ]);

        setProducts(productsData);
        const brand = brands.find(b => b._id === brandId);
        setBrandName(brand?.name || "Unknown Brand");
      } catch (err) {
        console.error("Error loading brand or products:", err);
      } finally {
        setLoading(false);
      }
    };
    loadBrandAndProducts();
  }, [brandId]);

  return (
    <Box>
      {loading ? (
        <Box display="flex" justifyContent="center" mt={8}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              height: { xs: 180, sm: 280, md: 320 },
              borderRadius: 2,
              overflow: 'hidden',
              mb: 3
            }}
          >
            <img
              src={banner2}
              alt={`Products by ${brandName}`}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                bgcolor: 'rgba(0, 0, 0, 0.4)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Typography
                variant={isMobile ? "h5" : "h4"}
                color="white"
                fontWeight={600}
                textAlign="center"
                px={2}
              >
                Products by {brandName}
              </Typography>
            </Box>
          </Box>

          {products.length === 0 ? (
            <Typography variant="body1" textAlign="center">
              No products found for this brand.
            </Typography>
          ) : (
            <Grid
              container
              spacing={2}
              sx={{
                backgroundColor: 'black',
                color: 'white',
                p: { xs: 1, sm: 2, md: 3 },
                borderRadius: 2,
              }}
            >
              {products.map((product) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
                  <Box
                    sx={{
                      border: '1px solid #D4AF37',
                      borderRadius: 2,
                      p: 2,
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}
                  >
                    <ProductCard
                      id={product._id}
                      title={product.title}
                      thumbnail={product.thumbnail}
                      brand={product.brand.name}
                      price={product.price}
                      handleAddRemoveFromWishlist={handleAddRemoveFromWishlist}
                      sx={{
                        height: '100%',
                        maxHeight: 280,
                        maxWidth: '100%',
                      }}
                    />
                  </Box>
                </Grid>
              ))}
            </Grid>
          )}
        </>
      )}
    </Box>
  );
};
