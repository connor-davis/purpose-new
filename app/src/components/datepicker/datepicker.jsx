import {
  add,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isEqual,
  isSameMonth,
  isToday,
  parse,
  startOfToday,
  startOfWeek,
} from "date-fns";
import { createEffect, createSignal } from "solid-js";

const DatePicker = ({ onChange = (date) => {} }) => {
  const [show, setShow] = createSignal(false);

  let [today, setToday] = createSignal(startOfToday());
  let [selectedDay, setSelectedDay] = createSignal(today());
  let [currentMonth, setCurrentMonth] = createSignal(
    format(today(), "MMMM yyyy")
  );
  let [firstDayCurrentMonth, setFirstDayCurrentMonth] = createSignal(
    parse(currentMonth(), "MMMM yyyy", new Date())
  );

  let [days, setDays] = createSignal(
    eachDayOfInterval({
      start: startOfWeek(firstDayCurrentMonth()),
      end: endOfWeek(endOfMonth(firstDayCurrentMonth())),
    })
  );

  const previousMonth = () => {
    let firstDayPreviousMonth = add(firstDayCurrentMonth(), { months: -1 });

    setCurrentMonth(format(firstDayPreviousMonth, "MMMM yyyy"));
    setFirstDayCurrentMonth(parse(currentMonth(), "MMMM yyyy", new Date()));
    setDays(
      eachDayOfInterval({
        start: startOfWeek(firstDayCurrentMonth()),
        end: endOfWeek(endOfMonth(firstDayCurrentMonth())),
      })
    );
  };

  const nextMonth = () => {
    let firstDayNextMonth = add(firstDayCurrentMonth(), { months: 1 });

    setCurrentMonth(format(firstDayNextMonth, "MMMM yyyy"));
    setFirstDayCurrentMonth(parse(currentMonth(), "MMMM yyyy", new Date()));
    setDays(
      eachDayOfInterval({
        start: startOfWeek(firstDayCurrentMonth()),
        end: endOfWeek(endOfMonth(firstDayCurrentMonth())),
      })
    );
  };

  createEffect(() => {
    onChange(format(selectedDay(), "dd/MM/yyyy"));
  });

  return (
    <>
      {show() && (
        <div class="absolute left-0 top-0 right-0 bottom-0 bg-black bg-opacity-25 flex flex-col items-center justify-center">
          <div class="flex flex-col p-3 space-y-3 w-full md:w-auto bg-white rounded">
            <div class="flex items-center justify-between w-full">
              <div class="cookie text-2xl">Select Date</div>
              <div
                onClick={() => setShow(false)}
                class="hover:text-red-500 transition-all duration-300 ease-in-out cursor-pointer"
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

            <div class="flex items-center justify-between">
              <div class="py-2 text-xl font-bold">{currentMonth()}</div>
              <div class="flex items-center">
                <div
                  onClick={() => previousMonth()}
                  class="p-2 rounded-l border-l border-t border-r border-b border-neutral-200 hover:bg-neutral-100 transition-all duration-300 ease-in-out cursor-pointer"
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
                <div
                  onClick={() => nextMonth()}
                  class="p-2 rounded-r border-t border-r border-b border-neutral-200 hover:bg-neutral-100 transition-all duration-300 ease-in-out cursor-pointer"
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
            </div>

            <div class="flex flex-col">
              <div class="grid grid-cols-7">
                <div class="p-3 border-b border-t border-neutral-200 text-center font-medium">
                  S
                </div>
                <div class="p-3 border-b border-t border-neutral-200 text-center font-medium">
                  M
                </div>
                <div class="p-3 border-b border-t border-neutral-200 text-center font-medium">
                  T
                </div>
                <div class="p-3 border-b border-t border-neutral-200 text-center font-medium">
                  W
                </div>
                <div class="p-3 border-b border-t border-neutral-200 text-center font-medium">
                  T
                </div>
                <div class="p-3 border-b border-t border-neutral-200 text-center font-medium">
                  F
                </div>
                <div class="p-3 border-b border-t border-neutral-200 text-center font-medium">
                  S
                </div>
              </div>
              <div class="grid grid-cols-7">
                <For each={days()}>
                  {(day) => (
                    <div
                      onClick={() => setSelectedDay(day)}
                      class="p-2 text-center border-b border-neutral-200 hover:bg-neutral-100 transition-all duration-300 ease-in-out cursor-pointer"
                    >
                      <div
                        class={`rounded-full px-2 py-1 ${[
                          isEqual(day, selectedDay()) && "bg-lime-400",
                          !isEqual(day, selectedDay()) &&
                            isToday(day) &&
                            "text-lime-600",
                          !isEqual(day, selectedDay()) &&
                            !isToday(day) &&
                            isSameMonth(day, today()) &&
                            "text-black",
                          !isEqual(day, selectedDay()) &&
                            !isToday(day) &&
                            !isSameMonth(day, today()) &&
                            "text-neutral-500",
                        ].join(" ")}`}
                      >
                        {format(day, "d")}
                      </div>
                    </div>
                  )}
                </For>
              </div>
            </div>
          </div>
        </div>
      )}
      <div
        onClick={() => setShow(true)}
        class="flex items-center space-x-3 w-full h-auto px-3 py-2 border-l border-t border-r border-b border-neutral-200 rounded cursor-pointer"
      >
        <div class="text-black">
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
              d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z"
            />
          </svg>
        </div>
        <div class="text-neutral-600">
          {format(selectedDay(), "dd/MM/yyyy")}
        </div>
      </div>
    </>
  );
};

export default DatePicker;
