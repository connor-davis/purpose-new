import { useNavigate } from "@solidjs/router";
import { createSignal } from "solid-js";
import LogoLarge from "../../assets/PurposeMainLogo.png";
import axios from "axios";
import apiUrl from "../../apiUrl";

const ForgotPasswordPage = () => {
  const navigate = useNavigate();

  const [successMessage, setSuccessMessage] = createSignal(undefined);
  const [errorMessage, setErrorMessage] = createSignal(undefined);

  const [codeValid, setCodeValid] = createSignal(false);

  const [password, setPassword] = createSignal(undefined);
  const [confirmPassword, setConfirmPassword] = createSignal(undefined);

  const [authCode, setAuthCode] = createSignal(undefined);

  const validateCode = async () => {
    setErrorMessage(undefined);

    const response = await axios.get(
      apiUrl + "authentication/resetPassword/codeVerification/" + authCode()
    );

    if (response.data === "Ok") {
      setCodeValid(true);
    } else return setErrorMessage("Failed to validate code. Please try again.");
  };

  const resetPassword = async () => {
    setErrorMessage(undefined);

    if (password() !== confirmPassword())
      return setErrorMessage("Please make sure passwords match.");

    const response = await axios.post(
      apiUrl + "authentication/resetPassword/final/" + authCode(),
      { password: password() }
    );

    if (response.data === "Ok") {
      setSuccessMessage("Your password has been reset successfully.");

      setTimeout(() => {
        setAuthCode(undefined);
        setCodeValid(false);
        setPassword(undefined);
        setConfirmPassword(undefined);
        setSuccessMessage(undefined);

        navigate("/");
      }, 1500);
    }
  };

  return (
    <div class="flex flex-col w-full h-full items-center justify-center p-5">
      <div class="flex flex-col space-y-5 p-5 w-full md:w-96 rounded-lg bg-neutral-100 text-black border-l border-t border-r border-b border-neutral-700">
        <div class="flex flex-col items-center justify-center space-y-5">
          <img src={LogoLarge} class="h-44" />
          <div class="text-2xl text-neutral-600">
            {codeValid() ? "Reset Password" : "Enter Code"}
          </div>
          <div class="text-neutral-500">
            {codeValid()
              ? "You may set your new password now."
              : "Request a code from the system admin to reset your password."}
          </div>
          {successMessage() && (
            <div class="text-lime-500">{successMessage()}</div>
          )}
          {errorMessage() && <div class="text-red-500">{errorMessage()}</div>}
        </div>
        <div class="flex flex-col items-center justify-center space-y-3 w-full">
          {codeValid() ? (
            <div class="flex flex-col items-center justify-center space-y-2 w-full">
              <input
                type="password"
                class="px-3 py-2 w-full bg-neutral-100 text-black border-l border-t border-r border-b border-neutral-400 rounded outline-none"
                placeholder="Your password"
                value={password() || ""}
                onChange={(event) => setPassword(event.target.value)}
              />
              <input
                type="password"
                class="px-3 py-2 w-full bg-neutral-100 text-black border-l border-t border-r border-b border-neutral-400 rounded outline-none"
                placeholder="Confirm password"
                value={confirmPassword() || ""}
                onChange={(event) => setConfirmPassword(event.target.value)}
              />
            </div>
          ) : (
            <div class="flex flex-col items-center justify-center space-y-2 w-full">
              <input
                type="text"
                class="px-3 py-2 w-full bg-neutral-100 text-black border-l border-t border-r border-b border-neutral-400 rounded outline-none"
                placeholder="Auth Code"
                value={authCode() || ""}
                onChange={(event) => setAuthCode(event.target.value)}
              />
            </div>
          )}
        </div>
        <div class="flex flex-col items-center justify-center space-y-3">
          {codeValid() ? (
            <div
              class="flex items-center justify-center w-full py-2 bg-lime-400 text-black rounded cursor-pointer"
              onClick={() => resetPassword()}
            >
              Reset Password
            </div>
          ) : (
            <div
              class="flex items-center justify-center w-full py-2 bg-lime-400 text-black rounded cursor-pointer"
              onClick={() => validateCode()}
            >
              Validate Code
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
