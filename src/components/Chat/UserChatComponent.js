import React, { useEffect, useState } from 'react'
import socketIOClient from "socket.io-client"
import "./chat.css"
const UserChatComponent = () => {
    const [socket, setSocket] = useState(false);
    const [messageReceived, setMessageReceived] = useState(false);
    const user = JSON.parse(localStorage.getItem('userInfo'));
    const isAdmin = user?.userFound;
    const [chat, setChat] = useState([]);
    useEffect(() => {
        if (!isAdmin) {
            const socket = socketIOClient();
            setSocket(socket)
            return () => socket.disconnect();
        }
    }, [isAdmin])

    const clientSubmitChatMsg = (e) => {
        if (e.keyCode && e.keyCode !== 13) {
            return;
        }
    }
    const msg = document.getElementById("clientChatMsg");
    let v = msg.value.trim();
    if(v === "" || v === null || v === false || !v){
        return;
    }
    socket.emit("client sends message", "message from client");
    return (
        <>
            <input type="checkbox" id="check" />
            <label className="chat-btn" htmlFor="check">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chat-dots comment" viewBox="0 0 16 16">
                    <path d="M5 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
                    <path d="m2.165 15.803.02-.004c1.83-.363 2.948-.842 3.468-1.105A9.06 9.06 0 0 0 8 15c4.418 0 8-3.134 8-7s-3.582-7-8-7-8 3.134-8 7c0 1.76.743 3.37 1.97 4.6a10.437 10.437 0 0 1-.524 2.318l-.003.011a10.722 10.722 0 0 1-.244.637c-.079.186.074.394.273.362a21.673 21.673 0 0 0 .693-.125zm.8-3.108a1 1 0 0 0-.287-.801C1.618 10.83 1 9.468 1 8c0-3.192 3.004-6 7-6s7 2.808 7 6c0 3.193-3.004 6-7 6a8.06 8.06 0 0 1-2.088-.272 1 1 0 0 0-.711.074c-.387.196-1.24.57-2.634.893a10.97 10.97 0 0 0 .398-2z" />
                </svg>
                {messageReceived && <span className="position-absolute top-0 start-10 translate-middle p-2 bg-danger border border-light rounded-circle"></span>}
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-circle-fill close" viewBox="0 0 16 16">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z" />
                </svg>
            </label>
            <div className="chat-wrapper border">
                <div className="chat-header">
                    <h6>Let's Chat - Online</h6>
                </div>
                <div className="chat-form">
                    <div className="cht-msg p-2">
                        {Array.from({ length: 20 }).map((_, id) => (
                            <div key={id}>
                                <p className="bg-gray-400 p-3 my-2 text-white rounded-md">
                                    <b>You wrote:</b> Hello, world! This is a toast message.
                                </p>
                                <p className="bg-indigo-500 p-3 text-white rounded-md">
                                    <b>Support wrote:</b> Hello, world! This is a toast message.
                                </p>
                            </div>
                        ))}
                    </div>
                    <textarea
                        onKeyUp={(e) => clientSubmitChatMsg(e)}
                        id="clientChatMsg"
                        className="resize rounded-md w-full p-2 mb-2 border"
                        placeholder="Your Text Message"
                        rows={4}
                    ></textarea>

                    <button onClick={(e) => clientSubmitChatMsg(e)} className="flex-end inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto">Submit</button>
                </div>
            </div>
        </>
    )
}

export default UserChatComponent