import {
    Box,
    Button,
    Group,
    LoadingOverlay,
    MultiSelect,
    NumberInput,
    Textarea,
    TextInput,
    useMantineTheme
} from "@mantine/core";
import {Dropzone, IMAGE_MIME_TYPE} from "@mantine/dropzone";
import {dropzoneChildren} from "./Dropzone";
import {useEffect, useState} from "react";
import {useForm} from "@mantine/form";
import axios from "axios";
import {BASE_API_URL} from "../constants/baseApiUrl";
import {CurrencyRubel} from "tabler-icons-react";
import {useDispatch} from "react-redux";
import {createFood, updateFood} from "../app/menuSlice";

export function FoodForm({food = null}) {
    const dispatch = useDispatch()
    const theme = useMantineTheme();
    const [loading, setLoading] = useState(false)
    const [categories, setCategories] = useState([])

    useEffect(() => {
        axios.get(BASE_API_URL + "/categories").then(res => {
            setCategories(res.data.map(category => ({value: category.id.toString(), label: category.title})))
        })
    }, [])

    const uploadImage = (file) => {
        const formData = new FormData()
        formData.append('upload', file)
        return axios.post(BASE_API_URL + "/images", formData, {
            headers: {
                "Content-Type": 'multipart/form-data',
            }
        })
    }

    const uploadFood = (values, thumbnailId) => {
        const data = {
            title: values.title,
            description: values.description,
            categories: values.categories.map(Number),
            price: values.price,
            thumbnailId,
        }

        if (!food) {
            dispatch(createFood({payload: data})).then(() => setLoading(false)).catch(() => setLoading(false))
        } else {
            dispatch(updateFood({id: food.id, payload: data})).then(() => setLoading(false)).catch(() => setLoading(false))
        }
    }

    const handleSubmit = (values) => {
        setLoading(true)
        if (values.thumbnail.file) {
            uploadImage(values.thumbnail.file).then(res => {
                uploadFood(values, res.data.id)
            })
        } else {
            uploadFood(values)
        }
    }

    const createCategory = (query) => {
        axios.post(BASE_API_URL + '/categories/create', {
            title: query
        }, {
            headers: {
                authorization: `Bearer ${localStorage.getItem("accessToken")}`
            }
        }).then(res => {
            categories.push({value: res.data.id, label: res.data.title})
            form.setFieldValue('categories', [...form.values.categories, res.data.id])
        }).catch(e => {
            console.log(e)
        })
    }

    const form = useForm({
        initialValues: {
            title: "",
            description: "",
            price: 0,
            categories: [],
            thumbnail: {
                data: '',
                file: null
            }
        }
    });

    useEffect(() => {
        if (food) {
            console.log(food, categories)
            form.setValues({
                title: food.title,
                description: food.description,
                categories: food.categories.map(b => b.id.toString()),
                price: Number(food.price),
                thumbnail: {
                    data: food.thumbnailId,
                    file: null
                }
            })
        }
    }, [food])

    return <Box mx="auto" sx={{maxWidth: "30rem", position: "relative"}}>
        <LoadingOverlay visible={loading}/>
        <form onSubmit={form.onSubmit(handleSubmit)}>
            <TextInput
                required
                label="Название блюда"
                placeholder="Шашлык из курицы"
                {...form.getInputProps('title')}
            />
            <Textarea
                required
                label="Описание блюда"
                placeholder="Сочный шашлык из куриного филе, маринованного в фирменном маринаде с добавление соевого соуса"
                {...form.getInputProps('description')}
            />

            <NumberInput
                required
                label="Цена одного блюда"
                placeholder="Введите цену блюда"
                min={0}
                icon={<CurrencyRubel size={18}/>}
                {...form.getInputProps("price")}
            />

            <MultiSelect
                label="Выбор категорий"
                data={categories}
                value={form.values.categories}
                placeholder="Выбери категории"
                searchable
                creatable
                clearable
                getCreateLabel={(query) => `+ Создать ${query}`}
                onCreate={createCategory}
                {...form.getInputProps('categories')}
            />

            <Box my={"md"}>
                <Dropzone
                    onDrop={(files) => {
                        const reader = new FileReader()
                        reader.onload = (e) => {
                            form.setFieldValue('thumbnail', {
                                data: e.target.result,
                                file: files[0]
                            })
                        }

                        reader.readAsDataURL(files[0])
                    }}
                    multiple={false}
                    onReject={(files) => console.log('rejected files', files)}
                    maxSize={3 * 1024 ** 2}
                    accept={IMAGE_MIME_TYPE}
                >
                    {(status) => dropzoneChildren(status, theme, form.values.thumbnail)}
                </Dropzone>
            </Box>
            <Group position="apart" mt="md">
                <Button type="submit">Сохранить</Button>
            </Group>
        </form>
    </Box>
}