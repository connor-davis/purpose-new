import { createSignal } from "solid-js";
import apiUrl from "../../../apiUrl";
import axios from "axios";
import useState from "../../../hooks/state";
import DatePicker from "../../datepicker/datepicker";
import { format, getDaysInMonth, getYear, parse } from "date-fns";
import { createStore } from "solid-js/store";
import SaleProductsModal from "./saleProducts";
import SelectMenu from "../../selectmenu/selectmenu";

const EditSaleModal = ({ data = {}, edited = () => {}, closed = () => {} }) => {
  const [user, setUser] = useState("user");

  const [successMessage, setSuccessMessage] = createSignal(undefined);
  const [errorMessage, setErrorMessage] = createSignal(undefined);

  const [metadata, setMetadata] = createStore(
    {
      saleProducts: Object.fromEntries(
        data.products.map((product) => [product._id, product.numberSold])
      ),
    },
    { name: "metadata-object" }
  );
  const [date, setDate] = createSignal(
    format(parse(data.date, "dd/MM/yyyy", Date.now()), "dd/MM/yyyy") ||
      format(Date.now(), "dd/MM/yyyy")
  );
  const [year, setYear] = createSignal(
    getYear(parse(data.date, "dd/MM/yyyy", Date.now()) || Date.now())
  );
  const [month, setMonth] = createSignal(
    format(parse(data.date, "dd/MM/yyyy", Date.now()) || Date.now(), "MMMM")
  );
  const [products, setProducts] = createStore(data.products || [], {
    name: "products-list",
  });
  const [profit, setProfit] = createSignal(data.profit || undefined);
  const [income, setIncome] = createSignal(data.income || undefined);

  const [showSaleProducts, setShowSaleProducts] = createSignal(false);

  const editSale = async () => {
    const response = await axios.put(
      apiUrl + "sales",
      {
        _id: data._id,
        date: income()
          ? `${getDaysInMonth(
              parse(`01 ${month()} ${year()}`, "dd MMMM yyyy", Date.now())
            )}/${format(
              parse(`01 ${month()} ${year()}`, "dd MMMM yyyy", Date.now()),
              "MM"
            )}/${year()}`
          : date(),
        products,
        profit: profit(),
        income: income(),
      },
      { headers: { Authorization: "Bearer " + user.token } }
    );

    if (response.data.error) return setErrorMessage(response.data.message);
    else {
      setSuccessMessage("Successfully edited sale.");

      setTimeout(() => {
        setDate(
          format(parse(data.date, "dd/MM/yyyy", Date.now()), "dd/MM/yyyy") ||
            format(Date.now(), "dd/MM/yyyy")
        );
        setYear(
          getYear(parse(data.date, "dd/MM/yyyy", Date.now()) || Date.now())
        );
        setMonth(
          format(
            parse(data.date, "dd/MM/yyyy", Date.now()) || Date.now(),
            "MMMM"
          )
        );
        setProducts([]);
        setProfit(undefined);
        setIncome(undefined);
        setMetadata({});

        setSuccessMessage(undefined);

        edited();
      }, 1500);
    }
  };

  return (
    <div class="absolute m-3 md:m-0 bg-neutral-900 bg-opacity-50 left-0 top-0 right-0 bottom-0 flex flex-col items-center justify-center animate-fade-in">
      {!income() && showSaleProducts() && (
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
          <div class="cookie text-white text-2xl">
            Edit {income() && "Income "}Sale
          </div>
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
              editSale();
            }
          }}
          class="flex flex-col w-full h-auto space-y-3 bg-neutral-100 rounded p-3"
        >
          {!income() && (
            <div class="flex flex-col w-full space-y-1">
              <div class="">
                Sale Products <span class="text-red-500">*</span>
              </div>
              <div
                onClick={() => setShowSaleProducts(true)}
                class="flex items-center justify-center py-2 w-full bg-lime-400 hover:bg-lime-300 active:bg-lime-400 transition-all duration-300 ease-in-out text-black rounded cursor-pointer"
              >
                {products.length === 0
                  ? "Add Sale Products"
                  : `Edit ${products.length} sale products`}
              </div>
              <div class="text-neutral-400">
                What products were in this sale?
              </div>
            </div>
          )}
          {income() && (
            <div class="flex flex-col w-full space-y-1">
              <div class="">
                Income Year <span class="text-red-500">*</span>
              </div>
              <input
                type="number"
                placeholder="Year"
                value={year() || ""}
                min={0}
                onChange={(event) => setYear(event.target.value)}
                class="px-3 py-2 w-full bg-neutral-100 text-black border-l border-t border-r border-b border-neutral-200 rounded outline-none"
                required
              />
              <div class="text-neutral-400">What year is the income for?</div>
            </div>
          )}
          {!income() && (
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
          )}
          {income() && (
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
          )}
          {!income() && (
            <div class="flex flex-col w-full space-y-1">
              <div class="">
                Sale Profit <span class="text-red-500">*</span>
              </div>
              <div class="px-3 py-2 w-full bg-neutral-200 text-black border-l border-t border-r border-b border-neutral-200 rounded outline-none">
                R {profit() || 0}
              </div>
              <div class="text-neutral-400">
                You have made this much profit.
              </div>
            </div>
          )}
          {income() && (
            <div class="flex flex-col w-full space-y-1">
              <div class="">
                Income Amount (R) <span class="text-red-500">*</span>
              </div>
              <input
                type="number"
                step="0.01"
                placeholder="Income Amount (R)"
                value={income() || ""}
                min={0}
                onChange={(event) => setIncome(event.target.value)}
                class="px-3 py-2 w-full bg-neutral-100 text-black border-l border-t border-r border-b border-neutral-200 rounded outline-none"
                required
              />
              <div class="text-neutral-400">What amount was the income?</div>
            </div>
          )}
          <button class="flex items-center justify-center py-2 w-full bg-lime-400 hover:bg-lime-300 active:bg-lime-400 transition-all duration-300 ease-in-out text-black rounded cursor-pointer">
            Edit Sale
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditSaleModal;
