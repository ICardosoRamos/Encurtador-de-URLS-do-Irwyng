import React from "react";
import { Box, Button, CircularProgress } from "@mui/material";
import { useParams } from "react-router-dom";
import useFetch from "../../axios";
import { TUrl } from "../../Contexts";

export default function ShortenedURLRedirector() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [originalUrl, setOriginalUrl] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");

  const params = useParams();
  const axios = useFetch();

  React.useEffect(() => {
    const timer = setTimeout(() => {
      axios
        .get<{ idUrl: string }, { data: TUrl }>("urls", {
          idUrl: params?.idUrl as string,
        })
        .then(({ data }) => {
          if (data) {
            if (data.originalUrl.startsWith("http")) {
              setOriginalUrl(data.originalUrl);
              window.open("http://open.spotify.com", "_blank");
            } else if (data.originalUrl.startsWith("www")) {
              setOriginalUrl("http://" + data.originalUrl);

              window.open("http://" + data.originalUrl);
            } else if (
              !data.originalUrl.startsWith("http") ||
              !data.originalUrl.startsWith("www")
            ) {
              setOriginalUrl(data.originalUrl);
              setErrorMessage(
                "URL original inválida, deve começar com 'www' ou 'http'!"
              );
            }
          }
          setErrorMessage("Esta URL encurtada não existe ainda!");
          setIsLoading(false);
        })
        .catch((error) => console.error(error));
    }, 2000);

    // Limpeza do timeout caso o componente seja desmontado
    return () => clearTimeout(timer);
  }, []);

  return (
    <Box
      display={"flex"}
      height={"100vh"}
      flexDirection={"column"}
      justifyContent={"center"}
      alignItems={"center"}
      component={"div"}
      style={{ backgroundColor: "#0d365c" }}
    >
      {isLoading ? (
        <>
          <h3>Procurando URL encurtada e redirecionando...</h3>
          <CircularProgress size={40} />
        </>
      ) : errorMessage ? (
        <>
          <h3>{errorMessage}</h3>
          {originalUrl ? (
            <>
              <h3>URL original: {originalUrl}</h3>
              <h4>
                É necessário encurtar a URL novamente entrando na página
                principal e fazendo login!
              </h4>
            </>
          ) : (
            <h3>
              Entre na página principal, faça login e então comece a encurtar
              suas URLS!
            </h3>
          )}
        </>
      ) : (
        <>
          <h3>URL Encurtada encontrada e redirecionada!</h3>
          <Button onClick={() => window.open(originalUrl, "_blank")}>
            Entrar novamente?
          </Button>
        </>
      )}
      <Button
        onClick={() => window.open("http://iwncr.online/", "_self")}
        variant="contained"
      >
        Ir para página principal
      </Button>
    </Box>
  );
}
