import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import LeftSidebar from '../components/LeftSidebar';
import { toast, Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import image from "../../src/assets/images/image.svg"
import { useContext } from 'react';
import { AuthContext } from '../components/AuthContext';
import { SocketContext } from '../components/SocketContext';




const HomePage = () => {




  const [suggestions, setSuggestions] = useState([]);
  const [posts, setPosts] = useState([]);
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostImage, setNewPostImage] = useState(null);
  const [newPostVideo, setNewPostVideo] = useState(null);
  const [expandSuggestions, setExpandSuggestions] = useState(false);
  const [users, setUsers] = useState([]);
  const [follow_List, setFollow_List] = useState();
  const [postsLikes, setPostsLikes] = useState([]); // State to manage likes for posts
  const [expandcommentWindow, setExpandcommentWindow] = useState(false); // State to manage comment window visibility
  const [newComment, setNewComment] = useState(""); // State to manage new comment input
  const [comments, setComments] = useState([]); // State to manage comments for a post
  const [activepostcomment, setActivepostcomment] = useState(''); // State to manage active post for comments
  const [currentUser, setCurrentUser] = useState({});
  const { setCUser } = useContext(AuthContext)
  const { onlineUsers, connectSocket } = useContext(SocketContext)

  const handlePostSubmit = async (e) => {
    e.preventDefault();

    if (!newPostContent.trim() && !newPostImage && !newPostVideo) {
      toast.error("Please enter a description or select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("content", newPostContent);
    if (newPostImage) formData.append("image", newPostImage);
    if (newPostVideo) formData.append("video", newPostVideo);

    try {
      const response = await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/posts`, {
        method: 'POST',
        body: formData,
        credentials: 'include', // Include cookies for authentication
        // Do NOT set Content-Type, browser will set it for FormData
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Post created:", data);
        setPosts(prevPosts => [data.data, ...prevPosts]); // Optional: Delay to allow the UI to update before resetting form fields 
        // Reset form fields
        setNewPostContent("");
        setNewPostImage(null);
        setNewPostVideo(null);

        toast.success("Post created successfully!");
      } else {
        toast.error("Failed to create post.");
      }
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("An error occurred while creating the post.");
    }
  };



  useEffect(() => {

    connectSocket();
    

    const fetchPosts = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/posts`, {
          method: 'GET',
          credentials: 'include', // Include cookies for authentication
        });
        if (response.ok) {

          const data = await response.json();
          console.log("Fetched posts:", data.data);
          setPosts(data.data);

        } else {
          console.error("Failed to fetch posts");
          toast.error("Failed to fetch posts.");
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
        toast.error("An error occurred while fetching posts.");
      }
    };
    fetchPosts();




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
          setCUser(data.data)
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

    const fetchSuggestions = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/users/getUsersForSuggestion`, {
          method: 'GET',
          credentials: 'include', // Include cookies for authentication
        });

        if (response.ok) {

          const data = await response.json();
          console.log("Fetched suggestions:", data.data);
          setSuggestions(data.data);

        } else {
          console.error("Failed to fetch suggestions");
          toast.error("Failed to fetch suggestions.");
        }
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        toast.error("An error occurred while fetching suggestions.");
      }
    };
    fetchSuggestions();

    const fetchFollowList = async () => {

      try {
        const response = await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/follows/getFollowList`, {
          method: 'GET',
          credentials: 'include', // Include cookies for authentication
        });

        if (response.ok) {
          const data = await response.json();
          console.log("Fetched follow list:", data.data);
          setFollow_List(data.data);

        } else {
          console.error("Failed to fetch follow list");
          toast.error("Failed to fetch follow list.");
        }
      } catch (error) {
        console.error("Error fetching follow list:", error);
        toast.error("An error occurred while fetching follow list.");
      }
    };
    fetchFollowList();

    const getLikedPosts = async () => {

      try {

        const response = await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/likes/posts`, {
          method: 'GET',
          credentials: 'include', // Include cookies for authentication
        });

        if (response.ok) {
          const data = await response.json();
          console.log("Fetched liked posts:", data.data);
          setPostsLikes(data.data);
        } else {
          console.error("Failed to fetch liked posts");
          toast.error("Failed to fetch liked posts.");
        }

      } catch (error) {
        console.error("Error fetching liked posts:", error);
        toast.error("An error occurred while fetching liked posts.");
      }

    }
    getLikedPosts();

  }, []);

  useEffect(() => {
    console.log("Followed List updated:", follow_List);
    console.log("Liked Posts : ", postsLikes);

  }, [follow_List, postsLikes]);









  const handleUserSuggestionClick = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/users/getAllUsers`, {
        method: 'GET',
        credentials: 'include', // Include cookies for authentication
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Fetched users:", data.data);
        setUsers(data.data);
      } else {
        console.error("Failed to fetch users");
        toast.error("Failed to fetch users.");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("An error occurred while fetching users.");
    }
  }



  const handleFollowUser = async (userId) => {
    try {

      const response = await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/follows/${userId}`, {
        method: 'POST',
        credentials: 'include', // Include cookies for authentication
      });

      if (response.ok) {
        const data = await response.json();
        setFollow_List(prev => [...prev, data.data]); // Update follow list state
        console.log("Followed user:", data.data);
        toast.success("User followed successfully!");
      } else {
        console.error("Failed to follow user");
        toast.error("Failed to follow user.");
      }
    } catch (error) {
      console.error("Error following user:", error);
      toast.error("An error occurred while following the user.");
    }
  }



  const handleLikePost = async (postId) => {


    setPostsLikes(prev => {
      const alreadyLiked = prev.some(like => like.Post._id === postId);
      if (alreadyLiked) {
        return prev.filter(like => like.Post._id !== postId);
      } else {
        return [...prev, { Post: { _id: postId } }];
      }
    });

    setPosts(prev =>
      prev.map(post => {
        if (post._id === postId) {
          const alreadyLiked = postsLikes.some(like => like.Post._id === postId);
          return {
            ...post,
            likesCount: alreadyLiked ? post.likesCount - 1 : post.likesCount + 1,
          };
        }
        return post;
      })
    );

    try {

      const response = await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/likes/toggle/p/${postId}`, {
        method: 'POST',
        credentials: 'include', // Include cookies for authentication
      });

      if (response.ok) {

        const data = await response.json();
        console.log("Post liked:", data.data);

      } else {

        setPostsLikes(prev => {
          const wasLiked = prev.some(like => like.Post._id === postId);
          if (wasLiked) {
            return prev.filter(like => like.Post._id !== postId);
          } else {
            return [...prev, { Post: { _id: postId } }];
          }
        });

        console.error("Failed to like post");
        toast.error("Failed to like post.");

      }
    } catch (error) {
      console.log("Error liking post:", error);
      toast.error("An error occurred while liking the post.");

    }
  };

  const handleCommentSubmit = async (e) => {

    e.preventDefault();

    console.log("Active Post Comment ID:", activepostcomment);


    try {
      const response = await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/comments/${activepostcomment}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: newComment }),
        credentials: 'include',
      });

      if (response.ok) {

        const data = await response.json();
        console.log("Comment added:", data.data);

        setComments((prev) => [...prev, data.data]);
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post._id === activepostcomment ? { ...post, commentsCount: post.commentsCount + 1 } : post
          )
        );
        fetchComments(activepostcomment); // Refresh comments for the active post
        setNewComment("");
        toast.success("Comment added successfully!");

      } else {
        console.error("Failed to add comment");
        toast.error("Failed to add comment.");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("An error occurred while adding the comment.");
    }
  };



  const fetchComments = async (postId) => {

    console.log("Fetching comments for post ID:", postId);
    try {

      const response = await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/comments/${postId}`, {
        method: 'GET',
        credentials: 'include',

      });

      if (response.ok) {
        const data = await response.json();
        console.log("Fetched comments:", data.data);
        setComments(Array.isArray(data.data) ? data.data : []); // assuming your backend returns an array of comments in data.data
      } else {
        setComments([]);
        console.error("Failed to fetch comments");
        toast.error("Failed to fetch comments.");
      }

    } catch (error) {
      setComments([]);
      console.error("Error fetching comments:", error);
      toast.error("An error occurred while fetching comments.");
    }
  };


  return (
    <div className="min-h-screen bg-gray-100 scroll-bar-hide">
      {/* Navigation Bar */}
      <Toaster position="top-center" />
      <Navbar />
      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Sidebar */}
          <LeftSidebar />
          {/* Main Feed */}
          <div className="flex-1">
            {/* Create Post */}
            <div className="bg-white rounded-lg shadow p-4 mb-4">
              <form onSubmit={handlePostSubmit} method='POST' encType='multipart/form-data'>
                <div className="flex items-start space-x-3">
                  <img
                    src={currentUser.avatar || image}
                    alt="User"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <textarea
                    className="flex-1 border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="What's on your mind?"
                    rows="3"
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                  ></textarea>
                </div>
                <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
                  <div className="flex space-x-2">
                    <label className="flex items-center text-gray-500 hover:text-gray-700 cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={e => {
                          setNewPostImage(e.target.files[0]);
                        }}
                      />
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Photo
                    </label>
                    <label className="flex items-center text-gray-500 hover:text-gray-700 cursor-pointer">
                      <input
                        type="file"
                        accept="video/*"
                        style={{ display: "none" }}
                        onChange={e => {
                          setNewPostVideo(e.target.files[0]);
                        }}
                      />
                      <svg xmlns="http://www.w3.org/2000/svg" className="cursor-pointer h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Video
                    </label>


                  </div>
                  <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md font-medium transition duration-150 cursor-pointer"
                  >
                    Post
                  </button>
                </div>
              </form>
            </div>

            {/* Posts Feed */}
            {posts.map(post => (
              <div key={post._id} className="bg-white rounded-lg shadow p-4 mb-4">
                {/* Post Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <img
                      src={post.owner.avatar || image}
                      alt={post.owner.username}
                      className="w-10 h-10 rounded-full object-cover"
                    />

                    <div>
                      <h4 className="font-semibold cursor-pointer capitalize">{post.owner.username || currentUser.username}</h4>
                      <p className="text-gray-500 text-sm">{post.createdAt}</p>
                    </div>
                  </div>
                </div>

                {(() => {
                  if (expandSuggestions) {
                    return (
                      <>
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                          <div className="bg-white rounded-lg w-full max-w-md max-h-[80vh] overflow-hidden">
                            {/* Header */}
                            <div className="border-b p-4 flex justify-between items-center">
                              <h2 className="text-xl font-bold">People You May Know</h2>
                              <button onClick={() => setExpandSuggestions(false)} className="text-gray-500 hover:text-gray-700 cursor-pointer">
                                ✕
                              </button>
                            </div>


                            {/* Users List */}
                            <div className="overflow-y-auto max-h-[60vh]">
                              {users.map(user => (
                                <div key={user._id} className="flex items-center justify-between p-4 hover:bg-gray-50">
                                  <div className="flex items-center space-x-3">
                                    <img
                                      src={user.avatar || image}
                                      alt={user.username}
                                      className="w-12 h-12 rounded-full object-cover"
                                    />
                                    <div>
                                      <h3 className="font-semibold cursor-pointer">{user.fullName}</h3>
                                      <p className="text-gray-500 text-sm">
                                        @{user.username}
                                      </p>
                                    </div>
                                  </div>
                                  {(() => {
                                    if (follow_List && follow_List.some(follow => follow.following === user._id)) {
                                      return (
                                        <button disabled className="bg-gray-300 cursor-pointer text-gray-500 px-4 py-2 rounded-md text-sm font-medium">
                                          Following
                                        </button>
                                      );
                                    } else {
                                      return (
                                        <button onClick={() => handleFollowUser(user._id)} className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium">
                                          Follow
                                        </button>
                                      );
                                    }
                                  })()}
                                </div>
                              ))}
                            </div>


                          </div>
                        </div>
                      </>
                    )
                  }
                })()}

                {/* Post Content */}
                <div className="mb-4">
                  <p className="text-gray-800">{post.description}</p>
                  {(post.image && (
                    <img
                      src={post.image}
                      alt="Post"
                      className="w-full h-auto rounded-lg mt-3 object-cover max-h-96"
                    />
                  ) || post.videoFile && (
                    <video
                      src={post.videoFile}
                      controls
                      className="w-full h-auto rounded-lg mt-3 object-cover max-h-96"
                    />
                  ))}
                </div>

                {/* Post Actions */}
                <div className="flex justify-between border-t border-b border-gray-100 py-2 text-gray-500">
                  <div className="flex items-center justify-center flex-1 py-2 hover:bg-gray-50 rounded">

                    {postsLikes.some(like => like.Post._id === post._id) ? (
                      <svg onClick={() => handleLikePost(post._id)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="h-5 w-5 mr-1" stroke="currentColor">
                        <path d="M313.4 32.9c26 5.2 42.9 30.5 37.7 56.5l-2.3 11.4c-5.3 26.7-15.1 52.1-28.8 75.2l144 0c26.5 0 48 21.5 48 48c0 18.5-10.5 34.6-25.9 42.6C497 275.4 504 288.9 504 304c0 23.4-16.8 42.9-38.9 47.1c4.4 7.3 6.9 15.8 6.9 24.9c0 21.3-13.9 39.4-33.1 45.6c.7 3.3 1.1 6.8 1.1 10.4c0 26.5-21.5 48-48 48l-97.5 0c-19 0-37.5-5.6-53.3-16.1l-38.5-25.7C176 420.4 160 390.4 160 358.3l0-38.3 0-48 0-24.9c0-29.2 13.3-56.7 36-75l7.4-5.9c26.5-21.2 44.6-51 51.2-84.2l2.3-11.4c5.2-26 30.5-42.9 56.5-37.7zM32 192l64 0c17.7 0 32 14.3 32 32l0 224c0 17.7-14.3 32-32 32l-64 0c-17.7 0-32-14.3-32-32L0 224c0-17.7 14.3-32 32-32z" />
                      </svg>
                    ) : (
                      <svg onClick={() => handleLikePost(post._id)} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                      </svg>
                    )}
                    Like {post.likesCount}
                  </div>
                  <button onClick={() => {
                    setActivepostcomment(post._id);
                    setExpandcommentWindow(true);
                  }}
                    className="flex items-center justify-center flex-1 py-2 hover:bg-gray-50 rounded">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    Comment {post.commentsCount}
                  </button>
                  <button className="flex items-center justify-center flex-1 py-2 hover:bg-gray-50 rounded">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    Share
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Comment Window */}
          {expandcommentWindow && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-black/80 to-blue-900/90 backdrop-blur-sm">
              <div className="relative w-full max-w-lg mx-4 rounded-3xl shadow-2xl bg-white/20 backdrop-blur-2xl border border-white/30 flex flex-col"
                style={{ maxHeight: '80vh' }}>
                {/* Header */}
                <div className="border-b border-white/20 px-6 py-4 flex justify-between items-center bg-white/10 rounded-t-3xl">
                  <h2 className="text-2xl font-extrabold text-white tracking-wide drop-shadow">Comments</h2>
                  <button
                    onClick={() => setExpandcommentWindow(false)}
                    className="text-gray-300 hover:text-white text-2xl transition"
                  >
                    ✕
                  </button>
                </div>
                {/* Comments List */}
                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 custom-scrollbar">
                  {(!Array.isArray(comments) || comments.length === 0) && (
                    <div className="text-gray-200 text-center italic">No comments yet.</div>
                  )}
                  {Array.isArray(comments) &&
                    comments.map((comment) => (
                      <div
                        key={comment._id}
                        className="bg-white/30 rounded-xl p-4 shadow-inner flex flex-col"
                      >
                        <div className="flex items-center space-x-3 mb-2">
                          <img
                            src={comment.owner?.profilePicture || currentUser?.avatar || image}
                            alt={comment.owner?.username || currentUser?.username}
                            className="w-10 h-10 rounded-full object-cover border-2 border-blue-400 shadow"
                          />
                          <h4 className="font-semibold text-blue-100 drop-shadow">
                            {comment.owner?.username || currentUser?.username}
                          </h4>
                        </div>
                        <p className="text-gray-100 bg-white/10 rounded-lg px-3 py-2">{comment.content}</p>
                      </div>
                    ))}
                </div>
                {/* Comment Form */}
                <form
                  onSubmit={handleCommentSubmit}
                  className="px-6 py-4 border-t border-white/20 bg-white/10 rounded-b-3xl"
                >
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                    className="w-full border border-white/30 bg-white/30 text-white rounded-lg p-3 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                    rows={2}
                  />
                  <button
                    type="submit"
                    className="mt-3 w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg px-4 py-2 font-semibold shadow hover:from-blue-600 hover:to-blue-800 transition"
                  >
                    Post Comment
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Right Sidebar */}
          <div className="w-full md:w-80 flex-shrink-0">
            <div className="bg-white rounded-lg shadow p-4 sticky top-20">
              <h3 className="font-semibold text-gray-700 mb-4">People you may know</h3>

              {suggestions.map(user => (
                <div key={user._id} className="flex items-center justify-between mb-4 last:mb-0">
                  <div className="flex items-center space-x-3">
                    <img
                      src={user.avatar || image}
                      alt={user.username}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-medium">{user.fullName}</h4>
                      <p className="text-gray-500 text-sm">{user.username}</p>
                    </div>
                  </div>
                  {(() => {
                    if (follow_List && follow_List.some(follow => follow.following === user._id)) {
                      return (
                        <button disabled className="bg-gray-300 text-gray-500 px-4 py-2 rounded-md text-sm font-medium">
                          Following
                        </button>
                      );
                    } else {
                      return (
                        <button onClick={() => handleFollowUser(user._id)} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium">
                          Follow
                        </button>
                      );
                    }
                  })()}
                </div>
              ))}

              <button onClick={() => {
                handleUserSuggestionClick()
                setExpandSuggestions(true)
              }} className="w-full mt-4 text-blue-500 hover:text-blue-700 text-sm font-medium text-center">
                See All
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;