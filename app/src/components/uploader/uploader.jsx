import axios from "axios";
import moment from "moment";
import { createSignal } from "solid-js";
import apiUrl from "../../apiUrl";
import useState from "../../hooks/state";

const Uploader = ({
  location = "files/upload",
  uploadStarted = () => {},
  uploaded = (filenames = []) => {},
}) => {
  const [user, setUser] = useState("user");

  const [uploading, setUploading] = createSignal(false);
  const [uploadCount, setUploadCount] = createSignal(0);
  const [successMessage, setSuccessMessage] = createSignal(undefined);
  const [errorMessage, setErrorMessage] = createSignal(undefined);

  const [progress, setProgress] = createSignal(0);
  const [timeLeft, setTimeLeft] = createSignal(undefined);

  return (
    <>
      {!uploading() && (
        <label class="flex flex-col w-full h-auto border-2 rounded-lg border-gray-300 hover:border-lime-400 transition-all duration-300 ease-in-out border-dashed cursor-pointer">
          <div class="flex flex-col items-center justify-center p-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-4 h-4 text-gray-400 group-hover:text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <p class="pt-1 text-sm tracking-wider text-gray-400 group-hover:text-gray-600">
              Attach documents.
            </p>
          </div>
          <input
            id="documentsInput"
            type="file"
            class="hidden"
            multiple
            onChange={async (event) => {
              let files = [...event.target.files];

              setUploadCount(files.length);

              let form = new FormData();

              files.forEach((file) => {
                form.append("upfiles", file, file.filename);
              });

              setUploading(true);
              uploadStarted();

              const response = await axios.post(apiUrl + location, form, {
                headers: {
                  Authorization: "Bearer " + user.token,
                  "Content-Type": "multipart/form-data",
                },
                onUploadProgress: (progressEvent) => {
                  setProgress(progressEvent.progress);

                  let dur = moment.duration(progressEvent.estimated * 1000);

                  setTimeLeft(`${dur.minutes()} mins ${dur.seconds()} seconds`);
                },
              });

              if (response.data.error)
                return setErrorMessage(response.data.message);
              else {
                setUploading(false);

                setSuccessMessage("Files uploaded successfully.");

                uploaded(response.data.filenames);
              }
            }}
          />
        </label>
      )}
      {uploading() && (
        <div class="flex flex-col w-full space-y-3">
          <div class="w-full text-center text-white">
            Uploading{" "}
            <span class="text-lime-200 cookie text-2xl">{uploadCount()}</span>{" "}
            files...
          </div>

          <div
            id="progress-bar"
            class="w-[366px] h-[6px] bg-neutral-700 rounded self-center"
          >
            <div
              class="h-full bg-lime-400 rounded"
              style={{ width: 366 * progress() + "px" }}
            ></div>
          </div>

          <div class="w-full text-center text-white">
            Time left: <span class="text-lime-200">{timeLeft()}</span>
          </div>
        </div>
      )}
      {errorMessage() && (
        <div class="w-full text-center text-red-500">{errorMessage()}</div>
      )}
      {successMessage() && (
        <div class="w-full text-center text-lime-500">{successMessage()}</div>
      )}
    </>
  );
};

export default Uploader;
