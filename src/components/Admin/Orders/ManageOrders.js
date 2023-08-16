import React, { useEffect, useState } from 'react'
import OrdersStatistics from './OrdersStatistics';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrdersAction } from '../../../redux/slices/orders/ordersSlice';
import UpdateOrderModal from './UpdateOrdersModal';
import Skeleton from 'react-loading-skeleton';
import LoadingComponent from '../../LoadingComp/LoadingComponent';
import { resetSuccessAction } from '../../../redux/slices/globalActions/globalAction';
import Pagination from '../../pagination/Pagination';
import { limitNumber } from '../../../utils/limitNumber';
import { useTranslation } from 'react-i18next';
import { formatPrice } from '../../../utils/formatCurrency';
import AdminOrderDetails from './AdminOrderDetails';
const ManageOrders = () => {
  const [openUpdateOrderModal, setOpenUpdateModel] = useState(false);
  const [orderDetailsModal, setOrderDetailsModal] = useState(false);
  const [orderDetails, setOrderDetails] = useState('');
  const dispatch = useDispatch();
  const { orders, loading, error, isUpdated } = useSelector(state => state.orders);
  const [query, setQuery] = useState("");
  let count = orders?.count;
  let results = orders?.results;
  let totalPage = Math.ceil(count / limitNumber);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const { t } = useTranslation()
  useEffect(() => {
    dispatch(fetchOrdersAction({
      page,
      limit,
      query: query
    }));
  }, [dispatch, limit, page, query])

  useEffect(() => {
    if (isUpdated) {
      dispatch(fetchOrdersAction({
        page,
        limit,
        query: ''
      }));
      dispatch(resetSuccessAction());
    }
  }, [isUpdated, dispatch, page, limit])

  const handleUpdateOrderModal = (order) => {
    setOpenUpdateModel(!openUpdateOrderModal)
    setOrderDetails(order)
  }
  const handleShowOrderModalDetails = (order) => {
    setOrderDetailsModal(!orderDetailsModal)
    setOrderDetails(order)
  }
  return (
    <>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center"></div>
        {/* order stats */}

        <div className="flex items-center justify-between mt-3">
          <h3 className="text-lg font-medium leading-6 text-gray-900 mt-5">
            {t('manage_orders')}
          </h3>
          <div className="flex items-center justify-end">
            <input
              type="search"
              name="search"
              placeHolder={t('search')}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="block  appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        </div>
        <div className="-mx-4 mt-3  overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:-mx-6 md:mx-0 md:rounded-lg">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                  {t('order_id')}
                </th>
                <th
                  scope="col"
                  className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell">
                  Payment Status
                </th>
                <th
                  scope="col"
                  className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell">
                  {/* Payment Method */}
                  {t('payment_method')}
                </th>
                <th
                  scope="col"
                  className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell">
                  {t('order_date')}
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  {t('total_amount')}
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  {t('status')}
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Chi tiết
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Hành động
                </th>
                {/* <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                <span className="sr-only">Edit</span>
              </th> */}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {
                loading ? <p className="px-3 py-4">Loading...</p> : orders?.orders?.length === 0 ? <div className="w-full px-3 py-2 text-center">No order found</div> : <>
                  {orders?.orders?.map((order) => (
                    <tr key={order._id}>
                      <td className="w-full max-w-0 py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:w-auto sm:max-w-none sm:pl-6">
                        {order.orderNumber}
                        <dl className="font-normal lg:hidden">
                          <dt className="sr-only">Title</dt>
                          <dd className="mt-1 truncate text-gray-700">
                            {order.paymentMethod}
                          </dd>
                          <dt className="sr-only sm:hidden">Email</dt>
                          <dd className="mt-1 truncate text-gray-500 sm:hidden">
                            {order.email}
                          </dd>
                        </dl>
                      </td>
                      <td className="hidden px-3 py-4 text-sm text-gray-500 lg:table-cell">
                        {order?.paymentStatus === "Not paid" ? (
                          <span className="px-3  inline-flex text-xs leading-5 font-semibold rounded-full bg-red-600 text-white">{t(order?.paymentStatus)}</span>) : (<span className="px-3  inline-flex text-xs leading-5 font-semibold rounded-full bg-green-600 text-white">{t(order?.paymentStatus)}</span>)
                        }
                      </td>
                      <td className="hidden px-3 py-4 text-sm text-gray-500 lg:table-cell">
                        {t(order?.paymentMethod)}
                      </td>
                      <td className="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell">
                        {new Date(order?.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500">
                        {formatPrice.format(order?.totalPrice)}
                        {/* {new Date(order?.deliveredAt)?.toLocaleDateString() ?? 'Unknown'} */}
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500">
                        {t(order?.status) ?? 'Unknown'}
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500">
                        <button
                          className="text-indigo-600 hover:text-indigo-900"
                          onClick={() => handleShowOrderModalDetails(order)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-info-circle" viewBox="0 0 16 16">
                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                            <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
                          </svg>
                        </button>
                      </td>
                      <td className="px-3 py-4 text-sm font-medium sm:pr-6">
                        {
                          order?.paymentStatus !== 'Not paid' ? <button className="text-indigo-600 hover:text-indigo-900" onClick={() => handleUpdateOrderModal(order)}>
                            {t('edit')}
                          </button> : <button className="text-indigo-600 hover:text-indigo-900" onClick={() => handleUpdateOrderModal(order)}>
                            {t('edit')}
                          </button>
                        }

                      </td>
                    </tr>
                  ))}

                </>
              }

            </tbody>
          </table >
          <Pagination page={page} pages={totalPage} changePage={setPage} count={count} />
        </div >
      </div >
      {
        openUpdateOrderModal === true && (
          <UpdateOrderModal openUpdateOrderModal={openUpdateOrderModal} setOpenUpdateModel={setOpenUpdateModel} orderDetails={orderDetails} />

        )
      }
      {
        orderDetailsModal === true && (

           <AdminOrderDetails orderDetailsModal={orderDetailsModal} setOrderDetailsModal={setOrderDetailsModal} orderDetails={orderDetails} />

        )
      }
    </>
  );
}

export default ManageOrders