import apiClient from "@/lib/apiClient";

export const getReportCatalogue = () =>
  apiClient.get("reports/catalogue/").then((response) => response.data);

export const generateReport = ({ key, params }) =>
  apiClient
    .get(`reports/${key}/`, { params })
    .then((response) => response.data);
