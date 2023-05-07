import { Route, Routes } from "@solidjs/router";
import Navbar from "./components/navbar";
import Sidebar from "./components/sidebar";
import useState from "./hooks/state";
import FourOFourPage from "./pages/404/404";

import AdminDashboardPage from "./pages/admin/dashboard.page";
import AdminDocumentsPage from "./pages/admin/documents.page";
import AdminArchivesPage from "./pages/admin/archives.page";
import AdminSurveysPage from "./pages/admin/surveys.page";
import AdminAnnouncementsPage from "./pages/admin/announcements.page";
import AdminUsersPage from "./pages/admin/users.page";

import LoginPage from "./pages/authentication/login.page";
import RegisterPage from "./pages/authentication/register.page";
import AnnouncementsPage from "./pages/user/announcements.page";
import ArchivePage from "./pages/user/archive.page";
import CompleteProfilePage from "./pages/user/completeProfile.page";
import DashboardPage from "./pages/user/dashboard.page";
import DocumentsPage from "./pages/user/documents.page";
import HarvestsPage from "./pages/user/harvests.page";
import ProducePage from "./pages/user/produce.page";
import ProductsPage from "./pages/user/products.page";
import ProfilePage from "./pages/user/profile.page";
import SalesPage from "./pages/user/sales.page";
import SurveysPage from "./pages/user/surveys.page";
import { createSignal, onMount } from "solid-js";
import axios from "axios";
import apiUrl from "./apiUrl";

const App = () => {
  const [user, setUser, clear] = useState("user");

  const [loading, setLoading] = createSignal(true);

  onMount(() => {
    setTimeout(() => {
      // checkAuthStatus();
      setLoading(false);
    }, 100);
  });

  // const checkAuthStatus = async () => {
  //   const response = await axios.get(apiUrl + "users/me", {
  //     headers: { Authorization: "Bearer " + user.token },
  //   });

  //   setUser({ authenticated: true, data: response.data });
  //   setLoading(false);
  // };

  return (
    <div class="flex flex-col w-screen h-screen text-black dark:text-white bg-neutral-900 select-none app-bg">
      {loading() && (
        <div class="flex flex-col w-full h-full items-center justify-center">
          <div class="flex items-center space-x-2 border-l border-t border-r border-b border-neutral-700 bg-neutral-900 text-white p-3 rounded">
            <div>Loading</div>
            <div role="status">
              <svg
                aria-hidden="true"
                class="w-4 h-4 mr-2 text-transparent animate-spin fill-lime-400"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span class="sr-only">Loading</span>
            </div>
          </div>
        </div>
      )}
      {!loading() && (
        <div class="flex flex-col md:flex-row w-screen h-full overflow-hidden">
          {user.authenticated && user.data.completedProfile && <Sidebar />}
          {user.authenticated && user.data.completedProfile && <Navbar />}
          <div class="flex flex-col w-screen h-full overflow-y-auto">
            <Routes>
              {!user.authenticated && <Route path="/" element={LoginPage} />}
              {!user.authenticated && (
                <Route path="/create-account" element={RegisterPage} />
              )}

              {user.authenticated && user.data.userType === "admin" && (
                <Route path="/" element={AdminDashboardPage} />
              )}
              {user.authenticated && user.data.userType === "admin" && (
                <Route path="/users" element={AdminUsersPage} />
              )}
              {user.authenticated && user.data.userType === "admin" && (
                <Route path="/documents" element={AdminDocumentsPage} />
              )}
              {user.authenticated && user.data.userType === "admin" && (
                <Route path="/archives" element={AdminArchivesPage} />
              )}
              {user.authenticated && user.data.userType === "admin" && (
                <Route path="/announcements" element={AdminAnnouncementsPage} />
              )}
              {user.authenticated && user.data.userType === "admin" && (
                <Route path="/surveys" element={AdminSurveysPage} />
              )}

              {user.authenticated &&
                user.data.userType !== "admin" &&
                user.data.completedProfile && (
                  <Route path="/" element={DashboardPage} />
                )}
              {user.authenticated &&
                user.data.userType !== "admin" &&
                !user.data.completedProfile && (
                  <Route path="/" element={CompleteProfilePage} />
                )}
              {user.authenticated &&
                user.data.userType !== "admin" &&
                user.data.completedProfile && (
                  <Route path="/products" element={ProductsPage} />
                )}
              {user.authenticated &&
                user.data.userType !== "admin" &&
                user.data.completedProfile && (
                  <Route path="/produce" element={ProducePage} />
                )}
              {user.authenticated &&
                user.data.userType !== "admin" &&
                user.data.completedProfile && (
                  <Route path="/sales" element={SalesPage} />
                )}
              {user.authenticated &&
                user.data.userType !== "admin" &&
                user.data.completedProfile && (
                  <Route path="/harvests" element={HarvestsPage} />
                )}
              {user.authenticated &&
                user.data.userType !== "admin" &&
                user.data.completedProfile && (
                  <Route path="/documents" element={DocumentsPage} />
                )}
              {user.authenticated &&
                user.data.userType !== "admin" &&
                user.data.completedProfile && (
                  <Route path="/archives" element={ArchivePage} />
                )}
              {user.authenticated &&
                user.data.userType !== "admin" &&
                user.data.completedProfile && (
                  <Route path="/announcements" element={AnnouncementsPage} />
                )}
              {user.authenticated &&
                user.data.userType !== "admin" &&
                user.data.completedProfile && (
                  <Route path="/surveys" element={SurveysPage} />
                )}
              {user.authenticated &&
                user.data.userType !== "admin" &&
                user.data.completedProfile && (
                  <Route path="/profile" element={ProfilePage} />
                )}

              <Route path="**" element={FourOFourPage} />
            </Routes>
          </div>
        </div>
      )}
      <div class="flex items-center justify-center space-x-5 p-1 border-t border-neutral-700 bg-neutral-900">
        <div class="cookie text-xl text-lime-400">
          Developed by Connor Davis
        </div>
      </div>
    </div>
  );
};

export default App;
