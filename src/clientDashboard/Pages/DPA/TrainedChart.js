import React, { useEffect, useState } from "react";
import { HighchartsReact } from "highcharts-react-official";
import Highcharts from "highcharts";
import { postData } from "../../../clientDashboard/Common/fetchservices";
import { CountConverter } from "../../Common/Others/CountConverter";
const MasterHighchart = ({ title }) => {
  const [dpausage, setdpausage] = useState([]);
  const [usage,setUsage] = useState([]);
  const [date, setDate] = useState("7 Days");
  let a = dpausage?.map((el) => el.usage);
  const [totalUsage,setTotalUsage] = useState("");
  let totalTokenDpa = a?.reduce((x, y) => Number(x) + Number(y), 0);
  const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  let ids = JSON.parse(localStorage.getItem("a_login"));
  const handleAllRange = async (min) => {
    const body = {
      client_id: ids?.client_id,
      min_date: min,
      max_date: new Date(Date.now()).toISOString().substr(0, 10),
    };
    
    const res = await postData("get_all_range_dpa_training_token_usage", body);
    let slicedData = res.result.map((el) => {
      return {
        assign_dpa_id: el.assign_dpa_id,
        client_id: el.client_id,
        date_time: el.date_time,
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
    setTotalUsage(0)


    let da = Object.values(grouped).map((item) => {
      let dpaUsage = 0;
      let embaddeingUsage = 0;
      item.map(
        (el) =>
          (dpaUsage += Number(el.dpa_usage)) &&
          (embaddeingUsage += Number(el.embeding_usage))
      );
      return { name: item[0].date_time, y: embaddeingUsage };
    });
    let prev = {};
    slicedData.map((el)=>{
      let d = new Date(el.date_time);
      const dat_ = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())
      
      if (!(dat_ in prev)){prev[dat_] = Number(el.embeding_usage)}
      else {
        let old = prev[dat_]
        prev[dat_] = Number(old) + Number(el.embeding_usage)
      }
    })
    let finalData = [];
    let t = 0;
    Object.keys(prev).forEach(function(key, index) {
      finalData.push([Number(key),Number(prev[key])])
      t += Number(prev[key])
    });
    
    setUsage(t);
    const ser_ = slicedData.map((el)=>{
      let d = new Date(el.date_time);
      let dat_ = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())
      
      return {label :dat_,y:Number(el.embeding_usage)}
    })
    
    setdpausage(finalData);
    console.log(finalData);
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
      animation: Highcharts.svg
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
      type: 'datetime',
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
      labels: {
        formatter: function () {
            return CountConverter(this.value)
        }
    },
      min: 0,
      format: '{value}',
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
      headerFormat: '<span style="font-size:10px">{point.key}</span><br><table>',
      pointFormatter: function(){
        var point = this,
            series = point.series;

        return `${series.name}: <b>${CountConverter(point.y)}</b>`
    },
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
            [0, "#9bb7c2"],
              [1, "#9bb7c2"],
          ],
        },
        data: dpausage,
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
              {CountConverter(usage)}{" "}
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
