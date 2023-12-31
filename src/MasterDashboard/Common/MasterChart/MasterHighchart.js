import React, { useEffect, useState } from "react";
import { HighchartsReact } from "highcharts-react-official";
import Highcharts from "highcharts";
import { postData } from "../../../clientDashboard/Common/fetchservices";
import { CountConverter } from "../../../clientDashboard/Common/Others/CountConverter";
const MasterHighchart = ({ title }) => {
  const [dpausage, setdpausage] = useState([]);
  const [embedding, setembedding] = useState([]);
  const [totalUsage,setTotalUsage] = useState(0);
  
  const [date, setDate] = useState("7 Days");
  let a = dpausage?.map((el) => el.usage);
  let totalTokenDpa = a?.reduce((x, y) => Number(x) + Number(y), 0);
  let b = embedding?.map((el) => el.usage);
  let totalTokenEm = b?.reduce((x, y) => Number(x) + Number(y), 0);

  const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const handleAllRange = async (min) => {
    const body = {
      min_date: min,
      max_date: new Date(Date.now()).toISOString().substr(0, 10),
    };
    if (title === "Modal Usage") {
      const res = await postData(
        "m_get_all_clients_all_range_embedding_usage",
        body
      );
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
      console.log("Grouped data:")
      console.log(groupedDate)
      let i = 0;
      for (let key in groupedDate) {
        let totalDpaUsage = 0;
        for (let value of groupedDate[key]) {
          totalDpaUsage += Number(value?.dpa_usage);
          i += value?.dpa_usage;
        }
        data?.push({ name: key, y: totalDpaUsage });
      }
     let s = 0;
      const ser = weekdays?.map((day) => {
        let match = data?.filter((el) => el.name == day);
        if (match.length) {
          s += match[0]['y']
          
          return match[0];
        } else {
          return { name: day, y: 0 };
        }
      });
      setTotalUsage(0)
      setTotalUsage(s);
      setdpausage(ser);
    } else {
      const res = await postData(
        "m_get_all_clients_all_range_model_usage",
        body
      );
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
      let i = 0;
      for (let key in groupedDate) {
        let totalDpaUsage = 0;
        for (let value of groupedDate[key]) {
          totalDpaUsage += Number(value?.embeding_usage);
          i += value?.embeding_usage;
        }
        data?.push({ name: key, y: totalDpaUsage });
        
      }
      let s = 0;
      const ser = weekdays?.map((day) => {
        let match = data?.filter((el) => el.name === day);
        if (match.length) {
          s += match[0]['y']
          return match[0];
        } else {
          return { name: day, y: 0 };
        }
      });
      setTotalUsage(0);
      setTotalUsage(s);
      setembedding(ser);
      console.log(totalUsage);
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
    },
    title:{
      text:"",
    },
    subtitle: {
      text: "",
    },
    xAxis: {
      categories: weekdays,
      labels: {
        rotation: -45,
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
      min: 5000,
      max: totalUsage,
      tickInterval: 10000,
      startPoint: 0,
    },
    plotOptions: {
      // column: {
      //   colorByPoint: true,
      //   pointPadding: 0.2,
      //   borderWidth: 0,
      // },
      series: {
        pointWidth: 20,
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
        color: {
          linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
          stops: [
            [0, title === "Modal Usage" ? "#bad5d6" : "#dbc8cb"],
            [1, title === "Embedding Usage" ? "#9db9c3" : "#b6bec6"],
          ],
        },
        data: title === "Modal Usage" ? dpausage : embedding,
      },
    ],
  };
  return (
    <div className="card shadow-none border-0 p-3 dpaSection  my-4">
      <div className="row mx-0 align-items-center">
        <div className="col d-flex align-items-center gap-2">
          <div className="dpaUsesHeading fw-semibold">{title}</div>
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
          <div>All modal usage of client</div>
          <div>
            <h3>
              {totalUsage > 1000
                ? `${CountConverter(totalUsage) }` 
                : "0"}{" "}
              Token
            </h3>
            Last {date}
          </div>
        </div>
        <div className="col-12  mt-3">
          <HighchartsReact highcharts={Highcharts} options={options1} />
        </div>
      </div>
    </div>
  );
};

export default MasterHighchart;
