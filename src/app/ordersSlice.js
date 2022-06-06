import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axios from "axios";
import {BASE_API_URL} from "../constants/baseApiUrl";

export const getOrders = createAsyncThunk(
    'orders/all',
    async (payload, thunkAPI) => {
        try {
            const response = await axios.get(BASE_API_URL + "/orders/all", {
                headers: {
                    authorization: `Bearer ${localStorage.getItem("accessToken")}`
                }
            })
            const {data} = response
            if (response.status === 200) {
                return [...data];
            } else {
                return thunkAPI.rejectWithValue(data);
            }
        } catch (e) {
            console.log('Error', e.response.data);
            return thunkAPI.rejectWithValue(e.response.data);
        }
    }
)

export const updateOrder = createAsyncThunk(
    'orders/update',
    async ({id, payload}, thunkAPI) => {
        try {
            const response = await axios.patch(BASE_API_URL + "/orders/update/" + id, payload,{
                headers: {
                    authorization: `Bearer ${localStorage.getItem("accessToken")}`
                }
            })
            const {data} = response
            if (response.status === 200) {
                return {...payload, ...data};
            } else {
                return thunkAPI.rejectWithValue(data);
            }
        } catch (e) {
            console.log('Error', e.response.data);
            return thunkAPI.rejectWithValue(e.response.data);
        }
    }
)
export const deleteOrder = createAsyncThunk(
    'orders/delete',
    async ({id}, thunkAPI) => {
        try {
            const response = await axios.delete(BASE_API_URL + "/orders/" + id,{
                headers: {
                    authorization: `Bearer ${localStorage.getItem("accessToken")}`
                }
            })
            const {data} = response
            if (response.status === 200) {
                return {id, ...data};
            } else {
                return thunkAPI.rejectWithValue(data);
            }
        } catch (e) {
            console.log('Error', e.response.data);
            return thunkAPI.rejectWithValue(e.response.data);
        }
    }
)

export const ordersSlice = createSlice({
    name: 'orders',
    initialState: {
        items: [],
        isFetching: false,
        isSuccess: false,
        isError: false,
    },
    extraReducers: {
        [deleteOrder.rejected]: (state, {payload}) => {
            state.isFetching = false;
            state.isError = true;
            state.errorMessage = payload.message;
        },
        [deleteOrder.fulfilled]: (state, {payload}) => {
            state.isFetching = false
            state.isSuccess = true
            const candidate = state.items.find(i => i.id === payload.id)
            const indexOf = state.items.indexOf(candidate)
            if (indexOf > -1) {
                state.items.splice(indexOf, 1)
            }
        },
        [deleteOrder.pending]: (state) => {
            state.isFetching = true
        },

        [updateOrder.pending]: (state) => {
            state.isFetching = true;
        },
        [updateOrder.fulfilled]: (state, {payload}) => {
            state.isFetching = false;
            state.isSuccess = true;

            const candidate = state.items.find(i => i.id === payload.id)
            const indexOf = state.items.indexOf(candidate)
            console.log(payload, candidate, indexOf)
            if (indexOf > -1) {
                state.items[indexOf] = payload
            }
            // state.items[state.items.indexOf(state.items.find(i => i.id === payload.id))] = payload
        },
        [updateOrder.rejected]: (state, {payload}) => {
            state.isFetching = false;
            state.isError = true;
            state.errorMessage = payload.message;
        },

        [getOrders.fulfilled]: (state, {payload}) => {
            state.isFetching = false;
            state.isSuccess = true;
            state.items = payload
        },
        [getOrders.pending]: (state) => {
            state.isFetching = true;
        },
        [getOrders.rejected]: (state, {payload}) => {
            state.isFetching = false;
            state.isError = true;
            state.errorMessage = payload.message;
        },
    }
})

export const ordersSelector = (state) => state.orders.items