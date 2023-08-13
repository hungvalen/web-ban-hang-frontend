import React, { useEffect } from 'react'
import { useTranslation } from '../../hooks/useTranslation'
import { useDispatch, useSelector } from 'react-redux';
import { fetchBrandAction } from '../../redux/slices/brand/brandSlice';
import { Link } from 'react-router-dom';
import LoadingComponent from '../LoadingComp/LoadingComponent';

const HomeBrand = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(fetchBrandAction({ page: 1, limit: 6, query: '' }))
    }, [dispatch])
    const { brands: { brands }, loading } = useSelector(state => state.brand)
    function limitText(text, limit) {
        if (text.length <= limit) {
            return text;
        } else {
            return text.slice(0, limit) + '...';
        }
    }
    return (
        <>
            {loading ? <LoadingComponent /> : <section aria-labelledby="collections-heading" className="bg-gray-100">
                <div className="mx-auto max-w-7xl px-4 py- sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl py-16 sm:py-24 lg:max-w-none lg:py-32">
                        <h2 id="collections-heading" className="text-2xl font-bold text-gray-900">
                            {t('brand')}
                        </h2>

                        <div className="mt-6 space-y-12 lg:grid lg:grid-cols-3 lg:gap-6 lg:space-y-0">
                            {brands?.map((collection, index) => (
                                <div key={index} className="group relative">
                                    <div className="relative h-80 w-full overflow-hidden rounded-lg bg-white sm:aspect-h-1 sm:aspect-w-2 lg:aspect-h-1 lg:aspect-w-1 group-hover:opacity-75 sm:h-64">
                                        <img
                                            src={collection?.image}
                                            alt={collection?.name}
                                            className="h-full w-full object-cover object-center"
                                        />
                                    </div>
                                    <h3 className="mt-6 text-base font-semibold text-gray-900">
                                        <Link to={`/products-filters?category=&brand=${collection?.name}`}>
                                            <span className="absolute inset-0" />
                                            {collection?.name}
                                        </Link>
                                    </h3>
                                    <p className="text-sm  text-gray-500">{limitText(collection?.description, 200)}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>}
        </>
    )
}

export default HomeBrand