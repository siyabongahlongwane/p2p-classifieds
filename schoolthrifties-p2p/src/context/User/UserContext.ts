// UserContext.ts
import { createContext, Dispatch, SetStateAction } from "react";
import { User } from "../../typings/User.type";

interface UserContextType {
  user: User;
  setUser: Dispatch<SetStateAction<User>>;
}
const localUserString = localStorage.getItem("user");
const localUser =
  localUserString && localUserString !== "undefined"
    ? JSON.parse(localUserString)
    : null;

export const UserContext = createContext<UserContextType>(localUser);
