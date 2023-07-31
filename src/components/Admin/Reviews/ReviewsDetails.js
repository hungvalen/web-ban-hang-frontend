import { Fragment, useRef } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

export default function ReviewDetails({ showReviewsDetails, setShowReviewsDetails, review }) {
    const cancelButtonRef = useRef(null);
    const {t} = useTranslation()
    return (
        <Transition.Root show={showReviewsDetails ?? false} as={Fragment}>
        <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={setShowReviewsDetails ?? false}>
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
                                    <div className="space-y-6">
                                        <div className="border-b border-gray-900/10 pb-2">
                                            <h2 className="text-base font-semibold leading-7 text-gray-900">{t('details_review')}</h2>
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
                                                  
                                                </div>
                                                <div className="sm:col-span-6">
                                                    <label className="block text-sm font-medium text-gray-700">
                                                        Email
                                                    </label>
                                                    
                                                </div>
                                               

                                            </div>

                                        </div>
                                    </div>

                                    <div className="mt-6 flex items-center justify-end gap-x-6">
                                        <button type="button" className="text-sm font-semibold leading-6 text-gray-900" onClick={() => setShowReviewsDetails(!showReviewsDetails)}
                                            ref={cancelButtonRef}>
                                            {t('close')}
                                        </button>
                                      
                                    </div>
                            </div>
                            </div>
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </div>
        </Dialog>
    </Transition.Root >
    )
}
