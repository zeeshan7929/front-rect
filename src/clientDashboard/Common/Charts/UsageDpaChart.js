import React, { useEffect, useState } from "react";
import { HighchartsReact } from "highcharts-react-official";
import Highcharts from "highcharts";
import { postData } from "../../../clientDashboard/Common/fetchservices";
import { SafeSortedReadOnlyDoubleCollection } from "igniteui-react-charts";
const UsageDpaChart = ({ clientId, dpaId, userId }) => {
  const [overview, setoverview] = useState([]);
  const [dpausage, setdpausage] = useState([]);
  const [dpausers, setdpausers] = useState([]);
  const [tokenCount,setTokenCount] = useState([]);
  const [data_to_show,set_data_to_show] = useState([]);
  const [date, setDate] = useState("7 Days");
  let a = overview?.map((el) => el.usage);
  let totalTokenDpa = a?.reduce((x, y) => Number(x) + Number(y), 0);
  let b = dpausage?.map((el) => el.usage);
  let totalDpaUsage = b?.reduce((x, y) => Number(x) + Number(y), 0);
  let c = dpausers?.map((el) => el.usage);
  let totalDpaUsers = c?.reduce((x, y) => Number(x) + Number(y), 0);

  const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const handleAllRange = async (min) => {
    if (clientId && userId !== undefined) {
      const body = {
        client_id: clientId.toString(),
        user_id: userId.toString(),
        min_date: min,
        max_date: new Date(Date.now()).toISOString().substr(0, 10),
      };
      const res = await postData("get_range_user_dpa_usage", body);
      console.log(res)
      let data = [];
      let groupedDate = res?.result.reduce((total, cur) => {
        const { date_time } = cur;
        let val = new Date(date_time).toLocaleDateString("default", {
          weekday: "short",
        });
        total[val] = total[val] || [];
        total[val].push(cur);
        return total;
      }, {});

      for (let key in groupedDate) {
        let totalDpaUsage = 0;
        for (let value of groupedDate[key]) {
          totalDpaUsage += Number(value?.dpa_usage);
        }
        data?.push({ name: key, y: totalDpaUsage });
        
      }

      const ser = weekdays?.map((day) => {
        let match = data?.filter((el) => el.name == day);
        if (match.length) {
          return match[0];
        } else {
          return { name: day, y: 0 };
        }
      });
      setTokenCount(0);
      ser.map((el) => setTokenCount((prev) => prev + Number(el.y)));
      setdpausers(ser);
      set_data_to_show(ser);
    } else if (clientId && dpaId !== undefined) {
      const body = {
        client_id: clientId,
        dpa_id: dpaId,
        min_date: min,
        max_date: new Date(Date.now()).toISOString().substr(0, 10),
      };
      const res = await postData("get_all_range_assign_dpa_usage", body);
      let data = [];
      let groupedDate = res?.result.reduce((total, cur) => {
        const { date_time } = cur;
        let val = new Date(date_time).toLocaleDateString("default", {
          weekday: "short",
        });
        total[val] = total[val] || [];
        total[val].push(cur);
        return total;
      }, {});

      for (let key in groupedDate) {
        let totalDpaUsage = 0;
        for (let value of groupedDate[key]) {
          totalDpaUsage += Number(value?.dpa_usage);
        }
        data?.push({ name: key, y: totalDpaUsage });
      }

      const ser = weekdays?.map((day) => {
        let match = data?.filter((el) => el.name == day);
        if (match.length) {
          return match[0];
        } else {
          return { name: day, y: 0 };
        }
      });
      setTokenCount(0);
      ser.map((el) => setTokenCount((prev) => prev + Number(el.y)));
      setdpausage(ser);
      set_data_to_show(ser)
    } else {
      const body = {
        client_id: clientId.toString(),
        min_date: min,
        max_date: new Date(Date.now()).toISOString().substr(0, 10),
      };
      const res = await postData("get_client_all_range_dpa_usage", body);
      let data = [];
      let groupedDate = res?.result.reduce((total, cur) => {
        const { date_time } = cur;
        let val = new Date(date_time).toLocaleDateString("default", {
          weekday: "short",
        });
        total[val] = total[val] || [];
        total[val].push(cur);
        return total;
      }, {});

      for (let key in groupedDate) {
        let totalDpaUsage = 0;
        for (let value of groupedDate[key]) {
          totalDpaUsage += Number(value?.dpa_usage);
        }
        data?.push({ name: key, y: totalDpaUsage });
      }

      const ser = weekdays?.map((day) => {
        let match = data?.filter((el) => el.name == day);
        if (match.length) {
          return match[0];
        } else {
          return { name: day, y: 0 };
        }
      });
      setTokenCount(0);
      ser.map((el) => setTokenCount((prev) => prev + Number(el.y)));
      setoverview(ser);
      set_data_to_show(ser);
    }
  };

  const handleMinDate = (n) => {
    return new Date(Date.now() - n * 24 * 60 * 60 * 1000)
      .toISOString()
      .substr(0, 10);
  };

  const handleDateRange = (option) => {
    switch (option) {
      case "7 Days":
        var minDate = handleMinDate(7);
        handleAllRange(minDate);
        break;
      case "2 Weeks":
        var minDate = handleMinDate(14);
        handleAllRange(minDate);
        break;
      case "1 Month":
        var minDate = handleMinDate(30);
        handleAllRange(minDate);
        break;
      case "3 Months":
        var minDate = handleMinDate(90);
        handleAllRange(minDate);
        break;
      case "YTD":
        var minDate = handleMinDate(365);
        handleAllRange(minDate);
        break;
      case "Custom":
        var minDate = handleMinDate(90);
        handleAllRange(minDate);
        break;
      default:
        var minDate = handleMinDate(7);
        handleAllRange(minDate);
        break;
    }
  };

  useEffect(() => {
    handleDateRange();
  }, []);

  const options1 = {
    chart: {
      type: "area",
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
      categories: weekdays,
      labels: {
        style: {
          fontSize: "13px",
          fontFamily: "Verdana, sans-serif",
        },
      },
    },
    yAxis: {
      title: {
        text: "",
      },
      min: 50,
      max: tokenCount,
      tickInterval: 10000,
      startPoint: 0,
    },
    plotOptions: {
      series: {
        pointWidth: 20.76,
      },
    },
    legend: {
      enabled: false,
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

    series: [
      {
        name: "Token Usage",
        colors: Highcharts.map(Highcharts.getOptions().colors, function (color) {
          return {
            linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
            stops: [
              
              [0, "#9bb7c2"],
              [1, "#9bb7c2"],
            ],
          };
        }),
        // data : [
        //   {
        //     name: "Point 1",
        //     // color: "#00FF00",
        //     y: 50000,
        //   },
        //   {
        //     name: "Point 2",
        //     // color: "#FF00FF",
        //     y: 50000,
        //   },
        //   {
        //     name: "Point 2",
        //     // color: "#FF00FF",
        //     y: 5000,
        //   },
        //   {
        //     name: "Point 2",
        //     // color: "#FF00FF",
        //     y: 5000,
        //   },
        //   {
        //     name: "Point 2",
        //     // color: "#FF00FF",
        //     y: 5000,
        //   },
        // ],
        data:data_to_show
          // clientId && dpaId
            // ? dpausage
            // : clientId && userId
            // ? dpausers
            // : overview,
      },
    ],
  };
  
  return (
    <div className="card shadow-none border-0 p-3 dpaSection  my-4">
      <div className="row mx-0 align-items-center">
        <div className="col d-flex align-items-center gap-2">
          <div className="dpaUsesHeading fw-semibold">DPA Usage</div>
          <div className="formSelectGroup">
            <select
              className="form-select shadow-none border-secondary"
              aria-label="Default select example"
              onChange={(e) => {
                handleDateRange(e.target.value);
                setDate(e.target.value);
              }}
            >
              <option value="7 Days" selected>
                7 Days
              </option>
              <option value="2 Weeks">2 Weeks</option>
              <option value="1 Month">1 Month</option>
              <option value="3 Months">3 Months</option>
              <option value="YTD">YTD</option>
              
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
                src="./../assets/img/svg/download1.svg"
                className="h-100"
                alt=""
              />
            </span>
            Export
          </button>
        </div>
        <div
          className="d-flex"
          style={{
            justifyContent: "space-between",
            marginTop: "10px",
          }}
        >
          <div>All DPAs collective</div>
          <div>
            <h3>
              {tokenCount > 1000
                ? `${Math.round(tokenCount / 1000)}k`
                : "0" || tokenCount > 1000
                ? `${Math.round(tokenCount / 1000)}k`
                : "0" || tokenCount > 1000
                ? `${Math.round(tokenCount / 1000)}k`
                : "0"}{" "}
              Token
            </h3>
            Last {date}
          </div>
        </div>
        <div className="col-12  mt-3">
          <HighchartsReact highcharts={Highcharts} options={options1} containerProps={{ style: { height: "200px" } }}  />
        </div>
      </div>
    </div>
  );
};

export default UsageDpaChart;
