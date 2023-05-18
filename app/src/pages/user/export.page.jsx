import { createSignal } from "solid-js";
import SelectMenu from "../../components/selectmenu/selectmenu";
import useState from "../../hooks/state";
import axios from "axios";
import apiUrl from "../../apiUrl";
import { saveAs } from "file-saver";

const ExportPage = () => {
  const [user, setUser] = useState("user");

  const [successMessage, setSuccessMessage] = createSignal(undefined);
  const [errorMessage, setErrorMessage] = createSignal(undefined);

  const [fileName, setFileName] = createSignal(undefined);
  const [exportType, setExportType] = createSignal("all");

  const exportData = async () => {
    setSuccessMessage(undefined);
    setErrorMessage(undefined);

    let url = apiUrl + "export/" + exportType() + "/" + user.data._id;

    if (fileName()) url = url + "?fileName=" + fileName();

    const response = await axios.get(url, {
      responseType: "blob",
      headers: {
        Authorization: "Bearer " + user.token,
      },
    });

    if (!response.data) return setErrorMessage("Failed to export data.");
    else {
      const headerLine = response.headers["content-disposition"];
      const fileName = headerLine.split("=")[1].replaceAll('"', "");

      saveAs(response.data, fileName);

      setSuccessMessage("Successfully exported data.");

      setTimeout(() => {
        setSuccessMessage(undefined);
        setFileName(undefined);
        setExportType(undefined);
        setExportType("all");
      }, 1500);
    }
  };

  return (
    <div class="flex flex-col w-full h-full items-center justify-center p-5">
      <div class="flex flex-col space-y-3 w-full md:w-96 text-white bg-neutral-900 border-l border-t border-r border-b border-neutral-700 rounded p-3">
        <div class="flex items-center justify-between animate-fade-in">
          <div class="cookie text-2xl">Data Exporter</div>
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
            <div class="">File Name</div>
            <input
              type="text"
              placeholder="File Name"
              value={fileName() || ""}
              onChange={(event) => setFileName(event.target.value)}
              class="px-3 py-2 w-full bg-neutral-100 text-black border-l border-t border-r border-b border-neutral-300 rounded outline-none"
              required
            />
            <div class="text-neutral-400">What must the file name be?</div>
          </div>
          <div class="flex flex-col w-full space-y-1">
            <div>Data Type</div>
            {exportType() && (
              <SelectMenu
                defaultItem={exportType()}
                items={[
                  "all",
                  "products",
                  "sales",
                  "harvests",
                ]}
                selectionChanged={(item) => setExportType(item)}
              />
            )}
          </div>
          <button
            onClick={() => exportData()}
            class="flex items-center justify-center py-2 w-full bg-lime-400 hover:bg-lime-300 active:bg-lime-400 transition-all duration-300 ease-in-out text-black rounded cursor-pointer"
          >
            Export
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportPage;
