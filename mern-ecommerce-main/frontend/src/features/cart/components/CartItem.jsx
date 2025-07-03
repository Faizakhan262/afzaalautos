import { Button, IconButton, Paper, Stack, Typography, useMediaQuery, useTheme } from '@mui/material'
import React from 'react'
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useDispatch } from 'react-redux';
import { deleteCartItemByIdAsync, updateCartItemByIdAsync } from '../CartSlice';
import { Link } from 'react-router-dom';

export const CartItem = ({ id, thumbnail, title, category, brand, price, quantity, stockQuantity, productId }) => {
    const dispatch = useDispatch()
    const theme = useTheme()
    const is900 = useMediaQuery(theme.breakpoints.down(900))
    const is480 = useMediaQuery(theme.breakpoints.down(480))
    const is552 = useMediaQuery(theme.breakpoints.down(552))

    const handleAddQty = () => {
        const update = { _id: id, quantity: quantity + 1 }
        dispatch(updateCartItemByIdAsync(update))
    }
    const handleRemoveQty = () => {
        if (quantity === 1) {
            dispatch(deleteCartItemByIdAsync(id))
        }
        else {
            const update = { _id: id, quantity: quantity - 1 }
            dispatch(updateCartItemByIdAsync(update))
        }
    }

    const handleProductRemove = () => {
        dispatch(deleteCartItemByIdAsync(id))
    }

    return (
        <Stack
        bgcolor="white"
        component={is900 ? '' : Paper}
        p={is900 ? 0 : 0.5}
        elevation={1}
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{
          gap: 0.5,
          width: '100%',
          maxWidth: '540px',        
          marginX: 'auto',
          height: is480 ? 'auto' : '100px', 
          padding: '6px',              
        }}
      >
        <Stack
          flexDirection="row"
          rowGap="0.5rem"
          alignItems="center"
          columnGap={1}
          flexWrap="wrap"
        >
          {/* Image */}
          <Stack
            width={is552 ? "auto" : '100px'}       
            height={is552 ? "auto" : '100px'}
            component={Link}
            to={`/product-details/${productId}`}
          >
            <img
              style={{
                width: "80%",
                height: is552 ? "auto" : "100%",
                aspectRatio: is552 ? 1 / 1 : '',
                objectFit: 'contain'
              }}
              src={`http://localhost:8000/${thumbnail.replace(/\\/g, '/')}`}
              alt={`${title} image unavailable`}
            />
          </Stack>
      
          {/* Info & Quantity */}
          <Stack alignSelf="">
            <Typography
              component={Link}
              to={`/product-details/${productId}`}
              sx={{
                textDecoration: "none",
                color: "black",
                fontSize: is480 ? '12px' : '14px',
              }}
              fontWeight={500}
            >
              {title}
            </Typography>
      
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontSize: is480 ? '11px' : '12px' }}
            >
              {brand}
            </Typography>
      
            <Typography mt={0.5} sx={{ fontSize: is480 ? '11px' : '12px' }}>
              Quantity
            </Typography>
      
            <Stack flexDirection="row" alignItems="center">
              <IconButton onClick={handleRemoveQty} size="small">
                <RemoveIcon fontSize="small" />
              </IconButton>
              <Typography sx={{ fontSize: is480 ? '13px' : '14px' }}>{quantity}</Typography>
              <IconButton onClick={handleAddQty} size="small">
                <AddIcon fontSize="small" />
              </IconButton>
            </Stack>
          </Stack>
        </Stack>
      
        {/* Price & Remove */}
        <Stack
          justifyContent="space-between"
          alignSelf={is552 ? 'flex-end' : ''}
          height="100%"
          rowGap="0.5rem"
          alignItems="flex-end"
        >
          <Typography variant="body2" sx={{ fontSize: is480 ? '13px' : '14px' }}>
            Rs{price}
          </Typography>
      
          <Button
            sx={{
              color: "white",
              fontSize: is480 ? '11px' : '13px',
              padding: is480 ? '3px 6px' : '5px 10px',
              "&:hover": {
                bgcolor: "black",
              },
            }}
            size="small"
            onClick={handleProductRemove}
            variant="contained"
          >
            Remove
          </Button>
        </Stack>
      </Stack>
      
    )
}
