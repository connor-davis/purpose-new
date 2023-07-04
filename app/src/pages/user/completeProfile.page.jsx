import axios from "axios";
import { createSignal, onMount } from "solid-js";
import apiUrl from "../../apiUrl";
import LogoLarge from "../../assets/PurposeMainLogo.png";
import Uploader from "../../components/uploader/uploader";
import SelectMenu from "../../components/selectmenu/selectmenu";
import useState from "../../hooks/state";

const CompleteProfilePage = () => {
  const [user, setUser] = useState("user");

  const [stage, setStage] = createSignal(0);
  const [uploading, setUploading] = createSignal(false);

  const [firstName, setFirstName] = createSignal(undefined);
  const [lastName, setLastName] = createSignal(undefined);
  const [idNumber, setIdNumber] = createSignal(undefined);
  const [age, setAge] = createSignal(undefined);
  const [gender, setGender] = createSignal(undefined);
  const [ethnicity, setEthnicity] = createSignal(undefined);

  const [businessName, setBusinessName] = createSignal(undefined);
  const [businessType, setBusinessType] = createSignal(undefined);
  const [businessDescription, setBusinessDescription] = createSignal(undefined);
  const [isBusinessRegistered, setIsBusinessRegistered] = createSignal(false);
  const [businessNumberOfEmployees, setBusinessNumberOfEmployees] =
    createSignal(undefined);
  const [businessRegistrationNumber, setBusinessRegistrationNumber] =
    createSignal(undefined);
  const [businessPositionAtEcd, setBusinessPositionAtEcd] =
    createSignal(undefined);
  const [businessNumberOfChildren, setBusinessNumberOfChildren] =
    createSignal(undefined);
  const [businessNumberOfDependents, setBusinessNumberOfDependents] =
    createSignal(undefined);

  const [numberOfSchoolKids, setNumberOfSchoolKids] = createSignal(undefined);
  const [numberOfStaff, setNumberOfStaff] = createSignal(undefined);
  const [hasGardener, setHasGardener] = createSignal(undefined);
  const [numberOfClassrooms, setNumberOfClassrooms] = createSignal(undefined);
  const [landOwner, setLandOwner] = createSignal(undefined);
  const [hasGardenInProgress, setHasGardenInProgress] = createSignal(undefined);
  const [isGrowingCrops, setIsGrowingCrops] = createSignal(undefined);
  const [gardenSize, setGardenSize] = createSignal(undefined);
  const [numberOfToilets, setNumberOfToilets] = createSignal(undefined);
  const [isFirstAidTrained, setIsFirstAidTrained] = createSignal(undefined);
  const [isFireExtinguisherAvailable, setIsFireExtinguisherAvailable] =
    createSignal(undefined);
  const [hasInternetAccess, setHasInternetAccess] = createSignal(undefined);
  const [hasFirstAidOnSite, setHasFirstAidOnSite] = createSignal(undefined);
  const [numberOfFridges, setNumberOfFridges] = createSignal(undefined);
  const [numberOfWaterTanks, setNumberOfWaterTanks] = createSignal(undefined);
  const [foodFrom, setFoodFrom] = createSignal(undefined);
  const [hasWorkingLightsAndElectricity, setHasWorkingLightsAndElectricity] =
    createSignal(undefined);
  const [hasRunningWater, setHasRunningWater] = createSignal(undefined);
  const [hasStoveOrOven, setHasStoveOrOven] = createSignal(undefined);

  const [website, setWebsite] = createSignal(undefined);
  const [facebookPage, setFacebookPage] = createSignal(undefined);
  const [instagram, setInstagram] = createSignal(undefined);
  const [youtubeChannel, setYouTubeChannel] = createSignal(undefined);

  const [bankName, setBankName] = createSignal(undefined);
  const [accountNumber, setAccountNumber] = createSignal(undefined);
  const [branchCode, setBranchCode] = createSignal(undefined);

  const [streetAddress, setStreetAddress] = createSignal(undefined);
  const [suburb, setSuburb] = createSignal(undefined);
  const [ward, setWard] = createSignal(undefined);
  const [city, setCity] = createSignal(undefined);
  const [areaCode, setAreaCode] = createSignal(undefined);
  const [province, setProvince] = createSignal(undefined);
  const [country, setCountry] = createSignal(undefined);

  onMount(() => {
    setTimeout(() => {
      setStage(1);
      setTimeout(() => {
        setStage(2);
      }, 2000);
    }, 1500);
  });

  return (
    <form
      id="setupForm"
      onSubmit={async (event) => {
        event.preventDefault();

        const form = event.target;

        if (form.reportValidity()) {
          if (stage() === 4 && businessType() !== "school garden") {
            setStage(stage() + 3);

            setTimeout(() => {
              setStage(stage() + 1);
            }, 1500);
          } else if (stage() < 12) {
            setStage(stage() + 1);

            setTimeout(() => {
              setStage(stage() + 1);
            }, 1500);
          } else {
            setStage(stage() + 1);

            const data = {
              _id: user.data._id,
              firstName: firstName(),
              lastName: lastName(),
              idNumber: idNumber(),
              age: age(),
              gender: gender(),
              ethnicity: ethnicity(),
              businessName: businessName(),
              businessDescription: businessDescription() || null,
              userType: businessType(),
              numberOfChildren: businessNumberOfChildren() || null,
              businessNumberOfEmployees: businessNumberOfEmployees(),
              numberOfDependents: businessNumberOfDependents(),
              positionAtEcd: businessPositionAtEcd() || null,
              businessRegistrationNumber: businessRegistrationNumber() || null,
              numberOfSchoolKids: numberOfSchoolKids() || null,
              numberOfStaff: numberOfStaff() || null,
              hasGardener: hasGardener() || null,
              numberOfClassrooms: numberOfClassrooms() || null,
              landOwner: landOwner() || null,
              hasGardenInProgress: hasGardenInProgress() || null,
              isGrowingCrops: isGrowingCrops() || null,
              gardenSize: gardenSize() || null,
              numberOfToilets: numberOfToilets() || null,
              isFirstAidTrained: isFirstAidTrained() || null,
              isFireExtinguisherAvailable:
                isFireExtinguisherAvailable() || null,
              hasInternetAccess: hasInternetAccess() || null,
              hasFirstAidOnSite: hasFirstAidOnSite() || null,
              numberOfFridges: numberOfFridges() || null,
              numberOfWaterTanks: numberOfWaterTanks() || null,
              foodFrom: foodFrom() || null,
              hasWorkingLightsAndElectricity:
                hasWorkingLightsAndElectricity() || null,
              hasRunningWater: hasRunningWater() || null,
              hasStoveOrOven: hasStoveOrOven() || null,
              websiteUrl: website() || null,
              facebookPageUrl: facebookPage() || null,
              instagramUrl: instagram() || null,
              youtubeChannelUrl: youtubeChannel() || null,
              accountNumber: accountNumber(),
              bankName: bankName(),
              bankBranchCode: branchCode(),
              streetAddress: streetAddress(),
              suburb: suburb() || null,
              ward: ward() || null,
              city: city(),
              areaCode: areaCode(),
              province: province(),
              country: country(),
              location:
                streetAddress() +
                ", " +
                city() +
                ", " +
                areaCode() +
                ", " +
                province() +
                ", " +
                country(),
              completedProfile: true,
            };

            for (let key in data) {
              if (data[key] === undefined) delete data[key];
            }

            const updateResponse = await axios.put(apiUrl + "users", data, {
              headers: { Authorization: "Bearer " + user.token },
            });

            if (updateResponse.data === "Ok") {
              const response = await axios.get(apiUrl + "users/me", {
                headers: { Authorization: "Bearer " + user.token },
              });

              if (response.data.error) return;
              else {
                setTimeout(
                  () =>
                    setUser({
                      data: { ...response.data, completedProfile: true },
                    }),
                  3000
                );
              }
            }
          }
        }
      }}
      class="flex flex-col w-full h-full p-5 space-y-3 items-center justify-center"
    >
      <div class="flex flex-col w-full md:w-[408px] bg-neutral-100 rounded p-3 overflow-y-auto">
        {stage() === 0 && (
          <div class="flex flex-col items-center space-y-5 text-center">
            <img src={LogoLarge} class="h-48" />
            <div class="animate-fade-in">
              Welcome to Purpose360. Let's complete your profile.
            </div>
          </div>
        )}
        {stage() === 1 && (
          <div class="flex flex-col items-center space-y-5 text-center">
            <img src={LogoLarge} class="h-48" />
            <div class="animate-fade-in">
              Let's begin with your basic details.
            </div>
          </div>
        )}
        {stage() === 2 && (
          <div class="flex flex-col items-center space-y-3 text-center">
            <div class="flex flex-col w-full space-y-1">
              <div class="flex w-full">
                First Name <span class="text-red-500">*</span>
              </div>
              <input
                class="px-3 py-2 w-full bg-neutral-100 text-black border-l border-t border-r border-b border-neutral-400 rounded outline-none"
                type="text"
                placeholder="First Name"
                value={firstName() || ""}
                onChange={(event) => setFirstName(event.target.value)}
                required
              />
            </div>
            <div class="flex flex-col w-full space-y-1">
              <div class="flex w-full">
                Last Name <span class="text-red-500">*</span>
              </div>
              <input
                class="px-3 py-2 w-full bg-neutral-100 text-black border-l border-t border-r border-b border-neutral-400 rounded outline-none"
                type="text"
                placeholder="Last Name"
                value={lastName() || ""}
                onChange={(event) => setLastName(event.target.value)}
                required
              />
            </div>
            <div class="flex flex-col w-full space-y-1">
              <div class="flex w-full">
                ID Number <span class="text-red-500">*</span>
              </div>
              <input
                class="px-3 py-2 w-full bg-neutral-100 text-black border-l border-t border-r border-b border-neutral-400 rounded outline-none"
                type="text"
                placeholder="ID Number"
                value={idNumber() || ""}
                onChange={(event) => setIdNumber(event.target.value)}
                required
              />
            </div>
            <div class="flex flex-col w-full space-y-1">
              <div class="flex w-full">
                Age <span class="text-red-500">*</span>
              </div>
              <input
                class="px-3 py-2 w-full bg-neutral-100 text-black border-l border-t border-r border-b border-neutral-400 rounded outline-none"
                type="number"
                placeholder="Age"
                value={age() || ""}
                onChange={(event) => setAge(event.target.value)}
                required
              />
            </div>
            <div class="flex flex-col w-full space-y-1">
              <div class="flex w-full">
                Gender <span class="text-red-500">*</span>
              </div>
              <SelectMenu
                items={["Male", "Female"]}
                selectionChanged={(item) => {
                  setGender(item.toLowerCase());
                }}
              />
            </div>
            <div class="flex flex-col w-full space-y-1">
              <div class="flex w-full">
                Ethnicity <span class="text-red-500">*</span>
              </div>
              <SelectMenu
                items={["White", "Coloured", "Indian", "Black"]}
                selectionChanged={(item) => {
                  setEthnicity(item.toLowerCase());
                }}
              />
            </div>
          </div>
        )}
        {stage() === 3 && (
          <div class="flex flex-col items-center space-y-5 text-center">
            <img src={LogoLarge} class="h-48" />
            <div class="animate-fade-in">Let's get your business details.</div>
          </div>
        )}
        {stage() === 4 && (
          <div class="flex flex-col items-center space-y-3 text-center animate-fade-in">
            <div class="flex flex-col w-full space-y-1">
              <div class="flex w-full">
                Business Name <span class="text-red-500">*</span>
              </div>
              <input
                class="px-3 py-2 w-full bg-neutral-100 text-black border-l border-t border-r border-b border-neutral-400 rounded outline-none"
                type="text"
                placeholder="Business Name"
                value={businessName() || ""}
                onChange={(event) => setBusinessName(event.target.value)}
                required
              />
            </div>
            <div class="flex flex-col w-full space-y-1">
              <div class="flex w-full">
                Business Type <span class="text-red-500">*</span>
              </div>
              <SelectMenu
                items={[
                  "ECD",
                  "Farmer",
                  "Sewing",
                  "Bakery",
                  "Wood Work",
                  "Garden Service",
                  "Food And Beverage",
                  "Gardening",
                  "Nails",
                  "Salon",
                  "Consulting",
                  "Construction",
                  "School Garden",
                  "Other",
                ]}
                selectionChanged={(item) => {
                  setBusinessType(item.toLowerCase());
                }}
              />
            </div>
            {businessType() === "other" && (
              <div class="flex flex-col w-full space-y-1">
                <div class="flex w-full">
                  Business Description <span class="text-red-500">*</span>
                </div>
                <input
                  class="px-3 py-2 w-full bg-neutral-100 text-black border-l border-t border-r border-b border-neutral-400 rounded outline-none"
                  type="text"
                  placeholder="Business Description"
                  value={businessDescription() || ""}
                  onChange={(event) =>
                    setBusinessDescription(event.target.value)
                  }
                  required
                />
              </div>
            )}
            {businessType() === "ecd" && (
              <div class="flex flex-col w-full space-y-1">
                <div class="flex w-full">
                  Position At ECD <span class="text-red-500">*</span>
                </div>
                <input
                  class="px-3 py-2 w-full bg-neutral-100 text-black border-l border-t border-r border-b border-neutral-400 rounded outline-none"
                  type="text"
                  placeholder="Position At ECD"
                  value={businessPositionAtEcd() || ""}
                  onChange={(event) =>
                    setBusinessPositionAtEcd(event.target.value)
                  }
                  required
                />
              </div>
            )}
            {businessType() === "ecd" && (
              <div class="flex flex-col w-full space-y-1">
                <div class="flex w-full">
                  Number Of Children <span class="text-red-500">*</span>
                </div>
                <input
                  class="px-3 py-2 w-full bg-neutral-100 text-black border-l border-t border-r border-b border-neutral-400 rounded outline-none"
                  type="number"
                  placeholder="Number Of Children"
                  value={businessNumberOfChildren() || ""}
                  onChange={(event) =>
                    setBusinessNumberOfChildren(event.target.value)
                  }
                  required
                />
              </div>
            )}
            <div class="flex flex-col w-full space-y-1">
              <div class="flex w-full">Number Of Dependents</div>
              <input
                class="px-3 py-2 w-full bg-neutral-100 text-black border-l border-t border-r border-b border-neutral-400 rounded outline-none"
                type="number"
                placeholder="Number Of Dependents"
                value={businessNumberOfDependents() || ""}
                onChange={(event) =>
                  setBusinessNumberOfDependents(event.target.value)
                }
              />
            </div>
            <div class="flex items-center justify-center space-x-2 w-full">
              <span
                class="cursor-pointer"
                onClick={() => setIsBusinessRegistered(!isBusinessRegistered())}
              >
                {isBusinessRegistered() ? (
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
                onClick={() => setIsBusinessRegistered(!isBusinessRegistered())}
              >
                Is Business Registered?
              </span>
            </div>
            {isBusinessRegistered() && (
              <div class="flex flex-col w-full space-y-1">
                <div class="flex w-full">
                  Registration Number <span class="text-red-500">*</span>
                </div>
                <input
                  class="px-3 py-2 w-full bg-neutral-100 text-black border-l border-t border-r border-b border-neutral-400 rounded outline-none"
                  type="text"
                  placeholder="Registration Number"
                  value={businessRegistrationNumber() || ""}
                  onChange={(event) =>
                    setBusinessRegistrationNumber(event.target.value)
                  }
                  required
                />
              </div>
            )}
            <div class="flex flex-col w-full space-y-1">
              <div class="flex w-full">
                Number Of Employees <span class="text-red-500">*</span>
              </div>
              <input
                class="px-3 py-2 w-full bg-neutral-100 text-black border-l border-t border-r border-b border-neutral-400 rounded outline-none"
                type="number"
                placeholder="Number Of Employees"
                value={businessNumberOfEmployees() || ""}
                onChange={(event) =>
                  setBusinessNumberOfEmployees(event.target.value)
                }
                required
              />
            </div>
            <div class="flex flex-col w-full space-y-1">
              <div class="flex w-full">Business Documents</div>
              <div class="flex flex-col p-2 w-full rounded border-l border-t border-r border-b border-neutral-700 bg-neutral-900">
                <Uploader
                  location="documents/upload"
                  uploadStarted={() => setUploading(true)}
                  uploaded={() => setUploading(false)}
                />
              </div>
            </div>
          </div>
        )}
        {stage() === 5 && (
          <div class="flex flex-col items-center space-y-5 text-center">
            <img src={LogoLarge} class="h-48" />
            <div class="animate-fade-in">
              Let's get your school garden details.
            </div>
          </div>
        )}
        {stage() === 6 && (
          <div class="flex flex-col items-center space-y-3 text-center animate-fade-in overflow-y-auto">
            <div class="flex flex-col w-full space-y-1">
              <div class="flex w-full">
                Number of School Kids <span class="text-red-500">*</span>
              </div>
              <input
                class="px-3 py-2 w-full bg-neutral-100 text-black border-l border-t border-r border-b border-neutral-400 rounded outline-none"
                type="number"
                placeholder="Number of School Kids"
                value={numberOfSchoolKids() || ""}
                step={1}
                min={1}
                required
                onChange={(event) =>
                  setNumberOfSchoolKids(parseInt(event.target.value) || 0)
                }
              />
            </div>
            <div class="flex flex-col w-full space-y-1">
              <div class="flex w-full">
                Number of Staff/Teachers <span class="text-red-500">*</span>
              </div>
              <input
                class="px-3 py-2 w-full bg-neutral-100 text-black border-l border-t border-r border-b border-neutral-400 rounded outline-none"
                type="number"
                placeholder="Number of Staff/Teachers"
                value={numberOfStaff() || ""}
                step={1}
                min={1}
                required
                onChange={(event) =>
                  setNumberOfStaff(parseInt(event.target.value) || 0)
                }
              />
            </div>
            <div class="flex flex-col w-full space-y-1">
              <div class="flex w-full">
                Do you have a gardener? <span class="text-red-500">*</span>
              </div>
              <SelectMenu
                items={["yes", "no"]}
                selectionChanged={(item) => setHasGardener(item)}
              />
            </div>
            <div class="flex flex-col w-full space-y-1">
              <div class="flex w-full">
                Number of Classrooms <span class="text-red-500">*</span>
              </div>
              <input
                class="px-3 py-2 w-full bg-neutral-100 text-black border-l border-t border-r border-b border-neutral-400 rounded outline-none"
                type="number"
                placeholder="Number of Classrooms"
                value={numberOfClassrooms() || ""}
                step={1}
                min={1}
                required
                onChange={(event) =>
                  setNumberOfClassrooms(parseInt(event.target.value) || 0)
                }
              />
            </div>
            <div class="flex flex-col w-full space-y-1">
              <div class="flex w-full">
                Who owns the land? <span class="text-red-500">*</span>
              </div>
              <SelectMenu
                items={["Government", "Me"]}
                selectionChanged={(item) => setLandOwner(item.toLowerCase())}
              />
            </div>
            <div class="flex flex-col w-full space-y-1">
              <div class="flex w-full">
                Is there a garden in progress?{" "}
                <span class="text-red-500">*</span>
              </div>
              <SelectMenu
                items={["yes", "no"]}
                selectionChanged={(item) => setHasGardenInProgress(item)}
              />
            </div>
            <div class="flex flex-col w-full space-y-1">
              <div class="flex w-full">
                Are crops being grown? <span class="text-red-500">*</span>
              </div>
              <SelectMenu
                items={["yes", "no"]}
                selectionChanged={(item) => setIsGrowingCrops(item)}
              />
            </div>
            <div class="flex flex-col w-full space-y-1">
              <div class="flex w-full">
                What is the size of the garden?{" "}
                <span class="text-red-500">*</span>
              </div>
              <input
                class="px-3 py-2 w-full bg-neutral-100 text-black border-l border-t border-r border-b border-neutral-400 rounded outline-none"
                type="number"
                placeholder="What is the size of the garden?"
                value={gardenSize() || ""}
                step={1}
                min={1}
                required
                onChange={(event) =>
                  setGardenSize(parseInt(event.target.value) || 0)
                }
              />
            </div>
            <div class="flex flex-col w-full space-y-1">
              <div class="flex w-full">
                How many toilets are there on the property?{" "}
                <span class="text-red-500">*</span>
              </div>
              <input
                class="px-3 py-2 w-full bg-neutral-100 text-black border-l border-t border-r border-b border-neutral-400 rounded outline-none"
                type="number"
                placeholder="How many toilets are there on the property?"
                value={numberOfToilets() || ""}
                step={1}
                min={1}
                required
                onChange={(event) =>
                  setNumberOfToilets(parseInt(event.target.value) || 0)
                }
              />
            </div>
            <div class="flex flex-col w-full space-y-1">
              <div class="flex w-full">
                Is a staff member trained in First Aid?{" "}
                <span class="text-red-500">*</span>
              </div>
              <SelectMenu
                items={["yes", "no"]}
                selectionChanged={(item) => setIsFirstAidTrained(item)}
              />
            </div>
            <div class="flex flex-col w-full space-y-1">
              <div class="flex w-full">
                Is there a fire extinguisher on the property?{" "}
                <span class="text-red-500">*</span>
              </div>
              <SelectMenu
                items={["yes", "no"]}
                selectionChanged={(item) =>
                  setIsFireExtinguisherAvailable(item)
                }
              />
            </div>
            <div class="flex flex-col w-full space-y-1">
              <div class="flex w-full">
                Do you have internet access? <span class="text-red-500">*</span>
              </div>
              <SelectMenu
                items={["yes", "no"]}
                selectionChanged={(item) => setHasInternetAccess(item)}
              />
            </div>
            <div class="flex flex-col w-full space-y-1">
              <div class="flex w-full">
                Do you have first aid on the property?{" "}
                <span class="text-red-500">*</span>
              </div>
              <SelectMenu
                items={["yes", "no"]}
                selectionChanged={(item) => setHasFirstAidOnSite(item)}
              />
            </div>
            <div class="flex flex-col w-full space-y-1">
              <div class="flex w-full">
                Number of Fridges <span class="text-red-500">*</span>
              </div>
              <input
                class="px-3 py-2 w-full bg-neutral-100 text-black border-l border-t border-r border-b border-neutral-400 rounded outline-none"
                type="number"
                placeholder="Number of Fridges"
                value={numberOfFridges() || ""}
                step={1}
                min={1}
                required
                onChange={(event) =>
                  setNumberOfFridges(parseInt(event.target.value) || 0)
                }
              />
            </div>
            <div class="flex flex-col w-full space-y-1">
              <div class="flex w-full">
                Number of Water Tanks <span class="text-red-500">*</span>
              </div>
              <input
                class="px-3 py-2 w-full bg-neutral-100 text-black border-l border-t border-r border-b border-neutral-400 rounded outline-none"
                type="number"
                placeholder="Number of Water Tanks"
                value={numberOfWaterTanks() || ""}
                step={1}
                min={1}
                required
                onChange={(event) =>
                  setNumberOfWaterTanks(parseInt(event.target.value) || 0)
                }
              />
            </div>
            <div class="flex flex-col w-full space-y-1">
              <div class="flex w-full">
                Where do you get your food from?{" "}
                <span class="text-red-500">*</span>
              </div>
              <SelectMenu
                items={["Government", "Donations", "Me", "Other"]}
                selectionChanged={(item) => setFoodFrom(item.toLowerCase())}
              />
            </div>
            <div class="flex flex-col w-full space-y-1">
              <div class="flex w-full">
                Do you have working electricity and lights?{" "}
                <span class="text-red-500">*</span>
              </div>
              <SelectMenu
                items={["yes", "no"]}
                selectionChanged={(item) =>
                  setHasWorkingLightsAndElectricity(item)
                }
              />
            </div>
            <div class="flex flex-col w-full space-y-1">
              <div class="flex w-full">
                Do you have running water? <span class="text-red-500">*</span>
              </div>
              <SelectMenu
                items={["yes", "no"]}
                selectionChanged={(item) => setHasRunningWater(item)}
              />
            </div>
            <div class="flex flex-col w-full space-y-1">
              <div class="flex w-full">
                Do you have a stove or oven? <span class="text-red-500">*</span>
              </div>
              <SelectMenu
                items={["yes", "no"]}
                selectionChanged={(item) => setHasStoveOrOven(item)}
              />
            </div>
          </div>
        )}
        {stage() === 7 && (
          <div class="flex flex-col items-center space-y-5 text-center">
            <img src={LogoLarge} class="h-48" />
            <div class="animate-fade-in">Let's get your handles.</div>
          </div>
        )}
        {stage() === 8 && (
          <div class="flex flex-col items-center space-y-3 text-center animate-fade-in">
            <div class="flex flex-col w-full space-y-1">
              <div class="flex w-full">Website</div>
              <input
                class="px-3 py-2 w-full bg-neutral-100 text-black border-l border-t border-r border-b border-neutral-400 rounded outline-none"
                type="text"
                placeholder="Website"
                value={website() || ""}
                onChange={(event) => setWebsite(event.target.value)}
              />
            </div>
            <div class="flex flex-col w-full space-y-1">
              <div class="flex w-full">Facebook Page</div>
              <input
                class="px-3 py-2 w-full bg-neutral-100 text-black border-l border-t border-r border-b border-neutral-400 rounded outline-none"
                type="text"
                placeholder="Facebook Page"
                value={facebookPage() || ""}
                onChange={(event) => setFacebookPage(event.target.value)}
              />
            </div>
            <div class="flex flex-col w-full space-y-1">
              <div class="flex w-full">Instagram</div>
              <input
                class="px-3 py-2 w-full bg-neutral-100 text-black border-l border-t border-r border-b border-neutral-400 rounded outline-none"
                type="text"
                placeholder="Instagram"
                value={instagram() || ""}
                onChange={(event) => setInstagram(event.target.value)}
              />
            </div>
            <div class="flex flex-col w-full space-y-1">
              <div class="flex w-full">YouTube Channel</div>
              <input
                class="px-3 py-2 w-full bg-neutral-100 text-black border-l border-t border-r border-b border-neutral-400 rounded outline-none"
                type="text"
                placeholder="YouTube Channel"
                value={youtubeChannel() || ""}
                onChange={(event) => setYouTubeChannel(event.target.value)}
              />
            </div>
          </div>
        )}
        {stage() === 9 && (
          <div class="flex flex-col items-center space-y-5 text-center">
            <img src={LogoLarge} class="h-48" />
            <div class="animate-fade-in">Let's get your bank details.</div>
          </div>
        )}
        {stage() === 10 && (
          <div class="flex flex-col items-center space-y-3 text-center animate-fade-in">
            <div class="flex flex-col w-full space-y-1">
              <div class="flex w-full">
                Bank Name <span class="text-red-500">*</span>
              </div>
              <input
                class="px-3 py-2 w-full bg-neutral-100 text-black border-l border-t border-r border-b border-neutral-400 rounded outline-none"
                type="text"
                placeholder="Bank Name"
                value={bankName() || ""}
                onChange={(event) => setBankName(event.target.value)}
                required
              />
            </div>
            <div class="flex flex-col w-full space-y-1">
              <div class="flex w-full">
                Bank Branch Code <span class="text-red-500">*</span>
              </div>
              <input
                class="px-3 py-2 w-full bg-neutral-100 text-black border-l border-t border-r border-b border-neutral-400 rounded outline-none"
                type="text"
                placeholder="Bank Branch Code"
                value={branchCode() || ""}
                onChange={(event) => setBranchCode(event.target.value)}
                required
              />
            </div>
            <div class="flex flex-col w-full space-y-1">
              <div class="flex w-full">
                Account Number <span class="text-red-500">*</span>
              </div>
              <input
                class="px-3 py-2 w-full bg-neutral-100 text-black border-l border-t border-r border-b border-neutral-400 rounded outline-none"
                type="text"
                placeholder="Account Number"
                value={accountNumber() || ""}
                onChange={(event) => setAccountNumber(event.target.value)}
                required
              />
            </div>
          </div>
        )}
        {stage() === 11 && (
          <div class="flex flex-col items-center space-y-5 text-center">
            <img src={LogoLarge} class="h-48" />
            <div class="animate-fade-in">Let's get your location details.</div>
          </div>
        )}
        {stage() === 12 && (
          <div class="flex flex-col items-center space-y-3 text-center animate-fade-in">
            <div class="flex flex-col w-full space-y-1">
              <div class="flex w-full">
                Street Address <span class="text-red-500">*</span>
              </div>
              <input
                class="px-3 py-2 w-full bg-neutral-100 text-black border-l border-t border-r border-b border-neutral-400 rounded outline-none"
                type="text"
                placeholder="Street Address"
                value={streetAddress() || ""}
                onChange={(event) => setStreetAddress(event.target.value)}
                required
              />
            </div>
            <div class="flex flex-col w-full space-y-1">
              <div class="flex w-full">Suburb</div>
              <input
                class="px-3 py-2 w-full bg-neutral-100 text-black border-l border-t border-r border-b border-neutral-400 rounded outline-none"
                type="text"
                placeholder="Suburb"
                value={suburb() || ""}
                onChange={(event) => setSuburb(event.target.value)}
              />
            </div>
            <div class="flex flex-col w-full space-y-1">
              <div class="flex w-full">Ward</div>
              <input
                class="px-3 py-2 w-full bg-neutral-100 text-black border-l border-t border-r border-b border-neutral-400 rounded outline-none"
                type="text"
                placeholder="Ward"
                value={ward() || ""}
                onChange={(event) => setWard(event.target.value)}
              />
            </div>
            <div class="flex flex-col w-full space-y-1">
              <div class="flex w-full">
                City <span class="text-red-500">*</span>
              </div>
              <input
                class="px-3 py-2 w-full bg-neutral-100 text-black border-l border-t border-r border-b border-neutral-400 rounded outline-none"
                type="text"
                placeholder="City"
                value={city() || ""}
                onChange={(event) => setCity(event.target.value)}
                required
              />
            </div>
            <div class="flex flex-col w-full space-y-1">
              <div class="flex w-full">
                Area Code <span class="text-red-500">*</span>
              </div>
              <input
                class="px-3 py-2 w-full bg-neutral-100 text-black border-l border-t border-r border-b border-neutral-400 rounded outline-none"
                type="text"
                placeholder="Area Code"
                value={areaCode() || ""}
                onChange={(event) => setAreaCode(event.target.value)}
                required
              />
            </div>
            <div class="flex flex-col w-full space-y-1">
              <div class="flex w-full">
                Province <span class="text-red-500">*</span>
              </div>
              <input
                class="px-3 py-2 w-full bg-neutral-100 text-black border-l border-t border-r border-b border-neutral-400 rounded outline-none"
                type="text"
                placeholder="Province"
                value={province() || ""}
                onChange={(event) => setProvince(event.target.value)}
                required
              />
            </div>
            <div class="flex flex-col w-full space-y-1">
              <div class="flex w-full">
                Country <span class="text-red-500">*</span>
              </div>
              <input
                class="px-3 py-2 w-full bg-neutral-100 text-black border-l border-t border-r border-b border-neutral-400 rounded outline-none"
                type="text"
                placeholder="Country"
                value={country() || ""}
                onChange={(event) => setCountry(event.target.value)}
                required
              />
            </div>
          </div>
        )}
        {stage() === 13 && (
          <div class="flex flex-col items-center space-y-5 text-center">
            <img src={LogoLarge} class="h-48" />
            <div class="animate-fade-in">
              Thank you for completing your profile. We look forward to working
              with you.
            </div>
          </div>
        )}
      </div>
      {stage() > 0 && stage() % 2 === 0 && !uploading() && (
        <div class="flex items-center w-full md:w-96 bg-neutral-900 border-l border-t border-r border-b border-neutral-700 rounded">
          {stage() > 2 && (
            <div
              onClick={() => {
                if (businessType() === "school garden") {
                  setStage(stage() - 2);
                } else if (stage() === 8) {
                  setStage(stage() - 4);
                } else {
                  setStage(stage() - 2);
                }
              }}
              class="flex items-center justify-center p-3 w-full text-white hover:text-red-200 transition-all duration-300 ease-in-out cursor-pointer animate-fade-in"
            >
              Back
            </div>
          )}
          {stage() > 2 && (
            <div class="h-full w-[2px] bg-neutral-700 animate-fade-in"></div>
          )}
          {stage() > 1 && stage() < 12 && (
            <button class="flex items-center justify-center p-3 w-full text-white hover:text-lime-200 transition-all duration-300 ease-in-out cursor-pointer animate-fade-in">
              Next
            </button>
          )}
          {stage() === 12 && (
            <button class="flex items-center justify-center p-3 w-full text-white hover:text-lime-200 transition-all duration-300 ease-in-out cursor-pointer animate-fade-in">
              Finish
            </button>
          )}
        </div>
      )}
    </form>
  );
};

export default CompleteProfilePage;
