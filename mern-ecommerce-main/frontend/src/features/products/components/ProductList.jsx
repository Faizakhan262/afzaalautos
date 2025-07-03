import { FormControl, Button, Box, Grid, IconButton, InputLabel, MenuItem, Select, Stack, Typography, useMediaQuery, useTheme } from '@mui/material'
import React, { useEffect, useState, useRef, useMemo } from 'react'
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'
import { fetchProductsAsync, resetProductFetchStatus, selectProductFetchStatus, selectProductIsFilterOpen, selectProductTotalResults, selectProducts, toggleFilters } from '../ProductSlice'
import { ProductCard } from './ProductCard'
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import { selectAllReviews } from '../../review/ReviewSlice';
import { fetchAllReviewsAsync } from '../../review/ReviewSlice';
import { Reviews } from '../../review/components/Reviews';
import AddIcon from '@mui/icons-material/Add';
import { selectBrands } from '../../brands/BrandSlice'
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { selectCategories } from '../../categories/CategoriesSlice'
import Pagination from '@mui/material/Pagination';
import { ITEMS_PER_PAGE } from '../../../constants'
import { createWishlistItemAsync, deleteWishlistItemByIdAsync, resetWishlistItemAddStatus, resetWishlistItemDeleteStatus, selectWishlistItemAddStatus, selectWishlistItemDeleteStatus, selectWishlistItems } from '../../wishlist/WishlistSlice'
import { selectLoggedInUser } from '../../auth/AuthSlice'
import { toast } from 'react-toastify'
import { armchair, banner2, banner3, banner4, loadingAnimation } from '../../../assets'
import { resetCartItemAddStatus, selectCartItemAddStatus } from '../../cart/CartSlice'
import { color, motion } from 'framer-motion'
import { ProductBanner } from './ProductBanner'
import ClearIcon from '@mui/icons-material/Clear';
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import Services4 from "../../../assets/images/Services4.png"
import Services2 from "../../../assets/images/Services2.png"
import Services3 from "../../../assets/images/Services3.png"
import Lottie from 'lottie-react'
import { AboutUs } from './AboutUs';
const sortOptions = [
    { name: "Price: low to high", sort: "price", order: "asc" },
    { name: "Price: high to low", sort: "price", order: "desc" },
]
const bannerImages = [armchair, banner3, banner2, banner4]

