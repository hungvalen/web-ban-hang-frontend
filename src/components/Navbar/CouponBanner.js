import { XMarkIcon } from '@heroicons/react/20/solid'
import { useEffect } from 'react'
import { fetchCouponsAction } from '../../redux/slices/coupons/couponSlice'
import { useDispatch, useSelector } from 'react-redux'

export default function CouponBanner() {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(fetchCouponsAction())
    }, [dispatch])

    const { coupons, loading, error } = useSelector((state) => state?.coupons)
    // get currentCoupon 
    const currentCoupon = coupons ? coupons?.coupons?.filter((item) => item.isExpired === false) : coupons?.coupons[coupons?.coupons?.length - 1]
    console.log(currentCoupon)
        ; return (
            <>
                {
                    loading ? <div>Loading...</div> :
                        <div className="flex items-center gap-x-6 bg-indigo-600 px-6 py-2.5 sm:px-3.5 sm:before:flex-1">
                            <p className="text-sm leading-6 text-white">
                                <a href="#">
                                    <strong className="font-semibold">{
                                        currentCoupon ? `Limited time only best sale upto ${currentCoupon[0]?.discount}% off. Use coupon code ${currentCoupon[0]?.code} and get additional discount ${currentCoupon[0]?.daysLeft} day left` : "No flash sale at moment"
                                    }</strong>
                                    <svg viewBox="0 0 2 2" className="mx-2 inline h-0.5 w-0.5 fill-current" aria-hidden="true">
                                        <circle cx={1} cy={1} r={1} />
                                    </svg>
                                    {/* Join us in Denver from June 7 – 9 to see what’s coming next&nbsp;<span aria-hidden="true">&rarr;</span> */}
                                </a>
                            </p>
                            <div className="flex flex-1 justify-end">
                                <button type="button" className="-m-3 p-3 focus-visible:outline-offset-[-4px]">
                                    <span className="sr-only">Dismiss</span>
                                    <XMarkIcon className="h-5 w-5 text-white" aria-hidden="true" />
                                </button>
                            </div>
                        </div>
                }
            </>
        )
}
