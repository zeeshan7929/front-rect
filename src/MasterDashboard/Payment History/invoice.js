import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    padding: 30,
  },
  table: {
    display: "table",
    width: "auto",
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    alignItems: "center",
  },
  cell: {
    width: "33.33%",
    fontSize: "16px",
    padding: 10,
  },
  cell1: {
    width: "33.33%",
    fontSize: "12px",
    padding: 10,
  },
  cell2: {
    marginLeft: "10px",
    width: "33.33%",
    fontSize: "12px",
    padding: 10,
  },
});

// Create Document Component
export const MyDocument = ({ row }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.table}>
        <View style={styles.row}>
          <Text style={styles.cell}>Date</Text>
          <Text style={styles.cell}>Order</Text>
          <Text style={styles.cell}>Company</Text>
          <Text style={styles.cell}>Tier</Text>
          <Text style={styles.cell}>Amount</Text>
          <Text style={styles.cell}>Status</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cell1}>{row?.date_time}</Text>
          <Text style={styles.cell1}>{row?.order}</Text>
          <Text style={styles.cell1}>{row?.company}</Text>
          <Text style={styles.cell2}>{row?.description}</Text>
          <Text style={styles.cell1}>{row?.amount}</Text>
          <Text style={styles.cell1}>{row?.status}</Text>
        </View>
      </View>
    </Page>
  </Document>
);
