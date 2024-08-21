import React from "react";
import "./index.css";
import ReactLogo from "../../assets/react.svg";
import { Box, Button, CircularProgress } from "@mui/material";
import { SignInDialog, SignUpDialog } from "../../components/Dialogs";
import { InitialUserInfo, TUserInfo, UserInfoContext } from "../../Contexts";
import URLShortener from "./URL-Shortener";

export default function FakeLogin() {
  const { userInfo, setUserInfo } = React.useContext(UserInfoContext);
  const [openedSignInDialog, setOpenedSignInDialog] = React.useState(false);
  const [openedSignUpDialog, setOpenedSignUpDialog] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  const handleOpen = (dialog: string) => {
    if (dialog === "sign_in") return setOpenedSignInDialog(true);
    if (dialog === "sign_up") return setOpenedSignUpDialog(true);
  };

  React.useEffect(() => {
    const storedUserInfo = JSON.parse(
      window.localStorage.getItem("user_info") as string
    ) as TUserInfo;

    if (!storedUserInfo) {
      return setLoading(false);
    }

    if (storedUserInfo?.logged) {
      setUserInfo(storedUserInfo);
      return setLoading(false);
    }
  }, []);

  return (
    <div className="container">
      <header>
        <div className="grid_container">
          <div className="top_bar">
            <div className="top_bar_left">
              <a href="https://iwncr.online">
                <img src={ReactLogo} alt="logo_site" />
              </a>
              <p>Encurtador de URL do Irwyng</p>
            </div>
            <div className="top_bar_right">
              <div className="log_in">
                <div></div>
                <div>
                  {userInfo?.logged ? (
                    <Button
                      onClick={() => {
                        setUserInfo(InitialUserInfo);
                        window.localStorage.removeItem("user_info");
                      }}
                      variant="contained"
                      style={{ backgroundColor: "rgb(236, 58, 58)" }}
                    >
                      Sair
                    </Button>
                  ) : null}

                  {!userInfo?.logged ? (
                    <Box display={"flex"} flexDirection={"row"} gap={2}>
                      <Button
                        onClick={() => handleOpen("sign_in")}
                        variant="contained"
                      >
                        Entrar
                      </Button>
                      <Button
                        onClick={() => handleOpen("sign_up")}
                        variant="contained"
                      >
                        Criar Usuário
                      </Button>
                    </Box>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      <main>
        {loading ? (
          <Box>
            <CircularProgress size={40} color="inherit" />
          </Box>
        ) : (
          <>{userInfo?.logged ? <URLShortener /> : <p>Não está logado!</p>}</>
        )}
      </main>
      <SignInDialog
        open={openedSignInDialog}
        onClose={() => setOpenedSignInDialog(false)}
      />
      <SignUpDialog
        open={openedSignUpDialog}
        onClose={() => setOpenedSignUpDialog(false)}
      />
      <footer>@copyright Irwyng Cardoso Ramos!</footer>
    </div>
  );
}