export const ProductList = () => {
    const [filters, setFilters] = useState({})
    const [page, setPage] = useState(1)
    const [sort, setSort] = useState(null)
    const [showAll, setShowAll] = useState(false);
    const theme = useTheme()
    const is1200 = useMediaQuery(theme.breakpoints.down(1200))
    const is800 = useMediaQuery(theme.breakpoints.down(800))
    const is700 = useMediaQuery(theme.breakpoints.down(700))
    const is600 = useMediaQuery(theme.breakpoints.down(600))
    const is500 = useMediaQuery(theme.breakpoints.down(500))
    const is488 = useMediaQuery(theme.breakpoints.down(488))

    const brands = useSelector(selectBrands)
    const categories = useSelector(selectCategories)
    const products = useSelector(selectProducts)
    const totalResults = useSelector(selectProductTotalResults)
    const loggedInUser = useSelector(selectLoggedInUser)

    const productFetchStatus = useSelector(selectProductFetchStatus)

    const wishlistItems = useSelector(selectWishlistItems)
    const wishlistItemAddStatus = useSelector(selectWishlistItemAddStatus)
    const wishlistItemDeleteStatus = useSelector(selectWishlistItemDeleteStatus)

    const cartItemAddStatus = useSelector(selectCartItemAddStatus)

    const isProductFilterOpen = useSelector(selectProductIsFilterOpen)
    const displayedProducts = showAll ? products : products.slice(0, 4);
    const dispatch = useDispatch()

    const handleBrandFilters = (e) => {

        const filterSet = new Set(filters.brand)

        if (e.target.checked) { filterSet.add(e.target.value) }
        else { filterSet.delete(e.target.value) }

        const filterArray = Array.from(filterSet);
        setFilters({ ...filters, brand: filterArray })
    }
    const reviews = useSelector(selectAllReviews);
    console.log("Reviews from store:", reviews);

    const averageRatings = useMemo(() => {
        const ratings = {};
        reviews.forEach(({ product, rating }) => {
            const productId = product._id || product;
            if (!ratings[productId]) ratings[productId] = { total: 0, count: 0 };
            ratings[productId].total += rating;
            ratings[productId].count += 1;
        });

        const averages = {};
        Object.entries(ratings).forEach(([id, { total, count }]) => {
            averages[id] = total / count;
        });
        return averages;

    }, [reviews]);


    const handleCategoryFilters = (e) => {
        const filterSet = new Set(filters.category)

        if (e.target.checked) { filterSet.add(e.target.value) }
        else { filterSet.delete(e.target.value) }

        const filterArray = Array.from(filterSet);
        setFilters({ ...filters, category: filterArray })
    }

    useEffect(() => {
        dispatch(fetchAllReviewsAsync());
    }, [dispatch]);

    const scrollRef = useRef();

    const scroll = (direction) => {
        const { current } = scrollRef;
        if (direction === "left") {
            current.scrollLeft -= 300;
        } else {
            current.scrollLeft += 300;
        }
    };

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: "instant"
        })
    }, [])

    useEffect(() => {
        setPage(1)
    }, [totalResults])

    useEffect(() => {
        const finalFilters = { ...filters }

        finalFilters['pagination'] = { page: page, limit: ITEMS_PER_PAGE }

        if (sort) {
            finalFilters['sort'] = sort.sort
            finalFilters['order'] = sort.order
        }

        if (!loggedInUser?.isAdmin) {
            finalFilters['user'] = true
        }

        dispatch(fetchProductsAsync(finalFilters))
    }, [filters, page, sort])




    const handleAddRemoveFromWishlist = (e, productId) => {
        if (e.target.checked) {
            const data = { user: loggedInUser?._id, product: productId }
            dispatch(createWishlistItemAsync(data))
        }

        else if (!e.target.checked) {
            const index = wishlistItems.findIndex((item) => item.product._id === productId)
            dispatch(deleteWishlistItemByIdAsync(wishlistItems[index]._id));
        }
    }

    useEffect(() => {
        if (wishlistItemAddStatus === 'fulfilled') {
            toast.success("Product added to wishlist")
        }
        else if (wishlistItemAddStatus === 'rejected') {
            toast.error("Error adding product to wishlist, please try again later")
        }

    }, [wishlistItemAddStatus])

    useEffect(() => {
        if (wishlistItemDeleteStatus === 'fulfilled') {
            toast.success("Product removed from wishlist")
        }
        else if (wishlistItemDeleteStatus === 'rejected') {
            toast.error("Error removing product from wishlist, please try again later")
        }
    }, [wishlistItemDeleteStatus])

    useEffect(() => {
        if (cartItemAddStatus === 'fulfilled') {
            toast.success("Product added to cart")
        }
        else if (cartItemAddStatus === 'rejected') {
            toast.error("Error adding product to cart, please try again later")
        }

    }, [cartItemAddStatus])

    useEffect(() => {
        if (productFetchStatus === 'rejected') {
            toast.error("Error fetching products, please try again later")
        }
    }, [productFetchStatus])

    useEffect(() => {
        return () => {
            dispatch(resetProductFetchStatus())
            dispatch(resetWishlistItemAddStatus())
            dispatch(resetWishlistItemDeleteStatus())
            dispatch(resetCartItemAddStatus())
        }
    }, [])
    const handleFilterClose = () => {
        dispatch(toggleFilters())
    }

    return (
        <>

            {productFetchStatus === 'pending' ?
                <Stack width={is500 ? "35vh" : '25rem'} height={'calc(100vh - 4rem)'} justifyContent={'center'} marginRight={'auto'} marginLeft={'auto'}>
                    <Lottie animationData={loadingAnimation} />
                </Stack>
                :
                <>
                    <motion.div style={{ position: "fixed", backgroundColor: "white", height: "100vh", padding: '1rem', overflowY: "scroll", width: is500 ? "100vw" : "30rem", zIndex: 500 }} variants={{ show: { left: 0 }, hide: { left: -500 } }} initial={'hide'} transition={{ ease: "easeInOut", duration: .7, type: "spring" }} animate={isProductFilterOpen === true ? "show" : "hide"}>


                        <Stack mb={'5rem'} sx={{ scrollBehavior: "smooth", overflowY: "scroll" }}>


                            <Typography variant='h4'>New Arrivals</Typography>
                            <IconButton onClick={handleFilterClose} style={{ position: "absolute", top: 15, right: 15 }}>
                                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                    <ClearIcon fontSize='medium' />
                                </motion.div>
                            </IconButton>


                            <Stack rowGap={2} mt={4} >
                                <Typography sx={{ cursor: "pointer" }} variant='body2'>Totes</Typography>
                                <Typography sx={{ cursor: "pointer" }} variant='body2'>Backpacks</Typography>
                                <Typography sx={{ cursor: "pointer" }} variant='body2'>Travel Bags</Typography>
                                <Typography sx={{ cursor: "pointer" }} variant='body2'>Hip Bags</Typography>
                                <Typography sx={{ cursor: "pointer" }} variant='body2'>Laptop Sleeves</Typography>
                            </Stack>

                            <Stack mt={2}>
                                <Accordion>
                                    <AccordionSummary expandIcon={<AddIcon />} aria-controls="brand-filters" id="brand-filters" >
                                        <Typography>Brands</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails sx={{ p: 0 }}>
                                        <FormGroup onChange={handleBrandFilters}>
                                            {
                                                brands?.map((brand) => (
                                                    <motion.div style={{ width: "fit-content" }} whileHover={{ x: 5 }} whileTap={{ scale: 0.9 }}>
                                                        <FormControlLabel sx={{ ml: 1 }} control={<Checkbox whileHover={{ scale: 1.1 }} />} label={brand.name} value={brand._id} />
                                                    </motion.div>
                                                ))
                                            }
                                        </FormGroup>
                                    </AccordionDetails>
                                </Accordion>
                            </Stack>
                            <Stack mt={2}>
                                <Accordion>
                                    <AccordionSummary expandIcon={<AddIcon />} aria-controls="brand-filters" id="brand-filters" >
                                        <Typography>Category</Typography>
                                    </AccordionSummary>

                                    <AccordionDetails sx={{ p: 0 }}>
                                        <FormGroup onChange={handleCategoryFilters}>
                                            {
                                                categories?.map((category) => (
                                                    <motion.div style={{ width: "fit-content" }} whileHover={{ x: 5 }} whileTap={{ scale: 0.9 }}>
                                                        <FormControlLabel sx={{ ml: 1 }} control={<Checkbox whileHover={{ scale: 1.1 }} />} label={category.name} value={category._id} />
                                                    </motion.div>
                                                ))
                                            }
                                        </FormGroup>
                                    </AccordionDetails>
                                </Accordion>
                            </Stack>
                        </Stack>
                    </motion.div>
                    <Stack sx={{
                        backgroundColor: "#000000",
                        color: "#D4AF37",

                    }}>
                        {
                            !is600 &&
                            <Stack sx={{ width: "100%", height: is800 ? "300px" : is1200 ? "400px" : "500px" }}>
                                <ProductBanner images={bannerImages} />
                            </Stack>
                        }

                        <Stack flexDirection={'row'} mr={'2rem'} justifyContent={'flex-end'} alignItems={'center'} columnGap={5}>
                            <Stack alignSelf={'flex-end'} width={'12rem'} sx={{

                                color: " #D4AF37",
                            }} >
                                <FormControl sx={{

                                    border: "1px solid  #D4AF37",
                                    color: " #D4AF37",

                                }}>
                                    <InputLabel sx={{

                                        color: " #D4AF37",
                                    }} id="sort-dropdown">Sort</InputLabel>
                                    <Select
                                        variant='standard'
                                        labelId="sort-dropdown"
                                        label="Sort"
                                        onChange={(e) => setSort(e.target.value)}
                                        value={sort}
                                        sx={{

                                            color: " #D4AF37",
                                        }}
                                    >
                                        <MenuItem bgcolor=' #D4AF37' value={null}>Reset</MenuItem>
                                        {
                                            sortOptions.map((option) => (
                                                <MenuItem sx={{

                                                    color: " #D4AF37",
                                                }} key={option} value={option}>{option.name}</MenuItem>
                                            ))
                                        }
                                    </Select>
                                </FormControl>
                            </Stack>
                        </Stack>
                        <Stack
                            width="1200px"
                            height="480px"
                            mx="auto"
                            mt={10}
                            mb={10}
                            ml={10}
                            spacing={3}
                        >

                            <Stack direction="row" alignItems="center" justifyContent="space-between" height="60px">
                                <Stack direction="row" alignItems="center" spacing={3}>
                                    <Box width="10px" height="40px" bgcolor="#D4AF37" />
                                    <Typography fontSize="24px" fontWeight={600} color="#D4AF37">
                                        New Arrivals
                                    </Typography>
                                </Stack>

                                <Stack direction="row"  >
                                    <IconButton onClick={() => scroll("left")}>
                                        <ChevronLeft sx={{
                                            backgroundColor: "#000000",
                                            color: "#D4AF37",
                                            border: "1px solid #D4AF37",
                                            '&:hover': {
                                                boxShadow: "0 0 10px #D4AF37",
                                            },
                                        }} />
                                    </IconButton>
                                    <IconButton onClick={() => scroll("right")}>
                                        <ChevronRight sx={{
                                            backgroundColor: "#000000",
                                            color: "#D4AF37",
                                            border: "1px solid #D4AF37",
                                            '&:hover': {
                                                boxShadow: "0 0 10px #D4AF37",
                                            },
                                        }} />
                                    </IconButton>
                                </Stack>
                            </Stack>
                            <Box
                                ref={scrollRef}
                                sx={{
                                    display: "flex",
                                    gap: 2,
                                    overflowX: "auto",
                                    scrollBehavior: "smooth",
                                    height: "470px",
                                    "&::-webkit-scrollbar": { display: "none" }

                                }}
                            >
                                {products
                                    .filter(product => product)
                                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                                    .slice(0, 8)
                                    .map((product) => (
                                        <Box key={product._id} flex="0 0 auto" sx={{
                                            backgroundColor: "#000000",
                                            color: "#D4AF37",
                                            border: "1px solid #D4AF37",
                                            '&:hover': {
                                                boxShadow: "0 0 10px #D4AF37",
                                            },
                                        }}>
                                            <ProductCard
                                                id={product._id}
                                                title={product.title}
                                                thumbnail={product.thumbnail}
                                                brand={product.brand.name}
                                                price={product.price}
                                                handleAddRemoveFromWishlist={handleAddRemoveFromWishlist}
                                            />
                                        </Box>
                                    ))}
                            </Box>
                        </Stack>

                        <Stack
                            width="1200px"
                            height="480px"
                            mx="auto"
                            mt={2}
                            mb={2}
                            ml={10}
                            spacing={3}
                        >
                            <Stack direction="column" height="60px">
                                <Stack direction="row" spacing={3}>
                                    <Box width="10px" height="40px" bgcolor="#D4AF37" />
                                    <Typography fontSize="24px" fontWeight={600} color="#D4AF37">
                                        Categories
                                    </Typography>
                                </Stack>
                                <Grid container spacing={4} mt={4}>
                                    {brands?.map((brand) => (
                                        <Grid
                                            item
                                            xs={2.4}
                                            key={brand._id}
                                            sx={{ display: 'flex', justifyContent: 'center' }}
                                        >
                                            <Link to={`/brand/${brand._id}`} style={{ textDecoration: 'none', width: '100%' }}>
                                                <motion.div
                                                    whileHover={{ scale: 1.03 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    style={{
                                                        width: '100%',
                                                        height: 180,
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        alignItems: 'center',
                                                        justifyContent: 'flex-start',

                                                        backgroundColor: "white",

                                                        color: "black",
                                                        border: "1px solid white",


                                                        borderRadius: 8,

                                                        padding: 12,
                                                    }}
                                                >
                                                    <Box
                                                        sx={{
                                                            width: '100%',
                                                            height: 100,
                                                            display: 'flex',
                                                            justifyContent: 'center',
                                                            alignItems: 'center',
                                                        }}
                                                    >
                                                        <img
                                                            src={brand.logoUrl}
                                                            alt={`${brand.name} logo`}
                                                            style={{
                                                                maxWidth: '100%',
                                                                maxHeight: '100%',
                                                                objectFit: 'contain',
                                                            }}
                                                        />
                                                    </Box>
                                                    <Typography
                                                        fontSize="14px"
                                                        fontWeight={600}
                                                        mt={2}
                                                        textAlign="center"
                                                        noWrap
                                                    >
                                                        {brand.name}
                                                    </Typography>
                                                </motion.div>
                                            </Link>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Stack>
                        </Stack>
                        <Stack
                            width="1200px"
                            height="480px"
                            mx="auto"
                            mt={10}
                            mb={2}
                            ml={10}
                            spacing={3}
                        >
                            <Stack direction="column" height="60px">
                                <Stack direction="row" spacing={3}>
                                    <Box width="10px" height="40px" bgcolor="#D4AF37" />
                                    <Typography fontSize="24px" fontWeight={600} color="#D4AF37">
                                        About Us
                                    </Typography>
                                </Stack>
                                <AboutUs></AboutUs>
                            </Stack>
                        </Stack>

                        <Stack
                            width="1200px"
                            height="480px"
                            mx="auto"
                            mt={2}
                            mb={2}
                            ml={10}
                            spacing={3}
                        >
                            <Stack direction="column" height="60px" spacing={5}>
                                <Stack direction="row" spacing={3}>
                                    <Box width="10px" height="40px" bgcolor="#D4AF37" />
                                    <Typography fontSize="24px" fontWeight={600}>
                                        Best Products
                                    </Typography>
                                </Stack>

                                {products
                                    .filter(product => averageRatings[product._id] >= 1)
                                    .sort((a, b) => (averageRatings[b._id] || 0) - (averageRatings[a._id] || 0))
                                    .slice(0, 8)
                                    .map(product => (
                                        <Box key={product._id} flex="0 0 auto" sx={{
                                            backgroundColor: "#000000",
                                            color: "#D4AF37",
                                            border: "1px solid #D4AF37",
                                            '&:hover': {
                                                boxShadow: "0 0 10px #D4AF37",
                                            },
                                        }}>
                                            <ProductCard
                                                id={product._id}
                                                title={product.title}
                                                thumbnail={product.thumbnail}
                                                brand={product.brand.name}
                                                price={product.price}
                                                handleAddRemoveFromWishlist={handleAddRemoveFromWishlist}
                                            />
                                        </Box>
                                    ))}
                            </Stack>
                        </Stack>
                        <Stack rowGap={5} mt={3} mb={10} width="1200px" height="480px" overflow={"auto"} mx="auto" ml={10} spacing={3}>
                            <Stack direction="column" height="60px" spacing={5}>
                                <Stack direction="row" spacing={3}>
                                    <Box width="10px" height="40px" bgcolor="#D4AF37" />
                                    <Typography fontSize="24px" fontWeight={600}>
                                        All Products
                                    </Typography>
                                </Stack>

                                <Grid gap={2} container justifyContent={'center'} alignContent={'center'}>
                                    {displayedProducts.map((product) => (
                                        <Box
                                            key={product._id}
                                            flex="0 0 auto"
                                            sx={{
                                                backgroundColor: '#000000',
                                                color: '#D4AF37',
                                                border: '1px solid #D4AF37',
                                                '&:hover': {
                                                    boxShadow: '0 0 10px #D4AF37',
                                                },
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
                                    ))}
                                </Grid>


                                <Stack direction="row" justifyContent="center">
                                    <Button
                                        variant="contained"

                                        style={{
                                            padding: "8px 14px",
                                            borderRadius: "3px",
                                            backgroundColor: "#D4AF37",
                                            color: "white",
                                            border: "none",
                                            cursor: "pointer",
                                            fontSize: "14px"
                                        }}
                                        onClick={() => setShowAll((prev) => !prev)}
                                    >
                                        {showAll ? 'Show Less <-' : 'All Products ->'}
                                    </Button>
                                </Stack>
                            </Stack>
                        </Stack>


                        <Stack direction="row" spacing={6} justifyContent="center" mt={5} mb={15}>

                            <Box
                                sx={{
                                    width: 280,
                                    height: 200,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    border: '1px solid #D4AF37',
                                    color: "white",
                                    '&:hover': {
                                        boxShadow: '0 0 10px #D4AF37',
                                    }
                                }}
                            >
                                <Box
                                    component="img"
                                    src={Services4}
                                    alt="delivery-image"
                                    sx={{ width: 80, height: 80 }}
                                    mt={2}
                                />
                                <Typography
                                    sx={{
                                        width: 242,
                                        height: 28,
                                        textAlign: 'center',
                                        fontWeight: 600,
                                        mt: 2,
                                    }}
                                >
                                    FREE AND FAST DELIVERY
                                </Typography>
                                <Typography
                                    sx={{
                                        width: 249,
                                        height: 21,
                                        textAlign: 'center',
                                        fontSize: '14px',
                                        mt: 1,
                                        color: " #D4AF37",
                                    }}
                                >
                                    Free delivery for orders over 50000
                                </Typography>
                            </Box>

                            {/* Second Column */}
                            <Box
                                sx={{
                                    width: 280,
                                    height: 200,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    color: "white",
                                    border: '1px solid #D4AF37',
                                    '&:hover': {
                                        boxShadow: '0 0 10px #D4AF37',
                                    }
                                }}
                            >
                                <Box
                                    component="img"
                                    src={Services2}
                                    alt="delivery-image"
                                    sx={{ width: 80, height: 80 }}
                                    mt={2}
                                />
                                <Typography
                                    sx={{
                                        width: 242,
                                        height: 28,
                                        textAlign: 'center',
                                        fontWeight: 600,
                                        mt: 2,
                                    }}
                                >
                                    24/7 CUSTOMER SERVICE
                                </Typography>
                                <Typography
                                    sx={{
                                        width: 249,
                                        height: 21,
                                        textAlign: 'center',
                                        fontSize: '14px',
                                        mt: 1,
                                        color: " #D4AF37",

                                    }}
                                >
                                    Friendly 24/7 customer support
                                </Typography>
                            </Box>
                            <Box
                                sx={{
                                    width: 280,
                                    height: 200,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    color: "white",
                                    border: '1px solid #D4AF37', '&:hover': {
                                        boxShadow: '0 0 10px #D4AF37',
                                    }

                                }}

                            >
                                <Box
                                    component="img"
                                    src={Services3}
                                    alt="delivery-image"
                                    sx={{ width: 80, height: 80 }}
                                    mt={2}
                                />
                                <Typography
                                    sx={{
                                        width: 242,
                                        height: 28,
                                        textAlign: 'center',
                                        fontWeight: 600,
                                        mt: 2,
                                    }}
                                >
                                    MONEY BACK GUARANTEE
                                </Typography>
                                <Typography
                                    sx={{
                                        width: 249,
                                        height: 21,
                                        textAlign: 'center',
                                        fontSize: '14px',
                                        mt: 1,
                                        color: " #D4AF37",
                                    }}
                                >
                                    We reurn money within 30 days
                                </Typography>
                            </Box>
                        </Stack>
                    </Stack>
                </>
            }

        </>
    )
}
