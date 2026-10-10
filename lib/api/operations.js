import apiClient from "@/lib/apiClient";
const result = (r) => (Array.isArray(r.data) ? r.data : r.data.results);
const list = (p) => apiClient.get(p).then(result);
const create = (p, d) => apiClient.post(p, d).then((r) => r.data);
export const dashboard = () =>
  apiClient.get("operations/dashboard/").then((r) => r.data);
export const locations = () => list("operations/locations/");
export const createLocation = (d) => create("operations/locations/", d);
export const categories = () => list("operations/categories/");
export const createCategory = (d) => create("operations/categories/", d);
export const items = () => list("operations/items/");
export const createItem = (d) => create("operations/items/", d);
export const lots = () => list("operations/stock-lots/");
export const createLot = (d) => create("operations/stock-lots/", d);
export const stockTransaction = (d) =>
  create("operations/stock-transactions/", d);
export const vendors = () => list("operations/vendors/");
export const createVendor = (d) => create("operations/vendors/", d);
export const orders = () => list("operations/purchase-orders/");
export const createOrder = (d) => create("operations/purchase-orders/", d);
export const createOrderLine = (d) => create("operations/purchase-lines/", d);
export const orderAction = ({ id, action, data = {} }) =>
  apiClient
    .post(`operations/purchase-orders/${id}/${action}/`, data)
    .then((r) => r.data);
export const assets = () => list("operations/assets/");
export const createAsset = (d) => create("operations/assets/", d);
export const vehicles = () => list("operations/vehicles/");
export const createVehicle = (d) => create("operations/vehicles/", d);
export const routes = () => list("operations/routes/");
export const createRoute = (d) => create("operations/routes/", d);
export const mealPlans = () => list("operations/meal-plans/");
export const createMealPlan = (d) => create("operations/meal-plans/", d);
export const createMealIngredient = (d) =>
  create("operations/meal-ingredients/", d);
