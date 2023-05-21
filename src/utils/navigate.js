import React from 'react'
import { useNavigate } from 'react-router-dom'

const Redirect = ({ path }) => {
    const navigate = useNavigate();
    navigate(path)
    return (
        <div>navigate</div>
    )
}

export default Redirect