import axios from "axios";
import { For, createSignal, onMount } from "solid-js";
import apiUrl from "../../apiUrl";
import useState from "../../hooks/state";
import Pager from "../../components/pager";
import UserProfile from "../../components/userProfile";

const AdminDocumentsPage = () => {
  const [user, setUser] = useState("user");
  
  const [documents, setDocuments] = createSignal([]);
  const [currentPage, setCurrentPage] = createSignal(1);
  const [totalPages, setTotalPages] = createSignal(0);

  const [loading, setLoading] = createSignal(true);

  onMount(() => {
    fetchDocuments();
  });

  const fetchDocuments = () => {
    setLoading(true);
    setDocuments([]);

    setTimeout(async () => {
      const response = await axios.get(
        apiUrl + "documents/page/" + currentPage() + "?limit=10&userId=",
        { headers: { Authorization: "Bearer " + user.token } }
      );

      const { data, totalDocuments, totalPages } = response.data;

      if (data.length === 0 && totalDocuments > 0) {
        if (currentPage() > 1) setCurrentPage(currentPage() - 1);
        fetchDocuments();
      } else {
        setDocuments(data);
        setTotalPages(totalPages);
      }

      setLoading(false);
    }, 100);
  };

  const deleteDocument = async (documentName) => {
    const response = await axios.delete(apiUrl + "documents/" + documentName, {
      headers: { Authorization: "Bearer " + user.token },
    });

    if (response.data.error) return;
    else {
      fetchDocuments();
    }
  };

  return (
    <div class="flex flex-col w-full h-full p-5">
      <div class="flex flex-col space-y-3 text-black bg-white w-full h-full overflow-hidden rounded p-3">
        <div class="flex items-center justify-between">
          <div class="cookie text-2xl">Documents</div>
          <div class="flex items-center"></div>
        </div>
        <div class="flex flex-col w-full h-full space-y-2 overflow-y-auto">
          <For
            each={documents()}
            fallback={() =>
              loading() ? (
                <div class="flex flex-col space-y-2 animate-fade-in">
                  <div class="bg-neutral-100 animate-pulse w-full h-10 rounded-xl"></div>
                  <div class="bg-neutral-100 animate-pulse w-full h-10 rounded-xl"></div>
                  <div class="bg-neutral-100 animate-pulse w-full h-10 rounded-xl"></div>
                </div>
              ) : (
                <div class="flex flex-col w-full h-full items-center justify-center animate-fade-in">
                  There are no documents.
                </div>
              )
            }
          >
            {(document) => (
              <div class="flex items-center justify-between transition-all duration-1000 ease-in-out hover:bg-neutral-100 space-x-2 rounded px-3 py-2 group animate-fade-in">
                <div class="flex items-center h-9">{document.name}</div>

                <div class="flex items-center space-x-2">
                  <div class="hidden group-hover:flex">
                    <UserProfile userId={document.user} darkBg={true} />
                  </div>
                  <a
                    class="hidden group-hover:flex group-hover:animate-fade-in p-2 rounded-full items-center justify-center hover:bg-lime-200 cursor-pointer w-8 h-8"
                    href={
                      apiUrl +
                      "documents/view/" +
                      document.user +
                      "." +
                      document.name
                    }
                    target="_blank"
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
                        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                      />
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </a>
                  <div
                    onClick={() =>
                      deleteDocument(document.user + "." + document.name)
                    }
                    class="hidden group-hover:flex group-hover:animate-fade-in p-2 rounded-full hover:bg-red-200 cursor-pointer"
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
        {documents().length > 0 && (
          <div>
            <Pager
              currentPage={currentPage}
              pageCount={totalPages}
              pageChanged={(page) => {
                setCurrentPage(page);
                fetchDocuments();
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDocumentsPage;
