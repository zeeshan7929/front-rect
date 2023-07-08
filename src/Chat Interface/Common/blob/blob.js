import React, { useState } from "react";
export const useImageToBase64 = () => {
  const [base64Image, setBase64Image] = useState("");

  const convertToBase64 = (file) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const base64 = btoa(e.target.result);
      setBase64Image(base64);
    };

    reader.readAsBinaryString(file);
  };

  return { base64Image, convertToBase64 ,setBase64Image};
};
