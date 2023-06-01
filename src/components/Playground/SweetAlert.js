import Swal from 'sweetalert2'
import { resetErrorAction, resetSuccessAction } from '../../redux/slices/globalActions/globalAction'
import { useDispatch } from 'react-redux'

const SweetAlert = ({ icon, title, message }) => {
    Swal.fire({
        icon,
        title,
        text: message
    })
}

export default SweetAlert