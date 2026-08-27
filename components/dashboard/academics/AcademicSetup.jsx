"use client";

import { useState } from "react";
import {
  Building2,
  Pencil,
  Plus,
  School,
  Trash2,
  UsersRound,
} from "lucide-react";

import AcademicReferenceDialog from "@/components/dashboard/academics/AcademicReferenceDialog";
import AcademicReferenceTable from "@/components/dashboard/academics/AcademicReferenceTable";
import AcademicSetupHeader from "@/components/dashboard/academics/AcademicSetupHeader";
import DeleteAcademicReferenceDialog from "@/components/dashboard/academics/DeleteAcademicReferenceDialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useAcademicClasses,
  useCreateAcademicClass,
  useCreateDepartment,
  useCreateHalaqa,
  useDeleteAcademicClass,
  useDeleteDepartment,
  useDeleteHalaqa,
  useDepartments,
  useHalaqas,
  useUpdateAcademicClass,
  useUpdateDepartment,
  useUpdateHalaqa,
} from "@/hooks/useAcademics";
import { getApiErrorMessage, toast } from "@/lib/toast";

const text = {
  action: "\u0627\u06A9\u0634\u0646",
  add: "\u0634\u0627\u0645\u0644 \u06A9\u0631\u06CC\u06BA",
  addClass:
    "\u062C\u0645\u0627\u0639\u062A \u0634\u0627\u0645\u0644 \u06A9\u0631\u06CC\u06BA",
  addDepartment:
    "\u0634\u0639\u0628\u06C1 \u0634\u0627\u0645\u0644 \u06A9\u0631\u06CC\u06BA",
  addHalaqa:
    "\u062D\u0644\u0642\u06C1 \u0634\u0627\u0645\u0644 \u06A9\u0631\u06CC\u06BA",
  cancel: "\u0645\u0646\u0633\u0648\u062E",
  class: "\u062C\u0645\u0627\u0639\u062A",
  classDescription:
    "\u062C\u0645\u0627\u0639\u062A \u06A9\u0648 \u06A9\u0633\u06CC \u0627\u06CC\u06A9 \u0634\u0639\u0628\u06D2 \u06A9\u06D2 \u0633\u0627\u062A\u06BE \u0645\u0646\u0633\u0644\u06A9 \u06A9\u0631\u06CC\u06BA\u06D4",
  className: "\u062C\u0645\u0627\u0639\u062A \u06A9\u0627 \u0646\u0627\u0645",
  classPlaceholder:
    "\u0645\u062B\u0644\u0627\u064B \u062D\u0641\u0638 \u0627\u0648\u0644",
  classRecords:
    "\u0645\u0648\u062C\u0648\u062F\u06C1 \u062C\u0645\u0627\u0639\u062A\u06CC\u06BA",
  createSuccess:
    "\u06A9\u0627\u0645\u06CC\u0627\u0628\u06CC \u0633\u06D2 \u0634\u0627\u0645\u0644 \u06C1\u0648 \u06AF\u06CC\u0627 \u06C1\u06D2\u06D4",
  delete: "\u062D\u0630\u0641 \u06A9\u0631\u06CC\u06BA",
  deleteClass:
    "\u062C\u0645\u0627\u0639\u062A \u062D\u0630\u0641 \u06A9\u0631\u06CC\u06BA",
  deleteDepartment:
    "\u0634\u0639\u0628\u06C1 \u062D\u0630\u0641 \u06A9\u0631\u06CC\u06BA",
  deleteDescription:
    "\u06A9\u06CC\u0627 \u0622\u067E \u06CC\u0642\u06CC\u0646\u0627\u064B \u0627\u0633 \u0631\u06CC\u06A9\u0627\u0631\u0688 \u06A9\u0648 \u062D\u0630\u0641 \u06A9\u0631\u0646\u0627 \u0686\u0627\u06C1\u062A\u06D2 \u06C1\u06CC\u06BA\u061F \u0627\u0633 \u0639\u0645\u0644 \u06A9\u0648 \u0648\u0627\u067E\u0633 \u0646\u06C1\u06CC\u06BA \u0644\u06CC\u0627 \u062C\u0627 \u0633\u06A9\u062A\u0627\u06D4",
  deleteHalaqa:
    "\u062D\u0644\u0642\u06C1 \u062D\u0630\u0641 \u06A9\u0631\u06CC\u06BA",
  deleteSuccess:
    "\u06A9\u0627\u0645\u06CC\u0627\u0628\u06CC \u0633\u06D2 \u062D\u0630\u0641 \u06C1\u0648 \u06AF\u06CC\u0627 \u06C1\u06D2\u06D4",
  department: "\u0634\u0639\u0628\u06C1",
  departmentDescription:
    "\u0637\u0644\u0628\u06C1 \u06A9\u0648 \u0634\u0639\u0628\u06D2 \u06A9\u06D2 \u0645\u0637\u0627\u0628\u0642 \u062F\u0631\u062C \u06A9\u0631\u0646\u06D2 \u06A9\u06D2 \u0644\u06CC\u06D2 \u0627\u0633\u06D2 \u0628\u0646\u0627\u0626\u06CC\u06BA\u06D4",
  departmentName: "\u0634\u0639\u0628\u06D2 \u06A9\u0627 \u0646\u0627\u0645",
  departmentPlaceholder:
    "\u0645\u062B\u0644\u0627\u064B \u0634\u0639\u0628\u06C1 \u062D\u0641\u0638",
  departmentRecords:
    "\u0645\u0648\u062C\u0648\u062F\u06C1 \u0634\u0639\u0628\u06D2",
  departmentSelect:
    "\u0634\u0639\u0628\u06C1 \u0645\u0646\u062A\u062E\u0628 \u06A9\u0631\u06CC\u06BA",
  edit: "\u062A\u0631\u0645\u06CC\u0645 \u06A9\u0631\u06CC\u06BA",
  editClass:
    "\u062C\u0645\u0627\u0639\u062A \u0645\u06CC\u06BA \u062A\u0631\u0645\u06CC\u0645",
  editDepartment:
    "\u0634\u0639\u0628\u06D2 \u0645\u06CC\u06BA \u062A\u0631\u0645\u06CC\u0645",
  editHalaqa:
    "\u062D\u0644\u0642\u06D2 \u0645\u06CC\u06BA \u062A\u0631\u0645\u06CC\u0645",
  operationFailed:
    "\u0639\u0645\u0644 \u0645\u06A9\u0645\u0644 \u0646\u06C1\u06CC\u06BA \u06C1\u0648 \u0633\u06A9\u0627\u06D4",
  firstDepartment:
    "\u067E\u06C1\u0644\u06D2 \u06A9\u0645 \u0627\u0632 \u06A9\u0645 \u0627\u06CC\u06A9 \u0634\u0639\u0628\u06C1 \u0634\u0627\u0645\u0644 \u06A9\u0631\u06CC\u06BA\u06D4",
  halaqa: "\u062D\u0644\u0642\u06C1",
  halaqaDescription:
    "\u062D\u0644\u0642\u06D2 \u06A9\u06D2 \u0633\u0627\u062A\u06BE \u0645\u062A\u0639\u0644\u0642\u06C1 \u0627\u0633\u062A\u0627\u062F \u06A9\u0627 \u0646\u0627\u0645 \u0628\u06BE\u06CC \u062F\u0631\u062C \u06A9\u0631 \u0633\u06A9\u062A\u06D2 \u06C1\u06CC\u06BA\u06D4",
  halaqaName: "\u062D\u0644\u0642\u06D2 \u06A9\u0627 \u0646\u0627\u0645",
  halaqaPlaceholder:
    "\u0645\u062B\u0644\u0627\u064B \u062D\u0644\u0642\u06C1 \u0646\u0648\u0631",
  halaqaRecords:
    "\u0645\u0648\u062C\u0648\u062F\u06C1 \u062D\u0644\u0642\u06D2",
  records: "\u0631\u06CC\u06A9\u0627\u0631\u0688",
  save: "\u0645\u062D\u0641\u0648\u0638 \u06A9\u0631\u06CC\u06BA",
  teacher:
    "\u0645\u062A\u0639\u0644\u0642\u06C1 \u0627\u0633\u062A\u0627\u062F",
  teacherName:
    "\u0645\u062A\u0639\u0644\u0642\u06C1 \u0627\u0633\u062A\u0627\u062F \u06A9\u0627 \u0646\u0627\u0645",
  teacherPlaceholder:
    "\u0645\u062B\u0644\u0627\u064B \u0642\u0627\u0631\u06CC \u0645\u062D\u0645\u062F \u0627\u062D\u0645\u062F",
  teacherUnassigned:
    "\u0627\u0633\u062A\u0627\u062F \u0645\u0646\u0633\u0644\u06A9 \u0646\u06C1\u06CC\u06BA \u06C1\u06D2",
  updateSuccess:
    "\u06A9\u0627\u0645\u06CC\u0627\u0628\u06CC \u0633\u06D2 \u062A\u0631\u0645\u06CC\u0645 \u06C1\u0648 \u06AF\u0626\u06CC \u06C1\u06D2\u06D4",
};

