import axios from "axios";
import {BASE_API_URL} from "../constants/baseApiUrl";

export const signup = (username, email, password) => {
    return axios.post(BASE_API_URL + "/auth/signup", {
        username, email, password
    }).then(res => {
        if (res.data.accessToken) {
            localStorage.setItem("accessToken", res.data.accessToken)
        }

        return res.data
    })
}

export const signin = (username, password) => {
    return axios.post(BASE_API_URL + "/auth/signin", {
        username, password
    }).then(res => {
        if (res.data.accessToken) {
            localStorage.setItem("accessToken", res.data.accessToken)
        }

        return res.data
    })
}