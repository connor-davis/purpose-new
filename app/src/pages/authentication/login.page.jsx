import { useNavigate } from "@solidjs/router";
import LogoLarge from "../../assets/PurposeMainLogo.png";

const LoginPage = () => {
  const navigate = useNavigate();

  return (
    <div class="flex flex-col w-full h-full items-center justify-center p-5">
      <div class="flex flex-col space-y-5 p-5 w-full md:w-96 rounded-lg bg-neutral-100 text-black border-l border-t border-r border-b border-neutral-700">
        <div class="flex flex-col items-center justify-center space-y-5">
          <img src={LogoLarge} class="h-44" />
          <div class="cookie text-2xl text-neutral-600">Authenticate</div>
        </div>
        <div class="flex flex-col items-center justify-center space-y-3 w-full">
          <div class="flex flex-col items-center justify-center space-y-2 w-full">
            <input
              type="email"
              class="px-3 py-2 w-full bg-neutral-100 text-black border-l border-t border-r border-b border-neutral-400 rounded outline-none"
              placeholder="Your email address"
            />
          </div>
          <div class="flex flex-col items-center justify-center space-y-2 w-full">
            <input
              type="password"
              class="px-3 py-2 w-full bg-neutral-100 text-black border-l border-t border-r border-b border-neutral-400 rounded outline-none"
              placeholder="Your password"
            />
          </div>
        </div>
        <div class="flex flex-col items-center justify-center space-y-3">
          <div class="flex flex-col space-y-1 w-full">
            <div class="flex items-center justify-center w-full py-2 bg-lime-400 text-black rounded cursor-pointer">
              Login
            </div>
            <div class="flex items-center justify-center w-full text-neutral-600 hover:text-lime-400 transition-all duration-300 ease-in-out cursor-pointer">
              Forgot password
            </div>
          </div>
          <div class="flex items-center justify-center w-full py-2 text-neutral-600 space-y-2">
            Don't have an account?{" "}
            <span
              class="pl-2 hover:text-lime-400 transition-all duration-300 ease-in-out cursor-pointer"
              onclick={() => navigate("/create-account")}
            >
              Create One
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
