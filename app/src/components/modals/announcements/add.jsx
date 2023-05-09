import { createSignal } from "solid-js";
import useState from "../../../hooks/state";
import apiUrl from "../../../apiUrl";
import axios from "axios";
import { format } from "date-fns";

const AddAnnouncementModal = ({ added = () => {}, closed = () => {} }) => {
  const [user, setUser] = useState("user");

  const [successMessage, setSuccessMessage] = createSignal(undefined);
  const [errorMessage, setErrorMessage] = createSignal(undefined);

  const [announcementTitle, setAnnouncementTitle] = createSignal(undefined);
  const [announcementMessage, setAnnouncementMessage] = createSignal(undefined);

  const addAnnouncement = async () => {
    const response = await axios.post(
      apiUrl + "announcements/",
      {
        announcementDate: format(new Date(), "dd/MM/yyyy"),
        announcementTitle: announcementTitle(),
        announcementMessage: announcementMessage(),
      },
      { headers: { Authorization: "Bearer " + user.token } }
    );

    if (response.data.error) return setErrorMessage(response.data.message);
    else {
      setSuccessMessage("Successfully created announcement.");

      setTimeout(() => {
        setAnnouncementTitle(undefined);
        setAnnouncementMessage(undefined);

        added();
      }, 1500);
    }
  };

  return (
    <div class="absolute m-3 md:m-0 bg-neutral-900 bg-opacity-50 left-0 top-0 right-0 bottom-0 flex flex-col items-center justify-center animate-fade-in">
      <div class="flex flex-col w-full md:w-3/5 h-full overflow-y-auto  space-y-3 bg-neutral-900 border-l border-t border-r border-b border-neutral-700 rounded p-2">
        <div class="flex items-center justify-between w-full">
          <div class="cookie text-white text-2xl">Add Announcement</div>
          <div
            onClick={() => closed()}
            class="text-white hover:text-red-200 transition-all duration-300 ease-in-out cursor-pointer"
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

        <form
          onSubmit={async (event) => {
            event.preventDefault();

            const form = event.target;

            if (form.reportValidity()) {
              addAnnouncement();
            }
          }}
          class="flex flex-col w-full h-auto space-y-3 bg-neutral-100 rounded p-3"
        >
          <div class="flex flex-col w-full space-y-1">
            <div class="">
              Title <span class="text-red-500">*</span>
            </div>
            <input
              type="text"
              placeholder="Title"
              value={announcementTitle() || ""}
              onChange={(event) => setAnnouncementTitle(event.target.value)}
              class="px-3 py-2 w-full bg-neutral-100 text-black border-l border-t border-r border-b border-neutral-400 rounded outline-none"
              required
            />
            <div class="text-neutral-400">Give your announcement a title.</div>
          </div>
          <div class="flex flex-col w-full space-y-1">
            <div class="">
              Message <span class="text-red-500">*</span>
            </div>
            <textarea
              type="text"
              placeholder="Message"
              value={announcementMessage() || ""}
              onChange={(event) => setAnnouncementMessage(event.target.value)}
              class="px-3 py-2 w-full h-auto max-h-64 overflow-y-auto bg-neutral-100 text-black border-l border-t border-r border-b border-neutral-400 rounded outline-none"
              rows={6}
              required
            ></textarea>
            <div class="text-neutral-400">What would you like to say?</div>
          </div>
          <button class="flex items-center justify-center py-2 w-full bg-lime-400 hover:bg-lime-300 active:bg-lime-400 transition-all duration-300 ease-in-out text-black rounded cursor-pointer">
            Add Announcement
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddAnnouncementModal;
