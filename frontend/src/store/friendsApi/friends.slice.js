import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { fetchUserFriends } from "./friends.service"

const initialState = {
    friends: [],
    friendRequests: [],
    isLoading: false,
    error: null,
}

export const getFriends = createAsyncThunk(
    'friendsApi/getFriends',
    async (_, { isRejectedWithValue }) => {
        try {
            const response = await fetchUserFriends()
            return response.data
        } catch (error) {
            return isRejectedWithValue(error.response?.data?.message || 'Failed to fetch friends')
        }
    }

)


const friendsSlice = createSlice({
    name:'friends',
    initialState,
    reducers:{
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
        .addCase(getFriends.fulfilled, (state, action) =>{
            state.isLoading = false;
            state.friends = action.payload?.data || act.payload || [];
            state.error = null
        })
        .addCase(getFriends.rejected, (state, action) => {
            state.isLoading = false,
            state.error= action.payload
        })
    }
})



export const { clearError} = friendsSlice.actions;
export default friendsSlice.reducer