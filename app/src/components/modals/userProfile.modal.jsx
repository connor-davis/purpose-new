import { createSignal } from "solid-js";
import apiUrl from "../../apiUrl";
import useState from "../../hooks/state";
import axios from "axios";
import { useNavigate } from "@solidjs/router";

const UserProfileModal = ({ data = {}, closed = () => {} }) => {
  const navigate = useNavigate();

  const [user, setUser, clearUser] = useState("user");

  const [successMessage, setSuccessMessage] = createSignal(undefined);
  const [errorMessage, setErrorMessage] = createSignal(undefined);

  const becomeUser = async () => {
    setSuccessMessage(undefined);
    setErrorMessage(undefined);

    const response = await axios.get(apiUrl + "users/become/" + data._id, {
      headers: { Authorization: "Bearer " + user.token },
    });

    if (response.data.success) {
      const previousUser = JSON.stringify({
        authenticated: user.authenticated,
        data: user.data,
        token: user.token,
      });

      clearUser();

      setUser({
        authenticated: true,
        data: response.data.data,
        token: response.data.token,
        previousUser,
      });

      setSuccessMessage(response.data.success);

      setTimeout(() => {
        setSuccessMessage(undefined);

        navigate("/");
      }, 1500);
    } else return setErrorMessage("Failed to become user.");
  };

  return (
    <div class="absolute bg-neutral-900 bg-opacity-50 left-0 top-0 right-0 bottom-0 flex flex-col items-center justify-center animate-fade-in">
      <div class="flex flex-col w-full md:w-3/5 h-full overflow-y-auto h-full overflow-y-auto space-y-3 bg-neutral-900 border-l border-t border-r border-b border-neutral-700 rounded p-2">
        <div class="flex items-center justify-between w-full">
          <div class="cookie text-white text-2xl">User Profile</div>
          <div
            onClick={() => closed()}
            class="text-white hover:text-red-200 transition-all duration-300 ease-in-out cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
        </div>

        {successMessage() && (
          <div class="flex items-center justify-center w-full py-2 text-lime-500">
            {successMessage()}
          </div>
        )}

        {errorMessage() && (
          <div class="flex items-center justify-center w-full py-2 text-red-500">
            {errorMessage()}
          </div>
        )}

        <div class="flex flex-col items-center space-y-3 bg-white text-black rounded p-3">
          {data && data.image ? (
            <img
              src={apiUrl + "files/view/" + data.image}
              class="w-32 h-32 rounded-full"
            />
          ) : (
            data.firstName &&
            data.lastName && (
              <div class="flex flex-col items-center justify-center w-32 h-32 rounded-full bg-lime-200 cookie text-4xl font-bold">
                {data.firstName.split("")[0].toUpperCase()}{" "}
                {data.lastName.split("")[0].toUpperCase()}
              </div>
            )
          )}
          <div class="text-2xl font-bold">
            {data.firstName} {data.lastName}
          </div>
          <div class="flex w-full space-x-2 justify-between">
            <div class="flex flex-col space-y-2 w-full">
              <div class="text-lg font-medium">Business Name</div>
              <div>{data.businessName || "None"}</div>
              <div class="text-lg font-medium">Business Type</div>
              <div>{data.userType || "None"}</div>
              {data.userType === "other" && (
                <>
                  <div class="text-lg font-medium">Business Description</div>
                  <div class="break-words">
                    {data.businessDescription || "None"}
                  </div>
                </>
              )}
              {data.userType === "ecd" && (
                <>
                  <div class="text-lg font-medium">Position At ECD</div>
                  <div>{data.positionAtEcd || "None"}</div>

                  <div class="text-lg font-medium">Number Of Children</div>
                  <div>{data.numberOfChildren || 0}</div>
                </>
              )}
              <div class="text-lg font-medium">Number Of Employees</div>
              <div>{data.businessNumberOfEmployees || 0}</div>
            </div>
            <div class="w-[1px] h-full bg-neutral-300"></div>
            <div class="flex flex-col space-y-2 w-full">
              <div class="text-lg font-medium">Email</div>
              <div>{data.email || "None"}</div>
              <div class="text-lg font-medium">Age</div>
              <div>{data.age || "None"}</div>
              <div class="text-lg font-medium">Ethnicity</div>
              <div>{data.ethnicity || "None"}</div>
              <div class="text-lg font-medium">Gender</div>
              <div>{data.gender || "None"}</div>
            </div>
          </div>
          <iframe
            id="map-frame"
            class="w-full h-64 rounded z-10 bg-neutral-200 animate-pulse"
            style="border:0"
            loading="lazy"
            allowfullscreen
            referrerpolicy="no-referrer-when-downgrade"
            src={
              `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8
    &q=` + data.location
            }
            onLoad={() => {
              document
                .getElementById("map-frame")
                .classList.remove("animate-pulse");
            }}
          ></iframe>

          <button
            onClick={() => becomeUser()}
            class="flex items-center justify-center py-2 w-full bg-lime-400 hover:bg-lime-300 active:bg-lime-400 transition-all duration-300 ease-in-out text-black rounded cursor-pointer"
          >
            Become User
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfileModal;
