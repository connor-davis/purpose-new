import axios from "axios";
import { createSignal, onMount } from "solid-js";
import { createStore } from "solid-js/store";
import apiUrl from "../../apiUrl";
import useState from "../../hooks/state";
import SelectMenu from "../../components/selectmenu/selectmenu";

const ProfilePage = () => {
  const [user, setUser] = useState("user");

  const [loading, setLoading] = createSignal(true);

  const [editingImage, setEditingImage] = createSignal(false);
  const [editingFeaturedImage, setEditingFeaturedImage] = createSignal(false);
  const [editingBasic, setEditingBasic] = createSignal(false);
  const [editingBusiness, setEditingBusiness] = createSignal(false);
  const [editingHandles, setEditingHandles] = createSignal(false);
  const [editingBank, setEditingBank] = createSignal(false);
  const [editingLocation, setEditingLocation] = createSignal(false);

  const [basic, setBasic] = createStore(
    {
      image: undefined,
      featuredImage: undefined,
      firstName: undefined,
      lastName: undefined,
      idNumber: undefined,
      age: undefined,
      gender: undefined,
      ethnicity: undefined,
    },
    { name: "basicdetails-store" }
  );
  const [business, setBusiness] = createStore(
    {
      businessName: undefined,
      businessDescription: undefined,
      userType: undefined,
      numberOfChildren: undefined,
      businessNumberOfEmployees: undefined,
      positionAtEcd: undefined,
      businessRegistrationNumber: undefined,
      businessRegistered: undefined,
    },
    { name: "businessdetails-store" }
  );
  const [handles, setHandles] = createStore(
    {
      websiteUrl: undefined,
      facebookPageUrl: undefined,
      instagramPageUrl: undefined,
      youtubeChannelUrl: undefined,
    },
    { name: "handlesdetails-store" }
  );
  const [bank, setBank] = createStore(
    {
      accountNumber: undefined,
      bankName: undefined,
      bankBranchCode: undefined,
    },
    { name: "bankdetails-store" }
  );
  const [location, setLocation] = createStore(
    {
      streetAddress: undefined,
      suburb: undefined,
      ward: undefined,
      city: undefined,
      areaCode: undefined,
      province: undefined,
      country: undefined,
    },
    { name: "locationdetails-store" }
  );

  onMount(() => {
    setTimeout(async () => {
      await fetchProfile();
    }, 100);
  });

  const fetchProfile = async () => {
    const response = await axios.get(apiUrl + "users/me", {
      headers: { Authorization: "Bearer " + user.token },
    });

    if (!response.data.error) {
      setUser({ data: response.data });
      setBasic({
        image: response.data.image,
        featuredImage: response.data.featuredImage,
        firstName: response.data.firstName,
        lastName: response.data.lastName,
        idNumber: response.data.idNumber,
        age: response.data.age,
        gender: response.data.gender,
        ethnicity: response.data.ethnicity,
      });
      setBusiness({
        businessName: response.data.businessName,
        businessDescription: response.data.businessDescription,
        userType: response.data.userType,
        numberOfChildren: response.data.numberOfChildren,
        businessNumberOfEmployees: response.data.businessNumberOfEmployees,
        positionAtEcd: response.data.positionAtEcd,
        businessRegistrationNumber: response.data.businessRegistrationNumber,
        businessRegistered: response.data.businessRegistered,
      });
      setHandles({
        websiteUrl: response.data.websiteUrl,
        facebookPageUrl: response.data.facebookPageUrl,
        instagramPageUrl: response.data.instagramPageUrl,
        youtubeChannelUrl: response.data.youtubeChannelUrl,
      });
      setBank({
        accountNumber: response.data.accountNumber,
        bankName: response.data.bankName,
        bankBranchCode: response.data.bankBranchCode,
      });
      setLocation({
        streetAddress: response.data.streetAddress,
        suburb: response.data.suburb,
        ward: response.data.ward,
        city: response.data.city,
        areaCode: response.data.areaCode,
        province: response.data.province,
        country: response.data.country,
      });
      setLoading(false);
    }
  };

  const updateImage = () => {
    const inputEl = document.createElement("input");

    inputEl.type = "file";
    inputEl.multiple = false;
    inputEl.accept = "image/jpeg, image/png, image/jpg";

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
          const editResponse = await axios.put(
            apiUrl + "users",
            { _id: user.data._id, image: response.data.filenames[0] },
            { headers: { Authorization: "Bearer " + user.token } }
          );

          if (editResponse.data.error) {
            setEditingImage(false);
          } else {
            setEditingImage(false);
            fetchProfile();
          }
        }
      })();
    });
  };

  const updateFeaturedImage = () => {
    const inputEl = document.createElement("input");

    inputEl.type = "file";
    inputEl.multiple = false;
    inputEl.accept = "image/jpeg, image/png, image/jpg";

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
          setEditingFeaturedImage(false);
        } else {
          const editResponse = await axios.put(
            apiUrl + "users",
            { _id: user.data._id, featuredImage: response.data.filenames[0] },
            { headers: { Authorization: "Bearer " + user.token } }
          );

          if (editResponse.data.error) {
            setEditingFeaturedImage(false);
          } else {
            setEditingFeaturedImage(false);
            fetchProfile();
          }
        }
      })();
    });
  };

  const updateBasic = async () => {
    const response = await axios.put(
      apiUrl + "users",
      {
        _id: user.data._id,
        firstName: basic.firstName === "" ? null : basic.firstName,
        lastName: basic.lastName === "" ? null : basic.lastName,
        idNumber: basic.idNumber === "" ? null : basic.idNumber,
        age: basic.age === "" ? null : basic.age,
        gender: basic.gender === "" ? null : basic.gender,
        ethnicity: basic.ethnicity === "" ? null : basic.ethnicity,
      },
      { headers: { Authorization: "Bearer " + user.token } }
    );

    if (response.data.error) {
      setEditingBasic(false);
    } else {
      setEditingBasic(false);
      fetchProfile();
    }
  };

  const updateBusiness = async () => {
    if (business.userType !== "other")
      setBusiness({ ...business, businessDescription: null });
    if (business.userType !== "ecd")
      setBusiness({
        ...business,
        positionAtEcd: null,
        numberOfChildren: null,
      });

    const response = await axios.put(
      apiUrl + "users",
      {
        _id: user.data._id,
        businessName:
          business.businessName === "" ? null : business.businessName,
        businessDescription:
          business.businessDescription === "" && business.userType !== "other"
            ? null
            : business.businessDescription,
        userType: business.userType === "" ? null : business.userType,
        numberOfChildren:
          business.numberOfChildren === "" && business.userType !== "ecd"
            ? null
            : business.numberOfChildren,
        businessNumberOfEmployees:
          business.businessNumberOfEmployees === ""
            ? null
            : business.businessNumberOfEmployees,
        positionAtEcd:
          business.positionAtEcd === "" && business.userType !== "ecd"
            ? null
            : business.positionAtEcd,
        businessRegistrationNumber:
          business.businessRegistrationNumber === ""
            ? null
            : business.businessRegistrationNumber,
        businessRegistered:
          business.businessRegistered === ""
            ? null
            : business.businessRegistered,
      },
      { headers: { Authorization: "Bearer " + user.token } }
    );

    if (response.data.error) {
      setEditingBasic(false);
    } else {
      setEditingBasic(false);
      fetchProfile();
    }
  };

  const updateHandles = async () => {
    const response = await axios.put(
      apiUrl + "users",
      {
        _id: user.data._id,
        websiteUrl: handles.websiteUrl === "" ? null : handles.websiteUrl,
        facebookPageUrl:
          handles.facebookPageUrl === "" ? null : handles.facebookPageUrl,
        instagramPageUrl:
          handles.instagramPageUrl === "" ? null : handles.instagramPageUrl,
        youtubeChannelUrl:
          handles.youtubeChannelUrl === "" ? null : handles.youtubeChannelUrl,
      },
      { headers: { Authorization: "Bearer " + user.token } }
    );

    if (response.data.error) {
      setEditingBasic(false);
    } else {
      setEditingBasic(false);
      fetchProfile();
    }
  };

  const updateBank = async () => {
    const response = await axios.put(
      apiUrl + "users",
      {
        _id: user.data._id,
        accountNumber: bank.accountNumber === "" ? null : bank.accountNumber,
        bankName: bank.bankName === "" ? null : bank.bankName,
        bankBranchCode: bank.bankBranchCode === "" ? null : bank.bankBranchCode,
      },
      { headers: { Authorization: "Bearer " + user.token } }
    );

    if (response.data.error) {
      setEditingBasic(false);
    } else {
      setEditingBasic(false);
      fetchProfile();
    }
  };

  const updateLocation = async () => {
    const response = await axios.put(
      apiUrl + "users",
      {
        _id: user.data._id,
        streetAddress:
          location.streetAddress === "" ? null : location.streetAddress,
        suburb: location.suburb === "" ? null : location.suburb,
        ward: location.ward === "" ? null : location.ward,
        city: location.city === "" ? null : location.city,
        areaCode: location.areaCode === "" ? null : location.areaCode,
        province: location.province === "" ? null : location.province,
        country: location.country === "" ? null : location.country,
        location:
          location.streetAddress +
          ", " +
          location.city +
          ", " +
          location.areaCode +
          ", " +
          location.province +
          ", " +
          location.country,
      },
      { headers: { Authorization: "Bearer " + user.token } }
    );

    if (response.data.error) {
      setEditingBasic(false);
    } else {
      setEditingBasic(false);
      fetchProfile();
    }
  };

  return (
    <div class="flex flex-col w-full h-full p-5">
      <div class="flex flex-col space-y-3 text-black bg-white w-full h-full overflow-hidden rounded p-3">
        <div class="flex items-center justify-between animate-fade-in">
          <div class="cookie text-2xl">Your Profile</div>
        </div>
        {loading() ? (
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3 w-full h-full overflow-hidden">
            <div class="flex flex-col w-full h-full bg-neutral-100 animate-pulse rounded overflow-hidden"></div>
            <div class="flex flex-col w-full h-full bg-neutral-100 animate-pulse rounded overflow-hidden"></div>
            <div class="flex flex-col w-full h-full bg-neutral-100 animate-pulse rounded overflow-hidden"></div>
            <div class="flex flex-col w-full h-full bg-neutral-100 animate-pulse rounded overflow-hidden"></div>
            <div class="flex flex-col w-full h-full bg-neutral-100 animate-pulse rounded overflow-hidden"></div>
            <div class="flex flex-col w-full h-full bg-neutral-100 animate-pulse rounded overflow-hidden"></div>
          </div>
        ) : (
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-3 w-full h-full overflow-y-auto lg:overflow-hidden">
            <div class="flex flex-col w-full h-full border-l border-t border-r border-b border-neutral-300 rounded lg:overflow-hidden">
              <div class="cookie text-2xl p-3">Profile Image</div>
              <div class="flex flex-col w-full h-full items-center justify-center p-3 overflow-y-auto">
                {!editingImage() ? (
                  user.data && user.data.image ? (
                    <img
                      src={apiUrl + "files/view/" + user.data.image}
                      class="w-32 h-32 rounded-full object-cover"
                    />
                  ) : (
                    basic.firstName &&
                    basic.lastName && (
                      <div class="flex flex-col items-center justify-center w-32 h-32 rounded-full bg-lime-200 cookie text-4xl">
                        {basic.firstName.split("")[0]}{" "}
                        {basic.lastName.split("")[0]}
                      </div>
                    )
                  )
                ) : (
                  <div
                    onClick={() => updateImage()}
                    class="flex flex-col items-center justify-center w-32 h-32 rounded-full bg-neutral-200 cursor-pointer cookie text-4xl"
                  >
                    Click
                  </div>
                )}
              </div>
              <div class="flex flex-col w-full border-t border-neutral-300">
                {editingImage() ? (
                  <div class="flex items-center w-full">
                    <div
                      onClick={() => setEditingImage(!editingImage())}
                      class="flex items-center justify-center w-full space-x-2 p-3 hover:bg-red-200 cursor-pointer"
                    >
                      <div>
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
                      <p>Cancel</p>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => setEditingImage(!editingImage())}
                    class="flex items-center justify-center space-x-2 p-3 hover:bg-lime-200 cursor-pointer"
                  >
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
                          d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                        />
                      </svg>
                    </div>
                    <p>Edit</p>
                  </div>
                )}
              </div>
            </div>
            <div class="flex flex-col w-full h-full border-l border-t border-r border-b border-neutral-300 rounded lg:overflow-hidden">
              <div class="cookie text-2xl p-3">Featured Image</div>
              <div class="flex flex-col w-full h-full items-center justify-center space-y-3 p-3 overflow-y-auto">
                <div class="flex flex-col w-full h-full overflow-y-auto">
                  {!editingFeaturedImage() ? (
                    user.data && user.data.featuredImage ? (
                      <img
                        src={apiUrl + "files/view/" + user.data.featuredImage}
                        class="w-full h-auto rounded object-cover"
                      />
                    ) : (
                      <div class="flex flex-col items-center justify-center w-32 h-32 rounded-full bg-lime-200 cookie text-4xl">
                        None
                      </div>
                    )
                  ) : (
                    <div
                      onClick={() => updateFeaturedImage()}
                      class="flex flex-col items-center justify-center self-center w-32 h-32 rounded-full bg-neutral-200 cursor-pointer cookie text-4xl"
                    >
                      Click
                    </div>
                  )}
                </div>
              </div>
              <div class="flex flex-col w-full border-t border-neutral-300">
                {editingFeaturedImage() ? (
                  <div class="flex items-center w-full">
                    <div
                      onClick={() =>
                        setEditingFeaturedImage(!editingFeaturedImage())
                      }
                      class="flex items-center justify-center w-full space-x-2 p-3 hover:bg-red-200 cursor-pointer"
                    >
                      <div>
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
                      <p>Cancel</p>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() =>
                      setEditingFeaturedImage(!editingFeaturedImage())
                    }
                    class="flex items-center justify-center space-x-2 p-3 hover:bg-lime-200 cursor-pointer"
                  >
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
                          d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                        />
                      </svg>
                    </div>
                    <p>Edit</p>
                  </div>
                )}
              </div>
            </div>
            <div class="flex flex-col w-full h-full border-l border-t border-r border-b border-neutral-300 rounded lg:overflow-hidden">
              <div class="flex flex-col w-full h-full space-y-3 p-3 overflow-y-auto">
                <div class="cookie text-2xl">Basic Info</div>
                <div class="flex flex-col w-full space-y-1">
                  <div>First Name</div>
                  <input
                    type="text"
                    placeholder="First Name"
                    class="px-3 py-2 w-full bg-neutral-100 text-black border-l border-t border-r border-b border-neutral-400 rounded outline-none"
                    value={user.data.firstName}
                    onChange={(event) =>
                      setBasic({ ...basic, firstName: event.target.value })
                    }
                    disabled={!editingBasic()}
                  />
                </div>
                <div class="flex flex-col w-full space-y-1">
                  <div>Last Name</div>
                  <input
                    type="text"
                    placeholder="Last Name"
                    class="px-3 py-2 w-full bg-neutral-100 text-black border-l border-t border-r border-b border-neutral-400 rounded outline-none"
                    value={user.data.lastName}
                    onChange={(event) =>
                      setBasic({ ...basic, lastName: event.target.value })
                    }
                    disabled={!editingBasic()}
                  />
                </div>
                <div class="flex flex-col w-full space-y-1">
                  <div>ID Number</div>
                  <input
                    type="text"
                    placeholder="ID Number"
                    class="px-3 py-2 w-full bg-neutral-100 text-black border-l border-t border-r border-b border-neutral-400 rounded outline-none"
                    value={user.data.idNumber}
                    onChange={(event) =>
                      setBasic({ ...basic, idNumber: event.target.value })
                    }
                    disabled={!editingBasic()}
                  />
                </div>
                <div class="flex flex-col w-full space-y-1">
                  <div>Age</div>
                  <input
                    type="text"
                    placeholder="Age"
                    class="px-3 py-2 w-full bg-neutral-100 text-black border-l border-t border-r border-b border-neutral-400 rounded outline-none"
                    value={user.data.age}
                    onChange={(event) =>
                      setBasic({ ...basic, age: event.target.value })
                    }
                    disabled={!editingBasic()}
                  />
                </div>
                <div class="flex flex-col w-full space-y-1">
                  <div>Gender</div>
                  {!editingBasic() ? (
                    <div class="px-3 py-2 w-full bg-neutral-100 text-black border-l border-t border-r border-b border-neutral-400 rounded outline-none">
                      {user.data.gender.split("")[0].toUpperCase() +
                        user.data.gender.substring(1, user.data.gender.length)}
                    </div>
                  ) : (
                    <SelectMenu
                      defaultItem={user.data.gender}
                      items={["male", "female"]}
                      selectionChanged={(item) =>
                        setBasic({ ...basic, gender: item })
                      }
                      disabled={false}
                    />
                  )}
                </div>
                <div class="flex flex-col w-full space-y-1">
                  <div>Ethnicity</div>
                  {!editingBasic() ? (
                    <div class="px-3 py-2 w-full bg-neutral-100 text-black border-l border-t border-r border-b border-neutral-400 rounded outline-none">
                      {user.data.ethnicity.split("")[0].toUpperCase() +
                        user.data.ethnicity.substring(
                          1,
                          user.data.ethnicity.length
                        )}
                    </div>
                  ) : (
                    <SelectMenu
                      defaultItem={user.data.ethnicity}
                      items={["white", "coloured", "indian", "black"]}
                      selectionChanged={(item) =>
                        setBasic({ ...basic, ethnicity: item })
                      }
                      disabled={false}
                    />
                  )}
                </div>
              </div>
              <div class="flex flex-col w-full border-t border-neutral-300">
                {editingBasic() ? (
                  <div class="flex items-center w-full">
                    <div
                      onClick={() => {
                        setEditingBasic(!editingBasic());
                        updateBasic();
                      }}
                      class="flex items-center justify-center space-x-2 p-3 hover:bg-lime-200 cursor-pointer w-full"
                    >
                      <div>
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
                            d="M4.5 12.75l6 6 9-13.5"
                          />
                        </svg>
                      </div>
                      <p>Save</p>
                    </div>
                    <div class="w-[1px] h-full bg-neutral-300"></div>
                    <div
                      onClick={() => setEditingBasic(!editingBasic())}
                      class="flex items-center justify-center w-full space-x-2 p-3 hover:bg-red-200 cursor-pointer"
                    >
                      <div>
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
                      <p>Cancel</p>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => setEditingBasic(!editingBasic())}
                    class="flex items-center justify-center space-x-2 p-3 hover:bg-neutral-200 cursor-pointer"
                  >
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
                          d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                        />
                      </svg>
                    </div>
                    <p>Edit</p>
                  </div>
                )}
              </div>
            </div>
            <div class="flex flex-col w-full h-full border-l border-t border-r border-b border-neutral-300 rounded lg:overflow-hidden">
              <div class="flex flex-col w-full h-full space-y-3 p-3 overflow-y-auto">
                <div class="cookie text-2xl">Business Info</div>
                <div class="flex flex-col w-full space-y-1">
                  <div>Business Name</div>
                  <input
                    type="text"
                    placeholder="Business Name"
                    class="px-3 py-2 w-full bg-neutral-100 text-black border-l border-t border-r border-b border-neutral-400 rounded outline-none"
                    value={user.data.businessName}
                    onChange={(event) =>
                      setBusiness({
                        ...business,
                        businessName: event.target.value,
                      })
                    }
                    disabled={!editingBusiness()}
                  />
                </div>
                <div class="flex flex-col w-full space-y-1">
                  <div>Business Type</div>
                  {!editingBusiness() ? (
                    <div class="px-3 py-2 w-full bg-neutral-100 text-black border-l border-t border-r border-b border-neutral-400 rounded outline-none">
                      {user.data.userType.split("")[0].toUpperCase() +
                        user.data.userType.substring(
                          1,
                          user.data.userType.length
                        )}
                    </div>
                  ) : (
                    <SelectMenu
                      defaultItem={user.data.userType}
                      items={[
                        "ecd",
                        "farmer",
                        "sewing",
                        "bakery",
                        "wood work",
                        "garden service",
                        "food and beverage",
                        "gardening",
                        "nails",
                        "salon",
                        "consulting",
                        "construction",
                        "other",
                      ]}
                      selectionChanged={(item) =>
                        setBusiness({ ...business, userType: item })
                      }
                    />
                  )}
                </div>
                {business.userType === "other" && (
                  <div class="flex flex-col w-full space-y-1">
                    <div>Business Description</div>
                    <input
                      type="text"
                      placeholder="Business Description"
                      class="px-3 py-2 w-full bg-neutral-100 text-black border-l border-t border-r border-b border-neutral-400 rounded outline-none"
                      value={user.data.businessDescription}
                      onChange={(event) =>
                        setBusiness({
                          ...business,
                          businessDescription: event.target.value,
                        })
                      }
                      disabled={!editingBusiness()}
                    />
                  </div>
                )}
                {business.userType === "ecd" && (
                  <div class="flex flex-col w-full space-y-1">
                    <div>Position At ECD</div>
                    <input
                      type="text"
                      placeholder="Position At ECD"
                      class="px-3 py-2 w-full bg-neutral-100 text-black border-l border-t border-r border-b border-neutral-400 rounded outline-none"
                      value={user.data.positionAtEcd || ""}
                      onChange={(event) =>
                        setBusiness({
                          ...business,
                          positionAtEcd: event.target.value,
                        })
                      }
                      disabled={!editingBusiness()}
                    />
                  </div>
                )}
                {business.userType === "ecd" && (
                  <div class="flex flex-col w-full space-y-1">
                    <div>Number Of Children</div>
                    <input
                      type="number"
                      placeholder="Number Of Children"
                      class="px-3 py-2 w-full bg-neutral-100 text-black border-l border-t border-r border-b border-neutral-400 rounded outline-none"
                      value={user.data.numberOfChildren || ""}
                      onChange={(event) =>
                        setBusiness({
                          ...business,
                          numberOfChildren: event.target.value,
                        })
                      }
                      disabled={!editingBusiness()}
                    />
                  </div>
                )}
                {editingBusiness() && (
                  <div class="flex items-center justify-center space-x-2 w-full">
                    <span
                      class="cursor-pointer"
                      onClick={() =>
                        setBusiness({
                          ...business,
                          businessRegistered: !business.businessRegistered,
                        })
                      }
                    >
                      {business.businessRegistered ? (
                        <div class="bg-lime-500 p-1 text-black rounded-full">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            class="w-3 h-3"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              d="M4.5 12.75l6 6 9-13.5"
                            />
                          </svg>
                        </div>
                      ) : (
                        <div class="bg-neutral-300 p-1 text-black rounded-full">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            class="w-3 h-3"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </div>
                      )}
                    </span>
                    <span
                      class="text-neutral-600 hover:text-lime-400 transition-all duration-300 ease-in-out cursor-pointer"
                      onClick={() =>
                        setBusiness({
                          ...business,
                          businessRegistered: !business.businessRegistered,
                        })
                      }
                    >
                      Is Business Registered?
                    </span>
                  </div>
                )}
                {business.businessRegistered && (
                  <div class="flex flex-col w-full space-y-1">
                    <div>Registration Number</div>
                    <input
                      type="text"
                      placeholder="Registration Number"
                      class="px-3 py-2 w-full bg-neutral-100 text-black border-l border-t border-r border-b border-neutral-400 rounded outline-none"
                      value={user.data.businessRegistrationNumber || ""}
                      onChange={(event) =>
                        setBusiness({
                          ...business,
                          businessRegistrationNumber: event.target.value,
                        })
                      }
                      disabled={!editingBusiness()}
                    />
                  </div>
                )}
                <div class="flex flex-col w-full space-y-1">
                  <div>Number Of Employees</div>
                  <input
                    type="number"
                    placeholder="Number Of Employees"
                    class="px-3 py-2 w-full bg-neutral-100 text-black border-l border-t border-r border-b border-neutral-400 rounded outline-none"
                    value={user.data.businessNumberOfEmployees || ""}
                    onChange={(event) =>
                      setBusiness({
                        ...business,
                        businessNumberOfEmployees: event.target.value,
                      })
                    }
                    disabled={!editingBusiness()}
                  />
                </div>
              </div>
              <div class="flex flex-col w-full border-t border-neutral-300">
                {editingBusiness() ? (
                  <div class="flex items-center w-full">
                    <div
                      onClick={() => {
                        setEditingBusiness(!editingBusiness());
                        updateBusiness();
                      }}
                      class="flex items-center justify-center space-x-2 p-3 hover:bg-lime-200 cursor-pointer w-full"
                    >
                      <div>
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
                            d="M4.5 12.75l6 6 9-13.5"
                          />
                        </svg>
                      </div>
                      <p>Save</p>
                    </div>
                    <div class="w-[1px] h-full bg-neutral-300"></div>
                    <div
                      onClick={() => setEditingBusiness(!editingBusiness())}
                      class="flex items-center justify-center w-full space-x-2 p-3 hover:bg-red-200 cursor-pointer"
                    >
                      <div>
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
                      <p>Cancel</p>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => setEditingBusiness(!editingBusiness())}
                    class="flex items-center justify-center space-x-2 p-3 hover:bg-neutral-200 cursor-pointer"
                  >
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
                          d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                        />
                      </svg>
                    </div>
                    <p>Edit</p>
                  </div>
                )}
              </div>
            </div>
            <div class="flex flex-col w-full h-full border-l border-t border-r border-b border-neutral-300 rounded lg:overflow-hidden">
              <div class="flex flex-col w-full h-full space-y-3 p-3 overflow-y-auto">
                <div class="cookie text-2xl">Handles Info</div>
                <div class="flex flex-col w-full space-y-1">
                  <div>Website</div>
                  <input
                    type="text"
                    placeholder="Website"
                    class="px-3 py-2 w-full bg-neutral-100 text-black border-l border-t border-r border-b border-neutral-400 rounded outline-none"
                    value={user.data.websiteUrl || ""}
                    onChange={(event) =>
                      setHandles({
                        ...handles,
                        websiteUrl: event.target.value,
                      })
                    }
                    disabled={!editingHandles()}
                  />
                </div>
                <div class="flex flex-col w-full space-y-1">
                  <div>Facebook Page</div>
                  <input
                    type="text"
                    placeholder="Facebook Page"
                    class="px-3 py-2 w-full bg-neutral-100 text-black border-l border-t border-r border-b border-neutral-400 rounded outline-none"
                    value={user.data.facebookPageUrl || ""}
                    onChange={(event) =>
                      setHandles({
                        ...handles,
                        facebookPageUrl: event.target.value,
                      })
                    }
                    disabled={!editingHandles()}
                  />
                </div>
                <div class="flex flex-col w-full space-y-1">
                  <div>Instagram</div>
                  <input
                    type="text"
                    placeholder="Instagram"
                    class="px-3 py-2 w-full bg-neutral-100 text-black border-l border-t border-r border-b border-neutral-400 rounded outline-none"
                    value={user.data.instagramPageUrl || ""}
                    onChange={(event) =>
                      setHandles({
                        ...handles,
                        instagramPageUrl: event.target.value,
                      })
                    }
                    disabled={!editingHandles()}
                  />
                </div>
                <div class="flex flex-col w-full space-y-1">
                  <div>YouTube Channel</div>
                  <input
                    type="text"
                    placeholder="YouTube Channel"
                    class="px-3 py-2 w-full bg-neutral-100 text-black border-l border-t border-r border-b border-neutral-400 rounded outline-none"
                    value={user.data.youtubeChannelUrl || ""}
                    onChange={(event) =>
                      setHandles({
                        ...handles,
                        youtubeChannelUrl: event.target.value,
                      })
                    }
                    disabled={!editingHandles()}
                  />
                </div>
              </div>
              <div class="flex flex-col w-full border-t border-neutral-300">
                {editingHandles() ? (
                  <div class="flex items-center w-full">
                    <div
                      onClick={() => {
                        setEditingHandles(!editingHandles());
                        updateHandles();
                      }}
                      class="flex items-center justify-center space-x-2 p-3 hover:bg-lime-200 cursor-pointer w-full"
                    >
                      <div>
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
                            d="M4.5 12.75l6 6 9-13.5"
                          />
                        </svg>
                      </div>
                      <p>Save</p>
                    </div>
                    <div class="w-[1px] h-full bg-neutral-300"></div>
                    <div
                      onClick={() => setEditingHandles(!editingHandles())}
                      class="flex items-center justify-center w-full space-x-2 p-3 hover:bg-red-200 cursor-pointer"
                    >
                      <div>
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
                      <p>Cancel</p>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => setEditingHandles(!editingHandles())}
                    class="flex items-center justify-center space-x-2 p-3 hover:bg-neutral-200 cursor-pointer"
                  >
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
                          d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                        />
                      </svg>
                    </div>
                    <p>Edit</p>
                  </div>
                )}
              </div>
            </div>
            <div class="flex flex-col w-full h-full border-l border-t border-r border-b border-neutral-300 rounded lg:overflow-hidden">
              <div class="flex flex-col w-full h-full space-y-3 p-3 overflow-y-auto">
                <div class="cookie text-2xl">Bank Info</div>
                <div class="flex flex-col w-full space-y-1">
                  <div>Account Number</div>
                  <input
                    type="text"
                    placeholder="Account Number"
                    class="px-3 py-2 w-full bg-neutral-100 text-black border-l border-t border-r border-b border-neutral-400 rounded outline-none"
                    value={user.data.accountNumber || ""}
                    onChange={(event) =>
                      setBank({
                        ...bank,
                        accountNumber: event.target.value,
                      })
                    }
                    disabled={!editingBank()}
                  />
                </div>
                <div class="flex flex-col w-full space-y-1">
                  <div>Bank Name</div>
                  <input
                    type="text"
                    placeholder="Bank Name"
                    class="px-3 py-2 w-full bg-neutral-100 text-black border-l border-t border-r border-b border-neutral-400 rounded outline-none"
                    value={user.data.bankName || ""}
                    onChange={(event) =>
                      setBank({
                        ...bank,
                        bankName: event.target.value,
                      })
                    }
                    disabled={!editingBank()}
                  />
                </div>
                <div class="flex flex-col w-full space-y-1">
                  <div>Bank Branch Code</div>
                  <input
                    type="text"
                    placeholder="Bank Branch Code"
                    class="px-3 py-2 w-full bg-neutral-100 text-black border-l border-t border-r border-b border-neutral-400 rounded outline-none"
                    value={user.data.bankBranchCode || ""}
                    onChange={(event) =>
                      setBank({
                        ...bank,
                        bankBranchCode: event.target.value,
                      })
                    }
                    disabled={!editingBank()}
                  />
                </div>
              </div>
              <div class="flex flex-col w-full border-t border-neutral-300">
                {editingBank() ? (
                  <div class="flex items-center w-full">
                    <div
                      onClick={() => {
                        setEditingBank(!editingBank());
                        updateBank();
                      }}
                      class="flex items-center justify-center space-x-2 p-3 hover:bg-lime-200 cursor-pointer w-full"
                    >
                      <div>
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
                            d="M4.5 12.75l6 6 9-13.5"
                          />
                        </svg>
                      </div>
                      <p>Save</p>
                    </div>
                    <div class="w-[1px] h-full bg-neutral-300"></div>
                    <div
                      onClick={() => setEditingBank(!editingBank())}
                      class="flex items-center justify-center w-full space-x-2 p-3 hover:bg-red-200 cursor-pointer"
                    >
                      <div>
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
                      <p>Cancel</p>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => setEditingBank(!editingBank())}
                    class="flex items-center justify-center space-x-2 p-3 hover:bg-neutral-200 cursor-pointer"
                  >
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
                          d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                        />
                      </svg>
                    </div>
                    <p>Edit</p>
                  </div>
                )}
              </div>
            </div>
            <div class="flex flex-col w-full h-full border-l border-t border-r border-b border-neutral-300 rounded lg:overflow-hidden">
              <div class="flex flex-col w-full h-full space-y-3 p-3 overflow-y-auto">
                <div class="cookie text-2xl">Location Info</div>
                <div class="flex flex-col w-full space-y-1">
                  <div>Street Address</div>
                  <input
                    type="text"
                    placeholder="Street Address"
                    class="px-3 py-2 w-full bg-neutral-100 text-black border-l border-t border-r border-b border-neutral-400 rounded outline-none"
                    value={user.data.streetAddress || ""}
                    onChange={(event) =>
                      setLocation({
                        ...location,
                        streetAddress: event.target.value,
                      })
                    }
                    disabled={!editingLocation()}
                  />
                </div>
                <div class="flex flex-col w-full space-y-1">
                  <div>Suburb</div>
                  <input
                    type="text"
                    placeholder="Suburb"
                    class="px-3 py-2 w-full bg-neutral-100 text-black border-l border-t border-r border-b border-neutral-400 rounded outline-none"
                    value={user.data.suburb || ""}
                    onChange={(event) =>
                      setLocation({
                        ...location,
                        suburb: event.target.value,
                      })
                    }
                    disabled={!editingLocation()}
                  />
                </div>
                <div class="flex flex-col w-full space-y-1">
                  <div>Ward</div>
                  <input
                    type="text"
                    placeholder="Ward"
                    class="px-3 py-2 w-full bg-neutral-100 text-black border-l border-t border-r border-b border-neutral-400 rounded outline-none"
                    value={user.data.ward || ""}
                    onChange={(event) =>
                      setLocation({
                        ...location,
                        ward: event.target.value,
                      })
                    }
                    disabled={!editingLocation()}
                  />
                </div>
                <div class="flex flex-col w-full space-y-1">
                  <div>City</div>
                  <input
                    type="text"
                    placeholder="City"
                    class="px-3 py-2 w-full bg-neutral-100 text-black border-l border-t border-r border-b border-neutral-400 rounded outline-none"
                    value={user.data.city || ""}
                    onChange={(event) =>
                      setLocation({
                        ...location,
                        city: event.target.value,
                      })
                    }
                    disabled={!editingLocation()}
                  />
                </div>
                <div class="flex flex-col w-full space-y-1">
                  <div>Area Code</div>
                  <input
                    type="text"
                    placeholder="Area Code"
                    class="px-3 py-2 w-full bg-neutral-100 text-black border-l border-t border-r border-b border-neutral-400 rounded outline-none"
                    value={user.data.areaCode || ""}
                    onChange={(event) =>
                      setLocation({
                        ...location,
                        areaCode: event.target.value,
                      })
                    }
                    disabled={!editingLocation()}
                  />
                </div>
                <div class="flex flex-col w-full space-y-1">
                  <div>Province</div>
                  <input
                    type="text"
                    placeholder="Province"
                    class="px-3 py-2 w-full bg-neutral-100 text-black border-l border-t border-r border-b border-neutral-400 rounded outline-none"
                    value={user.data.province || ""}
                    onChange={(event) =>
                      setLocation({
                        ...location,
                        province: event.target.value,
                      })
                    }
                    disabled={!editingLocation()}
                  />
                </div>
                <div class="flex flex-col w-full space-y-1">
                  <div>Country</div>
                  <input
                    type="text"
                    placeholder="Country"
                    class="px-3 py-2 w-full bg-neutral-100 text-black border-l border-t border-r border-b border-neutral-400 rounded outline-none"
                    value={user.data.country || ""}
                    onChange={(event) =>
                      setLocation({
                        ...location,
                        country: event.target.value,
                      })
                    }
                    disabled={!editingLocation()}
                  />
                </div>
              </div>
              <div class="flex flex-col w-full border-t border-neutral-300">
                {editingLocation() ? (
                  <div class="flex items-center w-full">
                    <div
                      onClick={() => {
                        setEditingLocation(!editingLocation());
                        updateLocation();
                      }}
                      class="flex items-center justify-center space-x-2 p-3 hover:bg-lime-200 cursor-pointer w-full"
                    >
                      <div>
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
                            d="M4.5 12.75l6 6 9-13.5"
                          />
                        </svg>
                      </div>
                      <p>Save</p>
                    </div>
                    <div class="w-[1px] h-full bg-neutral-300"></div>
                    <div
                      onClick={() => setEditingLocation(!editingLocation())}
                      class="flex items-center justify-center w-full space-x-2 p-3 hover:bg-red-200 cursor-pointer"
                    >
                      <div>
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
                      <p>Cancel</p>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => setEditingLocation(!editingLocation())}
                    class="flex items-center justify-center space-x-2 p-3 hover:bg-neutral-200 cursor-pointer"
                  >
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
                          d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                        />
                      </svg>
                    </div>
                    <p>Edit</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
