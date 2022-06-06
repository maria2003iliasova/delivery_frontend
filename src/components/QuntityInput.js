import React, {useRef, useState} from 'react';
import {ActionIcon, createStyles, NumberInput} from '@mantine/core';
import {Minus, Plus} from 'tabler-icons-react';

const useStyles = createStyles((theme) => ({
    wrapper: {
        // maxWidth: "12rem",
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: `6px ${theme.spacing.xs}px`,
        borderRadius: theme.radius.sm,
        border: `1px solid ${theme.colorScheme === 'dark' ? 'transparent' : theme.colors.gray[3]}`,
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.white,

        '&:focus-within': {
            borderColor: theme.colors[theme.primaryColor][6],
        },
    },

    control: {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
        border: `1px solid ${theme.colorScheme === 'dark' ? 'transparent' : theme.colors.gray[3]}`,

        '&:disabled': {
            borderColor: theme.colorScheme === 'dark' ? 'transparent' : theme.colors.gray[3],
            opacity: 0.8,
            backgroundColor: 'transparent',
        },
    },

    input: {
        textAlign: 'center',
        paddingRight: `${theme.spacing.sm}px !important`,
        paddingLeft: `${theme.spacing.sm}px !important`,
        height: 28,
        flex: 1,
    },
}));

export function QuantityInput({initialValue = 0}) {
    const {classes} = useStyles();
    const handlers = useRef();
    const [value, setValue] = useState(initialValue);

    return (
        <div className={classes.wrapper}>
            <ActionIcon
                size={28}
                variant="transparent"
                onClick={() => handlers.current.decrement()}
                className={classes.control}
                onMouseDown={(event) => event.preventDefault()}
            >
                <Minus size={16}/>
            </ActionIcon>

            <NumberInput
                variant="unstyled"
                handlersRef={handlers}
                value={value}
                onChange={setValue}
                classNames={{input: classes.input}}
            />

            <ActionIcon
                size={28}
                variant="transparent"
                onClick={() => handlers.current.increment()}
                className={classes.control}
                onMouseDown={(event) => event.preventDefault()}
            >
                <Plus size={16}/>
            </ActionIcon>
        </div>
    );
}