import { For, createSignal, onMount } from "solid-js";
import SelectMenu from "../../selectmenu/selectmenu";
import useState from "../../../hooks/state";
import axios from "axios";
import apiUrl from "../../../apiUrl";
import { format } from "date-fns";

const ViewSurveyModal = ({ data = {}, closed = () => {} }) => {
  const [user, setUser] = useState("user");
  const [appMetadata, setAppMetadata] = useState("metadata");

  const [successMessage, setSuccessMessage] = createSignal(undefined);
  const [errorMessage, setErrorMessage] = createSignal(undefined);

  const [answers, setAnswers] = createSignal([]);

  const addSurveyResponse = async () => {
    if (answers().length !== data.surveyQuestions.length)
      return setErrorMessage("Please answer all questions.");

    const response = await axios.post(
      apiUrl + "surveys/responses",
      {
        surveyId: data._id,
        date: format(new Date(), "dd/MM/yyyy"),
        answers: answers(),
      },
      { headers: { Authorization: "Bearer " + user.token } }
    );

    if (response.data.error) return setErrorMessage(response.data.message);
    else {
      setErrorMessage(undefined);
      setSuccessMessage("Successfully submitted response.");

      setTimeout(() => {
        setSuccessMessage(undefined);
        setAnswers([]);

        if (!appMetadata.answeredSurveys)
          setAppMetadata({
            answeredSurveys: [...new Set([data._id])],
          });
        else
          setAppMetadata({
            answeredSurveys: [
              ...new Set([...appMetadata.answeredSurveys, data._id]),
            ],
          });

        closed();
      }, 1500);
    }
  };

  return (
    <div class="absolute bg-neutral-900 bg-opacity-50 left-0 top-0 right-0 bottom-0 flex flex-col items-center justify-center animate-fade-in">
      <div class="flex flex-col w-full md:w-1/4 space-y-3 bg-neutral-900 border-l border-t border-r border-b border-neutral-700 rounded p-2">
        <div class="flex items-center justify-between w-full">
          <div class="cookie text-white text-2xl">{data.surveyDate}</div>
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

        <div class="flex flex-col w-full h-auto space-y-3 bg-neutral-100 rounded p-3">
          <div class="flex items-center space-x-2 text-xl">
            <div>Survey:</div>
            <div class="flex flex-col w-full space-y-1 font-bold">
              {data.surveyTitle}
            </div>
          </div>
          <div class="flex flex-col w-full h-auto space-y-1">
            <div class="flex items-center justify-between w-full">
              <div class="">Survey Questions</div>
            </div>
            <div class="flex flex-col w-full space-y-3 max-h-96 overflow-y-auto">
              <For each={data.surveyQuestions} fallback={() => {}}>
                {(surveyQuestion, qI) => (
                  <div class="flex flex-col w-full h-auto p-1 border-l border-t border-r border-b border-neutral-300 rounded">
                    <div>
                      {qI() + 1}. {surveyQuestion.question}?
                    </div>
                    <SelectMenu
                      items={surveyQuestion.answers.map(
                        (surveyQuestionAnswer) => surveyQuestionAnswer.answer
                      )}
                      selectionChanged={(item) =>
                        setAnswers([
                          ...new Set([
                            ...answers(),
                            { question: surveyQuestion.question, answer: item },
                          ]),
                        ])
                      }
                    />
                  </div>
                )}
              </For>
            </div>
          </div>
          <button
            onClick={() => addSurveyResponse()}
            class="flex items-center justify-center py-2 w-full bg-lime-400 hover:bg-lime-300 active:bg-lime-400 transition-all duration-300 ease-in-out text-black rounded cursor-pointer"
          >
            Submit Response
          </button>
        </div>
      </div>
    </div>
  );
};

