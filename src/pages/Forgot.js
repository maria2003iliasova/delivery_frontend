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
    Text,
    TextInput,
    Title,
} from '@mantine/core';
import {ArrowLeft} from 'tabler-icons-react';
import axios from "axios";
import {BASE_API_URL} from "../constants/baseApiUrl";
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

export function ForgotPassword() {
    const {classes} = useStyles();
    const [toSearch, setSearch] = useState("")

    const handleSubmit = (e) => {
        e.preventDefault()
        axios.post(BASE_API_URL + "/auth/forgot", {
            toSearch
        }).catch(console.log)
    }

    return (
        <Container size={460} my={30}>
            <Title className={classes.title} align="center">
                Забыли пароль?
            </Title>
            <Text color="dimmed" size="sm" align="center">
                Введите Email для восстановления
            </Text>

            <form onSubmit={handleSubmit}>
                <Paper withBorder shadow="md" p={30} radius="md" mt="xl">
                    <TextInput label="Ваш Email"
                               placeholder="me@delivery.ru"
                               required
                               value={toSearch}
                               onChange={event => setSearch(event.currentTarget.value)}/>
                    <Group position="apart" mt="lg" className={classes.controls}>
                        <Anchor color="dimmed" size="sm" className={classes.control} component={Link} to={"/signin"}>
                            <Center inline>
                                <ArrowLeft size={12}/>
                                <Box ml={5}>Назад ко Входу</Box>
                            </Center>
                        </Anchor>
                        <Button type={"submit"} className={classes.control}>Восстановить пароль</Button>
                    </Group>
                </Paper>
            </form>
        </Container>
    );
}