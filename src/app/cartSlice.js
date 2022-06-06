import {createSlice} from "@reduxjs/toolkit";

export const cartSlice = createSlice({
    name: "cart",
    initialState: [],
    reducers: {
        clear: (state) => {
            state.splice(0, state.length)
        },
        add: (state, {payload}) => {
            const candidate = state.find(v => v.id === payload.id)
            if (candidate) {
                candidate.count += 1
            } else {
                state.push({id: payload.id, count: 1})
            }
        },
        remove: (state, {payload}) => {
            const candidate = state.find(v => v.id === payload.id)
            if (candidate) state.splice(state.indexOf(candidate), 1)
        },
        increase: (state, {payload}) => {
            const candidate = state.find(v => v.id === payload.id)
            if (candidate) {
                candidate.count += 1
            }
        },
        decrease: (state, {payload}) => {
            const candidate = state.find(v => v.id === payload.id)
            if (candidate && candidate.count > 1) {
                candidate.count -= 1
            } else {
                state.splice(state.indexOf(candidate), 1)
            }
        }
    }
})

export const {add, remove, decrease, increase, clear} = cartSlice.actions
export const cartSelector = (state) => state.cart;