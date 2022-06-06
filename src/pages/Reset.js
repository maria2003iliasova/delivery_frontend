import React, {useState} from 'react';
import {
    Anchor,
    Box,
    Button,
    Center,
    Container,
    createStyles,
    Group,
    Paper,
    PasswordInput,
    Text,
    Title,
} from '@mantine/core';
import {ArrowLeft} from 'tabler-icons-react';
import {useLocation, useNavigate} from "react-router";
import axios from "axios";
import {BASE_API_URL} from "../constants/baseApiUrl";
import {useForm} from "@mantine/form";
import {Link} from "react-router-dom";

const useStyles = createStyles((theme) => ({
    title: {
        fontSize: 26,
        fontWeight: 900,
        fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    },

    controls: {
        [theme.fn.smallerThan('xs')]: {
            flexDirection: 'column-reverse',
        },
    },

    control: {
        [theme.fn.smallerThan('xs')]: {
            width: '100%',
            textAlign: 'center',
        },
    },
}));

export function ResetPassword() {
    const {classes} = useStyles();
    const {search} = useLocation()
    const navigate = useNavigate()
    const searchParams = new URLSearchParams(search)

    const form = useForm({
        initialValues: {
            password: "",
            password_confirm: ""
        },
        validate: {
            password: (value, values) => value !== values.password_confirm ? "Пароли не совпадают" : null
        }
    })

    const handleSubmit = (values) => {
        // e.preventDefault()
        axios.post(BASE_API_URL + "/auth/reset", {
            password: values.password,
            code: searchParams.get("code")
        }).catch(e => {
            form.setFieldError("password", "Ссылка устарела или что-то пошло нет так")
        }).then(res => {
            if (res) {
                navigate("/signin")
            }
        })
    }

    return (
        <Container size={460} my={30}>
            <Title className={classes.title} align="center">
                Восстановление пароля
            </Title>
            <Text color="dimmed" size="sm" align="center">
                Введите свой новый пароль!
            </Text>

            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Paper withBorder shadow="md" p={30} radius="md" mt="xl">
                    <PasswordInput label="Ваш пароль" placeholder="some_password" {...form.getInputProps('password')}/>
                    <PasswordInput label="Ваш пароль еще раз" placeholder="some_password" required {...form.getInputProps("password_confirm")}/>
                    <Group position="apart" mt="lg" className={classes.controls}>
                        <Anchor color="dimmed" size="sm" className={classes.control} component={Link} to={"/signin"}>
                            <Center inline>
                                <ArrowLeft size={12}/>
                                <Box ml={5}>Вернуться ко входу</Box>
                            </Center>
                        </Anchor>
                        <Button type={"submit"} className={classes.control}>Сохранить</Button>
                    </Group>
                </Paper>
            </form>
        </Container>
    );
}