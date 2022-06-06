import {
    ActionIcon,
    Badge,
    Box,
    Button,
    Container,
    Group,
    InputWrapper,
    Paper,
    Stack,
    Table,
    Text,
    TextInput,
    Title,
    Tooltip
} from "@mantine/core";
import {Layout} from "../components/Layout";
import {useDispatch, useSelector} from "react-redux";
import {cancelOrder, getOrders, updateUser, userSelector} from "../app/userSlice";
import {useEffect} from "react";
import {useForm} from "@mantine/form";
import {X} from "tabler-icons-react";
import {useModals} from "@mantine/modals";
import {EmailConfirmForm} from "../components/EmailConfirmForm";
import axios from "axios";
import {BASE_API_URL} from "../constants/baseApiUrl";

function getStatus(status) {
    switch (status) {
        case "IN_PROCESSING":
            status = <Badge>В обработке</Badge>
            break
        case "COOKING":
            status = <Badge color={"blue"}>Готовится</Badge>
            break
        case "DELIVERING":
            status = <Badge color={"violet"}>В пути</Badge>
            break
        case "DONE":
            status = <Badge color={"indigo"}>Выполнен</Badge>
            break
        case "CANCELED":
            status = <Badge color={"red"}>Отменен</Badge>
            break
    }
    return status
}

export function Profile() {
    const dispatch = useDispatch()
    const modals = useModals()
    const {email, username, email_confirmed, orders, phone, vk} = useSelector(userSelector)
    useEffect(() => {
        dispatch(getOrders())
    }, [])

    const handleCancel = (id) => {
        dispatch(cancelOrder({id}))
    }

    const form = useForm({
        initialValues: {
            email: "",
            username: "",
            phone: ""
        }
    })

    useEffect(() => {
        form.setValues({
            email, username, phone
        })
    }, [email, phone, username])

    const resetPassword = () => {
        modals.openConfirmModal({
            title: "Смена пароля",
            labels: {confirm: 'Отправить', cancel: 'Отмена'},
            children: <>
                <Text>Вам будет выслано письмо с сылкой на смену пароля</Text>
            </>,
            onConfirm() {
                axios.post(BASE_API_URL + "/auth/forgot", {
                    toSearch: email
                }).catch(console.log)
            }
        })
    }

    const startEmailConfirmation = () => {
        axios.get(BASE_API_URL + "/auth/verify", {
            headers: {
                authorization: `Bearer ${localStorage.getItem("accessToken")}`
            }
        }).then(res => {
            modals.openModal({
                title: "Подтверждение Email",
                children: <EmailConfirmForm/>
            })
        })
    }

    const handleSubmit = (values) => {
        dispatch(updateUser({email: values.email, username: values.username, phone: values.phone}))
    }

    const handleVK = (e) => {
        e.preventDefault()
        window.location.href = BASE_API_URL + "/vk/login?callback=" + window.location.href + "&user=" + username
    }

    return <Layout>
        <Container size={"md"}>
            <Paper shadow={'lg'} p={"md"} mb={"md"}>
                <Group position={"apart"}>
                    <Title order={3}>
                        Ваш профиль
                    </Title>
                </Group>
            </Paper>
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Paper shadow={'lg'} p={"md"} mb={"md"}>
                    <Container size={"25rem"}>
                        <Stack>
                            <Group spacing={0} direction={"column"} position={"center"} grow>
                                <TextInput disabled={!username} {...form.getInputProps("email")} label={"Email"}/>
                            </Group>
                            <Group spacing={0} direction={"column"} position={"center"} grow>
                                <InputWrapper label={"Email подтвержден"} sx={{width: "100%"}}>
                                    <Box sx={{width: "100%"}}>
                                        <Tooltip label={"Нажмите для подтверждения"} sx={{width: "100%"}}
                                                 position={"left"}>
                                            <Button disabled={!username || !!email_confirmed} sx={{width: "100%"}} onClick={startEmailConfirmation}>
                                                <Text sx={{textAlign: "center"}}>
                                                    {email_confirmed ? "Да" : "Нет"}
                                                </Text>
                                            </Button>
                                        </Tooltip>
                                    </Box>
                                </InputWrapper>
                            </Group>
                            <Group spacing={0} direction={"column"} position={"center"} grow>
                                <TextInput disabled={!username} {...form.getInputProps("username")} label={"Имя пользователя"}/>
                            </Group>
                            <Group spacing={0} direction={"column"} position={"center"} grow>
                                <TextInput disabled={!username} {...form.getInputProps("phone")} value={phone} label={"Номер телефона"}/>
                            </Group>
                            <Button type={"submit"} disabled={!username}>Сохранить данные</Button>
                            <Button color={"teal"} disabled={!username} onClick={resetPassword}>Изменить пароль</Button>
                            <Button color={"teal"} disabled={!username || !!vk} onClick={handleVK}>Привязать ВК</Button>
                        </Stack>
                    </Container>
                </Paper>
            </form>
            <Paper shadow={'lg'} p={"md"} mb={"md"}>
                <Title order={4}>
                    Ваши заказы
                </Title>
            </Paper>
            <Paper shadow={'lg'} mb={"md"}>
                <Container size={"sm"}>
                    <Table verticalSpacing={"sm"}>
                        <thead>
                        <tr>
                            <th>Дата</th>
                            <th>Время</th>
                            <th>Статус</th>
                            <th>Оплачен</th>
                            <th style={{textAlign: "center"}}>Отмена</th>
                        </tr>
                        </thead>
                        <tbody>
                        {orders && orders.map(order => <tr key={order.id}>
                            <td>
                                <Text>{new Date(order.created_at).toLocaleDateString()}</Text>
                            </td>
                            <td>
                                <Text>{new Date(order.created_at).toLocaleTimeString()}</Text>
                            </td>
                            <td>
                                <Text>{getStatus(order.status)}</Text>
                            </td>
                            <td>
                                <Text>{order.paid ? "Да" : "Нет"}</Text>
                            </td>
                            <td>
                                <Group position={"center"}>
                                    <Tooltip label={"Отменить заказ"}>
                                        <ActionIcon color={"red"}
                                                    onClick={() => handleCancel(order.id)}
                                                    disabled={order.status === "DONE" ||
                                                        order.status === "DELIVERING" ||
                                                        order.status === "CANCELED"}>
                                            <X/>
                                        </ActionIcon>
                                    </Tooltip>
                                </Group>
                            </td>
                        </tr>)}
                        </tbody>
                    </Table>
                </Container>
            </Paper>
        </Container>
    </Layout>
}