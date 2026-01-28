import { useEffect, useState } from "react";
import profileImage from "../assets/person.png";
import logo from "../assets/chat.png";
import {
  getAllIncomingFriendRequest,
  getFriends,
} from "../store/friendsApi/friends.slice";
import { useDispatch, useSelector } from "react-redux";
import { checkAuth } from "../store/authApi/auth.slice";

// Utility function to format dates
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  try {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "N/A";
  }
};

// Fallback avatar
const DEFAULT_AVATAR = profileImage;

const Home = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [activeTab, setActiveTab] = useState("chat"); // "chat" | "friendRequests"
  const [user, setUser] = useState(null);
  

  const dispatch = useDispatch();
  const { friends, isLoading, friendRequests, error } = useSelector(
    (state) => state.friends,
  );

  useEffect(() => {
    const getCurrentUser = async () => {
      const res = await dispatch(checkAuth());
      if (res.payload?.data) {
        setUser(res.payload.data);
      }
    };
    getCurrentUser();
  }, [dispatch]);

  useEffect(() => {
    const fetchFriendList = async () => {
      await dispatch(getFriends());
    };
    fetchFriendList();
  }, [dispatch]);

  useEffect(() => {
    const fetchFriendRequestList = async () => {
      const res = await dispatch(getAllIncomingFriendRequest())
      
    };

    fetchFriendRequestList();
  }, [dispatch]);

  

  return (
    <div className="h-screen flex flex-row bg-cyan-950 text-white">
      {/* Left section - chat list */}
      <div className="leftSection w-[30%] border-r border-cyan-800 flex flex-col">
        <div className="p-3 border-b border-cyan-800">
          <div className="logo-text flex flex-row items-center ">
            <img src={logo} className="h-15 w-15 p-2" alt="chat-icon" />
            <h1 className="text-xl font-semibold">ChitChat</h1>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-cyan-300 text-sm">Loading chats...</div>
            </div>
          ) : error ? (
            <div className="p-4 bg-red-900/30 border border-red-700 rounded-lg text-red-200 text-sm m-2">
              Failed to load chats: {error}
            </div>
          ) : !friends || friends.length === 0 ? (
            <div className="flex items-center justify-center h-full text-cyan-300 text-center p-4">
              <div>
                <div className="text-sm mb-2">No chats yet</div>
                <div className="text-xs text-cyan-400">
                  Start a conversation to see chats here
                </div>
              </div>
            </div>
          ) : (
            friends.map((chat) => (
              <button
                key={chat._id}
                onClick={() => setSelectedChat(chat)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl border border-transparent hover:border-cyan-500 hover:bg-cyan-900/60 transition-colors text-left ${
                  selectedChat?._id === chat._id
                    ? "bg-cyan-900 border-cyan-500"
                    : ""
                }`}
              >
                <div className="profilePic">
                  <img
                    src={chat.senderId?.avatar?.secure_url || DEFAULT_AVATAR}
                    alt={chat.senderId?.name || "User"}
                    className="h-10 w-10 rounded-full object-cover"
                    onError={(e) => {
                      e.target.src = DEFAULT_AVATAR;
                    }}
                  />
                </div>
                <div className="flex-1 overflow-hidden">
                  <div className="font-medium truncate">
                    {chat.senderId?.name || "Unknown User"}
                  </div>
                  <div className="text-xs text-cyan-200 truncate">
                    {chat.lastMessage || "No messages yet"}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Right section - top bar + profile or chat interface */}
      <div className="rightSection w-[70%] flex flex-col">
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 py-5.5 border-b border-cyan-800 bg-cyan-950/80">
          {/* Selected chat summary (John Doe / others) */}
          <div className="flex items-center gap-3 min-w-[180px]">
            {activeTab === "chat" && selectedChat && (
              <>
                <img
                  src={
                    selectedChat.senderId?.avatar?.secure_url || DEFAULT_AVATAR
                  }
                  alt={selectedChat?.senderId?.name || "User"}
                  className="h-10 w-10 rounded-full object-cover border-2 border-cyan-500"
                  onError={(e) => {
                    e.target.src = DEFAULT_AVATAR;
                  }}
                />
                <div className="flex flex-col">
                  <span className="font-semibold text-sm">
                    {selectedChat?.senderId?.name || "Unknown User"}
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-4">
            <button
              className={`text-sm font-medium px-3 py-1 rounded-full transition-colors ${
                activeTab === "chat"
                  ? "bg-cyan-500 text-cyan-950"
                  : "text-cyan-200 hover:bg-cyan-900"
              }`}
              onClick={() => setActiveTab("chat")}
            >
              Chats
            </button>
            <button
              className={`text-sm font-medium px-3 py-1 rounded-full transition-colors ${
                activeTab === "friendRequests"
                  ? "bg-cyan-500 text-cyan-950"
                  : "text-cyan-200 hover:bg-cyan-900"
              }`}
              onClick={() => setActiveTab("friendRequests")}
            >
              Friend Requests
            </button>

            {/* Current user profile */}
            <div className="flex items-center gap-3 pl-4 border-l border-cyan-800">
              <span className="text-sm text-cyan-100">{user?.name}</span>
              <img
                src={user?.avatar?.secure_url || DEFAULT_AVATAR}
                alt="Profile"
                className="h-10 w-10 rounded-full object-cover border-2 border-cyan-500"
                onError={(e) => {
                  e.target.src = DEFAULT_AVATAR;
                }}
              />
            </div>
          </div>
        </div>

        {/* Content area */}
        {activeTab === "friendRequests" ? (
          <div className="flex-1 px-6 py-4 bg-gradient-to-br from-cyan-950 to-cyan-900 flex items-center justify-center">
            <div className="w-full max-w-xl">
              <h2 className="text-xl font-semibold mb-4 text-center">
                Friend Requests
              </h2>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-cyan-300 text-sm">Loading friend requests...</div>
                </div>
              ) : error ? (
                <div className="p-4 bg-red-900/30 border border-red-700 rounded-lg text-red-200 text-sm">
                  Failed to load friend requests: {error}
                </div>
              ) : !friendRequests || friendRequests.length === 0 ? (
                <div className="flex items-center justify-center py-8 text-cyan-300 text-center">
                  <div>
                    <div className="text-sm mb-2">No friend requests</div>
                    <div className="text-xs text-cyan-400">When someone sends you a request, it will appear here</div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {friendRequests.map((request) => (
                    <div
                      key={request._id}
                      className="flex items-center justify-between bg-cyan-900/60 border border-cyan-800 rounded-2xl px-4 py-3 shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={request.senderId?.avatar?.secure_url || DEFAULT_AVATAR}
                          alt={request.senderId?.name || "User"}
                          className="h-10 w-10 rounded-full object-cover border-2 border-cyan-500"
                          onError={(e) => {
                            e.target.src = DEFAULT_AVATAR;
                          }}
                        />
                        <div>
                          <div className="font-medium">{request.senderId?.name || "Unknown User"}</div>
                          <div className="text-xs text-cyan-200">
                            {request.senderId?.friendsCount || 0} friends
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          className="px-3 py-1 text-xs font-medium rounded-full bg-cyan-500 text-cyan-950 hover:bg-cyan-400 transition-colors"
                          onClick={() => console.log('Accept friend request:', request._id)}
                        >
                          Accept
                        </button>
                        <button 
                          className="px-3 py-1 text-xs font-medium rounded-full border border-cyan-600 text-cyan-100 hover:bg-cyan-900 transition-colors"
                          onClick={() => console.log('Decline friend request:', request._id)}
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : !selectedChat ? (
          <div className="flex-1 flex flex-col items-center justify-center px-8">
            <div className="bg-cyan-900/60 rounded-3xl p-10 flex flex-col items-center gap-4 shadow-xl border border-cyan-800 max-w-md w-full">
              <img
                src={user?.avatar?.secure_url || DEFAULT_AVATAR}
                alt="User"
                className="h-24 w-24 rounded-full object-cover border-4 border-cyan-500 shadow-lg"
                onError={(e) => {
                  e.target.src = DEFAULT_AVATAR;
                }}
              />
              <h2 className="text-2xl font-semibold">
                {user?.name || "Your Profile"}
              </h2>
              <div className="w-full space-y-2 text-sm text-cyan-100">
                <div className="flex justify-between">
                  <span className="font-medium text-cyan-200">Name</span>
                  <span>{user?.name || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-cyan-200">Username</span>
                  <span>{user?.username || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-cyan-200">Joined</span>
                  <span>{formatDate(user?.createdAt)}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col">
            {/* Messages area */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 bg-gradient-to-br from-cyan-950 to-cyan-900">
              <div className="self-start max-w-[70%] bg-cyan-800/80 px-4 py-2 rounded-2xl rounded-bl-sm text-sm shadow">
                Hey! This is the beginning of your chat with{" "}
                {selectedChat?.senderId?.name}.
              </div>
              <div className="self-end max-w-[70%] bg-cyan-500/90 px-4 py-2 rounded-2xl rounded-br-sm text-sm shadow">
                Once your backend is connected, messages will appear here.
              </div>
            </div>

            {/* Input area */}
            <div className="px-4 py-3 border-t border-cyan-800 bg-cyan-950/90">
              <form
                className="flex items-center gap-3"
                onSubmit={(e) => e.preventDefault()}
              >
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 rounded-full bg-cyan-900 border border-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm placeholder:text-cyan-300"
                />
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-cyan-500 hover:bg-cyan-400 text-sm font-medium text-cyan-950 transition-colors"
                >
                  Send
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
