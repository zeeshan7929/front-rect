import { CSVLink } from "react-csv";

export const Export = ({ data }) => {
  return (
    <CSVLink className="text-dec" style={{ color: "#464255" }} data={data}>
      Export
    </CSVLink>
  );
};
