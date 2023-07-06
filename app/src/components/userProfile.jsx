import axios from "axios";
import { createSignal, onMount } from "solid-js";
import apiUrl from "../apiUrl";
import useState from "../hooks/state";
import { createStore } from "solid-js/store";
import UserProfileModal from "./modals/userProfile.modal";

const UserProfile = ({ userId, darkBg = false }) => {
  const [user, setUser] = useState("user");
  const [userProfile, setUserProfile] = createStore(
    {},
    { name: "userprofile-store" }
  );

  const [loading, setLoading] = createSignal(true);

  const [showProfile, setShowProfile] = createSignal(false);

  onMount(() => {
    setTimeout(() => {
      fetchUser();
    }, 100);
  });

  const fetchUser = async () => {
    const response = await axios.get(apiUrl + "users/" + userId, {
      headers: { Authorization: "Bearer " + user.token },
    });

    if (response.data) {
      setUserProfile(response.data);
      setLoading(false);
    }
  };

  return (
    <>
      {loading() ? (
        <div
          class={`flex items-center justify-center animate-pulse w-full h-full rounded p-5 bg-neutral-200`}
        ></div>
      ) : (
        <>
          {showProfile() && (
            <UserProfileModal
              data={userProfile}
              closed={() => setShowProfile(false)}
            />
          )}
          <div class="cursor-pointer rounded p-1 hover:bg-neutral-200">
            <div
              onClick={() => setShowProfile(true)}
              class="flex items-center space-x-2"
            >
              {userProfile && userProfile.image ? (
                <img
                  src={apiUrl + "files/view/" + userProfile.image}
                  class="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                userProfile.firstName &&
                userProfile.lastName && (
                  <div class="flex flex-col items-center justify-center w-10 h-10 rounded-full bg-lime-200 cookie font-bold">
                    {userProfile.firstName.split("")[0].toUpperCase()}{" "}
                    {userProfile.lastName.split("")[0].toUpperCase()}
                  </div>
                )
              )}
              <div>{userProfile.businessName}</div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default UserProfile;
