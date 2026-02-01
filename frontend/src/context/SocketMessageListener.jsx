import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSocket } from "./SocketContext";
import {
  addMessage,
  setMessagesRead,
  incrementUnread,
} from "../store/messageApi/message.slice";
import {
  getPartnerIdFromMessage,
  isIncomingMessage,
} from "../utils/chatUtils";
import { toast } from "react-toastify";

/**
 * Subscribes to socket message:new, message:error, message:read; dispatches to Redux and shows toasts.
 * Mount this inside SocketProvider so it only runs when socket exists.
 */
export function SocketMessageListener() {
  const { socket } = useSocket();
  const dispatch = useDispatch();
  const currentUserId = useSelector(
    (state) => state.auth?.user?.id ?? state.auth?.user?._id
  );
  const selectedPartnerId = useSelector(
    (state) => state.messages?.selectedPartnerId ?? null
  );

  useEffect(() => {
    if (!socket || !currentUserId) return;

    const onMessageNew = (message) => {
      dispatch(addMessage({ message, currentUserId }));
      if (isIncomingMessage(message, currentUserId)) {
        const partnerId = getPartnerIdFromMessage(message, currentUserId);
        const selected =
          selectedPartnerId?.toString?.() ?? selectedPartnerId ?? null;
        if (partnerId && partnerId !== selected) {
          dispatch(incrementUnread(partnerId));
        }
      }
    };

    const onMessageError = (err) => {
      const msg = err?.message || err?.code || "Failed to send message";
      toast.error(msg);
    };

    const onMessageRead = (payload) => {
      const { readerId, messageIds } = payload ?? {};
      if (readerId && messageIds?.length) {
        dispatch(setMessagesRead({ readerId, messageIds }));
      }
    };

    socket.on("message:new", onMessageNew);
    socket.on("message:error", onMessageError);
    socket.on("message:read", onMessageRead);

    return () => {
      socket.off("message:new", onMessageNew);
      socket.off("message:error", onMessageError);
      socket.off("message:read", onMessageRead);
    };
  }, [socket, currentUserId, selectedPartnerId, dispatch]);

  return null;
}
