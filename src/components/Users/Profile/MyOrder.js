import { Fragment, useEffect, useState } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { EllipsisVerticalIcon, XCircleIcon } from '@heroicons/react/24/outline'
import { CheckCircleIcon, ClockIcon, Cog6ToothIcon, TruckIcon } from '@heroicons/react/20/solid'
import { useDispatch, useSelector } from 'react-redux'
import { getUserProfileAction } from '../../../redux/slices/users/usersSlice'
import LoadingComponent from '../../LoadingComp/LoadingComponent'
import { formatPrice } from '../../../utils/formatCurrency'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import NoDataFound from '../../NoDataFound/NoDataFound'
import { Tab } from '@headlessui/react'
import { convertHtmlToPlainText, isHtmlText } from '../../../utils/convertHTMLToPlainText'

// const orders = [
//     {
//         number: 'WU88191111',
//         href: '#',
//         invoiceHref: '#',
//         createdDate: 'Jul 6, 2021',
//         createdDatetime: '2021-07-06',
//         deliveredDate: 'July 12, 2021',
//         deliveredDatetime: '2021-07-12',
//         total: '$160.00',
//         products: [
//             {
//                 id: 1,
//                 name: 'Micro Backpack',
//                 description:
//                     'Are you a minimalist looking for a compact carry option? The Micro Backpack is the perfect size for your essential everyday carry items. Wear it like a backpack or carry it like a satchel for all-day use.',
//                 href: '#',
//                 price: '$70.00',
//                 imageSrc: 'https://tailwindui.com/img/ecommerce-images/order-history-page-03-product-01.jpg',
//                 imageAlt:
//                     'Moss green canvas compact backpack with double top zipper, zipper front pouch, and matching carry handle and backpack straps.',
//             },
//             // More products...
//         ],
//     },
//     // More orders...
// ]
const tabs = [
    { name: 'Tất cả đơn', href: '#', count: '52', current: false },
    { name: 'Chờ thanh toán', href: '#', count: '6', current: false },
    { name: 'Đang xử lý', href: '#', count: '4', current: true },
    { name: 'Đang vận chuyển', href: '#', current: false },
    { name: 'Đã giao', href: '#', current: false },
    { name: 'Đã hủy', href: '#', current: false },
]


