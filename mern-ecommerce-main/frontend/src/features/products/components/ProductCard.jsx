import { Box, FormHelperText, Stack, Typography, useMediaQuery, useTheme } from '@mui/material'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import Favorite from '@mui/icons-material/Favorite';
import Checkbox from '@mui/material/Checkbox';
import { useDispatch, useSelector } from 'react-redux';
import { selectWishlistItems } from '../../wishlist/WishlistSlice';
import { selectLoggedInUser } from '../../auth/AuthSlice';
import { addToCartAsync, selectCartItems } from '../../cart/CartSlice';
import { motion } from 'framer-motion'

export const ProductCard = ({ id, title, price, thumbnail, brand, stockQuantity, handleAddRemoveFromWishlist, isWishlistCard, isAdminCard }) => {
    const navigate = useNavigate()
    const wishlistItems = useSelector(selectWishlistItems)
    const loggedInUser = useSelector(selectLoggedInUser)
    const cartItems = useSelector(selectCartItems)
    const dispatch = useDispatch()
    let isProductAlreadyinWishlist = -1
    const theme = useTheme()
    const is1410 = useMediaQuery(theme.breakpoints.down(1410))
    const is932 = useMediaQuery(theme.breakpoints.down(932))
    const is752 = useMediaQuery(theme.breakpoints.down(752))
    const is500 = useMediaQuery(theme.breakpoints.down(500))
    const is608 = useMediaQuery(theme.breakpoints.down(608))
    const is488 = useMediaQuery(theme.breakpoints.down(488))
    const is408 = useMediaQuery(theme.breakpoints.down(408))

    isProductAlreadyinWishlist = wishlistItems.some((item) => item.product._id === id)

    const isProductAlreadyInCart = cartItems.some((item) => item.product._id === id)

    const handleAddToCart = async (e) => {
        e.stopPropagation()
        const data = { user: loggedInUser?._id, product: id }
        dispatch(addToCartAsync(data))
    }
    return (
        <>
            {
                isProductAlreadyinWishlist !== -1 && (
                    <Stack
                        component={isAdminCard ? "" : isWishlistCard ? "" : is408 ? '' : ''}
                        width="275px"
                        height="370px"
                        p={2}
                        elevation={1}
                        sx={{ cursor: "pointer", borderRadius: "8px", boxShadow: 1 }}
                        onClick={() => navigate(`/product-details/${id}`)}
                    >

                        <Box
                            width="250px"
                            height="240px"
                            sx={{
                                mb: 1,
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                backgroundColor: "#f9f9f9",
                                borderRadius: "4px"
                            }}
                        >
                            <img
                                src={thumbnail}
                                alt={`${title} photo unavailable`}
                                style={{
                                    maxWidth: "100%",
                                    maxHeight: "100%",
                                    objectFit: "contain"
                                }}
                            />
                        </Box>
                        <Stack spacing={0.5} position="relative">
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                <Typography
                                    fontSize="16px"
                                    fontWeight={600}
                                    width="118px"
                                    height="24px"
                                    overflow="hidden"
                                    textOverflow="ellipsis"
                                    whiteSpace="nowrap"
                                >
                                    {title}
                                </Typography>

                                {!isAdminCard && (
                                    <motion.div
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 1 }}
                                        style={{ width: "34px", height: "34px" }}>
                                        <Checkbox
                                            onClick={(e) => e.stopPropagation()}
                                            checked={isProductAlreadyinWishlist}
                                            onChange={(e) => handleAddRemoveFromWishlist(e, id)}
                                            icon={<FavoriteBorder />}
                                            checkedIcon={<Favorite sx={{ color: 'red' }} />}
                                            sx={{ p: 0 }} />
                                    </motion.div>
                                )}
                            </Stack>

                            <Typography
                                variant="body2"
                                height="28px"
                                color="#D4AF37"
                                overflow="hidden"
                                textOverflow="ellipsis"
                                whiteSpace="nowrap"
                            >
                                {brand}
                            </Typography>
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                <Typography fontSize="16px" fontWeight={600}>
                                    {price}
                                </Typography>


                                {!isWishlistCard && !isAdminCard && !isProductAlreadyInCart && (
                                    <motion.button
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 1 }}
                                        onClick={(e) => handleAddToCart(e)}
                                        style={{
                                            padding: "7px 11px",
                                            borderRadius: "3px",
                                            backgroundColor: "#D4AF37",
                                            color: "white",
                                            border: "none",
                                            cursor: "pointer",
                                            fontSize: "14px"
                                        }}
                                    >
                                        Add To Cart
                                    </motion.button>
                                )}

                                {isProductAlreadyInCart && (
                                    <Typography variant="caption" color="white">
                                        Added to cart
                                    </Typography>
                                )}
                            </Stack>
                            {stockQuantity <= 20 && (
                                <FormHelperText sx={{ fontSize: ".8rem" }} error>
                                    {stockQuantity === 1 ? "Only 1 stock left" : "Only few left"}
                                </FormHelperText>
                            )}
                        </Stack>
                    </Stack>
                )
            }

        </>
    )
}
