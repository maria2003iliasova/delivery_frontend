import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axios from "axios";
import {BASE_API_URL} from "../constants/baseApiUrl";

export const updateUser = createAsyncThunk(
    'users/update',
    async ({username, email, phone}, thunkAPI) => {
        try {
            const response = await axios.patch(BASE_API_URL + "/users/me", {
                username, email, phone
            }, {
                headers: {
                    authorization: `Bearer ${localStorage.getItem("accessToken")}`
                }
            })
            const {data} = response
            if (response.status === 200) {
                return {username, email, phone, ...data}
            } else {
                return thunkAPI.rejectWithValue(data);
            }
        } catch (e) {
            return thunkAPI.rejectWithValue(e.response.data);
        }
    }
)

export const signupUser = createAsyncThunk(
    'users/signupUser',
    async ({username, email, password, vkId = null}, thunkAPI) => {
        try {
            const response = await axios.post(BASE_API_URL + "/auth/signup", {
                username, password, email, vkId
            })
            const {data} = response
            if (response.status === 200) {
                localStorage.setItem('accessToken', data.accessToken);
                return {...data, username, email};
            } else {
                return thunkAPI.rejectWithValue(data);
            }
        } catch (e) {
            console.log('Error', e.response.data);
            return thunkAPI.rejectWithValue(e.response.data);
        }
    }
);

export const loginUserByVK = createAsyncThunk(
    'oauth/login',
    async ({code}, thunkAPI) => {
        try {
            const response = await axios.post(BASE_API_URL + "/auth/vk", {
                code
            })
            const {data} = response
            if (response.status === 200) {
                localStorage.setItem('accessToken', data.accessToken);
                return data
            } else {
                return thunkAPI.rejectWithValue(data);
            }
        } catch (e) {
            console.log('Error', e.response.data);
            thunkAPI.rejectWithValue(e.response.data);
        }
    }
)

export const loginUser = createAsyncThunk(
    'users/login',
    async ({username, password}, thunkAPI) => {
        try {
            const response = await axios.post(BASE_API_URL + "/auth/signin", {username, password})
            let {data} = response;
            if (response.status === 200) {
                localStorage.setItem('accessToken', data.accessToken);
                return data;
            } else {
                return thunkAPI.rejectWithValue(data);
            }
        } catch (e) {
            console.log('Error', e.response.data);
            thunkAPI.rejectWithValue(e.response.data);
        }
    }
);

export const exchangeToken = createAsyncThunk(
    'users/exchangeToken',
    async ({accessToken}, thunkAPI) => {
        try {
            const response = await axios.get(BASE_API_URL + "/auth/access", {
                headers: {
                    authorization: `Bearer ${accessToken}`
                }
            })
            const {data} = response
            console.log(data)
            if (response.status === 200) {
                return {...data};
            } else {
                return thunkAPI.rejectWithValue(data);
            }
        } catch (e) {
            console.log('Error', e.response.data);
            return thunkAPI.rejectWithValue(e.response.data);
        }
    }
);

export const cancelOrder = createAsyncThunk(
    'users/orders/cancel',
    async ({id}, thunkAPI) => {
        try {
            const response = await axios.patch(BASE_API_URL + "/orders/update/" + id, {
                status: "CANCELED"
            }, {
                headers: {
                    authorization: `Bearer ${localStorage.getItem("accessToken")}`
                }
            })
            const {data} = response
            if (response.status === 200) {
                return {...data}
            } else {
                return thunkAPI.rejectWithValue(data);
            }
        } catch (e) {
            console.log('Error', e.response.data);
            return thunkAPI.rejectWithValue(e.response.data);
        }
    }
)

export const getOrders = createAsyncThunk(
    'users/orders',
    async (payload, thunkAPI) => {
        try {
            const response = await axios.get(BASE_API_URL + "/orders", {
                headers: {
                    authorization: `Bearer ${localStorage.getItem("accessToken")}`
                }
            })
            const {data} = response
            if (response.status === 200) {
                return [...data]
            } else {
                return thunkAPI.rejectWithValue(data);
            }
        } catch (e) {
            console.log('Error', e.response.data);
            return thunkAPI.rejectWithValue(e.response.data);
        }
    }
)

