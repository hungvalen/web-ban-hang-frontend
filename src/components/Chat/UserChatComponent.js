import React, { useEffect, useState } from 'react';
import './chat.css';
import io from 'socket.io-client';

const Popup = () => {
    const [isOpen, setIsOpen] = useState(false);

    const handleOpenModal = () => {
        setIsOpen(true);
    };

    const handleCloseModal = () => {
        setIsOpen(false);
    };

    const [showPopup, setShowPopup] = useState(false);
    const [messageInput, setMessageInput] = useState('');
    // You may need to handle the list of chat messages as well

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
        // Code to send the message using Socket.IO
        // You may need to emit an event to the server with the message content
        // socket.emit('send_message', { content: messageInput });
        setMessageInput('');
    };
      // Socket.IO logic
  const socket = io('http://localhost:2030');

  useEffect(() => {
    // Subscribe to events when the component mounts
    socket.on('message', handleIncomingMessage);

    return () => {
      // Unsubscribe from events when the component unmounts
      socket.off('message', handleIncomingMessage);
    };
  }, []);

  const handleIncomingMessage = (data) => {
    // Handle incoming message from the server
    // You can update the list of chat messages with the new message
  };
    return (
        <div className="popup-container">
            {/* <button onClick={handleOpenModal} className="open-btn">
        Open Popup
      </button> */}
            <img width="48" height="48" src="https://img.icons8.com/color/48/messaging-.png" alt="messaging-" onClick={openPopup} className="open-btn" />
            <div className={`popup ${showPopup ? 'show' : ''}`}>
                {/* Your content inside the popup */}
                <div className="popup-content">
                    <div className="flex">
                    <h2>Hỗ trợ khách hàng</h2>

                        <img alt="" className="h-8 w-8 rounded-md object-fill" src="https://th.bing.com/th/id/R.9072995a50497d67844d118babed3c62?rik=xQd3v4VWu9PSIA&riu=http%3a%2f%2ftamvuong.com%2fMedia%2fimages%2ftamvuong%2ftin-tuc%2fnhan-vien-cham-soc-khach-hang.jpg&ehk=2kbFgQLbAYKq158b2hb6mqKFnh3C8KNNMhLQmuGXPwM%3d&risl=&pid=ImgRaw&r=0"/>
                    </div>

                    <div className="chat-messages">
                        {/* Render chat messages here */}
                    </div>
                    <form onSubmit={handleSendMessage}>
                        <input className="rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm "type="text" value={messageInput} onChange={handleMessageChange} />
                    </form>
                    <img width="24" height="24" src="https://img.icons8.com/fluency/48/filled-sent.png" alt="filled-sent"/>
                    {/* <button type="submit">Send</button> */}

                    {/* <button className="close-btn" onClick={closePopup}>
                        Close
                    </button> */}
                </div>
            </div>
        </div>
    );
};

export default Popup;
