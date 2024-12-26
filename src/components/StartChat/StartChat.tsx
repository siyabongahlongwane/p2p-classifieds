import { MessageOutlined } from '@mui/icons-material'
import { Stack, Typography } from '@mui/material'

interface ChatProps {
    text?: string
}
const StartChat = ({ text }: ChatProps) => {
    return (
        <Stack direction="column" spacing={1} alignItems="center">
            <MessageOutlined htmlColor="var(--blue)" />
            <Typography variant="subtitle2" component="small" fontSize={12} color="gray" fontWeight={300} >Message {text}</Typography>
        </Stack>
    )
}

export default StartChat