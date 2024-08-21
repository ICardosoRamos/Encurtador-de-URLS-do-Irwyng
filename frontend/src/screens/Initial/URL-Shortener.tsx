import React from "react";
import {
  Box,
  Button,
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
import { ContentCopy } from "@mui/icons-material";
import { TUrl, UserInfoContext } from "../../Contexts";
import useFetch from "../../axios";

const CssTextField = styled(TextField)({
  marginTop: 0,
  marginBottom: 0,
  "& label.Mui-focused": {
    color: "#fff",
  },
  "& label": {
    color: "#fff",
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: "#B2BAC2",
  },
  "& .MuiOutlinedInput-root": {
    color: "#fff",
    "& fieldset": {
      borderColor: "#E0E3E7",
    },
    "&:hover fieldset": {
      borderColor: "#B2BAC2",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#6F7E8C",
    },
    "& .MuiInputBase-input": {
      caretColor: "#fff", // Change cursor color here
    },
  },
});

export default function URLShortener() {
  const [urlToShort, setUrlToShort] = React.useState("");
  const { userInfo, setUserInfo } = React.useContext(UserInfoContext);
  const axios = useFetch();

  const handleSubmitShortUrl = () => {
    if (!urlToShort) return;
    axios
      .post<
        { originalUrl: string; username: string },
        { data: { urls: TUrl[]; message: string } }
      >("urls", {
        originalUrl: urlToShort,
        username: userInfo.username,
      })
      .then((response) => {
        setUserInfo((prevState) => ({
          ...prevState,
          urls: response.data.urls,
        }));
        setUrlToShort("");
      })
      .catch((error) => {
        console.error(error);
      });
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
      </Box>
      {userInfo.urls.length ? (
        <Box>
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
                  <TableCell align="right">Ações</TableCell>
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
                        <Button startIcon={<ContentCopy />} />
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      ) : (
        <Box>
          <h3>Você ainda não possui URLS encurtadas!</h3>
        </Box>
      )}
    </Box>
  );
}
