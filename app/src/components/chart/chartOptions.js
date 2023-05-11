export const monthlySalesOptions = {
  series: [
    {
      name: "Profit",
      data: [31, 40, 28, 51, 42, 109, 100, 0, 0, 0, 0, 0],
    },
    {
      name: "Expenses",
      data: [11, 32, 45, 32, 34, 52, 41, 0, 0, 0, 0, 0],
    },
    {
      name: "Sales",
      data: [35, 22, 27, 45, 78, 12, 30, 0, 0, 0, 0, 0],
    },
  ],
  title: {
    text: "Monthly Sales",
    style: {
      fontSize: "26px",
    },
  },
  chart: {
    height: "100%",
    type: "area",
  },
  colors: ["#a3e635", "#dc2626", "#171717"],
  dataLabels: {
    enabled: false,
  },
  stroke: {
    curve: "smooth",
  },
  xaxis: {
    type: "category",
    categories: [
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
    ],
  },
  tooltip: {
    x: {
      format: "dd/MM/yyyy",
    },
  },
};

export const agesOptions = {
  series: [31, 40, 28, 51, 42, 109, 100, 0, 0, 0],
  title: {
    text: "Ages",
    style: {
      fontSize: "26px",
    },
  },
  chart: {
    height: "100%",
    type: "pie",
  },
  responsive: [
    {
      breakpoint: 1000,
      options: {
        chart: {
          width: "100%",
          heigh: "100%",
        },
        legend: {
          position: "bottom",
        },
      },
    },
  ],
  labels: [
    "0-10",
    "11-20",
    "21-30",
    "31-40",
    "41-50",
    "51-60",
    "61-70",
    "71-80",
    "81-90",
    "91-100",
  ],
};

export const monthlyHarvestsOptions = {
  series: [
    {
      data: [31, 40, 28, 51, 42, 109, 100, 0, 0, 0, 0, 0],
    },
  ],
  title: {
    text: "Monthly Harvests",
    style: {
      fontSize: "26px",
    },
  },
  chart: {
    height: "100%",
    type: "area",
  },
  colors: ["#a3e635"],
  dataLabels: {
    enabled: false,
  },
  stroke: {
    curve: "smooth",
  },
  xaxis: {
    type: "category",
    categories: [
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
    ],
  },
  tooltip: {
    x: {
      format: "dd/MM/yyyy",
    },
  },
};

export const userTypesOptions = {
  series: [31, 40, 28, 51, 42, 109, 100, 0, 0, 0, 0, 0, 1],
  title: {
    text: "User Types",
    style: {
      fontSize: "26px",
    },
  },
  chart: {
    height: "100%",
    type: "pie",
  },
  responsive: [
    {
      breakpoint: 1000,
      options: {
        chart: {
          width: "100%",
          heigh: "100%",
        },
        legend: {
          position: "bottom",
        },
      },
    },
  ],
  labels: [
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
    "Other",
  ],
};
