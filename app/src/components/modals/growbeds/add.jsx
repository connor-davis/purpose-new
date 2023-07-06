import { createSignal } from "solid-js";
import useState from "../../../hooks/state";
import { format, getDaysInMonth, getYear, parse } from "date-fns";
import { createStore } from "solid-js/store";
import SelectMenu from "../../selectmenu/selectmenu";
import axios from "axios";
import apiUrl from "../../../apiUrl";
import DatePicker from "../../datepicker/datepicker";

const AddGrowBedModal = ({ added = () => {}, closed = () => {} }) => {
  const [user, setUser] = useState("user");

  const [successMessage, setSuccessMessage] = createSignal(undefined);
  const [errorMessage, setErrorMessage] = createSignal(undefined);

  const [metadata, setMetadata] = createStore({}, { name: "metadata-object" });

  const [date, setDate] = createSignal(format(Date.now(), "dd/MM/yyyy"));
  const [growBedsCount, setGrowBedsCount] = createSignal(undefined);
  const [hasGrowBags, setHasGrowBags] = createSignal("no");
  const [growBagsCount, setGrowBagsCount] = createSignal(undefined);

  const [selectedSeedling, setSelectedSeedling] = createSignal(undefined);
  const [seedlingCount, setSeedlingCount] = createSignal(undefined);

  const [equipmentOnSite, setEquipmentOnSite] = createSignal(false);

  const addGrowBed = async () => {
    const response = await axios.post(
      apiUrl + "growBeds",
      {
        date: date(),
        growBedsCount: growBedsCount(),
        hasGrowBags: hasGrowBags(),
        growBagsCount: growBagsCount(),
        seedling: selectedSeedling(),
        seedlingCount: seedlingCount(),
        equipmentOnSite: equipmentOnSite(),
      },
      { headers: { Authorization: "Bearer " + user.token } }
    );

    if (response.data.error) return setErrorMessage(response.data.message);
    else {
      setSuccessMessage("Successfully created grow bed.");

      setTimeout(() => {
        setDate(format(Date.now(), "dd/MM/yyyy"));
        setGrowBedsCount(undefined);
        setHasGrowBags("no");
        setGrowBagsCount(undefined);
        setSelectedSeedling(undefined);
        setSeedlingCount(undefined);
        setEquipmentOnSite(false);

        setSuccessMessage(undefined);

        added();
      }, 1500);
    }
  };

  return (
    <div class="absolute m-3 md:m-0 bg-neutral-900 bg-opacity-50 left-0 top-0 right-0 bottom-0 flex flex-col items-center justify-center animate-fade-in z-50">
      <div class="flex flex-col w-full md:w-3/5 h-full overflow-y-auto  space-y-3 bg-neutral-900 border-l border-t border-r border-b border-neutral-700 rounded p-2">
        <div class="flex items-center justify-between w-full">
          <div class="cookie text-white text-2xl">Add Grow Bed</div>
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
              addGrowBed();
            }
          }}
          class="flex flex-col w-full h-auto space-y-3 bg-neutral-100 rounded p-3"
        >
          <div class="cookie text-2xl">Grow Beds</div>
          <div class="flex flex-col w-full space-y-1">
            <div class="">
              When did the beds get made? <span class="text-red-500">*</span>
            </div>
            <DatePicker
              defaultDate={date()}
              onChange={(date) =>
                setDate(
                  format(parse(date, "dd/MM/yyyy", Date.now()), "dd/MM/yyyy")
                )
              }
            />
          </div>
          <div class="flex flex-col w-full space-y-1">
            <div class="">
              How many beds were made? <span class="text-red-500">*</span>
            </div>
            <input
              type="number"
              class="px-3 py-2 w-full bg-neutral-100 text-black border-l border-t border-r border-b border-neutral-400 rounded outline-none"
              value={growBedsCount()}
              onChange={(event) =>
                setGrowBedsCount(parseInt(event.target.value))
              }
              placeholder="How many beds were made?"
            />
          </div>
          <div class="flex flex-col w-full space-y-1">
            <div class="">
              Are there any grow bags? <span class="text-red-500">*</span>
            </div>
            <SelectMenu
              defaultItem={hasGrowBags()}
              items={["yes", "no"]}
              selectionChanged={(item) => setHasGrowBags(item)}
            />
          </div>
          {hasGrowBags() === "yes" && (
            <div class="flex flex-col w-full space-y-1">
              <div class="">
                How many grow bags were made?{" "}
                <span class="text-red-500">*</span>
              </div>
              <input
                type="number"
                class="px-3 py-2 w-full bg-neutral-100 text-black border-l border-t border-r border-b border-neutral-400 rounded outline-none"
                value={growBagsCount()}
                onChange={(event) =>
                  setGrowBagsCount(parseInt(event.target.value))
                }
                placeholder="How many grow bags were made?"
              />
            </div>
          )}

          <div class="cookie text-2xl">Seedlings</div>
          <div class="flex flex-col w-full space-y-1">
            <div class="">
              What crops were planted? <span class="text-red-500">*</span>
            </div>
            <SelectMenu
              items={[
                "Beans",
                "Beetroot",
                "Peppers",
                "Broccoli",
                "Cabbage",
                "Carrots",
                "Cauliflower",
                "Corn",
                "Garlic",
                "Pepper",
                "Lettuce",
                "Onion",
                "Spring onion",
                "Peas",
                "Potatoes",
                "Spinach",
                "Tomatoes",
                "Chillis",
                "Other",
              ]}
              selectionChanged={(item) => setSelectedSeedling(item)}
            />
          </div>
          {selectedSeedling() && (
            <div class="flex flex-col w-full space-y-1">
              <div class="">
                How many {selectedSeedling()} seedlings were planted?{" "}
                <span class="text-red-500">*</span>
              </div>
              <input
                type="number"
                class="px-3 py-2 w-full bg-neutral-100 text-black border-l border-t border-r border-b border-neutral-400 rounded outline-none"
                value={seedlingCount()}
                onChange={(event) =>
                  setSeedlingCount(parseInt(event.target.value))
                }
                placeholder={`How many ${selectedSeedling()} seedlings were planted`}
              />
            </div>
          )}

          <div class="cookie text-2xl">Equipment</div>

          <ul class="px-6 list-disc">
            <li>JoJo Tank</li>
            <li>Tunnel</li>
            <li>Fork</li>
            <li>Spade</li>
            <li>Rake</li>
            <li>Shed</li>
            <li>Irrigation</li>
            <li>Pump</li>
            <li>Electrical</li>
          </ul>
          <div
            class="flex items-center space-x-2 w-full cursor-pointer"
            onClick={() => setEquipmentOnSite(!equipmentOnSite())}
          >
            <span class="">
              {equipmentOnSite() ? (
                <div class="bg-lime-500 p-1 text-black rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="w-3 h-3"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M4.5 12.75l6 6 9-13.5"
                    />
                  </svg>
                </div>
              ) : (
                <div class="bg-neutral-300 p-1 text-black rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="w-3 h-3"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
              )}
            </span>
            <div>Are the following items on site?</div>
          </div>
          <button class="flex items-center justify-center py-2 w-full bg-lime-400 hover:bg-lime-300 active:bg-lime-400 transition-all duration-300 ease-in-out text-black rounded cursor-pointer">
            Add Growbed
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddGrowBedModal;
