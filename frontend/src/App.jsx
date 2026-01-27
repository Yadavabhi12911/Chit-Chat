import { RouterProvider } from "react-router-dom";
import { myRoutes } from "./context/MyRoute.jsx";

const App = () => {
  return (
    <div>
      <RouterProvider router={myRoutes} />
    </div>
  );
};

export default App;
