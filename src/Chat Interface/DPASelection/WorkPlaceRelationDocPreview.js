import React, { useCallback, useEffect, useRef, useState } from "react";
import Sidebar from "../Common/Sidebar/Sidebar";
import { postData } from "../../clientDashboard/Common/fetchservices";
import { useLocation, useSearchParams } from "react-router-dom";
import Header from "../Common/Header/Header";
import { Document, Font, PDFViewer, Page, Text } from "@react-pdf/renderer";
import DocViewer,{DocViewerRenderers} from "@cyntler/react-doc-viewer";
import { CustomErrorComponent } from "custom-error"
import FileViewer from 'react-file-viewer';


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
  
function WorkPlaceRelationDocPreview({ sideBar, setSidebarOpen }) {
  const location = useLocation();
  let item = location?.state?.item;
  let ids = JSON.parse(localStorage.getItem("a_login"));

  const [searchParams] = useSearchParams();
  const [docUri,setDocUri] = useState("");
  const [fileInfo, setFileinfo] = useState({
    uri: "",
    filename: "",
  });
  const [isLoading, setLoading] = useState(true);
  const getUploadedDocs = async (e) => {
    setLoading(true);
    try {
      const body = {
        doc_id: searchParams.get("id"),
      };
      const responce = await postData("u_get_file_content", body);
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

  const onError = (e) => {
    console.log(e);
  };
  useEffect(() => {
    Font.register({
      family: "Roboto",
      fonts: [
        {
          src: "https://fonts.googleapis.com/css2?family=Roboto:wght@500&display=swap",
        },
        {
          src: "https://fonts.googleapis.com/css2?family=Roboto:wght@500&display=swap",
          fontWeight: "normal",
        },
        {
          src: "https://fonts.googleapis.com/css2?family=Roboto:wght@500&display=swap",
          fontWeight: "normal",
          fontStyle: "italic",
        },
      ],
    });

    getUploadedDocs();
  }, []);

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
                <div className="row mx-0 flex-column flex-nowrap overflow-hidden">

                  <Header
                    title={fileInfo.filename}
                    setSidebarOpen={setSidebarOpen}
                  />
                </div>

                <div className="col-12 align-items-center ps--4a px-4 py-3">
                  {
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
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default WorkPlaceRelationDocPreview;
