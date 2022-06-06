import {AppShell} from "@mantine/core";
import {HeaderWithNav} from "./Header";
import {Footer} from "./Footer";

export const Layout = ({children, withPadding = true}) => {
    const padding = withPadding ? {} : {
        padding: 0
    }
    return <AppShell
        padding="md"
        header={<HeaderWithNav/>}
        footer={<Footer/>}
        styles={(theme) => ({
            main: {
                backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[2],
                minHeight: "87vh",
                ...padding
            },
        })}
    >
        {children}
    </AppShell>
}