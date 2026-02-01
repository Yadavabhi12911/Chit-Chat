import { useEffect, useState } from "react";
import profileImage from "../assets/person.png";
import logo from "../assets/chat.png";
import {
  getAllIncomingFriendRequest,
  getFriends,
} from "../store/friendsApi/friends.slice";
import { useDispatch, useSelector } from "react-redux";
import { checkAuth } from "../store/authApi/auth.slice";
import {
  setSelectedPartnerId,
  clearUnread,
} from "../store/messageApi/message.slice";
import ChatInterface from "../components/ChatInterface";
import { getFriendFromChat, getPartnerIdFromChat } from "../utils/chatUtils";

const DEFAULT_AVATAR = profileImage;

const Home = () => {
  const [selectedChat, setSelectedChat] = useState(null);

  const dispatch = useDispatch();
  const currentUserId = useSelector(
    (state) => state.auth?.user?.id ?? state.auth?.user?._id
  );
  const { friends, isLoading, error } = useSelector(
    (state) => state.friends,
  );
  const { lastMessageByChat, unreadByChat } = useSelector(
    (state) => state.messages,
  );

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  useEffect(() => {
    const fetchFriendList = async () => {
      await dispatch(getFriends());
    };
    fetchFriendList();
  }, [dispatch]);

  useEffect(() => {
    const fetchFriendRequestList = async () => {
      await dispatch(getAllIncomingFriendRequest());
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
            friends.map((chat) => {
              const friend = getFriendFromChat(chat, currentUserId);
              const partnerId = getPartnerIdFromChat(chat, currentUserId);
              if (!friend) return null;
              const lastMsg =
                (partnerId && lastMessageByChat[partnerId]?.content) ||
                chat.lastMessage ||
                "No messages yet";
              const unreadCount =
                (partnerId && (unreadByChat[partnerId] ?? 0)) || 0;
              return (
                <button
                  key={chat._id}
                  onClick={() => {
                    setSelectedChat(chat);
                    if (partnerId) {
                      dispatch(setSelectedPartnerId(partnerId));
                      dispatch(clearUnread(partnerId));
                    }
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl border border-transparent hover:border-cyan-500 hover:bg-cyan-900/60 transition-colors text-left ${
                    selectedChat?._id === chat._id
                      ? "bg-cyan-900 border-cyan-500"
                      : ""
                  }`}
                >
                  <div className="profilePic relative">
                    <img
                      src={friend?.avatar?.secure_url || DEFAULT_AVATAR}
                      alt={friend?.name || "User"}
                      className="h-10 w-10 rounded-full object-cover"
                      onError={(e) => {
                        e.target.src = DEFAULT_AVATAR;
                      }}
                    />
                    {unreadCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 min-w-[1.25rem] h-5 px-1 flex items-center justify-center rounded-full bg-cyan-400 text-cyan-950 text-xs font-semibold">
                        {unreadCount > 99 ? "99+" : unreadCount}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 overflow-hidden min-w-0">
                    <div className="font-medium truncate">
                      {friend?.name || "Unknown User"}
                    </div>
                    <div className="text-xs text-cyan-200 truncate">
                      {lastMsg}
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      <ChatInterface selectedChat={selectedChat} />
    </div>
  );
};

export default Home;
