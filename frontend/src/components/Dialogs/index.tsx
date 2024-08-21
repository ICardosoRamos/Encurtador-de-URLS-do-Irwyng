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
        if (
          error?.response?.data?.message ===
          "O usuário com esse nome não existe no banco, crie um primeiro e então faça login com o mesmo!"
        )
          setUserDoesNotExist(true);
      })
      .finally(() => setLoading(false));
  };

  return (
    <Dialog onClose={handleClose} open={open}>
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
          error={userDoesNotExist}
          helperText={userDoesNotExist ? "Usuário não cadastrado!" : ""}
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
  const [userAlreadyExists, setUserAlreadyExists] = React.useState(false);
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
        setUserInfo({ logged: true, username: user.username, urls: user.urls });
        window.localStorage.setItem(
          "user_info",
          JSON.stringify({
            logged: true,
            username: user.username,
            urls: user.urls,
          })
        );
        setUserAlreadyExists(false);
        handleClose();
      })
      .catch((error) => {
        console.error(error);
        if (
          error?.response?.data?.message ===
          "Este nome de usuário já existe em nossos cadastros, faça login ou, se não for você, crie outro com nome diferente!"
        )
          setUserAlreadyExists(true);
      })
      .finally(() => setLoading(false));
  };

  return (
    <Dialog onClose={handleClose} open={open}>
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
              if (userAlreadyExists) setUserAlreadyExists(false);
              setUsername(e.target.value);
            }}
            error={userAlreadyExists}
            helperText={
              userAlreadyExists
                ? "Usuário já cadastrado no sistema, por favor, escolha outro nome!"
                : ""
            }
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
