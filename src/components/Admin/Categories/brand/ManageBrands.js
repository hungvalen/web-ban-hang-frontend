import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBrandAction } from "../../../../redux/slices/brand/brandSlice";
import LoadingComponent from "../../../LoadingComp/LoadingComponent";
import ErrorMsg from "../../../ErrorMsg/ErrorMsg";
import NoDataFound from "../../../NoDataFound/NoDataFound";
import { limitNumber } from "../../../../utils/limitNumber";
import Pagination from "../../../pagination/Pagination";
import AddBrand from "./modal/AddBrand";
import EditBrand from "./modal/EditBrand";
import DeleteBrandModal from "./modal/DeleteBrand";
import { resetSuccessAction } from "../../../../redux/slices/globalActions/globalAction";
import { useTranslation } from "react-i18next";


export default function ManageBrands() {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const { brands, loading, error, isAdded, isDeleted, isUpdated } = useSelector(state => state.brand)
    const [query, setQuery] = useState("");
    let count = brands?.count;
    let results = brands?.results;
    let totalPage = query !== '' ? Math.ceil(results / limitNumber) : Math.ceil(count / limitNumber);
    const [isShowEditBrandModal, setIsShowEditBrandModal] = useState(false);
    const [isShowAddBrandModal, setIsShowAddBrandModal] = useState(false);
    const [isShowDeleteBrandModal, setIsShowDeleteBrandModal] = useState(false);
    const [brand, setBrand] = useState('');
    const [page, setPage] = useState(1);

    const limit = 5;
    //delete brand handler
    const deleteBrandHandler = (item) => {
        setIsShowDeleteBrandModal(!isShowDeleteBrandModal)
        setBrand(item);
    };
    useEffect(() => {
        dispatch(fetchBrandAction({
            page, limit, query
        }))
    }, [dispatch, page, limit, query])

    const handleEditBrand = (item) => {
        setIsShowEditBrandModal(!isShowEditBrandModal);
        setBrand(item);
    }
    const handleAddBrand = () => {
        setIsShowAddBrandModal(!isShowAddBrandModal);
    }

    useEffect(() => {
        if (isAdded) {
            dispatch(fetchBrandAction({
                page, limit
            }));
            dispatch(resetSuccessAction());
        }

    }, [isAdded, dispatch, page, limit])

    useEffect(() => {
        if (isUpdated) {
            dispatch(fetchBrandAction({
                page, limit
            }));
            dispatch(resetSuccessAction());

        }
    }, [isUpdated, dispatch, page, limit])

    useEffect(() => {
        if (isDeleted) {
            dispatch(fetchBrandAction({
                page, limit
            }));
            dispatch(resetSuccessAction());
        }
    }, [isDeleted, dispatch, page, limit])
    return (
        <div className="px-4 sm:px-6 lg:px-8 mt-3">
            <div className="sm:flex sm:items-center mb-2">
                <div className="sm:flex-auto">
                    <h1 className="text-xl font-semibold text-gray-900">
                        Manage supplier
                    </h1>
                    {/* <p className="mt-2 text-sm text-gray-700">
                        A list of all the users in your account including their name, title,
                    </p> */}
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                    <button
                        onClick={handleAddBrand}
                        type="button"
                        className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto">
                        Add New Brand
                    </button>
                </div>
            </div>
            <div className="flex items-center justify-end">
                <input
                    type="search"
                    name="search"
                    placeHolder="Search brand"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="block appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                />
            </div>
            {loading ? (
                <LoadingComponent />
            ) : error ? (
                <ErrorMsg message={error?.message} />
            ) : brands?.length <= 0 ? (
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
                                                Name
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                No. Products
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                Added By
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                Created At
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                Edit
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                Delete
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {brands?.brands?.map((brand) => (
                                            <tr key={brand?._id}>
                                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                                                    <div className="font-medium text-gray-900">
                                                        {brand?.name}
                                                    </div>
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    <div className="text-gray-900">
                                                        {brand?.products?.length}
                                                    </div>
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
                                                        {brand?.user?.fullName ?? 'admin'}
                                                    </span>
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    {new Date(brand?.createdAt).toLocaleDateString()}
                                                </td>
                                                {/* edit icon */}
                                                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-left text-sm font-medium sm:pr-6">
                                                    <button
                                                        onClick={() => handleEditBrand(brand)}
                                                        type="button"
                                                        className="text-indigo-600 hover:text-indigo-900">
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
                                                                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                                                            />
                                                        </svg>
                                                        {/* <span className="sr-only">, {category?.name}</span> */}
                                                    </button>
                                                </td>
                                                {/* delete icon */}
                                                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-left text-sm font-medium sm:pr-6">
                                                    <button
                                                        onClick={() => deleteBrandHandler(brand)}
                                                        className="text-indigo-600 hover:text-indigo-900">
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
                isShowEditBrandModal && <EditBrand isShowEditBrandModal={isShowEditBrandModal} setIsShowEditBrandModal={setIsShowEditBrandModal} brand={brand} />
            }
            {
                isShowAddBrandModal && <AddBrand isShowAddBrandModal={isShowAddBrandModal} setIsShowAddBrandModal={setIsShowAddBrandModal} />
            }
            {
                isShowDeleteBrandModal && <DeleteBrandModal isShowDeleteBrandModal={isShowDeleteBrandModal} setIsShowDeleteBrandModal={setIsShowDeleteBrandModal} brand={brand} />
            }
        </div>
    );
}
