import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { fetchIncomingFriendRequest, fetchUserFriends } from "./friends.service"

const initialState = {
    friends: [],
    friendRequests: [],
    isLoading: false,
    error: null,
}

export const getFriends = createAsyncThunk(
    'friendsApi/getFriends',
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetchUserFriends()
            return response.data
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch friends')
        }
    }

)

export const getAllIncomingFriendRequest = createAsyncThunk(
    "friendsApi/getAllIncomingFriendRequest",
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetchIncomingFriendRequest()
            return response.data
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch friend request list')
        }
    }
)


const friendsSlice = createSlice({
    name: 'friends',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getFriends.pending, (state) => {
                state.isLoading = true,
                    state.error = null
            })
            .addCase(getFriends.fulfilled, (state, action) => {
                state.isLoading = false;
                state.friends = action.payload?.data || action.payload || [];
                state.error = null
            })
            .addCase(getFriends.rejected, (state, action) => {
                state.isLoading = false,
                    state.error = action.payload
            })
            .addCase(getAllIncomingFriendRequest.pending, (state) => {
                state.isLoading = true,
                    state.error = null
            })
            .addCase(getAllIncomingFriendRequest.fulfilled, (state, action) => {
                state.isLoading = false,
                    state.friendRequests = action.payload?.data || action.payload
                state.error = null
            })
            .addCase(getAllIncomingFriendRequest.rejected, (state, action) => {
                state.isLoading = false,
                    state.error = action.payload
            })
    }
})



export const { clearError } = friendsSlice.actions;
export default friendsSlice.reducer