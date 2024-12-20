import { Fragment, useRef, useState, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { updateOrderAction } from '../../../redux/slices/orders/ordersSlice';
import { ShoppingCartIcon } from '@heroicons/react/20/solid';
import { useTranslation } from 'react-i18next';
//animated components for react-select
const animatedComponents = makeAnimated();
export default function UpdateOrderModal({ openUpdateOrderModal, setOpenUpdateModel, orderDetails }) {
  console.log(orderDetails)
  const cancelButtonRef = useRef(null)
  const [order, setOrder] = useState({
    status: orderDetails?.status,
    paymentStatus:orderDetails?.paymentStatus
  });
  const onChange = (e) => {
    setOrder({ ...order, [e.target.name]: e.target.value });
  }
  const dispatch = useDispatch();
  const updateOrderStatus = () => {
    dispatch(updateOrderAction({ id: orderDetails?._id, status: order.status ,paymentStatus:order?.paymentStatus}));
    setOpenUpdateModel(false);
  }
  const {t} = useTranslation()
  return (
    <>
      <Transition.Root show={openUpdateOrderModal ?? false} as={Fragment}>
        <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={setOpenUpdateModel ?? false}>
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
                  <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10">
                        <ShoppingCartIcon className="h-6 w-6 text-indigo-600" aria-hidden="true" />
                      </div>
                      <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                        <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                         {t('update_status_order')}
                        </Dialog.Title>
                        {/* <div className="mt-2">
                          <p className="text-sm text-gray-500">
                            Are you sure you want to update this order?
                          </p>
                        </div> */}
                      </div>
                    </div>

                  </div>
                  <div className="mt-6 flex items-center space-x-4 divide-x divide-gray-200 border-t border-gray-200 px-4 text-sm font-medium sm:mt-0 sm:ml-4 sm:border-none sm:pt-0">
                    <div className="flex flex-1 justify-center items-center gap-3">
                      <>
                        <label
                          htmlFor="status"
                          className="block text-sm font-medium text-gray-700">
                          {t('status')}:
                        </label>
                        <select
                          id="status"
                          name="status"
                          onChange={onChange}
                          value={order.status}
                          className="mt-1 block w-2/3 rounded-md border-2 border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                          defaultValue="">
                          <option value="pending">{t('pending')}</option>
                          <option value="processing">{t('processing')}</option>
                          <option value="shipped">{t('shipped')}</option>
                          <option value="intransit">{t('intransit')}</option>
                        </select>
                      </>
                    </div>
                  </div>
                  <div className="mt-6 flex items-center space-x-4 divide-x divide-gray-200 border-t border-gray-200 px-4 text-sm font-medium sm:mt-0 sm:ml-4 sm:border-none sm:pt-0">
                    <div className="flex flex-1 justify-center items-center gap-3">
                      <>
                        <label
                          htmlFor="paymentStatus"
                          className="block text-sm font-medium text-gray-700">
                          {t('payment_status')}:
                        </label>
                        <select
                          id="status"
                          name="paymentStatus"
                          onChange={onChange}
                          value={order.paymentStatus}
                          className="mt-1 block w-2/3 rounded-md border-2 border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                          defaultValue="">
                          <option value="Not paid">{t('Not paid')}</option>
                          <option value="Paid">{t('Paid')}</option>
                         
                        </select>
                      </>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 mt-3">
                    <button
                      type="submit"
                      className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                      onClick={() => updateOrderStatus()}
                    >
                      {t('update')}
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                      onClick={() => setOpenUpdateModel(false)}
                      ref={cancelButtonRef}
                    >
                      {t('cancel')}
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root >
    </>

  )
}
