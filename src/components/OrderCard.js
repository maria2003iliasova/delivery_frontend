import {Badge, Box, Button, Card, Collapse, createStyles, Group, Stack, Text, UnstyledButton} from "@mantine/core";
import {useEffect, useState} from "react";
import {useModals} from "@mantine/modals";
import {OrderForm} from "./OrderForm";
import {ChevronDown, ChevronUp} from "tabler-icons-react";

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

const useStyles = createStyles((theme) => ({
    card: {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
    },

    label: {
        // marginBottom: theme.spacing.xs,
        lineHeight: 1,
        fontWeight: 700,
        fontSize: theme.fontSizes.xs,
        letterSpacing: -0.25,
        textTransform: 'uppercase',
    },

    section: {
        padding: theme.spacing.md,
        borderTop: `1px solid ${
            theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
        }`,
    },

    icon: {
        marginRight: 5,
        color: theme.colorScheme === 'dark' ? theme.colors.dark[2] : theme.colors.gray[5],
    },
}));

export const OrderCard = ({order, food}) => {
    const {classes} = useStyles()
    const modals = useModals()
    const [customerInfoVisible, setCustomerInfoVisible] = useState(false)
    const [foodInfoVisible, setFoodInfoVisible] = useState(false)

    const [totalPrice, setTotalPrice] = useState(0)

    useEffect(() => {
        if (food.length < 1) return
        const mapped = order.food_list
            .map(item => {
                const candidate = food.find(f => f.id === item.food.id)
                return ({...item.food, count: item.count, price: candidate.price})
            })
        setTotalPrice(mapped
            .reduce((a, b) => a + Number(b.price) * b.count, 0))
    }, [food, order])

    const openEditModal = (e) => {
        modals.openModal({
            title: "Изменение заказа",
            children: <OrderForm food={food} order={order}/>
        })
    }

    return <Card key={order.id} className={classes.card}>
        <Card.Section className={classes.section}>
            <Text size="sm" color="dimmed" className={classes.label}>
                Дата и время заказа
            </Text>
            <Group position={"apart"}>
                <Group spacing={4}>
                    <Text>Дата: </Text><Text>{new Date(order.created_at).toLocaleDateString()}</Text>
                </Group>
                <Group spacing={4}>
                    <Text>Время:</Text><Text>{new Date(order.created_at).toLocaleTimeString()}</Text>
                </Group>
            </Group>
        </Card.Section>
        <Card.Section className={classes.section}>
            {/*<UnstyledButton onClick={() => setOrderInfoVisible(!orderInfoVisible)}>*/}
            {/*<Group spacing={2}>*/}
            {/*{orderInfoVisible ? <ChevronUp size={14}/> : <ChevronDown size={14}/>}*/}
            <Text size="sm" color="dimmed" className={classes.label} mb={'xs'}>
                Информация о заказе
            </Text>
            {/*</Group>*/}
            {/*</UnstyledButton>*/}
            {/*<Collapse in={orderInfoVisible}>*/}
            <Group spacing={4}>
                <Text weight={"bold"}>Сумма заказа:</Text><Text>{totalPrice}</Text>
            </Group>
            <Group spacing={4}>
                <Text weight={"bold"}>Статус:</Text>{getStatus(order.status)}
            </Group>
            <Group spacing={4}>
                <Text weight={"bold"}>Оплачен:</Text><Text>{order.paid ? "Да" : "Нет"}</Text>
            </Group>
            {/*</Collapse>*/}
        </Card.Section>
        <Card.Section className={classes.section}>
            <UnstyledButton onClick={() => setCustomerInfoVisible(!customerInfoVisible)}>
                <Group spacing={2}>
                    {customerInfoVisible ? <ChevronUp size={14}/> : <ChevronDown size={14}/>}
                    <Text size="sm" color="dimmed" className={classes.label}>
                        Информация о заказчике
                    </Text>
                </Group>
            </UnstyledButton>
            <Collapse in={customerInfoVisible}>
                <Group spacing={4}>
                    <Text weight={"bold"}>Телефон:</Text><Text>{order.phone}</Text>
                </Group>
                <Group spacing={4}>
                    <Text weight={"bold"}>ФИО:</Text><Text>{order.name}</Text>
                </Group>
                <Group spacing={4}>
                    <Text weight={"bold"}>Адрес:</Text><Text>{order.address}</Text>
                </Group>
            </Collapse>
        </Card.Section>
        <Card.Section className={classes.section}>
            <UnstyledButton onClick={() => setFoodInfoVisible(!foodInfoVisible)}>
                <Group spacing={2}>
                    {foodInfoVisible ? <ChevronUp size={14}/> : <ChevronDown size={14}/>}
                    <Text size="sm" color="dimmed" className={classes.label}>
                        Блюда
                    </Text>
                </Group>
            </UnstyledButton>
            <Collapse in={foodInfoVisible}>
                <Stack spacing={1}>
                    {order.food_list.map(({count, food}) => <Box key={food.id}>
                        {food.title} x {count}
                    </Box>)}
                </Stack>
            </Collapse>
        </Card.Section>
        <Card.Section className={classes.section}>
            <Button onClick={openEditModal}>Изменить заказ</Button>
        </Card.Section>
    </Card>
}