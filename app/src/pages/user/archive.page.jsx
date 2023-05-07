import axios from "axios";
import { For, createSignal, onMount } from "solid-js";
import apiUrl from "../../apiUrl";
import Pager from "../../components/pager";
import useState from "../../hooks/state";

const ArchivePage = () => {
  const [user, setUser] = useState("user");
  const [archives, setDocuments] = createSignal([]);
  const [currentPage, setCurrentPage] = createSignal(1);
  const [totalPages, setTotalPages] = createSignal(0);

  const [loading, setLoading] = createSignal(true);

  onMount(() => {
    fetchArchives();
  });

  const fetchArchives = () => {
    setTimeout(async () => {
      const response = await axios.get(
        apiUrl +
          "archives/page/" +
          currentPage() +
          "?limit=10&userId=" +
          user.data._id,
        { headers: { Authorization: "Bearer " + user.token } }
      );

      const { data, totalArchives, totalPages } = response.data;

      if (data.length === 0 && totalArchives > 0) {
        if (currentPage() > 1) setCurrentPage(currentPage() - 1);
        fetchArchives();
      } else {
        setDocuments(data);
        setTotalPages(totalPages);
      }

      setLoading(false);
    }, 100);
  };

  return (
    <div class="flex flex-col w-full h-full p-5">
      <div class="flex flex-col space-y-3 text-black bg-white w-full h-full overflow-hidden rounded p-3">
        <div class="flex items-center justify-between animate-fade-in">
          <div class="cookie text-2xl">Archives</div>
        </div>
        <div class="flex flex-col w-full h-full space-y-2 overflow-y-auto">
          <For
            each={archives()}
            fallback={() =>
              loading() ? (
                <div class="flex flex-col space-y-2 animate-fade-in">
                  <div class="bg-neutral-100 animate-pulse w-full h-10 rounded-xl"></div>
                  <div class="bg-neutral-100 animate-pulse w-full h-10 rounded-xl"></div>
                  <div class="bg-neutral-100 animate-pulse w-full h-10 rounded-xl"></div>
                </div>
              ) : (
                <div class="flex flex-col w-full h-full items-center justify-center animate-fade-in">
                  There have no archives.
                </div>
              )
            }
          >
            {(archive) => (
              <div class="flex items-center justify-between transition-all duration-1000 ease-in-out hover:bg-neutral-100 rounded px-3 py-2 group animate-fade-in">
                <div class="flex items-center h-9">{archive.name}</div>
                <div class="flex items-center space-x-2">
                  <a
                    class="hidden group-hover:flex group-hover:animate-fade-in p-2 rounded-full hover:bg-lime-200 cursor-pointer"
                    href={apiUrl + "archives/view/" + archive.name}
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
                </div>
              </div>
            )}
          </For>
        </div>
        {archives().length > 0 && (
          <div>
            <Pager
              currentPage={currentPage}
              pageCount={totalPages}
              pageChanged={(page) => {
                setCurrentPage(page);
                fetchArchives();
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ArchivePage;
