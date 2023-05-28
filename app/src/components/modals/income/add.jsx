import { createSignal } from "solid-js";
import useState from "../../../hooks/state";
import { format, getDaysInMonth, getYear, parse } from "date-fns";
import { createStore } from "solid-js/store";
import SelectMenu from "../../selectmenu/selectmenu";
import axios from "axios";
import apiUrl from "../../../apiUrl";

const AddIncomeModal = ({ added = () => {}, closed = () => {} }) => {
  const [user, setUser] = useState("user");

  const [successMessage, setSuccessMessage] = createSignal(undefined);
  const [errorMessage, setErrorMessage] = createSignal(undefined);

  const [metadata, setMetadata] = createStore({}, { name: "metadata-object" });
  const [year, setYear] = createSignal(getYear(Date.now()));
  const [month, setMonth] = createSignal(format(Date.now(), "MMMM"));
  const [income, setIncome] = createSignal(undefined);

  const addIncome = async () => {
    const response = await axios.post(
      apiUrl + "sales?type=income",
      {
        date: `${getDaysInMonth(
          parse(`01 ${month()} ${year()}`, "dd MMMM yyyy", Date.now())
        )}/${format(
          parse(`01 ${month()} ${year()}`, "dd MMMM yyyy", Date.now()),
          "MM"
        )}/${year()}`,
        income: income(),
      },
      { headers: { Authorization: "Bearer " + user.token } }
    );

    if (response.data.error) return setErrorMessage(response.data.message);
    else {
      setSuccessMessage("Successfully created income.");

      setTimeout(() => {
        setYear(getYear(Date.now()));
        setMonth(format(Date.now(), "MMMM"));
        setIncome(undefined);

        setSuccessMessage(undefined);

        added();
      }, 1500);
    }
  };

  return (
    <div class="absolute m-3 md:m-0 bg-neutral-900 bg-opacity-50 left-0 top-0 right-0 bottom-0 flex flex-col items-center justify-center animate-fade-in z-50">
      <div class="flex flex-col w-full md:w-3/5 h-full overflow-y-auto  space-y-3 bg-neutral-900 border-l border-t border-r border-b border-neutral-700 rounded p-2">
        <div class="flex items-center justify-between w-full">
          <div class="cookie text-white text-2xl">Add Income</div>
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
              addIncome();
            }
          }}
          class="flex flex-col w-full h-auto space-y-3 bg-neutral-100 rounded p-3"
        >
          <div class="flex flex-col w-full space-y-1">
            <div class="">
              Income Year <span class="text-red-500">*</span>
            </div>
            <input
              type="number"
              placeholder="Year"
              value={year() || ""}
              onChange={(event) => setYear(event.target.value)}
              class="px-3 py-2 w-full bg-neutral-100 text-black border-l border-t border-r border-b border-neutral-200 rounded outline-none"
              required
            />
            <div class="text-neutral-400">What year is the income for?</div>
          </div>
          <div class="flex flex-col w-full space-y-1">
            <div class="">
              Income Month <span class="text-red-500">*</span>
            </div>
            <SelectMenu
              defaultItem={month()}
              items={[
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December",
              ]}
              selectionChanged={(month) => setMonth(month)}
            />
            <div class="text-neutral-400">What month is the income for?</div>
          </div>
          <div class="flex flex-col w-full space-y-1">
            <div class="">
              Income Amount (R) <span class="text-red-500">*</span>
            </div>
            <input
              type="number"
              step="0.01"
              placeholder="Income Amount (R)"
              value={income() || ""}
              onChange={(event) => setIncome(event.target.value)}
              class="px-3 py-2 w-full bg-neutral-100 text-black border-l border-t border-r border-b border-neutral-200 rounded outline-none"
              required
            />
            <div class="text-neutral-400">What amount was the income?</div>
          </div>
          <button class="flex items-center justify-center py-2 w-full bg-lime-400 hover:bg-lime-300 active:bg-lime-400 transition-all duration-300 ease-in-out text-black rounded cursor-pointer">
            Add Income
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddIncomeModal;
