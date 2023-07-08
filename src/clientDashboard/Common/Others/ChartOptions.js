const getOptionsDashboardCirculer = (
  type,
  legend,
  data,
  center,
  totalToken
) => ({
  chart: {
    minHeight: 100,
    height: 250,
    type: type,
    events: {
      render: function () {
        // Get chart center coordinates
        var centerX = this.plotWidth / 2;
        var centerY = this.plotHeight / 2;

        // Create the label
        var label = this.renderer
          .label(
            `${
              center
                ? `<p style="font-weight : bold">${
                    totalToken > 1000
                      ? `${totalToken / 1000}k`
                      : totalToken > 0
                      ? totalToken
                      : "0"
                  }</p> <br/>Token used`
                : ""
            }`,
            centerX,
            centerY
          )
          .css({
            color: "#000",
            fontSize: "14px",
            diplay: "flex",
            alignItems: "center",
            justifyContent: "center",
            flex: "column",
          })
          .attr({
            fill: "rgba(255, 255, 255, 0.75)",
            padding: 8,
            r: 5,
          })
          .add();

        // Position the label in the center of the chart
        var labelBox = label.getBBox();
        label.translate(
          centerX - labelBox.width / 4,
          centerY - labelBox.height / 4
        );
      },
    },
  },
  accessibility: {
    enabled: false,
  },
  title: {
    text: "",
    align: "",
  },
  tooltip: {
    headerFormat: "",
    pointFormat:
      '<span style="color:{point.color}"></span> <b> {point.name}</b><br/>' +
      "Token usage : <b>{point.y}</b><br/>",
    // + "Population density (people per square km): <b>{point.z}</b><br/>",
  },
  plotOptions: {
    pie: {
      // allowPointSelect: true,
      cursor: "pointer",
      dataLabels: {
        enabled: false,
      },
      showInLegend: legend,
    },
  },

  legend: {
    layout: "vertical",
    align: "right",
    verticalAlign: "middle",
    itemMarginTop: 10,
    itemMarginBottom: 10,
    text: "center text",
  },
  series: [
    {
      minPointSize: 25,
      innerSize: center ? "60%" : "50%",
      name: "Token",
      borderWidth: 5,
      borderColor: "#fff",
      borderRadius: 0,
      data: data
        ? data
        : [
            {
              name: "Spain",
              y: 505992,
              z: 92,
              color: "#23e274",
            },
            {
              name: "France",
              y: 551695,
              z: 119,
              color: "#0ff3a0",
            },
            {
              name: "Poland",
              y: 312679,
              z: 121,
              color: "#2dd9db",
            },
            {
              name: "Italy",
              y: 301336,
              z: 200,
              color: "#3dc3e8",
            },
            {
              name: "Germany",
              y: 357114,
              z: 235,
              color: "#4caefe",
            },
          ],
      // colors: [
      //   "#4caefe",
      //   "#3dc3e8",
      //   "#2dd9db",
      //   "#1feeaf",
      //   "#0ff3a0",
      //   "#00e887",
      //   "#23e274",
      // ],
    },
  ],
});

const getOptionsDashboardMain = (type) => ({
  chart: {
    type: type,
  },
  accessibility: {
    enabled: false,
  },
  title: {
    text: null,
  },
  subtitle: {
    text: null,
  },
  xAxis: {
    categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    // crosshair: true,
  },
  yAxis: {
    min: 4000,
    max: 15000,
    tickInterval: 5000,
    startPoint: 0,
    title: {
      text: "Rainfall (mm)",
    },
  },
  tooltip: {
    headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
    pointFormat:
      '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
      '<td style="padding:0"><b>{point.y:.1f} k</b></td></tr>',
    footerFormat: "</table>",
    shared: true,
    useHTML: true,
  },
  plotOptions: {
    column: {
      pointPadding: 0.2,
      borderWidth: 0,
    },
  },
  plotOptions: {
    column: {
      colorByPoint: true,
    },
    series: {
      pointWidth: 15,
    },
  },

  colors: ["#4A5C77"],
  series: [
    {
      name: "Tokyo",
      data: [4400, 5000, 6000, 8000, 9000, 10000, 14000],
    },
  ],
});

export { getOptionsDashboardCirculer, getOptionsDashboardMain };
