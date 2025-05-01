import { Stack, Typography } from "@mui/material";
import ChatList from "../../components/Chat/ChatList";
import SearchUsers from "../../components/Chat/SearchUsers";
import { useChatStore } from "../../stores/useChatStore";
import { ChatBubbleOutline } from "@mui/icons-material";
import ActiveChat from "../../components/Chat/ActiveChat";
import { useUserStore } from '../../stores/useUserStore';


const ChatApp: React.FC = () => {
  const { activeChat } = useChatStore();
  const user = useUserStore((state) => state.user);
  return (
    <Stack display={'grid'} gridTemplateColumns={'1fr 3fr'} direction="row" spacing={2} >
      <Stack display={'flex'} flexDirection={'column'} gap={2}>
        {/* <SearchUsers /> */}
        <ChatList />
      </Stack>

      <Stack display={'flex'} flexDirection={'column'} gap={2}>
        {
          !activeChat
            ?
            <Stack display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'} height={'100%'}>
              <ChatBubbleOutline fontSize="large" />
              <Typography color="gray" fontSize={16} variant={'body1'}>Open a product and click on 'Message Seller' to start a conversation.</Typography>
            </Stack>
            :
            <ActiveChat chat_id={activeChat} currentUserId={user?.user_id as number} />
        }
      </Stack>
    </Stack>
  );
};

export default ChatApp;
