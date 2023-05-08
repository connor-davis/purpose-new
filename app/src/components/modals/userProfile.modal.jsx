import apiUrl from "../../apiUrl";

const UserProfileModal = ({ data = {}, closed = () => {} }) => {
  return (
    <div class="absolute bg-neutral-900 bg-opacity-50 left-0 top-0 right-0 bottom-0 flex flex-col items-center justify-center animate-fade-in">
      <div class="flex flex-col w-full md:w-1/4 space-y-3 bg-neutral-900 border-l border-t border-r border-b border-neutral-700 rounded p-2">
        <div class="flex items-center justify-between w-full">
          <div class="cookie text-white text-2xl">User Profile</div>
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
        <div class="flex flex-col items-center space-y-3 bg-white text-black rounded p-3">
          <img
            src={apiUrl + "files/view/" + data.image}
            class="w-32 h-32 rounded-full"
          />
          <div class="text-2xl font-bold">
            {data.firstName} {data.lastName}
          </div>
          <div class="flex w-full space-x-2 justify-between">
            <div class="flex flex-col space-y-2 w-full">
              <div class="text-lg font-medium">Business Name</div>
              <div>{data.businessName}</div>
              <div class="text-lg font-medium">Business Type</div>
              <div>{data.userType}</div>
              {data.userType === "other" && (
                <>
                  <div class="text-lg font-medium">Business Description</div>
                  <div class="break-words">{data.businessDescription || "None"}</div>
                </>
              )}
              {data.userType === "ecd" && (
                <>
                  <div class="text-lg font-medium">Position At ECD</div>
                  <div>{data.positionAtEcd || "None"}</div>

                  <div class="text-lg font-medium">Number Of Children</div>
                  <div>{data.numberOfChildren || 0}</div>
                </>
              )}
              <div class="text-lg font-medium">Number Of Employees</div>
              <div>{data.businessNumberOfEmployees}</div>
            </div>
            <div class="w-[1px] h-full bg-neutral-300"></div>
            <div class="flex flex-col space-y-2 w-full">
              <div class="text-lg font-medium">Email</div>
              <div>{data.email}</div>
              <div class="text-lg font-medium">Age</div>
              <div>{data.age}</div>
              <div class="text-lg font-medium">Ethnicity</div>
              <div>{data.ethnicity}</div>
              <div class="text-lg font-medium">Gender</div>
              <div>{data.gender}</div>
            </div>
          </div>
          <iframe
            class="w-full h-64"
            style="border:0"
            loading="lazy"
            allowfullscreen
            referrerpolicy="no-referrer-when-downgrade"
            src={
              `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8
    &q=` + data.location
            }
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default UserProfileModal;
