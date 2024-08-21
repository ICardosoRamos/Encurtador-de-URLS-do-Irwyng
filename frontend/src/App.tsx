import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import FakeLogin from "./screens/Initial";
import { UserInfoContextProvider } from "./Contexts";
import ShortenedURLRedirector from "./screens/ShortenedURLRedirector";

const router = createBrowserRouter([
  {
    path: "/",
    element: <FakeLogin />,
  },
  {
    path: ":idUrl",
    element: <ShortenedURLRedirector />,
  },
]);

function App() {
  return (
    <UserInfoContextProvider>
      <RouterProvider router={router} />
    </UserInfoContextProvider>
  );
}

export default App;
