import React from "react";
import "./index.css";
import ReactLogo from "../../assets/react.svg";
import { Box, Button, CircularProgress } from "@mui/material";
import { SignInDialog, SignUpDialog } from "../../components/Dialogs";
import { InitialUserInfo, TUserInfo, UserInfoContext } from "../../Contexts";
import URLShortener from "./URL-Shortener";
import { toast } from "react-toastify";

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
                    <Box
                      display={"flex"}
                      flexDirection={"row"}
                      alignItems={"baseline"}
                      gap={2}
                    >
                      <h3>Bem Vindo, {userInfo.username}</h3>
                      <Button
                        onClick={() => {
                          toast.success("Saiu da conta com sucesso!", {
                            containerId: "app_root",
                          });
                          setUserInfo(InitialUserInfo);
                          window.localStorage.removeItem("user_info");
                        }}
                        variant="contained"
                        style={{ backgroundColor: "rgb(236, 58, 58)" }}
                      >
                        Sair
                      </Button>
                    </Box>
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
          <Box color={"#262323"}>
            {userInfo?.logged ? (
              <URLShortener />
            ) : (
              <p>Entre na sua conta para continuar!</p>
            )}
          </Box>
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
      <footer>
        <p>@copyright Irwyng Cardoso Ramos!</p>
      </footer>
    </div>
  );
}
