// UserProvider.tsx
import { ReactNode, useState } from "react";
import { UserContext } from "./UserContext";

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const localUserString = localStorage.getItem("user");
  const localUser =
    localUserString && localUserString !== "undefined"
      ? JSON.parse(localUserString)
      : null;
  const [user, setUser] = useState(localUser);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
