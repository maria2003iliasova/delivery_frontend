import {Layout} from "../components/Layout";
import {Box, Container, Group, Paper, SimpleGrid, Title} from "@mantine/core";
import {useEffect, useState} from "react";
import axios from "axios";
import {BASE_API_URL} from "../constants/baseApiUrl";
import {useDispatch, useSelector} from "react-redux";
import {userSelector} from "../app/userSlice";
import {useNavigate} from "react-router-dom";
import {OrderCard} from "../components/OrderCard";
import {getOrders, ordersSelector} from "../app/ordersSlice";

export function Orders() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {isAdmin, isSuccess} = useSelector(userSelector)

    useEffect(() => {
        if (isSuccess && !isAdmin) return navigate("/")
    })

    const orders = useSelector(ordersSelector)
    const [food, setFood] = useState([])

    useEffect(() => {
        dispatch(getOrders())

        axios.get(BASE_API_URL + "/food").then(res => {
            setFood(res.data)
        })
    }, [])

    return <Layout>
        <Container>
            <Paper shadow={'lg'} p={"md"} mb={"md"}>
                <Group position={"apart"}>
                    <Title order={3}>
                        Все заказы
                    </Title>
                </Group>
            </Paper>
            <SimpleGrid cols={3}>
                {orders && orders.map(order => <Box key={order.id}>
                    <OrderCard order={order} food={food}/>
                </Box>)}
            </SimpleGrid>
        </Container>
    </Layout>
}