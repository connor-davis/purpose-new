import axios from "axios";
import { createSignal, onMount } from "solid-js";
import apiUrl from "../../apiUrl";
import Pager from "../../components/pager";
import useState from "../../hooks/state";
import StandardAlert from "../../components/alerts/standard";
import AddWasteModal from "../../components/modals/waste/add";
import EditWasteModal from "../../components/modals/waste/edit";

const WastePage = () => {
  const [user, setUser] = useState("user");

  const [showAdd, setShowAdd] = createSignal(false);
  const [showDelete, setShowDelete] = createSignal(undefined);
  const [editingWaste, setEditingWaste] = createSignal(undefined);

  const [waste, setWaste] = createSignal([]);
  const [currentPage, setCurrentPage] = createSignal(1);
  const [totalPages, setTotalPages] = createSignal(0);

  const [loading, setLoading] = createSignal(true);

  onMount(() => {
    fetchWaste();
  });

  const fetchWaste = () => {
    setTimeout(async () => {
      const response = await axios.get(
        apiUrl +
          "waste/page/" +
          currentPage() +
          "?limit=10&userId=" +
          user.data._id,
        { headers: { Authorization: "Bearer " + user.token } }
      );

      const { data, totalWaste, totalPages } = response.data;

      if (data.length === 0 && totalWaste > 0) {
        if (currentPage() > 1) setCurrentPage(currentPage() - 1);
        fetchWaste();
      } else {
        setWaste(data);
        setTotalPages(totalPages);
      }

      setLoading(false);
    }, 100);
  };

  const deleteWaste = async (id) => {
    const response = await axios.delete(apiUrl + "waste/" + id, {
      headers: { Authorization: "Bearer " + user.token },
    });

    if (response.data.error) return;
    else {
      fetchWaste();
    }
  };

  return (
    <div class="flex flex-col w-full h-full p-5">
      {showAdd() && (
        <AddWasteModal
          added={() => fetchWaste()}
          closed={() => setShowAdd(false)}
        />
      )}

      {showDelete() !== undefined && (
        <StandardAlert
          content={"Are you sure you want to delete this waste?"}
          options={[
            { text: "Yes", type: "success" },
            { text: "No", type: "error" },
          ]}
          optionClicked={(option) => {
            if (option === "Yes") {
              deleteWaste(showDelete()._id);
              setShowDelete(undefined);
            } else setShowDelete(undefined);
          }}
          closed={() => setShowDelete(undefined)}
        />
      )}

      {editingWaste() && (
        <EditWasteModal
          data={editingWaste()}
          edited={() => {
            setEditingWaste(undefined);
            fetchWaste();
          }}
          closed={() => setEditingWaste(undefined)}
        />
      )}

      <div class="flex flex-col space-y-3 text-black bg-white w-full h-full overflow-hidden rounded p-3">
        <div class="flex items-center justify-between animate-fade-in">
          <div class="cookie text-2xl">Your Waste</div>
          <div class="flex items-center">
            <div
              onClick={() => setShowAdd(true)}
              class="bg-lime-400 hover:bg-lime-300 active:bg-lime-400 transition-all duration-300 ease-in-out px-2 py-1 rounded cursor-pointer text-black"
            >
              Add
            </div>
          </div>
        </div>

        {loading() ? (
          <div class="flex flex-col space-y-2 animate-fade-in">
            <div class="bg-neutral-200 animate-pulse w-full h-10"></div>
            <div class="bg-neutral-200 animate-pulse w-full h-10"></div>
            <div class="bg-neutral-200 animate-pulse w-full h-10"></div>
          </div>
        ) : waste().length > 0 ? (
          <div class="flex flex-col w-full h-full overflow-y-auto overflow-x-auto">
            <table class="table-auto bg-white border-l border-t border-r border-neutral-200 text-black">
              <thead>
                <tr class="p-3 border-b border-neutral-200 bg-neutral-900 text-white select-none">
                  <th class="text-left p-3">Date</th>
                  <th class="text-left p-3">Kgs</th>
                  <th class="p-3 text-left">Type</th>
                  <th class="p-3 w-24"></th>
                </tr>
              </thead>
              <tbody>
                <For each={waste()}>
                  {(waste) => (
                    <tr class="hover:bg-neutral-100 border-b border-neutral-200 group">
                      <td class="p-3 whitespace-nowrap">{waste.date}</td>
                      <td class="p-3 whitespace-nowrap">{waste.kgs}</td>
                      <td class="p-3 whitespace-nowrap">{waste.wasteType}</td>
                      <td class="p-3">
                        <div class="flex w-24 h-full items-center space-x-2">
                          <div
                            onClick={() => setEditingWaste(waste)}
                            class="hidden group-hover:flex group-hover:animate-fade-in p-2 w-8 rounded-full hover:bg-lime-200 cursor-pointer"
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
                                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                              />
                            </svg>
                          </div>
                          <div
                            onClick={() => setShowDelete(waste)}
                            class="hidden group-hover:flex group-hover:animate-fade-in p-2 w-8 rounded-full hover:bg-red-200 cursor-pointer"
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
                      </td>
                    </tr>
                  )}
                </For>
              </tbody>
            </table>
          </div>
        ) : (
          <div class="flex flex-col w-full h-full items-center justify-center">
            You have no waste.
          </div>
        )}
        {waste().length > 0 && (
          <div>
            <Pager
              currentPage={currentPage}
              pageCount={totalPages}
              pageChanged={(page) => {
                setCurrentPage(page);
                fetchWaste();
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default WastePage;