const AdminViewSurveyModal = ({ data = {}, closed = () => {} }) => {
  const [user, setUser] = useState("user");

  const [surveyResponses, setSurveyResponses] = createSignal([]);
  const [surveyQuestions, setSurveyQuestions] = createSignal([]);
  const [surveyAnswersCounts, setSurveyAnswersCounts] = createSignal({});

  onMount(() => {
    setTimeout(() => {
      fetchSurvey();
      fetchSurveyResponses();
    }, 100);
  });

  const fetchSurvey = async () => {
    const response = await axios.get(apiUrl + "surveys/" + data._id, {
      headers: { Authorization: "Bearer " + user.token },
    });

    if (response.data.error) return setSurveyQuestions([]);
    else {
      setSurveyQuestions(response.data.surveyQuestions);
    }
  };

  const fetchSurveyResponses = async () => {
    const response = await axios.get(apiUrl + "surveys/responses/" + data._id, {
      headers: { Authorization: "Bearer " + user.token },
    });

    if (response.data.error) return setSurveyResponses([]);
    else {
      setSurveyResponses(response.data);

      let newSurveyAnswersCounts = { ...surveyAnswersCounts() };

      surveyResponses().map((surveyResponse) => {
        surveyResponse.answers.map((surveyAnswer) => {
          newSurveyAnswersCounts[surveyAnswer.question] = {
            ...newSurveyAnswersCounts[surveyAnswer.question],
          };
          newSurveyAnswersCounts[surveyAnswer.question][surveyAnswer.answer] =
            newSurveyAnswersCounts[surveyAnswer.question][surveyAnswer.answer] +
              1 || 1;
        });
      });

      setSurveyAnswersCounts(newSurveyAnswersCounts);
    }
  };

  const getAnswerCount = (question, answer) => {
    if (
      surveyAnswersCounts()[question] !== undefined &&
      surveyAnswersCounts()[question][answer] !== undefined
    ) {
      const count = surveyAnswersCounts()[question][answer];
      console.log(count, surveyResponses().length);
      return count;
    } else return 0;
  };

  return (
    <div class="absolute bg-neutral-900 bg-opacity-50 left-0 top-0 right-0 bottom-0 flex flex-col items-center justify-center animate-fade-in">
      <div class="flex flex-col w-full md:w-1/5 space-y-3 bg-neutral-900 border-l border-t border-r border-b border-neutral-700 rounded p-2">
        <div class="flex items-center justify-between w-full">
          <div class="cookie text-white text-2xl">{data.surveyDate}</div>
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
        <div class="flex flex-col w-full h-auto space-y-3 bg-neutral-100 rounded p-3">
          <div class="flex items-center space-x-2">
            <div>Survey:</div>
            <div class="flex flex-col w-full space-y-1 font-bold text-xl">
              {data.surveyTitle}
            </div>
          </div>
          <div class="font-medium text-lg">Responses</div>
          <div class="flex flex-col space-y-1 max-h-96 overflow-y-auto">
            <For
              each={surveyQuestions()}
              fallback={() => (
                <div class="flex items-center justify-center w-full p-2">
                  There are no responses yet.
                </div>
              )}
            >
              {(surveyQuestion) => (
                <div class="flex flex-col w-full space-y-2">
                  <div class="font-medium">{surveyQuestion.question}</div>
                  <div class="flex flex-col space-y-1">
                    <For
                      each={surveyQuestion.answers}
                      fallback={() => <div>There are no answers.</div>}
                    >
                      {(surveyQuestionAnswer) => (
                        <div
                          class={`relative flex items-center w-full h-10 border-l border-t border-r border-b border-neutral-300 bg-neutral-100 rounded`}
                        >
                          <div
                            class={`absolute h-full bg-lime-400 rounded`}
                            style={{
                              width:
                                (getAnswerCount(
                                  surveyQuestion.question,
                                  surveyQuestionAnswer.answer
                                ) /
                                  surveyResponses().length) *
                                  100 +
                                "%",
                            }}
                          ></div>
                          <div class="flex items-center justify-between w-full px-3 py-2 z-20">
                            <div>{surveyQuestionAnswer.answer}</div>
                            <div>
                              {getAnswerCount(
                                surveyQuestion.question,
                                surveyQuestionAnswer.answer
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </For>
                  </div>
                </div>
              )}
            </For>
          </div>
        </div>
      </div>
    </div>
  );
};

export { ViewSurveyModal, AdminViewSurveyModal };
