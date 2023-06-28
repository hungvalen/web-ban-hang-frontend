import React from 'react'
import { createSearchParams, useLocation, useNavigate, useSearchParams } from 'react-router-dom';

const notActive = "inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900  ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 hover:bg-indigo-500rounded-md ";
const active = "px-4 py-2 text-sm font-semibold flex justify-center items-center bg-indigo-600 text-white hover:opacity-90 rounded-md ";
const PageNumber = ({ text, setCurrentPage, currentPage, icon }) => {
    const navigate = useNavigate();
    const location = useLocation();
    console.log('check location', location);
    const [paramsSearch] = useSearchParams();
    let entries = paramsSearch.entries();

    const append = (entries) => {
        let params = [];
        paramsSearch.append('page', +text)
        for (let entry of entries) {
            params.push(entry);
        }
        let searchParamsObject = {}
        // let arrParams = []
        params?.forEach(i => {
            if (Object.keys(searchParamsObject)?.some(item => item === i[0] && item !== 'page')) {
                searchParamsObject[i[0]] = [...searchParamsObject[i[0]], i[1]]
            }
            else {
                searchParamsObject = { ...searchParamsObject, [i[0]]: [i[1]] }
            }
        })

        return searchParamsObject;
    }

    // https://stackoverflow.com/questions/65800658/react-router-v6-navigate-to-a-url-with-searchparams
    const handleChangePage = () => {
        if (!(text === '...')) {
            setCurrentPage(+text)
            navigate({
                pathname: location.pathname,
                search: createSearchParams(append(entries)).toString() // thêm vào search params kèm page 
            });
        }
    }
    return (
        <div
            className={+text === +currentPage ? `${active} ${text === "..." ? '' : 'cursor-pointer'}` : `${notActive} ${text === '...' ? "" : "cursor-pointer"}`}
            onClick={handleChangePage}
        >
            {icon || text}
        </div>
    )
}

export default PageNumber