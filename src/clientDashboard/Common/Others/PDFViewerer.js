import React from "react";
// import { Document, Page } from "react-pdf";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFViewer,
  Font,
  Image,
} from "@react-pdf/renderer";

export const PDFViewerer = () => {
  Font.register({
    family: "Poppins",
    format: "truetype",
    // src: font,
  });
  Font.register({
    family: "Poppins-600",
    format: "truetype",
    // src: font2,
  });
  const styles = StyleSheet.create({
    page: {
      backgroundColor: "#ffffff",
      color: "black",

      fontFamily: "Poppins",
    },
    viewer: {
      width: "50%", //the pdf viewer will take up all of the width and height
      height: window.innerHeight - 100,
    },
    d_flex: {
      display: "flex",
      flexDirection: "row",
    },
    line: {
      height: "1px",
      opacity: "0.25",
      backgroundColor: "#474d52",
    },
    row: {
      display: "flex",
      flexDirection: "row",
      // borderTop: '1px solid #EEE',
      paddingTop: 4,
      paddingBottom: 4,
    },
    row1: {
      width: "5%",
    },
    row2: {
      width: "50%",
    },
    row3: {
      width: "15%",
    },
    row4: {
      width: "15%",
    },
    row5: {
      width: "15%",
    },
    row50: {
      width: "50%",
    },
    fontNormal: {
      fontSize: "12px",
      fontFamily: "Poppins",
      color: "#474d52",
    },
    fontNormalWithSmallFont: {
      fontSize: "10px",
      fontFamily: "Poppins",
      color: "#474d52",
    },
    fontNormalBoldWithSmallFont: {
      fontSize: "10px",
      fontFamily: "Poppins-600",
      color: "#474d52",
    },
    fontNormalBold: {
      fontSize: "12px",
      fontFamily: "Poppins-600",
      color: "#474d52",
    },
    box: {
      border: "1px solid #cdcfd1",
      borderRadius: "5px",
    },
    upperLine: {
      borderTop: "1px solid #cdcfd1",
    },
    bg_color: {
      backgroundColor: "rgba(0, 0, 0, 0.05)",
    },
    padding_all_side: {
      padding: "6px 8px 6px 8px",
    },
    tax_padding_all_side: {
      padding: "6px 8px 6px 8px",
    },
  });
  return (
    <div>
      <PDFViewer
        showToolbar={true}
        style={{
          height: window.innerHeight,
          marginVertical: "2%",
          width: "100%",
        }}
      >
        <Document>
          <Page size={"A4"} style={{ padding: "15px" }}>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                marginTop: "30px",
              }}
            >
              <View
                style={{
                  width: "30%",
                  paddingLeft: "10px 0 0 10px",
                }}
              >
                <Image
                  src="assets/img/document-profile.png"
                  style={{
                    width: "130px",
                    height: "140px",
                  }}
                ></Image>
              </View>
              <View style={{ width: "70%" }}>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    padding: "0px 0 0 0",
                  }}
                >
                  <Text
                    style={{
                      color: "#1d7a9b",
                      //   fontFamily:
                      //     "Roboto",
                      fontWeight: 800,
                      fontSize: "24px",
                    }}
                  >
                    BOSOLA
                  </Text>
                  <Text
                    style={{
                      marginLeft: "10px",
                      color: "#a9a9a9",
                      fontSize: "23px",
                      fontWeight: 200,
                    }}
                  >
                    RONAK
                  </Text>
                </View>
                <Text
                  style={{
                    fontSize: "10px",
                    margin: "5px 0 10px 0",
                    fontWeight: 600,
                    color: "#1d7a9b",
                  }}
                >
                  Product Designer
                </Text>
                <Text style={styles.line}></Text>

                {/* links start */}

                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    width: "100%",
                    padding: "10px 0 10px 0",
                  }}
                >
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      width: "50%",
                      marginRight: "50px",
                    }}
                  >
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center ",
                      }}
                    >
                      <Image
                        style={{
                          height: "30px",
                          width: "30px",
                        }}
                        src={"assets/img/logo1.png"}
                      ></Image>
                      <Text
                        style={{
                          textAlign: "left",
                          fontSize: "10px",
                          marginTop: "8x",
                          marginLeft: "5px",
                        }}
                      >
                        twitter.com/ronkebosola
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      width: "50%",
                    }}
                  >
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <Image
                        style={{
                          height: "30px",
                          width: "30px",
                        }}
                        src={"assets/img/logo1.png"}
                      ></Image>
                      <Text
                        style={{
                          textAlign: "left",
                          fontSize: "10px",
                          marginLeft: "5px",
                        }}
                      >
                        https://ronkebosola.coms
                      </Text>
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    width: "100%",
                    padding: "0px 0 0px 0",
                  }}
                >
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      width: "50%",
                      marginRight: "50px",
                    }}
                  >
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center ",
                      }}
                    >
                      <Image
                        style={{
                          height: "",
                          width: "30px",
                        }}
                        src={"assets/img/logo1.png"}
                      ></Image>
                      <Text
                        style={{
                          textAlign: "left",
                          fontSize: "10px",
                          marginTop: "8x",
                          marginLeft: "5px",
                        }}
                      >
                        twitter.com/ronkebosola
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      width: "50%",
                    }}
                  >
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <Image
                        style={{
                          height: "",
                          width: "30px",
                        }}
                        src={"assets/img/logo1.png"}
                      ></Image>
                      <Text
                        style={{
                          textAlign: "left",
                          fontSize: "10px",
                          marginLeft: "5px",
                        }}
                      >
                        https://ronkebosola.coms
                      </Text>
                    </View>
                  </View>
                </View>
                <Text style={styles.line}></Text>
              </View>
            </View>
          </Page>
        </Document>
      </PDFViewer>
    </div>
  );
};
