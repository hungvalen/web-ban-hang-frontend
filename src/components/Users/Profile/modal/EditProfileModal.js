import { Fragment, useRef, useState, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { updateUserAction, updateUserProfileAction } from '../../../../redux/slices/users/usersSlice';
import { PhotoIcon } from '@heroicons/react/20/solid';
import { dataURItoFile, fileName, getEncodedDataFromDataURI } from '../../../../utils/handleFileImage';
import DatePicker from "react-datepicker";

//animated components for react-select
const animatedComponents = makeAnimated();
export default function EditProfileModal({ isShowEditProfileModal, setIsShowEditProfileModal, user }) {
    console.log(user);
    const cancelButtonRef = useRef(null)
    const dispatch = useDispatch();
    const [selectedImage, setSelectedImage] = useState(user?.photo ?? '');
    const genders = ["male", "female", "other"];
    //---form data---
    const [formData, setFormData] = useState({
        fullName: user?.fullName ?? '',
        email: user?.email ?? "",
        phone: user?.phone ?? '',
        address: user?.address ?? '',
        dateOfBirth: new Date(user?.dateOfBirth ?? ""),
        gender: user?.gender ?? "",
        bio: user?.bio ?? "",
        file: user?.photo ?? ""
    });
    const [convertFile, setConvertFile] = useState(null);
    const [encodedData, setEncodedData] = useState(null);
    //onChange
    const handleOnChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const fileHandleChange = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = () => {
            setSelectedImage(reader.result)
        };

        if (file) {
            reader.readAsDataURL(file);
        }
        getEncodedDataFromDataURI(file)
            .then((encodedData) => {
                console.log("Encoded data:", encodedData);
                setEncodedData(encodedData)
                setConvertFile(dataURItoFile(encodedData, fileName))

            })
            .catch((error) => {
                console.error(error);
            });
    }
    //onSubmit
    const handleOnSubmit = (e) => {
        e.preventDefault();
        dispatch(updateUserProfileAction({
            ...formData,
            file: convertFile
        }))
        setIsShowEditProfileModal(false)
    };

    return (
        <>
            <Transition.Root show={isShowEditProfileModal ?? false} as={Fragment}>
                <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={setIsShowEditProfileModal ?? false}>
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
                                                    <h2 className="text-base font-semibold leading-7 text-gray-900">Edit User</h2>
                                                </div>

                                                <div className="border-b border-gray-900/10 pb-7">
                                                    {/* <h2 className="text-base font-semibold leading-7 text-gray-900">Personal Information</h2> */}
                                                    {/* <p className="mt-1 text-sm leading-6 text-gray-600">Use a permanent address where you can receive mail.</p> */}

                                                    <div className="mt-2 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                                        <div className="sm:col-span-3">
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
                                                        <div className="sm:col-span-3">
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
                                                        <div className="col-span-full">
                                                            <label htmlFor="cover-photo" className="block text-sm font-medium leading-6 text-gray-900">
                                                                Avatar
                                                            </label>
                                                            <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                                                                <div className="text-center">

                                                                    <div className="flex mt-5 flex-col">
                                                                        <img
                                                                            className='mx-auto h-56 w-56 rounded-full object-cover'
                                                                            src={selectedImage} alt="" />
                                                                    </div>


                                                                    <div className="mt-4 flex text-sm leading-6 text-gray-600">
                                                                        <label
                                                                            htmlFor="file-upload"
                                                                            className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                                                                        >
                                                                            <span>Upload a file</span>
                                                                            <input accept="image/*" id="file-upload" name="file-upload" type="file" className="sr-only" onChange={fileHandleChange} />
                                                                        </label>
                                                                        <p className="pl-1">or drag and drop</p>
                                                                    </div>
                                                                    <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 10MB</p>

                                                                </div>
                                                            </div>

                                                        </div>
                                                        <div className="sm:col-span-3">
                                                            <label className="block text-sm font-medium text-gray-700">
                                                                Phone number
                                                            </label>
                                                            <div className="mt-1">
                                                                <input
                                                                    name="phone"
                                                                    value={formData?.phone}
                                                                    onChange={handleOnChange}
                                                                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="sm:col-span-3">
                                                            <label className="block text-sm font-medium text-gray-700">
                                                                Date of birth
                                                            </label>
                                                            <div className="mt-1">
                                                                <DatePicker
                                                                    dateFormat="dd/MM/yyyy"
                                                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                                    selected={formData?.dateOfBirth}
                                                                    onChange={(date) => setFormData({ ...formData, dateOfBirth: date })}
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="sm:col-span-3">
                                                            <label className="block text-sm font-medium text-gray-700">
                                                                Address
                                                            </label>
                                                            <div className="mt-1">
                                                                <input
                                                                    name="address"
                                                                    value={formData?.address}
                                                                    onChange={handleOnChange}
                                                                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="sm:col-span-3">
                                                            <label className="block text-sm font-medium text-gray-700">
                                                                Select gender
                                                            </label>
                                                            <select
                                                                name="gender"
                                                                value={formData.gender}
                                                                onChange={handleOnChange}
                                                                className="mt-1  block w-full rounded-md border-gray-300 py-2  pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm border"
                                                                defaultValue="user">
                                                                <option>-- Select gender --</option>
                                                                {genders?.map((gender, index) => (
                                                                    <option key={index} value={gender}>
                                                                        {gender}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-6 flex items-center justify-end gap-x-6">
                                                <button type="button" className="text-sm font-semibold leading-6 text-gray-900" onClick={() => setIsShowEditProfileModal(!isShowEditProfileModal)}
                                                    ref={cancelButtonRef}>
                                                    Cancel
                                                </button>
                                                <button
                                                    type="submit"
                                                    className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                                >
                                                    Save
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
