import { useNavigate } from "@solidjs/router";
import { onMount } from "solid-js";

const FourOFourPage = () => {
  const navigate = useNavigate();

  return (
    <div class="flex flex-col items-center justify-center space-y-5 w-full h-full text-center p-5">
      <div class="flex flex-col">
        <div class="text-lime-400 cookie text-6xl">404</div>
        <div class="text-white text-2xl">Page Not Found.</div>
      </div>
      <div
        class="px-3 py-2 bg-lime-400 text-black rounded"
        onClick={() => navigate("/")}
      >
        Go Home
      </div>
    </div>
  );
};

export default FourOFourPage;
