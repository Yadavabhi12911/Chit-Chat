import { useEffect, useState } from "react";
import profileImage from "../assets/chat.png";
import logo from "../assets/chat.png";
import { getFriends } from "../store/friendsApi/friends.slice";

const dummyChats = [
  {
    id: 1,
    name: "John Doe",
    lastMessage: "Hey, how are you?",
    avatar: profileImage,
  },
  {
    id: 2,
    name: "Jane Smith",
    lastMessage: "Let's catch up later!",
    avatar: profileImage,
  },
  {
    id: 3,
    name: "Alex Johnson",
    lastMessage: "See you tomorrow.",
    avatar: profileImage,
  },
];

const dummyFriendRequests = [
  {
    id: 1,
    name: "Emily Carter",
    mutualFriends: 3,
    avatar: profileImage,
  },
  {
    id: 2,
    name: "Michael Lee",
    mutualFriends: 1,
    avatar: profileImage,
  },
  {
    id: 3,
    name: "Sophia Williams",
    mutualFriends: 5,
    avatar: profileImage,
  },
];

const Home = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [activeTab, setActiveTab] = useState("chat"); // "chat" | "friendRequests"

  useEffect(() => {
    const fetchFriendList = async () => {
      const res = await getFriends();
      console.log("friends : ", res);
    };
    fetchFriendList();
  }, []);

  return (
    <div className="h-screen flex flex-row bg-cyan-950 text-white">
      {/* Left section - chat list */}
      <div className="leftSection w-[30%] border-r border-cyan-800 flex flex-col">
        <div className="p-3 border-b border-cyan-800">
          <div className="logo-text flex flex-row items-center ">
            <img src={logo} className="h-15 w-15 p-2" alt="chat-icon" />
            <h1 className="text-xl font-semibold">ChitChat</h1>
          </div>
          {/* <p className="text-sm text-cyan-200 ">
            Select a conversation to start chatting
          </p> */}
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {dummyChats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => setSelectedChat(chat)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl border border-transparent hover:border-cyan-500 hover:bg-cyan-900/60 transition-colors text-left ${
                selectedChat?.id === chat.id
                  ? "bg-cyan-900 border-cyan-500"
                  : ""
              }`}
            >
              <div className="profilePic">
                <img
                  src={chat.avatar}
                  alt={chat.name}
                  className="h-10 w-10 rounded-full object-cover"
                />
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="font-medium truncate">{chat.name}</div>
                <div className="text-xs text-cyan-200 truncate">
                  {chat.lastMessage}
                </div>
              </div>
            </button>
          ))}
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
                  src={selectedChat.avatar}
                  alt={selectedChat.name}
                  className="h-10 w-10 rounded-full object-cover border-2 border-cyan-500"
                />
                <div className="flex flex-col">
                  <span className="font-semibold text-sm">
                    {selectedChat.name}
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
              <span className="text-sm text-cyan-100">New User</span>
              <img
                src={profileImage}
                alt="Profile"
                className="h-10 w-10 rounded-full object-cover border-2 border-cyan-500"
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
              <div className="space-y-3">
                {dummyFriendRequests.map((request) => (
                  <div
                    key={request.id}
                    className="flex items-center justify-between bg-cyan-900/60 border border-cyan-800 rounded-2xl px-4 py-3 shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={request.avatar}
                        alt={request.name}
                        className="h-10 w-10 rounded-full object-cover border-2 border-cyan-500"
                      />
                      <div>
                        <div className="font-medium">{request.name}</div>
                        <div className="text-xs text-cyan-200">
                          {request.mutualFriends} mutual friends
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="px-3 py-1 text-xs font-medium rounded-full bg-cyan-500 text-cyan-950 hover:bg-cyan-400 transition-colors">
                        Accept
                      </button>
                      <button className="px-3 py-1 text-xs font-medium rounded-full border border-cyan-600 text-cyan-100 hover:bg-cyan-900 transition-colors">
                        Decline
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : !selectedChat ? (
          <div className="flex-1 flex flex-col items-center justify-center px-8">
            <div className="bg-cyan-900/60 rounded-3xl p-10 flex flex-col items-center gap-4 shadow-xl border border-cyan-800 max-w-md w-full">
              <img
                src={profileImage}
                alt="User"
                className="h-24 w-24 rounded-full object-cover border-4 border-cyan-500 shadow-lg"
              />
              <h2 className="text-2xl font-semibold">Your Profile</h2>
              <div className="w-full space-y-2 text-sm text-cyan-100">
                <div className="flex justify-between">
                  <span className="font-medium text-cyan-200">Name</span>
                  <span>New User</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-cyan-200">Status</span>
                  <span>Online</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-cyan-200">About</span>
                  <span className="text-right">
                    Select a friend from the left to start chatting.
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col">
            {/* Messages area */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 bg-gradient-to-br from-cyan-950 to-cyan-900">
              <div className="self-start max-w-[70%] bg-cyan-800/80 px-4 py-2 rounded-2xl rounded-bl-sm text-sm shadow">
                Hey! This is the beginning of your chat with {selectedChat.name}
                .
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
