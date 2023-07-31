import React, { useEffect, useState } from 'react';
import './chat.css';
import io from 'socket.io-client';
import { XCircleIcon } from '@heroicons/react/20/solid';
import { PaperAirplaneIcon } from '@heroicons/react/24/outline';
import { useDispatch } from 'react-redux';
import { sendMessageAction } from '../../redux/slices/chat/chatSlice';

const Popup = () => {
    const [showPopup, setShowPopup] = useState(false);
    const [messageInput, setMessageInput] = useState('');
    const [chatMessages, setChatMessages] = useState([])
    const dispatch = useDispatch();
    const openPopup = () => {
        // Code to open the popup
        setShowPopup(true);
    };

    const closePopup = () => {
        // Code to close the popup
        setShowPopup(false);
    };

    const handleMessageChange = (event) => {
        setMessageInput(event.target.value);
    };

    const handleSendMessage = (event) => {
        event.preventDefault();
        dispatch(sendMessageAction({
            message: messageInput,

        }))
        setMessageInput('');
    };
    // Socket.IO logic
    // const socket = io('http://localhost:2030');

    useEffect(() => {
        // Kết nối tới server Socket.IO
        const socket = io('http://localhost:2030');

        // Gửi tin nhắn tới server Socket.IO khi component được render
        socket.emit('message', { content: 'Xin chào tôi có thể giúp gì cho bạn' });

        // Lắng nghe sự kiện "message" từ server Socket.IO
        socket.on('message', (data) => {
            console.log('Received message:', data);
            // Xử lý tin nhắn nhận được từ server Socket.IO và cập nhật state chatMessages
            setChatMessages((prevMessages) => [...prevMessages, data])
        });

        // Hủy kết nối khi component unmount
        return () => {
            socket.disconnect();
        };
    }, []);

    console.log(chatMessages)
    return (
        <div className="popup-container">
            <img width="48" height="48" src="https://img.icons8.com/color/48/messaging-.png" alt="messaging-" onClick={openPopup} className="open-btn" />
            <div className={`popup ${showPopup ? 'show' : ''}`}>
                {/* Your content inside the popup */}
                <>
                    <div className="flex p-2 items-center bg-gray-50">
                        <img alt="" className="h-8 w-8 rounded-full object-fill mr-2" src="https://th.bing.com/th/id/R.9072995a50497d67844d118babed3c62?rik=xQd3v4VWu9PSIA&riu=http%3a%2f%2ftamvuong.com%2fMedia%2fimages%2ftamvuong%2ftin-tuc%2fnhan-vien-cham-soc-khach-hang.jpg&ehk=2kbFgQLbAYKq158b2hb6mqKFnh3C8KNNMhLQmuGXPwM%3d&risl=&pid=ImgRaw&r=0" />
                        <span className="font-bold">Hỗ trợ khách hàng</span>
                        <XCircleIcon className='h-8 w-8 ml-auto cursor-pointer' onClick={closePopup} />
                    </div>

                    <div className="h-72 p-2 overflow-y-auto">
                        {/* <div className="flex flex-col items-start mb-2">
                            <span className="font-medium">John Doe</span>
                            <div className="p-2 bg-gray-200 rounded-lg shadow-sm">Hello</div>
                        </div>
                        <div className="flex flex-col items-end mb-2">
                            <span className="font-medium">John Doe</span>
                            <div className="p-2 bg-indigo-500 rounded-lg shadow-sm text-slate-50">How are you doing?</div>
                        </div> */}
                        {chatMessages.map((message, index) => (
                            <div key={index} className="flex flex-col items-start mb-2">
                                <span className="font-medium">{message.sender}</span>
                                <div className="p-2 bg-gray-200 rounded-lg shadow-sm">{message.content}</div>
                            </div>
                        ))}
                        {/* Render chat messages here */}
                    </div>
                    <form onSubmit={handleSendMessage}>
                        <div className="flex items-center p-2 mb-2">
                            <textarea
                                value={messageInput}
                                onChange={handleMessageChange}
                                rows={2}
                                onDragStart="return false"
                                onDrop="return false"
                                // onPaste="return false"
                                // onCopy="return false"
                                // onCut="return false"
                                type="text" className="textarea w-full break-all whitespace-pre-wrap flex-auto p-2 border rounded-lg focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" placeholder='Type your message...' />
                            <button type="submit">
                                <PaperAirplaneIcon className='h-8 w-8 ml-auto cursor-pointer' />

                            </button>
                        </div>
                    </form>

                    {/* <form onSubmit={handleSendMessage}>
                        <input className="rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm " type="text" value={messageInput} onChange={handleMessageChange} />
                    </form>
                    <img width="24" height="24" src="https://img.icons8.com/fluency/48/filled-sent.png" alt="filled-sent" /> */}
                    {/* <button type="submit">Send</button> */}

                    {/* <button className="close-btn" onClick={closePopup}>
                        Close
                    </button> */}
                </>
            </div>
        </div>
    );
};

export default Popup;
