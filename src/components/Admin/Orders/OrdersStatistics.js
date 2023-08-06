import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { orderStaticsAction } from '../../../redux/slices/orders/ordersSlice';
import Skeleton from 'react-loading-skeleton';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import LoadingComponent from '../../LoadingComp/LoadingComponent';
import { formatPrice } from '../../../utils/formatCurrency';
import { useTranslation } from 'react-i18next';

const OrdersStatistics = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(orderStaticsAction());
  }, [dispatch])

  const { stats, loading, error } = useSelector(state => state.orders);
  const obj = stats?.orders;
  const statistics = obj != null && obj.length > 0 && Object.values(obj[0]);
  const revenueByMonth = stats != null && stats?.revenueByMonth?.map((item) => {
    return {
      month: item.month,
      totalRevenue: item.totalRevenue,
    };
  });
  const statusPercent = stats?.statusPercent?.map((item) => {
    return {
      name: item.status,
      value: item.percentage,
    };
  });
  const colors = ['#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d'];
  const RADIAN = Math.PI / 180;
  const formatCurrency = (value) => `$${value}`;
  const formatMonth = (value) => {
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    return monthNames[value - 1];
  };
  return (
    <>
      {loading ? <LoadingComponent /> : <div>
        <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {/* stat 1 */}
          <div className="relative overflow-hidden rounded-lg bg-white px-4 pt-5 pb-12 shadow sm:px-6 sm:pt-6">
            <dt>
              <div className="absolute rounded-md bg-indigo-500 p-3">
                <svg
                  className="h-6 w-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"></path>
                </svg>
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-900">
                Đơn hàng tối thiểu
              </p>
            </dt>
            <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
              {
                loading ? (
                  <Skeleton width={100} height={30} />
                ) : statistics[4] !== undefined ? (
                  <p className="text-2xl font-semibold text-gray-900">{formatPrice.format(+statistics[1])}</p>
                ) : (
                  <p className="text-2xl font-semibold text-gray-900">loading...</p>
                )
              }

              <div className="absolute inset-x-0 bottom-0 bg-white border px-4 py-4 sm:px-6">
                <div className="text-sm">
                  <a
                    href="#"
                    className="font-medium text-indigo-600 hover:text-indigo-500">
                    {" "}
                    View all
                  </a>
                </div>
              </div>
            </dd>
          </div>
          {/* stat 2 */}
          <div className="relative overflow-hidden rounded-lg bg-white px-4 pt-5 pb-12 shadow sm:px-6 sm:pt-6">
            <dt>
              <div className="absolute rounded-md bg-indigo-500 p-3">
                <svg
                  className="h-6 w-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"></path>
                </svg>
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500">
                Tổng doanh số
              </p>
            </dt>
            <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
              {
                loading ? (
                  <Skeleton width={100} height={30} />
                ) : statistics[4] !== undefined ? (
                  <p className="text-2xl font-semibold text-gray-900">{formatPrice.format(+statistics[2])}</p>
                ) : (
                  <p className="text-2xl font-semibold text-gray-900">loading...</p>
                )
              }

              <div className="absolute inset-x-0 bottom-0 bg-white border px-4 py-4 sm:px-6">
                <div className="text-sm">
                  <a
                    href="#"
                    className="font-medium text-indigo-600 hover:text-indigo-500">
                    {" "}
                    View all
                  </a>
                </div>
              </div>
            </dd>
          </div>
          {/* stat 3 */}
          <div className="relative overflow-hidden rounded-lg bg-white px-4 pt-5 pb-12 shadow sm:px-6 sm:pt-6">
            <dt>
              <div className="absolute rounded-md bg-indigo-500 p-3">
                <svg
                  className="h-6 w-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"></path>
                </svg>
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500">
                Đơn hàng cao nhất
              </p>
            </dt>
            <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
              {
                loading ? (
                  <Skeleton width={100} height={30} />
                ) : statistics[4] !== undefined ? (
                  <p className="text-2xl font-semibold text-gray-900">{formatPrice.format(+statistics[3]?.toFixed(2))}</p>
                ) : (
                  <p className="text-2xl font-semibold text-gray-900">loading...</p>
                )
              }
              <div className="absolute inset-x-0 bottom-0 bg-white border px-4 py-4 sm:px-6">
                <div className="text-sm">
                  <a
                    href="#"
                    className="font-medium text-indigo-600 hover:text-indigo-500">
                    {" "}
                    View all
                  </a>
                </div>
              </div>
            </dd>
          </div>
          {/* total income */}
          <div className="relative overflow-hidden rounded-lg bg-white px-4 pt-5 pb-12 shadow sm:px-6 sm:pt-6">
            <dt>
              <div className="absolute rounded-md bg-indigo-500 p-3">
                <svg
                  className="h-6 w-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"></path>
                </svg>
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500">
                Doanh số trung bình
              </p>
            </dt>
            <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
              {
                loading ? (
                  <Skeleton width={100} height={30} />
                ) : statistics[4] !== undefined ? (
                  <p className="text-2xl font-semibold text-gray-900">{formatPrice.format(+statistics[4]?.toFixed(2))}</p>
                ) : (
                  <p className="text-2xl font-semibold text-gray-900">loading...</p>
                )
              }

              <div className="absolute inset-x-0 bottom-0 bg-white border px-4 py-4 sm:px-6">
                <div className="text-sm">
                  <a
                    href="#"
                    className="font-medium text-indigo-600 hover:text-indigo-500">
                    {" "}
                    View all
                  </a>
                </div>
              </div>
            </dd>
          </div>
          {/* total income */}
          <div className="relative overflow-hidden rounded-lg bg-white px-4 pt-5 pb-12 shadow sm:px-6 sm:pt-6">
            <dt>
              <div className="absolute rounded-md bg-indigo-500 p-3">
                <svg
                  className="h-6 w-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"></path>
                </svg>
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500">
                Doanh số hôm nay
              </p>
            </dt>
            <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
              {
                loading ? <Skeleton width={100} height={30} /> : <p className="text-2xl font-semibold text-gray-900">{stats?.saleToday?.length <= 0 ? `${0}` : stats?.saleToday?.map(e => formatPrice.format(e?.totalSales))}</p>
              }


              <div className="absolute inset-x-0 bottom-0 bg-white border px-4 py-4 sm:px-6">
                <div className="text-sm">
                  <a
                    href="#"
                    className="font-medium text-indigo-600 hover:text-indigo-500">
                    {" "}
                    View all
                  </a>
                </div>
              </div>
            </dd>
          </div>
        </dl>
        <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-300" />
        <div className="flex gap-10">
          <div>
            <h1 className="font-semibold mt-2">Thống kê theo tháng</h1>
            <LineChart width={600} height={300} data={revenueByMonth} className='mt-5'>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tickFormatter={formatMonth} />
              <YAxis tickFormatter={formatCurrency} />
              <Tooltip formatter={formatCurrency} />
              <Legend />
              <Line type="monotone" dataKey="totalRevenue" stroke="#8884d8" />
            </LineChart>
          </div>
          <div>
            <h1 className='font-semibold mt-2'>Thống kê theo trạng thái</h1>
            <PieChart width={400} height={300}>
              <Pie
                data={statusPercent}
                cx={200}
                cy={150}
                innerRadius={80}
                outerRadius={120}
                fill="#8884d8"
                labelLine={false}
                label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                  const x = cx + radius * Math.cos(-midAngle * RADIAN);
                  const y = cy + radius * Math.sin(-midAngle * RADIAN);

                  return (
                    <text
                      x={x}
                      y={y}
                      fill="#ffffff" // Đặt màu chữ của phần trăm
                      textAnchor="middle" // Canh giữa văn bản ngang
                      dominantBaseline="central"
                      fontSize="14px" // Điều chỉnh kích thước chữ
                      fontWeight="bold" // Điều chỉnh độ đậm của chữ
                    >
                      {`${(percent * 100).toFixed(0)}%`}
                    </text>
                  );
                }}
              >
                {statusPercent != null && statusPercent?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Legend layout="vertical" align="right" verticalAlign="middle" wrapperStyle={{ marginLeft: '20px', right: '-40px' }} />
            </PieChart>
          </div>
        </div>
      </div>}
    </>
  );
}

export default OrdersStatistics