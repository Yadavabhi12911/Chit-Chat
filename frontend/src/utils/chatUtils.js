/**
 * Get the other user (friend) from a friendship/chat document.
 * Backend getFriendsList returns Friendship with senderId and receiverId;
 * the current user is one of them, the friend is the other.
 * @param {Object} chat - Friendship doc with senderId, receiverId (populated or ids)
 * @param {string} currentUserId - Current user's _id (string)
 * @returns {Object|null} The friend (other user) or null
 */
export function getFriendFromChat(chat, currentUserId) {
  if (!chat || currentUserId == null) return null;
  const c = (currentUserId?.toString?.() ?? currentUserId).toString();
  const s =
    chat.senderId?._id?.toString?.() ??
    chat.senderId?.toString?.() ??
    chat.senderId;
  const senderStr = s?.toString?.() ?? s;
  return senderStr === c ? chat.receiverId : chat.senderId;
}

/**
 * Get the friend's id (for API/socket) from a chat and current user id.
 * @param {Object} chat - Friendship doc
 * @param {string} currentUserId - Current user's _id
 * @returns {string|null} Friend's _id as string
 */
export function getPartnerIdFromChat(chat, currentUserId) {
  const friend = getFriendFromChat(chat, currentUserId);
  if (!friend) return null;
  return friend._id?.toString?.() ?? friend.id?.toString?.() ?? friend._id ?? friend.id ?? null;
}

/**
 * Get partner id from a message (the other user in the conversation).
 * @param {Object} message - Message doc with senderId, receiverId
 * @param {string} currentUserId - Current user's _id
 * @returns {string|null} Partner's _id as string
 */
export function getPartnerIdFromMessage(message, currentUserId) {
  if (!message || currentUserId == null) return null;
  const current = (currentUserId?.toString?.() ?? currentUserId).toString();
  const senderId =
    typeof message.senderId === "object"
      ? message.senderId?._id?.toString?.() ?? message.senderId?._id
      : message.senderId?.toString?.() ?? message.senderId;
  const receiverId =
    typeof message.receiverId === "object"
      ? message.receiverId?._id?.toString?.() ?? message.receiverId?._id
      : message.receiverId?.toString?.() ?? message.receiverId;
  return senderId === current ? receiverId : senderId;
}

/**
 * Whether the message was sent to the current user (incoming).
 * @param {Object} message - Message doc
 * @param {string} currentUserId - Current user's _id
 * @returns {boolean}
 */
export function isIncomingMessage(message, currentUserId) {
  if (!message || currentUserId == null) return false;
  const senderId =
    typeof message.senderId === "object"
      ? message.senderId?._id?.toString?.() ?? message.senderId?._id
      : message.senderId?.toString?.() ?? message.senderId;
  return (senderId?.toString?.() ?? senderId) !== (currentUserId?.toString?.() ?? currentUserId);
}
