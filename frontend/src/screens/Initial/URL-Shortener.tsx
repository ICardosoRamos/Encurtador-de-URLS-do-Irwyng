import React from "react";
import {
  Box,
  Button,
  CircularProgress,
  Paper,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
} from "@mui/material";
import { ContentCopy, Delete } from "@mui/icons-material";
import { TUrl, UserInfoContext } from "../../Contexts";
import useFetch from "../../axios";
import { toast } from "react-toastify";

const CssTextField = styled(TextField)({
  marginTop: 0,
  marginBottom: 0,
  "& label.Mui-focused": {
    color: "#1c45e5",
  },
  "& label": {
    color: "#1c45e5",
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: "#1c45e5",
  },
  "& .MuiOutlinedInput-root": {
    color: "#fff",
    "& fieldset": {
      borderColor: "#1c45e5",
    },
    "&:hover fieldset": {
      borderColor: "#1c45e5",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#1c45e5",
    },
    "& .MuiInputBase-input": {
      color: "#000",
    },
  },
});

const CssButton = styled(Button)({
  "& span": {
    margin: 0,
  },
});

export default function URLShortener() {
  const [urlToShort, setUrlToShort] = React.useState("");
  const { userInfo, setUserInfo, loading, setLoading } =
    React.useContext(UserInfoContext);
  const axios = useFetch();

  const handleSubmitShortUrl = () => {
    if (!urlToShort) return;
    setLoading(true);
    axios
      .post<
        { originalUrl: string; username: string },
        { data: { urls: TUrl[]; message: string } }
      >("urls", {
        originalUrl: urlToShort,
        username: userInfo.username,
      })
      .then((response) => {
        toast.success("URL encurtada com sucesso!", {
          containerId: "app_root",
        });
        setUserInfo((prevState) => ({
          ...prevState,
          urls: response.data.urls,
        }));
        window.localStorage.setItem(
          "user_info",
          JSON.stringify({ ...userInfo, urls: response.data.urls })
        );
        setUrlToShort("");
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => setLoading(false));
  };

  const handleSubmitEraseShortenedURL = (urlId: string, username: string) => {
    setLoading(true);
    axios
      .delete_record<
        { idUrl: string; username: string },
        { data: { urls: TUrl[]; message: string } }
      >("urls", { idUrl: urlId, username: username })
      .then(({ data }) => {
        toast.success("URL excluída com sucesso!", {
          containerId: "app_root",
        });
        setUserInfo((prevState) => ({
          ...prevState,
          urls: data.urls,
        }));
        window.localStorage.setItem(
          "user_info",
          JSON.stringify({ ...userInfo, urls: data.urls })
        );
      })
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  };

  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
      gap={6}
      alignItems={"center"}
    >
      <Box width={500} display={"flex"} flexDirection={"row"} gap={2}>
        <CssTextField
          id="custom-css-outlined-input"
          inputMode="url"
          autoFocus
          margin="dense"
          name="url_to_short"
          label="Insira sua URL para encurtá-la"
          fullWidth
          variant="outlined"
          value={urlToShort}
          onChange={(e) => {
            setUrlToShort(e.target.value);
          }}
        />
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
            onClick={() => handleSubmitShortUrl()}
            style={{ height: "inherit", width: 180 }}
            size="small"
            variant="contained"
            disabled={!urlToShort}
          >
            <p style={{ color: !urlToShort ? "#747474" : "inherit" }}>
              Encurtar URL
            </p>
          </Button>
        )}
      </Box>
      {userInfo.urls.length ? (
        <Box color={"#262323"}>
          <h3>URLS Encurtadas</h3>
          <TableContainer
            component={Paper}
            style={{ backgroundColor: "#efefef", height: 400, width: 800 }}
          >
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell align="left">URL Original</TableCell>
                  <TableCell align="left">URL Encurtada</TableCell>
                  <TableCell align="center">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {userInfo.urls.map((url, index) => (
                  <TableRow
                    key={url.idUrl}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {index + 1}
                    </TableCell>
                    <TableCell
                      align="left"
                      style={{ width: 300, wordBreak: "break-word" }}
                    >
                      {url.originalUrl}
                    </TableCell>
                    <TableCell align="left">
                      {"https://iwncr.online/" + url.idUrl}
                    </TableCell>
                    <TableCell align="right" style={{ padding: 0 }}>
                      <Tooltip title="Copiar URL encurtada">
                        <CssButton
                          startIcon={<ContentCopy />}
                          onClick={() => {
                            toast.success(
                              "URL encurtada copiada com sucesso para area de tansferência!",
                              {
                                containerId: "app_root",
                              }
                            );
                            navigator.clipboard.writeText(
                              "https://iwncr.online/" + url.idUrl
                            );
                          }}
                        />
                      </Tooltip>
                      <Tooltip title="Excluir URL encurtada">
                        <Box
                          display={"flex"}
                          width={80}
                          justifyContent={"center"}
                          alignItems={"center"}
                          marginLeft={"0px !important"}
                        >
                          {loading ? (
                            <CircularProgress size={20} />
                          ) : (
                            <CssButton
                              startIcon={<Delete color="error" />}
                              onClick={() => {
                                handleSubmitEraseShortenedURL(
                                  url.idUrl,
                                  userInfo.username
                                );
                              }}
                            />
                          )}
                        </Box>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      ) : (
        <Box color={"#262323"}>
          <h3>Você ainda não possui URLS encurtadas!</h3>
        </Box>
      )}
    </Box>
  );
}
