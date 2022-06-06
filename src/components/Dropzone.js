import {Photo, Upload, X} from "tabler-icons-react";
import {Group, Image, Text} from "@mantine/core";
import {BASE_API_URL} from "../constants/baseApiUrl";

function getIconColor(status, theme) {
    return status.accepted
        ? theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 4 : 6]
        : status.rejected
            ? theme.colors.red[theme.colorScheme === 'dark' ? 4 : 6]
            : theme.colorScheme === 'dark'
                ? theme.colors.dark[0]
                : theme.colors.gray[7];
}

function ImageUploadIcon({status, ...props}) {
    if (status.accepted) {
        return <Upload {...props} />;
    }

    if (status.rejected) {
        return <X {...props} />;
    }

    return <Photo {...props} />;
}

export const dropzoneChildren = (status, theme, image = null) => (
    <Group position="center" spacing="xl" style={{pointerEvents: 'none'}}>
        {image.data || image.file ? <Image alt={"Upload image"} src={!image.file ? BASE_API_URL + "/images/" + image.data : image.data}/> : <>

            <ImageUploadIcon status={status} style={{color: getIconColor(status, theme)}} size={80}/>

            <Group position={"center"}>
                <Text size="xl" inline>
                    Drag images here or click to select files
                </Text>
                <Text size="sm" color="dimmed" inline mt={7}>
                    Only 1 image file
                </Text>
            </Group>

        </>}
    </Group>
);