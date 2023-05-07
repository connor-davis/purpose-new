import { For } from "solid-js";

const Pager = ({ currentPage, pageCount, pageChanged = (page) => {} }) => {
  return (
    <div class="flex items-center justify-center space-x-2">
      <div
        class="hover:bg-lime-300 active:bg-lime-400 transition-all duration-300 ease-in-out p-2 rounded-full cursor-pointer"
        onClick={() => currentPage() - 1 > 0 && pageChanged(currentPage() - 1)}
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
      <div class="flex items-center space-x-2">
        <For
          each={Array.from({ length: pageCount() }, (value, index) => index)}
        >
          {(page) => (
            <div
              class={`${
                currentPage() === page + 1 && "bg-lime-400 text-black"
              } hover:bg-lime-300 active:bg-lime-400 transition-all duration-300 ease-in-out px-4 py-2 rounded-full cursor-pointer`}
              onClick={() => pageChanged(page + 1)}
            >
              {page + 1}
            </div>
          )}
        </For>
      </div>
      <div
        class="hover:bg-lime-300 active:bg-lime-400 transition-all duration-300 ease-in-out p-2 rounded-full cursor-pointer"
        onClick={() =>
          currentPage() < pageCount() && pageChanged(currentPage() + 1)
        }
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
  );
};

export default Pager;
