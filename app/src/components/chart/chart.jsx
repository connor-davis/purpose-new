import ApexCharts from "apexcharts";
import { onMount } from "solid-js";

const Chart = (props) => {
  onMount(() => {
    var chart = new ApexCharts(
      document.querySelector(`#${props.id}`),
      props.options
    );

    chart.render();
  });

  return <div id={props.id} class="z-0"></div>;
};

export default Chart;
