import {Button, Group, TextInput} from "@mantine/core";
import {useState} from "react";
import axios from "axios";
import {useModals} from "@mantine/modals";
import {BASE_API_URL} from "../constants/baseApiUrl";
import {useDispatch} from "react-redux";
import {exchangeToken} from "../app/userSlice";

export const EmailConfirmForm = () => {
    const modals = useModals()
    const dispatch = useDispatch()
    const [code, setCode] = useState("")

    const handleSubmit = (e) => {
        e.preventDefault()
        axios.get(BASE_API_URL + "/auth/verify?code=" + code, {
            headers: {
                authorization: `Bearer ${localStorage.getItem("accessToken")}`
            }
        }).then(res => {
            modals.closeAll()
            dispatch(exchangeToken({accessToken: localStorage.getItem("accessToken")}))
        })
    }

    return <form onSubmit={handleSubmit}>
        <TextInput label={"Код потдверждения"} value={code} onChange={event => setCode(event.currentTarget.value)}/>
        <Group position={"right"} mt={"md"}>
            <Button type={"submit"}>Отправить</Button>
        </Group>
    </form>
}