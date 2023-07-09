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
const ManageOrders = () => {
  const [openUpdateOrderModal, setOpenUpdateModel] = useState(false);
  const [orderDetails, setOrderDetails] = useState('');
  const dispatch = useDispatch();
  const { orders, loading, error, isUpdated } = useSelector(state => state.orders);
  const [query, setQuery] = useState("");
  let count = orders?.count;
  let results = orders?.results;
  let totalPage = query != '' ? Math.ceil(results / limitNumber) : Math.ceil(count / limitNumber);
  const [page, setPage] = useState(1);
  useEffect(() => {
    dispatch(fetchOrdersAction({
      page: 1,
      limit: 5,
      query: query
    }));
  }, [dispatch, page, query])

  useEffect(() => {
    if (isUpdated) {
      dispatch(fetchOrdersAction({
        page: 1,
        limit: 5,
        query: ''
      }));
      dispatch(resetSuccessAction());
    }
  }, [isUpdated, dispatch])

  const handleUpdateOrderModal = (order) => {
    setOpenUpdateModel(!openUpdateOrderModal)
    setOrderDetails(order)
  }
  return (
    <>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center"></div>
        {/* order stats */}
        <OrdersStatistics />

        <div className="flex items-center justify-between mt-3">
          <h3 className="text-lg font-medium leading-6 text-gray-900 mt-5">
            Manage Oders
          </h3>
          <div className="flex items-center justify-end">
            <input
              type="search"
              name="search"
              placeHolder="Search order"
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
                  Order ID
                </th>
                <th
                  scope="col"
                  className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell">
                  Payment Status
                </th>
                <th
                  scope="col"
                  className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell">
                  Payment Method
                </th>
                <th
                  scope="col"
                  className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell">
                  Oder Date
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Delivery Date
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Status
                </th>

                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Total
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
                          <span className="px-3  inline-flex text-xs leading-5 font-semibold rounded-full bg-red-600 text-white">{order?.paymentStatus}</span>) : (order?.paymentStatus)
                        }
                      </td>
                      <td className="hidden px-3 py-4 text-sm text-gray-500 lg:table-cell">
                        {order?.paymentMethod}
                      </td>
                      <td className="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell">
                        {new Date(order?.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500">
                        {order?.deliveryDate ?? 'Unknown'}
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500">
                        {order?.status ?? 'Unknown'}
                      </td>
                      <td className="px-3 py-4 text-sm font-medium sm:pr-6">
                        {
                          order?.paymentStatus !== 'Not paid' ? <button disabled className="text-indigo-600 hover:text-indigo-900">
                            Edit
                          </button> : <button className="text-indigo-600 hover:text-indigo-900" onClick={() => handleUpdateOrderModal(order)}>
                            Edit
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
    </>
  );
}

export default ManageOrders