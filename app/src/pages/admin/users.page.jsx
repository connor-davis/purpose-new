import { createSignal, onMount } from "solid-js";
import Pager from "../../components/pager";
import UserProfile from "../../components/userProfile";
import useState from "../../hooks/state";
import axios from "axios";
import apiUrl from "../../apiUrl";

const AdminUsersPage = () => {
  const [user, setUser] = useState("user");

  const [users, setUsers] = createSignal([]);
  const [currentPage, setCurrentPage] = createSignal(1);
  const [totalPages, setTotalPages] = createSignal(0);

  const [loading, setLoading] = createSignal(true);

  onMount(() => {
    setTimeout(() => {
      fetchUsers();
    }, 100);
  });

  const fetchUsers = () => {
    setLoading(true);
    setUsers([]);

    setTimeout(async () => {
      const response = await axios.get(
        apiUrl + "users/page/" + currentPage() + "?limit=10",
        { headers: { Authorization: "Bearer " + user.token } }
      );

      const { data, totalUsers, totalPages } = response.data;

      if (data.length === 0 && totalUsers > 0) {
        if (currentPage() > 1) setCurrentPage(currentPage() - 1);
        fetchUsers();
      } else {
        setUsers(data);
        setTotalPages(totalPages);
      }

      setLoading(false);
    }, 100);
  };

  const resetUserPassword = async (id) => {
    const response = await axios.get(
      apiUrl + "authentication/resetPassword/getCode/" + id,
      {
        headers: { Authorization: "Bearer " + user.token },
      }
    );

    if (response.data) {
      navigator.clipboard.writeText(response.data.uniqueCode);

      alert("Code Copied: " + response.data.uniqueCode);
    } else return;
  };

  const deleteUser = async (id) => {
    const response = await axios.delete(apiUrl + "users/" + id, {
      headers: { Authorization: "Bearer " + user.token },
    });

    if (response.data) return fetchUsers();
    else return;
  };

  return (
    <div class="flex flex-col w-full h-full p-5">
      <div class="flex flex-col space-y-3 text-black bg-white w-full h-full overflow-hidden rounded p-3">
        <div class="flex items-center justify-between animate-fade-in">
          <div class="cookie text-2xl">Your Users</div>
          <div class="flex items-center">
            <div
              onClick={() => {}}
              class="bg-lime-400 hover:bg-lime-300 active:bg-lime-400 transition-all duration-300 ease-in-out px-2 py-1 rounded cursor-pointer text-black"
            >
              Create
            </div>
          </div>
        </div>
        <div class="flex flex-col w-full h-full space-y-2 overflow-y-auto">
          <For
            each={users()}
            fallback={() =>
              loading() ? (
                <div class="flex flex-col space-y-2 animate-fade-in">
                  <div class="bg-neutral-100 animate-pulse w-full h-10 rounded-xl"></div>
                  <div class="bg-neutral-100 animate-pulse w-full h-10 rounded-xl"></div>
                  <div class="bg-neutral-100 animate-pulse w-full h-10 rounded-xl"></div>
                </div>
              ) : (
                <div class="flex flex-col w-full h-full items-center justify-center animate-fade-in">
                  There are no users.
                </div>
              )
            }
          >
            {(user) => (
              <div class="flex items-center justify-between transition-all duration-1000 ease-in-out hover:bg-neutral-100 space-x-2 p-2 rounded group animate-fade-in">
                {user.completedProfile ? (
                  <UserProfile userId={user._id} darkBg={true} />
                ) : (
                  <div class="flex items-center space-x-2 p-2">
                    {user.email}
                  </div>
                )}

                <div class="flex items-center space-x-2">
                  <div
                    onClick={() => resetUserPassword(user._id)}
                    class="hidden group-hover:flex group-hover:animate-fade-in rounded-full hover:bg-lime-200 cursor-pointer p-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="w-4 h-4"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                      />
                    </svg>
                  </div>
                  <div
                    onClick={() => deleteUser(user._id)}
                    class="hidden group-hover:flex group-hover:animate-fade-in rounded-full hover:bg-red-200 cursor-pointer p-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="w-4 h-4"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            )}
          </For>
        </div>
        {users().length > 0 && (
          <div>
            <Pager
              currentPage={currentPage}
              pageCount={totalPages}
              pageChanged={(page) => {
                setCurrentPage(page);
                fetchUsers();
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsersPage;
