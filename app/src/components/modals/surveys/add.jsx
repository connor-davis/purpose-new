import { For, createSignal } from "solid-js";
import useState from "../../../hooks/state";
import apiUrl from "../../../apiUrl";
import axios from "axios";
import { format } from "date-fns";
import DatePicker from "../../datepicker/datepicker";
import SelectMenu from "../../selectmenu/selectmenu";

const AddSurveyModal = ({ added = () => {}, closed = () => {} }) => {
  const [user, setUser] = useState("user");

  const [successMessage, setSuccessMessage] = createSignal(undefined);
  const [errorMessage, setErrorMessage] = createSignal(undefined);

  const [surveyTitle, setSurveyTitle] = createSignal(undefined);
  const [surveyDate, setSurveyDate] = createSignal(
    format(Date.now(), "dd/MM/yyyy")
  );
  const [surveyQuestions, setSurveyQuestions] = createSignal([]);
  const [surveyUserType, setSurveyUserType] = createSignal("all");

  const addSurvey = async () => {
    if (surveyQuestions().length === 0)
      return setErrorMessage("Please add at least one question");

    const validQuestions = surveyQuestions().filter(
      (question) => question.answers.length > 0
    );

    if (validQuestions.length !== surveyQuestions().length)
      return setErrorMessage(
        "Please make sure all answers are set for questions."
      );

    const response = await axios.post(
      apiUrl + "surveys/",
      {
        surveyDate: format(Date.now(), "dd/MM/yyyy"),
        surveyTitle: surveyTitle(),
        surveyQuestions: [...surveyQuestions()],
        surveyUserType: surveyUserType(),
      },
      { headers: { Authorization: "Bearer " + user.token } }
    );

    if (response.data.error) return setErrorMessage(response.data.message);
    else {
      setSuccessMessage("Successfully created survey.");

      setTimeout(() => {
        setSurveyTitle(undefined);

        added();
      }, 1500);
    }
  };

  const updateQuestionValue = (index, value) => {
    setSurveyQuestions(
      [...surveyQuestions()].map((question, questionIndex) => {
        if (questionIndex === index) {
          return {
            ...question,
            question: value,
          };
        } else return question;
      })
    );
  };

  const deleteQuestion = (index) => {
    setSurveyQuestions([
      ...surveyQuestions().filter(
        (_question, questionIndex) => questionIndex !== index
      ),
    ]);
  };

  const createQuestionAnswer = (index) => {
    setSurveyQuestions([
      ...surveyQuestions().map((question, questionIndex) => {
        if (questionIndex === index) {
          return {
            ...question,
            answers: [...question.answers, { answer: "" }],
          };
        } else return question;
      }),
    ]);
  };

  const updateQuestionAnswerValue = (qIndex, aIndex, value) => {
    setSurveyQuestions([
      ...surveyQuestions().map((question, questionIndex) => {
        if (questionIndex === qIndex) {
          return {
            ...question,
            answers: [
              ...question.answers.map((answer, answerIndex) => {
                if (answerIndex === aIndex) {
                  return { answer: value };
                } else return answer;
              }),
            ],
          };
        } else return question;
      }),
    ]);
  };

  const deleteQuestionAnswer = (qIndex, aIndex) => {
    setSurveyQuestions([
      ...surveyQuestions().map((question, questionIndex) => {
        if (questionIndex === qIndex) {
          return {
            ...question,
            answers: question.answers.filter(
              (_answer, answerIndex) => answerIndex !== aIndex
            ),
          };
        } else return question;
      }),
    ]);
  };

  return (
    <div class="absolute m-3 md:m-0 bg-neutral-900 bg-opacity-50 left-0 top-0 right-0 bottom-0 flex flex-col items-center justify-center animate-fade-in">
      <div class="flex flex-col w-full md:w-3/5 h-full overflow-y-auto  space-y-3 bg-neutral-900 border-l border-t border-r border-b border-neutral-700 rounded p-2">
        <div class="flex items-center justify-between w-full">
          <div class="cookie text-white text-2xl">Add Survey</div>
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
              addSurvey();
            }
          }}
          class="flex flex-col w-full h-auto space-y-3 bg-neutral-100 rounded p-3"
        >
          <div class="flex flex-col w-full space-y-1">
            <div class="">
              Title <span class="text-red-500">*</span>
            </div>
            <input
              type="text"
              placeholder="Title"
              value={surveyTitle() || ""}
              onChange={(event) => setSurveyTitle(event.target.value)}
              class="px-3 py-2 w-full bg-neutral-100 text-black border-l border-t border-r border-b border-neutral-300 rounded outline-none"
              required
            />
            <div class="text-neutral-400">Give your survey a title.</div>
          </div>
          <div class="flex flex-col w-full space-y-1">
            <div class="">
              Survey Date <span class="text-red-500">*</span>
            </div>
            <DatePicker
              onChange={(date) =>
                setSurveyDate(
                  format(parse(date, "dd/MM/yyyy", Date.now()), "dd/MM/yyyy")
                )
              }
            />
            <div class="text-neutral-400">
              What date must the survey be shown?
            </div>
          </div>
          <div class="flex flex-col w-full h-auto space-y-1">
            <div class="flex items-center justify-between w-full">
              <div class="">
                Survey Questions <span class="text-red-500">*</span>
              </div>
              <div
                onClick={() => {
                  setSurveyQuestions([
                    ...surveyQuestions(),
                    {
                      question: "",
                      answers: [],
                    },
                  ]);
                }}
                class="flex items-center justify-center p-2 bg-lime-400 hover:bg-lime-300 active:bg-lime-400 transition-all duration-300 ease-in-out text-black rounded cursor-pointer"
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
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </svg>
              </div>
            </div>
            <div class="flex flex-col w-full space-y-3 max-h-96 overflow-y-auto">
              <For
                each={surveyQuestions()}
                fallback={() => (
                  <div class="flex items-center justify-center p-3">
                    There are no survey questions
                  </div>
                )}
              >
                {(surveyQuestion, qI) => (
                  <div class="flex flex-col w-full space-y-2 border-l border-t border-r border-b border-neutral-300 rounded p-1">
                    <div class="flex flex-col w-full space-y-1">
                      <div class="flex items-center justify-between">
                        <div class="">
                          Question
                          <span class="text-red-500">*</span>
                        </div>
                        <div
                          onClick={() => deleteQuestion(qI())}
                          class="flex items-center justify-center p-2 bg-red-400 hover:bg-red-300 active:bg-red-400 transition-all duration-300 ease-in-out text-black rounded cursor-pointer"
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
                              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                            />
                          </svg>
                        </div>
                      </div>
                      <input
                        type="text"
                        placeholder={"Question"}
                        value={surveyQuestion.question || ""}
                        onChange={(event) =>
                          updateQuestionValue(qI(), event.target.value)
                        }
                        class="px-3 py-2 w-full bg-neutral-100 text-black border-l border-t border-r border-b border-neutral-300 rounded outline-none"
                        required
                      />
                      <div class="text-neutral-400">
                        What is question {qI() + 1}?
                      </div>
                    </div>
                    <div class="flex flex-col space-y-1">
                      <div class="flex items-center justify-between w-full">
                        <div class="">
                          Answers
                          <span class="text-red-500">*</span>
                        </div>
                        <div
                          onClick={() => {
                            createQuestionAnswer(qI());
                          }}
                          class="flex items-center justify-center p-2 bg-lime-400 hover:bg-lime-300 active:bg-lime-400 transition-all duration-300 ease-in-out text-black rounded cursor-pointer"
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
                              d="M12 4.5v15m7.5-7.5h-15"
                            />
                          </svg>
                        </div>
                      </div>
                      <div class="flex flex-col w-full space-y-3">
                        <For
                          each={surveyQuestions()[qI()].answers}
                          fallback={() => (
                            <div class="flex items-center justify-center p-2">
                              There are no answers for question {qI() + 1}
                            </div>
                          )}
                        >
                          {(answer, aI) => (
                            <div class="flex flex-col w-full space-y-1 border-l border-t border-r border-b border-neutral-300 rounded p-1">
                              <div class="flex items-center justify-between">
                                <div class="">
                                  Answer
                                  <span class="text-red-500">*</span>
                                </div>
                                <div
                                  onClick={() =>
                                    deleteQuestionAnswer(qI(), aI())
                                  }
                                  class="flex items-center justify-center p-2 bg-red-400 hover:bg-red-300 active:bg-red-400 transition-all duration-300 ease-in-out text-black rounded cursor-pointer"
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
                                      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                    />
                                  </svg>
                                </div>
                              </div>
                              <input
                                type="text"
                                placeholder={"Answer"}
                                value={answer.answer || ""}
                                onChange={(event) =>
                                  updateQuestionAnswerValue(
                                    qI(),
                                    aI(),
                                    event.target.value
                                  )
                                }
                                class="px-3 py-2 w-full bg-neutral-100 text-black border-l border-t border-r border-b border-neutral-300 rounded outline-none"
                                required
                              />
                              <div class="text-neutral-400">
                                What is question {qI() + 1} answer {aI() + 1}?
                              </div>
                            </div>
                          )}
                        </For>
                      </div>
                    </div>
                  </div>
                )}
              </For>
            </div>
            {/* <div class="flex flex-col w-full space-y-1">
            <div class="">
              Message <span class="text-red-500">*</span>
            </div>
            <textarea
              type="text"
              placeholder="Message"
              value={announcementMessage() || ""}
              onChange={(event) => setAnnouncementMessage(event.target.value)}
              class="px-3 py-2 w-full h-auto max-h-64 overflow-y-auto bg-neutral-100 text-black border-l border-t border-r border-b border-neutral-200 rounded outline-none"
              rows={6}
              required
            ></textarea>
            <div class="text-neutral-400">What would you like to say?</div>
          </div> */}
          </div>
          <div class="flex flex-col w-full space-y-1">
            <div>Survey User Type</div>
            <SelectMenu
              defaultItem={surveyUserType()}
              items={[
                "all",
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
              selectionChanged={(item) => setSurveyUserType(item)}
            />
          </div>
          <button class="flex items-center justify-center py-2 w-full bg-lime-400 hover:bg-lime-300 active:bg-lime-400 transition-all duration-300 ease-in-out text-black rounded cursor-pointer">
            Add Survey
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddSurveyModal;
