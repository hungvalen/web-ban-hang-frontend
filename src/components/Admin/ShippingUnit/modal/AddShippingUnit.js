import { useState, Fragment, useRef } from "react";
import { Link } from "react-router-dom";
import ErrorComponent from "../../../ErrorMsg/ErrorMsg";
import SuccessMsg from "../../../SuccessMsg/SuccessMsg";
import LoadingComponent from "../../../LoadingComp/LoadingComponent";
import { useDispatch, useSelector } from "react-redux";
import { createShippingUnitAction } from "../../../../redux/slices/shipping-unit/shippingUnitSlice";
import { Dialog, Transition } from '@headlessui/react'
export default function AddShippingUnit({ isShowAddShippingUnitModal, setIsShowAddShippingUnitModal }) {
    const cancelButtonRef = useRef(null)
    const [formData, setFormData] = useState({
        name: "",
    });
    const dispatch = useDispatch()
    // files
    const [file, setFile] = useState(null);
    const [fileErr, setFileErr] = useState([]);
    const fileHandleChange = (event) => {

        const newFile = event.target.files[0]
        // validation

        if (newFile.size > 1000000) {
            setFileErr(`${newFile.name} is too large, please pick a smaller file`)
        }
        if (!newFile.type.startsWith("image/")) {
            setFileErr(`${newFile.name} is not a valid format`)
        }
        setFile(newFile);
    }

    //---onChange---
    const handleOnChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    let { error, isAdded, loading } = useSelector(state => state.shippingUnit)
    //onSubmit
    const handleOnSubmit = (e) => {
        e.preventDefault();
        dispatch(createShippingUnitAction({
            name: formData?.name,
            file: file
        }))
        setFormData({ name: "" });
        setIsShowAddShippingUnitModal(!isShowAddShippingUnitModal);
    };

    return (
        <>
            {error && <ErrorComponent message={error?.message} />}
            {isAdded && <SuccessMsg message="ShippingUnit added successfully" />}

            <Transition.Root show={isShowAddShippingUnitModal ?? false} as={Fragment}>
                <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={setIsShowAddShippingUnitModal ?? false}>
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
                                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left  transition-all lg:max-w-xl sm:my-8 sm:w-full sm:max-w-md">

                                    <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                        <form onSubmit={handleOnSubmit}>
                                            <div className="space-y-6">
                                                <div className="border-b border-gray-900/10 pb-2">
                                                    <h2 className="text-base font-semibold leading-7 text-gray-900">Add Shipping Unit</h2>
                                                </div>

                                                <div className="border-b border-gray-900/10 pb-7">
                                                    {/* <h2 className="text-base font-semibold leading-7 text-gray-900">Personal Information</h2> */}
                                                    {/* <p className="mt-1 text-sm leading-6 text-gray-600">Use a permanent address where you can receive mail.</p> */}

                                                    <div className="mt-2 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                                        <div className="sm:col-span-6">
                                                            <label className="block text-sm font-medium text-gray-700">
                                                                Name
                                                            </label>
                                                            <div className="mt-1">
                                                                <input
                                                                    name="name"
                                                                    value={formData?.name}
                                                                    onChange={handleOnChange}
                                                                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                                                />
                                                            </div>
                                                        </div>

                                                    </div>
                                                    <div className="sm:col-span-6 sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
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
                                                                                name="files"

                                                                            />
                                                                        </label>
                                                                    </div>
                                                                    <p className="text-xs text-gray-500">
                                                                        PNG, JPG, GIF up to 10MB
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="sm:col-span-6">
                                                        <div className="flex items-center justify-center flex-wrap gap-2 mt-2">
                                                            {
                                                                file != null && (
                                                                    <div className="overflow-hidden relative">

                                                                        <img src={URL.createObjectURL(file)} alt="" className="h-56 w-full object-cover object-center rounded-md" />
                                                                    </div>
                                                                )
                                                            }
                                                        </div>

                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-6 flex items-center justify-end gap-x-6">
                                                <button type="button" className="text-sm font-semibold leading-6 text-gray-900" onClick={() => setIsShowAddShippingUnitModal(false)}
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
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root >
        </>
    );
}
