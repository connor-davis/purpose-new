import { createSignal } from "solid-js";
import apiUrl from "../../../apiUrl";
import axios from "axios";
import useState from "../../../hooks/state";
import DatePicker from "../../datepicker/datepicker";
import SelectMenu from "../../selectmenu/selectmenu";

const EditWasteModal = ({
  data = {},
  edited = () => {},
  closed = () => {},
}) => {
  const [user, setUser] = useState("user");

  const [successMessage, setSuccessMessage] = createSignal(undefined);
  const [errorMessage, setErrorMessage] = createSignal(undefined);

  const [wasteId, setWasteId] = createSignal(data._id || undefined);
  const [wasteDate, setWasteDate] = createSignal(data.date || undefined);
  const [wasteKgs, setWasteKgs] = createSignal(data.kgs || undefined);
  const [wasteType, setWasteType] = createSignal(data.wasteType || undefined);

  const editWaste = async () => {
    const data = {
      _id: wasteId(),
      user: user.data._id,
      date: wasteDate(),
      kgs: parseFloat(wasteKgs()),
      wasteType: wasteType(),
    };

    if (data.user === (null || undefined))
      return setErrorMessage("You need to be authenticated to add a waste.");
    if (data.date === (null || undefined))
      return setErrorMessage("Please give your waste a date.");
    if (data.kgs === (null || undefined))
      return setErrorMessage("Please give your waste a numeric weight in kgs.");
    if (data.wasteType === (null || undefined))
      return setErrorMessage("Please give your waste a type.");

    const response = await axios.put(apiUrl + "waste", data, {
      headers: { Authorization: "Bearer " + user.token },
    });

    if (response.data.error) return setErrorMessage(response.data.message);
    else {
      setSuccessMessage("Successfully edited waste.");

      setTimeout(() => {
        setSuccessMessage(undefined);

        setWasteId(undefined);
        setWasteDate(undefined);
        setWasteKgs(undefined);
        setWasteType(undefined);

        edited();
      }, 1000);
    }
  };

  return (
    <div class="absolute bg-neutral-900 bg-opacity-50 left-0 top-0 right-0 bottom-0 flex flex-col items-center justify-center animate-fade-in">
      <div class="flex flex-col w-full md:w-3/5 h-full overflow-y-auto  space-y-3 bg-neutral-900 border-l border-t border-r border-b border-neutral-700 rounded p-2">
        <div class="flex items-center justify-between w-full">
          <div class="cookie text-white text-2xl">Edit Waste</div>
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
              editWaste();
            }
          }}
          class="flex flex-col w-full h-auto space-y-3 bg-neutral-100 rounded p-3"
        >
          <div class="flex flex-col w-full space-y-1">
            <div class="">
              Waste Date <span class="text-red-500">*</span>
            </div>
            <DatePicker defaultDate={wasteDate()} onChange={(date) => setWasteDate(date)} />
            <div class="text-neutral-400">
              What date was the waste collected?
            </div>
          </div>
          <div class="flex flex-col w-full space-y-1">
            <div class="">
              Waste Kgs <span class="text-red-500">*</span>
            </div>
            <input
              type="number"
              placeholder="Waste Kgs"
              value={wasteKgs() || ""}
              onChange={(event) => setWasteKgs(event.target.value)}
              class="px-3 py-2 w-full bg-neutral-100 text-black border-l border-t border-r border-b border-neutral-200 rounded outline-none"
              required
            />
            <div class="text-neutral-400">
              What is the weight of your waste in kgs?
            </div>
          </div>
          <div class="flex flex-col w-full space-y-1">
            <div class="">
              Waste Type <span class="text-red-500">*</span>
            </div>
            <SelectMenu
              defaultItem={wasteType()}
              items={["Food Waste", "Other"]}
              selectionChanged={(type) => setWasteType(type)}
            />
            <div class="text-neutral-400">
              What type of waste is your waste?
            </div>
          </div>
          <button class="flex items-center justify-center py-2 w-full bg-lime-400 hover:bg-lime-300 active:bg-lime-400 transition-all duration-300 ease-in-out text-black rounded cursor-pointer">
            Edit Waste
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditWasteModal;
