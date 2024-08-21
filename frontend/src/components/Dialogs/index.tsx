import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  CircularProgress,
  Box,
} from "@mui/material";
import { UserInfoContext } from "../../Contexts";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export interface SimpleDialogProps {
  open: boolean;
  onClose: () => void;
}

export function SignInDialog({ onClose, open }: SimpleDialogProps) {
  const [username, setUsername] = React.useState("");
  const [userDoesNotExist, setUserDoesNotExist] = React.useState(false);

  const { handleSubmitSignIn, setLoading, loading, setUserInfo } =
    React.useContext(UserInfoContext);

  const handleClose = () => {
    setUsername("");
    return onClose();
  };

  const handleSubmit = () => {
    setLoading(true);
    handleSubmitSignIn(username)
      .then((response) => {
        toast.success("Usuário logado com sucesso!", {
          containerId: "app_root",
        });
        setUserInfo({ logged: true, ...response.data });
        window.localStorage.setItem(
          "user_info",
          JSON.stringify({ logged: true, ...response.data })
        );
        setUserDoesNotExist(false);
        handleClose();
      })
      .catch((error) => {
        console.error(error);
        if (error?.response?.data?.message === "Usuário não cadastrado!")
          toast.error(error?.response?.data?.message, {
            containerId: "sign_in_dialog",
          });
      })
      .finally(() => setLoading(false));
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <ToastContainer containerId={"sign_in_dialog"} />
      <DialogTitle>Entre na sua conta!</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Para fazer o login nesta simples página, é necessário apenas o nome de
          usuario da conta que foi escolhido na criação da mesma. Caso não a
          possua, crie uma através do botão "CRIAR USUÁRIO"!
        </DialogContentText>
        <TextField
          autoFocus
          required
          margin="dense"
          name="username"
          label="Nome de Usuário"
          fullWidth
          variant="standard"
          value={username}
          onChange={(e) => {
            if (userDoesNotExist) setUserDoesNotExist(false);
            setUsername(e.target.value);
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Fechar</Button>
        {loading ? (
          <Box
            display={"flex"}
            width={80}
            justifyContent={"center"}
            alignItems={"center"}
            marginLeft={"0px !important"}
          >
            <CircularProgress size={20} />
          </Box>
        ) : (
          <Button
            style={{ width: 80 }}
            disabled={!username || loading}
            onClick={() => handleSubmit()}
          >
            Entrar
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

export function SignUpDialog({ onClose, open }: SimpleDialogProps) {
  const [username, setUsername] = React.useState("");
  const { handleSubmitSignUp, setLoading, loading, setUserInfo } =
    React.useContext(UserInfoContext);

  const handleClose = () => {
    setUsername("");
    return onClose();
  };

  const handleSubmit = () => {
    setLoading(true);
    handleSubmitSignUp(username)
      .then(({ data: { user } }) => {
        toast.success(
          "Usuário criado com sucesso, foi feito um login automático para melhorar sua experiência!",
          { containerId: "app_root" }
        );
        setUserInfo({ logged: true, username: user.username, urls: user.urls });
        window.localStorage.setItem(
          "user_info",
          JSON.stringify({
            logged: true,
            username: user.username,
            urls: user.urls,
          })
        );
        handleClose();
      })
      .catch((error) => {
        console.error(error);
        if (
          error?.response?.data?.message ===
          "Usuário já existente, faça login ou crie outro!"
        )
          toast.error("Usuário já existente, faça login ou crie outro!", {
            containerId: "sign_up_dialog",
          });
      })
      .finally(() => setLoading(false));
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <ToastContainer containerId={"sign_up_dialog"} />
      <Box width={500}>
        <DialogTitle>Crie seu Usuário!</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            required
            margin="dense"
            name="username"
            label="Nome de Usuário"
            fullWidth
            variant="standard"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Fechar</Button>
          {loading ? (
            <Box
              display={"flex"}
              width={80}
              justifyContent={"center"}
              alignItems={"center"}
              marginLeft={"0px !important"}
            >
              <CircularProgress size={20} />
            </Box>
          ) : (
            <Button
              style={{ width: 80 }}
              disabled={!username || loading}
              onClick={() => handleSubmit()}
            >
              Criar Usuário
            </Button>
          )}
        </DialogActions>
      </Box>
    </Dialog>
  );
}
