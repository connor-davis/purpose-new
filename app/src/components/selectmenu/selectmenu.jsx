import { createSignal} from "solid-js";

const SelectMenu = ({
  items = [],
  defaultItem = undefined,
  selectionChanged = (item) => {},
}) => {
  const [showDropper, setShowDropper] = createSignal(false);
  const [selectedItem, setSelectedItem] = createSignal(defaultItem);

  return (
    <div class="relative w-full md:max-w-[200px]">
      {showDropper() && (
        <div class="absolute flex flex-col space-y-2 w-full max-h-48 overflow-y-auto bg-neutral-100 text-black border-l border-t border-r border-b border-neutral-200 rounded outline-none z-50">
          {items.map((item, index) => (
            <div
              class="cursor-pointer px-3 py-2 hover:bg-neutral-200 rounded"
              onClick={() => {
                setSelectedItem(index);
                selectionChanged(item);
                setShowDropper(false);
              }}
            >
              {item.split("")[0].toUpperCase() + item.substring(1, item.length)}
            </div>
          ))}
        </div>
      )}
      <div
        onClick={() => {
          return setShowDropper(true);
        }}
        class="flex items-center cursor-pointer space-x-2 px-3 py-2 w-full bg-neutral-100 text-black border-l border-t border-r border-b border-neutral-200 rounded outline-none"
      >
        <div class="w-full">
          {selectedItem() !== undefined
            ? items[selectedItem() || 0]
              ? items[selectedItem() || 0].split("")[0].toUpperCase() +
                items[selectedItem() || 0].substring(
                  1,
                  items[selectedItem()].length
                )
              : defaultItem.split("")[0].toUpperCase() +
                defaultItem.substring(1, defaultItem.length)
            : "Choose"}
        </div>
        <div>
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
              d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default SelectMenu;
