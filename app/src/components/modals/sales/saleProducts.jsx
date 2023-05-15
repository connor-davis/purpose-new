import axios from "axios";
import { createSignal, onMount } from "solid-js";
import { createStore } from "solid-js/store";
import apiUrl from "../../../apiUrl";
import useState from "../../../hooks/state";
import Pager from "../../pager";

const SaleProductsModal = ({
  defaultMetadata = { saleProducts: {} },
  added = (_products, _saleProfit, _metadata) => {},
  closed = () => {},
}) => {
  const [user, setUser] = useState("user");

  const [successMessage, setSuccessMessage] = createSignal(undefined);
  const [errorMessage, setErrorMessage] = createSignal(undefined);

  const [metadata, setMetadata] = createStore(
    defaultMetadata,
    "metadata-object"
  );
  const [products, setProducts] = createSignal([]);
  const [currentPage, setCurrentPage] = createSignal(1);
  const [totalPages, setTotalPages] = createSignal(0);

  const [loading, setLoading] = createSignal(true);

  onMount(() => {
    fetchProducts();
  });

  const fetchProducts = () => {
    setTimeout(async () => {
      const response = await axios.get(
        apiUrl +
          "products/page/" +
          currentPage() +
          "?limit=10&userId=" +
          user.data._id,
        { headers: { Authorization: "Bearer " + user.token } }
      );

      const { data, totalProducts, totalPages } = response.data;

      if (data.length === 0 && totalProducts > 0) {
        if (currentPage() > 1) setCurrentPage(currentPage() - 1);
        fetchProducts();
      } else {
        setProducts(data);
        setTotalPages(totalPages);
      }

      setLoading(false);
    }, 100);
  };

  const updateSaleProfits = async () => {
    let _totalProfit = 0;

    const _products = products()
      .map((product) => {
        const productNumberSold = metadata.saleProducts[product._id];
        const profit = (product.price - product.cost) * productNumberSold;

        _totalProfit += profit;

        if (profit > 0)
          return {
            _id: product._id,
            cost: product.cost,
            price: product.price,
            numberSold: productNumberSold,
          };
      })
      .filter((product) => product !== undefined);

    added(_products, _totalProfit, metadata);
  };

  return (
    <div class="absolute m-3 p-3 md:m-0 bg-neutral-900 bg-opacity-50 left-0 top-0 right-0 bottom-0 flex flex-col items-center justify-center animate-fade-in">
      <div class="flex flex-col w-full h-full space-y-3 bg-neutral-900 border-l border-t border-r border-b border-neutral-700 rounded p-2">
        <div class="flex items-center justify-between w-full">
          <div class="cookie text-white text-2xl">Add Sale Product</div>
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
            {loading() ? (
              <div class="flex flex-col space-y-2 animate-fade-in">
                <div class="bg-neutral-200 animate-pulse w-full h-10"></div>
                <div class="bg-neutral-200 animate-pulse w-full h-10"></div>
                <div class="bg-neutral-200 animate-pulse w-full h-10"></div>
              </div>
            ) : products().length > 0 ? (
              <div class="flex flex-col w-full h-full overflow-y-auto">
                <table class="table-auto bg-white border-l border-t border-r border-neutral-200 text-black">
                  <thead>
                    <tr class="p-3 border-b border-neutral-200 bg-neutral-900 text-white select-none">
                      <th class="text-left p-3">Name</th>
                      <th class="text-left p-3">Cost</th>
                      <th class="p-3 text-left">Price</th>
                      <th class="p-3 w-24">Number Sold</th>
                    </tr>
                  </thead>
                  <tbody>
                    <For each={products()}>
                      {(product) => (
                        <tr class="hover:bg-neutral-100 border-b border-neutral-200 group">
                          <td class="flex items-center space-x-2 p-3">
                            <div class="flex items-center h-9">
                              <img
                                src={apiUrl + "files/view/" + product.image}
                                class="w-10 h-10 rounded"
                              />
                            </div>
                            <div class="flex items-center h-9">
                              {product.name}
                            </div>
                          </td>
                          <td class="p-3">R {product.cost}</td>
                          <td class="p-3">R {product.price}</td>
                          <td class="p-3">
                            <input
                              class="px-3 min-w-[140px] py-2 w-full bg-neutral-200 text-black border-l border-t border-r border-b border-neutral-400 rounded outline-none"
                              value={
                                metadata.saleProducts
                                  ? metadata.saleProducts[product._id]
                                    ? metadata.saleProducts[product._id]
                                    : ""
                                  : ""
                              }
                              onChange={(event) => {
                                let newSaleProducts = {
                                  ...metadata.saleProducts,
                                };

                                newSaleProducts[product._id] =
                                  event.target.value;

                                setMetadata({ saleProducts: newSaleProducts });
                              }}
                              type="number"
                              placeholder="Number Sold"
                            />
                          </td>
                        </tr>
                      )}
                    </For>
                  </tbody>
                </table>
              </div>
            ) : (
              <div class="flex flex-col w-full h-full items-center justify-center">
                You have no products.
              </div>
            )}
            {products().length > 0 && (
              <div>
                <Pager
                  currentPage={currentPage}
                  pageCount={totalPages}
                  pageChanged={(page) => {
                    setCurrentPage(page);
                    fetchProducts();
                  }}
                />
              </div>
            )}
          </div>
        </div>
        <button
          onClick={() => updateSaleProfits()}
          class="flex animate-fade-in items-center justify-center py-2 w-full bg-neutral-900 text-white hover:text-lime-300 border-l border-t border-r border-b border-neutral-700 transition-all duration-300 ease-in-out rounded cursor-pointer"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default SaleProductsModal;
