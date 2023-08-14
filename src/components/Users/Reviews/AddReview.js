import { Fragment, useRef, useState, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { StarIcon } from '@heroicons/react/20/solid';
import { createReviewAction } from "../../../redux/slices/reviews/reviewSlice";

import DatePicker from "react-datepicker";
import { useTranslation } from 'react-i18next';
import SweetAlert from '../../Playground/SweetAlert';

//animated components for react-select
const animatedComponents = makeAnimated();
export default function AddReviewModal({ showAddReviewModal, setShowAddReviewModal, productId }) {
  const cancelButtonRef = useRef(null)
  const [currentValue, setCurrentValue] = useState(5);
  const [hoverValue, setHoverValue] = useState(undefined);
  const stars = Array(5).fill(0)
  const colors = {
    orange: "#FFBA5A",
    grey: "#a9a9a9"

  };
  const { t } = useTranslation();

  const handleClick = value => {
    setCurrentValue(value)
  }

  const handleMouseOver = newHoverValue => {
    setHoverValue(newHoverValue)
  };

  const handleMouseLeave = () => {
    setHoverValue(undefined)
  }
  const dispatch = useDispatch();
  //---form data---
  const [formData, setFormData] = useState({
    message: "",
    title:""
  });
  //onChange
  const handleOnChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  //onSubmit
  const handleOnSubmit = (e) => {
    e.preventDefault();
    if(!formData?.message.trim()){
        SweetAlert({ icon: "error", title: "Error", message: 'Nội dung không được để trống' });

    }
    else{
      dispatch(createReviewAction({
        id: productId,
        message: formData.message,
        rating: currentValue
      }))
      setShowAddReviewModal(!showAddReviewModal)

    }
   
  };

  return (
    <>
      <Transition.Root show={showAddReviewModal ?? false} as={Fragment}>
        <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={setShowAddReviewModal ?? false}>
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
                          <h2 className="text-base font-semibold leading-7 text-gray-900">{t('add_review')}</h2>
                        </div>

                        <div className="border-b border-gray-900/10 pb-7">
                          {/* <h2 className="text-base font-semibold leading-7 text-gray-900">Personal Information</h2> */}
                          {/* <p className="mt-1 text-sm leading-6 text-gray-600">Use a permanent address where you can receive mail.</p> */}

                          <div className="mt-2 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                            <div className="sm:col-span-3">
                              {/* <label className="block text-sm font-medium text-gray-700">
                                User Name
                              </label>
                              <div className="mt-1">
                                <input
                                  name="fullName"
                                  value={formData?.fullName}
                                  onChange={handleOnChange}
                                  className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                />
                              </div> */}
                              <label
                                htmlFor="location"
                                className="block text-sm font-medium text-gray-700">
                                {t('rating')}
                              </label>
                              <div className="flex items-center justify-center">
                                {stars.map((_, index) => {
                                  return (
                                    <StarIcon
                                      key={index}
                                      size={12}
                                      onClick={() => handleClick(index + 1)}
                                      onMouseOver={() => handleMouseOver(index + 1)}
                                      onMouseLeave={handleMouseLeave}
                                      color={(hoverValue || currentValue) > index ? colors.orange : colors.grey}
                                      style={{
                                        marginRight: 10,
                                        cursor: "pointer"
                                      }}
                                    />
                                  )
                                })}
                              </div>
                              {/* <select
                                value={formData.rating}
                                onChange={handleOnChange}
                                name="rating"
                                className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 border-2 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                defaultValue="Canada">

                                <option value="1">1</option>
                                <option value="1.5">1.5</option>
                                <option value="2">2</option>
                                <option value="2.5">2.5</option>
                                <option value="3">3</option>
                                <option value="3.5">3.5</option>
                                <option value="4">4</option>
                                <option value="4.5">4.5</option>
                                <option value="5">5 </option>
                              </select> */}
                            </div>
                            {/* <div className="sm:col-span-full">
                              <label className="block text-sm font-medium text-gray-700">
                                {t('title')}
                              </label>
                              <div className="mt-1">
                                <input
                                  type="text"
                                  name="title"
                                  required
                                  value={formData.title}
                                  onChange={handleOnChange}
                                  className="block w-full rounded-md p-2 border-gray-300 border shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                              </div>
                            </div> */}
                            <div className="sm:col-span-full">
                              <label className="block text-sm font-medium text-gray-700">
                                {t('message')}
                              </label>
                              <div className="mt-1">
                                <textarea
                                  rows={4}
                                  name="message"
                                  required
                                  value={formData.message}
                                  onChange={handleOnChange}
                                  className="block w-full rounded-md p-2 border-gray-300 border shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                              </div>
                            </div>

                          </div>
                        </div>
                      </div>

                      <div className="mt-6 flex items-center justify-end gap-x-6">
                        <button type="button" className="text-sm font-semibold leading-6 text-gray-900" onClick={() => setShowAddReviewModal(!showAddReviewModal)}
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
          </div >
        </Dialog >
      </Transition.Root >
    </>

  )
}
