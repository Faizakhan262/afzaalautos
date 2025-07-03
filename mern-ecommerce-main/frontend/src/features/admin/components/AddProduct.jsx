import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { addProductAsync, resetProductAddStatus, selectProductAddStatus } from '../../products/ProductSlice';
import { Box, Grid, Button, FormControl, InputLabel, MenuItem, Select, InputAdornment, Stack, TextField, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useForm } from "react-hook-form";
import { selectBrands } from '../../brands/BrandSlice';
import { selectCategories } from '../../categories/CategoriesSlice';
import { toast } from 'react-toastify';

export const AddProduct = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const dispatch = useDispatch();
  const brands = useSelector(selectBrands);
  const categories = useSelector(selectCategories);
  const productAddStatus = useSelector(selectProductAddStatus);
  const navigate = useNavigate();
  const theme = useTheme();
  const is1100 = useMediaQuery(theme.breakpoints.down(1100));
  const is480 = useMediaQuery(theme.breakpoints.down(480));
  const [imageFiles, setImageFiles] = useState([]);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = React.useState(null);
  const [imagePreviews, setImagePreviews] = React.useState([null, null, null, null]);
  useEffect(() => {
    if (productAddStatus === 'fullfilled') {
      reset();
      toast.success("New product added");
      navigate("/admin/dashboard");
    } else if (productAddStatus === 'rejected') {
      toast.error("Error adding product, please try again later");
    }
  }, [productAddStatus]);

  useEffect(() => {
    return () => {
      dispatch(resetProductAddStatus());
    };
  }, []);

  const handleImageChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const updatedPreviews = [...imagePreviews];
      const updatedFiles = [...imageFiles];
      updatedPreviews[index] = URL.createObjectURL(file);
      updatedFiles[index] = file;

      setImagePreviews(updatedPreviews);
      setImageFiles(updatedFiles);
    }
  };


  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnailPreview(URL.createObjectURL(file));
      setThumbnailFile(file);
    }
  };
  const handleAddProduct = async (data) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("price", data.price);
    formData.append("discountPercentage", data.discountPercentage);
    formData.append("stockQuantity", data.stockQuantity);
    formData.append("category", data.category);
    formData.append("brand", data.brand);
    if (thumbnailFile) {
      formData.append("thumbnail", thumbnailFile);
    }
    Object.values(imageFiles).forEach(image => {
      if (image) {
        formData.append('images', image);
      }
    });
    try {
      dispatch(addProductAsync(formData));
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("Error adding product, please try again later");
    }
  };

  return (
    <Stack p={'0 16px'} sx={{ backgroundColor: '#E7E7E3' }}>
      <Stack width="100%" maxWidth="93rem" mt={is480 ? 2 : 3} mb={3}>
        <form noValidate onSubmit={handleSubmit(handleAddProduct)}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Stack
                spacing={5}
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
                  <Typography variant="subtitle1" fontWeight={500} gutterBottom>
                    Title
                  </Typography>
                  <TextField
                    size="small"
                    {...register('title', { required: 'Title is required' })}
                    error={!!errors.title}
                    helperText={errors.title?.message}
                  />
                </Stack>
                <Stack direction="row" spacing={2}>
                  <FormControl fullWidth size="small">
                    <InputLabel id="brand-selection">Brand</InputLabel>
                    <Select
                      {...register('brand', { required: 'Brand is required' })}
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
                    {errors.brand && (
                      <Typography color="error" variant="caption">
                        {errors.brand.message}
                      </Typography>
                    )}
                  </FormControl>

                  <FormControl fullWidth size="small">
                    <InputLabel id="category-selection">Category</InputLabel>
                    <Select
                      {...register('category', { required: 'Category is required' })}
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
                    {errors.category && (
                      <Typography color="error" variant="caption">
                        {errors.category.message}
                      </Typography>
                    )}
                  </FormControl>
                </Stack>
                <Stack>
                  <Typography variant="subtitle1" fontWeight={500} gutterBottom>
                    Description
                  </Typography>
                  <TextField
                    size="small"
                    multiline
                    rows={3}
                    {...register('description', { required: 'Description is required' })}
                    error={!!errors.description}
                    helperText={errors.description?.message}
                  />
                </Stack>


                <Stack direction="row" spacing={2}>
                  <Stack flex={1}>
                    <Typography variant="subtitle1" fontWeight={500} gutterBottom>
                      Price
                    </Typography>
                    <TextField
                      size="small"
                      type="text"
                      {...register('price', { required: 'Price is required' })}
                      error={!!errors.price}
                      helperText={errors.price?.message}
                      onInput={(e) =>
                        (e.target.value = e.target.value.replace(/[^\d.-]/g, ''))
                      }
                    />
                  </Stack>
                  <Stack flex={1}>
                    <Typography variant="subtitle1" fontWeight={500} gutterBottom>
                      Discount {is480 ? '%' : 'Percentage'}
                    </Typography>
                    <TextField
                      size="small"
                      type="text"
                      {...register('discountPercentage', {
                        required: 'Discount percentage is required',
                      })}
                      error={!!errors.discountPercentage}
                      helperText={errors.discountPercentage?.message}
                      onInput={(e) =>
                        (e.target.value = e.target.value.replace(/[^\d.-]/g, ''))
                      }
                    />
                  </Stack>
                </Stack>
                <Stack>
                  <Typography variant="subtitle1" fontWeight={500} gutterBottom>
                    Stock Quantity
                  </Typography>
                  <TextField
                    size="small"
                    type="text"
                    {...register('stockQuantity', {
                      required: 'Stock Quantity is required',
                    })}
                    error={!!errors.stockQuantity}
                    helperText={errors.stockQuantity?.message}
                    onInput={(e) =>
                      (e.target.value = e.target.value.replace(/[^\d.-]/g, ''))
                    }
                  />
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
                <Typography variant="h6" fontWeight={600}>
                  Upload Product
                </Typography>
                <Stack rowGap={1}>
                  <Typography variant="body1" fontWeight={500}>
                    Product Thumbnail
                  </Typography>
                  {thumbnailPreview ? (
                    <Box
                      component="img"
                      src={thumbnailPreview}
                      alt="Thumbnail Preview"
                      sx={{
                        width: 280,
                        height: 140,
                        objectFit: 'cover',
                        borderRadius: 1,
                        marginTop: '12px',
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
                        color: '#B0BEC5',
                        fontStyle: 'italic',
                        fontSize: '0.85rem',
                      }}
                    >
                      No Thumbnail Uploaded
                    </Box>
                  )}
                  <div style={{ marginTop: '14px' }}>
                    <label
                      htmlFor="thumbnail-upload"
                      style={{
                        display: 'inline-block',
                        padding: '8px 16px',
                        backgroundColor: 'black',
                        color: '#fff',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '13px',
                      }}
                    >
                      Upload Thumbnail
                    </label>
                    <input
                      type="file"
                      id="thumbnail-upload"
                      onChange={handleThumbnailChange}
                      style={{ display: 'none' }}
                    />
                  </div>
                </Stack>

                <Stack rowGap={0.5}>
                  <Typography variant="body1" fontWeight={500}>
                    Product Images
                  </Typography>
                  <Grid container spacing={1.5}>
                    {[0, 1, 2, 3].map((index) => (
                      <Grid item xs={6} key={index}>
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            justifyContent: 'flex-start',
                            marginTop: '16px',
                          }}
                        >
                          {imagePreviews[index] ? (
                            <Box
                              component="img"
                              src={imagePreviews[index]}
                              alt={`Product Image ${index + 1}`}
                              sx={{
                                width: 90,
                                height: 60,
                                objectFit: 'cover',
                                borderRadius: 1,
                                border: '1px solid #ccc',
                              }}
                            />
                          ) : (
                            <Box
                              sx={{
                                width: 90,
                                height: 60,
                                border: '2px dashed #B0BEC5',
                                borderRadius: 1,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#B0BEC5',
                                fontSize: '0.7rem',
                                fontStyle: 'italic',
                              }}
                            >
                              No Image
                            </Box>
                          )}
                          <div style={{ marginTop: '12px' }}>
                            <label
                              htmlFor={`file-upload-${index}`}
                              style={{
                                display: 'inline-block',
                                padding: '8px 16px',
                                backgroundColor: '#D4AF37',
                                color: '#fff',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '13px',
                              }}
                            >
                              Upload Image
                            </label>
                            <input
                              id={`file-upload-${index}`}
                              type="file"
                              onChange={(e) => handleImageChange(e, index)}
                              style={{ display: 'none' }}
                            />
                          </div>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Stack>
              </Stack>
            </Grid>
          </Grid>
          <Stack direction="row" justifyContent="flex-end" spacing={2} sx={{ padding: 2 }}>
            <Button
              type="submit"
              size={is480 ? 'medium' : 'large'}
              variant="contained"
              sx={{
                '&:hover': {
                  backgroundColor: '#D4AF37',
                  borderColor: '#D4AF37',
                  color: 'white',
                },
              }}
            >
              Add Product
            </Button>

            <Button
              component={Link}
              to="/admin/dashboard"
              size={is480 ? 'medium' : 'large'}
              variant="outlined"
              color="error"
              sx={{
                color: '#D4AF37',
                borderColor: '#D4AF37',
                '&:hover': {
                  backgroundColor: 'white',
                  color: '#D4AF37',
                  borderColor: '#D4AF37',
                },
              }}
            >
              Cancel
            </Button>
          </Stack>
        </form>
      </Stack>
    </Stack>

  );
};
