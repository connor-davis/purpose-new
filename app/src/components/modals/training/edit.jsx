import { createSignal } from "solid-js";
import apiUrl from "../../../apiUrl";
import axios from "axios";
import useState from "../../../hooks/state";
import DatePicker from "../../datepicker/datepicker";
import SelectMenu from "../../selectmenu/selectmenu";

const EditTrainingModal = ({
  data = {},
  edited = () => {},
  closed = () => {},
}) => {
  const [user, setUser] = useState("user");

  const [successMessage, setSuccessMessage] = createSignal(undefined);
  const [errorMessage, setErrorMessage] = createSignal(undefined);

  const [trainingId, setTrainingId] = createSignal(data._id || undefined);
  const [trainingDate, setTrainingDate] = createSignal(data.date || undefined);
  const [trainingNumberTrained, setTrainingNumberTrained] = createSignal(
    data.numberTrained || undefined
  );
  const [trainingType, setTrainingType] = createSignal(
    data.trainingType || undefined
  );

  const editTraining = async () => {
    const data = {
      _id: trainingId(),
      user: user.data._id,
      date: trainingDate(),
      kgs: parseFloat(trainingNumberTrained()),
      trainingType: trainingType(),
    };

    if (data.user === (null || undefined))
      return setErrorMessage("You need to be authenticated to add a training.");
    if (data.date === (null || undefined))
      return setErrorMessage("Please give your training a date.");
    if (data.kgs === (null || undefined))
      return setErrorMessage("Please give your training a numeric number.");
    if (data.trainingType === (null || undefined))
      return setErrorMessage("Please give your training a type.");

    const response = await axios.put(apiUrl + "training", data, {
      headers: { Authorization: "Bearer " + user.token },
    });

    if (response.data.error) return setErrorMessage(response.data.message);
    else {
      setSuccessMessage("Successfully edited training.");

      setTimeout(() => {
        setSuccessMessage(undefined);

        setTrainingId(undefined);
        setTrainingDate(undefined);
        setTrainingNumberTrained(undefined);
        setTrainingType(undefined);

        edited();
      }, 1000);
    }
  };

  return (
    <div class="absolute bg-neutral-900 bg-opacity-50 left-0 top-0 right-0 bottom-0 flex flex-col items-center justify-center animate-fade-in">
      <div class="flex flex-col w-full md:w-3/5 h-full overflow-y-auto  space-y-3 bg-neutral-900 border-l border-t border-r border-b border-neutral-700 rounded p-2">
        <div class="flex items-center justify-between w-full">
          <div class="cookie text-white text-2xl">Edit Training</div>
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
              editTraining();
            }
          }}
          class="flex flex-col w-full h-auto space-y-3 bg-neutral-100 rounded p-3"
        >
          <div class="flex flex-col w-full space-y-1">
            <div class="">
              Training Date <span class="text-red-500">*</span>
            </div>
            <DatePicker
              defaultDate={trainingDate()}
              onChange={(date) => setTrainingDate(date)}
            />
            <div class="text-neutral-400">What date was the training done?</div>
          </div>
          <div class="flex flex-col w-full space-y-1">
            <div class="">
              Number Trained <span class="text-red-500">*</span>
            </div>
            <input
              type="number"
              placeholder="Number Trained"
              value={trainingNumberTrained() || ""}
              onChange={(event) => setTrainingNumberTrained(event.target.value)}
              class="px-3 py-2 w-full bg-neutral-100 text-black border-l border-t border-r border-b border-neutral-200 rounded outline-none"
              required
            />
            <div class="text-neutral-400">How many people did you train?</div>
          </div>
          <div class="flex flex-col w-full space-y-1">
            <div class="">
              Training Type <span class="text-red-500">*</span>
            </div>
            <SelectMenu
              defaultItem={trainingType()}
              items={[
                "Township Economy",
                "ECD Business",
                "ECD IT",
                "Agri",
                "Other",
              ]}
              selectionChanged={(type) => setTrainingType(type)}
            />
            <div class="text-neutral-400">
              What type of training did you do?
            </div>
          </div>
          <button class="flex items-center justify-center py-2 w-full bg-lime-400 hover:bg-lime-300 active:bg-lime-400 transition-all duration-300 ease-in-out text-black rounded cursor-pointer">
            Edit Training
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditTrainingModal;
