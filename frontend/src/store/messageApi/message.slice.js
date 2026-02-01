import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchMessages } from "./message.service";

const initialState = {
  messagesByChat: {},
  loadingChats: {},
  lastMessageByChat: {},
  unreadByChat: {},
  selectedPartnerId: null,
  error: null,
};

function getPartnerIdFromMessage(message, currentUserId) {
  const senderId =
    typeof message.senderId === "object"
      ? message.senderId?._id?.toString?.() || message.senderId?._id
      : message.senderId?.toString?.() || message.senderId;
  const receiverId =
    typeof message.receiverId === "object"
      ? message.receiverId?._id?.toString?.() || message.receiverId?._id
      : message.receiverId?.toString?.() || message.receiverId;
  const current = currentUserId?.toString?.() || currentUserId;
  return senderId === current ? receiverId : senderId;
}

export const loadMessages = createAsyncThunk(
  "messages/loadMessages",
  async (partnerId, { rejectWithValue }) => {
    try {
      const response = await fetchMessages(partnerId);
      const messages = response.data?.data ?? response.data ?? [];
      return { partnerId, messages };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to load messages"
      );
    }
  }
);

const messagesSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    addMessage(state, action) {
      const { message, currentUserId } =
        typeof action.payload === "object" && "message" in action.payload
          ? action.payload
          : { message: action.payload, currentUserId: null };
      if (!currentUserId) return;
      const partnerId = getPartnerIdFromMessage(message, currentUserId);
      if (!partnerId) return;
      const key = partnerId.toString();
      if (!state.messagesByChat[key]) state.messagesByChat[key] = [];
      const exists = state.messagesByChat[key].some(
        (m) => (m._id || m.id) === (message._id || message.id)
      );
      if (!exists) state.messagesByChat[key].push(message);
      state.lastMessageByChat[key] = {
        content: message.content,
        createdAt: message.createdAt,
      };
    },
    incrementUnread(state, action) {
      const key = (action.payload ?? "").toString();
      state.unreadByChat[key] = (state.unreadByChat[key] || 0) + 1;
    },
    clearUnread(state, action) {
      const key = (action.payload ?? "").toString();
      state.unreadByChat[key] = 0;
    },
    setSelectedPartnerId(state, action) {
      state.selectedPartnerId = action.payload ?? null;
    },
    setMessagesRead(state, action) {
      const { readerId, messageIds } = action.payload ?? {};
      if (!readerId || !Array.isArray(messageIds) || messageIds.length === 0)
        return;
      const key = readerId.toString();
      const list = state.messagesByChat[key];
      if (!list) return;
      const set = new Set(messageIds.map((id) => id?.toString?.() ?? id));
      const now = new Date().toISOString();
      list.forEach((m) => {
        const id = (m._id || m.id)?.toString?.() ?? m._id ?? m.id;
        if (set.has(id)) m.readAt = now;
      });
    },
    clearMessages(state) {
      state.messagesByChat = {};
      state.loadingChats = {};
      state.lastMessageByChat = {};
      state.unreadByChat = {};
      state.selectedPartnerId = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadMessages.pending, (state, action) => {
        const id = action.meta.arg?.toString?.() ?? action.meta.arg;
        state.loadingChats[id] = true;
        state.error = null;
      })
      .addCase(loadMessages.fulfilled, (state, action) => {
        const { partnerId, messages } = action.payload;
        const key = partnerId?.toString?.() ?? partnerId;
        state.messagesByChat[key] = messages;
        state.loadingChats[key] = false;
        if (Array.isArray(messages) && messages.length > 0) {
          const last = messages[messages.length - 1];
          state.lastMessageByChat[key] = {
            content: last.content,
            createdAt: last.createdAt,
          };
        }
      })
      .addCase(loadMessages.rejected, (state, action) => {
        const id = action.meta.arg?.toString?.() ?? action.meta.arg;
        state.loadingChats[id] = false;
        state.error = action.payload;
      });
  },
});

export const {
  addMessage,
  setMessagesRead,
  clearMessages,
  incrementUnread,
  clearUnread,
  setSelectedPartnerId,
} = messagesSlice.actions;
export default messagesSlice.reducer;
