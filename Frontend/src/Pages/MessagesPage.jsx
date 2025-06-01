import React, { useState } from 'react';
import LeftSidebar from '../components/LeftSidebar';
import Navbar from '../components/Navbar';

const MessagesPage = () => {
    const [conversations, setConversations] = useState([
        {
            id: 1,
            user: {
                name: 'Jane Smith',
                username: 'janesmith',
                avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
                online: true
            },
            lastMessage: 'Hey, how are you doing?',
            time: '10 min ago',
            unread: 2
        },
        {
            id: 2,
            user: {
                name: 'Mike Johnson',
                username: 'mikej',
                avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
                online: false
            },
            lastMessage: 'Meeting at 3pm tomorrow',
            time: '2h ago',
            unread: 0
        },
        // More conversations...
    ]);

    const [activeConversation, setActiveConversation] = useState(null);
    const [newMessage, setNewMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;
        // Send message logic
        setNewMessage('');
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <div className="max-w-6xl mx-auto px-4 py-6">
                <div className="flex flex-col md:flex-row gap-6">
                <LeftSidebar />
                    {/* Main messages content */}
                    <div className="flex-1 bg-white rounded-lg shadow overflow-hidden">
                        <div className="flex h-[calc(100vh-180px)]">
                            {/* Conversations list */}
                            <div className={`${activeConversation ? 'hidden md:block md:w-1/3' : 'w-full'} border-r border-gray-200`}>
                                <div className="p-4 border-b border-gray-200">
                                    <h2 className="text-xl font-bold">Messages</h2>
                                </div>
                                <div className="divide-y divide-gray-200 overflow-y-auto h-full">
                                    {conversations.map(convo => (
                                        <div
                                            key={convo.id}
                                            className={`p-4 hover:bg-gray-50 cursor-pointer ${activeConversation?.id === convo.id ? 'bg-blue-50' : ''}`}
                                            onClick={() => setActiveConversation(convo)}
                                        >
                                            <div className="flex items-center space-x-3">
                                                <div className="relative">
                                                    <img
                                                        src={convo.user.avatar}
                                                        alt={convo.user.name}
                                                        className="w-12 h-12 rounded-full object-cover"
                                                    />
                                                    {convo.user.online && (
                                                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between items-center">
                                                        <h3 className="text-sm font-medium text-gray-900 truncate">
                                                            {convo.user.name}
                                                        </h3>
                                                        <span className="text-xs text-gray-500">
                                                            {convo.time}
                                                        </span>
                                                    </div>
                                                    <p className={`text-sm truncate ${convo.unread ? 'font-semibold text-gray-900' : 'text-gray-500'}`}>
                                                        {convo.lastMessage}
                                                    </p>
                                                </div>
                                                {convo.unread > 0 && (
                                                    <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                                        {convo.unread}
                                                    </span>
                                                )}
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
                                            className="md:hidden p-1 rounded-full hover:bg-gray-100"
                                            onClick={() => setActiveConversation(null)}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                            </svg>
                                        </button>
                                        <img
                                            src={activeConversation.user.avatar}
                                            alt={activeConversation.user.name}
                                            className="w-10 h-10 rounded-full object-cover"
                                        />
                                        <div>
                                            <h3 className="font-medium">{activeConversation.user.name}</h3>
                                            <p className="text-xs text-gray-500">
                                                {activeConversation.user.online ? 'Online' : 'Last seen recently'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                                        {/* Messages would go here */}
                                        <div className="text-center py-10 text-gray-500">
                                            No messages yet. Start a conversation!
                                        </div>
                                    </div>

                                    <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
                                        <div className="flex items-center space-x-2">
                                            <input
                                                type="text"
                                                value={newMessage}
                                                onChange={(e) => setNewMessage(e.target.value)}
                                                placeholder="Type a message..."
                                                className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
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