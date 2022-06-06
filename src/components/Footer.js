import React from 'react';
import {createStyles, Container, Group, ActionIcon, Title, Text} from '@mantine/core';
import {Mail, Phone, TruckDelivery} from 'tabler-icons-react';

const useStyles = createStyles((theme) => ({
    footer: {
        // marginTop: 120,
        borderTop: `1px solid ${
            theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2]
        }`,
    },

    inner: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: theme.spacing.xl,
        paddingBottom: theme.spacing.xl,

        [theme.fn.smallerThan('xs')]: {
            flexDirection: 'column',
        },
    },

    links: {
        [theme.fn.smallerThan('xs')]: {
            marginTop: theme.spacing.md,
        },
    },
}));

export function Footer() {
    const { classes, theme } = useStyles();

    return (
        <div className={classes.footer}>
            <Container className={classes.inner}>
                <Group sx={{color: theme.colors.green[6]}} spacing={"sm"}>
                    <TruckDelivery size={36}/>
                    <Title order={2}>Maria Delivery</Title>
                </Group>
                <Group spacing={0} className={classes.links} position="right" noWrap>
                    <ActionIcon size="lg">
                        <Mail size={18} />
                    </ActionIcon>
                    <Text>mia03.03@mail.ru</Text>
                    <ActionIcon size="lg">
                        <Phone size={18} />
                    </ActionIcon>
                    <Text>8 (922) 530-30-25</Text>
                </Group>
            </Container>
        </div>
    );
}