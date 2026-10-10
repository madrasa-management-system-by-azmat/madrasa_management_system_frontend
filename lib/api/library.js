import apiClient from "@/lib/apiClient";

const results = (response) =>
  Array.isArray(response.data) ? response.data : response.data.results;
const list = (path, params = {}) =>
  apiClient.get(path, { params }).then(results);
const create = (path, data) =>
  apiClient.post(path, data).then((response) => response.data);

export const getLibraryDashboard = () =>
  apiClient.get("library/dashboard/").then((response) => response.data);
export const getLibraryCategories = () => list("library/categories/");
export const createLibraryCategory = (data) =>
  create("library/categories/", data);
export const getLibraryShelves = () => list("library/shelves/");
export const createLibraryShelf = (data) => create("library/shelves/", data);
export const getLibraryBooks = (params = {}) => list("library/books/", params);
export const createLibraryBook = (data) => create("library/books/", data);
export const getLibraryCopies = (params = {}) =>
  list("library/copies/", params);
export const createLibraryCopy = (data) => create("library/copies/", data);
export const getLibraryMembers = (params = {}) =>
  list("library/members/", params);
export const createLibraryMember = (data) => create("library/members/", data);
export const getLibraryPeopleLookup = () =>
  apiClient
    .get("library/members/people_lookup/")
    .then((response) => response.data);
export const getLibraryLoans = (params = {}) => list("library/loans/", params);
export const createLibraryLoan = (data) => create("library/loans/", data);
export const returnLibraryLoan = ({ id, data }) =>
  apiClient
    .post(`library/loans/${id}/return_book/`, data)
    .then((response) => response.data);
export const renewLibraryLoan = (id) =>
  apiClient
    .post(`library/loans/${id}/renew/`)
    .then((response) => response.data);
export const markLibraryLoanLost = ({ id, amount }) =>
  apiClient
    .post(`library/loans/${id}/mark_lost/`, { amount })
    .then((response) => response.data);
export const getLibraryFines = () => list("library/fines/");
export const payLibraryFine = ({ id, receipt_number }) =>
  apiClient
    .post(`library/fines/${id}/pay/`, { receipt_number })
    .then((response) => response.data);
export const waiveLibraryFine = ({ id, notes }) =>
  apiClient
    .post(`library/fines/${id}/waive/`, { notes })
    .then((response) => response.data);
export const getLibraryReservations = () => list("library/reservations/");
export const createLibraryReservation = (data) =>
  create("library/reservations/", data);
