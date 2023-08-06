import { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import CSS styles
const Editor = ({ value, onChange }) => {
    return (
        <ReactQuill name="description" theme="snow" style={{ height: '300px' }}
            value={value} onChange={onChange} />


    );
};
export default Editor