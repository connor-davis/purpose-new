import { createSignal } from "solid-js";
import { createStore } from "solid-js/store";
import useState from "../../../hooks/state";
import SelectMenu from "../../selectmenu/selectmenu";

const HarvestProduceModal = ({
  defaultMetadata = { harvestProduce },
  added = (_produce) => {},
  closed = () => {},
}) => {
  const [user, setUser] = useState("user");

  const [successMessage, setSuccessMessage] = createSignal(undefined);
  const [errorMessage, setErrorMessage] = createSignal(undefined);

  const [metadata, setMetadata] = createStore(
    defaultMetadata,
    "metadata-object"
  );
  const [produce, setProduce] = createSignal(defaultMetadata.harvestProduce);
  const [currentPage, setCurrentPage] = createSignal(1);
  const [totalPages, setTotalPages] = createSignal(0);

  const produceTypes = [
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
  ];

  const updateHarvestProduce = () => {
    added(produce());
  };

  return (
    <div class="absolute m-3 p-3 md:m-0 bg-neutral-900 bg-opacity-50 left-0 top-0 right-0 bottom-0 flex flex-col items-center justify-center animate-fade-in">
      <div class="flex flex-col w-full max-w-[500px] h-auto space-y-3 bg-neutral-900 border-l border-t border-r border-b border-neutral-700 rounded p-2">
        <div class="flex items-center justify-between w-full">
          <div class="cookie text-white text-2xl">Add Harvest Produce</div>
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

        <div class="flex flex-col w-full h-full">
          <div class="flex flex-col space-y-3 text-black bg-white w-full h-full overflow-hidden rounded p-3">
            <div class="flex items-end">
              <div
                onClick={() => {
                  setProduce([
                    ...produce(),
                    {
                      produceType: undefined,
                      weight: undefined,
                      yield: undefined,
                    },
                  ]);
                }}
                class="flex items-center justify-center p-2 bg-lime-400 hover:bg-lime-300 active:bg-lime-400 transition-all duration-300 ease-in-out text-black rounded cursor-pointer"
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
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </svg>
              </div>
            </div>
            {produce().length > 0 ? (
              <div class="flex flex-col space-y-3 w-full h-full max-h-[500px] overflow-y-auto">
                <For each={produce()}>
                  {(produceItem, index) => (
                    <div class="flex flex-col space-y-2 border-l border-t border-r border-b border-neutral-200 p-2 rounded">
                      <div class="flex w-full items-end justify-end">
                        <div
                          onClick={() => {
                            setProduce(
                              [...produce()].filter(
                                (_, produceItemIndex) =>
                                  produceItemIndex !== index()
                              )
                            );
                          }}
                          class="flex items-center justify-center p-2 bg-red-400 hover:bg-red-300 active:bg-red-400 transition-all duration-300 ease-in-out text-black rounded cursor-pointer"
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
                              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                            />
                          </svg>
                        </div>
                      </div>
                      <div class="min-w-[200px]">
                        <SelectMenu
                          defaultItem={produceItem.produceType}
                          items={produceTypes}
                          selectionChanged={(item) => {
                            setProduce(
                              [...produce()].map(
                                (produceItem, produceItemIndex) => {
                                  if (produceItemIndex === index())
                                    return {
                                      ...produceItem,
                                      produceType: item,
                                    };
                                  else return produceItem;
                                }
                              )
                            );
                          }}
                        />
                      </div>
                      <input
                        class="px-3 min-w-[140px] py-2 w-full bg-neutral-200 text-black border-l border-t border-r border-b border-neutral-200 rounded outline-none"
                        value={produceItem.count}
                        onChange={(event) => {
                          setProduce(
                            [...produce()].map(
                              (produceItem, produceItemIndex) => {
                                if (produceItemIndex === index())
                                  return {
                                    ...produceItem,
                                    count: event.target.value,
                                  };
                                else return produceItem;
                              }
                            )
                          );
                        }}
                        type="number"
                        placeholder="Number"
                      />
                      <input
                        class="px-3 min-w-[140px] py-2 w-full bg-neutral-200 text-black border-l border-t border-r border-b border-neutral-200 rounded outline-none"
                        value={produceItem.weight}
                        onChange={(event) => {
                          setProduce(
                            [...produce()].map(
                              (produceItem, produceItemIndex) => {
                                if (produceItemIndex === index())
                                  return {
                                    ...produceItem,
                                    weight: event.target.value,
                                  };
                                else return produceItem;
                              }
                            )
                          );
                        }}
                        type="number"
                        placeholder="Weight"
                      />
                      <input
                        class="px-3 min-w-[140px] py-2 w-full bg-neutral-200 text-black border-l border-t border-r border-b border-neutral-200 rounded outline-none"
                        value={produceItem.yield}
                        onChange={(event) => {
                          setProduce(
                            [...produce()].map(
                              (produceItem, produceItemIndex) => {
                                if (produceItemIndex === index())
                                  return {
                                    ...produceItem,
                                    yield: event.target.value,
                                  };
                                else return produceItem;
                              }
                            )
                          );
                        }}
                        type="number"
                        placeholder="Yield"
                      />
                    </div>
                  )}
                </For>
              </div>
            ) : (
              <div class="flex flex-col w-full h-full items-center justify-center">
                You have no produce added.
              </div>
            )}
          </div>
        </div>
        <button
          onClick={() => updateHarvestProduce()}
          class="flex animate-fade-in items-center justify-center py-2 w-full bg-neutral-900 text-white hover:text-lime-300 border-l border-t border-r border-b border-neutral-700 transition-all duration-300 ease-in-out rounded cursor-pointer"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default HarvestProduceModal;
