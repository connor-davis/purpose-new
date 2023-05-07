import axios from "axios";
import { createSignal, onMount } from "solid-js";
import apiUrl from "../../apiUrl";
import { ViewSurveyModal } from "../../components/modals/surveys/view";
import Pager from "../../components/pager";
import useState from "../../hooks/state";

const SurveysPage = () => {
  const [user, setUser] = useState("user");
  const [appMetadata, setAppMetadata] = useState("metadata");

  const [viewingSurvey, setViewingSurvey] = createSignal(undefined);

  const [surveys, setSurveys] = createSignal([]);
  const [currentPage, setCurrentPage] = createSignal(1);
  const [totalPages, setTotalPages] = createSignal(0);

  const [loading, setLoading] = createSignal(true);

  onMount(() => {
    fetchSurveys();
  });

  const fetchSurveys = () => {
    setLoading(true);
    setSurveys([]);

    setTimeout(async () => {
      const response = await axios.get(
        apiUrl + "surveys/page/" + currentPage() + "?limit=10&userId=",
        { headers: { Authorization: "Bearer " + user.token } }
      );

      const { data, totalSurveys, totalPages } = response.data;

      if (data.length === 0 && totalSurveys > 0) {
        if (currentPage() > 1) setCurrentPage(currentPage() - 1);
        fetchSurveys();
      } else {
        setSurveys(data);
        setTotalPages(totalPages);
      }

      setLoading(false);
    }, 100);
  };

  return (
    <div class="flex flex-col w-full h-full p-5">
      {viewingSurvey() && (
        <ViewSurveyModal
          data={viewingSurvey()}
          closed={() => {
            setViewingSurvey(undefined);
          }}
        />
      )}

      <div class="flex flex-col space-y-3 text-black bg-white w-full h-full overflow-hidden rounded p-3">
        <div class="flex items-center justify-between animate-fade-in">
          <div class="cookie text-2xl">Surveys</div>
        </div>
        <div class="flex flex-col w-full h-full space-y-2 overflow-y-auto">
          <For
            each={surveys().filter((survey) => {
              if (appMetadata && appMetadata.answeredSurveys) {
                return !appMetadata.answeredSurveys.includes(survey._id);
              } else return true;
            })}
            fallback={() =>
              loading() ? (
                <div class="flex flex-col space-y-2 animate-fade-in">
                  <div class="bg-neutral-100 animate-pulse w-full h-10 rounded-xl"></div>
                  <div class="bg-neutral-100 animate-pulse w-full h-10 rounded-xl"></div>
                  <div class="bg-neutral-100 animate-pulse w-full h-10 rounded-xl"></div>
                </div>
              ) : (
                <div class="flex flex-col w-full h-full items-center justify-center animate-fade-in">
                  There are no surveys.
                </div>
              )
            }
          >
            {(survey) => (
              <div class="flex items-center justify-between transition-all duration-1000 ease-in-out hover:bg-neutral-100 space-x-2 rounded px-3 py-2 group animate-fade-in">
                <div class="flex items-center space-x-3 h-9">
                  <div class={`"text-lime-600" font-bold`}>
                    {survey.surveyDate}
                  </div>
                  <div>{survey.surveyTitle}</div>
                </div>

                <div class="flex items-center space-x-2">
                  <div
                    class="hidden group-hover:flex group-hover:animate-fade-in p-2 rounded-full items-center justify-center hover:bg-lime-200 cursor-pointer w-8 h-8"
                    onClick={() => setViewingSurvey(survey)}
                  >
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
                        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                      />
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            )}
          </For>
        </div>
        {surveys().filter((survey) => {
          if (appMetadata && appMetadata.answeredSurveys) {
            return !appMetadata.answeredSurveys.includes(survey._id);
          } else return true;
        }).length > 0 && (
          <div>
            <Pager
              currentPage={currentPage}
              pageCount={totalPages}
              pageChanged={(page) => {
                setCurrentPage(page);
                fetchSurveys();
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SurveysPage;
