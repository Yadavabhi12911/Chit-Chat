import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSocket } from "../context/SocketContext";
import { loadMessages } from "../store/messageApi/message.slice";
import { getPartnerIdFromChat } from "../utils/chatUtils";

const DEFAULT_EXPIRY_HOURS = 24;
const TYPING_DEBOUNCE_MS = 300;
const TYPING_STOP_MS = 2000;

function getSenderId(message) {
  if (!message) return null;
  const s = message.senderId;
  return typeof s === "object" ? s?._id?.toString?.() ?? s?._id : s?.toString?.() ?? s;
}

const ChatArea = ({ selectedChat }) => {
  const dispatch = useDispatch();
  const { socket, connected, connectionStatus, STATUS } = useSocket();
  const isOffline = !connected;
  const currentUserId = useSelector(
    (state) => state.auth?.user?.id ?? state.auth?.user?._id
  );
  const partnerId = getPartnerIdFromChat(selectedChat, currentUserId);
  const partnerKey = partnerId?.toString?.() ?? partnerId;
  const messages = useSelector(
    (state) => (partnerKey && state.messages?.messagesByChat?.[partnerKey]) ?? []
  );
  const isLoading = useSelector(
    (state) => partnerKey && state.messages?.loadingChats?.[partnerKey]
  );
  const [input, setInput] = useState("");
  const [typingPartner, setTypingPartner] = useState(null);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const typingStopTimeoutRef = useRef(null);

  useEffect(() => {
    if (!partnerId) return;
    dispatch(loadMessages(partnerId));
  }, [partnerId, dispatch]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages?.length]);

  useEffect(() => {
    if (!socket || !partnerId) return;
    const onTypingStatus = (payload) => {
      const { userId, name, isTyping } = payload ?? {};
      const uid = userId?.toString?.() ?? userId;
      if (uid !== partnerKey) return;
      setTypingPartner(isTyping ? { name: name || "Someone" } : null);
    };
    socket.on("typing:status", onTypingStatus);
    return () => {
      socket.off("typing:status", onTypingStatus);
      setTypingPartner(null);
    };
  }, [socket, partnerId, partnerKey]);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      if (typingStopTimeoutRef.current) clearTimeout(typingStopTimeoutRef.current);
    };
  }, []);

  const emitTypingStart = () => {
    if (!socket || !partnerId) return;
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    socket.emit("typing:start", { receiverId: partnerId });
    if (typingStopTimeoutRef.current) clearTimeout(typingStopTimeoutRef.current);
    typingStopTimeoutRef.current = setTimeout(() => {
      socket.emit("typing:stop", { receiverId: partnerId });
      typingStopTimeoutRef.current = null;
    }, TYPING_STOP_MS);
  };

  const emitTypingStop = () => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
    if (typingStopTimeoutRef.current) {
      clearTimeout(typingStopTimeoutRef.current);
      typingStopTimeoutRef.current = null;
    }
    if (socket && partnerId) socket.emit("typing:stop", { receiverId: partnerId });
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    if (!socket || !partnerId) return;
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(emitTypingStart, TYPING_DEBOUNCE_MS);
  };

  useEffect(() => {
    if (messages.length === 0 || !socket || !partnerId) return;
    const lastReceived = [...messages]
      .filter((m) => getSenderId(m) !== (currentUserId?.toString?.() ?? currentUserId))
      .pop();
    if (!lastReceived || lastReceived.readAt) return;
    const lastId = lastReceived._id ?? lastReceived.id;
    socket.emit("message:read", { lastMessageId: lastId });
  }, [messages.length, socket, partnerId, currentUserId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || !socket || !partnerId) return;
    const expiredAt = new Date(
      Date.now() + DEFAULT_EXPIRY_HOURS * 60 * 60 * 1000
    ).toISOString();
    socket.emit(
      "message:send",
      { receiverId: partnerId, content: trimmed, expiredAt },
      (res) => {
        if (res?.error) return;
      }
    );
    setInput("");
  };

  if (!selectedChat) return null;

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Messages area */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto px-5 py-4 space-y-3 flex flex-col bg-gradient-to-br from-cyan-950 to-cyan-900 min-h-0"
      >
        {isLoading ? (
          <div className="flex items-center justify-center flex-1 text-cyan-300 text-sm">
            Loading messages...
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center flex-1 text-cyan-300 text-sm">
            No messages yet. Say hi!
          </div>
        ) : (
          <>
            {messages.map((msg) => {
              const isMine =
                getSenderId(msg) === (currentUserId?.toString?.() ?? currentUserId);
              return (
                <div
                  key={msg._id ?? msg.id ?? Math.random()}
                  className={
                    isMine
                      ? "self-end max-w-[70%] bg-cyan-500/90 px-4 py-2 rounded-2xl rounded-br-sm text-sm shadow"
                      : "self-start max-w-[70%] bg-cyan-800/80 px-4 py-2 rounded-2xl rounded-bl-sm text-sm shadow"
                  }
                >
                  {msg.content}
                  {isMine && msg.readAt && (
                    <span className="block text-xs text-cyan-200/80 mt-0.5">Read</span>
                  )}
                </div>
              );
            })}
            {typingPartner && (
              <div className="self-start text-sm text-cyan-300 italic">
                {typingPartner.name} is typing...
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="shrink-0 px-4 py-3 border-t border-cyan-800 bg-cyan-950/90">
        {isOffline && (
          <p className="text-xs text-amber-300 mb-2">
            {connectionStatus === STATUS.RECONNECTING
              ? "Reconnecting…"
              : "You're offline – messages will send when back online."}
          </p>
        )}
        <form className="flex items-center gap-3" onSubmit={handleSubmit}>
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            onBlur={emitTypingStop}
            placeholder={
              isOffline ? "Offline – type when back online" : "Type a message..."
            }
            disabled={isOffline}
            className="flex-1 px-4 py-2 rounded-full bg-cyan-900 border border-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm placeholder:text-cyan-300 disabled:opacity-60 disabled:cursor-not-allowed"
          />
          <button
            type="submit"
            disabled={isOffline}
            className="px-5 py-2 rounded-full bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium text-cyan-950 transition-colors"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatArea;
