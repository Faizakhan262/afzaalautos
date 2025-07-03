import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  clearSelectedProduct,
  fetchProductByIdAsync,
  resetProductUpdateStatus,
  selectProductUpdateStatus,
  selectSelectedProduct,
  updateProductByIdAsync
} from '../../products/ProductSlice';
import {
  Box,
  Grid,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { useForm } from "react-hook-form";
import { selectBrands } from '../../brands/BrandSlice';
import { selectCategories } from '../../categories/CategoriesSlice';
import { toast } from 'react-toastify';

export const ProductUpdate = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { id } = useParams();
  const dispatch = useDispatch();
  const selectedProduct = useSelector(selectSelectedProduct);
  const brands = useSelector(selectBrands);
  const categories = useSelector(selectCategories);
  const productUpdateStatus = useSelector(selectProductUpdateStatus);
  const navigate = useNavigate();
  const theme = useTheme();
  const is1100 = useMediaQuery(theme.breakpoints.down(1100));
  const is480 = useMediaQuery(theme.breakpoints.down(480));
  const [thumbnailUrl, setThumbnailUrl] = useState(null);
  const [imageUrls, setImageUrls] = useState([]);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [imagePreviews, setImagePreviews] = useState([null, null, null, null]);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductByIdAsync(id));
    }
  }, [id]);

  useEffect(() => {
    if (selectedProduct) {
      setThumbnailUrl(selectedProduct.thumbnail);
      setThumbnailPreview(selectedProduct.thumbnail);

      const previews = [null, null, null, null];
      const updatedImages = [...selectedProduct.images];

      for (let i = 0; i < 4; i++) {
        previews[i] = updatedImages[i] || null;
      }

      setImagePreviews(previews);
      setImageUrls(updatedImages);
    }
  }, [selectedProduct]);

  useEffect(() => {
    if (productUpdateStatus === 'fullfilled') {
      toast.success("Product Updated");
      navigate("/admin/dashboard");
    } else if (productUpdateStatus === 'rejected') {
      toast.error("Error updating product, please try again later");
    }
  }, [productUpdateStatus]);

  useEffect(() => {
    return () => {
      dispatch(clearSelectedProduct());
      dispatch(resetProductUpdateStatus());
    };
  }, []);

  const handleProductUpdate = (data) => {
    const formData = new FormData();

    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('brand', data.brand);
    formData.append('category', data.category);
    formData.append('price', data.price);
    formData.append('discountPercentage', data.discountPercentage);
    formData.append('stockQuantity', data.stockQuantity);
    const existingImageUrls = imageUrls.filter((img) => typeof img === 'string');
    formData.append('existingImages', JSON.stringify(existingImageUrls));

    if (thumbnailUrl instanceof File) {
      formData.append('thumbnail', thumbnailUrl);
    } else {
      formData.append('thumbnailUrl', thumbnailUrl);
    }

    imageUrls.forEach((img) => {
      if (img instanceof File) {
        formData.append('images', img);
      }
    });

    dispatch(updateProductByIdAsync({ id: selectedProduct._id, formData }));
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnailPreview(URL.createObjectURL(file));
      setThumbnailUrl(file);
    }
  };

  const handleProductImageChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const updatedImages = [...imageUrls];
      const updatedPreviews = [...imagePreviews];
      updatedImages[index] = file;
      updatedPreviews[index] = URL.createObjectURL(file);
      setImageUrls(updatedImages);
      setImagePreviews(updatedPreviews);
    }
  };



  if (!selectedProduct) {
    return <Typography variant="h6">Loading product...</Typography>;
  }

  return (
    <Stack p={'0 16px'} sx={{ backgroundColor: '#E7E7E3' }}>
      <Stack width="100%" maxWidth="93rem" mt={is480 ? 2 : 3} mb={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>

            <Stack
              spacing={5}
              component="form"
              noValidate
              onSubmit={handleSubmit(handleProductUpdate)}
              sx={{
                border: '0.5px solid #B0BEC5',
                borderRadius: 2,
                padding: 2,
                height: '100%',
                boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                backgroundColor: 'white',

              }}
            >
              <Stack>
                <Typography variant="subtitle1" fontWeight={500}>Title</Typography>
                <TextField
                  size="small"
                  defaultValue={selectedProduct.title}
                  {...register("title", { required: 'Title is required' })}
                  error={!!errors.title}
                  helperText={errors.title?.message}
                />
              </Stack>

              <Stack direction="row" spacing={2}>
                <FormControl fullWidth size="small">
                  <InputLabel id="brand-selection">Brand</InputLabel>
                  <Select
                    defaultValue={selectedProduct.brand._id}
                    {...register("brand", { required: "Brand is required" })}
                    labelId="brand-selection"
                    label="Brand"
                    error={!!errors.brand}
                  >
                    {brands.map((brand) => (
                      <MenuItem key={brand._id} value={brand._id}>
                        {brand.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth size="small">
                  <InputLabel id="category-selection">Category</InputLabel>
                  <Select
                    defaultValue={selectedProduct.category._id}
                    {...register("category", { required: "Category is required" })}
                    labelId="category-selection"
                    label="Category"
                    error={!!errors.category}
                  >
                    {categories.map((category) => (
                      <MenuItem key={category._id} value={category._id}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Stack>

              <Stack>
                <Typography variant="subtitle1" fontWeight={500}>Description</Typography>
                <TextField
                  size="small"
                  multiline
                  rows={3}
                  defaultValue={selectedProduct.description}
                  {...register("description", { required: "Description is required" })}
                  error={!!errors.description}
                  helperText={errors.description?.message}
                />
              </Stack>

              <Stack direction="row" spacing={2}>
                <Stack flex={1}>
                  <Typography variant="subtitle1" fontWeight={500}>Price</Typography>
                  <TextField
                    size="small"
                    type="number"
                    defaultValue={selectedProduct.price}
                    {...register("price", { required: "Price is required" })}
                    error={!!errors.price}
                    helperText={errors.price?.message}
                  />
                </Stack>
                <Stack flex={1}>
                  <Typography variant="subtitle1" fontWeight={500}>Discount %</Typography>
                  <TextField
                    size="small"
                    type="number"
                    defaultValue={selectedProduct.discountPercentage}
                    {...register("discountPercentage", { required: "Discount is required" })}
                    error={!!errors.discountPercentage}
                    helperText={errors.discountPercentage?.message}
                  />
                </Stack>
              </Stack>

              <Stack>
                <Typography variant="subtitle1" fontWeight={500}>Stock Quantity</Typography>
                <TextField
                  size="small"
                  type="number"
                  defaultValue={selectedProduct.stockQuantity}
                  {...register("stockQuantity", { required: "Stock is required" })}
                  error={!!errors.stockQuantity}
                  helperText={errors.stockQuantity?.message}
                />
              </Stack>


              <Stack direction="row" justifyContent="flex-end" spacing={2}>
                <Button sx={{
                  '&:hover': {
                    backgroundColor: '#D4AF37',
                    borderColor: '#D4AF37',
                    color: 'white',
                  },
                }} variant="contained" color="primary" type="submit">
                  Update Product
                </Button>
                <Button sx={{
                  color: '#D4AF37',
                  borderColor: '#D4AF37',
                  '&:hover': {
                    color: '#D4AF37',
                    borderColor: '#D4AF37',
                    backgroundColor: 'white',
                  }
                }} variant="outlined" color="secondary" component={Link} to="/admin/dashboard">
                  Cancel
                </Button>
              </Stack>
            </Stack>
          </Grid>

          
          <Grid item xs={12} md={6}>
            <Stack
              rowGap={3}
              sx={{
                border: '1px solid #B0BEC5',
                borderRadius: 2,
                padding: 2,
                height: '100%',
                boxShadow: '0 3px 10px rgba(0,0,0,0.08)',
                backgroundColor: 'white',
              }}
            >
              <Typography variant="h6" fontWeight={600}>Upload Product</Typography>

             
              <Stack rowGap={1}>
                <Typography variant="body1" fontWeight={500}>Product Thumbnail</Typography>
                {thumbnailPreview ? (
                  <Box
                    component="img"
                    src={thumbnailPreview}
                    sx={{
                      width: 280,
                      height: 140,
                      objectFit: 'cover',
                      borderRadius: 1
                    }}
                  />
                ) : (
                  <Box
                    sx={{
                      width: 280,
                      height: 140,
                      border: '2px dashed #B0BEC5',
                      borderRadius: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontStyle: 'italic',
                      color: '#999'
                    }}
                  >
                    No Thumbnail
                  </Box>
                )}
                <label style={{
                  display: 'inline-block',
                  padding: '8px 16px',
                  backgroundColor: 'black',
                  color: '#fff',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  width: "180px",
                }} htmlFor="thumbnail-upload" >
                  Upload Thumbnail
                  <input type="file" id="thumbnail-upload" style={{ display: 'none' }} onChange={handleThumbnailChange} />
                </label>
              </Stack>

             
              <Stack rowGap={1}>
                <Typography variant="body1" fontWeight={500}>Product Images</Typography>
                <Grid container spacing={2}>
                  {[0, 1, 2, 3].map((index) => (
                    <Grid item xs={6} key={index}>
                      <Stack spacing={1}>
                        {imagePreviews[index] ? (
                          <Box
                            component="img"
                            src={imagePreviews[index]}
                            alt={`Product Image ${index + 1}`}
                            sx={{
                              width: 100,
                              height: 70,
                              objectFit: 'cover',
                              borderRadius: 1,
                              border: '1px solid #ccc'
                            }}
                          />
                        ) : (
                          <Box
                            sx={{
                              width: 100,
                              height: 70,
                              border: '2px dashed #ccc',
                              borderRadius: 1,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontStyle: 'italic',
                              fontSize: '0.7rem',
                              color: '#999'
                            }}
                          >
                            No Image
                          </Box>
                        )}
                        <label htmlFor={`image-upload-${index}`} style={{
                          display: 'inline-block',
                          padding: '4px 16px',
                          backgroundColor: '#D4AF37',
                          color: '#fff',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '13px',
                          width: "130px",
                        }} >
                          Upload Image
                          <input type="file" id={`image-upload-${index}`} style={{ display: 'none' }} onChange={(e) => handleProductImageChange(e, index)} />
                        </label>
                      </Stack>
                    </Grid>
                  ))}
                </Grid>
              </Stack>
            </Stack>
          </Grid>
        </Grid>
      </Stack>
    </Stack>

  );
};
