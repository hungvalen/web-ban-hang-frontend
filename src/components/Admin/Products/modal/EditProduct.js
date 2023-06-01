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
//animated components for react-select
const animatedComponents = makeAnimated();
export default function EditProduct({ isShowEditProductModal, setIsShowEditProductModal, product }) {
    const [params] = useSearchParams();
    let { products: { products }, loading, error, isUpdated } = useSelector(state => state.product);
    let productUrl = `${baseURL}/products`
    const page = params.get("page") || 1;
    const limit = params.get("limit") || 5;
    const cancelButtonRef = useRef(null)
    const dispatch = useDispatch();
    const [files, setFiles] = useState([]);
    const [fileErrs, setFileErrs] = useState([]);
    const fileHandleChange = (event) => {
        const newFiles = Array.from(event.target.files);
        console.log(newFiles)
        // validation
        const newErrs = [];
        newFiles.forEach((file) => {
            if (file.size > 1000000) {
                newErrs.push(`${file.name} is too large`);
            }
            if (!file.type.startsWith("image/")) {
                newErrs.push(`${file.name} is not an image`);
            }
        })
        setFiles(newFiles);
        setFileErrs(newErrs);
        // setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    }


    // Sizes
    const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
    const [sizeOption, setSizeOption] = useState([]);
    const [colorOption, setColorOption] = useState([]);
    useEffect(() => {
        dispatch(fetchCategoriesAction());
        dispatch(fetchBrandAction());
        dispatch(fetchColorAction());

    }, [dispatch])

    const { colors } = useSelector(state => state.color)
    const { categories } = useSelector(state => state.category.categories)
    // const { product, isAdded, error, loading } = useSelector(state => state.product)
    const handleSizeChange = (sizes) => {
        setSizeOption(sizes);
    }

    const handleColorChangeOption = (colors) => {
        setColorOption(colors);
    }

    // converted sizes
    const sizeOptionsConverted = sizes?.map((size) => {
        return {
            value: size,
            label: size
        }
    })

    // converted color
    const colorOptionsCoverted = colors?.colors?.map((color) => {
        return {
            value: color?.name,
            label: color?.name
        }
    });

    const colorDefaultOptions = product?.colors?.map((color) => {
        return {
            value: color,
            label: color
        }
    });

    const sizeDefaultOptions = product?.sizes?.map((size) => {
        return {
            value: size,
            label: size
        }
    })
    const { brands } = useSelector(state => state.brand.brands)

    //---form data---
    const [formData, setFormData] = useState({
        name: product?.name,
        price: product?.price,
        totalQty: product?.totalQty,
        description: product?.description,
        category: product.category,
        sizes: product?.sizes,
        brand: product?.brand,
        colors: product?.colors,
    });

    //onChange
    const handleOnChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };


    //onSubmit
    const handleOnSubmit = (e) => {
        e.preventDefault();
        dispatch(updateProductAction({
            ...formData,
            id: product._id,
            colors: colorOption?.map((color) => color?.value),
            sizes: sizeOption?.map((size) => size?.value)
        }))
        // reset form data
        setFormData({
            name: "",
            description: "",
            category: "",
            sizes: "",
            brand: "",
            colors: "",
            images: "",
            price: "",
            totalQty: "",
        });
        setIsShowEditProductModal(false)
        setFileErrs([]);
    };
    return (
        <>
            <Transition.Root show={isShowEditProductModal ?? false} as={Fragment}>
                <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={setIsShowEditProductModal ?? false}>
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
                                        {/* <div className="sm:flex sm:items-start">
                                        <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                            <ExclamationTriangleIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
                                        </div>
                                        <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                            <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                                                Deactivate account
                                            </Dialog.Title>
                                            <div className="mt-2">
                                                <p className="text-sm text-gray-500">
                                                    Are you sure you want to deactivate your account? All of your data will be permanently
                                                    removed. This action cannot be undone.
                                                </p>
                                            </div>
                                        </div>
                                    </div> */}
                                        <div className="flex min-h-screen flex-col justify-center py-2 sm:px-6 lg:px-2 w-full">
                                            <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
                                                <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                                                    Update Product
                                                </h2>
                                                <p className="mt-2 text-center text-sm text-gray-600">
                                                    <p className="font-medium text-indigo-600 hover:text-indigo-500">
                                                        Manage Products
                                                    </p>
                                                </p>
                                                {/* {error ? <ErrorMsg message={error?.message} /> : null} */}
                                            </div>

                                            <div className="mt-2 sm:mx-auto sm:w-full sm:max-w-2xl">
                                                <div className="bg-white py-8 px-2 shadow-md  sm:rounded-lg sm:px-10">
                                                    <form className="space-y-6" onSubmit={handleOnSubmit}>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700">
                                                                Product Name
                                                            </label>
                                                            <div className="mt-1">
                                                                <input
                                                                    name="name"
                                                                    defaultValue={formData?.name}
                                                                    onChange={handleOnChange}
                                                                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                                                />
                                                            </div>
                                                        </div>
                                                        {/* size option */}
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700">
                                                                Select Size
                                                            </label>
                                                            <Select
                                                                // components={animatedComponents}
                                                                isMulti
                                                                name="sizes"
                                                                options={sizeOptionsConverted}
                                                                defaultValue={sizeDefaultOptions}
                                                                className="basic-multi-select"
                                                                classNamePrefix="select"
                                                                isClearable={true}
                                                                isLoading={false}
                                                                isSearchable={true}
                                                                closeMenuOnSelect={false}
                                                                onChange={(item) => handleSizeChange(item)}
                                                            />
                                                        </div>
                                                        {/* Select category */}
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700">
                                                                Select Category
                                                            </label>
                                                            <select
                                                                name="category"
                                                                value={formData.category}
                                                                onChange={handleOnChange}
                                                                className="mt-1  block w-full rounded-md border-gray-300 py-2  pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm border"
                                                                defaultValue="Canada">
                                                                {/* <option>-- Select Category --</option>
                  <option value="Clothings">Clothings</option>
                  <option value="Shoes">Shoes</option>
                  <option value="Accessories">Accessories</option> */}
                                                                <option>-- Select Category --</option>
                                                                {categories?.map((category) => (
                                                                    <option key={category?._id} value={category?.name}>
                                                                        {category.name}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                        {/* Select Brand */}
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700">
                                                                Select Brand
                                                            </label>
                                                            <select
                                                                name="brand"
                                                                value={formData.brand}
                                                                onChange={handleOnChange}
                                                                className="mt-1  block w-full rounded-md border-gray-300 py-2  pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm border"
                                                                defaultValue="Canada">
                                                                <option>-- Select Brand --</option>
                                                                {brands?.length > 0 && brands != null && brands?.map((brand) => (
                                                                    <option key={brand?._id} value={brand?.name}>
                                                                        {brand.name}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>

                                                        {/* Select Color */}
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700">
                                                                Select Color
                                                            </label>

                                                            <Select

                                                                components={animatedComponents}
                                                                isMulti
                                                                name="colors"
                                                                options={colorOptionsCoverted}
                                                                defaultValue={colorDefaultOptions}
                                                                className="basic-multi-select"
                                                                classNamePrefix="select"
                                                                isClearable={true}
                                                                isLoading={false}
                                                                isSearchable={true}
                                                                closeMenuOnSelect={false}
                                                                onChange={(item) => handleColorChangeOption(item)}
                                                            />
                                                        </div>

                                                        {/* upload images */}
                                                        <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                                                            <label
                                                                htmlFor="cover-photo"
                                                                className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                                                Upload Images
                                                            </label>
                                                            <div className="mt-1 sm:col-span-2 sm:mt-0">
                                                                <div className="flex max-w-lg justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
                                                                    <div className="space-y-1 text-center">
                                                                        {
                                                                            product?.images != null && product?.images?.length > 0 ? (
                                                                                product?.images?.map((image) => {
                                                                                    return <div>
                                                                                        <img src={image}></img>
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
                                                                                })
                                                                            ) : (
                                                                                <>
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
                                                                                </>
                                                                            )
                                                                        }

                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* price */}
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700">
                                                                Price
                                                            </label>
                                                            <div className="mt-1">
                                                                <input
                                                                    name="price"
                                                                    value={formData.price}
                                                                    onChange={handleOnChange}
                                                                    type="number"
                                                                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                                                />
                                                            </div>
                                                        </div>

                                                        {/* Quantity */}
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700">
                                                                Total Quantity
                                                            </label>
                                                            <div className="mt-1">
                                                                <input
                                                                    name="totalQty"
                                                                    value={formData.totalQty}
                                                                    onChange={handleOnChange}
                                                                    type="number"
                                                                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                                                />
                                                            </div>
                                                        </div>
                                                        {/* description */}
                                                        <div>
                                                            <label
                                                                htmlFor="comment"
                                                                className="block text-sm font-medium text-gray-700">
                                                                Add Product Description
                                                            </label>
                                                            <div className="mt-1">
                                                                <textarea
                                                                    rows={7}
                                                                    name="description"
                                                                    value={formData.description}
                                                                    onChange={handleOnChange}
                                                                    className="block w-full rounded-md border-gray-300 border px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div className="bg-white px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
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
                        </div >
                    </div >
                </Dialog >
            </Transition.Root >
        </>

    )
}
