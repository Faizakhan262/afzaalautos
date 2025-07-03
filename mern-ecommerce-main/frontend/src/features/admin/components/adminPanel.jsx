import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getAllOrdersAsync,
  resetOrderUpdateStatus,
  selectOrderUpdateStatus,
  selectOrders,
  updateOrderByIdAsync,
} from '../../order/OrderSlice';

import {
  Avatar,
  Box,
  Chip,
  Stack,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';

import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { noOrdersAnimation } from '../../../assets/index';
import Lottie from 'lottie-react';
import { Doughnut, Bar, Pie, Line } from 'react-chartjs-2';

import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
ChartJS.register(CategoryScale, ArcElement, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

export const AdminPanel = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectOrders);
  const [cityOrderData, setCityOrderData] = useState({ labels: [], datasets: [] });
  const [topProductsData, setTopProductsData] = useState({ labels: [], datasets: [] });
  const orderUpdateStatus = useSelector(selectOrderUpdateStatus);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [editIndex, setEditIndex] = useState(-1);


  useEffect(() => {
    dispatch(getAllOrdersAsync());
  }, [dispatch]);

  useEffect(() => {
    if (orderUpdateStatus === 'fulfilled') {
      toast.success('Status updated');
    } else if (orderUpdateStatus === 'rejected') {
      toast.error('Error updating order status');
    }
  }, [orderUpdateStatus]);

  useEffect(() => {
    return () => {
      dispatch(resetOrderUpdateStatus());
    };
  }, [dispatch]);

  const handleUpdateOrder = (data) => {
    const update = { ...data, _id: orders[editIndex]._id };
    setEditIndex(-1);
    dispatch(updateOrderByIdAsync(update));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return { bgcolor: '#d4af37', color: 'white' };
      case 'Dispatched':
        return { bgcolor: '#d8b753', color: 'white' };
      case 'Out for delivery':
        return { bgcolor: '#ddbf69', color: 'white' };
      case 'Delivered':
        return { bgcolor: '#e1c87e', color: 'white' };
      case 'Cancelled':
        return { bgcolor: '#e5d092', color: 'white' };
      default:
        return {};
    }
  };

  const getCityOrderCount = (orders) => {
    const cityCountMap = {};
    orders.forEach((order) => {
      const city = order.address?.[0]?.city;
      if (city) {
        cityCountMap[city] = (cityCountMap[city] || 0) + 1;
      }
    });
    return cityCountMap;
  };


  const totalRevenue = orders.reduce((acc, order) => acc + order.total, 0);

  const getMonthlyRevenue = (orders) => {
    const monthlyRevenue = {};
    orders.forEach((order) => {
      const date = new Date(order.createdAt);
      const month = `${date.getMonth() + 1}-${date.getFullYear()}`;
      monthlyRevenue[month] = (monthlyRevenue[month] || 0) + order.total;
    });
    return monthlyRevenue;
  };
  const monthlyRevenue = getMonthlyRevenue(orders);
  const revenueLabels = Object.keys(monthlyRevenue);
  const revenueData = Object.values(monthlyRevenue);

  const areaChartData = {
    labels: revenueLabels,
    datasets: [
      {
        label: 'Monthly Revenue',
        data: revenueData,
        fill: true,
        backgroundColor: '#d4af37',
        borderColor: '#d4af37',
        tension: 0.4,
      },
    ],
  };

  useEffect(() => {
    const productSalesMap = {};
    orders.forEach((order) => {
      order.item.forEach((product) => {
        const id = product.product._id;
        const title = product.product.title;
        const quantity = product.quantity || 1;

        if (!productSalesMap[id]) {
          productSalesMap[id] = { title, quantity };
        } else {
          productSalesMap[id].quantity += quantity;
        }
      });
    });

    const sortedProducts = Object.values(productSalesMap)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    const topProductsLabels = sortedProducts.map((p) => p.title);
    const topProductsData = sortedProducts.map((p) => p.quantity);

    setTopProductsData({
      labels: topProductsLabels,
      datasets: [
        {
          label: 'Units Sold',
          data: topProductsData,
          backgroundColor: ['#d4af37', '#c0a16b', '#bca27b', '#e1c87e', '#f0e68c'],
        },
      ],
    });
  }, [orders]);

  const paymentCounts = orders.reduce((acc, order) => {
    acc[order.paymentMode] = (acc[order.paymentMode] || 0) + 1;
    return acc;
  }, {});

  const paymentLabels = Object.keys(paymentCounts);
  const paymentDataValues = Object.values(paymentCounts);

  const paymentData = {
    labels: paymentLabels,
    datasets: [
      {
        label: 'Payment Methods',
        data: paymentDataValues,
        backgroundColor: ['#D4AF37', '#ABD437', '#F7C4BA', '#B5B3AE', '#DA70D6'],
        borderColor: 'white',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: 'white',
        },
      },
    },
  };

  useEffect(() => {
    if (orderUpdateStatus === 'fulfilled') {
      toast.success('Status updated');
    } else if (orderUpdateStatus === 'rejected') {
      toast.error('Error updating order status');
    }
  }, [orderUpdateStatus]);

  useEffect(() => {
    dispatch(getAllOrdersAsync());
  }, [dispatch]);

  useEffect(() => {
    const cityCountMap = getCityOrderCount(orders);
    const cityLabels = Object.keys(cityCountMap);
    const cityData = Object.values(cityCountMap);

    setCityOrderData({
      labels: cityLabels,
      datasets: [
        {
          label: 'Orders per City',
          data: cityData,
          backgroundColor: ['#D4AF37', '#ABD437', '#F7C4BA', '#B5B3AE', '#DA70D6'],
          borderWidth: 1,
        },
      ],
    });
  }, [orders]);

  const chartoptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    cutout: '70%',
  };
  return (
    <Stack justifyContent="center" alignItems="center" sx={{ py: 2, px: 1 }} spacing={3}>
      {orders.length > 0 ? (
        <>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={3.5}
            justifyContent="center"
            alignItems="center"
            flexWrap="wrap"
            sx={{ width: '90%' }}
          >
            {[
              {
                title: 'Delivered Orders',
                value: orders.filter((order) => order.status === 'Delivered').length,
                bgColor: '#d4af37',
                color: 'white',
              },
              {
                title: 'Pending Orders',
                value: orders.filter((order) => order.status === 'Pending').length,
                bgColor: '#d4af37',
                color: 'white',
              },
              {
                title: 'Dispatched Orders',
                value: orders.filter((order) => order.status === 'Dispatched').length,
                bgColor: '#d4af37',
                color: 'white',
              },
              {
                title: 'Out for delivery Orders',
                value: orders.filter((order) => order.status === 'Out for delivery').length,
                bgColor: '#d4af37',
                color: 'white',
              },
              {
                title: 'Total Orders',
                value: orders.length,
                bgColor: '#d4af37',
                color: 'white',
              },
            ].map((item, index) => (
              <Paper
                key={index}
                elevation={3}
                sx={{
                  p: 3,
                  minWidth: 220,
                  height: 100,
                  textAlign: 'center',
                  backgroundColor: item.bgColor,
                  color: item.color,
                  mx: 1,
                }}
              >
                <Typography variant="subtitle2">{item.title}</Typography>
                <Typography variant="h6">{item.value}</Typography>
              </Paper>
            ))}
          </Stack>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            justifyContent="center"
            alignItems="flex-start"
            flexWrap="wrap"
            sx={{ width: '92%' }}
          >
            <Box sx={{ width: { xs: '100%', sm: '48%' }, overflowX: 'auto' }}>
              <Paper
                sx={{
                  p: 3,
                  backgroundColor: '#0d0d0d',
                  borderRadius: 2,
                  color: 'white',
                  height: 295,
                }}
                elevation={4}
              >
                <Typography fontWeight="bold" fontSize="1.1rem" mb={2}>
                  Recent Orders
                </Typography>
                <TableContainer
                  sx={{
                    maxHeight: 220,
                    overflowY: 'auto',
                    backgroundColor: 'transparent',
                    '& .MuiTableCell-root': {
                      color: 'white',
                      padding: '6px 12px',
                      fontSize: '0.875rem',
                    },
                  }}
                >
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Order</TableCell>
                        <TableCell>Item</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Total</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {orders.slice(0, 3).map((order, index) => (
                        <TableRow key={order._id}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell align="left">
                            <Stack gap={0.5}>
                              {order.item.map((product, i) => (
                                <Stack key={i} direction="row" alignItems="center" spacing={1}>
                                  <Avatar
                                    src={product.product.thumbnail}
                                    alt={product.product.title}
                                    sx={{ width: 25, height: 25 }}
                                  />
                                  <Typography fontSize="0.75rem">{product.product.title}</Typography>
                                </Stack>
                              ))}
                            </Stack>
                          </TableCell>
                          <TableCell align="right">
                            <Chip label={order.status} sx={getStatusColor(order.status)} />
                          </TableCell>
                          <TableCell align="right">Rs {order.total.toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Box>

            <Box sx={{ width: { xs: '100%', sm: '48%' } }}>
              <Paper
                sx={{
                  p: 2,
                  backgroundColor: '#0d0d0d',
                  borderRadius: 3,
                  color: 'white',
                  height: 290,
                  display: 'flex',
                  flexDirection: 'column',
                }}
                elevation={3}
              >
                <Typography fontWeight="bold" fontSize="1rem">
                  Monthly Revenue
                </Typography>
                <Box sx={{ flexGrow: 1 , width:"500px"}}>
                  <Line
                    data={areaChartData}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: { position: 'top', labels: { color: 'white' } },
                      },
                      scales: {
                        x: {
                          title: { display: true, text: 'Month', color: 'white' },
                          ticks: { color: 'white' },
                        },
                        y: {
                          title: { display: true, text: 'Rs', color: 'white' },
                          ticks: { color: 'white' },
                          beginAtZero: true,
                        },
                      },
                      elements: {
                        line: { borderColor: '#c5940e' },
                        point: { backgroundColor: '#c5940e' },
                      },
                      layout: {
                        padding: {
                          left: 8,
                          right: 8,
                          top: 4,
                          bottom: 8,
                        },
                      },
                    }}
                  />
                </Box>
              </Paper>
            </Box>

          </Stack>
          <Stack
            direction="row"
            spacing={2}
            justifyContent="space-between"
            alignItems="flex-start"
            flexWrap="wrap"
            sx={{ width: '90%' }}
          >


            <Paper sx={{ flex: 1, p: 1, bgcolor: '#0d0d0d', color: 'white', height: '300px' }}>
              <Typography fontWeight="bold" fontSize="1rem" mb={3}>
                Sales by Location
              </Typography>
              <div style={{ height: '75%', width: '95%' }}>
                <Doughnut data={cityOrderData} options={chartOptions} />
              </div>
            </Paper>



            <Box sx={{ width: { xs: '100%', sm: '41%'  } }}>
              <Paper
                sx={{
                  p: 2,
                  backgroundColor: '#0d0d0d',
                  borderRadius: 2,
                  color: 'white',
                  height: 300,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
                elevation={4}
              >
                <Typography fontWeight="bold" fontSize="1rem" mb={2}>
                  Top 5 Best-Selling Products
                </Typography>
                <Bar
                  data={topProductsData}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        display: false,
                      },
                    },
                    scales: {
                      x: {
                        ticks: { color: 'white' },
                        title: {
                          display: true,
                          text: 'Products',
                          color: 'white',
                        },
                      },
                      y: {
                        ticks: { color: 'white' },
                        title: {
                          display: true,
                          text: 'Units Sold',
                          color: 'white',
                        },
                        beginAtZero: true,
                      },
                    },
                  }}
                />
              </Paper>
            </Box>


            <Paper sx={{ flex: 1, p: 1, bgcolor: '#0d0d0d', color: 'white', height: '300px' }}>
              <Typography fontWeight="bold" fontSize="1rem" mb={3}>
                Payment Gateways
              </Typography>
              <div style={{ height: '78%', width: '95%' }}>
                <Pie
                  data={paymentData}
                  options={chartOptions}
                  style={{ height: '150px', width: '150px' }}
                />
              </div>
            </Paper>

          </Stack>


        </>
      ) : (
        <Stack width="30rem" justifyContent="center">
          <Stack rowGap="1rem">
            <Lottie animationData={noOrdersAnimation} />
            <Typography textAlign="center" variant="h6" fontWeight={400}>
              There are no orders currently
            </Typography>
          </Stack>
        </Stack>
      )}
    </Stack>


  );
};
