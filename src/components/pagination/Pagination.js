import React, { useEffect, useState } from 'react'
import PageNumber from './PageNumber';
import { useSelector } from 'react-redux';
// import icons from '../../ultils/icons';
import { useSearchParams } from 'react-router-dom';
import { GrNext, GrStar, GrLinkNext, GrLinkPrevious } from 'react-icons/gr';

const Pagination = ({count}) => {
    const { products } = useSelector(state => state.product)
    // console.log(products)
    // const count = products?.count;
    const [arrPage, setArrPage] = useState([]);
    const [currentPage, setCurrentPage] = useState(1); // page undefined => 1
    const [isHideEnd, setIsHideEnd] = useState(false);
    const [isHideStart, setIsHideStart] = useState(false);
    const [searchParams] = useSearchParams();
    const limitProducts = 5;
    useEffect(() => {
        let page = searchParams.get('page');
        page && +page !== currentPage && setCurrentPage(+page)
        !page && setCurrentPage(1)

    }, [searchParams])

    console.log(currentPage);
    // const handlePageNumber = () => {
    //     let max = Math.floor(count / posts.length) // vd: 20/5 = 4 trang
    //     let arrNumber = [];
    //     for (let i = 1; i <= max; i++)
    //         arrNumber.push(i)

    //     return arrNumber.length > 4 ? arrNumber.filter(i => i < 5) : arrNumber
    // }
    // console.log(handlePageNumber())

    useEffect(() => {
        let maxPage = Math.ceil(count / limitProducts) // vd: 20/5 = 4 trang
        // console.log('maxPage: ', +maxPage);
        let end = (currentPage + 2) > maxPage ? maxPage : (currentPage + 2);
        // console.log('end', end);
        let start = (currentPage - 2) <= 0 ? 1 : (currentPage - 2); // lấy start từ 2
        // console.log('start', start);
        let temp = [];
        for (let i = start; i <= end; i++) {
            temp.push(i);
            setArrPage(temp)
        }
        currentPage >= (maxPage - 1) ? setIsHideEnd(true) : setIsHideEnd(false)
        currentPage <= 3 ? setIsHideStart(true) : setIsHideStart(false)
    }, [count, currentPage]) // count thay đổi thì cập nhật lại maxPage
    // console.log(arrPage)
    return (
        <>
            <div className="flex items-center justify-between">
                <div className="ml-4">
                    <p className="text-sm text-gray-700">
                        Showing <span className="font-medium">{currentPage}</span> to <span className="font-medium">{limitProducts}</span> of{' '}
                        <span className="font-medium">{count}</span> results
                    </p>
                </div>
                <div className="flex items-center justify-end gap-2 py-5 mr-3">
                    {!isHideStart && <PageNumber
                        setCurrentPage={setCurrentPage}
                        text={1}
                    />}
                    {(!isHideStart && currentPage !== 3) && <PageNumber

                        text={'...'}
                    />}

                    {arrPage.length > 0 && arrPage.map((item) => {
                        return (
                            <PageNumber
                                key={item}
                                text={item}
                                setCurrentPage={setCurrentPage}
                                currentPage={currentPage}
                            />
                        )
                    })}
                    {!isHideEnd && <PageNumber

                        text={'...'}
                    />}

                    {!isHideEnd && <PageNumber

                        icon={<GrLinkNext />}
                        setCurrentPage={setCurrentPage}
                        text={Math.floor(count / products.length)}

                    />}
                </div>
            </div>

        </>

    )
}

export default Pagination