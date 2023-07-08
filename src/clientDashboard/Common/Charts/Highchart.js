import React, { useEffect, useState } from "react";
import Highcharts from "highcharts";
import { HighchartsReact } from "highcharts-react-official";
import { postData } from "../fetchservices";
import { CountConverter } from "../Others/CountConverter";

const Highchart = ({ id, gradiant, height }) => {
  const [filterOption, setFilterOption] = useState("7day");
  const [totalUsage, setTotalUsage] = useState(0);
  const [data, setData] = useState([]);
  const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const ids = JSON.parse(localStorage.getItem("a_login"));

  const getApiData = async (minDate) => {
    const body = {
      client_id: ids.client_id,
      min_date: minDate,
      max_date: new Date(Date.now()).toISOString().substr(0, 10),
    };

    const res = await postData("get_client_all_range_dpa_usage", body);
    let slicedData = res.result.map((el) => {
      return {
        assign_dpa_id: el.assign_dpa_id,
        client_id: el.client_id,
        date_time: new Date(el.date_time.slice(0, 10)).toLocaleString(
          "default",
          { weekday: "short" }
        ),
        dpa_id: el.dpa_id,
        dpa_usage: el.dpa_usage,
        embeding_usage: el.embeding_usage,
        user_id: el.user_id,
      };
    });

    const grouped = slicedData.reduce((cur, total) => {
      const { date_time } = total;
      cur[date_time] = cur[date_time] ?? [];
      cur[date_time].push(total);
      return cur;
    }, []);

    let da = Object.values(grouped).map((item) => {
      let dpaUsage = 0;
      let embaddeingUsage = 0;
      item.map(
        (el) =>
          (dpaUsage += Number(el.dpa_usage)) &&
          (embaddeingUsage += Number(el.embeding_usage))
      );
      return { name: item[0].date_time, y: dpaUsage };
    });

    const ser = weekdays.map((day) => {
      let match = da.filter((el) => el.name == day);
      if (match.length) {
        return match[0];
      } else {
        return { name: day, y: 0 };
      }
    });
    ser.map((el) => setTotalUsage((prev) => prev + Number(el.y)));
    setData(ser);
  };

  function findMinDate(n) {
    return new Date(Date.now() - n * 24 * 60 * 60 * 1000)
      .toISOString()
      .substr(0, 10);
  }

  const hanldeFilter = (option) => {
    switch (option) {
      case "7day":
        var minDate = findMinDate(7);
        getApiData(minDate);
        setFilterOption("Last 7 days");
        break;
      case "2week":
        var minDate = findMinDate(14);
        getApiData(minDate);
        setFilterOption("Last 2 weeks");
        break;
      case "1month":
        var minDate = findMinDate(30);
        getApiData(minDate);
        setFilterOption("Last 1 months");

      case "3month":
        var minDate = findMinDate(90);
        getApiData(minDate);
        setFilterOption("Last 3 months");
        break;
      case "ytd":
        setFilterOption("YTD");
        var minDate = findMinDate(365);
        getApiData(minDate);
        break;
      case "custom":
        setFilterOption("Custom");
        var minDate = findMinDate(365);
        getApiData(minDate);
        break;
      default:
        var minDate = findMinDate(7);
        setFilterOption("Last 7 days");
        getApiData(minDate);

        break;
    }
  };

  useEffect(() => {
    hanldeFilter();
  }, []);

  const getOptionsDashboardMain = (type) => ({
    chart: {
      type: type,
      // height: 277,
    },
    accessibility: {
      enabled: false,
    },
    title: {
      text: "",
    },
    subtitle: {
      text: "",
    },
    xAxis: {
      categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    },
    yAxis: {
      title: {
        text: "",
      },
      min: 4000,
      max: 15000,
      tickInterval: 5000,
      startPoint: 0,
    },
    tooltip: {
      headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
      pointFormat:
        '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
        '<td style="padding:0"><b>${point.y} k</b></td></tr>',
      footerFormat: "</table>",
      shared: true,
      useHTML: true,
    },
    colors: Highcharts.map(Highcharts.getOptions().colors, function (color) {
      return {
        linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
        stops: [
          [0, !!gradiant ? gradiant.color1 : gradiant.color2],
          [1, gradiant.color2],
        ],
      };
    }),
    plotOptions: {
      column: {
        colorByPoint: true,
        pointPadding: 0.2,
        borderWidth: 0,
      },
      series: {
        pointWidth: 15,
      },
    },
    legend: false,
    series: [
      {
        data: data,
       },
    ],
  });

  return (
    <div className="row">
      <div className="col-xxl-12">
        <div className="card shadow-none border-0 p-3 dpaSection">
          <div className="row mx-0 align-items-center h-50">
            <div className="col d-flex align-items-center gap-2">
              <div className="dpaUsesHeading fw-semibold">DPA Usage</div>
              <div className="formSelectGroup">
                <select
                  className="form-select shadow-none"
                  aria-label="Default select example"
                  onChange={(e) => hanldeFilter(e.target.value)}
                >
                  <option value="7day">7 Days</option>
                  <option value="2week">2 Weeks</option>
                  <option value="1month">1 Month</option>
                  <option value="3month">3 Months</option>
                  <option value="ytd">YTD</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
            </div>

            <div className="col-auto">
              <button
                type="button"
                className="exportBtn rounded-pill d-inline-flex align-items-center gap-1 btn fw-medium"
              >
                <span className="d-inline-flex">
                  <img
                    src="assets/img/svg/download.svg"
                    className="h-100"
                    alt="image"
                  />
                </span>
                Export
              </button>
            </div>
            <div className="d-flex align-items-center  justify-content-between ">
              <div className="mt-0">
                <p>All DPAs collective</p>
              </div>
              <div className="text-end mt-3">
                <div
                  className="persantage"
                  style={{
                    fontWeight: 600,
                    fontSize: "25px",
                    // color: "#4a5c77",
                    // fontWeight: "bold",
                  }}
                >
                  {CountConverter(totalUsage)} Tokens
                </div>
                <div className="progresbarbottomtext">{filterOption}</div>
              </div>
            </div>
            <div className="col-12">
              <div className="cardImage">
                {/* <img
                src="assets/img/svg/tokenChart.svg"
                className="w-100 h-100"
               alt="image"
              /> */}
                <HighchartsReact
                  highcharts={Highcharts}
                  options={getOptionsDashboardMain("column")}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Highchart;
