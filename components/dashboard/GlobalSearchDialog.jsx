"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthContext } from "@/context/AuthContext";
import { useGlobalSearch } from "@/hooks/useGlobalSearch";
import {
  getDashboardNavigation,
  moduleSubmenus,
} from "@/lib/dashboardNavigation";

export default function GlobalSearchDialog({ open, onOpenChange }) {
  const router = useRouter();
  const { user, isSuperAdmin } = useAuthContext();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const inputRef = useRef(null);
  const remote = useGlobalSearch(query, open && !isSuperAdmin);
  const localGroups = useMemo(() => {
    const term = query.trim().toLocaleLowerCase("ur");
    const navigation = getDashboardNavigation(user, isSuperAdmin);
    const pages = [];
    navigation.forEach((item) => {
      if (
        !term ||
        `${item.label} ${item.description}`
          .toLocaleLowerCase("ur")
          .includes(term)
      )
        pages.push({
          id: `page-${item.href}`,
          title: item.label,
          subtitle: item.description,
          href: item.href,
        });
      const menuKey = item.href?.split("/").pop();
      const submenu = moduleSubmenus[menuKey];
      submenu?.items?.forEach((child) => {
        if (
          !term ||
          `${child.label} ${child.description}`
            .toLocaleLowerCase("ur")
            .includes(term)
        )
          pages.push({
            id: `page-${child.href}`,
            title: child.label,
            subtitle: child.description,
            href: child.href,
          });
      });
    });
    return pages.length
      ? [
          {
            key: "pages",
            label: "صفحات اور کارروائیاں",
            items: pages.slice(0, 6),
          },
        ]
      : [];
  }, [query, user, isSuperAdmin]);
  const groups = [...localGroups, ...(remote.data?.groups || [])];
  const flattened = groups.flatMap((group) =>
    group.items.map((item) => ({ ...item, group: group.key })),
  );

  useEffect(() => {
    if (open) {
      const timer = window.setTimeout(() => inputRef.current?.focus(), 50);
      return () => window.clearTimeout(timer);
    }
  }, [open]);

  function changeQuery(event) {
    setQuery(event.target.value);
    setSelected(0);
  }

  function changeOpen(nextOpen) {
    if (!nextOpen) {
      setQuery("");
      setSelected(0);
    }
    onOpenChange(nextOpen);
  }

  function choose(item) {
    changeOpen(false);
    router.push(item.href);
  }
  function keyDown(event) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setSelected((value) => Math.min(value + 1, flattened.length - 1));
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setSelected((value) => Math.max(value - 1, 0));
    }
    if (event.key === "Enter" && flattened[selected]) {
      event.preventDefault();
      choose(flattened[selected]);
    }
  }

  let runningIndex = -1;
  return (
    <Dialog open={open} onOpenChange={changeOpen}>
      <DialogContent dir="rtl" className="max-w-2xl overflow-hidden p-0">
        <DialogTitle className="sr-only">عالمی تلاش</DialogTitle>
        <div className="flex items-center gap-3 border-b border-border px-4">
          <Search className="size-5 text-muted-foreground" />
          <input
            ref={inputRef}
            value={query}
            onChange={changeQuery}
            onKeyDown={keyDown}
            placeholder="طلبہ، اساتذہ، اسناد یا صفحات تلاش کریں"
            className="h-14 min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground"
            aria-label="عالمی تلاش"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() =>
              query ? changeQuery({ target: { value: "" } }) : changeOpen(false)
            }
            aria-label="صاف یا بند کریں"
          >
            <X />
          </Button>
        </div>
        <div
          className="max-h-[65vh] overflow-y-auto p-2"
          role="listbox"
          aria-live="polite"
        >
          {groups.map((group) => (
            <section key={group.key} className="mb-2">
              <h3 className="px-3 py-2 text-xs font-bold text-muted-foreground">
                {group.label}
              </h3>
              {group.items.map((item) => {
                runningIndex += 1;
                const index = runningIndex;
                return (
                  <button
                    type="button"
                    key={`${group.key}-${item.id}`}
                    role="option"
                    aria-selected={selected === index}
                    onMouseEnter={() => setSelected(index)}
                    onClick={() => choose(item)}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-right hover:bg-muted aria-selected:bg-primary/10"
                  >
                    <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-muted text-primary">
                      <Search className="size-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <strong className="block truncate text-sm">
                        {item.title}
                      </strong>
                      <small className="block truncate text-muted-foreground">
                        {item.subtitle}
                      </small>
                    </span>
                    {item.status && (
                      <span className="rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground">
                        {item.status}
                      </span>
                    )}
                    <ArrowLeft className="size-4 text-muted-foreground" />
                  </button>
                );
              })}
            </section>
          ))}
          {remote.isFetching && query.trim().length >= 2 && (
            <div className="space-y-2 p-2">
              {[1, 2, 3].map((x) => (
                <div key={x} className="flex gap-3">
                  <Skeleton className="size-9" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-3 w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          )}
          {query.trim().length < 2 && !localGroups.length && (
            <p className="p-8 text-center text-sm text-muted-foreground">
              کم از کم دو حروف لکھ کر ریکارڈ تلاش کریں۔
            </p>
          )}
          {query.trim().length >= 2 &&
            !remote.isFetching &&
            !flattened.length && (
              <p className="p-8 text-center text-sm text-muted-foreground">
                “{query}” کے مطابق کوئی نتیجہ نہیں ملا۔
              </p>
            )}
          {remote.isError && (
            <p className="m-2 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
              تلاش مکمل نہیں ہو سکی۔ دوبارہ کوشش کریں۔
            </p>
          )}
        </div>
        <footer className="flex justify-between border-t border-border px-4 py-2 text-xs text-muted-foreground">
          <span>↑ ↓ انتخاب · Enter کھولیں</span>
          <span>Esc بند کریں</span>
        </footer>
      </DialogContent>
    </Dialog>
  );
}
