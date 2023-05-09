import { onMount } from "solid-js";
import useState from "../../../hooks/state";

const ViewAnnouncementModal = ({ data = {}, closed = () => {} }) => {
  const [user, setUser] = useState("user");
  const [appMetadata, setAppMetadata] = useState("metadata");

  onMount(() => {
    setTimeout(() => {
      if (user.data.userType !== "admin") {
        if (!appMetadata.viewedAnnouncements)
          setAppMetadata({
            viewedAnnouncements: [...new Set([data._id])],
          });
        else
          setAppMetadata({
            viewedAnnouncements: [
              ...new Set([...appMetadata.viewedAnnouncements, data._id]),
            ],
          });

        console.log([...appMetadata.viewedAnnouncements]);
      }
    }, 100);
  });

  return (
    <div class="absolute bg-neutral-900 bg-opacity-50 left-0 top-0 right-0 bottom-0 flex flex-col items-center justify-center animate-fade-in">
      <div class="flex flex-col w-full md:w-3/5 h-full overflow-y-auto  space-y-3 bg-neutral-900 border-l border-t border-r border-b border-neutral-700 rounded p-2">
        <div class="flex items-center justify-between w-full">
          <div class="cookie text-white text-2xl">{data.announcementDate}</div>
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
        <div class="flex flex-col w-full h-auto space-y-3 bg-neutral-100 rounded p-3">
          <div class="flex flex-col w-full space-y-1 font-bold text-xl">
            {data.announcementTitle}
          </div>
          <div class="flex flex-col w-full space-y-1">
            {data.announcementMessage}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewAnnouncementModal;
