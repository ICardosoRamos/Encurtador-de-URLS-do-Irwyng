import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import FakeLogin from "./screens/Initial";
import { UserInfoContextProvider } from "./Contexts";

const router = createBrowserRouter([
  {
    path: "/",
    element: <FakeLogin />,
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
