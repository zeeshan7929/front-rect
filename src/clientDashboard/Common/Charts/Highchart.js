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
  const [totalToken,setTotalToken] = useState([]);
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
    let prev = {};
    let org = []

    slicedData.map((el)=>{
      let d = new Date(el.date_time);
      const dat_ = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())
      
      if (!(dat_ in prev)){prev[dat_] = Number(el.dpa_usage)}
      else {
        let old = prev[dat_]
        prev[dat_] = Number(old) + Number(el.dpa_usage)
      }
    })
    let finalData = [];
    let t = 0;
    Object.keys(prev).forEach(function(key, index) {
      finalData.push([Number(key),Number(prev[key])])
      t += Number(prev[key])
    });
    
    setTotalToken(t);
    const ser_ = slicedData.map((el)=>{
      let d = new Date(el.date_time);
      let dat_ = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())
      
      return {label :dat_,y:Number(el.dpa_usage)}
    })
    
    
    setTotalUsage(0)
    console.log(finalData)
    // ser.map((el) => setTotalUsage((prev) => prev + Number(el.y)));
    setData(finalData);
    
    
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
        break
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
      type: "area",
      animation: Highcharts.svg,
      
      // height: 277,
    },
    lang: {
      decimalPoint: '.',
      thousandsSep: ','
    },
    accessibility: {
      enabled: true,
    },
    title: {
      text: "",
    },
    subtitle: {
      text: "",
    },
    xAxis: {
      type: 'datetime',
    },
    yAxis: {
      title: {
        text: "",
      },
      min: 0,
      
      startPoint: 0,
    },
    tooltip: {
      headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
      
      pointFormat:
        '<tr><td style="color:{series.color};padding:0"></td>' +
        '<td style="padding:0">Token Used: <b>{point.y:,.0f}</b></td></tr>',
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
        pointWidth: 10,
      },
      
    },
    legend: false,
    series: [
      {
        name:"Token usage ",
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
                  {/* <option value="custom">Custom</option> */}
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
                  {CountConverter(totalToken)} Tokens
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
