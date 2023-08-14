import { Dialog, Transition } from '@headlessui/react'
import { PaperClipIcon } from '@heroicons/react/24/outline'
import React, { Fragment, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import moment from 'moment';
import { formatPrice } from '../../../utils/formatCurrency';

function AdminOrderDetails({ orderDetailsModal, setOrderDetailsModal, orderDetails }) {
    console.log(orderDetails);
    const cancelButtonRef = useRef(null)
    const { t } = useTranslation();
    return (
        <Transition.Root show={orderDetailsModal ?? false} as={Fragment}>
            <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={setOrderDetailsModal ?? false}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 z-10 overflow-y-auto ">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0 ">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left  transition-all lg:max-w-xl sm:my-8 sm:w-full sm:max-w-lg">
                                <div className="overflow-hidden bg-white">
                                    <div className="px-4 py-4 sm:px-6">
                                        <h3 className="text-base font-semibold leading-7 text-gray-900">{t('order_details')}</h3>
                                        {/* <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">Personal details and application.</p> */}
                                    </div>
                                    <div className="border-t border-gray-100">
                                        <dl className="divide-y divide-gray-100">
                                            <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                <dt className="text-sm font-medium text-gray-900">{t('order_number')}</dt>
                                                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{orderDetails?.orderNumber}</dd>
                                            </div>
                                            <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                <dt className="text-sm font-medium text-gray-900">{t('order_time')}</dt>
                                                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{moment(orderDetails?.createdAt).format('DD/MM/YYYY HH:mm')}</dd>
                                            </div>
                                            <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                <dt className="text-sm font-medium text-gray-900">{t('full_name')}</dt>
                                                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{orderDetails?.user?.fullName}</dd>
                                            </div>
                                            <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                <dt className="text-sm font-medium text-gray-900">{t('phone_number')}</dt>
                                                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{orderDetails?.shippingAddress?.phone}</dd>
                                            </div>
                                            <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                <dt className="text-sm font-medium text-gray-900">{t('address')}</dt>
                                                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                                                    {orderDetails?.shippingAddress?.address}
                                                </dd>
                                            </div>
                                            <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                <dt className="text-sm font-medium text-gray-900">{t('wards/communes')}</dt>
                                                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                                                    {orderDetails?.shippingAddress?.ward}
                                                </dd>
                                            </div>
                                            <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                <dt className="text-sm font-medium text-gray-900">{t('districts')}</dt>
                                                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                                                    {orderDetails?.shippingAddress?.district}
                                                </dd>
                                            </div>
                                            <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                <dt className="text-sm font-medium text-gray-900">{t('Province/City')}</dt>
                                                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                                                    {orderDetails?.shippingAddress?.province}
                                                </dd>
                                            </div>
                                            <div className="px-4 py-4 sm:grid sm:grid-cols-1 sm:gap-4 sm:px-6">
                                                <dt className="text-sm font-medium leading-6 text-gray-900">{t('product_order')}</dt>
                                                <dd className="mt-2 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                                    <ul role="list" className="divide-y divide-gray-100 rounded-md border border-gray-200">
                                                        {
                                                            orderDetails?.orderItems?.map((e) => {
                                                                console.log('check items',e);
                                                                return (
                                                                    <li className="flex justify-start py-4 pl-4 pr-5 text-sm leading-6">
                                                                        <>
                                                                            {/* <PaperClipIcon className="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" /> */}
                                                                            <div className="ml-4 flex flex-col min-w-0 flex-1 gap-2">
                                                                                <span className="truncate font-medium">{t('product_name')}: {e?.name}</span>
                                                                                <span className="flex-shrink-0 text-gray-400">{t('price')}: {formatPrice.format(e?.price)}</span>
                                                                                <span className="flex-shrink-0 text-gray-400">{t('shipping_estimate')}: {formatPrice.format(e?.fee ?? 0)}</span>
                                                                                <span className="flex-shrink-0 text-gray-400">{t('quantity')}: {e?.qty}</span>
                                                                                <span className="flex-shrink-0 text-gray-400">{t('total_amount')}: {formatPrice.format(e?.totalPrice)} (
                                                                                    {
                                                                                        orderDetails?.paymentMethod === "cod" ? t('cod') : orderDetails?.paymentMethod === "zalopay" ? t('zalopay')
                                                                                            : t('pay_by_visa')
                                                                                    })
                                                                                </span>
                                                                            </div>
                                                                            <img className="h-12 w-12 object-cover" src={e?.image} alt="" />
                                                                        </>

                                                                    </li>
                                                                )
                                                            })
                                                        }

                                                        {/* <li className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
                                                            <div className="flex w-0 flex-1 items-center">
                                                                <PaperClipIcon className="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                                                                <div className="ml-4 flex min-w-0 flex-1 gap-2">
                                                                    <span className="truncate font-medium">coverletter_back_end_developer.pdf</span>
                                                                    <span className="flex-shrink-0 text-gray-400">4.5mb</span>
                                                                </div>
                                                            </div>
                                                            <div className="ml-4 flex-shrink-0">
                                                                <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                                                                    Download
                                                                </a>
                                                            </div>
                                                        </li> */}
                                                    </ul>
                                                </dd>
                                            </div>
                                        </dl>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 mt-3">
                                    <button
                                        type="button"
                                        className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                        onClick={() => setOrderDetailsModal(false)}
                                        ref={cancelButtonRef}
                                    >
                                        {t('close')}
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root >
    )
}

export default AdminOrderDetails