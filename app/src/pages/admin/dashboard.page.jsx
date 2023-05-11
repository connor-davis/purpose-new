import { createSignal, onMount } from "solid-js";
import Chart from "../../components/chart/chart";
import {
  agesOptions,
  monthlyHarvestsOptions,
  monthlySalesOptions,
  userTypesOptions,
} from "../../components/chart/chartOptions";
import axios from "axios";
import apiUrl from "../../apiUrl";
import useState from "../../hooks/state";

const AdminDashboardPage = () => {
  const [user, setUser] = useState("user");

  const [loading, setLoading] = createSignal(true);

  const [totalUsers, setTotalUsers] = createSignal(0);

  const [totalProfit, setTotalProfit] = createSignal(0);
  const [totalExpenses, setTotalExpenses] = createSignal(0);
  const [totalSales, setTotalSales] = createSignal(0);

  const [profit, setProfit] = createSignal([]);
  const [expenses, setExpenses] = createSignal([]);
  const [sales, setSales] = createSignal([]);

  const [usersAges, setUsersAges] = createSignal([]);

  const [monthlyHarvests, setMonthlyHarvests] = createSignal([]);

  const [userTypes, setUserTypes] = createSignal([]);

  onMount(() => {
    setTimeout(async () => {
      await loadTotalUsers();
      await loadFinanceTotals();
      await loadProfit();
      await loadExpenses();
      await loadSales();
      await loadUsersAges();
      await loadMonthlyHarvests();
      await loadUserTypes();

      setLoading(false);
    }, 400);
  });

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

      return true;
    } else return setLoading(false);
  };

  const loadProfit = async () => {
    const response = await axios.get(apiUrl + "analytics/monthlyProfit/all", {
      headers: { Authorization: "Bearer " + user.token },
    });

    if (response.data) {
      setProfit(Object.values(response.data.monthlyProfit));

      return true;
    } else return setLoading(false);
  };

  const loadExpenses = async () => {
    const response = await axios.get(apiUrl + "analytics/monthlyExpenses/all", {
      headers: { Authorization: "Bearer " + user.token },
    });

    if (response.data) {
      setExpenses(Object.values(response.data.monthlyExpenses));

      return true;
    } else return setLoading(false);
  };

  const loadSales = async () => {
    const response = await axios.get(apiUrl + "analytics/monthlySales/all", {
      headers: { Authorization: "Bearer " + user.token },
    });

    if (response.data) {
      setSales(Object.values(response.data.monthlySales));

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

  const loadMonthlyHarvests = async () => {
    const response = await axios.get(apiUrl + "analytics/monthlyHarvests/all", {
      headers: { Authorization: "Bearer " + user.token },
    });

    if (response.data) {
      return setMonthlyHarvests(Object.values(response.data.monthlyHarvests));
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
    <div class="flex flex-col space-y-3 p-3 w-full h-full overflow-y-auto">
      <div class="flex space-x-3 w-full h-1/4">
        {!loading() ? (
          <div class="w-1/4 h-full bg-lime-400 rounded-lg p-3">
            <div class="flex flex-col w-full h-full items-center justify-center">
              <div class="flex flex-col">
                <div class="font-bold w-full text-4xl cookie">Total Profit</div>
                <div class="font-medium text-xl">R {totalProfit()}</div>
              </div>
            </div>
          </div>
        ) : (
          <div class="w-1/4 h-full bg-white rounded-lg p-3">
            <div class="flex flex-col w-full h-full rounded bg-neutral-200 animate-pulse transition-all duration-300 ease-in-out"></div>
          </div>
        )}
        {!loading() ? (
          <div class="w-1/4 h-full bg-lime-400 rounded-lg p-3">
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
          <div class="w-1/4 h-full bg-white rounded-lg p-3">
            <div class="flex flex-col w-full h-full rounded bg-neutral-200 animate-pulse transition-all duration-300 ease-in-out"></div>
          </div>
        )}
        {!loading() ? (
          <div class="w-1/4 h-full bg-lime-400 rounded-lg p-3">
            <div class="flex flex-col w-full h-full items-center justify-center">
              <div class="flex flex-col">
                <div class="font-bold w-full text-4xl cookie">Total Sales</div>
                <div class="font-medium text-xl">R {totalSales()}</div>
              </div>
            </div>
          </div>
        ) : (
          <div class="w-1/4 h-full bg-white rounded-lg p-3">
            <div class="flex flex-col w-full h-full rounded bg-neutral-200 animate-pulse transition-all duration-300 ease-in-out"></div>
          </div>
        )}
        {!loading() ? (
          <div class="w-1/4 h-full bg-lime-400 rounded-lg p-3">
            <div class="flex flex-col w-full h-full items-center justify-center">
              <div class="flex flex-col">
                <div class="font-bold w-full text-4xl cookie">Total Users</div>
                <div class="font-medium text-xl">{totalUsers()}</div>
              </div>
            </div>
          </div>
        ) : (
          <div class="w-1/4 h-full bg-white rounded-lg p-3">
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
