import { Route, Routes, useNavigate } from "@solidjs/router";
import { onMount } from "solid-js";
import useState from "./hooks/state";
import LoginPage from "./pages/authentication/login.page";
import RegisterPage from "./pages/authentication/register.page";

const App = () => {
  const [user, setUser] = useState("user");

  const navigate = useNavigate();

  onMount(() => {
    if (!user.data) setUser({ authenticated: false, data: {} });
  });

  return (
    <div class="flex flex-col w-screen h-screen text-black dark:text-white bg-neutral-900 select-none app-bg">
      {user.authenticated && (
        <div class="flex items-center justify-between p-2">
          <div class="cookie text-2xl text-lime-400">Purpose360</div>

          <div class="flex items-center space-x-4"></div>
        </div>
      )}
      <div class="flex flex-col w-screen h-full overflow-y-auto">
        <Routes>
          {!user.authenticated && <Route path="/" element={LoginPage} />}
          {!user.authenticated && (
            <Route path="/create-account" element={RegisterPage} />
          )}

          <Route
            path="**"
            component={() => {
              onMount(() => navigate("/"));
            }}
          />
        </Routes>
      </div>
      <div class="flex items-center justify-center space-x-5 p-1 border-t border-neutral-700 bg-neutral-900">
        <div class="cookie text-xl text-lime-400">
          Developed by Connor Davis
        </div>
      </div>
    </div>
  );
};

export default App;
