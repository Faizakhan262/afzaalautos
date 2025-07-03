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
  Button,
  Chip,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TablePagination,
} from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'react-toastify';

export const AdminOrders = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectOrders);
  const [editIndex, setEditIndex] = useState(-1);
  const orderUpdateStatus = useSelector(selectOrderUpdateStatus);
  const [orderSort, setOrderSort] = useState({ order: 'desc', orderBy: 'createdAt' });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm();

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

  const handleRequestSort = (property) => {
    const isAsc = orderSort.orderBy === property && orderSort.order === 'asc';
    setOrderSort({
      order: isAsc ? 'desc' : 'asc',
      orderBy: property,
    });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedOrders = orders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const editOptions = [
    { label: 'Pending', color: '#d4af37' },
    { label: 'Dispatched', color: '#d8b753' },
    { label: 'Out for delivery', color: '#ddbf69' },
    { label: 'Delivered', color: '#e1c87e' },
    { label: 'Cancelled', color: '#e5d092' },
  ];

  return (
    <Stack justifyContent="center" alignItems="center" sx={{
      backgroundColor: 'black',
    }} >
      <Stack
        mt={5}
        mb={3}
        component="form"
        noValidate
        onSubmit={handleSubmit(handleUpdateOrder)}
        sx={{ width: '100%', maxWidth: '1200px' }}
      >
        {orders.length ? (
          <>
            <TableContainer
              component={Paper}
              elevation={2}
              sx={{
                width: '100%',
                maxWidth: '1100px',
                mx: 'auto',
                overflowX: 'auto',
                backgroundColor: 'black',
                border: '2px solid white',
                boxShadow: '0px 4px 10px rgba(255, 255, 255, 0.4)',
              }}
            >
              <Table size="small" aria-label="orders table" sx={{ backgroundColor: 'black' }}>
                <TableHead>
                  <TableRow>
                    <TableCell
                      sortDirection={orderSort.orderBy === 'createdAt' ? orderSort.order : false}
                      sx={{ color: 'white' }}
                    >
                      <TableSortLabel
                        active={orderSort.orderBy === 'createdAt'}
                        direction={orderSort.orderBy === 'createdAt' ? orderSort.order : 'asc'}
                        onClick={() => handleRequestSort('createdAt')}
                        sx={{ color: 'white' }}
                      >
                        Order
                      </TableSortLabel>
                    </TableCell>
                    <TableCell align="left" sx={{ color: 'white' }}>Id</TableCell>
                    <TableCell align="left" sx={{ color: 'white' }}>Item</TableCell>
                    <TableCell align="right" sx={{ color: 'white' }}>Total</TableCell>
                    <TableCell align="right" sx={{ color: 'white' }}>Address</TableCell>
                    <TableCell align="right" sx={{ color: 'white' }}>Payment</TableCell>
                    <TableCell align="right" sx={{ color: 'white' }}>Date</TableCell>
                    <TableCell align="right" sx={{ color: 'white' }}>Status</TableCell>
                    <TableCell align="right" sx={{ color: 'white' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedOrders.map((order, index) => (
                    <TableRow
                      key={order._id}
                      sx={{
                        '& td, & th': { fontSize: '0.8rem', padding: '6px 12px', color: 'white' },
                        backgroundColor: 'black',
                      }}
                    >
                      <TableCell sx={{ color: 'white' }}>{page * rowsPerPage + index + 1}</TableCell>
                      <TableCell align="right" sx={{ color: 'white' }}>{order._id}</TableCell>
                      <TableCell align="right" sx={{ color: 'white' }}>
                        <Stack gap={1}>
                          {order.item.map((product, i) => (
                            <Stack key={i} direction="row" alignItems="center" spacing={1}>
                              <Avatar
                                src={product.product.thumbnail}
                                alt={product.product.title}
                                sx={{ width: 24, height: 24 }}
                              />
                              <Typography sx={{ fontSize: '0.75rem', color: 'white' }}>{product.product.title}</Typography>
                            </Stack>
                          ))}
                        </Stack>
                      </TableCell>
                      <TableCell align="right" sx={{ color: 'white' }}>{order.total}</TableCell>
                      <TableCell align="right" sx={{ color: 'white' }}>
                        {order.address?.length > 0 ? (
                          <Stack spacing={0} sx={{ fontSize: '0.1rem' }}>
                            <Typography sx={{ fontSize: '0.8rem', color: 'white' }}>{order.address[0].street}</Typography>
                            <Typography sx={{ fontSize: '0.8rem', color: 'white' }}>{order.address[0].city}</Typography>
                            <Typography sx={{ fontSize: '0.8rem', color: 'white' }}>{order.address[0].state}</Typography>
                            <Typography sx={{ fontSize: '0.8rem', color: 'white' }}>{order.address[0].postalCode}</Typography>
                          </Stack>
                        ) : (
                          <Typography color="text.secondary">No address</Typography>
                        )}
                      </TableCell>
                      <TableCell align="right" sx={{ color: 'white' }}>{order.paymentMode}</TableCell>
                      <TableCell align="right" sx={{ color: 'white' }}>{new Date(order.createdAt).toDateString()}</TableCell>
                      <TableCell align="right" sx={{ color: 'white' }}>
                        {editIndex === index ? (
                          <FormControl fullWidth>
                            <InputLabel id={`status-label-${index}`}>Update status</InputLabel>
                            <Controller
                              control={control}
                              name="status"
                              defaultValue={order.status}
                              render={({ field }) => (
                                <Select
                                  {...field}
                                  labelId={`status-label-${index}`}
                                  label="Update status"
                                  size="small"
                                  sx={{
                                    color: editOptions.find(option => option.label === field.value)?.color || 'white',
                                    '& .MuiSelect-icon': { color: 'white' },
                                  }}
                                >
                                  {editOptions.map((option) => (
                                    <MenuItem
                                      key={option.label}
                                      value={option.label}
                                      sx={{
                                        backgroundColor: 'white',
                                        color: option.color,
                                        '&.Mui-selected': {
                                          backgroundColor: option.color,
                                          color: option.textColor || 'white',
                                        },
                                      }}
                                    >
                                      {option.label}
                                    </MenuItem>
                                  ))}
                                </Select>
                              )}
                            />
                          </FormControl>


                        ) : (
                          <Chip size="small" label={order.status} sx={{ color: '#D4AF37' }} />
                        )}
                      </TableCell>
                      <TableCell align="right" sx={{ color: 'white' }}>
                        {editIndex === index ? (
                          <Button type="submit" size="small">
                            <IconButton size="small">
                              <CheckCircleOutlinedIcon fontSize="small" sx={{ color: 'white' }} />
                            </IconButton>
                          </Button>
                        ) : (
                          <IconButton
                            size="small"
                            onClick={() => {
                              setEditIndex(index);
                              setValue('status', order.status);
                            }}
                          >
                            <EditOutlinedIcon fontSize="small" sx={{ color: 'white' }} />
                          </IconButton>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={orders.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              sx={{ color: 'white' }}
            />
          </>
        ) : (
          <Typography color="white">No orders available</Typography>
        )}
      </Stack>
    </Stack>
  );
};
