import { createSignal } from "solid-js";
import SelectMenu from "../../components/selectmenu/selectmenu";
import useState from "../../hooks/state";
import axios from "axios";
import apiUrl from "../../apiUrl";

const AdminExportPage = () => {
  const [user, setUser] = useState("user");

  const [successMessage, setSuccessMessage] = createSignal(undefined);
  const [errorMessage, setErrorMessage] = createSignal(undefined);

  const [fileName, setFileName] = createSignal(undefined);
  const [exportType, setExportType] = createSignal("all");

  const exportData = async () => {
    const response = await axios.get(
      apiUrl + "export/" + exportType() + "?fileName=" + fileName(),
      { headers: { Authorization: "Bearer " + user.token } }
    );
  };

  return (
    <div class="flex flex-col w-full h-full items-center justify-center p-5">
      <div class="flex flex-col space-y-3 w-full md:w-96 text-white bg-neutral-900 border-l border-t border-r border-b border-neutral-700 rounded p-3">
        <div class="flex items-center justify-between animate-fade-in">
          <div class="cookie text-2xl">Export Data</div>
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

        <div class="flex flex-col space-y-3 bg-white text-black rounded p-3">
          <div class="flex flex-col w-full space-y-1">
            <div class="">
              File Name <span class="text-red-500">*</span>
            </div>
            <input
              type="text"
              placeholder="Title"
              value={fileName() || ""}
              onChange={(event) => setFileName(event.target.value)}
              class="px-3 py-2 w-full bg-neutral-100 text-black border-l border-t border-r border-b border-neutral-300 rounded outline-none"
              required
            />
            <div class="text-neutral-400">What must the file name be?</div>
          </div>
          <div class="flex flex-col w-full space-y-1">
            <div>Data Type</div>
            <SelectMenu
              defaultItem={exportType()}
              items={[
                "all",
                "users",
                "products",
                "produce",
                "sales",
                "harvests",
              ]}
              selectionChanged={(item) => setExportType(item)}
            />
          </div>
          <button class="flex items-center justify-center py-2 w-full bg-lime-400 hover:bg-lime-300 active:bg-lime-400 transition-all duration-300 ease-in-out text-black rounded cursor-pointer">
            Export
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminExportPage;
