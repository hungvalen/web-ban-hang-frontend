import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchCategoriesAction } from "../../redux/slices/categories/categoriesSlice";
import Skeleton from "react-loading-skeleton";
import { useTranslation } from "react-i18next";
const HomeCategories = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchCategoriesAction())
  }, [dispatch])
  const { t } = useTranslation();
  const { categories: { categories }, loading } = useSelector(state => state.category)
  const categoriesToShow = categories?.slice(0, 5);
  return (
    <>
      {
        loading ? <Skeleton className="mt-6 h-592 w-screen" /> :
          <div className="mt-6 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:grid-rows-2 sm:gap-x-6 lg:gap-8">
            <>
              <div className="group aspect-h-1 aspect-w-2 overflow-hidden rounded-lg sm:aspect-h-1 sm:aspect-w-1 sm:row-span-2">
                <img
                  src={categoriesToShow?.length > 0 && categoriesToShow[0]?.image}
                  alt=""
                  className="object-cover object-center group-hover:opacity-75"
                />
                <div aria-hidden="true" className="bg-gradient-to-b from-transparent to-black opacity-50" />
                <div className="flex items-end p-6">
                  <div>
                    <h3 className="font-semibold text-white">
                      {
                        categoriesToShow?.length > 0 && <Link to={`/products-filters?category=${categoriesToShow[0]?.name}`}>
                          <span className="absolute inset-0" />
                          {categoriesToShow[0]?.name}
                        </Link>
                      }

                    </h3>
                    <p aria-hidden="true" className="mt-1 text-sm text-white">
                      {t('buy_now')}
                    </p>
                  </div>
                </div>
              </div>
              <div className="group aspect-h-1 aspect-w-2 overflow-hidden rounded-lg sm:aspect-none sm:relative sm:h-full">
                <img
                  src={categoriesToShow?.length > 0 && categoriesToShow[1]?.image}
                  alt=""
                  className="object-cover object-center group-hover:opacity-75 sm:absolute sm:inset-0 sm:h-full sm:w-full"
                />
                <div
                  aria-hidden="true"
                  className="bg-gradient-to-b from-transparent to-black opacity-50 sm:absolute sm:inset-0"
                />
                <div className="flex items-end p-6 sm:absolute sm:inset-0">
                  <div>
                    <h3 className="font-semibold text-white">
                      {
                        categoriesToShow?.length > 0 && <Link to={`/products-filters?category=${categoriesToShow[1]?.name}`}>
                          <span className="absolute inset-0" />
                          {categoriesToShow[1]?.name}
                        </Link>
                      }

                    </h3>
                    <p aria-hidden="true" className="mt-1 text-sm text-white">
                      {t('buy_now')}
                    </p>
                  </div>
                </div>
              </div>
              <div className="group aspect-h-1 aspect-w-2 overflow-hidden rounded-lg sm:aspect-none sm:relative sm:h-full">
                <img
                  src={categoriesToShow?.length > 0 && categoriesToShow[2]?.image}
                  alt=""
                  className="object-cover object-center group-hover:opacity-75 sm:absolute sm:inset-0 sm:h-full sm:w-full"
                />
                <div
                  aria-hidden="true"
                  className="bg-gradient-to-b from-transparent to-black opacity-50 sm:absolute sm:inset-0"
                />
                <div className="flex items-end p-6 sm:absolute sm:inset-0">
                  <div>
                    <h3 className="font-semibold text-white">
                      {
                        categoriesToShow?.length > 0 && <Link to={`/products-filters?category=${categoriesToShow[2]?.name}`}>
                          <span className="absolute inset-0" />
                          {categoriesToShow[2]?.name}
                        </Link>
                      }

                    </h3>
                    <p aria-hidden="true" className="mt-1 text-sm text-white">
                      {t('buy_now')}
                    </p>
                  </div>
                </div>
              </div>
            </>



          </div >}
    </>
  );
};

export default HomeCategories;
