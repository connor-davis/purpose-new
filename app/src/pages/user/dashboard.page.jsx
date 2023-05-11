import { createSignal, onMount } from "solid-js";
import Chart from "../../components/chart/chart";
import {
  monthlyHarvestsOptions,
  monthlySalesOptions,
} from "../../components/chart/chartOptions";
import axios from "axios";
import apiUrl from "../../apiUrl";
import useState from "../../hooks/state";

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

  const [latestSales, setLatestSales] = createSignal([]);

  const [monthlyHarvests, setMonthlyHarvests] = createSignal([]);

  const [latestHarvests, setLatestHarvests] = createSignal([]);

  onMount(() => {
    setTimeout(async () => {
      await loadFinanceTotals();
      await loadProfit();
      await loadExpenses();
      await loadSales();
      await loadLatestSales();
      await loadMonthlyHarvests();
      await loadLatestHarvests();

      setLoading(false);
    }, 400);
  });

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
      setProfit(Object.values(response.data.monthlyProfit));

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
      setExpenses(Object.values(response.data.monthlyExpenses));

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
      setSales(Object.values(response.data.monthlySales));

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

  const loadMonthlyHarvests = async () => {
    const response = await axios.get(
      apiUrl + "analytics/monthlyHarvests/" + user.data._id,
      { headers: { Authorization: "Bearer " + user.token } }
    );

    if (response.data) {
      return setMonthlyHarvests(Object.values(response.data.monthlyHarvests));
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
      <div class="flex space-x-3 w-full h-1/4">
        {!loading() ? (
          <div class="w-1/3 h-full bg-lime-400 rounded-lg p-3">
            <div class="flex flex-col w-full h-full items-center justify-center">
              <div class="flex flex-col">
                <div class="font-bold w-full text-4xl cookie">Total Profit</div>
                <div class="font-medium text-xl">R {totalProfit()}</div>
              </div>
            </div>
          </div>
        ) : (
          <div class="w-1/3 h-full bg-white rounded-lg p-3">
            <div class="flex flex-col w-full h-full rounded bg-neutral-200 animate-pulse transition-all duration-300 ease-in-out"></div>
          </div>
        )}
        {!loading() ? (
          <div class="w-1/3 h-full bg-lime-400 rounded-lg p-3">
            <div class="flex flex-col w-full h-full items-center justify-center">
              <div class="flex flex-col">
                <div class="font-bold w-full text-4xl cookie">
                  Total Expenses
                </div>
                <div class="font-medium text-xl">R {totalExpenses()}</div>
              </div>
            </div>
          </div>
        ) : (
          <div class="w-1/3 h-full bg-white rounded-lg p-3">
            <div class="flex flex-col w-full h-full rounded bg-neutral-200 animate-pulse transition-all duration-300 ease-in-out"></div>
          </div>
        )}
        {!loading() ? (
          <div class="w-1/3 h-full bg-lime-400 rounded-lg p-3">
            <div class="flex flex-col w-full h-full items-center justify-center">
              <div class="flex flex-col">
                <div class="font-bold w-full text-4xl cookie">Total Sales</div>
                <div class="font-medium text-xl">R {totalSales()}</div>
              </div>
            </div>
          </div>
        ) : (
          <div class="w-1/3 h-full bg-white rounded-lg p-3">
            <div class="flex flex-col w-full h-full rounded bg-neutral-200 animate-pulse transition-all duration-300 ease-in-out"></div>
          </div>
        )}
      </div>
      <div class="flex flex-col space-y-3 w-full h-full">
        <div class="flex space-x-3 w-full h-1/2">
          <div class="w-full h-full bg-white rounded-lg p-3">
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
          <div class="w-full h-full bg-white rounded-lg p-3">
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
        <div class="flex space-x-3 w-full h-1/2">
          <div class="w-full h-full bg-white rounded-lg p-3">
            {!loading() ? (
              monthlyHarvests().length > 0 ? (
                <Chart
                  id="monthlyHarvests"
                  options={{
                    ...monthlyHarvestsOptions,
                    series: [{ name: "", data: monthlyHarvests() }],
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
          <div class="w-full h-full bg-white rounded-lg p-3">
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
