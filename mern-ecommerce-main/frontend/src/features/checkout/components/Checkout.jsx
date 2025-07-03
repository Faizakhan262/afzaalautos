import { Stack, TextField, Typography, Button, Menu, MenuItem, Select, Grid, FormControl, Radio, Paper, IconButton, Box, useTheme, useMediaQuery } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import React, { useEffect, useState } from 'react'
import { Cart } from '../../cart/components/Cart'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { addAddressAsync, selectAddressStatus, selectAddresses } from '../../address/AddressSlice'
import { selectLoggedInUser } from '../../auth/AuthSlice'
import { Link, useNavigate } from 'react-router-dom'
import { createOrderAsync, selectCurrentOrder, selectOrderStatus } from '../../order/OrderSlice'
import { resetCartByUserIdAsync, selectCartItems } from '../../cart/CartSlice'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { SHIPPING, TAXES } from '../../../constants'
import { motion } from 'framer-motion'


export const Checkout = () => {

  const status = ''
  const addresses = useSelector(selectAddresses)
  const [selectedAddress, setSelectedAddress] = useState(addresses[0])
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('cash')
  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm()
  const dispatch = useDispatch()
  const loggedInUser = useSelector(selectLoggedInUser)
  const addressStatus = useSelector(selectAddressStatus)
  const navigate = useNavigate()
  const cartItems = useSelector(selectCartItems)
  const orderStatus = useSelector(selectOrderStatus)
  const currentOrder = useSelector(selectCurrentOrder)
  const orderTotal = cartItems.reduce((acc, item) => (item.product.price * item.quantity) + acc, 0)
  const theme = useTheme()
  const is900 = useMediaQuery(theme.breakpoints.down(900))
  const is480 = useMediaQuery(theme.breakpoints.down(480))

  useEffect(() => {
    if (addressStatus === 'fulfilled') {
      reset()
    }
    else if (addressStatus === 'rejected') {
      alert('Error adding your address')
    }
  }, [addressStatus])

  useEffect(() => {
    if (currentOrder && currentOrder?._id) {
      dispatch(resetCartByUserIdAsync(loggedInUser?._id))
      navigate(`/order-success/${currentOrder?._id}`)
    }
  }, [currentOrder])

  const handleAddAddress = (data) => {
    const address = { ...data, user: loggedInUser._id }
    dispatch(addAddressAsync(address))
  }

  const handleCreateOrder = () => {
    const order = { user: loggedInUser._id, item: cartItems, address: selectedAddress, paymentMode: selectedPaymentMethod, total: orderTotal + SHIPPING + TAXES }
    dispatch(createOrderAsync(order))
  }

  return (
    <Stack
      flexDirection={{ xs: 'column', md: 'row' }}
      justifyContent="flex-start"
      flexWrap="wrap"
      mb="5rem"
      mt={2}
      alignItems="flex-start"
    >

      <Stack
        rowGap={2}
        sx={{
          flex: 1,
          minWidth: '380px',
          maxWidth: '700px',
          padding: 2,
          scale: 0.9,
        }}
      >
        <Stack flexDirection="row" columnGap={0.7} alignItems="center">
          <motion.div whileHover={{ x: -5 }}>
            <IconButton component={Link} to="/cart">
              <ArrowBackIcon fontSize={is480 ? 'medium' : 'large'} />
            </IconButton>
          </motion.div>
          <Typography variant="h6">Shipping Information</Typography>
        </Stack>

        <Stack component="form" noValidate rowGap={2} onSubmit={handleSubmit(handleAddAddress)}>
          <Stack>
            <Typography gutterBottom variant="body1">Name</Typography>
            <TextField size="small" {...register("Name", { required: true })} />
          </Stack>

          <Stack>
            <Typography gutterBottom variant="body1">House Number</Typography>
            <TextField size="small" {...register("type", { required: true })} />
          </Stack>

          <Stack>
            <Typography gutterBottom variant="body1">Street</Typography>
            <TextField size="small" {...register("street", { required: true })} />
          </Stack>

          <Stack>
            <Typography gutterBottom variant="body1">City</Typography>
            <TextField size="small" {...register("city", { required: true })} />
          </Stack>

          <Stack flexDirection="row" gap={2}>
            <Stack width="100%">
              <Typography gutterBottom variant="body1">Phone Number</Typography>
              <TextField size="small" type="number" {...register("phoneNumber", { required: true })} />
            </Stack>

            <Stack width="100%">
              <Typography gutterBottom variant="body1">Postal Code</Typography>
              <TextField size="small" type="number" {...register("postalCode", { required: true })} />
            </Stack>
          </Stack>

          <Stack flexDirection="row" alignSelf="flex-end" columnGap={1}>
            <LoadingButton loading={status === 'pending'} sx={{
              color: 'white',

              '&:hover': {
                backgroundColor: '#D4AF37',
                borderColor: '#D4AF37',

              },
            }} type="submit" variant="contained" size="small">
              Add
            </LoadingButton>
            <Button color="error" variant="outlined" onClick={() => reset()} size="small">
              Reset
            </Button>
          </Stack>
        </Stack>

        <Stack rowGap={2}>
          <Stack>
            <Typography variant="body1" color="white">Address</Typography>
            <Typography variant="body1" color="text.secondary">Choose from existing Addresses</Typography>
          </Stack>

          <Grid
            container
            gap={2}
            width={is900 ? "auto" : '100%'}
            justifyContent="flex-start"
            alignContent="flex-start"
            sx={{
              bgcolor: "black",
              color: "white",
              p: 2,
              borderRadius: 1
            }}
          >
            {addresses.map((address, index) => (
              <FormControl item key={address._id}>
                <Stack
                  p={2}
                  width={is480 ? '100%' : '20rem'}
                  height={is480 ? 'auto' : '15rem'}
                  rowGap={1}
                  component={Paper}
                  elevation={1}
                  sx={{
                    bgcolor: "black",
                    color: "white",
                    borderRadius: 1
                  }}
                >
                  <Stack flexDirection="row" alignItems="center">
                    <Radio
                      checked={selectedAddress === address}
                      name="addressRadioGroup"
                      value={selectedAddress}
                      onChange={() => setSelectedAddress(addresses[index])}
                      sx={{ color: "white" }}
                    />
                    <Typography variant="body2">{address.type}</Typography>
                  </Stack>
                  <Stack>
                    <Typography variant="body1">{address.street}</Typography>
                    <Typography variant="body1">{address.state}, {address.city}, {address.country}, {address.postalCode}</Typography>
                    <Typography variant="body1">{address.phoneNumber}</Typography>
                  </Stack>
                </Stack>
              </FormControl>
            ))}
          </Grid>
        </Stack>

        
<Stack rowGap={2}>
  <Stack>
    <Typography variant="body1">Payment Methods</Typography>
    <Typography variant="body1" color="text.secondary">Please select a payment method</Typography>
  </Stack>

  <Stack rowGap={1}>
    {/* Cash Option */}
    <Stack flexDirection="row" alignItems="center">
      <Radio
        value="COD"
        name="paymentMethod"
        checked={selectedPaymentMethod === 'COD'}
        onChange={() => setSelectedPaymentMethod('COD')}
      />
      <Typography variant="body2">Cash</Typography>
    </Stack>

    {/* Easypaisa Info */}
    {selectedPaymentMethod === 'COD' && (
      <Stack direction="row" spacing={1} alignItems="center" pl={4}>
        <Box
          component="img"
          
          alt="Easypaisa"
          sx={{ width: 24, height: 24 }}
        />
        <Typography variant="body2">Easypaisa - 0300 1234567</Typography>
      </Stack>
    )}

    {/* Card Option */}
    <Stack flexDirection="row" alignItems="center">
      <Radio
        value="CARD"
        name="paymentMethod"
        checked={selectedPaymentMethod === 'CARD'}
        onChange={() => setSelectedPaymentMethod('CARD')}
      />
      <Typography variant="body2">Card</Typography>
    </Stack>
  </Stack>
</Stack>
      </Stack>
      <Stack
        flex={1}
        minWidth="300px"
        maxWidth="450px"
        sx={{ width: '100%' }}
        alignItems="flex-start"
        rowGap={2}

      >
        <Typography variant="h6">Order Summary</Typography>
        <Cart checkout={true} />
        <LoadingButton
          sx={{
            color: "white",
            "&:hover": {
              backgroundColor: "white",
              color: "#D4AF37",
            },
          }}
          fullWidth
          loading={orderStatus === 'pending'}
          variant="contained"
          onClick={handleCreateOrder}
          size="large"
        >
          Pay and order
        </LoadingButton>
      </Stack>
    </Stack>

  )
}