function RecordsCard({ title, count, onAdd, addDisabled, children }) {
  return (
    <section className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-4">
        <div>
          <h2 className="font-bold">{title}</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            {text.records}: {count}
          </p>
        </div>
        <Button type="button" size="sm" onClick={onAdd} disabled={addDisabled}>
          <Plus aria-hidden="true" />
          {text.add}
        </Button>
      </div>
      {children}
    </section>
  );
}

function RowActions({ onEdit, onDelete }) {
  return (
    <div className="flex items-center justify-end gap-1">
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label={text.edit}
        onClick={onEdit}
      >
        <Pencil aria-hidden="true" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
        aria-label={text.delete}
        onClick={onDelete}
      >
        <Trash2 aria-hidden="true" />
      </Button>
    </div>
  );
}

export default function AcademicSetup() {
  const [dialogState, setDialogState] = useState({ kind: null, record: null });
  const [deleteState, setDeleteState] = useState({ kind: null, record: null });
  const { data: departments = [], isLoading: isLoadingDepartments } =
    useDepartments();
  const { data: academicClasses = [], isLoading: isLoadingClasses } =
    useAcademicClasses();
  const { data: halaqas = [], isLoading: isLoadingHalaqas } = useHalaqas();
  const createDepartment = useCreateDepartment();
  const createAcademicClass = useCreateAcademicClass();
  const createHalaqa = useCreateHalaqa();
  const updateDepartment = useUpdateDepartment();
  const updateAcademicClass = useUpdateAcademicClass();
  const updateHalaqa = useUpdateHalaqa();
  const deleteDepartment = useDeleteDepartment();
  const deleteAcademicClass = useDeleteAcademicClass();
  const deleteHalaqa = useDeleteHalaqa();
  const departmentOptions = departments.map((department) => ({
    value: department.id,
    label: department.name,
  }));
  const isEditing = Boolean(dialogState.record);
  const createMutations = {
    department: createDepartment,
    class: createAcademicClass,
    halaqa: createHalaqa,
  };
  const updateMutations = {
    department: updateDepartment,
    class: updateAcademicClass,
    halaqa: updateHalaqa,
  };
  const deleteMutations = {
    department: deleteDepartment,
    class: deleteAcademicClass,
    halaqa: deleteHalaqa,
  };
  const activeSaveMutation = dialogState.kind
    ? isEditing
      ? updateMutations[dialogState.kind]
      : createMutations[dialogState.kind]
    : null;
  const activeDeleteMutation = deleteState.kind
    ? deleteMutations[deleteState.kind]
    : null;

  const dialogConfig = {
    department: {
      title: isEditing ? text.editDepartment : text.addDepartment,
      description: text.departmentDescription,
      fields: [
        {
          name: "name",
          label: text.departmentName,
          placeholder: text.departmentPlaceholder,
          required: true,
        },
      ],
    },
    class: {
      title: isEditing ? text.editClass : text.addClass,
      description: text.classDescription,
      fields: [
        {
          name: "name",
          label: text.className,
          placeholder: text.classPlaceholder,
          required: true,
        },
        {
          name: "department",
          label: text.departmentName,
          placeholder: text.departmentSelect,
          required: true,
          type: "select",
          options: departmentOptions,
        },
        {
          name: "tuition_fee",
          label: "ماہانہ ٹیوشن فیس (روپے)",
          type: "number",
          min: 0,
          step: "0.01",
          required: true,
        },
        {
          name: "hostel_fee",
          label: "ماہانہ ہاسٹل فیس (روپے)",
          type: "number",
          min: 0,
          step: "0.01",
          required: true,
        },
      ],
    },
    halaqa: {
      title: isEditing ? text.editHalaqa : text.addHalaqa,
      description: text.halaqaDescription,
      fields: [
        {
          name: "name",
          label: text.halaqaName,
          placeholder: text.halaqaPlaceholder,
          required: true,
        },
        {
          name: "ustad_name",
          label: text.teacherName,
          placeholder: text.teacherPlaceholder,
        },
      ],
    },
  }[dialogState.kind];

  function openAdd(kind) {
    setDialogState({ kind, record: null });
  }
  function openEdit(kind, record) {
    setDialogState({ kind, record });
  }
  function openDelete(kind, record) {
    setDeleteState({ kind, record });
  }

  async function saveRecord(values) {
    const data =
      dialogState.kind === "class"
        ? {
            ...values,
            department: Number(values.department),
            tuition_fee: Number(values.tuition_fee),
            hostel_fee: Number(values.hostel_fee),
          }
        : values;
    const resourceName = {
      department: text.department,
      class: text.class,
      halaqa: text.halaqa,
    }[dialogState.kind];

    try {
      const result = dialogState.record
        ? await updateMutations[dialogState.kind].mutateAsync({
            id: dialogState.record.id,
            data,
          })
        : await createMutations[dialogState.kind].mutateAsync(data);
      toast.success(
        resourceName,
        dialogState.record ? text.updateSuccess : text.createSuccess,
      );
      return result;
    } catch (error) {
      toast.error(
        text.operationFailed,
        getApiErrorMessage(error, text.operationFailed),
      );
      throw error;
    }
  }

  async function deleteRecord() {
    const resourceName = {
      department: text.department,
      class: text.class,
      halaqa: text.halaqa,
    }[deleteState.kind];

    try {
      const result = await deleteMutations[deleteState.kind].mutateAsync(
        deleteState.record.id,
      );
      toast.success(resourceName, text.deleteSuccess);
      return result;
    } catch (error) {
      toast.error(
        text.operationFailed,
        getApiErrorMessage(error, text.operationFailed),
      );
      throw error;
    }
  }

  const actionColumn = (kind) => ({
    key: "actions",
    label: text.action,
    render: (record) => (
      <RowActions
        onEdit={() => openEdit(kind, record)}
        onDelete={() => openDelete(kind, record)}
      />
    ),
  });

  return (
    <div className="space-y-6 lg:space-y-8">
      <AcademicSetupHeader />
      <Tabs defaultValue="department">
        <TabsList className="sm:w-fit">
          <TabsTrigger value="department">
            <Building2 className="size-4" aria-hidden="true" />
            {text.department}
            <span className="rounded-full bg-background/70 px-1.5 text-xs text-muted-foreground">
              {departments.length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="class">
            <School className="size-4" aria-hidden="true" />
            {text.class}
            <span className="rounded-full bg-background/70 px-1.5 text-xs text-muted-foreground">
              {academicClasses.length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="halaqa">
            <UsersRound className="size-4" aria-hidden="true" />
            {text.halaqa}
            <span className="rounded-full bg-background/70 px-1.5 text-xs text-muted-foreground">
              {halaqas.length}
            </span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="department">
          <RecordsCard
            title={text.departmentRecords}
            count={departments.length}
            onAdd={() => openAdd("department")}
          >
            <AcademicReferenceTable
              items={departments}
              isLoading={isLoadingDepartments}
              columns={[
                {
                  key: "name",
                  label: text.departmentName,
                  render: (department) => (
                    <span className="font-medium">{department.name}</span>
                  ),
                },
                actionColumn("department"),
              ]}
            />
          </RecordsCard>
        </TabsContent>
        <TabsContent value="class">
          <RecordsCard
            title={text.classRecords}
            count={academicClasses.length}
            onAdd={() => openAdd("class")}
            addDisabled={isLoadingDepartments || departments.length === 0}
          >
            <AcademicReferenceTable
              items={academicClasses}
              isLoading={isLoadingClasses}
              columns={[
                {
                  key: "name",
                  label: text.className,
                  render: (academicClass) => (
                    <span className="font-medium">{academicClass.name}</span>
                  ),
                },
                {
                  key: "department",
                  label: text.departmentName,
                  render: (academicClass) => (
                    <span className="text-muted-foreground">
                      {academicClass.department_name}
                    </span>
                  ),
                },
                {
                  key: "tuition_fee",
                  label: "ٹیوشن",
                  render: (academicClass) => (
                    <span dir="ltr">{academicClass.tuition_fee}</span>
                  ),
                },
                {
                  key: "hostel_fee",
                  label: "ہاسٹل",
                  render: (academicClass) => (
                    <span dir="ltr">{academicClass.hostel_fee}</span>
                  ),
                },
                actionColumn("class"),
              ]}
            />
          </RecordsCard>
          {departments.length === 0 && !isLoadingDepartments && (
            <p className="mt-3 text-sm text-muted-foreground">
              {text.firstDepartment}
            </p>
          )}
        </TabsContent>
        <TabsContent value="halaqa">
          <RecordsCard
            title={text.halaqaRecords}
            count={halaqas.length}
            onAdd={() => openAdd("halaqa")}
          >
            <AcademicReferenceTable
              items={halaqas}
              isLoading={isLoadingHalaqas}
              columns={[
                {
                  key: "name",
                  label: text.halaqaName,
                  render: (halaqa) => (
                    <span className="font-medium">{halaqa.name}</span>
                  ),
                },
                {
                  key: "teacher",
                  label: text.teacher,
                  render: (halaqa) => (
                    <span className="text-muted-foreground">
                      {halaqa.ustad_name || text.teacherUnassigned}
                    </span>
                  ),
                },
                actionColumn("halaqa"),
              ]}
            />
          </RecordsCard>
        </TabsContent>
      </Tabs>

      {dialogConfig && (
        <AcademicReferenceDialog
          open={Boolean(dialogState.kind)}
          onOpenChange={(open) =>
            !open && setDialogState({ kind: null, record: null })
          }
          record={dialogState.record}
          title={dialogConfig.title}
          description={dialogConfig.description}
          fields={dialogConfig.fields}
          submitLabel={text.save}
          cancelLabel={text.cancel}
          isPending={activeSaveMutation?.isPending}
          error={activeSaveMutation?.isError ? activeSaveMutation.error : null}
          onSubmit={saveRecord}
        />
      )}
      {deleteState.record && (
        <DeleteAcademicReferenceDialog
          open={Boolean(deleteState.kind)}
          onOpenChange={(open) =>
            !open && setDeleteState({ kind: null, record: null })
          }
          recordName={deleteState.record.name}
          title={
            deleteState.kind === "department"
              ? text.deleteDepartment
              : deleteState.kind === "class"
                ? text.deleteClass
                : text.deleteHalaqa
          }
          description={text.deleteDescription}
          cancelLabel={text.cancel}
          deleteLabel={text.delete}
          isPending={activeDeleteMutation?.isPending}
          error={
            activeDeleteMutation?.isError ? activeDeleteMutation.error : null
          }
          onDelete={deleteRecord}
        />
      )}
    </div>
  );
}
