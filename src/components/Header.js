import React from 'react';
import {
    ActionIcon,
    Anchor,
    Burger, Button,
    Container,
    createStyles,
    Group,
    Header,
    Indicator,
    Menu,
    Text,
    Title,
    Tooltip
} from '@mantine/core';
import {useBooleanToggle} from '@mantine/hooks';
import {Logout, Settings, ShoppingCart, TruckDelivery} from "tabler-icons-react";
import {Link} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {logoutUser, userSelector} from "../app/userSlice";
import {cartSelector} from "../app/cartSlice";

const HEADER_HEIGHT = 96;

const useStyles = createStyles((theme) => ({
    header: {
        backgroundColor: theme.colors[theme.primaryColor][6],
        borderBottom: 0,
    },

    inner: {
        height: HEADER_HEIGHT,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    burger: {
        [theme.fn.largerThan('sm')]: {
            display: 'none',
        },
    },

    links: {
        paddingTop: theme.spacing.lg,
        height: HEADER_HEIGHT,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',

        [theme.fn.smallerThan('sm')]: {
            display: 'none',
        },
    },

    mainLinks: {
        marginRight: -theme.spacing.sm,
    },

    mainLink: {
        textTransform: 'uppercase',
        fontSize: theme.fontSizes.md / 1.1,
        color: theme.white,
        padding: `7px ${theme.spacing.sm}px`,
        fontWeight: 700,
        borderBottom: '2px solid transparent',
        transition: 'border-color 100ms ease, opacity 100ms ease',
        opacity: 0.9,
        borderTopRightRadius: theme.radius.sm,
        borderTopLeftRadius: theme.radius.sm,

        '&:hover': {
            opacity: 1,
            textDecoration: 'none',
        },
    },

    secondaryLink: {
        backgroundColor: "white",
        color: theme.colors[theme.primaryColor][4],
        fontSize: theme.fontSizes.sm,
        textTransform: 'uppercase',
        transition: 'color 100ms ease',

        '&:hover': {
            color: theme.white,
            backgroundColor: theme.colors[theme.primaryColor][8],
            textDecoration: 'none',
        },
    },

    mainLinkActive: {
        color: theme.white,
        opacity: 1,
        borderBottomColor:
            theme.colorScheme === 'dark' ? theme.white : theme.colors[theme.primaryColor][5],
        backgroundColor: theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 6 : 5],
    },
}));

export function HeaderWithNav() {
    const dispatch = useDispatch()
    const {isSuccess, username, isAdmin} = useSelector(userSelector);
    const cart = useSelector(cartSelector)

    const [opened, toggleOpened] = useBooleanToggle(false);
    const {classes, cx} = useStyles();

    const mainLinks = [
        {link: "/", label: "Главная"},
        {link: "/menu", label: "Меню"},
        {link: "/about", label: "О доставке"}
    ]
    const userLinks = [{link: "/signin", label: "Вход"}]

    const mainItems = mainLinks.map((item, index) => (
        <Anchor component={Link} to={item.link}
                href={item.link}
                key={item.label}
                className={cx(classes.mainLink, {[classes.mainLinkActive]: false})}
        >
            {item.label}
        </Anchor>
    ));

    const secondaryItems = userLinks.map((item) => (
        <Button component={Link} to={item.link}
                href={item.link}
                key={item.label}
                radius={"xl"}
                className={classes.secondaryLink}
        >
            {item.label}
        </Button>
    ));

    return (
        <Header height={HEADER_HEIGHT} className={classes.header}>
            <Container className={classes.inner}>
                <Group sx={{color: "white"}} spacing={"sm"}>
                    <TruckDelivery size={36}/>
                    <Title order={2}>Maria Delivery</Title>
                </Group>
                <div className={classes.links}>
                    <Group position="right">
                        {!isSuccess ? secondaryItems : <>
                            <Group sx={{color: "white"}}>
                                <Menu
                                    sx={{cursor: "pointer"}}
                                    size={260}
                                    placement="end"
                                    transition="pop-top-right"
                                    control={
                                        <Tooltip label={"Меню пользователя"} position={"left"} withArrow>
                                            <Text size={"md"}>{username}</Text>
                                        </Tooltip>
                                    }
                                >
                                    {isAdmin && <>
                                        <Menu.Label>Админситратор</Menu.Label>
                                        <Menu.Item component={Link} to="/orders" icon={<Settings size={14}/>}>
                                            Заказы
                                        </Menu.Item>
                                    </>}
                                    <Menu.Label>Настройки</Menu.Label>
                                    <Menu.Item component={Link} to="/account" icon={<Settings size={14}/>}>
                                        Настройки аккаунта
                                    </Menu.Item>
                                    <Menu.Item onClick={() => {
                                        localStorage.removeItem("accessToken")
                                        dispatch(logoutUser())
                                    }} icon={<Logout size={14}/>}>Выйти</Menu.Item>
                                </Menu>
                            </Group>
                        </>}
                        <Tooltip label={"Корзина"} position={"right"} withArrow>
                            <ActionIcon color={"green"} variant="filled" component={Link} to={"/cart"}>
                                {cart.length > 0 ? <>
                                    <Indicator color={"red"} label={cart.length} size={18}>
                                        <ShoppingCart size={24}/>
                                    </Indicator>
                                </> : <ShoppingCart size={24}/>}
                            </ActionIcon>
                        </Tooltip>
                    </Group>
                    <Group spacing={0} position="right" className={classes.mainLinks}>
                        {mainItems}
                    </Group>
                </div>
                <Burger
                    opened={opened}
                    onClick={() => toggleOpened()}
                    className={classes.burger}
                    size="sm"
                    color="#fff"
                />
            </Container>
        </Header>
    );
}