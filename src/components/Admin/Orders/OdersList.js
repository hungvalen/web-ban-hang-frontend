import React, { useEffect, useState } from 'react'
import OrdersStatistics from './OrdersStatistics';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrdersAction } from '../../../redux/slices/orders/ordersSlice';
import UpdateOrderModal from './UpdateOrdersModal';
import Skeleton from 'react-loading-skeleton';
import LoadingComponent from '../../LoadingComp/LoadingComponent';
import { resetSuccessAction } from '../../../redux/slices/globalActions/globalAction';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const OdersList = () => {
  const [openUpdateOrderModal, setOpenUpdateModel] = useState(false);
  const [orderDetails, setOrderDetails] = useState('');
  const dispatch = useDispatch();
  const { orders, loading, error, isUpdated } = useSelector(state => state.orders);
  console.log("check orders", orders);
  useEffect(() => {
    dispatch(fetchOrdersAction());
  }, [dispatch])

  useEffect(() => {
    if (isUpdated) {
      dispatch(fetchOrdersAction());
      dispatch(resetSuccessAction());
    }
  }, [isUpdated, dispatch])

  const handleUpdateOrderModal = (order) => {
    setOpenUpdateModel(!openUpdateOrderModal)
    setOrderDetails(order)
  }
  // const data = revenueByMonth.map((item) => {
  //   return {
  //     month: item.month,
  //     totalRevenue: item.totalRevenue,
  //   };
  // });

  return (
    <>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center"></div>
        {/* order stats */}
        <OrdersStatistics />
      </div >
     
    </>
  );
}

export default OdersList