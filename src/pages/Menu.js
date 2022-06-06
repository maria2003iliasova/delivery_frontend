import {Layout} from "../components/Layout";
import {Box, Button, Container, Group, Paper, SimpleGrid, Title} from "@mantine/core";
import {FoodCard} from "../components/FoodCard";
import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {userSelector} from "../app/userSlice";
import {useModals} from "@mantine/modals";
import {FoodForm} from "../components/FoodForm";
import {foodSelector, getMenu} from "../app/menuSlice";

function Menu() {
    const modals = useModals()
    const dispatch = useDispatch()
    const food = useSelector(foodSelector)
    const {isAdmin} = useSelector(userSelector)

    useEffect(() => {
        dispatch(getMenu())
    }, [])

    const openCreationModal = (e) => {
        modals.openModal({
            title: "Создание блюда",
            children: <FoodForm/>
        })
    }

    return (
        <Layout>
            <Container size={"md"}>
                <Paper shadow={'lg'} p={"md"} mb={"md"}>
                    <Group position={"apart"}>
                        <Title order={3}>
                            Доступные блюда
                        </Title>
                        {isAdmin && <>
                            <Button onClick={openCreationModal}>
                                Добавить блюдо
                            </Button>
                        </>}
                    </Group>
                </Paper>
                <SimpleGrid cols={3}>
                    {food.map(f => <Box key={f.id}>
                        <FoodCard food={f} isAdmin={isAdmin}/>
                    </Box>)}
                </SimpleGrid>
            </Container>
        </Layout>
    );
}

export default Menu;
