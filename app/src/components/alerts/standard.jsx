const StandardAlert = ({
  title,
  content,
  options = [{ text: "Ok", type: "success" }],
  optionClicked = (option) => {},
  closed = () => {},
}) => {
  return (
    <div class="absolute left-0 top-0 right-0 bottom-0 flex flex-col items-center">
      <div
        onClick={() => closed()}
        class="absolute left-0 top-0 right-0 bottom-0 flex flex-col items-center p-5 bg-black bg-opacity-25 cursor-pointer"
      ></div>
      <div class="absolute top-5 self-center flex flex-col w-full md:w-auto space-y-3 border-l border-t border-r border-b border-neutral-700 bg-neutral-900 text-white rounded p-3">
        <div class="flex items-center justify-between">
          <div class="text-2xl cookie font-bold">{title}</div>
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
        <div class="text-lg select-text">{content}</div>
        <div class="flex flex-col space-y-2 text-white">
          {options.map((option) => (
            <div
              onClick={() => optionClicked(option.text)}
              class={`flex items-center justify-center px-3 py-2 ${
                option.type === "success" &&
                "bg-lime-400 hover:bg-lime-300 active:bg-lime-400"
              } ${
                option.type === "error" &&
                "bg-red-500 hover:bg-red-400 active:bg-red-500"
              } transition-all duration-300 ease-in-out cursor-pointer rounded`}
            >
              {option.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StandardAlert;
