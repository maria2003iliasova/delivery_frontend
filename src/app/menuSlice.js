import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axios from "axios";
import {BASE_API_URL} from "../constants/baseApiUrl";

export const getMenu = createAsyncThunk(
    'food/all',
    async (payload, thunkAPI) => {
        try {
            const response = await axios.get(BASE_API_URL + "/food")
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

export const updateFood = createAsyncThunk(
    'food/update',
    async ({id, payload}, thunkAPI) => {
        try {
            const response = await axios.patch(BASE_API_URL + "/food/update/" + id, payload,{
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
export const deleteFood = createAsyncThunk(
    'food/delete',
    async ({id}, thunkAPI) => {
        try {
            const response = await axios.delete(BASE_API_URL + "/food/" + id,{
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
export const createFood = createAsyncThunk(
    'food/create',
    async ({payload}, thunkAPI) => {
        try {
            console.log(payload)
            const response = await axios.post(BASE_API_URL + "/food/create", payload,{
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


export const menuSlice = createSlice({
    name: 'menu',
    initialState: {
        items: [],
        isFetching: false,
        isSuccess: false,
        isError: false,
    },
    extraReducers: {
        [deleteFood.rejected]: (state, {payload}) => {
            state.isFetching = false;
            state.isError = true;
            state.errorMessage = payload.message;
        },
        [deleteFood.fulfilled]: (state, {payload}) => {
            state.isFetching = false
            state.isSuccess = true
            const candidate = state.items.find(i => i.id === payload.id)
            const indexOf = state.items.indexOf(candidate)
            state.items.splice(indexOf, 1)
        },
        [deleteFood.pending]: (state) => {
            state.isFetching = true
        },

        [updateFood.pending]: (state) => {
            state.isFetching = true;
        },
        [updateFood.fulfilled]: (state, {payload}) => {
            state.isFetching = false;
            state.isSuccess = true;

            const candidate = state.items.find(i => i.id === payload.id)
            const indexOf = state.items.indexOf(candidate)
            if (indexOf > -1) {
                payload.categories.map(c => ({value: c.id.toString(), label: c.title}))
                state.items[indexOf] = payload
            }
            // state.items[state.items.indexOf(state.items.find(i => i.id === payload.id))] = payload
        },
        [updateFood.rejected]: (state, {payload}) => {
            state.isFetching = false;
            state.isError = true;
            state.errorMessage = payload.message;
        },

        [createFood.fulfilled]: (state, {payload}) => {
            state.isFetching = false;
            state.isSuccess = true;
            state.items.push(payload)
        },
        [createFood.pending]: (state) => {
            state.isFetching = true
        },
        [createFood.rejected]: (state, {payload}) => {
            state.isFetching = false;
            state.isError = true;
            state.errorMessage = payload.message;
        },

        [getMenu.fulfilled]: (state, {payload}) => {
            state.isFetching = false;
            state.isSuccess = true;
            state.items = payload
        },
        [getMenu.pending]: (state) => {
            state.isFetching = true;
        },
        [getMenu.rejected]: (state, {payload}) => {
            state.isFetching = false;
            state.isError = true;
            state.errorMessage = payload.message;
        },
    }
})

export const foodSelector = (state) => state.menu.items