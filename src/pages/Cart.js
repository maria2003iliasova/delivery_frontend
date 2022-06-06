import {Layout} from "../components/Layout";
import {ActionIcon, Button, Container, Group, Paper, Stack, Text, TextInput, Title, Tooltip} from "@mantine/core";
import {useDispatch, useSelector} from "react-redux";
import {cartSelector, clear, decrease, increase, remove} from "../app/cartSlice";
import {useEffect, useState} from "react";
import axios from "axios";
import {BASE_API_URL} from "../constants/baseApiUrl";
import {CurrencyRubel, Minus, Plus, ShoppingCartX} from "tabler-icons-react";
import {useForm} from "@mantine/form";

export function Cart() {

    const cart = useSelector(cartSelector)

    const [food, setFood] = useState([])
    const [totalPrice, setTotal] = useState(0)

    const dispatch = useDispatch()

    useEffect(() => {
        axios.get(BASE_API_URL + "/food").then(res => {
            setFood(res.data)
        })
    }, [])

    useEffect(() => {
        if (food.length < 1) return
        const mapped = cart
            .map(item => {
                const candidate = food.find(f => f.id === item.id)
                return ({...item, price: candidate.price})
            })
        setTotal(mapped
            .reduce((a, b) => a + Number(b.price) * b.count, 0))
    }, [food, cart])

    const handleIncrease = (id) => {
        dispatch(increase({id}))
    }

    const handleDecrease = (id) => {
        dispatch(decrease({id}))
    }

    const handleDelete = (id) => {
        dispatch(remove({id}))
    }

    const form = useForm({
        initialValues: {
            address: "",
            name: "",
            phone: ""
        }
    })

    const handleSubmit = (values) => {
        axios.post(BASE_API_URL + "/orders/create", {
            address: values.address,
            name: values.name,
            phone: values.phone,
            foodList: cart
        }, {
            headers: {
                authorization: `Bearer ${localStorage.getItem("accessToken")}`
            }
        }).then(res => {
            console.log(res.data)
            dispatch(clear())
        })
    }

    return (
        <Layout>
            <Container size={"md"}>
                <Paper shadow={'lg'} p={"md"} mb={"md"}>
                    <Group position={"apart"}>
                        <Title order={3}>
                            Ваша корзина
                        </Title>
                    </Group>
                </Paper>
                <Paper shadow={'lg'} p={"md"} mb={"md"}>
                    <Group position={"apart"}>
                        <Title order={4}>
                            Форма заказа
                        </Title>
                    </Group>
                </Paper>
                <Paper shadow={'lg'} p={"md"} mb={"md"}>
                    <Container size={"xs"}>
                        <Group spacing={0} position={"center"} direction={"column"}>
                            <Text size={"lg"} weight={700}>Итоговая сумма:</Text>
                            <Group spacing={0}>
                                <Text size={"xl"}>
                                    {totalPrice}
                                </Text>
                                <CurrencyRubel size={16}/>
                            </Group>
                        </Group>
                        <form onSubmit={form.onSubmit(handleSubmit)}>
                            <TextInput placeholder={"Ваш адрес"} label={"Адрес доставки"}
                                       description={"Указывайте адрес правильно, в ином случае нужно позвонить по номеру"}
                                       required {...form.getInputProps("address")}/>
                            <TextInput placeholder={"Номер телефона"} label={"Телефон"}
                                       required description={"Чтобы курьер мог уведомить вас о доставке"} {...form.getInputProps("phone")}/>
                            <TextInput placeholder={"Как к вам обращаться?"}
                                       label={"ФИО"} {...form.getInputProps("name")}/>
                            <Group position={"center"} mt={"md"}>
                                <Button type={"submit"}>Отправить</Button>
                            </Group>
                        </form>
                    </Container>
                </Paper>
                <Paper shadow={'lg'} p={"md"} mb={"md"}>
                    <Group position={"apart"}>
                        <Title order={4}>
                            Блюда в заказе
                        </Title>
                    </Group>
                </Paper>
                <Stack>
                    {food.length > 0 && cart.map(item => {
                        const candidate = food.find(f => f.id === item.id)
                        return <Paper shadow={'lg'} p={"md"}>
                            <Group position={"apart"}>
                                <Group spacing={0}>
                                    <Text
                                        align={"center"}>{candidate.title} х {item.count} x {candidate.price}</Text>
                                    <CurrencyRubel size={16}/>
                                </Group>
                                <Group>
                                    <Tooltip label={"Добавить"} withArrow>
                                        <ActionIcon onClick={() => handleIncrease(item.id)}>
                                            <Plus/>
                                        </ActionIcon>
                                    </Tooltip>
                                    <Tooltip label={"Уменьшить"} withArrow>
                                        <ActionIcon onClick={() => handleDecrease(item.id)}>
                                            <Minus/>
                                        </ActionIcon>
                                    </Tooltip>
                                    <Tooltip label={"Удалить из корзины"} withArrow>
                                        <ActionIcon color={"red"} onClick={() => handleDelete(item.id)}>
                                            <ShoppingCartX/>
                                        </ActionIcon>
                                    </Tooltip>
                                </Group>
                            </Group>
                        </Paper>
                    })}
                </Stack>
            </Container>
        </Layout>
    );
}