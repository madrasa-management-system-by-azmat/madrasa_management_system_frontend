"use client";
import { useState } from "react";
import {
  Box,
  BusFront,
  CookingPot,
  PackageCheck,
  Plus,
  ShoppingCart,
  Warehouse,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useAssets,
  useCategories,
  useCreateAsset,
  useCreateCategory,
  useCreateItem,
  useCreateLocation,
  useCreateMealPlan,
  useCreateOrder,
  useCreateVendor,
  useCreateVehicle,
  useItems,
  useLocations,
  useMealPlans,
  useOpsDashboard,
  useOrderAction,
  useOrders,
  useVehicles,
  useVendors,
} from "@/hooks/useOperations";
import { getApiErrorMessage, toast } from "@/lib/toast";
const cls =
  "h-10 w-full rounded-lg border border-input bg-background px-3 text-right";
const today = () => new Date().toISOString().slice(0, 10);
function Form({ type, open, onOpenChange, data, mutations }) {
  async function submit(e) {
    e.preventDefault();
    const v = Object.fromEntries(new FormData(e.currentTarget));
    let d = v,
      m = mutations[type];
    if (type === "item")
      d = {
        ...v,
        category: Number(v.category),
        reorder_level: Number(v.reorder_level),
      };
    if (type === "order")
      d = {
        vendor: Number(v.vendor),
        location: Number(v.location),
        order_date: v.order_date,
      };
    if (type === "asset")
      d = {
        ...v,
        location: Number(v.location),
        acquisition_cost: Number(v.acquisition_cost),
        useful_life_months: Number(v.useful_life_months),
      };
    if (type === "vehicle") d = { ...v, capacity: Number(v.capacity) };
    if (type === "meal")
      d = {
        ...v,
        planned_servings: Number(v.planned_servings),
        actual_servings: 0,
      };
    try {
      await m.mutateAsync(d);
      toast.success("ریکارڈ محفوظ ہو گیا");
      onOpenChange(false);
    } catch (err) {
      toast.error("عمل مکمل نہیں ہو سکا", getApiErrorMessage(err));
    }
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent dir="rtl">
        <DialogHeader>
          <DialogTitle>نیا ریکارڈ</DialogTitle>
        </DialogHeader>
        <form onSubmit={submit}>
          <div className="grid gap-4 p-5">
            {type === "location" && (
              <>
                <input
                  name="name"
                  required
                  placeholder="مقام"
                  className={cls}
                />
                <input name="code" required placeholder="کوڈ" className={cls} />
                <select name="location_type" className={cls}>
                  <option value="store">اسٹور</option>
                  <option value="kitchen">کچن</option>
                  <option value="hostel">ہاسٹل</option>
                  <option value="workshop">ورکشاپ</option>
                </select>
              </>
            )}
            {type === "category" && (
              <>
                <input
                  name="name"
                  required
                  placeholder="زمرہ"
                  className={cls}
                />
                <input name="code" required placeholder="کوڈ" className={cls} />
              </>
            )}
            {type === "item" && (
              <>
                <input
                  name="name"
                  required
                  placeholder="آئٹم"
                  className={cls}
                />
                <input name="sku" required placeholder="SKU" className={cls} />
                <select name="category" required className={cls}>
                  {data.categories.map((x) => (
                    <option key={x.id} value={x.id}>
                      {x.name}
                    </option>
                  ))}
                </select>
                <select name="item_type" className={cls}>
                  <option value="consumable">استعمالی</option>
                  <option value="durable">پائیدار</option>
                  <option value="capital_asset">اثاثہ</option>
                  <option value="fuel">ایندھن</option>
                  <option value="ingredient">راشن</option>
                </select>
                <input name="unit" defaultValue="unit" className={cls} />
                <input
                  name="reorder_level"
                  type="number"
                  defaultValue="0"
                  className={cls}
                />
              </>
            )}
            {type === "vendor" && (
              <>
                <input
                  name="name"
                  required
                  placeholder="سپلائر"
                  className={cls}
                />
                <input name="phone" placeholder="فون" className={cls} />
                <textarea
                  name="address"
                  className="min-h-20 rounded-lg border p-3"
                />
              </>
            )}
            {type === "order" && (
              <>
                <select name="vendor" required className={cls}>
                  {data.vendors.map((x) => (
                    <option key={x.id} value={x.id}>
                      {x.name}
                    </option>
                  ))}
                </select>
                <select name="location" required className={cls}>
                  {data.locations.map((x) => (
                    <option key={x.id} value={x.id}>
                      {x.name}
                    </option>
                  ))}
                </select>
                <input
                  name="order_date"
                  type="date"
                  defaultValue={today()}
                  className={cls}
                />
              </>
            )}
            {type === "asset" && (
              <>
                <input
                  name="asset_number"
                  required
                  placeholder="اثاثہ نمبر"
                  className={cls}
                />
                <input name="name" required placeholder="نام" className={cls} />
                <input
                  name="category"
                  required
                  placeholder="زمرہ"
                  className={cls}
                />
                <select name="location" required className={cls}>
                  {data.locations.map((x) => (
                    <option key={x.id} value={x.id}>
                      {x.name}
                    </option>
                  ))}
                </select>
                <input
                  name="acquisition_date"
                  type="date"
                  defaultValue={today()}
                  className={cls}
                />
                <input
                  name="acquisition_cost"
                  type="number"
                  defaultValue="0"
                  className={cls}
                />
                <input
                  name="useful_life_months"
                  type="number"
                  defaultValue="60"
                  className={cls}
                />
              </>
            )}
            {type === "vehicle" && (
              <>
                <input
                  name="registration_number"
                  required
                  placeholder="رجسٹریشن"
                  className={cls}
                />
                <input
                  name="name"
                  required
                  placeholder="گاڑی نام"
                  className={cls}
                />
                <input
                  name="vehicle_type"
                  required
                  placeholder="قسم"
                  className={cls}
                />
                <input
                  name="capacity"
                  type="number"
                  defaultValue="20"
                  className={cls}
                />
              </>
            )}
            {type === "meal" && (
              <>
                <input
                  name="date"
                  type="date"
                  defaultValue={today()}
                  className={cls}
                />
                <select name="meal_type" className={cls}>
                  <option value="breakfast">ناشتہ</option>
                  <option value="lunch">دوپہر</option>
                  <option value="dinner">رات</option>
                </select>
                <input
                  name="menu"
                  required
                  placeholder="مینو"
                  className={cls}
                />
                <input
                  name="planned_servings"
                  type="number"
                  defaultValue="0"
                  className={cls}
                />
              </>
            )}
          </div>
          <DialogFooter>
            <Button type="submit">محفوظ کریں</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
export default function OperationsManagementPage() {
  const [dialog, setDialog] = useState(null);
  const { data: d, isLoading } = useOpsDashboard();
  const { data: locations = [] } = useLocations();
  const { data: categories = [] } = useCategories();
  const { data: items = [] } = useItems();
  const { data: vendors = [] } = useVendors();
  const { data: orders = [] } = useOrders();
  const { data: assets = [] } = useAssets();
  const { data: vehicles = [] } = useVehicles();
  const { data: meals = [] } = useMealPlans();
  const mutations = {
    location: useCreateLocation(),
    category: useCreateCategory(),
    item: useCreateItem(),
    vendor: useCreateVendor(),
    order: useCreateOrder(),
    asset: useCreateAsset(),
    vehicle: useCreateVehicle(),
    meal: useCreateMealPlan(),
  };
  const orderAction = useOrderAction();
  if (isLoading) return <Skeleton className="h-150" />;
  return (
    <div className="space-y-7">
      <header>
        <p className="text-primary">عملی انتظام</p>
        <h1 className="text-3xl font-bold">
          اسٹور، اثاثہ، خریداری، ٹرانسپورٹ اور کچن
        </h1>
      </header>
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <article className="rounded-2xl border p-5">
          <Warehouse />
          <p>آئٹمز</p>
          <strong className="text-3xl">{d?.items || 0}</strong>
        </article>
        <article className="rounded-2xl border p-5">
          <PackageCheck />
          <p>کم اسٹاک</p>
          <strong className="text-3xl">{d?.low_stock || 0}</strong>
        </article>
        <article className="rounded-2xl border p-5">
          <Box />
          <p>اثاثے</p>
          <strong className="text-3xl">{d?.assets || 0}</strong>
        </article>
        <article className="rounded-2xl border p-5">
          <BusFront />
          <p>گاڑیاں</p>
          <strong className="text-3xl">{d?.vehicles || 0}</strong>
        </article>
      </section>
      <Tabs defaultValue="store">
        <TabsList className="flex-wrap">
          <TabsTrigger value="store">اسٹور</TabsTrigger>
          <TabsTrigger value="purchases">خریداری</TabsTrigger>
          <TabsTrigger value="assets">اثاثے</TabsTrigger>
          <TabsTrigger value="transport">ٹرانسپورٹ</TabsTrigger>
          <TabsTrigger value="kitchen">کچن</TabsTrigger>
        </TabsList>
        <TabsContent value="store">
          <div className="mb-3 flex gap-2">
            <Button variant="outline" onClick={() => setDialog("location")}>
              <Plus />
              مقام
            </Button>
            <Button variant="outline" onClick={() => setDialog("category")}>
              <Plus />
              زمرہ
            </Button>
            <Button onClick={() => setDialog("item")}>
              <Plus />
              آئٹم
            </Button>
          </div>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {items.map((x) => (
              <article key={x.id} className="rounded-xl border p-4">
                <strong>{x.name}</strong>
                <p>
                  {x.sku} · {x.category_name}
                </p>
                <p>
                  اسٹاک: {x.stock} {x.unit}
                </p>
              </article>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="purchases">
          <div className="mb-3 flex gap-2">
            <Button variant="outline" onClick={() => setDialog("vendor")}>
              <Plus />
              سپلائر
            </Button>
            <Button onClick={() => setDialog("order")}>
              <ShoppingCart />
              آرڈر
            </Button>
          </div>
          {orders.map((o) => (
            <article key={o.id} className="mb-3 rounded-xl border p-4">
              <strong>
                {o.order_number} — {o.vendor_name}
              </strong>
              <p>
                {o.status} · {o.total}
              </p>
              <div className="mt-2 flex gap-2">
                {o.status === "draft" && (
                  <Button
                    size="sm"
                    onClick={() =>
                      orderAction.mutate({ id: o.id, action: "submit" })
                    }
                  >
                    جمع
                  </Button>
                )}
                {o.status === "submitted" && (
                  <Button
                    size="sm"
                    onClick={() =>
                      orderAction.mutate({ id: o.id, action: "approve" })
                    }
                  >
                    منظور
                  </Button>
                )}
                {["approved", "part_received"].includes(o.status) && (
                  <Button
                    size="sm"
                    onClick={() =>
                      orderAction.mutate({ id: o.id, action: "receive" })
                    }
                  >
                    وصول
                  </Button>
                )}
              </div>
            </article>
          ))}
        </TabsContent>
        <TabsContent value="assets">
          <Button className="mb-3" onClick={() => setDialog("asset")}>
            <Plus />
            اثاثہ
          </Button>
          <div className="grid gap-3 md:grid-cols-2">
            {assets.map((a) => (
              <article key={a.id} className="rounded-xl border p-4">
                <strong>
                  {a.asset_number} — {a.name}
                </strong>
                <p>
                  {a.category} · {a.location_name} · {a.status}
                </p>
              </article>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="transport">
          <Button className="mb-3" onClick={() => setDialog("vehicle")}>
            <Plus />
            گاڑی
          </Button>
          <div className="grid gap-3 md:grid-cols-2">
            {vehicles.map((v) => (
              <article key={v.id} className="rounded-xl border p-4">
                <strong>
                  {v.registration_number} — {v.name}
                </strong>
                <p>
                  {v.vehicle_type} · گنجائش {v.capacity} · {v.status}
                </p>
              </article>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="kitchen">
          <Button className="mb-3" onClick={() => setDialog("meal")}>
            <CookingPot />
            مینو
          </Button>
          <div className="grid gap-3 md:grid-cols-2">
            {meals.map((m) => (
              <article key={m.id} className="rounded-xl border p-4">
                <strong>
                  {m.date} — {m.meal_type}
                </strong>
                <p>{m.menu}</p>
                <p>{m.planned_servings} افراد</p>
              </article>
            ))}
          </div>
        </TabsContent>
      </Tabs>
      <Form
        type={dialog}
        open={Boolean(dialog)}
        onOpenChange={(o) => !o && setDialog(null)}
        data={{ locations, categories, vendors }}
        mutations={mutations}
      />
    </div>
  );
}
