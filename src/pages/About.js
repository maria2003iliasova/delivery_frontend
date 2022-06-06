import React from 'react';
import {Accordion, Container, createStyles, List, Paper, Text, Title} from '@mantine/core';
import {Layout} from "../components/Layout";

const useStyles = createStyles((theme, _params, getRef) => {
    const control = getRef('control');

    return {
        wrapper: {
            paddingTop: theme.spacing.xl,
            paddingBottom: theme.spacing.xl * 2,
            minHeight: 650,
        },

        title: {
            fontWeight: 400,
            marginBottom: theme.spacing.xl * 1.5,
        },

        control: {
            ref: control,

            '&:hover': {
                backgroundColor: 'transparent',
            },
        },

        item: {
            marginTop: theme.spacing.xl,
            backgroundColor: theme.white,
            borderBottom: 0,
            borderRadius: theme.radius.md,
            boxShadow: theme.shadows.lg,
        },

        itemOpened: {
            [`& .${control}`]: {
                color: theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 4 : 6],
            },
        },
    };
});

export function About() {
    const { classes } = useStyles();
    return (
        <Layout>
            <Container size="sm" className={classes.wrapper}>
                <Title align="center" className={classes.title}>
                    О доставке
                </Title>

                <Accordion
                    iconPosition="right"
                    classNames={{
                        item: classes.item,
                        itemOpened: classes.itemOpened,
                        control: classes.control,
                    }}
                >
                    <Accordion.Item label="Сколько стоит доставка?">Стоимость доставки бесплатно.</Accordion.Item>
                    <Accordion.Item label="Сколько времени займет доставка?">Время доставки - 1 час. При большом количестве заказов, а также в случае сильной загрузки дорог, время доставки может быть увеличено до 1,5-2 часа.</Accordion.Item>
                    <Accordion.Item label="Я хочу отменить/изменить заказ, что мне делать?">
                        Если Вы по каким-то причинам передумали совершать покупку или хотите, чтобы Ваш заказ был доставлен в какое-то другое место или в иное время, то нужно сообщить об этом нашему менеджеру не позднее чем через 20 минут после оформления заказа. При этом Вам необходимо будет назвать менеджеру Вашу фамилию и телефон, и указать изменения в заказе;
                    </Accordion.Item>
                    <Accordion.Item label="Мне не понравилось качество, как я могу об этом сообщить?">
                        При возникновении претензий по качеству заказанной продукции позвоните по номеру:
                        +7 (922) 530-30-25
                    </Accordion.Item>
                    <Accordion.Item label="Каким образом производится доставка?">
                        Доставку заказов наша компания осуществляет автомобильным транспортом, в специальных коробочках или ланч-боксах.
                        Мы оставляем за собой право упаковывать в один ланч — бокс сразу несколько порций
                    </Accordion.Item>
                    <Accordion.Item label="Как происходит оплата?">
                        За доставленный курьером заказ клиент расплачивается наличными в рублях или банковской картой, если банковский терминал работает в месте нахождения Клиента
                    </Accordion.Item>
                </Accordion>

                <Title align="center" className={classes.title} my={"xl"}>
                    О возврате
                </Title>
                <Paper shadow={"lg"} p={"md"}>
                    <Text mb={"sm"}>
                        Процедура возврата товара регламентируется статьей 26.1 федерального закона «О защите прав потребителей».
                    </Text>
                    <List withPadding>
                        <List.Item>
                            Потребитель вправе отказаться от товара в любое время до его передачи, а после передачи товара - в течение семи дней;
                        </List.Item>
                        <List.Item>
                            Возврат товара надлежащего качества возможен в случае, если сохранены его товарный вид,
                            потребительские свойства, а также документ, подтверждающий факт и условия покупки указанного
                            товара;
                        </List.Item>
                        <List.Item>
                            Потребитель не вправе отказаться от товара надлежащего качества, имеющего
                            индивидуально-определенные свойства, если указанный товар может быть использован
                            исключительно приобретающим его человеком;
                        </List.Item>
                        <List.Item>
                            При отказе потребителя от товара продавец должен возвратить ему денежную сумму, уплаченную
                            потребителем по договору, за исключением расходов продавца на доставку от потребителя
                            возвращенного товара, не позднее чем через десять дней со дня предъявления потребителем
                            соответствующего требования.
                        </List.Item>
                    </List>
                </Paper>
            </Container>
        </Layout>
    );
}