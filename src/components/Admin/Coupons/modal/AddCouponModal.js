import { Fragment, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { useDispatch } from "react-redux";
import DatePicker from "react-datepicker";
import LoadingComponent from "../../../LoadingComp/LoadingComponent";
import { createCouponAction } from '../../../../redux/slices/coupons/couponSlice';

export default function AddCouponModal({ showAddCouponModal, setShowAddCouponModal }) {
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date(

    ));

    const [formData, setFormData] = useState({
        code: "",
        discount: "",
    });
    const cancelButtonRef = useRef(null)
    const dispatch = useDispatch();

    //onChange
    const handleOnChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };


    //onSubmit
    const handleOnSubmit = (e) => {
        e.preventDefault();
        dispatch(createCouponAction({
            ...formData,
            startDate,
            endDate
        }))
        setFormData({
            code: "",
            discount: "",
        });
        setShowAddCouponModal(false)
    };
    let loading;
    return (
        <>
            <Transition.Root show={showAddCouponModal ?? false} as={Fragment}>
                <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={setShowAddCouponModal ?? false}>
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
                                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left  transition-all lg:max-w-3xl sm:my-8 sm:w-full sm:max-w-lg">
                                    <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">

                                        <div className="flex flex-col justify-center py-2 sm:px-6 lg:px-2 w-full">
                                            <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
                                                <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                                                    Add Coupon
                                                </h2>
                                                <p className="mt-2 text-center text-sm text-gray-600">
                                                    <p className="font-medium text-indigo-600 hover:text-indigo-500">
                                                        Manage Coupon
                                                    </p>
                                                </p>
                                                {/* {error ? <ErrorMsg message={error?.message} /> : null} */}
                                            </div>

                                            <div className="mt-2 sm:mx-auto sm:w-full sm:max-w-2xl">
                                                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                                                    <form className="space-y-6" onSubmit={handleOnSubmit}>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700">
                                                                {/* name */}
                                                                Name
                                                            </label>
                                                            <div className="mt-1">
                                                                <input
                                                                    type="text"
                                                                    name="code"
                                                                    value={formData.code}
                                                                    onChange={handleOnChange}
                                                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700">
                                                                {/* discount */}
                                                                Discount (in %)
                                                            </label>
                                                            <div className="mt-1">
                                                                <input
                                                                    name="discount"
                                                                    value={formData.discount}
                                                                    onChange={handleOnChange}
                                                                    type="number"
                                                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                                />
                                                            </div>
                                                        </div>
                                                        {/* start date */}
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700">
                                                                Start Date
                                                            </label>
                                                            <div className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                                                                <DatePicker
                                                                    selected={startDate}
                                                                    onChange={(date) => setStartDate(date)}
                                                                />
                                                            </div>
                                                        </div>

                                                        {/* end date */}
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700">
                                                                End Date
                                                            </label>
                                                            <div className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                                                                <DatePicker
                                                                    selected={endDate}
                                                                    onChange={(date) => setEndDate(date)}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div>
                                                            {loading ? (
                                                                <LoadingComponent />
                                                            ) : (
                                                                <div className="bg-white  py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                                                    <button
                                                                        type="submit"
                                                                        className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 sm:ml-3 sm:w-auto"
                                                                    >
                                                                        Create
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                                                        onClick={() => setShowAddCouponModal(false)}
                                                                        ref={cancelButtonRef}
                                                                    >
                                                                        Cancel
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                    <button
                                        type="submit"
                                        className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                                    // onClick={() => setIsShowEditProductModal(false)}
                                    >
                                        Update
                                    </button>
                                    <button
                                        type="button"
                                        className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                        onClick={() => setIsShowEditProductModal(false)}
                                        ref={cancelButtonRef}
                                    >
                                        Cancel
                                    </button>
                                </div> */}
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root >
        </>

    )
}
