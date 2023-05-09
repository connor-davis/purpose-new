import { createSignal } from "solid-js";
import Uploader from "../uploader/uploader";

const UploadDocumentsModal = ({ uploaded = () => {}, closed = () => {} }) => {
  const [uploading, setUploading] = createSignal(false);

  return (
    <div class="absolute bg-neutral-900 bg-opacity-50 left-0 top-0 right-0 bottom-0 flex flex-col items-center justify-center animate-fade-in">
      <div class="flex flex-col w-full md:w-3/5 h-full overflow-y-auto  space-y-3 bg-neutral-900 border-l border-t border-r border-b border-neutral-700 rounded p-2">
        <div class="flex items-center justify-between w-full">
          <div class="cookie text-white text-2xl">Upload Documents</div>
          {!uploading() && (
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
          )}
        </div>
        <Uploader
          location="documents/upload"
          uploaded={() => {
            uploaded();
            setUploading(false);
          }}
          uploadStarted={() => setUploading(true)}
        />
      </div>
    </div>
  );
};

export default UploadDocumentsModal;
