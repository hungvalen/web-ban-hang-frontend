import { Fragment, useRef } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { StarIcon } from '@heroicons/react/20/solid';
function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}
export default function ReviewDetails({ showReviewsDetails, setShowReviewsDetails, review }) {
    console.log(review);
    const cancelButtonRef = useRef(null);
    const { t } = useTranslation()
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
                                                        {t('review')}
                                                    </label>
                                                    <div className="mt-1">
                                                        {review.rating > 0 ? (
                                                            <div
                                                                key={review._id}
                                                                className="flex flex-col">
                                                                <div className="lg:col-span-8 lg:col-start-5 xl:col-span-9 xl:col-start-4 xl:grid xl:grid-cols-3 xl:items-start xl:gap-x-8">
                                                                    <div className="flex items-center xl:col-span-1">
                                                                        <div className="flex items-center">
                                                                            {[0, 1, 2, 3, 4].map((rating) => (
                                                                                <StarIcon
                                                                                    key={rating}
                                                                                    className={classNames(
                                                                                        review.rating > rating
                                                                                            ? "text-yellow-400"
                                                                                            : "text-gray-200",
                                                                                        "h-5 w-5 flex-shrink-0"
                                                                                    )}
                                                                                    aria-hidden="true"
                                                                                />
                                                                            ))}
                                                                        </div>
                                                                        <p className="ml-3 text-sm text-gray-700">
                                                                            {review?.rating}
                                                                            <span className="sr-only"> out of 5 stars</span>
                                                                        </p>
                                                                    </div>


                                                                </div>
                                                                <label className="mt-4 block text-sm font-medium text-gray-700">
                                                                    {t('feedback')}
                                                                </label>
                                                                <div className="mt-4 lg:mt-6 xl:col-span-2 xl:mt-0">
                                                                    <p className="text-sm ">
                                                                        {review?.message}
                                                                    </p>

                                                                    <div
                                                                        className="mt-3 space-y-6 text-sm text-gray-500"
                                                                        dangerouslySetInnerHTML={{ __html: review.content }}
                                                                    />
                                                                </div>

                                                            </div>

                                                        ) : <p className="font-medium text-gray-900 ">{t('no_review_found')}</p>}
                                                    </div>

                                                </div>

                                            </div>
                                        </div>

                                        <div className="mt-6 flex items-center justify-end gap-x-6">
                                            <button type="button" className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 sm:ml-3 sm:w-auto"
                                                onClick={() => setShowReviewsDetails(!showReviewsDetails)}
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
