import { createSignal } from "solid-js";
import apiUrl from "../../../apiUrl";
import axios from "axios";
import useState from "../../../hooks/state";
import DatePicker from "../../datepicker/datepicker";
import { format, parse } from "date-fns";
import { createStore } from "solid-js/store";
import SaleProductsModal from "./saleProducts";

const AddSaleModal = ({ added = () => {}, closed = () => {} }) => {
  const [user, setUser] = useState("user");

  const [successMessage, setSuccessMessage] = createSignal(undefined);
  const [errorMessage, setErrorMessage] = createSignal(undefined);

  const [metadata, setMetadata] = createStore({}, { name: "metadata-object" });
  const [date, setDate] = createSignal(format(Date.now(), "dd/MM/yyyy"));
  const [products, setProducts] = createStore([], { name: "products-list" });
  const [profit, setProfit] = createSignal(undefined);

  const [showSaleProducts, setShowSaleProducts] = createSignal(false);

  const addSale = async () => {
    const response = await axios.post(
      apiUrl + "sales",
      {
        date: date(),
        products,
        profit: profit(),
      },
      { headers: { Authorization: "Bearer " + user.token } }
    );

    if (response.data.error) return setErrorMessage(response.data.message);
    else {
      setSuccessMessage("Successfully created sale.");

      setTimeout(() => {
        setDate(format(Date.now(), "dd/MM/yyyy"));
        setProducts([]);
        setProfit(undefined);

        setSuccessMessage(undefined);

        added();
      }, 1500);
    }
  };

  return (
    <div class="absolute m-3 md:m-0 bg-neutral-900 bg-opacity-50 left-0 top-0 right-0 bottom-0 flex flex-col items-center justify-center animate-fade-in">
      {showSaleProducts() && (
        <SaleProductsModal
          defaultMetadata={metadata}
          added={(_products, _saleProfit, _metadata) => {
            setProducts(_products);
            setProfit(_saleProfit);
            setMetadata(_metadata);
            setShowSaleProducts(false);
          }}
          closed={() => setShowSaleProducts(false)}
        />
      )}

      <div class="flex flex-col w-full md:w-3/5 h-full overflow-y-auto  space-y-3 bg-neutral-900 border-l border-t border-r border-b border-neutral-700 rounded p-2">
        <div class="flex items-center justify-between w-full">
          <div class="cookie text-white text-2xl">Add Sale</div>
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
            }
          }}
          class="flex flex-col w-full h-auto space-y-3 bg-neutral-100 rounded p-3"
        >
          <div class="flex flex-col w-full space-y-1">
            <div class="">
              Sale Products <span class="text-red-500">*</span>
            </div>
            <div
              onClick={() => setShowSaleProducts(true)}
              class="flex items-center justify-center py-2 w-full bg-lime-400 hover:bg-lime-300 active:bg-lime-400 transition-all duration-300 ease-in-out text-black rounded cursor-pointer"
            >
              {products.length === 0
                ? "Edit Sale Products"
                : `${products.length} sale products`}
            </div>
            <div class="text-neutral-400">What products were in this sale?</div>
          </div>
          <div class="flex flex-col w-full space-y-1">
            <div class="">
              Sale Date <span class="text-red-500">*</span>
            </div>
            <DatePicker
              onChange={(date) =>
                setDate(
                  format(parse(date, "dd/MM/yyyy", Date.now()), "dd/MM/yyyy")
                )
              }
            />
            <div class="text-neutral-400">What was the date of the sale?</div>
          </div>
          <div class="flex flex-col w-full space-y-1">
            <div class="">
              Sale Profit <span class="text-red-500">*</span>
            </div>
            <div class="px-3 py-2 w-full bg-neutral-200 text-black border-l border-t border-r border-b border-neutral-400 rounded outline-none">
              R {profit() || 0}
            </div>
            <div class="text-neutral-400">You have made this much profit.</div>
          </div>
          <button
            onClick={() => addSale()}
            class="flex items-center justify-center py-2 w-full bg-lime-400 hover:bg-lime-300 active:bg-lime-400 transition-all duration-300 ease-in-out text-black rounded cursor-pointer"
          >
            Add Sale
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddSaleModal;
