import { Fragment, useRef, useState, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import AsyncSelect from 'react-select/async';

import ErrorMsg from "../../../ErrorMsg/ErrorMsg";
import LoadingComponent from "../../../LoadingComp/LoadingComponent";
import SuccessMsg from "../../../SuccessMsg/SuccessMsg";
import { fetchCategoriesAction } from "../../../../redux/slices/categories/categoriesSlice";
import { fetchBrandAction } from "../../../../redux/slices/brand/brandSlice";
import { fetchAllProductAction, fetchSingleProductAction, updateProductAction } from "../../../../redux/slices/products/productSlices";
import { fetchColorAction } from "../../../../redux/slices/color/colorSlice";
import { createProductAction } from "../../../../redux/slices/products/productSlices";
import Swal from "sweetalert2";
import SweetAlert from "../../../Playground/SweetAlert";
import baseURL from '../../../../utils/baseURL';
import { useSearchParams } from 'react-router-dom';
import { resetSuccessAction } from '../../../../redux/slices/globalActions/globalAction';
import { updateUserAction } from '../../../../redux/slices/users/usersSlice';
//animated components for react-select
const animatedComponents = makeAnimated();
export default function EditCustomer({ isShowEditUserModal, setIsShowEditUserModal, user }) {
    const cancelButtonRef = useRef(null)
    const dispatch = useDispatch();
    const roles = ["user", "admin", "staff"];
    const [roleOption, setRoleOption] = useState([]);
    const handleRoleChange = (sizes) => {
        setRoleOption(sizes);
    }
    const roleOptionsConverted = roles?.map((role) => {
        return {
            value: role,
            label: role
        }
    })
    //---form data---
    const [formData, setFormData] = useState({
        fullName: user?.fullName,
        email: user?.email,
        role: user?.role,
    });

    //onChange
    const handleOnChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };


    //onSubmit
    const handleOnSubmit = (e) => {
        e.preventDefault();
        dispatch(updateUserAction({
            id: user?._id,
            fullName: formData?.fullName,
            email: formData?.email,
            role: formData?.role

        }));
        setIsShowEditUserModal(false)
    };
    return (
        <>
            <Transition.Root show={isShowEditUserModal ?? false} as={Fragment}>
                <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={setIsShowEditUserModal ?? false}>
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
                                                    Update User
                                                </h2>
                                                <p className="mt-2 text-center text-sm text-gray-600">
                                                    <p className="font-medium text-indigo-600 hover:text-indigo-500">
                                                        Manage Users
                                                    </p>
                                                </p>
                                                {/* {error ? <ErrorMsg message={error?.message} /> : null} */}
                                            </div>

                                            <div className="mt-2 sm:mx-auto sm:w-full sm:max-w-2xl">
                                                <div className="bg-white py-8 px-2 shadow-lg  sm:rounded-lg sm:px-10">
                                                    <form className="space-y-6" onSubmit={handleOnSubmit}>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700">
                                                                User Name
                                                            </label>
                                                            <div className="mt-1">
                                                                <input
                                                                    name="fullName"
                                                                    value={formData?.fullName}
                                                                    onChange={handleOnChange}
                                                                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700">
                                                                Email
                                                            </label>
                                                            <div className="mt-1">
                                                                <input
                                                                    name="email"
                                                                    value={formData?.email}
                                                                    onChange={handleOnChange}
                                                                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700">
                                                                Select Role
                                                            </label>
                                                            <select
                                                                name="role"
                                                                value={formData.role}
                                                                onChange={handleOnChange}
                                                                className="mt-1  block w-full rounded-md border-gray-300 py-2  pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm border"
                                                                defaultValue="user">
                                                                <option>-- Select Role --</option>
                                                                {roles?.map((role,index) => (
                                                                    <option key={index} value={role}>
                                                                        {role}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                        {/* upload images */}
                                                        {/* <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                                                            <label
                                                                htmlFor="cover-photo"
                                                                className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                                                Upload Images
                                                            </label>
                                                            <div className="mt-1 sm:col-span-2 sm:mt-0">
                                                                <div className="flex max-w-lg justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
                                                                    <div className="space-y-1 text-center">
                                                                        <svg
                                                                            className="mx-auto h-12 w-12 text-gray-400"
                                                                            stroke="currentColor"
                                                                            fill="none"
                                                                            viewBox="0 0 48 48"
                                                                            aria-hidden="true">
                                                                            <path
                                                                                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                                                                strokeWidth={2}
                                                                                strokeLinecap="round"
                                                                                strokeLinejoin="round"
                                                                            />
                                                                        </svg>
                                                                        <div className="flex text-sm text-gray-600">
                                                                            <label
                                                                                htmlFor="file-upload"
                                                                                className="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500">
                                                                                <span>Upload files</span>
                                                                                <input
                                                                                    multiple
                                                                                    onChange={fileHandleChange}
                                                                                    type="file"
                                                                                />
                                                                            </label>
                                                                        </div>
                                                                        <p className="text-xs text-gray-500">
                                                                            PNG, JPG, GIF up to 10MB
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div> */}
                                                        <div>
                                                            <div className="bg-white  py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                                                <button
                                                                    type="submit"
                                                                    className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 sm:ml-3 sm:w-auto"
                                                                // onClick={() => setIsShowEditProductModal(false)}
                                                                >
                                                                    Update
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                                                    onClick={() => setIsShowEditUserModal(false)}
                                                                    ref={cancelButtonRef}
                                                                >
                                                                    Cancel
                                                                </button>
                                                            </div>
                                                            {/* {loading ? (
                                                            <LoadingComponent />
                                                        ) : (
                                                            <button
                                                                type="submit"
                                                                className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                                                                Add Product
                                                            </button>
                                                        )} */}
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
