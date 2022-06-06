import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import {Provider} from "react-redux";
import store from "./app/store";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from "./pages/Home";
import {MantineProvider} from "@mantine/core";
import Menu from "./pages/Menu";
import {SignIn} from "./pages/Signin";
import {SignUp} from "./pages/Signup";
import {Wrapper} from "./components/Wrapper";
import {ModalsProvider} from "@mantine/modals";
import {Cart} from "./pages/Cart";
import {About} from "./pages/About";
import {Profile} from "./pages/Profile";
import {Orders} from "./pages/Orders";
import {ForgotPassword} from "./pages/Forgot";
import {ResetPassword} from "./pages/Reset";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <MantineProvider withGlobalStyles withNormalizeCSS theme={{primaryColor: "green"}}>
            <Provider store={store}>
                <Wrapper>
                    <ModalsProvider>
                        <BrowserRouter>
                            <Routes>
                                <Route path="/" element={<Home/>}/>
                                <Route path="/menu" element={<Menu/>}/>
                                <Route path="/signin" element={<SignIn/>}/>
                                <Route path="/signup" element={<SignUp/>}/>
                                <Route path="/cart" element={<Cart/>}/>
                                <Route path="/about" element={<About/>}/>
                                <Route path="/account" element={<Profile/>}/>
                                <Route path="/orders" element={<Orders/>}/>
                                <Route path="/forgot" element={<ForgotPassword/>}/>
                                <Route path="/reset" element={<ResetPassword/>}/>
                            </Routes>
                        </BrowserRouter>
                    </ModalsProvider>
                </Wrapper>
            </Provider>
        </MantineProvider>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
