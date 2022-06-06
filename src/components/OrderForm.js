import {Box, Button, Group, InputWrapper, Select, Switch, TextInput} from "@mantine/core";
import {useForm} from "@mantine/form";
import {useDispatch} from "react-redux";
import {updateOrder} from "../app/ordersSlice";

export const OrderForm = ({order, food}) => {

    const dispatch = useDispatch()

    const statuses = [
        {label: "В обработке", value: "IN_PROCESSING"},
        {label: "Готовиться", value: "COOKING"},
        {label: "Доставляется", value: "DELIVERING"},
        {label: "Завершен", value: "DONE"},
        {label: "Отменен", value: "CANCELED"}
    ]

    const form = useForm({
        initialValues: {
            status: order.status,
            address: order.address,
            paid: order.paid,
        }
    })

    const handleSubmit = (values) => {
        dispatch(updateOrder({id: order.id, payload: values}))
    }

    return <Box mx="auto" sx={{maxWidth: "30rem", position: "relative"}}>
        <form onSubmit={form.onSubmit(handleSubmit)}>
            <TextInput label={"Адрес"} {...form.getInputProps("address")}/>
            <Select data={statuses} {...form.getInputProps("status")} label={"Статус"}/>
            <InputWrapper label={"Заказ оплачен"}>
                <Switch checked={form.values.paid} {...form.getInputProps("paid")}/>
            </InputWrapper>
            <Group position={"right"} mt={"md"}>
                <Button type={"submit"}>Сохранить</Button>
            </Group>
        </form>
    </Box>
}