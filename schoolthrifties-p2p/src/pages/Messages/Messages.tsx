import { Stack, Typography } from "@mui/material";
import ChatList from "../../components/Chat/ChatList";
import SearchUsers from "../../components/Chat/SearchUsers";
import { useChatStore } from "../../stores/useChatStore";
import { ChatBubbleOutline } from "@mui/icons-material";
import ActiveChat from "../../components/Chat/ActiveChat";
import { useContext } from "react";
import { UserContext } from "../../context/User/UserContext";


const ChatApp: React.FC = () => {
  const { activeChat } = useChatStore();
  const { user: { user_id } } = useContext(UserContext);
  return (
    <Stack display={'grid'} gridTemplateColumns={'1fr 3fr'} direction="row" spacing={2} >
      <Stack display={'flex'} flexDirection={'column'} gap={2}>
        <SearchUsers />
        <ChatList />
      </Stack>

      <Stack display={'flex'} flexDirection={'column'} gap={2}>
        {
          !activeChat
            ?
            <Stack display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'} height={'100%'}>
              <ChatBubbleOutline fontSize="large" />
              <Typography color="gray" fontSize={18} variant={'body1'}>Select a chat / user to start messaging</Typography>
            </Stack>
            :
            <ActiveChat chat_id={activeChat} user_id={user_id} />
        }
      </Stack>
    </Stack>
  );
};

export default ChatApp;
