import React, {useEffect} from 'react';
import {Anchor, Button, createStyles, Group, Paper, PasswordInput, Text, TextInput, Title,} from '@mantine/core';
import {BrandVk, TruckDelivery} from "tabler-icons-react";
import {Link, useNavigate} from "react-router-dom";
import {useForm} from "@mantine/form";
import {useDispatch, useSelector} from "react-redux";
import {clearState, exchangeToken, signupUser, userSelector} from "../app/userSlice";
import {useLocation} from "react-router";
import axios from "axios";
import {BASE_API_URL} from "../constants/baseApiUrl";

const useStyles = createStyles((theme) => ({
    wrapper: {
        minHeight: 900,
        backgroundSize: 'cover',
        backgroundImage:
            'url(/login.jpg)',
    },

    form: {
        borderRight: `1px solid ${
            theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[3]
        }`,
        minHeight: 900,
        maxWidth: 450,
        paddingTop: 80,

        [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
            maxWidth: '100%',
        },
    },

    title: {
        color: theme.colorScheme === 'dark' ? theme.white : theme.black,
        fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    },

    logo: {
        color: theme.colorScheme === 'dark' ? theme.white : theme.black,
        width: 120,
        display: 'block',
        marginLeft: 'auto',
        marginRight: 'auto',
    },
}));

export function SignUp() {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {isSuccess, isError} = useSelector(
        userSelector
    );

    const {search} = useLocation()

    useEffect(() => {
        const searchParams = new URLSearchParams(search)
        const code = searchParams.get("code")
        if (code) {
            axios.get(BASE_API_URL + "/vk/access?code=" + code).then(res => {
                form.setValues({
                    username: res.data.screen_name || "",
                    email: res.data.email || "",
                    vkId: res.data.id || null
                })
            }).catch(e => {})
        }
    }, [search])

    useEffect(() => {
        return () => {
            dispatch(clearState());
        };
    }, []);

    useEffect(() => {
        if (isError) {
            dispatch(clearState());
        }

        if (isSuccess) {
            dispatch(clearState());
            dispatch(exchangeToken({accessToken: localStorage.getItem('accessToken')}))
            navigate('/');
        }
    }, [isError, isSuccess]);

    const {classes} = useStyles();
    const form = useForm({
        initialValues: {
            username: "",
            email: "",
            password: "",
            password_confirm: "",
            vkId: null
        },
        validate: (values) => ({
            password: values.password !== values.password_confirm ? "Пароли не совпадают" : null,
            password_confirm: values.password !== values.password_confirm ? "Пароли не совпадают" : null
        })
    })

    const handleSubmit = (values) => {
        dispatch(signupUser(values));
    }

    const handleVK = (e) => {
        e.preventDefault()
        window.location.href = BASE_API_URL + "/vk/login?callback=" + window.location.href
    }

    return (
        <div className={classes.wrapper}>
            <Paper className={classes.form} radius={0} p={30}>
                <Title order={2} className={classes.title} align="center" my={"xl"}>
                    Добро пожаловать на
                    <Group spacing={"xs"} position={"center"}>
                        <TruckDelivery/>
                        Maria Delivery
                    </Group>
                </Title>
                <Title order={3} className={classes.title} align="center" my={"xl"}>
                    Регистрация
                </Title>

                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <TextInput
                        label="Имя пользователя"
                        placeholder="cool_username"
                        size="md"
                        {...form.getInputProps("username")}
                    />

                    <TextInput
                        label="Email"
                        placeholder="cool@email.com"
                        mt={"md"}
                        size="md"
                        {...form.getInputProps("email")}
                    />

                    <PasswordInput
                        label="Пароль"
                        placeholder="Ваш пароль"
                        mt="md"
                        size="md"
                        {...form.getInputProps("password")}
                    />

                    <PasswordInput
                        label="Подтверждение пароля"
                        placeholder="Ваш пароль"
                        mt="md"
                        size="md"
                        {...form.getInputProps("password_confirm")}
                    />

                    <Button fullWidth mt="xl" size="md" type={"submit"}>
                        Зарегистрироваться
                    </Button>
                    <Button fullWidth mt="xl" size="md" onClick={handleVK} color={"blue"}>
                        <BrandVk/>
                    </Button>
                </form>

                <Text align="center" mt="md">
                    Есть аккаунт?{' '}
                    <Anchor component={Link} to="/signin" weight={700}>
                        Войти
                    </Anchor>
                </Text>
                <Text align="center" mt="md">
                    Забыли пароль?{' '}
                    <Anchor component={Link} to="/forgot" weight={700}>
                        Восстановить
                    </Anchor>
                </Text>
            </Paper>
        </div>
    );
}