import { Stack, Box, Typography } from '@mui/material';

const FloatingActionButton = ({ title, action }: {title: string, action: () => void}) => {
    return (
        <Stack display={"flex"} alignItems={"center"}>
            <Box
                display={"flex"}
                justifyContent={"center"}
                position={"fixed"}
                bottom={10}
                mb={"16px"}
                border={"1px solid var(--blue)"}
                bgcolor={"var(--blue)"}
                color={"#fff"}
                borderRadius={6}
                px={3}
                py={1}
                className="pointer"
                sx={{ ":hover": { opacity: 0.9 } }}
                onClick={() => action()}
            >
                <Typography fontSize={14}>{title}</Typography>
            </Box>
        </Stack>
    )
}

export default FloatingActionButton;