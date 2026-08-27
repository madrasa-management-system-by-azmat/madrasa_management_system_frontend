export const getFinanceYearlyReport = (year) =>
  apiClient
    .get("finance-yearly-report/", { params: { year } })
    .then((response) => response.data);
import apiClient from "@/lib/apiClient";

function getResults(response) {
  return Array.isArray(response.data) ? response.data : response.data.results;
}
function create(path, data) {
  return apiClient.post(path, data).then((response) => response.data);
}
function update(path, id, data) {
  return apiClient
    .patch(`${path}${id}/`, data)
    .then((response) => response.data);
}
function remove(path, id) {
  return apiClient.delete(`${path}${id}/`);
}

export const getStudentFeeLogs = () =>
  apiClient.get("student-fee-logs/").then(getResults);
export const createStudentFeeLog = (data) => create("student-fee-logs/", data);
export const updateStudentFeeLog = (id, data) =>
  update("student-fee-logs/", id, data);
export const deleteStudentFeeLog = (id) => remove("student-fee-logs/", id);

export const getMonthlyFees = ({ month, academicClass, search } = {}) =>
  apiClient
    .get("monthly-fees/", {
      params: {
        ...(month ? { month } : {}),
        ...(academicClass ? { academic_class: academicClass } : {}),
        ...(search ? { search } : {}),
      },
    })
    .then(getResults);
export const generateMonthlyFees = (data) =>
  apiClient
    .post("monthly-fees/generate/", data)
    .then((response) => response.data);
export const createMonthlyFeePayment = (id, data) =>
  apiClient
    .post(`monthly-fees/${id}/payment/`, data)
    .then((response) => response.data);
export const getFinanceLedger = () =>
  apiClient.get("finance-ledger/").then((response) => response.data);
export const getFunds = () => apiClient.get("funds/").then(getResults);
export const createFund = (data) => create("funds/", data);
export const getDonors = () => apiClient.get("donors/").then(getResults);
export const createDonor = (data) => create("donors/", data);
export const createDonation = (data) => create("donations/", data);
export const createExpense = (data) => create("expenses/", data);
export const getFeePaymentHistory = ({ month, academicClass, search } = {}) =>
  apiClient
    .get("fee-payment-history/", {
      params: {
        ...(month ? { month } : {}),
        ...(academicClass ? { academic_class: academicClass } : {}),
        ...(search ? { search } : {}),
      },
    })
    .then(getResults);

export const getTeacherSalaries = () =>
  apiClient.get("teacher-salaries/").then(getResults);
export const createTeacherSalary = (data) => create("teacher-salaries/", data);
export const updateTeacherSalary = (id, data) =>
  update("teacher-salaries/", id, data);
export const deleteTeacherSalary = (id) => remove("teacher-salaries/", id);
