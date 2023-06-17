import { createSignal, onMount } from "solid-js";
import useState from "../../../hooks/state";
import axios from "axios";
import apiUrl from "../../../apiUrl";

const TrainingAttendeesModal = ({
  selected = [],
  added = () => {},
  closed = () => {},
}) => {
  const [user, setUser] = useState("user");

  const [successMessage, setSuccessMessage] = createSignal(undefined);
  const [errorMessage, setErrorMessage] = createSignal(undefined);

  const [loading, setLoading] = createSignal(true);

  const [attendees, setAttendees] = createSignal([]);
  const [selectedAttendees, setSelectedAttendees] = createSignal(selected);

  const [searchKey, setSearchKey] = createSignal("");

  onMount(() => {
    console.log(selected);

    setTimeout(async () => {
      await fetchAttendees();

      setLoading(false);
    }, 400);
  });

  const fetchAttendees = async () => {
    const response = await axios.get(
      apiUrl + "training/attendees/search?filter=" + searchKey(),
      {
        headers: { Authorization: "Bearer " + user.token },
      }
    );

    if (response.status === 200) {
      setAttendees(response.data.data || []);
    } else {
      setErrorMessage("Failed to filter users.");
    }
  };

  return (
    <div class="absolute bg-neutral-900 bg-opacity-50 left-0 top-0 right-0 bottom-0 flex flex-col items-center justify-center animate-fade-in z-50">
      <div class="flex flex-col w-full md:w-3/5 h-full space-y-3 bg-neutral-900 border-l border-t border-r border-b border-neutral-700 rounded p-2">
        <div class="flex items-center justify-between w-full">
          <div class="cookie text-white text-2xl">Add Training Attendees</div>
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

        <div class="flex flex-col w-full h-full overflow-hidden">
          <div class="flex flex-col space-y-3 text-black bg-white w-full h-full overflow-hidden rounded p-3">
            <div class="flex items-center space-x-3 w-full">
              <input
                type="email"
                placeholder="Search by email"
                value={searchKey()}
                onChange={(event) => {
                  setSearchKey(event.target.value);
                }}
                class="px-3 py-2 w-full bg-neutral-100 text-black border-l border-t border-r border-b border-neutral-200 rounded outline-none"
              />
              <div
                onClick={() => fetchAttendees()}
                class="p-3 cursor-pointer text-black border-l border-t border-r border-b border-neutral-200 rounded-full outline-none"
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
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                  />
                </svg>
              </div>
            </div>
            {loading() ? (
              <div class="flex flex-col space-y-2 animate-fade-in">
                <div class="bg-neutral-200 animate-pulse w-full h-10"></div>
                <div class="bg-neutral-200 animate-pulse w-full h-10"></div>
                <div class="bg-neutral-200 animate-pulse w-full h-10"></div>
              </div>
            ) : attendees().length > 0 ? (
              <div class="flex flex-col w-full h-full overflow-y-auto space-y-3">
                <table class="table-auto bg-white border-l border-t border-r border-neutral-200 text-black">
                  <thead>
                    <tr class="p-3 border-b border-neutral-200 bg-neutral-900 text-white select-none">
                      <th class="p-3 w-24"></th>
                      <th class="text-left p-3">First Name</th>
                      <th class="text-left p-3">Last Name</th>
                      <th class="p-3 text-left">Business Name</th>
                      <th class="p-3 w-24">Email Address</th>
                    </tr>
                  </thead>
                  <tbody>
                    <For each={attendees()}>
                      {(attendee) => (
                        <tr class="hover:bg-neutral-100 border-b border-neutral-200 group">
                          <td
                            class={`p-3`}
                            onClick={() => {
                              if (selectedAttendees().includes(attendee._id))
                                setSelectedAttendees([
                                  ...selectedAttendees().filter(
                                    (id) => id !== attendee._id
                                  ),
                                ]);
                              else
                                setSelectedAttendees([
                                  ...selectedAttendees().filter(
                                    (id) => id !== attendee._id
                                  ),
                                  attendee._id,
                                ]);
                            }}
                          >
                            <div
                              class={`flex-col w-6 h-6 p-1 cursor-pointer rounded-md ${
                                selectedAttendees().includes(attendee._id)
                                  ? "bg-lime-400 text-white"
                                  : "border-l border-t border-r border-b border-neutral-200"
                              }`}
                            >
                              {selectedAttendees().includes(attendee._id) && (
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
                                    d="M4.5 12.75l6 6 9-13.5"
                                  />
                                </svg>
                              )}
                            </div>
                          </td>
                          <td class="flex items-center space-x-2 p-3">
                            {attendee.image !== ("" || undefined || null) && (
                              <div class="flex items-center h-9">
                                <img
                                  src={apiUrl + "files/view/" + attendee.image}
                                  class="w-10 h-10 rounded"
                                />
                              </div>
                            )}
                            <div class="flex items-center h-9">
                              {attendee.firstName}
                            </div>
                          </td>
                          <td class="p-3">{attendee.lastName}</td>
                          <td class="p-3">{attendee.businessName}</td>
                          <td class="p-3">{attendee.email}</td>
                        </tr>
                      )}
                    </For>
                  </tbody>
                </table>
              </div>
            ) : (
              <div class="flex flex-col w-full h-full items-center justify-center">
                You have no attendees
              </div>
            )}
          </div>
        </div>
        <button
          onClick={() => added(selectedAttendees())}
          class="flex animate-fade-in items-center justify-center py-2 w-full bg-neutral-900 text-white hover:text-lime-300 border-l border-t border-r border-b border-neutral-700 transition-all duration-300 ease-in-out rounded cursor-pointer"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default TrainingAttendeesModal;
