import { RouterProvider } from "react-router-dom";
import { myRoutes } from "./context/MyRoute.jsx";


const App = () => {

  return (
    <div >
      <h1 className="text-3xl font-bold text-blue-950 text-center  bg-blue-200 p-4">Welcome to ChitChat...</h1>
      <RouterProvider router={myRoutes} />
    </div>
  );
};

export default App;
