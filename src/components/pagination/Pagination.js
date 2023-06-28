// import React, { useEffect, useState } from 'react'
// import PageNumber from './PageNumber';
// import { useSelector } from 'react-redux';
// // import icons from '../../ultils/icons';
// import { useSearchParams } from 'react-router-dom';
// import { GrNext, GrStar, GrLinkNext, GrLinkPrevious } from 'react-icons/gr';

// const Pagination = ({count}) => {
//     const { products } = useSelector(state => state.product)
//     // console.log(products)
//     // const count = products?.count;
//     const [arrPage, setArrPage] = useState([]);
//     const [currentPage, setCurrentPage] = useState(1); // page undefined => 1
//     const [isHideEnd, setIsHideEnd] = useState(false);
//     const [isHideStart, setIsHideStart] = useState(false);
//     const [searchParams] = useSearchParams();
//     const limitProducts = 5;
//     useEffect(() => {
//         let page = searchParams.get('page');
//         page && +page !== currentPage && setCurrentPage(+page)
//         !page && setCurrentPage(1)

//     }, [searchParams])

//     console.log(currentPage);
//     // const handlePageNumber = () => {
//     //     let max = Math.floor(count / posts.length) // vd: 20/5 = 4 trang
//     //     let arrNumber = [];
//     //     for (let i = 1; i <= max; i++)
//     //         arrNumber.push(i)

//     //     return arrNumber.length > 4 ? arrNumber.filter(i => i < 5) : arrNumber
//     // }
//     // console.log(handlePageNumber())

//     useEffect(() => {
//         let maxPage = Math.ceil(count / limitProducts) // vd: 20/5 = 4 trang
//         // console.log('maxPage: ', +maxPage);
//         let end = (currentPage + 2) > maxPage ? maxPage : (currentPage + 2);
//         // console.log('end', end);
//         let start = (currentPage - 2) <= 1 ? 1 : (currentPage - 2); // lấy start từ 2
//         // console.log('start', start);
//         let temp = [];
//         for (let i = start; i <= end; i++) {
//             temp.push(i);
//             setArrPage(temp)
//         }
//         currentPage >= (maxPage - 2) ? setIsHideEnd(true) : setIsHideEnd(false)
//         currentPage <= 3 ? setIsHideStart(true) : setIsHideStart(false)
//     }, [count, currentPage,products]) // count thay đổi thì cập nhật lại maxPage
//     // console.log(arrPage)
//     return (
//         <>
//             <div className="flex items-center justify-between">
//                 <div className="ml-4">
//                     <p className="text-sm text-gray-700">
//                         Showing <span className="font-medium">{currentPage}</span> to <span className="font-medium">{limitProducts}</span> of{' '}
//                         <span className="font-medium">{count}</span> results
//                     </p>
//                 </div>
//                 <div className="flex items-center justify-end gap-2 py-5 mr-3">
//                     {!isHideStart && <PageNumber
//                         setCurrentPage={setCurrentPage}
//                         text={1}
//                     />}
//                     {(!isHideStart && currentPage !== 4) && <PageNumber

//                         text={'...'}
//                     />}

//                     {arrPage.length > 0 && arrPage.map((item) => {
//                         return (
//                             <PageNumber
//                                 key={item}
//                                 text={item}
//                                 setCurrentPage={setCurrentPage}
//                                 currentPage={currentPage}
//                             />
//                         )
//                     })}
//                     {!isHideEnd && <PageNumber

//                         text={'...'}
//                     />}

//                     {!isHideEnd && <PageNumber

//                         icon={<GrLinkNext />}
//                         setCurrentPage={setCurrentPage}
//                         text={Math.floor(count / products.length)}

//                     />}
//                 </div>
//             </div>

//         </>

//     )
// }

// export default Pagination
import "./Pagination.css";

const Pagination = ({ page, pages, changePage }) => {
    // console.log(page, pages, changePage);
    let middlePagination;

    if (pages <= 5) {
        middlePagination = [...Array(pages)].map((_, idx) => (
            <button
                key={idx + 1}
                onClick={() => changePage(idx + 1)}
                disabled={page === idx + 1}
            >
                {idx + 1}
            </button>
        ));
    } else {
        const startValue = Math.floor((page - 1) / 5) * 5;

        middlePagination = (
            <>
                {[...Array(5)].map((_, idx) => (
                    <button
                        key={startValue + idx + 1}
                        disabled={page === startValue + idx + 1}
                        onClick={() => changePage(startValue + idx + 1)}
                    >
                        {startValue + idx + 1}
                    </button>
                ))}

                <button>...</button>
                <button onClick={() => changePage(pages)}>{pages}</button>
            </>
        );

        if (page > 5) {
            if (pages - page >= 5) {
                middlePagination = (
                    <>
                        <button onClick={() => changePage(1)}>1</button>
                        <button>...</button>
                        <button onClick={() => changePage(startValue)}>{startValue}</button>
                        {[...Array(5)].map((_, idx) => (
                            <button
                                key={startValue + idx + 1}
                                disabled={page === startValue + idx + 1}
                                onClick={() => changePage(startValue + idx + 1)}
                            >
                                {startValue + idx + 1}
                            </button>
                        ))}

                        <button>...</button>
                        <button onClick={() => changePage(pages)}>{pages}</button>
                    </>
                );
            } else {
                let amountLeft = pages - page + 5;
                middlePagination = (
                    <>
                        <button onClick={() => changePage(1)}>1</button>
                        <button>...</button>
                        <button onClick={() => changePage(startValue)}>{startValue}</button>
                        {[...Array(amountLeft)].map((_, idx) => (
                            <button
                                key={startValue + idx + 1}
                                disabled={page === startValue + idx + 1}
                                style={
                                    pages < startValue + idx + 1 ? { display: "none" } : null
                                }
                                onClick={() => changePage(startValue + idx + 1)}
                            >
                                {startValue + idx + 1}
                            </button>
                        ))}
                    </>
                );
            }
        }
    }

    return (
        pages > 1 && (
            <div className="pagination flex justify-end">
                <button
                    className="pagination__prev"
                    onClick={() => changePage((page) => page - 1)}
                    disabled={page === 1}
                >
                    &#171;
                </button>
                {middlePagination}
                <button
                    className="pagination__next"
                    onClick={() => changePage((page) => page + 1)}
                    disabled={page === pages}
                >
                    &#187;
                </button>
            </div>
        )
    );
};

export default Pagination;