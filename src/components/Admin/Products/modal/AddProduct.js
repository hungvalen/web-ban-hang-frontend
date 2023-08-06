import { useEffect, useState, useRef, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { Dialog, Transition } from '@headlessui/react'
import ErrorMsg from "../../../ErrorMsg/ErrorMsg";
import { fetchCategoriesAction } from "../../../../redux/slices/categories/categoriesSlice";
import { fetchBrandAction } from "../../../../redux/slices/brand/brandSlice";
import { fetchColorAction } from "../../../../redux/slices/color/colorSlice";
import { createProductAction } from "../../../../redux/slices/products/productSlices";
import Swal from "sweetalert2";
import SweetAlert from "../../../Playground/SweetAlert";
import { useNavigate } from "react-router-dom";
import { resetSuccessAction } from "../../../../redux/slices/globalActions/globalAction";
import { XMarkIcon } from '@heroicons/react/24/outline'
import { TrashIcon, XCircleIcon } from "@heroicons/react/24/solid";
import { convertDataURIToFile, convertLinkToFile } from "../../../../utils/handleFileImage";
import Editor from "../../../Editor/Editor";
import { useTranslation } from "react-i18next";

//animated components for react-select
const animatedComponents = makeAnimated();

export default function AddProduct({ isShowAddProductModal, setIsShowAddProductModal }) {
  const cancelButtonRef = useRef(null)
  const { t } = useTranslation();

  const navigate = useNavigate();
  const dispatch = useDispatch();
  // files
  const [files, setFiles] = useState([]);
  const [fileArr, setFileArr] = useState([]);
  const [fileErrs, setFileErrs] = useState([]);
  const [message, setMessage] = useState();
  const fileHandleChange = (e) => {
    const files = e.target.files;
    const imagePromises = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();

      const imagePromise = new Promise((resolve) => {
        reader.onload = () => {
          resolve(reader.result);
        };
      });

      reader.readAsDataURL(file);
      imagePromises.push(imagePromise);
    }

    Promise.all(imagePromises).then((results) => {
      setFiles(prev => prev.concat(results));
      setFileArr(prev => prev.concat(results));
    });
  }

  const removeImage = (e) => {

    const s = files.filter((item, index) => index !== e);
    setFiles(s);
    setFileArr(s);
  }
  // console.log(files);
  const convertArrayToFiles = async (dataArray) => {
    const promises = dataArray.map((data, index) => {
      const isDataURI = /^data:image\/jpeg;base64/.test(data);
      if (isDataURI) {
        return convertDataURIToFile(data, `image_${index}.jpg`);
      } else {
        return convertLinkToFile(data, `image_${index}.jpg`);
      }
    });

    const files = await Promise.all(promises);
    setFileArr(files);
  };
  useEffect(() => {
    // Example usage

    convertArrayToFiles(fileArr);
  }, [files]);
  // Sizes
  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
  const [sizeOption, setSizeOption] = useState([]);
  const [colorOption, setColorOption] = useState([]);
  useEffect(() => {
    dispatch(fetchCategoriesAction());
    dispatch(fetchBrandAction({
      page: 1,
      limit: 100,
      query: ''
    }));
    dispatch(fetchColorAction());

  }, [dispatch])

  const { colors } = useSelector(state => state.color)
  const { categories } = useSelector(state => state.category.categories)
  const { product, isAdded, error, loading } = useSelector(state => state.product)
  const handleSizeChange = (sizes) => {
    setErrorInput({ ...errorInput, sizeError: sizes?.length > 0 ? '' : 'Vui lòng chọn kích cỡ' });
    setSizeOption(sizes);
  }

  const handleColorChangeOption = (colors) => {
    setErrorInput({ ...errorInput, colorError: colors?.length > 0 ? '' : 'Vui lòng chọn màu sắc.' });
    setColorOption(colors);
  }

  // converted sizes
  const sizeOptionsConverted = sizes?.map((size) => {
    return {
      value: size,
      label: size
    }
  })

  console.log(categories)
  // converted color
  const colorOptionsCoverted = colors?.colors?.map((color) => {
    return {
      value: color?.name,
      label: color?.name
    }
  });
  const { brands } = useSelector(state => state.brand.brands)

  //---form data---
  const [formData, setFormData] = useState({
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
  const [errorInput, setErrorInput] = useState({
    nameError: '',
    descriptionError: '',
    categoryError: '',
    colorError: '',
    imagesError: '',
    priceError: '',
    totalQtyError: '',
    sizeError: '',
    brandError: '',
  });

  const { nameError,
    descriptionError,
    categoryError,
    colorError,
    imagesError,
    priceError,
    totalQtyError,
    sizeError,
    brandError, } = errorInput
  const { name, description, category, brand, color, images, price, totalQty } = formData;

  //onChange
  const handleOnChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleProductNameChange = (event) => {
    const input = event.target.value;

    setErrorInput({ ...errorInput, nameError: input.trim() ? '' : 'Vui lòng nhập tên sản phẩm.' });
    setFormData({ ...formData, name: input });
  }
  const handleCategoryChange = (event) => {
    const input = event.target.value;

    setErrorInput({ ...errorInput, categoryError: input.trim() ? '' : 'Vui lòng chọn thể loại.' });
    setFormData({ ...formData, category: input });
  }
  const handleBrandChange = (event) => {
    const input = event.target.value;

    setErrorInput({ ...errorInput, brandError: input.trim() ? '' : 'Vui lòng chọn thương hiệu' });
    setFormData({ ...formData, brand: input });
  }

  const handlePriceChange = (event) => {
    const input = event.target.value;

    setErrorInput({ ...errorInput, priceError: input.trim() ? '' : 'Vui lòng nhập giá sản phẩm.' });
    setFormData({ ...formData, price: input });
  }
  const handleTotalQtyChange = (event) => {
    const input = event.target.value;

    setErrorInput({ ...errorInput, totalQtyError: input.trim() ? '' : 'Vui lòng nhập số lượng sản phẩm' });
    setFormData({ ...formData, totalQty: input });
  }
  //onSubmit
  const handleOnSubmit = (e) => {
    e.preventDefault();
    let isValidForm = true;
    if (!name.trim() || !description.trim() || !category.trim() || !price.trim() || !totalQty.trim() || !brand.trim() || colorOption.length === 0 || sizeOption.length === 0 || files?.length === 0) {
      setErrorInput({
        nameError: !name.trim() ? 'Vui lòng nhập tên sản phẩm.' : '',
        descriptionError: !description.trim() ? 'Vui lòng nhập mô tả.' : '',
        categoryError: !category.trim() ? 'Vui lòng chọn thể loại.' : '',
        colorError: colorOption.length === 0 ? 'Vui lòng chọn màu sắc.' : '',
        sizeError: sizeOption.length === 0 ? 'Vui lòng chọn kích cỡ' : '',
        imagesError: files?.length === 0 ? 'Vui lòng tải hình ảnh.' : '',
        priceError: !price.trim() ? 'Vui lòng nhập giá sản phẩm.' : '',
        totalQtyError: !totalQty.trim() ? 'Vui lòng nhập số lượng sản phẩm' : '',
        brandError: !brand.trim() ? 'Vui lòng chọn thương hiệu' : '',
      });
      return;
    }
    else {
      setErrorInput({});
      isValidForm = true;
    }

    if (isValidForm) {
      dispatch(createProductAction({
        ...formData,
        files,
        colors: colorOption?.map((color) => color?.value),
        sizes: sizeOption?.map((size) => size?.value)
      }))
      dispatch(resetSuccessAction());
      // setFormData({ email: '', password: '', });
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
      setFileErrs([]);
      setIsShowAddProductModal(false);
    }

    // navigate("/admin/manage-products");
    // console.log(fileErrs)
    // reset form data



  };

  const handleEditorChange = (data) => {
    setFormData({ ...formData, description: data })
    setErrorInput({ ...errorInput, descriptionError: data.trim() ? '' : 'Vui lòng nhập mô tả.' });

  }
  return (
    <>
      {error && <ErrorMsg message={error?.message} />}
      {fileErrs?.length > 0 && (
        <SweetAlert icon="error" title="Error" message={fileErrs} />
      )}
      <Transition.Root show={isShowAddProductModal ?? false} as={Fragment}>
        <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={setIsShowAddProductModal ?? false}>
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
                          <h2 className="text-base font-semibold leading-7 text-gray-900">{t('add_product')}</h2>
                        </div>

                        <div className="border-b border-gray-900/10 pb-7">
                          {/* <h2 className="text-base font-semibold leading-7 text-gray-900">Personal Information</h2> */}
                          {/* <p className="mt-1 text-sm leading-6 text-gray-600">Use a permanent address where you can receive mail.</p> */}

                          <div className="mt-2 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                            <div className="sm:col-span-3">
                              <label className="block text-sm font-medium text-gray-700">
                                {t('product_name')}
                              </label>
                              <div className="mt-1">
                                <input
                                  name="name"
                                  value={name}
                                  onChange={handleProductNameChange}
                                  className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                />
                              </div>
                              {nameError && <p className="text-red-500 text-sm mt-1 leading-6">{nameError}</p>}

                            </div>
                            <div className="sm:col-span-3">
                              <label className="block text-sm font-medium text-gray-700">
                                {t('select_size')}
                              </label>
                              <Select
                                // components={animatedComponents}
                                isMulti
                                name="sizes"
                                options={sizeOptionsConverted}
                                className="basic-multi-select mt-1"
                                classNamePrefix="select"
                                isClearable={true}
                                isLoading={false}
                                isSearchable={true}
                                closeMenuOnSelect={false}
                                onChange={(item) => handleSizeChange(item)}
                              />
                              {sizeError && <p className="text-red-500 text-sm mt-1 leading-6">{sizeError}</p>}

                            </div>
                            <div className="sm:col-span-3">
                              <label className="block text-sm font-medium text-gray-700">
                                {t('select_category')}
                              </label>
                              <select
                                name="category"
                                value={category}
                                onChange={handleCategoryChange}
                                className="mt-1  block w-full rounded-md border-gray-300 py-2  pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm border"
                                defaultValue="Canada">
                                <option>-- Select Category --</option>
                                {categories?.map((category) => (
                                  <option key={category?._id} value={category?.name}>
                                    {category.name}
                                  </option>
                                ))}
                              </select>
                              {categoryError && <p className="text-red-500 text-sm mt-1 leading-6">{categoryError}</p>}

                            </div>
                            <div className="sm:col-span-3">
                              <label className="block text-sm font-medium text-gray-700">
                                {t('select_brand')}
                              </label>
                              <select
                                name="brand"
                                value={brand}
                                onChange={handleBrandChange}
                                className="mt-1  block w-full rounded-md border-gray-300 py-2  pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm border"
                                defaultValue="Canada">
                                <option>-- Select Brand --</option>
                                {brands?.length > 0 && brands != null && brands?.map((brand) => (
                                  <option key={brand?._id} value={brand?.name}>
                                    {brand.name}
                                  </option>
                                ))}
                              </select>
                              {brandError && <p className="text-red-500 text-sm mt-1 leading-6">{brandError}</p>}

                            </div>
                            <div className="sm:col-span-3">
                              <label className="block text-sm font-medium text-gray-700">
                                {t('select_color')}
                              </label>
                              <Select
                                components={animatedComponents}
                                isMulti
                                name="colors"
                                options={colorOptionsCoverted}
                                className="basic-multi-select mt-1"
                                classNamePrefix="select"
                                isClearable={true}
                                isLoading={false}
                                isSearchable={true}
                                closeMenuOnSelect={false}
                                onChange={(item) => handleColorChangeOption(item)}
                              />
                              {colorError && <p className="text-red-500 text-sm mt-1 leading-6">{colorError}</p>}

                            </div>
                            <div className="sm:col-span-3">
                              <label className="block text-sm font-medium text-gray-700">
                                {t('price')}
                              </label>
                              <div className="mt-1">
                                <input
                                  name="price"
                                  value={price}
                                  onChange={handlePriceChange}
                                  type="number"
                                  className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                />
                              </div>
                              {priceError && <p className="text-red-500 text-sm mt-1 leading-6">{priceError}</p>}

                            </div>
                            <div className="sm:col-span-6 sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                              <label
                                htmlFor="cover-photo"
                                className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                {t('upload_images')}
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
                                        <span>{t('upload_files')}</span>
                                        <input
                                          multiple
                                          onChange={fileHandleChange}
                                          type="file"
                                          name="files"
                                        />
                                      </label>
                                    </div>
                                    <p className="text-xs text-gray-500">
                                      PNG, JPG, GIF {t('upto')} 10MB
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="sm:col-span-6">
                              <div className="flex items-center justify-center flex-wrap gap-2 mt-2">
                                {files.map((file, index) => {
                                  return (<div key={index} className="overflow-hidden relative">
                                    <XCircleIcon onClick={() => { removeImage(index) }} className="h-10 w-10 absolute right-1 top-1 text-white cursor-pointer" />
                                    <img src={file} alt="" className="h-56 w-56 rounded-md object-cover object-center" />
                                  </div>)
                                })
                                }
                              </div>

                            </div>
                            <div className="sm:col-span-6">
                              <label className="block text-sm font-medium text-gray-700">
                                {t('total_quantity')}
                              </label>
                              <div className="mt-1">
                                <input
                                  name="totalQty"
                                  value={totalQty}
                                  onChange={handleTotalQtyChange}
                                  type="number"
                                  className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                />
                              </div>
                              {totalQtyError && <p className="text-red-500 text-sm mt-1 leading-6">{totalQtyError}</p>}

                            </div>
                            <div className="sm:col-span-6">
                              <label
                                htmlFor="comment"
                                className="block text-sm font-medium text-gray-700">
                                {t('product_desc')}
                              </label>
                              <div className="mt-1">
                                {/* <textarea
                                  rows={5}
                                  name="description"
                                  value={formData.description}
                                  onChange={handleOnChange}
                                  className="block w-full rounded-md border-gray-300 border px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                /> */}
                                <Editor value={description} onChange={handleEditorChange} />

                              </div>
                              {descriptionError && <p className="text-red-500 text-sm mt-1 leading-6">{descriptionError}</p>}
                            </div>

                          </div>
                        </div>
                      </div>

                      <div className="mt-6 flex items-center justify-end gap-x-6">
                        <button type="button" className="text-sm font-semibold leading-6 text-gray-900"
                          ref={cancelButtonRef}
                          onClick={() => setIsShowAddProductModal(false)}
                        >
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
  );
}
