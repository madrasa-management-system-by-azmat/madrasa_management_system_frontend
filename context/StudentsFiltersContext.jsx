"use client";

import { createContext, useContext, useMemo, useState } from "react";

const StudentsFiltersContext = createContext(undefined);

export function StudentsFiltersProvider({ children }) {
  const [filters, setFilters] = useState({ search: "", status: "all", currentClass: "", currentClassName: "" });

  const value = useMemo(() => ({ filters, setFilters }), [filters]);
  return <StudentsFiltersContext.Provider value={value}>{children}</StudentsFiltersContext.Provider>;
}

export function useStudentsFilters() {
  const context = useContext(StudentsFiltersContext);

  if (!context) throw new Error("useStudentsFilters must be used inside StudentsFiltersProvider.");
  return context;
}
