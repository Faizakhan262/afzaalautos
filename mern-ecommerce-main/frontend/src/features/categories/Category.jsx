import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Grid, Typography, CircularProgress } from '@mui/material';
import { axiosi } from "../../config/axios";
import { fetchAllCategories } from './CategoriesApi';
import { ProductCard } from '../products/components/ProductCard';
import { useDispatch, useSelector } from 'react-redux';
import { selectWishlistItems } from '../wishlist/WishlistSlice';
import { selectLoggedInUser } from '../auth/AuthSlice';
import {
  createWishlistItemAsync,
  deleteWishlistItemByIdAsync
} from '../wishlist/WishlistSlice';
import banner2 from '../../assets/images/banner2.jpg';
export const Category = () => {
  const { categoryId } = useParams();
  const [products, setProducts] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const loggedInUser = useSelector(selectLoggedInUser);
  const wishlistItems = useSelector(selectWishlistItems);
  const fetchProductsByCategory = async (categoryId) => {
    const res = await axiosi.get(`/products?category=${categoryId}`);
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
    const loadCategoryAndProducts = async () => {
      setLoading(true);
      try {
        const [productsData, categories] = await Promise.all([
          fetchProductsByCategory(categoryId),
          fetchAllCategories()
        ]);
        setProducts(productsData);
        const category = categories.find(c => c._id === categoryId);
        setCategoryName(category?.name || 'Unknown Category');
      } catch (err) {
        console.error('Error loading category or products:', err);
      } finally {
        setLoading(false);
      }
    };
    loadCategoryAndProducts();
  }, [categoryId]);
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
              height: { xs: 200, sm: 300 },
              borderRadius: 2,
              overflow: 'hidden',
            }}
          >
            <img
              src={banner2}
              alt={`Products in ${categoryName}`}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
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
                variant="h3"
                color="white"
                fontWeight={600}
                textAlign="center"
              >
                {categoryName}
              </Typography>
            </Box>
          </Box>
          {products.length === 0 ? (
            <Typography variant="body1">
              No products found in this category.
            </Typography>
          ) : (
            <Grid
              container
              spacing={2}
              sx={{
                backgroundColor: 'black',
                color: 'white',
                padding: 2,
                borderRadius: 2,
              }}
            >
              {products.map((product) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
                  <Box
                    sx={{
                      border: '1px solid #D4AF37',
                      borderRadius: 2,
                      padding: 1.5,
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
