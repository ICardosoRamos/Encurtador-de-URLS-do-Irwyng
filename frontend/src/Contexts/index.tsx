import React from "react";
import useFetch from "../axios";

export type TUrl = { id: number; originalUrl: string; idUrl: string };

export type TUserInfo = { logged: boolean; username: string; urls: TUrl[] };

type TResponseSignIn = {
  data: {
    username: string;
    urls: TUrl[];
  };
};

type TResponseSignUp = {
  data: {
    user: {
      username: string;
      urls: TUrl[];
    };
    message: string;
  };
};

type TUserInfoContext = {
  userInfo: TUserInfo;
  setUserInfo: React.Dispatch<React.SetStateAction<TUserInfo>>;
  handleSubmitSignIn: (username: string) => Promise<TResponseSignIn>;
  handleSubmitSignUp: (username: string) => Promise<TResponseSignUp>;
  handleSubmitSignOut: () => void;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

export const InitialUserInfo: TUserInfo = {
  logged: false,
  username: "",
  urls: [],
};

export const UserInfoContext = React.createContext<TUserInfoContext>({
  userInfo: InitialUserInfo,
  setUserInfo: () => {},
  handleSubmitSignIn: async () => ({ data: { username: "", urls: [] } }),
  handleSubmitSignUp: async () => ({
    data: { user: { username: "", urls: [] }, message: "" },
  }),
  handleSubmitSignOut: () => {},
  loading: false,
  setLoading: () => {},
});

export const UserInfoContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [userInfo, setUserInfo] = React.useState(InitialUserInfo);
  const [loading, setLoading] = React.useState(false);
  const axios = useFetch();

  const handleSubmitSignIn = React.useCallback(async (username: string) => {
    const response = await axios.post<{ username: string }, TResponseSignIn>(
      "login",
      {
        username: username,
      }
    );

    return response;
  }, []);

  const handleSubmitSignUp = React.useCallback(async (username: string) => {
    const response = await axios.post<{ username: string }, TResponseSignUp>(
      "users",
      {
        username: username,
      }
    );

    return response;
  }, []);

  const handleSubmitSignOut = React.useCallback(() => {
    setUserInfo(InitialUserInfo);
  }, []);

  const providerValue = React.useMemo(
    () => ({
      userInfo: userInfo,
      setUserInfo: setUserInfo,
      handleSubmitSignIn: handleSubmitSignIn,
      handleSubmitSignUp: handleSubmitSignUp,
      handleSubmitSignOut: handleSubmitSignOut,
      loading: loading,
      setLoading: setLoading,
    }),
    [
      userInfo,
      setUserInfo,
      handleSubmitSignIn,
      handleSubmitSignUp,
      handleSubmitSignOut,
      loading,
      setLoading,
    ]
  );

  return (
    <UserInfoContext.Provider value={providerValue}>
      {children}
    </UserInfoContext.Provider>
  );
};
