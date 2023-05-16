import { createSignal, onMount } from "solid-js";
import Chart from "../../components/chart/chart";
import {
  monthlyIncomeOptions,
  monthlySalesOptions,
  monthsHarvestsOptions,
} from "../../components/chart/chartOptions";
import axios from "axios";
import apiUrl from "../../apiUrl";
import useState from "../../hooks/state";
import { format, getYear } from "date-fns";
import SelectMenu from "../../components/selectmenu/selectmenu";

const DashboardPage = () => {
  const [user, setUser] = useState("user");

  const [loading, setLoading] = createSignal(true);

  const [totalUsers, setTotalUsers] = createSignal(0);

  const [totalProfit, setTotalProfit] = createSignal(0);
  const [totalExpenses, setTotalExpenses] = createSignal(0);
  const [totalSales, setTotalSales] = createSignal(0);

  const [profit, setProfit] = createSignal([]);
  const [expenses, setExpenses] = createSignal([]);
  const [sales, setSales] = createSignal([]);
  const [income, setIncome] = createSignal([]);

  const [latestSales, setLatestSales] = createSignal([]);

  const [monthsHarvests, setMonthsHarvests] = createSignal([]);
  const [selectedMonth, setSelectedMonth] = createSignal(
    format(Date.now(), "MMMM")
  );

  const [latestHarvests, setLatestHarvests] = createSignal([]);

  onMount(() => {
    setTimeout(async () => {
      await loadFinanceTotals();
      await loadProfit();
      await loadExpenses();
      await loadSales();
      await loadIncome();
      await loadLatestSales();
      await loadMonthsHarvests();
      await loadLatestHarvests();

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

  const loadFinanceTotals = async () => {
    const response = await axios.get(
      apiUrl + "analytics/financeTotals/" + user.data._id,
      { headers: { Authorization: "Bearer " + user.token } }
    );

    if (response.data) {
      setTotalProfit(response.data.totalProfit);
      setTotalExpenses(response.data.totalExpenses);
      setTotalSales(response.data.totalSales);

      return true;
    } else return setLoading(false);
  };

  const loadProfit = async () => {
    const response = await axios.get(
      apiUrl + "analytics/monthlyProfit/" + user.data._id,
      {
        headers: { Authorization: "Bearer " + user.token },
      }
    );

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
    const response = await axios.get(
      apiUrl + "analytics/monthlyExpenses/" + user.data._id,
      {
        headers: { Authorization: "Bearer " + user.token },
      }
    );

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
    const response = await axios.get(
      apiUrl + "analytics/monthlySales/" + user.data._id,
      {
        headers: { Authorization: "Bearer " + user.token },
      }
    );

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
    const response = await axios.get(
      apiUrl + "analytics/monthlyIncome/" + user.data._id,
      {
        headers: { Authorization: "Bearer " + user.token },
      }
    );

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

  const loadLatestSales = async () => {
    const response = await axios.get(
      apiUrl + "analytics/latestSales/" + user.data._id,
      { headers: { Authorization: "Bearer " + user.token } }
    );

    if (response.data) {
      return setLatestSales(response.data.latestSales);
    } else setLoading(false);
  };

  const loadMonthsHarvests = async () => {
    const response = await axios.get(
      apiUrl +
        "analytics/monthsHarvests/" +
        user.data._id +
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

  const loadLatestHarvests = async () => {
    const response = await axios.get(
      apiUrl + "analytics/latestHarvests/" + user.data._id,
      { headers: { Authorization: "Bearer " + user.token } }
    );

    if (response.data) {
      return setLatestHarvests(response.data.latestHarvests);
    } else setLoading(false);
  };

  return (
    <div class="flex flex-col space-y-3 p-3 w-full h-full overflow-y-auto">
      <div class="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3 w-full md:h-1/4">
        {!loading() ? (
          <div class="w-full md:w-1/3 h-full bg-lime-400 rounded-lg p-3">
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
          <div class="w-full md:w-1/3 h-full bg-white rounded-lg p-3">
            <div class="flex flex-col w-full h-full rounded bg-neutral-200 animate-pulse transition-all duration-300 ease-in-out"></div>
          </div>
        )}
        {!loading() ? (
          <div class="w-full md:w-1/3 h-full bg-lime-400 rounded-lg p-3">
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
          <div class="w-full md:w-1/3 h-full bg-white rounded-lg p-3">
            <div class="flex flex-col w-full h-full rounded bg-neutral-200 animate-pulse transition-all duration-300 ease-in-out"></div>
          </div>
        )}
        {!loading() ? (
          <div class="w-full md:w-1/3 h-full bg-lime-400 rounded-lg p-3">
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
          <div class="w-full md:w-1/3 h-full bg-white rounded-lg p-3">
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
              income().length > 1 ? (
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
          <div class="w-full h-[300px] md:h-full bg-white rounded-lg p-3">
            {!loading() ? (
              latestSales().length > 0 ? (
                <div class="flex flex-col w-full h-full overflow-y-auto overflow-x-auto">
                  <table class="table-auto bg-white border-l border-t border-r border-neutral-200 text-black">
                    <thead>
                      <tr class="p-3 border-b border-neutral-200 bg-neutral-900 text-white select-none">
                        <th class="text-left p-3">Date</th>
                        <th class="text-left p-3">Products</th>
                        <th class="p-3 text-left">Profit</th>
                      </tr>
                    </thead>
                    <tbody>
                      <For each={latestSales()}>
                        {(sale) => (
                          <tr class="hover:bg-neutral-100 border-b border-neutral-200 group">
                            <td class="flex items-center space-x-2 p-3 whitespace-nowrap">
                              {sale.date}
                            </td>
                            <td class="p-3 whitespace-nowrap">
                              {sale.products.length}
                            </td>
                            <td class="p-3 whitespace-nowrap">
                              R {sale.profit}
                            </td>
                          </tr>
                        )}
                      </For>
                    </tbody>
                  </table>
                </div>
              ) : (
                <div class="flex flex-col w-full h-full items-center justify-center">
                  <div class="flex flex-col">
                    <div class="font-bold w-full text-4xl cookie">
                      Latest Sales
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
        <div class="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3 w-full md:h-1/2">
          <div class="w-full h-[300px] md:h-full bg-white rounded-lg p-3 pb-6">
            {!loading() && (
              <div class="flex justify-end">
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
          <div class="w-full h-[300px] md:h-full bg-white rounded-lg p-3">
            {!loading() ? (
              latestHarvests().length > 0 ? (
                <div class="flex flex-col w-full h-full overflow-y-auto overflow-x-auto">
                  <table class="table-auto bg-white border-l border-t border-r border-neutral-200 text-black">
                    <thead>
                      <tr class="p-3 border-b border-neutral-200 bg-neutral-900 text-white select-none">
                        <th class="text-left p-3">Date</th>
                        <th class="text-left p-3">Produce</th>
                      </tr>
                    </thead>
                    <tbody>
                      <For each={latestHarvests()}>
                        {(harvest) => (
                          <tr class="hover:bg-neutral-100 border-b border-neutral-200 group">
                            <td class="flex items-center space-x-2 p-3 whitespace-nowrap">
                              {harvest.date}
                            </td>
                            <td class="p-3 whitespace-nowrap">
                              {harvest.produce.length}
                            </td>
                          </tr>
                        )}
                      </For>
                    </tbody>
                  </table>
                </div>
              ) : (
                <div class="flex flex-col w-full h-full items-center justify-center">
                  <div class="flex flex-col">
                    <div class="font-bold w-full text-4xl cookie">
                      Latest Harvests
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

export default DashboardPage;
