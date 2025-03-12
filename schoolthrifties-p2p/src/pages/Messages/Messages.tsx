import ChatList from "../../components/Chat/ChatList";
import SearchUsers from "../../components/Chat/SearchUsers";


const ChatApp: React.FC = () => {
  return (
    <>
    <SearchUsers />
    <ChatList />
    </>
  );
};

export default ChatApp;
