import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { limitNumber } from "../../../utils/limitNumber";
import { fetchBrandAction } from "../../../redux/slices/brand/brandSlice";
import { resetSuccessAction } from "../../../redux/slices/globalActions/globalAction";
import Pagination from "../../pagination/Pagination";
import LoadingComponent from "../../LoadingComp/LoadingComponent";
import ErrorMsg from "../../ErrorMsg/ErrorMsg";
import NoDataFound from "../../NoDataFound/NoDataFound";
import { fetchReviewsAction, updateStatusReviewsAction } from "../../../redux/slices/reviews/reviewSlice";

import { Switch } from '@headlessui/react'
import ReviewDetails from "./ReviewsDetails";
import DeleteReview from "./DeleteReview";

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}
export default function ManageReviews() {
    const [enabledSwitches, setEnabledSwitches] = useState([]);
    const [showReviewsDetails, setShowReviewsDetails] = useState(false);
    const [showDeleteReview, setShowDeleteReview] = useState(false);
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const { reviews, loading, error, isDeleted, isUpdated } = useSelector(state => state.reviews)
    const [query, setQuery] = useState("");
    let count = reviews?.count;
    let results = reviews?.results;
    let totalPage = query !== '' ? Math.ceil(results / limitNumber) : Math.ceil(count / limitNumber);

    const [page, setPage] = useState(1);

    const limit = 5;

    useEffect(() => {

        dispatch(fetchReviewsAction({
            page, limit, query
        }))
    }, [dispatch, page, limit, query])

    useEffect(() => {
        if (isDeleted) {
            dispatch(fetchReviewsAction({
                page, limit, query
            }));
            dispatch(resetSuccessAction());
        }
    }, [isDeleted, dispatch, page, limit, query])

    useEffect(() => {
        // Khởi tạo mảng enabledSwitches với giá trị mặc định cho mỗi đánh giá
        const initialValues = reviews?.reviews?.map((review) => review.status) || [];
        setEnabledSwitches(initialValues);
    }, [reviews?.reviews]);

    const handleSwitchChange = (index, id) => {
        // Sao chép mảng enabledSwitches để cập nhật giá trị cho từng đánh giá riêng biệt
        const updatedSwitches = [...enabledSwitches];
        updatedSwitches[index] = !updatedSwitches[index];
        setEnabledSwitches(updatedSwitches);
        // Gọi action thông qua dispatch ở đây
        dispatch(updateStatusReviewsAction({
            id,
            status: updatedSwitches[index],
            t: t('update_status_review')
        }));
    };
    const [reviewDetails, setReviewsDetails] = useState();
    const handleShowReviewDetails = (review) => {
        setShowReviewsDetails(!showReviewsDetails);
        setReviewsDetails(review);
    }
    const deleteReviewHandler = (item) => {
        setShowDeleteReview(!showDeleteReview)
        setReviewsDetails(item);
    };
    return (
        <div className="px-4 sm:px-6 lg:px-8 mt-3">
            <div className="sm:flex sm:items-center mb-2">
                <div className="sm:flex-auto">
                    <h1 className="text-xl font-semibold text-gray-900">
                        {t('manage-review')}
                    </h1>
                    {/* <p className="mt-2 text-sm text-gray-700">
                        A list of all the users in your account including their name, title,
                    </p> */}
                </div>
                <div className="flex items-center justify-end">
                    <input
                        type="search"
                        name="search"
                        placeHolder={t('search_review')}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="block appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    />
                </div>
            </div>

            {loading ? (
                <LoadingComponent />
            ) : error ? (
                <ErrorMsg message={error?.message} />
            ) : reviews?.length <= 0 ? (
                <NoDataFound />
            ) : (
                <div className="mt-4 flex flex-col">
                    <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                                <table className="min-w-full divide-y divide-gray-300">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th
                                                scope="col"
                                                className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                                {t('reviewers')}
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                {t('number_of_start')}
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                {t('product_review')}
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                {t('status')}
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                {t('created_At')}
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                {t('details')}
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                {t('delete')}
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {reviews?.reviews?.map((review, index) => (
                                            <tr key={review?._id}>
                                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                                                    <div className="font-medium text-gray-900">
                                                        {review?.user?.fullName}
                                                    </div>
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    <div className="text-gray-900">
                                                        {review?.rating}
                                                    </div>
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
                                                        {review?.product?.name ?? ''}
                                                    </span>
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    {/* {new Date(review?.createdAt).toLocaleDateString()} */}
                                                    <Switch
                                                        checked={enabledSwitches[index]}
                                                        onChange={() => handleSwitchChange(index, review?._id)}
                                                        className={classNames(
                                                            enabledSwitches[index] ? 'bg-indigo-600' : 'bg-gray-200',
                                                            'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2'
                                                        )}
                                                    >
                                                        <span className="sr-only">Use setting</span>
                                                        <span
                                                            aria-hidden="true"
                                                            className={classNames(
                                                                enabledSwitches[index] ? 'translate-x-5' : 'translate-x-0',
                                                                'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                                                            )}
                                                        />
                                                    </Switch>
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    {new Date(review?.createdAt).toLocaleDateString()}
                                                </td>
                                                {/* edit icon */}
                                                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-left text-sm font-medium sm:pr-6">
                                                    <button
                                                        onClick={() => handleShowReviewDetails(review)}
                                                        type="button"
                                                        className="text-indigo-600 hover:text-indigo-900">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-info-circle" viewBox="0 0 16 16">
                                                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                                                            <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
                                                        </svg>
                                                        {/* <span className="sr-only">, {category?.name}</span> */}
                                                    </button>
                                                </td>
                                                {/* delete icon */}
                                                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-left text-sm font-medium sm:pr-6">
                                                    <button
                                                        onClick={() => deleteReviewHandler(review)}
                                                        className="text-rose-600 hover:text-indigo-900">
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            strokeWidth="1.5"
                                                            stroke="currentColor"
                                                            className="w-6 h-6">
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                                            />
                                                        </svg>
                                                    </button>
                                                </td>
                                            </tr>

                                        ))
                                        }
                                    </tbody>
                                </table>
                                <Pagination page={page} pages={totalPage} changePage={setPage} />
                            </div>
                        </div>
                    </div>

                </div>

            )}

            {
                showReviewsDetails && <ReviewDetails showReviewsDetails={showReviewsDetails} setShowReviewsDetails={setShowReviewsDetails} review={reviewDetails} />
            }
            {
                showDeleteReview && <DeleteReview showDeleteReview={showDeleteReview} setShowDeleteReview={setShowDeleteReview} review={reviewDetails} />
            }
        </div>
    );
}
