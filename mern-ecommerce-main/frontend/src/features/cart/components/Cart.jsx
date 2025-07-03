import React, { useEffect } from 'react'
import { CartItem } from './CartItem'
import { Button,IconButton, Chip, Paper, Stack, Typography, useMediaQuery, useTheme } from '@mui/material'
import { resetCartItemRemoveStatus, selectCartItemRemoveStatus, selectCartItems } from '../CartSlice'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { SHIPPING, TAXES } from '../../../constants'
import { toast } from 'react-toastify'
import {motion} from 'framer-motion'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
export const Cart = ({checkout}) => {
    const items=useSelector(selectCartItems)
    const subtotal=items.reduce((acc,item)=>item.product.price*item.quantity+acc,0)
    const totalItems=items.reduce((acc,item)=>acc+item.quantity,0)
    const navigate=useNavigate()
    const theme=useTheme()
    const is900=useMediaQuery(theme.breakpoints.down(900))
   const is480 = useMediaQuery(theme.breakpoints.down(480))
    const cartItemRemoveStatus=useSelector(selectCartItemRemoveStatus)
    const dispatch=useDispatch()

    useEffect(()=>{
        window.scrollTo({
            top:0,
            behavior:"instant"
        })
    },[])

    useEffect(()=>{
        if(items.length===0){
            navigate("/")
        }
    },[items])

    useEffect(()=>{
        if(cartItemRemoveStatus==='fulfilled'){
            toast.success("Product removed from cart")
        }
        else if(cartItemRemoveStatus==='rejected'){
            toast.error("Error removing product from cart, please try again later")
        }
    },[cartItemRemoveStatus])

    useEffect(()=>{
        return ()=>{
            dispatch(resetCartItemRemoveStatus())
        }
    },[])

  return (
    <Stack
    justifyContent="flex-start"
    alignItems="center"
    sx={{ backgroundColor: "black", color: "white" }}
  >
    <Stack
      width={is900 ? 'auto' : '40rem'} // ⬅️ Reduced width
      mt="2rem"                       // ⬅️ Smaller top margin
      px={checkout ? 0 : 1.5}         // ⬅️ Slightly less padding
      rowGap={3}                      // ⬅️ Reduced vertical spacing
    >
      {/* Back & Title */}
      <Stack flexDirection="row" columnGap={is480 ? 0.3 : 1} alignItems="center">
        <motion.div whileHover={{ x: -5 }}>
          <IconButton component={Link} to="/cart">
            <ArrowBackIcon fontSize={is480 ? "medium" : "large"} />
          </IconButton>
        </motion.div>
        <Typography variant="h6">My Cart</Typography> {/* ⬅️ Slightly smaller */}
      </Stack>
  
      {/* Cart Items */}
      <Stack rowGap={1.5}>
        {items && items.map((item) => (
          <CartItem
            key={item._id}
            id={item._id}
            title={item.product.title}
            brand={item.product.brand.name}
            category={item.product.category.name}
            price={item.product.price}
            quantity={item.quantity}
            thumbnail={item.product.thumbnail}
            stockQuantity={item.product.stockQuantity}
            productId={item.product._id}
          />
        ))}
      </Stack>
  
      {/* Subtotal / Total Section */}
      <Stack
        sx={{
          gap: 1,
          width: '100%',
          maxWidth: '500px', // ⬅️ Slightly narrower
          marginX: 'auto'
        }}
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
      >
        {checkout ? (
          <Stack rowGap={1.5} width="100%">
            <Stack flexDirection="row" justifyContent="space-between">
              <Typography variant="body2">Subtotal</Typography>
              <Typography variant="body2">Rs {subtotal}</Typography>
            </Stack>
            <Stack flexDirection="row" justifyContent="space-between">
              <Typography variant="body2">Shipping</Typography>
              <Typography variant="body2">Rs {SHIPPING}</Typography>
            </Stack>
            <Stack flexDirection="row" justifyContent="space-between">
              <Typography variant="body2">Taxes</Typography>
              <Typography variant="body2">Rs {TAXES}</Typography>
            </Stack>
            <hr />
            <Stack flexDirection="row" justifyContent="space-between">
              <Typography fontWeight={500}>Total</Typography>
              <Typography fontWeight={500}>Rs {subtotal + SHIPPING + TAXES}</Typography>
            </Stack>
          </Stack>
        ) : (
          <>
            <Stack>
              <Typography variant="body2" fontWeight={500}>Subtotal</Typography>
              <Typography>Total items in cart {totalItems}</Typography>
              <Typography variant="caption" color="text.secondary">
                Shipping and taxes will be calculated at checkout.
              </Typography>
            </Stack>
            <Stack>
              <Typography variant="h6" fontWeight={500}>Rs {subtotal}</Typography>
            </Stack>
          </>
        )}
      </Stack>
  
      {/* Buttons */}
      {!checkout && (
        <Stack rowGap="0.8rem" sx={{ color: "white" }} mb={4}>
          <Button variant="contained" component={Link} to="/checkout" size="small">
            Checkout
          </Button>
          <motion.div style={{ alignSelf: 'center' }} whileHover={{ y: 2 }}>
            <Chip
              sx={{
                cursor: "pointer",
                borderRadius: "8px",
                color: "white",
                fontSize: "0.75rem"
              }}
              component={Link}
              to="/"
              label="or continue shopping"
              variant="outlined"
            />
          </motion.div>
        </Stack>
      )}
    </Stack>
  </Stack>
  
  )
}
