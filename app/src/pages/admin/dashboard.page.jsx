import axios from "axios";
import { createSignal, onMount } from "solid-js";
import apiUrl from "../../apiUrl";
import Chart from "../../components/chart/chart";
import {
  agesOptions,
  monthlyIncomeOptions,
  monthlySalesOptions,
  monthsHarvestsOptions,
  userTypesOptions,
} from "../../components/chart/chartOptions";
import useState from "../../hooks/state";
import { format, getYear } from "date-fns";
import SelectMenu from "../../components/selectmenu/selectmenu";

const AdminDashboardPage = () => {
  const [user, setUser] = useState("user");

  const [loading, setLoading] = createSignal(true);

  const [totalUsers, setTotalUsers] = createSignal(0);

  const [totalProfit, setTotalProfit] = createSignal(0);
  const [totalExpenses, setTotalExpenses] = createSignal(0);
  const [totalSales, setTotalSales] = createSignal(0);
  const [totalIncome, setTotalIncome] = createSignal(0);

  const [profit, setProfit] = createSignal([]);
  const [expenses, setExpenses] = createSignal([]);
  const [sales, setSales] = createSignal([]);
  const [income, setIncome] = createSignal([]);

  const [usersAges, setUsersAges] = createSignal([]);

  const [monthsHarvests, setMonthsHarvests] = createSignal([]);
  const [selectedMonth, setSelectedMonth] = createSignal(
    format(Date.now(), "MMMM")
  );

  const [userTypes, setUserTypes] = createSignal([]);

  onMount(() => {
    setTimeout(async () => {
      await loadTotalUsers();
      await loadFinanceTotals();
      await loadProfit();
      await loadExpenses();
      await loadSales();
      await loadIncome();
      await loadUsersAges();
      await loadMonthsHarvests();
      await loadUserTypes();

      setLoading(false);
    }, 400);
  });

  function sortByMonthName(monthNames, isReverse = false) {
    const referenceMonthNames = [
      "jan",
      "feb",
      "mar",
      "apr",
      "may",
      "jun",
      "jul",
      "aug",
      "sep",
      "oct",
      "nov",
      "dec",
    ];
    const directionFactor = isReverse ? -1 : 1;
    const comparator = (a, b) => {
      if (!a && !b) return 0;
      if (!a && b) return -1 * directionFactor;
      if (a && !b) return 1 * directionFactor;

      const comparableA = a.toLowerCase().substring(0, 3);
      const comparableB = b.toLowerCase().substring(0, 3);
      const comparisonResult =
        referenceMonthNames.indexOf(comparableA) -
        referenceMonthNames.indexOf(comparableB);
      return comparisonResult * directionFactor;
    };
    const safeCopyMonthNames = [...monthNames];
    safeCopyMonthNames.sort(comparator);
    return safeCopyMonthNames;
  }

  const loadTotalUsers = async () => {
    const response = await axios.get(apiUrl + "analytics/totalUsers", {
      headers: { Authorization: "Bearer " + user.token },
    });

    if (response.data) {
      return setTotalUsers(response.data.totalUsers);
    } else return setLoading(false);
  };

  const loadFinanceTotals = async () => {
    const response = await axios.get(apiUrl + "analytics/financeTotals/all", {
      headers: { Authorization: "Bearer " + user.token },
    });

    if (response.data) {
      setTotalProfit(response.data.totalProfit);
      setTotalExpenses(response.data.totalExpenses);
      setTotalSales(response.data.totalSales);
      setTotalIncome(response.data.totalIncome);

      return true;
    } else return setLoading(false);
  };

  const loadProfit = async () => {
    const response = await axios.get(apiUrl + "analytics/monthlyProfit/all", {
      headers: { Authorization: "Bearer " + user.token },
    });

    if (response.data) {
      const months = sortByMonthName(Object.keys(response.data.monthlyProfit));
      const data = [];

      for (let i in months) {
        data.push(response.data.monthlyProfit[months[i]]);
      }

      setProfit(data);

      return true;
    } else return setLoading(false);
  };

  const loadExpenses = async () => {
    const response = await axios.get(apiUrl + "analytics/monthlyExpenses/all", {
      headers: { Authorization: "Bearer " + user.token },
    });

    if (response.data) {
      const months = sortByMonthName(
        Object.keys(response.data.monthlyExpenses)
      );
      const data = [];

      for (let i in months) {
        data.push(response.data.monthlyExpenses[months[i]]);
      }

      setExpenses(data);

      return true;
    } else return setLoading(false);
  };

  const loadSales = async () => {
    const response = await axios.get(apiUrl + "analytics/monthlySales/all", {
      headers: { Authorization: "Bearer " + user.token },
    });

    if (response.data) {
      const months = sortByMonthName(Object.keys(response.data.monthlySales));
      const data = [];

      for (let i in months) {
        data.push(response.data.monthlySales[months[i]]);
      }

      setSales(data);

      return true;
    } else return setLoading(false);
  };

  const loadIncome = async () => {
    const response = await axios.get(apiUrl + "analytics/monthlyIncome/all", {
      headers: { Authorization: "Bearer " + user.token },
    });

    if (response.data) {
      const months = sortByMonthName(Object.keys(response.data.monthlyIncome));
      const data = [];

      for (let i in months) {
        data.push(response.data.monthlyIncome[months[i]]);
      }

      setIncome(data);

      return true;
    } else return setLoading(false);
  };

  const loadUsersAges = async () => {
    const response = await axios.get(apiUrl + "analytics/usersAges", {
      headers: { Authorization: "Bearer " + user.token },
    });

    if (response.data) {
      console.log(Object.values(response.data));
      return setUsersAges(Object.values(response.data));
    } else setLoading(false);
  };

  const loadMonthsHarvests = async () => {
    const response = await axios.get(
      apiUrl +
        "analytics/monthsHarvests/all" +
        "?month=" +
        selectedMonth() +
        "&year=" +
        getYear(Date.now()),
      { headers: { Authorization: "Bearer " + user.token } }
    );

    if (response.data) {
      return setMonthsHarvests([
        { name: "Harvested", data: Object.values(response.data.produceCounts) },
        {
          name: "Weight (kg)",
          data: Object.values(response.data.produceWeights),
        },
        {
          name: "Yield (kg)",
          data: Object.values(response.data.produceYields),
        },
      ]);
    } else setLoading(false);
  };

  const loadUserTypes = async () => {
    const response = await axios.get(apiUrl + "analytics/userTypes", {
      headers: { Authorization: "Bearer " + user.token },
    });

    if (response.data) {
      return setUserTypes(Object.values(response.data.userTypes));
    } else setLoading(false);
  };

  return (
    <div class="flex flex-col space-y-3 p-3 pb-6 w-full h-full overflow-y-auto">
      <div class="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3 w-full md:h-1/4">
        {!loading() ? (
          <div class="w-full md:w-1/4 h-full bg-lime-400 rounded-lg p-3">
            <div class="flex flex-col w-full h-full md:items-center justify-center">
              <div class="flex flex-col">
                <div class="font-bold w-full text-2xl md:text-4xl cookie">
                  Total Profit
                </div>
                <div class="font-medium md:text-xl">R {totalProfit()}</div>
              </div>
            </div>
          </div>
        ) : (
          <div class="w-full md:w-1/4 h-full bg-white rounded-lg p-3">
            <div class="flex flex-col w-full h-full rounded bg-neutral-200 animate-pulse transition-all duration-300 ease-in-out"></div>
          </div>
        )}
        {!loading() ? (
          <div class="w-full md:w-1/4 h-full bg-lime-400 rounded-lg p-3">
            <div class="flex flex-col w-full h-full md:items-center justify-center">
              <div class="flex flex-col">
                <div class="font-bold w-full text-2xl md:text-4xl cookie">
                  Total Expenses
                </div>
                <div class="font-medium md:text-xl">R {totalExpenses()}</div>
              </div>
            </div>
          </div>
        ) : (
          <div class="w-full md:w-1/4 h-full bg-white rounded-lg p-3">
            <div class="flex flex-col w-full h-full rounded bg-neutral-200 animate-pulse transition-all duration-300 ease-in-out"></div>
          </div>
        )}
        {!loading() ? (
          <div class="w-full md:w-1/4 h-full bg-lime-400 rounded-lg p-3">
            <div class="flex flex-col w-full h-full md:items-center justify-center">
              <div class="flex flex-col">
                <div class="font-bold w-full text-2xl md:text-4xl cookie">
                  Total Sales
                </div>
                <div class="font-medium md:text-xl">R {totalSales()}</div>
              </div>
            </div>
          </div>
        ) : (
          <div class="w-full md:w-1/4 h-full bg-white rounded-lg p-3">
            <div class="flex flex-col w-full h-full rounded bg-neutral-200 animate-pulse transition-all duration-300 ease-in-out"></div>
          </div>
        )}
        {!loading() ? (
          <div class="w-full md:w-1/4 h-full bg-lime-400 rounded-lg p-3">
            <div class="flex flex-col w-full h-full md:items-center justify-center">
              <div class="flex flex-col">
                <div class="font-bold w-full text-2xl md:text-4xl cookie">
                  Total Users
                </div>
                <div class="font-medium md:text-xl">{totalUsers()}</div>
              </div>
            </div>
          </div>
        ) : (
          <div class="w-full md:w-1/4 h-full bg-white rounded-lg p-3">
            <div class="flex flex-col w-full h-full rounded bg-neutral-200 animate-pulse transition-all duration-300 ease-in-out"></div>
          </div>
        )}
      </div>
      <div class="flex flex-col space-y-3 w-full h-full">
        <div class="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3 w-full md:h-1/2">
          <div class="w-full h-[300px] md:h-full bg-white rounded-lg p-3">
            {!loading() ? (
              profit().length > 1 &&
              expenses().length > 1 &&
              sales().length > 1 ? (
                <Chart
                  id="monthlySales"
                  options={{
                    ...monthlySalesOptions,
                    series: [
                      { name: "Profit (R)", data: profit() },
                      { name: "Expenses (R)", data: expenses() },
                      { name: "Sales (R)", data: sales() },
                    ],
                  }}
                />
              ) : (
                <div class="flex flex-col w-full h-full items-center justify-center">
                  <div class="flex flex-col">
                    <div class="font-bold w-full text-4xl cookie">
                      Monthly Sales
                    </div>
                    <div class="font-medium text-xl">
                      There is no data to display.
                    </div>
                  </div>
                </div>
              )
            ) : (
              <div class="flex flex-col w-full h-full rounded bg-neutral-200 animate-pulse transition-all duration-300 ease-in-out"></div>
            )}
          </div>
          <div class="w-full h-[300px] md:h-full bg-white rounded-lg p-3">
            {!loading() ? (
              profit().length > 1 &&
              expenses().length > 1 &&
              sales().length > 1 ? (
                <Chart
                  id="monthlyIncome"
                  options={{
                    ...monthlyIncomeOptions,
                    series: [{ name: "Income (R)", data: income() }],
                  }}
                />
              ) : (
                <div class="flex flex-col w-full h-full items-center justify-center">
                  <div class="flex flex-col">
                    <div class="font-bold w-full text-4xl cookie">
                      Monthly Income
                    </div>
                    <div class="font-medium text-xl">
                      There is no data to display.
                    </div>
                  </div>
                </div>
              )
            ) : (
              <div class="flex flex-col w-full h-full rounded bg-neutral-200 animate-pulse transition-all duration-300 ease-in-out"></div>
            )}
          </div>
          <div class="w-full h-[500px] md:h-full bg-white rounded-lg p-3">
            {!loading() ? (
              usersAges().length > 0 ? (
                <Chart
                  id="usersAges"
                  options={{ ...agesOptions, series: usersAges() }}
                />
              ) : (
                <div class="flex flex-col w-full h-full items-center justify-center">
                  <div class="flex flex-col">
                    <div class="font-bold w-full text-4xl cookie">Ages</div>
                    <div class="font-medium text-xl">
                      There is no data to display.
                    </div>
                  </div>
                </div>
              )
            ) : (
              <div class="flex flex-col w-full h-full rounded bg-neutral-200 animate-pulse transition-all duration-300 ease-in-out"></div>
            )}
          </div>
        </div>
        <div class="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3 w-full md:h-1/2">
          <div class="w-full h-[300px] md:h-full bg-white rounded-lg p-3 pb-6">
            {!loading() && (
              <div class="flex justify-end w-full h-auto">
                <div class="min-w-[200px]">
                  <SelectMenu
                    defaultItem={selectedMonth()}
                    items={[
                      "January",
                      "February",
                      "March",
                      "April",
                      "May",
                      "June",
                      "July",
                      "August",
                      "September",
                      "October",
                      "November",
                      "December",
                    ]}
                    selectionChanged={(item) => {
                      setMonthsHarvests([]);
                      setSelectedMonth(item);
                      loadMonthsHarvests();
                    }}
                  />
                </div>
              </div>
            )}
            {!loading() ? (
              monthsHarvests().length > 0 ? (
                <Chart
                  id="monthlyHarvests"
                  options={{
                    ...monthsHarvestsOptions,
                    series: monthsHarvests(),
                  }}
                />
              ) : (
                <div class="flex flex-col w-full h-full items-center justify-center">
                  <div class="flex flex-col">
                    <div class="font-bold w-full text-4xl cookie">
                      Monthly Harvests
                    </div>
                    <div class="font-medium text-xl">
                      There is no data to display.
                    </div>
                  </div>
                </div>
              )
            ) : (
              <div class="flex flex-col w-full h-full rounded bg-neutral-200 animate-pulse transition-all duration-300 ease-in-out"></div>
            )}
          </div>
          <div class="w-full h-[500px] md:h-full bg-white rounded-lg p-3">
            {!loading() ? (
              userTypes().length > 0 ? (
                <Chart
                  id="userTypes"
                  options={{
                    ...userTypesOptions,
                    series: userTypes(),
                  }}
                />
              ) : (
                <div class="flex flex-col w-full h-full items-center justify-center">
                  <div class="flex flex-col">
                    <div class="font-bold w-full text-4xl cookie">
                      User Types
                    </div>
                    <div class="font-medium text-xl">
                      There is no data to display.
                    </div>
                  </div>
                </div>
              )
            ) : (
              <div class="flex flex-col w-full h-full rounded bg-neutral-200 animate-pulse transition-all duration-300 ease-in-out"></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
