import { useNavigate } from "@solidjs/router";
import { passwordStrength } from "check-password-strength";
import { createSignal } from "solid-js";
import LogoLarge from "../../assets/PurposeMainLogo.png";
import axios from "axios";
import apiUrl from "../../apiUrl";
import useState from "../../hooks/state";
import TermsAndConditionsModal from "../../components/modals/termsAndConditions.modal";

const RegisterPage = () => {
  const [user, setUser] = useState("user");

  const navigate = useNavigate();

  const [successMessage, setSuccessMessage] = createSignal(undefined);
  const [errorMessage, setErrorMessage] = createSignal(undefined);

  const [email, setEmail] = createSignal(undefined);
  const [password, setPassword] = createSignal(undefined);
  const [confirmPassword, setConfirmPassword] = createSignal(undefined);
  const [agreedToTerms, setAgreedToTerms] = createSignal(false);

  const [passwordStrengthMeter, setPasswordStrengthMeter] = createSignal({});
  const [showTermsAndConditions, setShowTermsAndConditions] =
    createSignal(false);

  const updateStrength = () => {
    const strength = passwordStrength(password());

    setPasswordStrengthMeter(strength);
  };

  const register = async () => {
    setSuccessMessage(undefined);
    setErrorMessage(undefined);

    if (
      passwordStrengthMeter().value &&
      passwordStrengthMeter().value === "Too weak"
    )
      return setErrorMessage("Your password is too weak to register.");

    if (!password() || !confirmPassword() || !email())
      return setErrorMessage("Please fill in all the fields.");

    if (password() !== confirmPassword())
      return setErrorMessage("Please make sure your passwords match.");

    const response = await axios.post(apiUrl + "authentication/register", {
      email: email(),
      password: password(),
      agreedToTerms: agreedToTerms(),
    });

    if (response.data.error) return setErrorMessage(response.data.message);
    else {
      setTimeout(() => {
        setUser({
          data: response.data.user,
          token: response.data.token,
          authenticated: true,
        });

        navigate("/");
      }, 1500);

      return setSuccessMessage(response.data.message);
    }
  };

  return (
    <div class="flex flex-col w-full h-full items-center justify-center p-5">
      {showTermsAndConditions() && (
        <TermsAndConditionsModal
          agreed={() => {
            setShowTermsAndConditions(false);
            setAgreedToTerms(true);
          }}
          disagreed={() => {
            setShowTermsAndConditions(false);
            setAgreedToTerms(false);
          }}
        />
      )}
      <div class="flex flex-col space-y-5 p-5 w-full md:w-96 rounded-lg bg-neutral-100 text-black border-l border-t border-r border-b border-neutral-700">
        <div class="flex flex-col items-center justify-center space-y-5">
          <img src={LogoLarge} class="h-44" />
          <div class="cookie text-2xl text-neutral-600">Create An Account</div>
          {successMessage() && (
            <div class="text-lime-500">{successMessage()}</div>
          )}
          {errorMessage() && <div class="text-red-500">{errorMessage()}</div>}
        </div>
        <div class="flex flex-col items-center justify-center space-y-3 w-full">
          <div class="flex flex-col items-center justify-center space-y-2 w-full">
            <input
              type="email"
              class="px-3 py-2 w-full bg-neutral-100 text-black border-l border-t border-r border-b border-neutral-400 rounded outline-none"
              placeholder="Your email address"
              value={email() || ""}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
          <div class="flex flex-col items-center justify-center space-y-2 w-full">
            <input
              type="password"
              class="px-3 py-2 w-full bg-neutral-100 text-black border-l border-t border-r border-b border-neutral-400 rounded outline-none"
              placeholder="Your password"
              value={password() || ""}
              onKeyUp={(event) => {
                if (event.target && event.target.value) {
                  if (event.target.value !== "") {
                    setPassword(event.target.value);
                    updateStrength();
                  } else {
                    setPassword(undefined);
                    updateStrength();
                  }
                }
              }}
            />
            {password() && (
              <div class="flex w-full h-2 rounded bg-neutral-300">
                {passwordStrengthMeter() &&
                  passwordStrengthMeter().value === "Too weak" && (
                    <div class="flex space-x-1 w-full">
                      <div class="w-1/4 bg-neutral-900 rounded"></div>
                    </div>
                  )}
                {passwordStrengthMeter() &&
                  passwordStrengthMeter().value === "Weak" && (
                    <div class="flex space-x-[1px] w-full">
                      <div class="w-1/4 bg-red-400 rounded"></div>
                      <div class="w-1/4 bg-red-400 rounded"></div>
                    </div>
                  )}
                {passwordStrengthMeter() &&
                  passwordStrengthMeter().value === "Medium" && (
                    <div class="flex space-x-[1px] w-full">
                      <div class="w-1/4 bg-amber-400 rounded"></div>
                      <div class="w-1/4 bg-amber-400 rounded"></div>
                      <div class="w-1/4 bg-amber-400 rounded"></div>
                    </div>
                  )}
                {passwordStrengthMeter() &&
                  passwordStrengthMeter().value === "Strong" && (
                    <div class="flex space-x-[1px] w-full">
                      <div class="w-1/4 bg-lime-400 rounded"></div>
                      <div class="w-1/4 bg-lime-400 rounded"></div>
                      <div class="w-1/4 bg-lime-400 rounded"></div>
                      <div class="w-1/4 bg-lime-400 rounded"></div>
                    </div>
                  )}
              </div>
            )}
          </div>
          <div class="flex flex-col items-center justify-center space-y-2 w-full">
            <input
              type="password"
              class="px-3 py-2 w-full bg-neutral-100 text-black border-l border-t border-r border-b border-neutral-400 rounded outline-none"
              placeholder="Confirm your password"
              value={confirmPassword() || ""}
              onChange={(event) => setConfirmPassword(event.target.value)}
            />
          </div>
        </div>
        <div class="flex flex-col items-center justify-center space-y-3">
          <div class="flex flex-col space-y-1 w-full">
            <div
              onClick={() => register()}
              class="flex items-center justify-center w-full py-2 bg-lime-400 text-black rounded cursor-pointer"
            >
              Register
            </div>
            <div class="flex items-center justify-center space-x-2 w-full">
              <span class="" onClick={() => setAgreedToTerms(!agreedToTerms())}>
                {agreedToTerms() ? (
                  <div class="bg-lime-500 p-1 text-black rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="w-3 h-3"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M4.5 12.75l6 6 9-13.5"
                      />
                    </svg>
                  </div>
                ) : (
                  <div class="bg-neutral-300 p-1 text-black rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="w-3 h-3"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </div>
                )}
              </span>
              <span
                class="text-neutral-600 hover:text-lime-400 transition-all duration-300 ease-in-out cursor-pointer"
                onClick={() => setShowTermsAndConditions(true)}
              >
                Terms And Conditions
              </span>
            </div>
          </div>
          <div class="flex items-center justify-center w-full py-2 text-neutral-600 space-y-2">
            Already have an account?{" "}
            <span
              class="pl-2 hover:text-lime-400 transition-all duration-300 ease-in-out cursor-pointer"
              onClick={() => navigate("/")}
            >
              Authenticate
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
