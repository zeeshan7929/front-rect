import React, { useEffect, useState } from "react";
import Sidebar from "../../Common/Sidebar/Sidebar";
import Header from "../../Common/Header/Header";
import { addBlurClass } from "../../Common/Others/AddBlurClass";

import * as yup from "yup";
import * as Yup from "yup";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import PizZip from "jszip";
import Docxtemplater from "docxtemplater";
import { postData } from "../../Common/fetchservices";
import { Line } from "rc-progress";
import { toaster } from "../../Common/Others/Toaster";
import { useImageToBase64 } from "../../../Chat Interface/Common/blob/blob";
import FileSizeConverter from "../../Common/Others/FileSizeConverter";
import { CountConverter } from "../../Common/Others/CountConverter";
import Modal from "../../Common/Modal";

const UploadDocuments = ({ sideBar, setSidebarOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  let data = location?.state?.data;
  const dpaID = location?.state?.dpaId
    ? location?.state?.dpaId
    : location?.state?.data?.id;
  let ids = JSON.parse(localStorage.getItem("a_login"));
  const { base64Image, convertToBase64, setBase64Image } = useImageToBase64();

  // const [fileSize, setFileSise] = useState("");
  // const [fileName, setFileName] = useState("");
  const [selectedFiles,setSelectedFiles] = useState([]);
  
  
  
  const [tokenUsage,setTokenUsage] = useState([]);
  const [tierInfo,setTierInfo] = useState([]);
  const [modelOpen, setModelOpen] = useState(false);
  const [isUploading,setIsUploading] = useState(false);
  const [currentlyUploading,setCurrentlyUploading] = useState(0);
  const [uploadSize,setUploadSize] = useState(0);
  const [title,setTitle] = useState("")
  const [description,setDescription] = useState("")
  const handleAPIData = async ()=>{
    let body = {
      client_id:ids?.client_id,
      dpa_id:String(data?.id)
    }
    const tokens = await postData("get_client_training_token_usage", body);
    setTokenUsage(tokens.result.training_token_usage);
    const res55 = await postData("get_client_tier_info", body);
    setTierInfo(res55.result);
  }
  useEffect(() => {
    
    addBlurClass();
  });
  const handleDeleteDpa = async () => {
    const body = {
      dpa_id: String(data.id ? data.id : ""),
    };
    const res = await postData("delete_dpa", body);
    setModelOpen(false);
    if (res.result == "success") {
      navigate("/dpa-overview");
    }
  };
  useEffect(() => {
    handleAPIData();
    
  }, []);

  

  const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
});
  const handleUploadfile = async (e) => {
    
    var targetFiles = e.currentTarget.files;
    
    setSelectedFiles([])
    var x= []
    var sz = 0;
    for(let i = 0; i < targetFiles.length; i++){
      
      x.push({
        "name":targetFiles[i].name,
        "size":targetFiles[i].size,
        "file":await toBase64(targetFiles[i])
      })

      sz+= targetFiles[i].size;
    }
    setUploadSize(sz);
    setSelectedFiles(x)
    console.log(selectedFiles)
  }

    

  const handleRemoveFile = (value) => {
    // setFileName("");
    // setBase64Image("");
    // setFileSise(0);
    const filteredArray = selectedFiles.filter((item, index) => index !== value);
    setSelectedFiles([]);
    setSelectedFiles(filteredArray)
    var val = uploadSize - selectedFiles[value].size
    
    setUploadSize(val)
    
  };


  const submitHandler__ = async(value,resetForm) =>{
    // if (fileSize > 0){
    //   await submitHandler(value,resetForm);
    // }else{
    //   await submitDirectHandler(value,resetForm);
    // }
  }

  const submitDirectHandler = async (title,description) => {
    let body = {
      client_id: String(ids.client_id),
      user_id: String(ids.user_id),
      dpa_id: String(location?.state.dpaId ? location?.state.dpaId : data.id),
      doc_title: String(title),
      doc_content: String(btoa(description)),
    };
    setIsUploading(true)
    setCurrentlyUploading(0)
    const res = await postData("train_new_text", body);
    setIsUploading(false)
    if (res.result === "success") {
      toaster(true, title + ".txt Uploaded sucessfully" );
      navigate(-1);
    } else {
      toaster(false, res.result ? res.result : "Something went wrong");
    }
  };
  
  const UploadFiles = ()=>{
    let i = 0;
      var arr = [];
      selectedFiles.map(async(item,index_)=>{
        const body = {
          client_id: String(ids.client_id),
          user_id: String(ids.user_id),
          dpa_id: String(location?.state.dpaId ? location?.state.dpaId : data.id),
          filename: String(item.name),
          content: String(item.file).split(',')[1],
        };
        
        setIsUploading(true)
        const res = await postData("upload_new_document", body);
        setCurrentlyUploading(index_);
        arr.push(item)
        i ++
        if (res.result === "success") {
          toaster(true,  String(item.name) + " uploaded successfully.");
          // handleRemoveFile();
          
        } else {
          toaster(false, res.result ? res.result + " "+item.name: "Something went wrong");
        }
        if (arr.length === selectedFiles.length){
          setIsUploading(false)
          setSelectedFiles([])
          setUploadSize(0)
          setCurrentlyUploading(0);
          navigate(-1);
        }
      })
  }
  
  const AdminFileUpload =  ()=>{

    if (selectedFiles.length > 0 && title !== "" && description !== ""){
        UploadFiles()
        submitDirectHandler(title,description)
    }else if (selectedFiles.length > 0 && (title === "" && description === "")){
      UploadFiles()
    }else if (selectedFiles.length === 0 && (title !== "" && description !== "")){
      submitDirectHandler(title,description)
    }
  }

  return (
    <main className="container-fluid h-100">
      <div className="row mainInner h-100">
        <div
          className="col-12 px-0 flex-fill h-100"
          data-page-name="dpasetting"
        >
          <div className="container-fluid h-100">
            <div
              className={`row main h-100 menuIcon ${
                sideBar == "grid" ? "show" : ""
              }`}
            >
              <div className="col-auto px-0 leftPart h-100">
                <div className="row sideBar h-100">
                  <Sidebar sideBar={sideBar} setSidebarOpen={setSidebarOpen} />
                </div>
              </div>
              <div className="col px-0 rightPart rightBgInnerPart h-100">
                <div className="row mx-0 flex-column h-100 flex-nowrap px-3 ps-lg-0 pe-xxl-0">
                  <div className="col-12 px-0 mainContent overflow-hidden h-100 flex-fill">
                    <div className="row h-100 mx-0 dpasetting">
                      <div className="col-12 overflow-hidden-auto scrollPart h-100 px-0">
                        <div className="row mx-0 sticky-top stickyHeader">
                          <Header
                            setSidebarOpen={setSidebarOpen}
                            sideBar={sideBar}
                            textHeader={"Document Upload"}
                            textSubHeader={
                              " you can find all information you require here."
                            }
                          />
                        </div>
                        <div className="row py-3 dpaSettingInnerPage mx-0 bg-transparent">
                          <div className="col-12 pe-xxl-0">
                            <div className="row flex-column mx-0 d-md-none headerHiddenDetails mb-3">
                              <div className="col pageHeading px-0 fw-semibold">
                                Document Upload
                              </div>
                              <div className="col pageSubheading px-0">
                                welcome carmen, you can find all information you
                                require here.
                              </div>
                            </div>
                            <div className="row pe-xxl-4 pe-0 py-3 mx-0">
                              <div className="col-xxl-8 col-12 pb-3 pb-sm-0 realtionCard px-0">
                                <div className="mb-3">
                                  <button
                                    className="backBtn"
                                    onClick={() => window.history.back()}
                                  >
                                    <img
                                      src="assets/img/svg/leftarrow.svg"
                                      alt="image"
                                    />
                                    Back
                                  </button>
                                </div>
                                <div className="workplaceCard mb-xxl-0 mb-3">
                                  <div className="row mx-0 innerbody p-3 align-items-center">
                                    <div className="col-auto">
                                      <div
                                        className="workplacePoint rounded-circle"
                                        style={{
                                          backgroundColor: data?.dpa_color,
                                        }}
                                      ></div>
                                    </div>
                                    <div className="col workrelation fw-semibold px-0">
                                      {data?.dpa_name}
                                    </div>
                                    <div className="col-auto d-flex justify-content-end pe-0">
                                      <NavLink
                                            to="/dpa-settings"
                                            state={{
                                              item: data ? data : "",
                                              dpaID,
                                              trainedToken: tokenUsage
                                                ? tokenUsage
                                                : "",
                                            }}
                                            className="relationBarright text-dec"
                                          >
                                            <button  style={{fontFamily: "Poppins",
                                            fontStyle: "normal",
                                            fontWeight: "500",
                                            fontSize: "14px",
                                            lineHeight: "21px",
                                            letterSpacing: ".4px",
                                            color: "#fff",
                                            background: "#e7ebb8",
                                            borderRadius: "18px",
                                            border: "none",
                                            padding: "9px 25px",
                                            display: "flex",
                                            alignItems: "center",}}>
                                              <img
                                                src="assets/img/svg/settings.svg"
                                                alt="image"
                                              />
                                              Edit DPA Settings &amp; Users
                                            </button>
                                          </NavLink>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="col-xxl-4 col-12 ps-xxl-4 px-0">
                                <div className="trainedDataBox">
                                  <div className="row">
                                    <div className="col-12 d-flex justify-content-center">
                                      <div className="trainedDataBoxHead">
                                        <img
                                          src="assets/img/svg/traineddata.svg"
                                          alt=""
                                        />
                                        Trained Data
                                      </div>
                                    </div>
                                    <div className="col-12">
                                      <div className="row">
                                        <div className="col">
                                          <div className="progressBarTxt d-flex align-items-center">
                                            <div className="percent">{Math.round(Number(tokenUsage) / Number(tierInfo?.training_tokens) * 100)}%</div>
                                            <span>used</span>
                                          </div>
                                        </div>
                                        <div className="col-auto">
                                          <div className="progressBarTxt1">
                                          {CountConverter(tierInfo?.training_tokens)}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-12">
                                      <div className="progress-stacked progressBar">
                                        <div
                                          className="progress rounded-pill"
                                          role="progressbar"
                                          aria-label="Segment one"
                                          aria-valuenow={Math.round(Number(tokenUsage) / Number(tierInfo?.training_tokens) * 100)}
                                          aria-valuemin="0"
                                          aria-valuemax="100"
                                          style={{ width: Math.round(Number(tokenUsage) / Number(tierInfo?.training_tokens) * 100)+"%" }}
                                        >
                                          <div className="progress-bar progressBar1 rounded-pill"></div>
                                        </div>
                                        {/* <div
                                          className="progress rounded-pill"
                                          role="progressbar"
                                          aria-label="Segment two"
                                          aria-valuenow="33"
                                          aria-valuemin="0"
                                          aria-valuemax="100"
                                          style={{ width: "33%" }}
                                        > */}
                                          {/* <div className="progress-bar progressBar2 rounded-pill"></div> */}
                                        {/* </div> */}
                                      </div>
                                    </div>
                                    <div className="col-12 d-flex justify-content-center">
                                      <div className="progressBottomTxt">
                                        <span>{CountConverter(Number(tierInfo?.training_tokens) - Number(tokenUsage))} </span> remaining
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                                  
                                    
                                      <form>
                                        <div className="col-12 editSetting uploadFile px-0 mt-4">
                                          <div className="row mx-0">
                                            <div className="col-12 px-0 mt-2 mb-5 pb-md-5">
                                              <div className="row mx-0 editGroup">
                                                <div className="col-xxl-6 px-0 rightSide">
                                                  <div className="training mb-1  px-3">
                                                    File Upload
                                                  </div>
                                                  <div className="h-100 d-flex flex-column">
                                                    <div className="documentCard me-xxl-2 py-4 px-2 rounded-4 h-100">
                                                      <div className="row mx-0">
                                                        <div className="col-12">
                                                          <label
                                                            htmlFor="choose"
                                                            className="chooseFile w-100 h-100"
                                                          >
                                                            <div className="row mx-0 py-4">
                                                              <div className="col-12 text-center">
                                                                <div className="fileImg d-inline-flex justify-content-center align-items-center">
                                                                  <img
                                                                    src="assets/img/svg/feather_upload-cloud.svg"
                                                                    className="h-100"
                                                                    alt=""
                                                                  />
                                                                </div>
                                                              </div>
                                                              <div className="col-12 trainingSubContent my-3 text-black text-center">
                                                                Select a file or
                                                                drag and drop
                                                                here
                                                              </div>
                                                              <div className="col-12 trainingSubContent text-center">
                                                                PDF, docx or
                                                                xslx, file size
                                                                no more than
                                                                10MB
                                                              </div>
                                                              <div className="col-12 text-center mt-3">
                                                                <label
                                                                  type=""
                                                                  htmlFor="choose"
                                                                  className="btn selectFilrBtn d-inline-flex align-items-center justify-content-center"
                                                                >
                                                                  Select file
                                                                </label>
                                                              </div>
                                                            </div>
                                                          </label>
                                                          <input
                                                            type="file"
                                                            id="choose"
                                                            name="file"
                                                            accept=".pdf,.docx,.xlsx,.txt,"
                                                            onChange={(e) => {
                                                              handleUploadfile(
                                                                e
                                                              );
                                                            }}
                                                            className="form-control"
                                                            hidden
                                                            multiple
                                                          />
                                                        </div>
                                                      </div>
                                                    </div>

                                                    <div className="documentCard me-xxl-2 py-4 px-2 rounded-4 mt-3 h-100" style={{maxHeight:"200px",overflowY:"scroll"}}>
                                                      
                                                      {selectedFiles.length > 0 ? (
                                                        selectedFiles.map((item,index)=>{
                                                          return(
                                                            <div className="row mx-0" style={{margin:"2%"}}>
                                                          <div className="col-12">
                                                            <div className="uploadFileGroup align-items-center row mx-0  p-2 position-relative">
                                                              <div className="col-auto">
                                                                <div className="uploadFileImg">
                                                                  <img
                                                                    src="assets/img/svg/fileimg.svg"
                                                                    className="h-100"
                                                                    alt=""
                                                                  />
                                                                </div>
                                                              </div>
                                                              <div className="col px-0">
                                                                <div className="row mx-0 align-items-center">
                                                                  <div className="col trainingSubContent px-sm-2 px-0">
                                                                    {item.name}
                                                                  </div>
                                                                  <div className="col-auto fileSize">
                                                                    {FileSizeConverter(
                                                                      item.size
                                                                    )}
                                                                  </div>
                                                                  <div className="col-12 mt-2 px-sm-2 px-0">
                                                                    <Line
                                                                      percent={
                                                                        (item.size /
                                                                          1e6) *
                                                                        10
                                                                      }
                                                                      strokeWidth={
                                                                        1
                                                                      }
                                                                      trailWidth={
                                                                        1
                                                                      }
                                                                      strokeColor={
                                                                        "#4a5c77"
                                                                      }
                                                                    />
                                                                  </div>
                                                                </div>
                                                              </div>
                                                              <button
                                                                type="button"
                                                                onClick={() =>
                                                                  handleRemoveFile(index)
                                                                }
                                                                className="closeBtn btn rounded-circle d-flex justify-content-center align-items-center border-0"
                                                              >
                                                                <img
                                                                  src="assets/img/svg/close.svg"
                                                                  className=" h-100"
                                                                  alt=""
                                                                />
                                                              </button>
                                                            </div>
                                                          </div>
                                                        </div>
                                                          )
                                                        })) : (
                                                        <div className="col-12 d-flex align-items-center justify-content-center pt-md-2 pb-2 text-secondary noFile">
                                                          No files uploaded yet
                                                        </div>
                                                      )}
                                                    </div>
                                                  </div>
                                                </div>
                                                <div className="col-xxl-6 px-0 mt-xxl-0 mt-5">
                                                  <div className="training mb-1 px-3">
                                                    Text Training
                                                  </div>
                                                  <div className="h-100">
                                                    <div className="documentCard ms-xxl-2 py-3 px-2 rounded-4 h-100">
                                                      <div className="row mx-0">
                                                        <div className="col-12 trainingSubContent mb-3">
                                                          Train the DPA via
                                                          direct text input.
                                                          Useful htmlFor
                                                          e-mails.{" "}
                                                        </div>
                                                        <div className="col-12 inputGroup mb-xxl-4 mb-3">
                                                          <div className="input-group">
                                                            {/* <input
                                                            type="text"
                                                            id="exampleFormControlInput1"
                                                            className="form-control shadow-none"
                                                            placeholder="Document Title"
                                                            aria-label="Document Title"
                                                            aria-describedby="basic-addon1"
                                                          /> */}
                                                            <input
                                                              
                                                              value={title}
                                                              className="form-control shadow-none"
                                                              placeholder="Document Title"
                                                              aria-label="Document Title"
                                                              aria-describedby="basic-addon1"
                                                              onChange={(e)=>{setTitle(e.target.value)}}
                                                              id="documentTitle"
                                                            />
                                                          </div>
                                                        </div>
                                                        <div className="col-12 inputGroup">
                                                          <div className="input-group">
                                                            {/* <textarea
                                                            name=""
                                                            className="form-control shadow-none h-auto"
                                                            id=""
                                                            cols="30"
                                                            rows="10"
                                                            placeholder="Type in the information you want to train the DPA with here..."
                                                          ></textarea> */}
                                                            <input
                                                              type="textarea"
                                                              id="documentDescription"
                                                              value = {description}
                                                              className="form-control shadow-none h-auto"
                                                              placeholder="Type in the information you want to train the DPA with here..."
                                                              onChange={(e)=>{setDescription(e.target.value)}}
                                                              
                                                            />
                                                          </div>
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                            <div className="col-12 px-0 assignedUsersGroup mt-xxl-0 mt-4">
                                              <div className="row mx-0 align-items-center">
                                                <div className="col-xxl-7 mb-xxl-0 mb-4">
                                                  <div className="documentCard p-3 rounded">
                                                    <div className="row mx-0 text-center align-items-center gx-xxl-2 text-nowrap">
                                                      <div className="col-sm col-12">
                                                        <div className="balanceCount first fw-bold">
                                                          {CountConverter(Number(tierInfo?.training_tokens) - Number(tokenUsage))}
                                                        </div>
                                                        <div className="balanceContent">
                                                          Current Balance
                                                        </div>
                                                      </div>
                                                      <div className="col-sm col-12 fw-bold dash">
                                                        -
                                                      </div>
                                                      <div className="col-sm col-12">
                                                        <div className="balanceCount second fw-bold">
                                                        {CountConverter((Number(Number(tierInfo?.training_tokens) - Number(tokenUsage))) - (Number(Number(tierInfo?.training_tokens) - Number(tokenUsage)) - Number(uploadSize)))} 
                                                        </div>
                                                        <div className="balanceContent">
                                                          This upload
                                                        </div>
                                                      </div>
                                                      <div className="col-sm col-12 fw-bold dash">
                                                        =
                                                      </div>
                                                      <div className="col-sm col-12">
                                                        <div className="balanceCount thard fw-bold">
                                                        {uploadSize > 0 ? CountConverter(Number(Number(tierInfo?.training_tokens) - Number(tokenUsage)) - Number(uploadSize)) : "0"}
                                                       
                                                           </div>
                                                        <div className="balanceContent">
                                                          Post-Upload
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </div>
                                                </div>
                                                <div className="col-xxl-5 px-0 userAssign">
                                                  <div className="row mx-0">
                                                    <div className="col-12 btnGroup uploadBtnGroup px-0">
                                                      <div className="row mx-0 gy-3 justify-content-center">
                                                        <div className="col-auto">
                                                          <button
                                                            onClick={() =>
                                                              window.history.back()
                                                            }
                                                            type="reset"
                                                            className="btn cancleBtn d-flex align-items-center justify-content-center text-white"
                                                          >
                                                            Cancel
                                                          </button>
                                                        </div>
                                                        <div className="col-auto">
                                                          <button
                                                          onClick={()=>{AdminFileUpload()}}
                                                            type="button" 
                                                            disabled = {isUploading ? true : false}

                                                            className="btn saveChangeBtn opecity-50 border-0 d-flex align-items-center justify-content-center text-white"
                                                          >
                                                            <span className="d-flex">
                                                              <img
                                                                src="assets/img/svg/uploadfile.svg"
                                                                className="h-100"
                                                                alt=""
                                                              />
                                                            </span>{" "}
                                                            {isUploading ? (selectedFiles.length > 0 ? String(currentlyUploading)+" out of "+String(selectedFiles.length) : String(currentlyUploading) + " out of 1 ") + " uploaded" : "Upload"}
                                                          </button>
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </form>
                                    
                                  
                                
                              
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        type={"Deleting DPA"}
        modelOpen={modelOpen}
        setModelOpen={setModelOpen}
        hanldeFunction={handleDeleteDpa}
      />
    </main>
  );
};

export default UploadDocuments;
