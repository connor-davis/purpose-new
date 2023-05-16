import { useNavigate } from "@solidjs/router";
import { createSignal } from "solid-js";
import useState from "../hooks/state";
import AddIncomeModal from "./modals/income/add";

const Navbar = () => {
  const [user, setUser, clearUser] = useState("user");

  const navigate = useNavigate();

  const [navbarShown, setNavbarShown] = createSignal(false);
  const [showAddIncome, setShowAddIncome] = createSignal(false);

  return (
    <>
      {showAddIncome() && (
        <AddIncomeModal closed={() => setShowAddIncome(false)} />
      )}

      {!navbarShown() ? (
        <div class="md:hidden flex items-center justify-between px-3 py-3 w-full bg-neutral-900 border-b border-neutral-700">
          <div class="cookie text-2xl text-lime-400">Purpose360</div>
          <div
            onClick={() => setNavbarShown(!navbarShown())}
            class="cookie text-2xl text-white hover:text-lime-200 transition-all duration-300 ease-in-out cursor-pointer"
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
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </div>
        </div>
      ) : (
        <div class="md:hidden absolute w-screen flex flex-col p-2 bg-neutral-900 h-full overflow-y-auto border-r border-neutral-700 z-50">
          <div class="flex items-center justify-between py-3">
            <div class="cookie text-2xl text-lime-400">Purpose360</div>
            <div
              onClick={() => setNavbarShown(!navbarShown())}
              class="cookie text-2xl text-white hover:text-lime-200 transition-all duration-300 ease-in-out cursor-pointer"
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

          <div class="flex flex-col items-center space-y-2 w-full h-full">
            <div
              onClick={() => {
                navigate("/");
                setNavbarShown(!navbarShown());
              }}
              class="flex items-center space-x-2 w-full h-auto px-3 py-2 text-white border-l border-t border-r border-b border-neutral-900 bg-neutral-800 hover:bg-neutral-700 hover:bg-opacity-50 transition-all duration-300 ease-in-out rounded cursor-pointer"
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
                  d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
                />
              </svg>

              <span>Dashboard</span>
            </div>
            {user.data && user.data.userType === "admin" && (
              <div
                onClick={() => {
                  navigate("/users");
                  setNavbarShown(!navbarShown());
                }}
                class="flex items-center space-x-2 w-full h-auto px-3 py-2 text-white border-l border-t border-r border-b border-neutral-900 bg-neutral-800 hover:bg-neutral-700 hover:bg-opacity-50 transition-all duration-300 ease-in-out rounded cursor-pointer"
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
                    d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
                  />
                </svg>

                <span>Users</span>
              </div>
            )}
            {user.data && user.data.userType !== "admin" && (
              <div
                onClick={() => {
                  navigate("/products");
                  setNavbarShown(!navbarShown());
                }}
                class="flex items-center space-x-2 w-full h-auto px-3 py-2 text-white border-l border-t border-r border-b border-neutral-900 bg-neutral-800 hover:bg-neutral-700 hover:bg-opacity-50 transition-all duration-300 ease-in-out rounded cursor-pointer"
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
                    d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"
                  />
                </svg>

                <span>Products</span>
              </div>
            )}
            {user.data && user.data.userType !== "admin" && (
              <div
                onClick={() => {
                  navigate("/sales");
                  setNavbarShown(!navbarShown());
                }}
                class="flex items-center space-x-2 w-full h-auto px-3 py-2 text-white border-l border-t border-r border-b border-neutral-900 bg-neutral-800 hover:bg-neutral-700 hover:bg-opacity-50 transition-all duration-300 ease-in-out rounded cursor-pointer"
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
                    d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z"
                  />
                </svg>

                <span>Sales</span>
              </div>
            )}
            {user.data && user.data.userType !== "admin" && (
              <div
                onClick={() => {
                  setShowAddIncome(true);
                  setNavbarShown(!navbarShown());
                }}
                class="flex items-center space-x-2 w-full h-auto px-3 py-2 text-white border-l border-t border-r border-b border-neutral-900 bg-neutral-800 hover:bg-neutral-700 hover:bg-opacity-50 transition-all duration-300 ease-in-out rounded cursor-pointer"
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
                    d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z"
                  />
                </svg>

                <span>Add Income</span>
              </div>
            )}
            {user.data &&
              user.data.userType !== "admin" &&
              (user.data.userType === "ecd" ||
                user.data.userType === "farmer") && (
                <div
                  onClick={() => {
                    navigate("/harvests");
                    setNavbarShown(!navbarShown());
                  }}
                  class="flex items-center space-x-2 w-full h-auto px-3 py-2 text-white border-l border-t border-r border-b border-neutral-900 bg-neutral-800 hover:bg-neutral-700 hover:bg-opacity-50 transition-all duration-300 ease-in-out rounded cursor-pointer"
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
                      d="M10.05 4.575a1.575 1.575 0 10-3.15 0v3m3.15-3v-1.5a1.575 1.575 0 013.15 0v1.5m-3.15 0l.075 5.925m3.075.75V4.575m0 0a1.575 1.575 0 013.15 0V15M6.9 7.575a1.575 1.575 0 10-3.15 0v8.175a6.75 6.75 0 006.75 6.75h2.018a5.25 5.25 0 003.712-1.538l1.732-1.732a5.25 5.25 0 001.538-3.712l.003-2.024a.668.668 0 01.198-.471 1.575 1.575 0 10-2.228-2.228 3.818 3.818 0 00-1.12 2.687M6.9 7.575V12m6.27 4.318A4.49 4.49 0 0116.35 15m.002 0h-.002"
                    />
                  </svg>

                  <span>Harvests</span>
                </div>
              )}
            <div
              onClick={() => {
                navigate("/documents");
                setNavbarShown(!navbarShown());
              }}
              class="flex items-center space-x-2 w-full h-auto px-3 py-2 text-white border-l border-t border-r border-b border-neutral-900 bg-neutral-800 hover:bg-neutral-700 hover:bg-opacity-50 transition-all duration-300 ease-in-out rounded cursor-pointer"
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
                  d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                />
              </svg>

              <span>Documents</span>
            </div>
            <div
              onClick={() => {
                navigate("/archives");
                setNavbarShown(!navbarShown());
              }}
              class="flex items-center space-x-2 w-full h-auto px-3 py-2 text-white border-l border-t border-r border-b border-neutral-900 bg-neutral-800 hover:bg-neutral-700 hover:bg-opacity-50 transition-all duration-300 ease-in-out rounded cursor-pointer"
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
                  d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"
                />
              </svg>

              <span>Archive</span>
            </div>

            <div
              onClick={() => {
                navigate("/announcements");
                setNavbarShown(!navbarShown());
              }}
              class="flex items-center space-x-2 w-full h-auto px-3 py-2 text-white border-l border-t border-r border-b border-neutral-900 bg-neutral-800 hover:bg-neutral-700 hover:bg-opacity-50 transition-all duration-300 ease-in-out rounded cursor-pointer"
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
                  d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"
                />
              </svg>

              <span>Announcements</span>
            </div>

            <div
              onClick={() => {
                navigate("/surveys");
                setNavbarShown(!navbarShown());
              }}
              class="flex items-center space-x-2 w-full h-auto px-3 py-2 text-white border-l border-t border-r border-b border-neutral-900 bg-neutral-800 hover:bg-neutral-700 hover:bg-opacity-50 transition-all duration-300 ease-in-out rounded cursor-pointer"
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
                  d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z"
                />
              </svg>

              <span>Surveys</span>
            </div>

            {user.data &&
              user.data.userType &&
              user.data.userType === "admin" && (
                <div
                  onClick={() => {
                    navigate("/export");
                    setNavbarShown(!navbarShown());
                  }}
                  class="flex items-center space-x-2 w-full h-auto px-3 py-2 text-white border-l border-t border-r border-b border-neutral-900 bg-neutral-800 hover:bg-neutral-700 hover:bg-opacity-50 transition-all duration-300 ease-in-out rounded cursor-pointer"
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
                      d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125"
                    />
                  </svg>

                  <span>Export Data</span>
                </div>
              )}
          </div>
          <div class="flex flex-col items-center space-y-2">
            {user.data &&
              user.data.userType &&
              user.data.userType !== "admin" && (
                <div
                  onClick={() => {
                    setNavbarShown(!navbarShown());
                    navigate("/profile");
                  }}
                  class="flex items-center space-x-2 w-full h-auto px-3 py-2 text-white border-l border-t border-r border-b border-neutral-900 bg-neutral-800 hover:bg-neutral-700 hover:bg-opacity-50 transition-all duration-300 ease-in-out rounded cursor-pointer"
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
                      d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>

                  <span>Profile</span>
                </div>
              )}
            {user.previousUser && (
              <div
                onClick={() => {
                  const newUser = JSON.parse(user.previousUser);

                  clearUser();
                  setUser({ ...newUser, previousUser: false });
                  setNavbarShown(!navbarShown());
                }}
                class="flex items-center space-x-2 w-full h-auto px-3 py-2 text-white border-l border-t border-r border-b border-neutral-900 bg-neutral-800 hover:bg-neutral-700 hover:bg-opacity-50 transition-all duration-300 ease-in-out rounded cursor-pointer"
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
                    d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"
                  />
                </svg>

                <span>Back To Admin</span>
              </div>
            )}
            <div
              onClick={() => {
                clearUser();
                setNavbarShown(!navbarShown());
                window.location.href = "/";
              }}
              class="flex items-center space-x-2 w-full h-auto px-3 py-2 text-white border-l border-t border-r border-b border-neutral-900 bg-neutral-800 hover:bg-neutral-700 hover:bg-opacity-50 transition-all duration-300 ease-in-out rounded cursor-pointer"
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
                  d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                />
              </svg>

              <span>Logout</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
