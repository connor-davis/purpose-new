import { addMonths, format, getDaysInMonth, parse, subMonths } from "date-fns";
import { For, createSignal, onMount } from "solid-js";

const DatePicker = ({ dateChanged = (newDate) => {} }) => {
  const [datePickerShown, setDatePickerShown] = createSignal(false);

  const [date, setDate] = createSignal(format(new Date(), "dd/MM/yyyy"));
  const [currentDay, setCurrentDay] = createSignal(
    format(new Date(date()), "dd")
  );
  const [days, setDays] = createSignal(
    Array.from(
      { length: getDaysInMonth(new Date(date())) },
      (value, index) => index + 1
    )
  );
  const [month, setMonth] = createSignal(format(new Date(date()), "MMMM"));
  const [year, setYear] = createSignal(format(new Date(date()), "yyyy"));

  onMount(() => {});

  const updateDate = (dateValue) => {
    setDate(format(parse(dateValue, "dd/MM/yyyy", new Date()), "dd/MM/yyyy"));

    if (currentDay() > getDaysInMonth(parse(date(), "dd/MM/yyyy", new Date())))
      setCurrentDay(getDaysInMonth(parse(date(), "dd/MM/yyyy", new Date())));

    setMonth(format(parse(date(), "dd/MM/yyyy", new Date()), "MMMM"));
    setDays(
      Array.from(
        { length: getDaysInMonth(parse(date(), "dd/MM/yyyy", new Date())) },
        (value, index) => index + 1
      )
    );
    setYear(format(parse(date(), "dd/MM/yyyy", new Date()), "yyyy"));

    dateChanged(format(parse(date(), "dd/MM/yyyy", new Date()), "dd/MM/yyyy"));

    setDate(format(parse(date(), "dd/MM/yyyy", new Date()), "dd/MM/yyyy"));
  };

  const increase = () => {
    const newDate = addMonths(parse(date(), "dd/MM/yyyy", new Date()), 1);

    updateDate(format(new Date(newDate), "dd/MM/yyyy"));
  };

  const decrease = () => {
    const newDate = subMonths(parse(date(), "dd/MM/yyyy", new Date()), 1);

    updateDate(format(new Date(newDate), "dd/MM/yyyy"));
  };

  return (
    <div>
      <div
        class="flex items-center justify-center w-full h-auto px-6 py-2 border-l border-t border-r border-b border-neutral-300 rounded cursor-pointer"
        onClick={() => setDatePickerShown(true)}
      >
        {date()}
      </div>
      {datePickerShown() && (
        <div class="absolute flex flex-col items-center justify-center left-0 top-0 right-0 bottom-0 bg-neutral-900 bg-opacity-50">
          <div class="flex flex-col space-y-3 w-full md:w-96 rounded bg-white p-3">
            <div class="flex items-center justify-between">
              <div class="text-black cookie text-2xl">Select Date</div>
              <div
                class="text-black hover:text-red-500 transition-all duration-300 ease-in-out cursor-pointer"
                onClick={() => setDatePickerShown(false)}
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
            <div class="flex flex-col w-full">
              <div class="flex items-center border-y border-x border-neutral-300 rounded-t">
                <div
                  onClick={() => decrease()}
                  class="hover:bg-lime-300 active:bg-lime-400 transition-all duration-300 ease-in-out p-2 cursor-pointer"
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
                      d="M15.75 19.5L8.25 12l7.5-7.5"
                    />
                  </svg>
                </div>
                <div class="flex items-center justify-center w-full border-x border-neutral-300 p-2 cursor-pointer">
                  {month()}
                </div>
                <div class="flex items-center justify-center w-full border-r border-neutral-300 p-2 cursor-pointer">
                  {year()}
                </div>
                <div
                  onClick={() => increase()}
                  class="hover:bg-lime-300 active:bg-lime-400 transition-all duration-300 ease-in-out p-2 cursor-pointer"
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
                      d="M8.25 4.5l7.5 7.5-7.5 7.5"
                    />
                  </svg>
                </div>
              </div>
              <div class="grid grid-cols-7 border-b border-x border-neutral-300 rounded-b">
                <For
                  each={days()}
                  fallback={() => <div>Could not loop days.</div>}
                >
                  {(day) => (
                    <div
                      onClick={() => {
                        setCurrentDay(day);

                        const dateFormat = format(
                          new Date(`${currentDay()}/${month()}/${year()}`),
                          "dd/MM/yyyy"
                        );
                        updateDate(dateFormat);

                        setDatePickerShown(false);
                      }}
                      class={`flex flex-col items-center justify-center hover:bg-lime-300 active:bg-lime-400 transition-all duration-300 ease-in-out cursor-pointer py-3 ${
                        parseInt(currentDay()) === day && "bg-lime-400"
                      }`}
                    >
                      {day}
                    </div>
                  )}
                </For>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DatePicker;
