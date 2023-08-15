import React, { useCallback, useEffect, useRef, useState } from "react";
import Sidebar from "../../Common/Sidebar/Sidebar";
import { postData } from "../../Common/fetchservices";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

import { Document, Font, PDFViewer, Page, Text } from "@react-pdf/renderer";
import DocViewer,{DocViewerRenderers} from "@cyntler/react-doc-viewer";
import { CustomErrorComponent } from "custom-error"
import FileViewer from 'react-file-viewer';
import Header from "../../Common/Header/Header";

const b64toBlob = (b64Data, contentType='', sliceSize=512) => {
  const byteCharacters = atob(b64Data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  const blob = new Blob(byteArrays, {type: contentType});
  return blob;
};
const types = {
  //   File Extension   MIME Type
    'abs':           'audio/x-mpeg',
    'ai':            'application/postscript',
    'aif':           'audio/x-aiff',
    'aifc':          'audio/x-aiff',
    'aiff':          'audio/x-aiff',
    'aim':           'application/x-aim',
    'art':           'image/x-jg',
    'asf':           'video/x-ms-asf',
    'asx':           'video/x-ms-asf',
    'au':            'audio/basic',
    'avi':           'video/x-msvideo',
    'avx':           'video/x-rad-screenplay',
    'bcpio':         'application/x-bcpio',
    'bin':           'application/octet-stream',
    'bmp':           'image/bmp',
    'body':          'text/html',
    'cdf':           'application/x-cdf',
    'cer':           'application/pkix-cert',
    'class':         'application/java',
    'cpio':          'application/x-cpio',
    'csh':           'application/x-csh',
    'css':           'text/css',
    'dib':           'image/bmp',
    'doc':           'application/msword',
    'dtd':           'application/xml-dtd',
    'dv':            'video/x-dv',
    'dvi':           'application/x-dvi',
    'eot':           'application/vnd.ms-fontobject',
    'eps':           'application/postscript',
    'etx':           'text/x-setext',
    'exe':           'application/octet-stream',
    'gif':           'image/gif',
    'gtar':          'application/x-gtar',
    'gz':            'application/x-gzip',
    'hdf':           'application/x-hdf',
    'hqx':           'application/mac-binhex40',
    'htc':           'text/x-component',
    'htm':           'text/html',
    'html':          'text/html',
    'ief':           'image/ief',
    'jad':           'text/vnd.sun.j2me.app-descriptor',
    'jar':           'application/java-archive',
    'java':          'text/x-java-source',
    'jnlp':          'application/x-java-jnlp-file',
    'jpe':           'image/jpeg',
    'jpeg':          'image/jpeg',
    'jpg':           'image/jpeg',
    'js':            'application/javascript',
    'jsf':           'text/plain',
    'json':          'application/json',
    'jspf':          'text/plain',
    'kar':           'audio/midi',
    'latex':         'application/x-latex',
    'm3u':           'audio/x-mpegurl',
    'mac':           'image/x-macpaint',
    'man':           'text/troff',
    'mathml':        'application/mathml+xml',
    'me':            'text/troff',
    'mid':           'audio/midi',
    'midi':          'audio/midi',
    'mif':           'application/x-mif',
    'mov':           'video/quicktime',
    'movie':         'video/x-sgi-movie',
    'mp1':           'audio/mpeg',
    'mp2':           'audio/mpeg',
    'mp3':           'audio/mpeg',
    'mp4':           'video/mp4',
    'mpa':           'audio/mpeg',
    'mpe':           'video/mpeg',
    'mpeg':          'video/mpeg',
    'mpega':         'audio/x-mpeg',
    'mpg':           'video/mpeg',
    'mpv2':          'video/mpeg2',
    'ms':            'application/x-wais-source',
    'nc':            'application/x-netcdf',
    'oda':           'application/oda',
    'odb':           'application/vnd.oasis.opendocument.database',
    'odc':           'application/vnd.oasis.opendocument.chart',
    'odf':           'application/vnd.oasis.opendocument.formula',
    'odg':           'application/vnd.oasis.opendocument.graphics',
    'odi':           'application/vnd.oasis.opendocument.image',
    'odm':           'application/vnd.oasis.opendocument.text-master',
    'odp':           'application/vnd.oasis.opendocument.presentation',
    'ods':           'application/vnd.oasis.opendocument.spreadsheet',
    'odt':           'application/vnd.oasis.opendocument.text',
    'otg':           'application/vnd.oasis.opendocument.graphics-template',
    'oth':           'application/vnd.oasis.opendocument.text-web',
    'otp':           'application/vnd.oasis.opendocument.presentation-template',
    'ots':           'application/vnd.oasis.opendocument.spreadsheet-template',
    'ott':           'application/vnd.oasis.opendocument.text-template',
    'ogx':           'application/ogg',
    'ogv':           'video/ogg',
    'oga':           'audio/ogg',
    'ogg':           'audio/ogg',
    'otf':           'application/x-font-opentype',
    'spx':           'audio/ogg',
    'flac':          'audio/flac',
    'anx':           'application/annodex',
    'axa':           'audio/annodex',
    'axv':           'video/annodex',
    'xspf':          'application/xspf+xml',
    'pbm':           'image/x-portable-bitmap',
    'pct':           'image/pict',
    'pdf':           'application/pdf',
    'pgm':           'image/x-portable-graymap',
    'pic':           'image/pict',
    'pict':          'image/pict',
    'pls':           'audio/x-scpls',
    'png':           'image/png',
    'pnm':           'image/x-portable-anymap',
    'pnt':           'image/x-macpaint',
    'ppm':           'image/x-portable-pixmap',
    'ppt':           'application/vnd.ms-powerpoint',
    'pps':           'application/vnd.ms-powerpoint',
    'ps':            'application/postscript',
    'psd':           'image/vnd.adobe.photoshop',
    'qt':            'video/quicktime',
    'qti':           'image/x-quicktime',
    'qtif':          'image/x-quicktime',
    'ras':           'image/x-cmu-raster',
    'rdf':           'application/rdf+xml',
    'rgb':           'image/x-rgb',
    'rm':            'application/vnd.rn-realmedia',
    'roff':          'text/troff',
    'rtf':           'application/rtf',
    'rtx':           'text/richtext',
    'sfnt':          'application/font-sfnt',
    'sh':            'application/x-sh',
    'shar':          'application/x-shar',
    'sit':           'application/x-stuffit',
    'snd':           'audio/basic',
    'src':           'application/x-wais-source',
    'sv4cpio':       'application/x-sv4cpio',
    'sv4crc':        'application/x-sv4crc',
    'svg':           'image/svg+xml',
    'svgz':          'image/svg+xml',
    'swf':           'application/x-shockwave-flash',
    't':             'text/troff',
    'tar':           'application/x-tar',
    'docx':          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'xlsx':           'application/msword',
    'xls':            'application/msword',
    'doc':           'application/msword',
    'tcl':           'application/x-tcl',
    'tex':           'application/x-tex',
    'texi':          'application/x-texinfo',
    'texinfo':       'application/x-texinfo',
    'tif':           'image/tiff',
    'tiff':          'image/tiff',
    'tr':            'text/troff',
    'tsv':           'text/tab-separated-values',
    'ttf':           'application/x-font-ttf',
    'txt':           'text/plain',
    'ulw':           'audio/basic',
    'ustar':         'application/x-ustar',
    'vxml':          'application/voicexml+xml',
    'xbm':           'image/x-xbitmap',
    'xht':           'application/xhtml+xml',
    'xhtml':         'application/xhtml+xml',
    'xls':           'application/vnd.ms-excel',
    'xml':           'application/xml',
    'xpm':           'image/x-xpixmap',
    'xsl':           'application/xml',
    'xslt':          'application/xslt+xml',
    'xul':           'application/vnd.mozilla.xul+xml',
    'xwd':           'image/x-xwindowdump',
    'vsd':           'application/vnd.visio',
    'wav':           'audio/x-wav',
    'wbmp':          'image/vnd.wap.wbmp',
    'wml':           'text/vnd.wap.wml',
    'wmlc':          'application/vnd.wap.wmlc',
    'wmls':          'text/vnd.wap.wmlsc',
    'wmlscriptc':    'application/vnd.wap.wmlscriptc',
    'wmv':           'video/x-ms-wmv',
    'woff':          'application/font-woff',
    'woff2':         'application/font-woff2',
    'wrl':           'model/vrml',
    'wspolicy':      'application/wspolicy+xml',
    'z':             'application/x-compress',
    'zip':           'application/zip'
  };


export const DocumentViewer = ({ sideBar, setSidebarOpen }) => {
  const location = useLocation();
  let dpaInfo = location.state.data;
  console.log(location)
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [fileName, setFileName] = useState("");
  const [dpaNAme, setDpaName] = useState("");
  const [fileInfo, setFileinfo] = useState({
    uri: "",
    filename: "",
  });
  const [isLoading, setLoading] = useState(true);
  

  

  const getUploadedDocs = async (e) => {
    setLoading(true);
    try {
      const body = {
        document_id: String(location.state.docId),
      };
      const responce = await postData("get_file_content", body);
      const blob = b64toBlob(responce.result.content,types[String(responce.result.filename.split('.')[1]).toLowerCase()])
      const uri = URL.createObjectURL(blob);
      
      setFileinfo({
        uri:uri,
        fileType:responce.result.filename.split('.')[1],
        filename: responce.result.filename,
      });

      
      console.log("URI",uri)
    } catch (er) {
      console.error(er);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
   

    getUploadedDocs();
  }, []);
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
                  <Sidebar setSidebarOpen={setSidebarOpen} sideBar={sideBar} />
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
                            textHeader={"Document Viewer"}
                            textSubHeader={
                              " you can find all information you require here."
                            }
                          />
                        </div>
                        <div className="row py-3 dpaSettingInnerPage mx-0 bg-transparent">
                          <div className="col-12 pe-xxl-0">
                            <div className="row pe-xxl-4 pe-0 py-3 mx-0">
                              <div className="col-12 pb-3 pb-sm-0 realtionCard px-0">
                                <div className="mb-3 d-flex align-items-center">
                                  <button
                                    type="button"
                                    onClick={()=>{navigate(-1)}}
                                    className="dpadeleteBtn backBtn btn rounded-pill text-white d-flex align-items-center gap-3 border-0 fw-medium"
                                  >
                                    <img
                                      src="assets/img/svg/arrow-left.svg"
                                      className="w-100"
                                      alt
                                    />
                                    Back
                                  </button>
                                </div>
                                <div className="col-12 editSetting uploadFile px-0 pt-1">
                                  <div className="row mx-0">
                                    <div className="col-12 px-0 TableCointainer align-items-center justify-content-beetween  mt-1">
                                      <div className="col-12 row mx-0 align-items-center">
                                        <div className="col-12 my-s4">
                                          <div className="d-flex align-items-center justify-content-between pt-pb-3  ">
                                            <div className="col-8 workplaceCard mb-xxl-0 mb-">
                                              <div className="row mx-0 innerbody  p-2 align-items-center">
                                                <div className="col-auto">
                                                  <div
                                                    className="workplacePoint rounded-circle"
                                                    style={{
                                                      backgroundColor:
                                                        dpaInfo.dpa_color,
                                                    }}
                                                  />
                                                </div>
                                                <div className="col fs-6 workrelation fw-semibold px-0">
                                                  {dpaInfo.dpa_name}
                                                </div>
                                              </div>
                                            </div>
                                            <div className="col-auto searchgroup mt-4 h-25">
                                              <div className="input-group h-25">
                                                <input
                                                  type="search"
                                                  className="form-control w-50  shadow-none fw-normal border-0 rounded-pill rounded-end-0 bg-white px-3 pe-0"
                                                  placeholder="Search document"
                                                  aria-label="Username"
                                                  aria-describedby="basic-addon1"
                                                />
                                                <button
                                                  type="button"
                                                  className="input-group-text border-0 rounded-pill rounded-start-0 bg-white py-0 ps-0"
                                                  id="basic-addon1"
                                                >
                                                  <img
                                                    src="assets/img/svg/032-search.svg"
                                                    alt
                                                  />
                                                </button>
                                              </div>
                                            </div>
                                          </div>
                                          <div className="col-12 align-items-center ps--4a px-4 py-3">
                                          <div className="rw">
                      {!isLoading && fileInfo.uri &&  (
                        
                        (fileInfo.filename.split('.')[1].toLowerCase() === "docx" ) ?
                        (
                          <FileViewer
                            fileType={fileInfo.filename.split('.')[1]}
                            filePath={fileInfo.uri}
                            errorComponent={CustomErrorComponent}
                            style={{
                              maxHeight: 'calc(100vh - 70px)',
                              width: "100%",
                              padding:"2%"
                            }}
                            />
                        
                        ) : (
                          <DocViewer
                        pluginRenderers={DocViewerRenderers}
                        config={{
                          header: {
                            disableHeader: false,
                            disableFileName: false,
                            retainURLParams: false,
                          },
                        }}

                        disableThemeScrollbar={"disabled"}
                          style={{
                            maxHeight: 'calc(100vh - 70px)',
                            width: "100%",
                            padding:"2%"
                          }}
                          
                          documents={[
                            {
                              uri: fileInfo.uri,
                              fileType: fileInfo.fileType,
                              fileName:fileInfo.filename
                            },
                            
                          ]}
                          
                        />
                        )
                        
                      )}
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
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
