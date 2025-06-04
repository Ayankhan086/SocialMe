import React, { useState, useEffect, useContext, useRef } from 'react';
import LeftSidebar from '../components/LeftSidebar';
import Navbar from '../components/Navbar';
import image from "../assets/images/image.svg"
import { Toaster, toast } from 'react-hot-toast';
import { SocketContext } from '../components/SocketContext';

const MessagesPage = () => {

    const [conversations, setConversations] = useState([]);

    const [activeConversation, setActiveConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newTextMessage, setNewTextMessage] = useState('');
    const [newImage, setNewImage] = useState(null);
    const [currentUser, setCurrentUser] = useState({})
    const { onlineUsers, newMessages } = useContext(SocketContext)
    const [showOnlineOnly, setShowOnlineOnly] = useState(false);

    const handleSendMessage = async (e) => {

        e.preventDefault();

        if (!newTextMessage.trim() && !newImage) return;

        console.log(newTextMessage);


        const formdata = new FormData();

        formdata.append("text", newTextMessage);
        if (newImage) {
            formdata.append("image", newImage)
        }

        console.log(formdata.text);


        try {

            const userId = activeConversation._id;

            const response = await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/messages/send/${userId}`, {
                method: "POST",
                body: formdata,
                credentials: "include"
            })

            if (response.ok) {
                const data = await response.json()
                console.log("Message Sent : ", data.data);
                setMessages(prev => [...prev, data.data])
                toast.success("Message Sent.")
            }

            setNewTextMessage('');
            setNewImage(null);

        } catch (error) {
            console.log("Error Ocurred  while sending message : ", error);
        }

    };

    useEffect(() => {

        const getCurrentUser = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/users/current-user`, {
                    method: 'GET',
                    credentials: 'include', // Include cookies for authentication
                });
                if (response.ok) {
                    const data = await response.json();
                    console.log("Current user:", data.data);
                    setCurrentUser(data.data);
                } else {
                    console.error("Failed to fetch current user");
                    toast.error("Failed to fetch current user.");
                }
            } catch (error) {
                console.error("Error fetching current user:", error);
                toast.error("An error occurred while fetching current user.");
            }
        };
        getCurrentUser();

        const getUserforConversations = async (e) => {
            try {

                const response = await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/messages/users`, {

                    method: "GET",
                    credentials: "include"

                })

                if (response.ok) {
                    const data = await response.json();
                    console.log("Users : ", data.data);
                    setConversations(data.data)
                }


            } catch (error) {
                console.log("Error happen while fetching users.", error);
            }
        }
        getUserforConversations();


    }, [])


    const getmessages = async (userId) => {
        try {

            const response = await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/messages/${userId}`, {
                method: 'GET',
                credentials: "include"
            })

            if (response.ok) {
                const data = await response.json()
                console.log("Messages : ", data.data);
                setMessages(data.data)
            }

        } catch (error) {
            console.log("Error while getting messaages", error);
        }
    }

    const handleclick = () => {
        setNewImage(null)
    }

    useEffect(() => {
        if (
            newMessages &&
            activeConversation &&
            (
                newMessages.senderId === activeConversation._id ||
                newMessages.receiverId === activeConversation._id
            )
        ) {
            setMessages(prev => {
                if (prev.some(m => m._id === newMessages._id)) return prev;
                return [...prev, newMessages];
            });
        }
    }, [newMessages, activeConversation]);

    useEffect(() => {
        console.log("Neww Messages ", messages);
    }, [messages])

    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    return (
        <div className="min-h-screen bg-gray-100">
            <Toaster position='top' />
            <Navbar />
            <div className="max-w-6xl mx-auto px-4 py-6">
                <div className="flex flex-col md:flex-row gap-6">
                    <LeftSidebar />
                    {/* Main messages content */}
                    <div className="flex-1 bg-white rounded-lg shadow overflow-hidden">
                        <div className="flex h-[calc(100vh-120px)]">
                            {/* Conversations list */}
                            <div className={`${activeConversation ? 'hidden md:block md:w-1/3' : 'w-full'} border-r border-gray-200`}>

                                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                                    <h2 className="text-xl font-bold">Messages</h2>
                                    <label className="flex items-center space-x-2 text-sm">
                                        <input
                                            type="checkbox"
                                            checked={showOnlineOnly}
                                            onChange={() => setShowOnlineOnly(v => !v)}
                                            className="form-checkbox"
                                        />
                                        <span>Show online only</span>
                                    </label>
                                </div>
                                <div className="divide-y divide-gray-200 overflow-y-auto h-full">
                                    {(showOnlineOnly
                                        ? conversations.filter(convo => onlineUsers.includes(convo._id))
                                        : conversations
                                    ).map(convo => (
                                        <div
                                            key={convo._id}
                                            className={`p-4 hover:bg-gray-50 cursor-pointer ${activeConversation?.id === convo.id ? 'bg-blue-50' : ''}`}
                                            onClick={() => { setActiveConversation(convo); getmessages(convo._id) }}
                                        >
                                            <div className="flex items-center space-x-3">
                                                <div className="relative">
                                                    <img
                                                        src={convo.avatar || image}
                                                        alt={convo.username}
                                                        className="w-12 h-12 rounded-full object-cover"
                                                    />
                                                    {onlineUsers.includes(convo._id) && (
                                                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between items-center">
                                                        <h3 className="text-xl mb-1  text-gray-900 truncate capitalize">
                                                            {convo.fullName}
                                                        </h3>
                                                        <p className="text-xs text-gray-500">
                                                            {onlineUsers.includes(convo._id) ? 'Online' : 'Last seen recently'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Active conversation */}
                            {activeConversation ? (
                                <div className="flex-1 flex flex-col">
                                    <div className="p-4 border-b border-gray-200 flex items-center space-x-3">
                                        <button
                                            className=" p-1 rounded-full hover:bg-gray-100"
                                            onClick={() => setActiveConversation(null)}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                            </svg>
                                        </button>
                                        <img
                                            src={activeConversation.avatar || image}
                                            alt={activeConversation.username}
                                            className="w-10 h-10 rounded-full object-cover"
                                        />
                                        <div>
                                            <h3 className="font-medium">{activeConversation.username}</h3>
                                            <p className="text-xs text-gray-500">
                                                {onlineUsers.includes(activeConversation._id) ? 'Online' : 'Last seen recently'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex-1 p-4 overflow-y-auto bg-gray-50">

                                        {/* Messages would go here */}

                                        {messages
                                            .filter(message => message.text || message.image)
                                            .map(message => {
                                                const isFromOtherUser = message.senderId === activeConversation._id;
                                                return (
                                                    <div
                                                        ref={messagesEndRef}
                                                        key={message._id}
                                                        className={`flex mb-2 ${isFromOtherUser ? 'justify-start' : 'justify-end'}`}
                                                    >
                                                        <div
                                                            className={`px-4 py-2 rounded-lg max-w-xs break-words ${isFromOtherUser
                                                                ? 'bg-gray-200 text-gray-900 rounded-bl-none'
                                                                : 'bg-blue-500 text-white rounded-br-none'
                                                                }`}
                                                        >
                                                            {message.text}
                                                            {message.image && (
                                                                <img src={message.image} alt="attachment" className="max-w-[100px] rounded" />
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                    </div>

                                    {newImage && (
                                        <div className='absolute bottom-25' >
                                            <div onClick={handleclick} className='relative left-21 top-6 font-semibold text-sm cursor-pointer  bg-red-900 text-white  w-5  rounded-full h-5 text-center '>X</div>
                                            <img src={URL.createObjectURL(newImage)} alt="" width="100px" className='ml-2 rounded-2xl' />
                                        </div>
                                    )}

                                    <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
                                        <div className="flex items-center space-x-2">
                                            <input
                                                type="text"
                                                value={newTextMessage}
                                                onChange={(e) => setNewTextMessage(e.target.value)}
                                                placeholder="Type a message..."
                                                className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                            <label className="flex items-center text-gray-500 hover:text-gray-700 cursor-pointer">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    style={{ display: "none" }}
                                                    onChange={e => {
                                                        setNewImage(e.target.files[0]);
                                                    }}
                                                />
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </label>
                                            <button
                                                type="submit"
                                                className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                                </svg>
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            ) : (
                                <div className="hidden md:flex flex-1 items-center justify-center bg-gray-50">
                                    <div className="text-center p-6">
                                        <div className="mx-auto w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-1">Select a conversation</h3>
                                        <p className="text-gray-500">
                                            Choose an existing conversation or start a new one
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MessagesPage;