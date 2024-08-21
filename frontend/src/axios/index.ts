import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;

export default function useFetch() {
  async function get<TRequestData = unknown, TReturn = unknown>(
    url: string,
    requestParams?: TRequestData
  ) {
    return new Promise((resolve, reject) => {
      axios
        .get(url, { params: requestParams })
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          console.error(error);
          reject(error);
        });
    }) as TReturn;
  }

  async function post<TRequestData = unknown, TReturn = unknown>(
    url: string,
    requestData?: TRequestData
  ) {
    return new Promise((resolve, reject) => {
      axios
        .post(url, requestData)
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          console.error(error);
          reject(error);
        });
    }) as TReturn;
  }

  return { get, post };
}
