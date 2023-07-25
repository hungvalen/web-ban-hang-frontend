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
import { createUserAction, updateUserAction } from '../../../../redux/slices/users/usersSlice';
import { PhotoIcon, UserCircleIcon } from '@heroicons/react/24/solid'
import { useTranslation } from 'react-i18next';

//animated components for react-select
const animatedComponents = makeAnimated();
export default function AddCustomerModal({ isShowAddUserModal, setIsShowAddUserModal }) {
    const { t } = useTranslation();
    const cancelButtonRef = useRef(null)
    const dispatch = useDispatch();
    const roles = ["user", "admin", "staff"];
    const genders = ["male", "female", "other"];
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
        fullName: '',
        email: '',
        phone: '',
        role: '',
        address: '',
        dateOfBirth: '',
        gender: '',
        password: '',
    });
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    function togglePasswordVisibility() {
        setIsPasswordVisible((prevState) => !prevState);
    }
    //onChange
    const handleOnChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };


    //onSubmit
    const handleOnSubmit = (e) => {
        e.preventDefault();
        dispatch(createUserAction({
            fullName: formData?.fullName,
            email: formData?.email,
            phone: formData?.phoneNumber,
            password: formData?.password,
            gender: formData?.gender,
            dateOfBirth: formData?.dateOfBirth,
            address: formData?.address,
            role: formData?.role

        }));
        setIsShowAddUserModal(false)
    };


    return (
        <>
            <Transition.Root show={isShowAddUserModal ?? false} as={Fragment}>
                <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={setIsShowAddUserModal ?? false}>
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
                                        <form onSubmit={handleOnSubmit}>
                                            <div className="space-y-6">
                                                <div className="border-b border-gray-900/10 pb-2">
                                                    <h2 className="text-base font-semibold leading-7 text-gray-900">{t('add_user')}</h2>
                                                </div>

                                                <div className="border-b border-gray-900/10 pb-7">
                                                    {/* <h2 className="text-base font-semibold leading-7 text-gray-900">Personal Information</h2> */}
                                                    {/* <p className="mt-1 text-sm leading-6 text-gray-600">Use a permanent address where you can receive mail.</p> */}

                                                    <div className="mt-2 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                                        <div className="sm:col-span-3">
                                                            <label className="block text-sm font-medium text-gray-700">
                                                                {t('username')}
                                                            </label>
                                                            <div className="mt-1">
                                                                <input
                                                                    required
                                                                    name="fullName"
                                                                    value={formData?.fullName}
                                                                    onChange={handleOnChange}
                                                                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="sm:col-span-3">
                                                            <label className="block text-sm font-medium text-gray-700">
                                                                {t('email')}
                                                            </label>
                                                            <div className="mt-1">
                                                                <input
                                                                    name="email"
                                                                    required
                                                                    type="email"
                                                                    value={formData?.email}
                                                                    onChange={handleOnChange}
                                                                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="sm:col-span-3">
                                                            <label className="block text-sm font-medium text-gray-700">
                                                                {t('password')}
                                                            </label>
                                                            <div className="relative w-full container mx-auto mt-1">
                                                                <input
                                                                    type={isPasswordVisible ? "text" : "password"}
                                                                    placeholder="Password"
                                                                    name="password"
                                                                    required
                                                                    onChange={handleOnChange}
                                                                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                                                />
                                                                <span
                                                                    className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-600"
                                                                    onClick={togglePasswordVisibility}
                                                                >
                                                                    {isPasswordVisible ? (
                                                                        <svg
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                            fill="none"
                                                                            viewBox="0 0 24 24"
                                                                            strokeWidth={1.5}
                                                                            stroke="currentColor"
                                                                            className="w-5 h-5"
                                                                        >
                                                                            <path
                                                                                strokeLinecap="round"
                                                                                strokeLinejoin="round"
                                                                                d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                                                                            />
                                                                            <path
                                                                                strokeLinecap="round"
                                                                                strokeLinejoin="round"
                                                                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                                            />
                                                                        </svg>
                                                                    ) : (
                                                                        <svg
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                            fill="none"
                                                                            viewBox="0 0 24 24"
                                                                            strokeWidth={1.5}
                                                                            stroke="currentColor"
                                                                            className="w-5 h-5"
                                                                        >
                                                                            <path
                                                                                strokeLinecap="round"
                                                                                strokeLinejoin="round"
                                                                                d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                                                                            />
                                                                        </svg>

                                                                    )}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="sm:col-span-3">
                                                            <label className="block text-sm font-medium text-gray-700">
                                                                {t('phone_number')}
                                                            </label>
                                                            <div className="mt-1">
                                                                <input
                                                                    required
                                                                    name="phoneNumber"
                                                                    value={formData?.phoneNumber}
                                                                    onChange={handleOnChange}
                                                                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="sm:col-span-3">
                                                            <label className="block text-sm font-medium text-gray-700">
                                                                {t('date_of_birth')}

                                                            </label>
                                                            <div className="mt-1">
                                                                <input
                                                                    required
                                                                    name="dateOfBirth"
                                                                    type="date"
                                                                    value={formData?.dateOfBirth}
                                                                    onChange={handleOnChange}
                                                                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="sm:col-span-3">
                                                            <label className="block text-sm font-medium text-gray-700" for="gender">
                                                                {t('gender')}

                                                            </label>
                                                            <select
                                                                name="gender"
                                                                id="gender"
                                                                required
                                                                value={formData.gender}
                                                                onChange={handleOnChange}
                                                                className="mt-1  block w-full rounded-md border-gray-300 py-2  pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm border"
                                                            >
                                                                <option value="">-- {t('select_gender')} --</option>
                                                                {genders?.map((gender, index) => (
                                                                    <option key={index} value={gender}>
                                                                        {t(gender)}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                        <div className="sm:col-span-3">
                                                            <label className="block text-sm font-medium text-gray-700">
                                                                {t('address')}
                                                            </label>
                                                            <div className="mt-1">
                                                                <input
                                                                    name="address"
                                                                    required
                                                                    value={formData?.address}
                                                                    onChange={handleOnChange}
                                                                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="sm:col-span-3">
                                                            <label className="block text-sm font-medium text-gray-700" for="role">
                                                                {t('role')}
                                                            </label>
                                                            <select
                                                                name="role"
                                                                id="role"
                                                                required
                                                                value={formData.role}
                                                                onChange={handleOnChange}
                                                                className="mt-1  block w-full rounded-md border-gray-300 py-2  pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm border"
                                                            >
                                                                <option value="">-- {t('select_role')} --</option>
                                                                {roles?.map((role, index) => (
                                                                    <option key={index} value={role}>
                                                                        {t(role)}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>

                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-6 flex items-center justify-end gap-x-6">
                                                <button type="button" className="text-sm font-semibold leading-6 text-gray-900" onClick={() => setIsShowAddUserModal(false)}
                                                    ref={cancelButtonRef}>
                                                    {t('cancel')}
                                                </button>
                                                <button
                                                    type="submit"
                                                    className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                                >
                                                    {t('save')}
                                                </button>
                                            </div>
                                        </form>
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