const initialState = () => ({
    username: '',
    email: '',
    phone: '',
    vk: null,
    orders: [],
    isAdmin: false,
    email_confirmed: false,

    isFetching: false,
    isSuccess: false,
    isError: false,
    errorMessage: '',
})

export const userSlice = createSlice({
    name: 'user',
    initialState: initialState(),
    reducers: {
        logoutUser: (state) => {
            return initialState()
        },
        clearState: (state) => {
            state.isError = false;
            state.isSuccess = false;
            state.isFetching = false;

            return state;
        },
    },
    extraReducers: {

        [loginUserByVK.rejected]: (state, {payload}) => {
            state.isFetching = false;
            state.isSuccess = false;
            state.isError = true;
            state.errorMessage = payload.message;
        },
        [loginUserByVK.pending]: (state) => {
            state.isSuccess = false;
            state.isFetching = true
        },
        [loginUserByVK.fulfilled]: (state, {payload}) => {
            state.isFetching = false;
            state.isSuccess = true;
            return state
        },

        [updateUser.fulfilled]: (state, {payload}) => {
            state.isFetching = false;
            state.isSuccess = true;
            state.username = payload.username
            state.email = payload.email
            state.phone = payload.phone
        },
        [updateUser.pending]: (state) => {
            state.isSuccess = false;
            state.isFetching = true
        },
        [updateUser.rejected]: (state, {payload}) => {
            state.isFetching = false;
            state.isError = true;
            state.errorMessage = payload.message;
        },

        [cancelOrder.fulfilled]: (state, {payload}) => {
            state.isFetching = false
            state.isSuccess = true
            const candidate = state.orders.find(o => o.id === payload.id)
            const indexOf = state.orders.indexOf(candidate)
            if (indexOf > -1) {
                state.orders[indexOf] = payload
            }
        },
        [cancelOrder.pending]: (state) => {
            state.isFetching = true
        },
        [cancelOrder.rejected]: (state, {payload}) => {
            state.isFetching = false;
            state.isError = true;
            state.errorMessage = payload.message;
        },

        [getOrders.fulfilled]: (state, {payload}) => {
            state.isFetching = false
            state.isSuccess = true
            state.orders = payload
        },
        [getOrders.pending]: (state) => {
            state.isFetching = true
        },
        [getOrders.rejected]: (state, {payload}) => {
            state.isFetching = false;
            state.isError = true;
            state.errorMessage = payload.message;
        },

        [signupUser.fulfilled]: (state, {payload}) => {
            state.isFetching = false;
            state.isSuccess = true;
            state.email = payload.email;
            state.username = payload.username;
        },
        [signupUser.pending]: (state) => {
            state.isSuccess = false;
            state.isFetching = true
        },
        [signupUser.rejected]: (state, {payload}) => {
            state.isFetching = false;
            state.isError = true;
            state.errorMessage = payload.message;
        },
        [loginUser.fulfilled]: (state, {payload}) => {
            state.email = payload.email;
            state.username = payload.username;
            state.isFetching = false;
            state.isSuccess = true;
            return state;
        },
        [loginUser.rejected]: (state, {payload}) => {
            state.isFetching = false;
            state.isError = true;
            state.errorMessage = payload.message;
        },
        [loginUser.pending]: (state) => {
            state.isSuccess = false;
            state.isFetching = true
        },
        [exchangeToken.pending]: (state) => {
            state.isSuccess = false;
            state.isFetching = true
        },
        [exchangeToken.fulfilled]: (state, {payload}) => {
            state.isFetching = false;
            state.isSuccess = true;
            state.email = payload.email;
            state.username = payload.username;
            state.email_confirmed = payload.email_confirmed
            state.isAdmin = payload.role === "ADMIN"
            state.phone = payload.phone
            state.vk = payload.vk
        },
        [exchangeToken.rejected]: (state) => {
            state.isFetching = false;
            state.isError = true;
        },
    },
});

export const {clearState, logoutUser} = userSlice.actions;

export const userSelector = (state) => state.user;