function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function MyOrder() {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { loading, profile } = useSelector(state => state.users)
    let [categories, setCategories] = useState({
        all_order: [],
        pending: [],
        order_inprogress: [],
        order_instransit: [],
        order_shipped: [],
        order_cancel: [],
    })
    useEffect(() => {
        dispatch(getUserProfileAction());

    }, [dispatch,])
    useEffect(() => {
        if (profile && profile.user) {
            const orders = profile.user.orders;

            const orders_pending = orders.filter(e => e.status === "pending");
            const orders_processing = orders.filter(e => e.status === "processing");
            const orders_shipped = orders.filter(e => e.status === "shipped");
            const orders_intransit = orders.filter(e => e.status === "intransit");
            const orders_cancel = orders.filter(e => e.status === "cancel");

            setCategories({
                all_order: orders,
                pending: orders_pending,
                order_inprogress: orders_processing,
                order_instransit: orders_intransit,
                order_shipped: orders_shipped,
                order_cancel: orders_cancel,
            });
        }
    }, [profile]);
    return (
        <>
            {
                loading ? <LoadingComponent /> :
                    <div className="bg-white">
                        <div className="py-8 sm:py-24">
                            <div className="mx-auto max-w-7xl sm:px-2 lg:px-8">
                                <div className="mx-auto max-w-2xl px-4 lg:max-w-4xl lg:px-0">
                                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">{t('order_history')}</h1>
                                    <p className="mt-2 text-sm text-gray-500">
                                        {/* Check the status of recent orders, manage returns, and discover similar products. */}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-8">

                                <h2 className="sr-only">Recent orders</h2>
                                <div className="mx-auto max-w-7xl sm:px-2 lg:px-8">
                                    <div className="mx-auto max-w-2xl space-y-8 sm:px-4 lg:max-w-4xl lg:px-0">
                                        <div>
                                            <div className="sm:hidden">
                                                <label htmlFor="tabs" className="sr-only">
                                                    Select a tab
                                                </label>
                                                {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
                                                <select
                                                    id="tabs"
                                                    name="tabs"
                                                    className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                                    defaultValue={tabs.find((tab) => tab.current).name}
                                                >
                                                    {tabs.map((tab) => (
                                                        <option key={tab.name}>{tab.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            {/* <div className="hidden sm:block">
                                                <div className="border-b border-gray-200">
                                                    <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                                                        {tabs.map((tab) => (
                                                            <a
                                                                key={tab.name}
                                                                href="#"
                                                                className={classNames(
                                                                    tab.current
                                                                        ? 'border-indigo-500 text-indigo-600'
                                                                        : 'border-transparent text-gray-500 hover:border-gray-200 hover:text-gray-700',
                                                                    'flex whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium'
                                                                )}
                                                                aria-current={tab.current ? 'page' : undefined}
                                                            >
                                                                {tab.name}
                                                                {tab.count ? (
                                                                    <span
                                                                        className={classNames(
                                                                            tab.current ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-900',
                                                                            'ml-3 hidden rounded-full py-0.5 px-2.5 text-xs font-medium md:inline-block'
                                                                        )}
                                                                    >
                                                                        {tab.count}
                                                                    </span>
                                                                ) : null}
                                                            </a>
                                                        ))}
                                                    </nav>
                                                </div>
                                            </div> */}
                                            <Tab.Group>
                                                <Tab.List className="flex space-x-1 rounded-xl bg-gray-600 p-1">
                                                    {Object.keys(categories).map((category) => (
                                                        <Tab
                                                            key={category}
                                                            className={({ selected }) =>
                                                                classNames(
                                                                    'w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-indigo-600',
                                                                    'ring-white ring-opacity-60 ring-offset-2 ring-offset-indigo-400 focus:outline-none focus:ring-2',
                                                                    selected
                                                                        ? 'bg-white shadow'
                                                                        : 'text-white hover:bg-white/[0.12] hover:text-white'
                                                                )
                                                            }
                                                        >
                                                            {t(category)}
                                                        </Tab>
                                                    ))}
                                                </Tab.List>
                                                <Tab.Panels className="mt-2">
                                                    {Object.values(categories).map((orders, idx) => (
                                                        <Tab.Panel
                                                            key={idx}
                                                            className={classNames(
                                                                'rounded-xl bg-white p-3',
                                                                'ring-white ring-opacity-60 ring-offset-2 ring-offset-indigo-400 focus:outline-none focus:ring-2'
                                                            )}
                                                        >

                                                            {orders != null && orders?.length > 0 ? orders?.map((order) => (
                                                                <div
                                                                    key={order?._id}
                                                                    className="border-b border-t my-4 border-gray-200 bg-white shadow-sm sm:rounded-lg sm:border"
                                                                >
                                                                    <h3 className="sr-only">
                                                                        Order placed on <time dateTime={order?.createdDatetime}>{order?.createdDate}</time>
                                                                    </h3>

                                                                    <div className="flex items-center border-b gap-2 border-gray-200 p-4 sm:grid sm:grid-cols-4 sm:gap-x-6 sm:p-6">
                                                                        <dl className="grid flex-1 grid-cols-2 gap-x-6 text-sm sm:col-span-3 sm:grid-cols-3 lg:col-span-2">
                                                                            <div>
                                                                                <dt className="font-medium text-gray-900">{t('order_number')}</dt>
                                                                                <dd className="mt-1 text-gray-500">{order?.orderNumber}</dd>
                                                                            </div>
                                                                            <div className="hidden sm:block">
                                                                                <dt className="font-medium text-gray-900">{t('order_place')}</dt>
                                                                                <dd className="mt-1 text-gray-500">
                                                                                    <time dateTime={order?.createdAt}>{new Date(order?.createdAt).toLocaleDateString()}</time>
                                                                                </dd>
                                                                            </div>
                                                                            <div>
                                                                                <dt className="font-medium text-gray-900">{t('total_amount')}</dt>
                                                                                <dd className="mt-1 font-medium text-gray-900">{formatPrice.format(order?.totalPrice)}</dd>
                                                                            </div>
                                                                        </dl>

                                                                        <Menu as="div" className="relative flex justify-end lg:hidden">
                                                                            <div className="flex items-center">
                                                                                <Menu.Button className="-m-2 flex items-center p-2 text-gray-400 hover:text-gray-500">
                                                                                    <span className="sr-only">Options for order {order?.number}</span>
                                                                                    <EllipsisVerticalIcon className="h-6 w-6" aria-hidden="true" />
                                                                                </Menu.Button>
                                                                            </div>

                                                                            <Transition
                                                                                as={Fragment}
                                                                                enter="transition ease-out duration-100"
                                                                                enterFrom="transform opacity-0 scale-95"
                                                                                enterTo="transform opacity-100 scale-100"
                                                                                leave="transition ease-in duration-75"
                                                                                leaveFrom="transform opacity-100 scale-100"
                                                                                leaveTo="transform opacity-0 scale-95"
                                                                            >
                                                                                <Menu.Items className="absolute right-0 z-10 mt-2 w-40 origin-bottom-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                                                    <div className="py-1">
                                                                                        <Menu.Item>
                                                                                            {({ active }) => (
                                                                                                <Link
                                                                                                    to={`order-details/${order._id}`} className={classNames(
                                                                                                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                                                                                        'block px-4 py-2 text-sm'
                                                                                                    )}
                                                                                                >
                                                                                                    View
                                                                                                </Link>
                                                                                            )}
                                                                                        </Menu.Item>
                                                                                        <Menu.Item>
                                                                                            {({ active }) => (
                                                                                                <a
                                                                                                    href={order?.invoiceHref}
                                                                                                    className={classNames(
                                                                                                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                                                                                        'block px-4 py-2 text-sm'
                                                                                                    )}
                                                                                                >
                                                                                                    Invoice
                                                                                                </a>
                                                                                            )}
                                                                                        </Menu.Item>
                                                                                    </div>
                                                                                </Menu.Items>
                                                                            </Transition>
                                                                        </Menu>

                                                                        <div className="hidden lg:col-span-2 lg:flex lg:items-center lg:justify-end lg:space-x-4">
                                                                            <Link
                                                                                state={{ orderDetails: order }}
                                                                                to={`/order-details/${order._id}`}
                                                                                className="flex items-center justify-center rounded-md border border-gray-300 bg-white px-2.5 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                                                            >
                                                                                <span>{t('view_order')}</span>
                                                                                <span className="sr-only">{order?.number}</span>
                                                                            </Link>
                                                                            <a
                                                                                href={order?.invoiceHref}
                                                                                className="flex items-center justify-center rounded-md border border-gray-300 bg-white px-2.5 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                                                            >
                                                                                <span>{t('view_invoice')}</span>
                                                                                <span className="sr-only">for order {order?.number}</span>
                                                                            </a>
                                                                        </div>
                                                                    </div>

                                                                    {/* Products */}
                                                                    <h4 className="sr-only">Items</h4>
                                                                    <ul role="list" className="divide-y divide-gray-200">
                                                                        {order?.orderItems?.map((product) => (
                                                                            <li key={product?._id} className="p-4 sm:p-6">
                                                                                <div className="flex items-center sm:items-start">
                                                                                    <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-200 sm:h-40 sm:w-40">
                                                                                        <img
                                                                                            src={product?.image}
                                                                                            alt={product?.name}
                                                                                            className="h-full w-full object-cover object-center"
                                                                                        />
                                                                                    </div>
                                                                                    <div className="ml-6 flex-1 text-sm">
                                                                                        <div className="font-medium text-gray-900 sm:flex sm:justify-between">
                                                                                            <h5>{product?.name}</h5>
                                                                                            <p className="mt-2 sm:mt-0">{formatPrice.format(product?.price)}</p>
                                                                                        </div>
                                                                                        <p className="hidden text-gray-500 sm:mt-2 sm:block">{isHtmlText(product?.description) === true ? convertHtmlToPlainText(product?.description) : product?.description
                                                                                        }</p>
                                                                                    </div>
                                                                                </div>

                                                                                <div className="mt-6 sm:flex sm:justify-between">
                                                                                    {
                                                                                        order?.status === 'shipped' ? <div className="flex items-center">
                                                                                            <CheckCircleIcon className="h-5 w-5 text-green-500" aria-hidden="true" />
                                                                                            <p className="ml-2 text-sm font-medium text-gray-500">
                                                                                                {t('order_delivered_info')}
                                                                                                {/* Delivered on <time dateTime={order?.deliveredDatetime}>{order?.deliveredDate}</time> */}
                                                                                            </p>
                                                                                        </div> : order?.status === 'pending' ? <div className="flex items-center">
                                                                                            <ClockIcon className="h-5 w-5 text-green-500" aria-hidden="true" />
                                                                                            <p className="ml-2 text-sm font-medium text-gray-500">
                                                                                            {t('order_pending_info')}
                                                                                            </p>
                                                                                        </div> : order?.status === 'processing' ? <div className="flex items-center">
                                                                                            <Cog6ToothIcon className="h-5 w-5 text-green-500" aria-hidden="true" />
                                                                                            <p className="ml-2 text-sm font-medium text-gray-500">
                                                                                            {t('order_processing_info')}
                                                                                            </p>
                                                                                        </div> : order?.status === 'intransit' ? <div className="flex items-center">
                                                                                            <TruckIcon className="h-5 w-5 text-green-500" aria-hidden="true" />
                                                                                            <p className="ml-2 text-sm font-medium text-gray-500">
                                                                                            {t('order_intrasit_info')}
                                                                                            </p>
                                                                                        </div> : <div className="flex items-center">
                                                                                            <XCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
                                                                                            <p className="ml-2 text-sm font-medium text-gray-500">
                                                                                            {t('order_canceled_info')}
                                                                                            </p>
                                                                                        </div>

                                                                                    }


                                                                                    <div className="mt-6 flex items-center space-x-4 divide-x divide-gray-200 border-t border-gray-200 pt-4 text-sm font-medium sm:ml-4 sm:mt-0 sm:border-none sm:pt-0">
                                                                                        <div className="flex flex-1 justify-center">
                                                                                            <Link
                                                                                                to={`/products/${product?._id}`}
                                                                                                // href={product?.href}
                                                                                                className="whitespace-nowrap text-indigo-600 hover:text-indigo-500"
                                                                                            >
                                                                                                {t('view_product')}
                                                                                            </Link>
                                                                                        </div>
                                                                                        {/* <div className="flex flex-1 justify-center pl-4">
                                                                                            <a href="#" className="whitespace-nowrap text-indigo-600 hover:text-indigo-500">
                                                                                                Buy again
                                                                                            </a>
                                                                                        </div> */}
                                                                                    </div>
                                                                                </div>
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                </div>
                                                            )) : <NoDataFound message={t('no_order')} />
                                                            }
                                                        </Tab.Panel>
                                                    ))}
                                                </Tab.Panels>
                                            </Tab.Group>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


            }
        </>
    )
}
