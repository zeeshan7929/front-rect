import React, { useEffect, useState } from "react";
import Sidebar from "../Common/Sidebar/Sidebar";
import { useNavigate } from "react-router-dom";
import Header from "../Common/Header/Header";
import { postData } from "../../clientDashboard/Common/fetchservices";

function DPASelection({ sideBar, setSidebarOpen }) {
  const ids = JSON.parse(localStorage.getItem("a_login"));
  const navigate = useNavigate();
  const [dpauser, setdpauser] = useState([]);
  const [filterdDpa, setFilterdDpa] = useState([]);
  const [search, setSearch] = useState("");

  const Alldpauser = async () => {
    const body = {
      client_id: ids?.client_id,
      user_id: String(ids?.user_id),
    };
    const res = await postData("u_get_user_all_assign_dpa", body);
    setdpauser(res.result);
    setFilterdDpa(res.result);
  };

  useEffect(() => {
    Alldpauser();
  }, []);

  const handleFilter = () => {
    let input = search.toLocaleLowerCase();
    const fill = dpauser.filter((el) => el.dpa_name.toLowerCase().includes(input));
    setFilterdDpa(fill);
  };

  useEffect(() => {
    handleFilter();
  }, [search]);

  const renderBothCard = () => {
    let cards = [];
    let length = filterdDpa.length;
    let dpa = filterdDpa;
    for (let i = 0; i < length; i += 2) {
      let card1 = dpa[i];
      let card2 = i + 1 < length ? dpa[i + 1] : null;

      cards.push(
        <div
          className="row flex-column gap-md-4 gap-3 mx-0"
          style={{ width: "360px" }}
        >
          <div className="col-auto px-0">
            <div
              className="card dataCard bg-one"
              style={{ backgroundColor: card1?.dpa_color }}
              onClick={() =>
                navigate("/workplace-relation", {
                  state: { item: card1 },
                })
              }
            >
              <div className="row mx-0 flex-column h-100">
                <div className="col-auto px-0">
                  <div className="dataCardImg">
                    <img
                      src="../assets/img/svg/grid.svg"
                      className="w-100 h-100"
                      alt=""
                    />
                  </div>
                </div>
                <div className="col px-0 dataCardHeading">{card1?.dpa_name}</div>
                <div className="col px-0 dataCardText">
                  {card1?.description}
                </div>
                <div className="col px-0 flex-fill d-flex">
                  <div className="cardLink mt-auto ms-auto">Use this DPA →</div>
                </div>
              </div>
            </div>
          </div>

          {card2 && (
            <div className="col-auto px-0">
              <div
                className="card dataCard bg-two "
                style={{ backgroundColor: card2?.dpa_color }}
                onClick={() =>
                  navigate("/workplace-relation", {
                    state: { item: card2 },
                  })
                }
              >
                <div className="row mx-0 flex-column h-100">
                  <div className="col-auto px-0">
                    <div className="dataCardImg">
                      <img
                        src="../assets/img/svg/grid.svg"
                        className="w-100 h-100"
                        alt=""
                      />
                    </div>
                  </div>
                  <div className="col px-0 dataCardHeading">{card2?.dpa_name}</div>
                  <div className="col px-0 dataCardText">
                    {card2?.description}
                  </div>
                  <div className="col px-0 flex-fill d-flex">
                    <div className="cardLink mt-auto ms-auto">
                      Use this DPA →
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }
    return cards;
  };

  return (
    <main className="container-fluid h-100">
      <div className="row chatbotMainInner h-100">
        <div className="col-12 px-0 h-100" data-page-name="Homepage">
          <div className="container-fluid h-100">
            <div
              className={`row h-100 mx-0 menuIcon ${
                sideBar == "cgrid" ? "show" : ""
              }`}
            >
              <Sidebar sideBar={sideBar} setSidebarOpen={setSidebarOpen} />
              <div className="col-auto rightPart px-0 h-100">
                <div className="row mx-0 h-100 flex-column flex-nowrap overflow-hidden">
                  <Header
                    title={"DPA Selection"}
                    setSidebarOpen={setSidebarOpen}
                  />
                  <div className="col-12 mainPart flex-fill overflow-hidden-auto onlyHomePage">
                    <div className="row mx-0 indexPageOuter h-100 align-items-end">
                      <div className="col-12 px-0 sectionHeading py-4">
                        <span>D</span>atabase <span>P</span>ersonal{" "}
                        <span>A</span>ssistance
                      </div>
                      <div className="col-12 px-0 indexBottomSection pb-md-5 pb-3">
                        <div className="row mx-0">
                          <div className="col-12 ps-0 pb-4 searchBoxOuter">
                            <div className="row mx-0">
                              <div className="col px-0 megicTextOuter">
                                <div className="imgOuter">
                                  <img
                                    src="../assets/img/svg/magic.svg"
                                    className="w-100 w-100"
                                    alt=""
                                  />
                                </div>
                                <div className="magicText">
                                  Which DPA do you need assistance from?
                                </div>
                              </div>
                              <div className="col-md-auto col-12 pe-0 SearchBarOuter">
                                <div className="input-group">
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search..."
                                    aria-label="Search..."
                                    aria-describedby="button-addon2"
                                    onChange={(e) => setSearch(e.target.value)}
                                  />
                                  <button
                                    className="btn"
                                    type="button"
                                    id="button-addon2"
                                  >
                                    <img
                                      src="../assets/img/svg/Search-icon-Dark.svg"
                                      alt=""
                                    />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-12 overflow-auto-hidden px-0 customScrollbar">
                            <div className="row mx-0 gap-md-4 gap-3 flex-nowrap">
                              {renderBothCard()}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* <div className="col-12 bottomBar d-flex align-items-center justify-content-end gap-3">
                    <a href="javascript:;" className="btn cancelBtn">
                      Cancel
                    </a>
                    <a href="javascript:;" className="btn uploadBtn">
                      <img
                        src="../assets/img/svg/upload2.svg"
                        className="me-2"
                        alt=""
                      />
                      Upload for Review
                    </a>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default DPASelection;
