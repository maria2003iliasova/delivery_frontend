import {configureStore} from '@reduxjs/toolkit';
import {userSlice} from "./userSlice";
import {cartSlice} from "./cartSlice";
import {menuSlice} from "./menuSlice";
import {ordersSlice} from "./ordersSlice";

export default configureStore({
    reducer: {
        user: userSlice.reducer,
        cart: cartSlice.reducer,
        menu: menuSlice.reducer,
        orders: ordersSlice.reducer
    },
});