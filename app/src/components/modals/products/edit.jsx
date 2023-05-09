import { createSignal } from "solid-js";
import apiUrl from "../../../apiUrl";
import axios from "axios";
import useState from "../../../hooks/state";

const EditProductModal = ({
  data = {},
  edited = () => {},
  closed = () => {},
}) => {
  const [user, setUser] = useState("user");

  const [successMessage, setSuccessMessage] = createSignal(undefined);
  const [errorMessage, setErrorMessage] = createSignal(undefined);

  const [productId, setProductId] = createSignal(data._id || undefined);
  const [productImage, setProductImage] = createSignal(data.image || undefined);
  const [productName, setProductName] = createSignal(data.name || undefined);
  const [productCost, setProductCost] = createSignal(data.cost || undefined);
  const [productPrice, setProductPrice] = createSignal(data.price || undefined);

  const updateImage = () => {
    const inputEl = document.createElement("input");

    inputEl.type = "file";
    inputEl.multiple = false;
    inputEl.accept = "image/jpeg,image/png,image/jpg";

    inputEl.click();

    inputEl.addEventListener("change", (event) => {
      const image = event.target.files[0];

      (async () => {
        let form = new FormData();

        form.append("upfiles", image, image.name);

        const response = await axios.post(apiUrl + "files/upload", form, {
          headers: {
            Authorization: "Bearer " + user.token,
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.data.error) {
          setEditingImage(false);
        } else {
          setProductImage(response.data.filenames[0]);
        }
      })();
    });
  };

  const editProduct = async () => {
    const data = {
      _id: productId(),
      _userId: user.data._id,
      image: productImage(),
      name: productName(),
      cost: parseFloat(productCost()),
      price: parseFloat(productPrice()),
    };

    if (data._userId === (null || undefined))
      return setErrorMessage("You need to be authenticated to add a product.");
    if (data.image === (null || undefined))
      return setErrorMessage("Please choose an image.");
    if (data.name === (null || undefined))
      return setErrorMessage("Please give your product a name.");
    if (data.cost === (null || undefined))
      return setErrorMessage("Please give your product a numeric cost.");
    if (data.price === (null || undefined))
      return setErrorMessage("Please give your product a numeric price.");

    const response = await axios.put(apiUrl + "products", data, {
      headers: { Authorization: "Bearer " + user.token },
    });

    if (response.data.error) return setErrorMessage(response.data.message);
    else {
      setSuccessMessage("Successfully edited product.");

      setTimeout(() => {
        setSuccessMessage(undefined);

        setProductImage(undefined);
        setProductName(undefined);
        setProductCost(undefined);
        setProductPrice(undefined);
        
        edited();
      }, 1000);
    }
  };

  return (
    <div class="absolute bg-neutral-900 bg-opacity-50 left-0 top-0 right-0 bottom-0 flex flex-col items-center justify-center animate-fade-in">
      <div class="flex flex-col w-full md:w-3/5 h-full overflow-y-auto  space-y-3 bg-neutral-900 border-l border-t border-r border-b border-neutral-700 rounded p-2">
        <div class="flex items-center justify-between w-full">
          <div class="cookie text-white text-2xl">Edit Product</div>
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
              if (!productImage()) return updateImage();
              else editProduct();
            }
          }}
          class="flex flex-col w-full h-auto space-y-3 bg-neutral-100 rounded p-3"
        >
          <div class="flex flex-col w-full space-y-1">
            <div class="">
              Product Image <span class="text-red-500">*</span>
            </div>
            <img
              src={
                productImage()
                  ? apiUrl + "files/view/" + productImage()
                  : undefined
              }
              class="self-center w-32 h-32 rounded bg-neutral-200 border-0"
              style={{
                "line-height": "128px",
                "text-align": "center",
                "padding-right": productImage() ? "0px" : "12px",
              }}
              alt="No Image"
              aria-required
            />
            <input
              type="button"
              id="productImagePickerBtn"
              accept="image/jpg,image/png,image/jpeg"
              value="Choose Image. [.jpg/.jpeg/.png]"
              class="w-full py-2 bg-lime-400 hover:bg-lime-300 active:bg-lime-400 transition-all duration-300 ease-in-out text-black rounded cursor-pointer"
              onClick={() => updateImage()}
            />
            <div class="text-neutral-400">
              What does your product look like?
            </div>
          </div>
          <div class="flex flex-col w-full space-y-1">
            <div class="">
              Product Name <span class="text-red-500">*</span>
            </div>
            <input
              type="text"
              placeholder="Product Name"
              value={productName() || ""}
              onChange={(event) => setProductName(event.target.value)}
              class="px-3 py-2 w-full bg-neutral-100 text-black border-l border-t border-r border-b border-neutral-400 rounded outline-none"
              required
            />
            <div class="text-neutral-400">
              What is the name of your product?
            </div>
          </div>
          <div class="flex flex-col w-full space-y-1">
            <div class="">
              Product Cost <span class="text-red-500">*</span>
            </div>
            <input
              type="number"
              placeholder="Product Cost"
              value={productCost() || ""}
              onChange={(event) => setProductCost(event.target.value)}
              class="px-3 py-2 w-full bg-neutral-100 text-black border-l border-t border-r border-b border-neutral-400 rounded outline-none"
              required
            />
            <div class="text-neutral-400">
              How much does it cost to make the product?
            </div>
          </div>
          <div class="flex flex-col w-full space-y-1">
            <div class="">
              Product Price <span class="text-red-500">*</span>
            </div>
            <input
              type="number"
              placeholder="Product Price"
              value={productPrice() || ""}
              onChange={(event) => setProductPrice(event.target.value)}
              class="px-3 py-2 w-full bg-neutral-100 text-black border-l border-t border-r border-b border-neutral-400 rounded outline-none"
              required
            />
            <div class="text-neutral-400">
              How much are you selling the product for?
            </div>
          </div>
          <button class="flex items-center justify-center py-2 w-full bg-lime-400 hover:bg-lime-300 active:bg-lime-400 transition-all duration-300 ease-in-out text-black rounded cursor-pointer">
            Edit Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProductModal;
