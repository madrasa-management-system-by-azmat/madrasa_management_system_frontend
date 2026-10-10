"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as api from "@/lib/api/operations";
const keys = [
  "ops-dashboard",
  "ops-locations",
  "ops-categories",
  "ops-items",
  "ops-lots",
  "ops-vendors",
  "ops-orders",
  "ops-assets",
  "ops-vehicles",
  "ops-routes",
  "ops-meals",
];
function useOpsMutation(fn) {
  const c = useQueryClient();
  return useMutation({
    mutationFn: fn,
    onSuccess: () =>
      keys.forEach((k) => c.invalidateQueries({ queryKey: [k] })),
  });
}
function useOpsQuery(key, fn) {
  return useQuery({ queryKey: [key], queryFn: fn });
}
export const useOpsDashboard = () =>
  useOpsQuery("ops-dashboard", api.dashboard);
export const useLocations = () => useOpsQuery("ops-locations", api.locations);
export const useCategories = () =>
  useOpsQuery("ops-categories", api.categories);
export const useItems = () => useOpsQuery("ops-items", api.items);
export const useLots = () => useOpsQuery("ops-lots", api.lots);
export const useVendors = () => useOpsQuery("ops-vendors", api.vendors);
export const useOrders = () => useOpsQuery("ops-orders", api.orders);
export const useAssets = () => useOpsQuery("ops-assets", api.assets);
export const useVehicles = () => useOpsQuery("ops-vehicles", api.vehicles);
export const useRoutes = () => useOpsQuery("ops-routes", api.routes);
export const useMealPlans = () => useOpsQuery("ops-meals", api.mealPlans);
export const useCreateLocation = () => useOpsMutation(api.createLocation);
export const useCreateCategory = () => useOpsMutation(api.createCategory);
export const useCreateItem = () => useOpsMutation(api.createItem);
export const useCreateLot = () => useOpsMutation(api.createLot);
export const useStockTransaction = () => useOpsMutation(api.stockTransaction);
export const useCreateVendor = () => useOpsMutation(api.createVendor);
export const useCreateOrder = () => useOpsMutation(api.createOrder);
export const useCreateOrderLine = () => useOpsMutation(api.createOrderLine);
export const useOrderAction = () => useOpsMutation(api.orderAction);
export const useCreateAsset = () => useOpsMutation(api.createAsset);
export const useCreateVehicle = () => useOpsMutation(api.createVehicle);
export const useCreateRoute = () => useOpsMutation(api.createRoute);
export const useCreateMealPlan = () => useOpsMutation(api.createMealPlan);
export const useCreateMealIngredient = () =>
  useOpsMutation(api.createMealIngredient);
