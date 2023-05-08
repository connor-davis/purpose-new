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
            {userProfile.image ? (
              <div
                onClick={() => setShowProfile(true)}
                class="flex items-center space-x-2"
              >
                <img
                  src={apiUrl + "files/view/" + userProfile.image}
                  class="w-7 h-7 rounded-full"
                />
                <div>{userProfile.businessName}</div>
              </div>
            ) : (
              <div class="h-7">{userProfile.businessName}</div>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default UserProfile;
