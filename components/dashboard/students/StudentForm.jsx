"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ImageUp, Plus, Save, UserRound, X } from "lucide-react";

import StudentFormSection from "@/components/dashboard/students/StudentFormSection";
import { Button } from "@/components/ui/button";
import {
  useAcademicClasses,
  useDepartments,
  useHalaqas,
} from "@/hooks/useAcademics";
import { useCreateStudent, useUpdateStudent } from "@/hooks/useStudents";
import { getApiErrorMessage, toast } from "@/lib/toast";

const inputClassName =
  "h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition-shadow duration-200 placeholder:text-muted-foreground focus:ring-3 focus:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-60";

const text = {
  admissionDate:
    "\u062A\u0627\u0631\u06CC\u062E \u062F\u0627\u062E\u0644\u06C1",
  birthDate:
    "\u062A\u0627\u0631\u06CC\u062E \u067E\u06CC\u062F\u0627\u0626\u0634",
  choose: "\u0645\u0646\u062A\u062E\u0628 \u06A9\u0631\u06CC\u06BA",
  class: "\u062C\u0645\u0627\u0639\u062A / \u06A9\u062A\u0628",
  cnic: "\u0634\u0646\u0627\u062E\u062A\u06CC \u06A9\u0627\u0631\u0688 / \u0628 \u0641\u0627\u0631\u0645 \u0646\u0645\u0628\u0631",
  dayScholar:
    "\u0631\u0648\u0632\u0627\u0646\u06C1 \u0622\u0646\u06D2 \u0648\u0627\u0644\u0627",
  department: "\u0634\u0639\u0628\u06C1",
  departmentHelp:
    "\u0627\u0633 \u0634\u0639\u0628\u06D2 \u06A9\u06CC \u062C\u0645\u0627\u0639\u062A\u06CC\u06BA \u062F\u06CC\u06A9\u06BE\u0627\u0646\u06D2 \u06A9\u06D2 \u0644\u06CC\u06D2 \u0645\u0646\u062A\u062E\u0628 \u06A9\u0631\u06CC\u06BA\u06D4",
  error:
    "\u0637\u0627\u0644\u0628 \u0639\u0644\u0645 \u0645\u062D\u0641\u0648\u0638 \u0646\u06C1\u06CC\u06BA \u06C1\u0648 \u0633\u06A9\u0627\u06D4 \u0628\u0631\u0627\u06C1 \u06A9\u0631\u0645 \u062F\u0648\u0628\u0627\u0631\u06C1 \u06A9\u0648\u0634\u0634 \u06A9\u0631\u06CC\u06BA\u06D4",
  fatherName:
    "\u0648\u0627\u0644\u062F / \u0633\u0631\u067E\u0631\u0633\u062A \u06A9\u0627 \u0646\u0627\u0645",
  female: "\u0637\u0627\u0644\u0628\u06C1",
  gender: "\u062C\u0646\u0633",
  halaqa: "\u062D\u0644\u0642\u06C1",
  image:
    "\u0637\u0627\u0644\u0628 \u0639\u0644\u0645 \u06A9\u06CC \u062A\u0635\u0648\u06CC\u0631",
  imageHelp:
    "JPG\u060C PNG \u06CC\u0627 WEBP \u0641\u0627\u0626\u0644 \u0645\u0646\u062A\u062E\u0628 \u06A9\u0631\u06CC\u06BA\u06D4",
  imageUpload:
    "\u062A\u0635\u0648\u06CC\u0631 \u0627\u067E \u0644\u0648\u0688 \u06A9\u0631\u06CC\u06BA",
  loading:
    "\u0645\u0639\u0644\u0648\u0645\u0627\u062A \u0644\u0648\u0688 \u06C1\u0648 \u0631\u06C1\u06CC \u06C1\u06CC\u06BA...",
  male: "\u0637\u0627\u0644\u0628",
  notes: "\u062E\u0635\u0648\u0635\u06CC \u0646\u0648\u0679\u0633",
  notesPlaceholder:
    "\u0645\u062B\u0644\u0627\u064B \u0637\u0628\u06CC \u06CC\u0627 \u062A\u0639\u0644\u06CC\u0645\u06CC \u06C1\u062F\u0627\u06CC\u0627\u062A",
  optional:
    "\u0628\u0639\u062F \u0645\u06CC\u06BA \u0645\u0646\u062A\u062E\u0628 \u06A9\u0631\u06CC\u06BA",
  personalDescription:
    "\u0633\u062A\u0627\u0631\u06D2 (*) \u0648\u0627\u0644\u06D2 \u062E\u0627\u0646\u06D2 \u067E\u064F\u0631 \u06A9\u0631\u0646\u0627 \u0636\u0631\u0648\u0631\u06CC \u06C1\u06CC\u06BA\u06D4",
  personalTitle:
    "\u0628\u0646\u06CC\u0627\u062F\u06CC \u0645\u0639\u0644\u0648\u0645\u0627\u062A",
  phone: "\u0645\u0648\u0628\u0627\u0626\u0644 \u0646\u0645\u0628\u0631",
  remove: "\u06C1\u0679\u0627\u0626\u06CC\u06BA",
  residential:
    "\u0631\u06C1\u0627\u0626\u0634\u06CC \u06A9\u06CC\u0641\u06CC\u062A",
  resident:
    "\u06C1\u0627\u0633\u0679\u0644 \u0645\u06CC\u06BA \u0645\u0642\u06CC\u0645",
  reset: "\u0635\u0627\u0641 \u06A9\u0631\u06CC\u06BA",
  save: "\u0637\u0627\u0644\u0628 \u0639\u0644\u0645 \u0645\u062D\u0641\u0648\u0638 \u06A9\u0631\u06CC\u06BA",
  saving:
    "\u0645\u062D\u0641\u0648\u0638 \u06C1\u0648 \u0631\u06C1\u0627 \u06C1\u06D2...",
  studentName:
    "\u0637\u0627\u0644\u0628 \u0639\u0644\u0645 \u06A9\u0627 \u067E\u0648\u0631\u0627 \u0646\u0627\u0645",
  studyDescription:
    "\u0637\u0627\u0644\u0628 \u0639\u0644\u0645 \u06A9\u06CC \u0645\u0648\u062C\u0648\u062F\u06C1 \u062C\u0645\u0627\u0639\u062A \u0627\u0648\u0631 \u0634\u0639\u0628\u06C1 \u0645\u0646\u062A\u062E\u0628 \u06A9\u0631\u06CC\u06BA\u06D4",
  studyTitle:
    "\u062A\u0639\u0644\u06CC\u0645\u06CC \u0645\u0639\u0644\u0648\u0645\u0627\u062A",
  studentCreated:
    "\u0637\u0627\u0644\u0628 \u0639\u0644\u0645 \u0634\u0627\u0645\u0644 \u06C1\u0648 \u06AF\u06CC\u0627",
  studentCreatedDescription:
    "\u0637\u0627\u0644\u0628 \u0639\u0644\u0645 \u06A9\u0627 \u0631\u06CC\u06A9\u0627\u0631\u0688 \u06A9\u0627\u0645\u06CC\u0627\u0628\u06CC \u0633\u06D2 \u0645\u062D\u0641\u0648\u0638 \u06C1\u0648 \u06AF\u06CC\u0627 \u06C1\u06D2\u06D4",
  studentUpdated:
    "\u0637\u0627\u0644\u0628 \u0639\u0644\u0645 \u06A9\u0627 \u0631\u06CC\u06A9\u0627\u0631\u0688 \u062A\u0631\u0645\u06CC\u0645 \u06C1\u0648 \u06AF\u06CC\u0627",
  studentUpdatedDescription:
    "\u0637\u0627\u0644\u0628 \u0639\u0644\u0645 \u06A9\u06CC \u0645\u0639\u0644\u0648\u0645\u0627\u062A \u06A9\u0627\u0645\u06CC\u0627\u0628\u06CC \u0633\u06D2 \u062A\u0631\u062A\u06CC\u0628 \u062F\u06D2 \u062F\u06CC \u06AF\u0626\u06CC \u06C1\u06CC\u06BA\u06D4",
  update:
    "\u062A\u0631\u0645\u06CC\u0645 \u0645\u062D\u0641\u0648\u0638 \u06A9\u0631\u06CC\u06BA",
  updating:
    "\u062A\u0631\u0645\u06CC\u0645 \u0645\u062D\u0641\u0648\u0638 \u06C1\u0648 \u0631\u06C1\u06CC \u06C1\u06D2...",
  supportDescription:
    "\u06C1\u0627\u0633\u0679\u0644 \u0627\u0648\u0631 \u062E\u0635\u0648\u0635\u06CC \u0636\u0631\u0648\u0631\u062A \u0633\u06D2 \u0645\u062A\u0639\u0644\u0642 \u0645\u0639\u0644\u0648\u0645\u0627\u062A \u062F\u0631\u062C \u06A9\u0631\u06CC\u06BA\u06D4",
  supportTitle:
    "\u0631\u06C1\u0627\u0626\u0634 \u0627\u0648\u0631 \u0627\u0636\u0627\u0641\u06CC \u0645\u0639\u0644\u0648\u0645\u0627\u062A",
};

function requiredLabel(label) {
  return (
    <span className="inline-flex items-center gap-1">
      {label}
      <span className="font-mono leading-none text-destructive">*</span>
    </span>
  );
}

function getErrorMessage(error) {
  const data = error?.response?.data;
  if (!data || typeof data !== "object") return text.error;

  const firstError = Object.values(data)
    .flat()
    .find((value) => typeof value === "string");
  return firstError || text.error;
}

export default function StudentForm({ student = null }) {
  const router = useRouter();
  const imageInputRef = useRef(null);
  const [selectedDepartmentOverride, setSelectedDepartmentOverride] =
    useState(null);
  const [studentImage, setStudentImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [previousMadrasas, setPreviousMadrasas] = useState(
    student?.previous_madrasas?.length
      ? student.previous_madrasas
      : [{ name: "", year: "", grade: "", result: "" }],
  );
  const [relatives, setRelatives] = useState(
    student?.relatives?.length
      ? student.relatives
      : [
          {
            name: "",
            relation: "",
            address: "",
            phone: "",
            occupation: "",
            is_emergency: true,
          },
        ],
  );
  const { data: departments = [], isLoading: isLoadingDepartments } =
    useDepartments();
  const { data: academicClasses = [], isLoading: isLoadingClasses } =
    useAcademicClasses();
  const { data: halaqas = [], isLoading: isLoadingHalaqas } = useHalaqas();
  const createStudent = useCreateStudent();
  const updateStudent = useUpdateStudent();
  const isEditing = Boolean(student?.id);

  const selectedDepartment = useMemo(() => {
    if (selectedDepartmentOverride !== null) return selectedDepartmentOverride;

    const academicClass = academicClasses.find(
      (item) => item.id === student?.current_class,
    );
    return academicClass ? String(academicClass.department) : "";
  }, [academicClasses, selectedDepartmentOverride, student?.current_class]);

  const filteredClasses = useMemo(
    () =>
      academicClasses.filter(
        (academicClass) =>
          !selectedDepartment ||
          String(academicClass.department) === selectedDepartment,
      ),
    [academicClasses, selectedDepartment],
  );

  function removeImage() {
    if (imagePreview.startsWith("blob:")) URL.revokeObjectURL(imagePreview);
    setStudentImage(null);
    setImagePreview("");
    if (imageInputRef.current) imageInputRef.current.value = "";
  }

  function handleImageChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (imagePreview.startsWith("blob:")) URL.revokeObjectURL(imagePreview);
    setStudentImage(file);
    setImagePreview(URL.createObjectURL(file));
  }

  function handleReset() {
    removeImage();
    setSelectedDepartmentOverride("");
    createStudent.reset();
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    formData.delete("department");
    formData.set(
      "previous_madrasas",
      JSON.stringify(
        previousMadrasas.filter((item) =>
          Object.values(item).some((value) => value),
        ),
      ),
    );
    formData.set(
      "relatives",
      JSON.stringify(
        relatives.filter((item) =>
          Object.entries(item).some(
            ([key, value]) => key !== "is_emergency" && value,
          ),
        ),
      ),
    );
    [
      "date_of_birth",
      "cnic",
      "current_halaqa",
      "notes",
      "guardian_cnic",
    ].forEach((field) => {
      if (!formData.get(field)) formData.delete(field);
    });
    if (studentImage) formData.set("photo", studentImage);

    try {
      if (isEditing) {
        await updateStudent.mutateAsync({ id: student.id, formData });
        toast.success(text.studentUpdated, text.studentUpdatedDescription);
        router.replace(`/dashboard/students/${student.id}`);
      } else {
        await createStudent.mutateAsync(formData);
        toast.success(text.studentCreated, text.studentCreatedDescription);
        router.replace("/dashboard/students");
      }
    } catch (error) {
      toast.error(text.error, getApiErrorMessage(error, text.error));
      // The mutation state renders the API validation message below the form.
    }
  }

  const isReferenceDataLoading =
    isLoadingDepartments || isLoadingClasses || isLoadingHalaqas;
  const isSubmitting = createStudent.isPending || updateStudent.isPending;
  const mutationError = isEditing ? updateStudent.error : createStudent.error;
  const hasMutationError = isEditing
    ? updateStudent.isError
    : createStudent.isError;
  const displayedImage = imagePreview || student?.photo || "";

  return (
    <form className="space-y-6" onSubmit={handleSubmit} onReset={handleReset}>
      <StudentFormSection
        title={text.personalTitle}
        description={text.personalDescription}
      >
        <div className="mb-6 flex flex-col gap-4 rounded-xl border border-dashed border-border bg-muted/50 p-4 sm:flex-row sm:items-center">
          {displayedImage ? (
            <Image
              src={displayedImage}
              alt={text.image}
              width={80}
              height={80}
              unoptimized
              className="size-20 rounded-xl border border-border object-cover"
            />
          ) : (
            <div className="grid size-20 place-items-center rounded-xl bg-background text-muted-foreground">
              <UserRound className="size-8" aria-hidden="true" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-semibold">{text.image}</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              {text.imageHelp}
            </p>
            {studentImage && (
              <p className="mt-2 truncate text-xs font-medium" dir="ltr">
                {studentImage.name}
              </p>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <input
              ref={imageInputRef}
              id="student-image"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="sr-only"
              onChange={handleImageChange}
            />
            <label
              htmlFor="student-image"
              className="inline-flex h-9 cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80 focus-within:ring-3 focus-within:ring-ring/50"
            >
              <ImageUp className="size-4" aria-hidden="true" />
              {text.imageUpload}
            </label>
            {studentImage && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={removeImage}
              >
                <X aria-hidden="true" />
                {text.remove}
              </Button>
            )}
          </div>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <label className="grid gap-2 text-sm font-medium">
            {requiredLabel(text.studentName)}
            <input
              className={inputClassName}
              name="full_name"
              defaultValue={student?.full_name || ""}
              required
            />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            {requiredLabel(text.fatherName)}
            <input
              className={inputClassName}
              name="guardian_name"
              defaultValue={student?.guardian_name || ""}
              required
            />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            سرپرست سے رشتہ
            <input
              className={inputClassName}
              name="guardian_relation"
              defaultValue={student?.guardian_relation || ""}
              placeholder="مثال: والد"
            />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            {requiredLabel(text.gender)}
            <select
              className={inputClassName}
              name="gender"
              defaultValue={student?.gender || ""}
              required
            >
              <option value="" disabled>
                {text.choose}
              </option>
              <option value="male">{text.male}</option>
              <option value="female">{text.female}</option>
            </select>
          </label>
          <label className="grid gap-2 text-sm font-medium">
            {text.birthDate}
            <input
              className={inputClassName}
              type="date"
              name="date_of_birth"
              defaultValue={student?.date_of_birth || ""}
              dir="ltr"
            />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            {text.cnic}
            <input
              className={inputClassName}
              name="cnic"
              defaultValue={student?.cnic || ""}
              placeholder="00000-0000000-0"
              dir="ltr"
              inputMode="numeric"
            />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            {requiredLabel(text.phone)}
            <input
              className={inputClassName}
              name="phone"
              defaultValue={student?.phone || ""}
              placeholder="0300 1234567"
              dir="ltr"
              inputMode="tel"
              required
            />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            سرپرست کا شناختی کارڈ
            <input
              className={inputClassName}
              name="guardian_cnic"
              defaultValue={student?.guardian_cnic || ""}
              dir="ltr"
            />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            سرپرست کا رابطہ نمبر
            <input
              className={inputClassName}
              name="guardian_phone"
              defaultValue={student?.guardian_phone || ""}
              dir="ltr"
            />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            قوم
            <input
              className={inputClassName}
              name="caste"
              defaultValue={student?.caste || ""}
            />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            مذہب
            <input
              className={inputClassName}
              name="religion"
              defaultValue={student?.religion || "اسلام"}
            />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            قومیت
            <input
              className={inputClassName}
              name="nationality"
              defaultValue={student?.nationality || "پاکستانی"}
            />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            ملک
            <input
              className={inputClassName}
              name="country"
              defaultValue={student?.country || "پاکستان"}
            />
          </label>
        </div>
      </StudentFormSection>

      <StudentFormSection
        title={text.studyTitle}
        description={text.studyDescription}
      >
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <label className="grid gap-2 text-sm font-medium">
            {text.department}
            <select
              className={inputClassName}
              name="department"
              value={selectedDepartment}
              onChange={(event) =>
                setSelectedDepartmentOverride(event.target.value)
              }
              disabled={isLoadingDepartments}
            >
              <option value="">
                {isLoadingDepartments ? text.loading : text.departmentHelp}
              </option>
              {departments.map((department) => (
                <option key={department.id} value={department.id}>
                  {department.name}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-2 text-sm font-medium">
            {requiredLabel(text.class)}
            <select
              className={inputClassName}
              name="current_class"
              defaultValue={student?.current_class || ""}
              required
              disabled={isLoadingClasses}
            >
              <option value="" disabled>
                {isLoadingClasses ? text.loading : text.choose}
              </option>
              {filteredClasses.map((academicClass) => (
                <option key={academicClass.id} value={academicClass.id}>
                  {academicClass.name}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-2 text-sm font-medium">
            {text.halaqa}
            <select
              className={inputClassName}
              name="current_halaqa"
              defaultValue={student?.current_halaqa || ""}
              disabled={isLoadingHalaqas}
            >
              <option value="">
                {isLoadingHalaqas ? text.loading : text.optional}
              </option>
              {halaqas.map((halaqa) => (
                <option key={halaqa.id} value={halaqa.id}>
                  {halaqa.name}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-2 text-sm font-medium">
            {requiredLabel(text.admissionDate)}
            <input
              className={inputClassName}
              type="date"
              name="admission_date"
              defaultValue={student?.admission_date || ""}
              dir="ltr"
              required
            />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            مطلوبہ درجہ
            <input
              className={inputClassName}
              name="requested_class"
              defaultValue={student?.requested_class || ""}
              placeholder="مثال: درجہ ثالثہ"
            />
          </label>
        </div>
      </StudentFormSection>

      <StudentFormSection
        title={text.supportTitle}
        description={text.supportDescription}
      >
        <div className="grid gap-5 md:grid-cols-2">
          <fieldset className="grid gap-3">
            <legend className="inline-flex items-center gap-1 text-sm font-medium">
              {requiredLabel(text.residential)}
            </legend>
            <div className="flex flex-wrap gap-3">
              <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-input bg-background px-4 py-2.5 text-sm has-[:checked]:border-primary has-[:checked]:bg-primary/10">
                <input
                  type="radio"
                  name="residential_status"
                  value="day_scholar"
                  defaultChecked={
                    !student || student.residential_status === "day_scholar"
                  }
                  required
                />
                {text.dayScholar}
              </label>
              <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-input bg-background px-4 py-2.5 text-sm has-[:checked]:border-primary has-[:checked]:bg-primary/10">
                <input
                  type="radio"
                  name="residential_status"
                  value="resident"
                  defaultChecked={student?.residential_status === "resident"}
                  required
                />
                {text.resident}
              </label>
            </div>
          </fieldset>
          <label className="grid gap-2 text-sm font-medium">
            {text.notes}
            <textarea
              className="min-h-[6.75rem] w-full resize-y rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none transition-shadow placeholder:text-muted-foreground focus:ring-3 focus:ring-ring/50"
              name="notes"
              defaultValue={student?.notes || ""}
              placeholder={text.notesPlaceholder}
            />
          </label>
        </div>
      </StudentFormSection>

      <StudentFormSection
        title="رہائشی، صحت اور تعلیمی معلومات"
        description="داخلہ فارم کے مطابق پتے، صحت اور سابقہ تعلیم کی تفصیل درج کریں۔"
      >
        <div className="grid gap-5 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-medium">
            موجودہ پتہ
            <textarea
              className="min-h-24 rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-3 focus:ring-ring/50"
              name="current_address"
              defaultValue={student?.current_address || ""}
            />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            مستقل پتہ
            <textarea
              className="min-h-24 rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-3 focus:ring-ring/50"
              name="permanent_address"
              defaultValue={student?.permanent_address || ""}
            />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            کوئی بیماری / طبی کیفیت
            <textarea
              className="min-h-24 rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-3 focus:ring-ring/50"
              name="health_conditions"
              defaultValue={student?.health_conditions || ""}
            />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            عصری تعلیم
            <textarea
              className="min-h-24 rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-3 focus:ring-ring/50"
              name="modern_education"
              defaultValue={student?.modern_education || ""}
              placeholder="مثال: میٹرک، ایف اے"
            />
          </label>
          <label className="grid gap-2 text-sm font-medium md:col-span-2">
            دیگر اسناد
            <textarea
              className="min-h-24 rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-3 focus:ring-ring/50"
              name="other_certificates"
              defaultValue={student?.other_certificates || ""}
            />
          </label>
        </div>
      </StudentFormSection>

      <StudentFormSection
        title="سابقہ مدارس"
        description="اگر طالب علم پہلے کسی مدرسہ میں پڑھ چکا ہے تو اس کی تفصیل درج کریں۔"
      >
        <div className="space-y-3">
          {previousMadrasas.map((item, index) => (
            <div
              key={index}
              className="grid gap-3 rounded-xl border border-border p-4 md:grid-cols-4"
            >
              <input
                value={item.name}
                onChange={(event) =>
                  setPreviousMadrasas((rows) =>
                    rows.map((row, rowIndex) =>
                      rowIndex === index
                        ? { ...row, name: event.target.value }
                        : row,
                    ),
                  )
                }
                placeholder="مدرسہ کا نام"
                className={inputClassName}
              />
              <input
                value={item.year}
                onChange={(event) =>
                  setPreviousMadrasas((rows) =>
                    rows.map((row, rowIndex) =>
                      rowIndex === index
                        ? { ...row, year: event.target.value }
                        : row,
                    ),
                  )
                }
                placeholder="سال"
                dir="ltr"
                className={inputClassName}
              />
              <input
                value={item.grade}
                onChange={(event) =>
                  setPreviousMadrasas((rows) =>
                    rows.map((row, rowIndex) =>
                      rowIndex === index
                        ? { ...row, grade: event.target.value }
                        : row,
                    ),
                  )
                }
                placeholder="درجہ"
                className={inputClassName}
              />
              <div className="flex gap-2">
                <input
                  value={item.result}
                  onChange={(event) =>
                    setPreviousMadrasas((rows) =>
                      rows.map((row, rowIndex) =>
                        rowIndex === index
                          ? { ...row, result: event.target.value }
                          : row,
                      ),
                    )
                  }
                  placeholder="تقدیر / نتیجہ"
                  className={inputClassName}
                />
                {previousMadrasas.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      setPreviousMadrasas((rows) =>
                        rows.filter((_, rowIndex) => rowIndex !== index),
                      )
                    }
                  >
                    <X />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            setPreviousMadrasas((rows) => [
              ...rows,
              { name: "", year: "", grade: "", result: "" },
            ])
          }
        >
          <Plus />
          مزید مدرسہ شامل کریں
        </Button>
      </StudentFormSection>

      <StudentFormSection
        title="رشتہ دار اور ایمرجنسی رابطہ"
        description="رشتہ داروں کی تفصیل شامل کریں اور ایمرجنسی رابطے کو منتخب کریں۔"
      >
        <div className="space-y-3">
          {relatives.map((item, index) => (
            <div
              key={index}
              className="grid gap-3 rounded-xl border border-border p-4 md:grid-cols-3"
            >
              <input
                value={item.name}
                onChange={(event) =>
                  setRelatives((rows) =>
                    rows.map((row, rowIndex) =>
                      rowIndex === index
                        ? { ...row, name: event.target.value }
                        : row,
                    ),
                  )
                }
                placeholder="نام"
                className={inputClassName}
              />
              <input
                value={item.relation}
                onChange={(event) =>
                  setRelatives((rows) =>
                    rows.map((row, rowIndex) =>
                      rowIndex === index
                        ? { ...row, relation: event.target.value }
                        : row,
                    ),
                  )
                }
                placeholder="رشتہ"
                className={inputClassName}
              />
              <input
                value={item.phone}
                onChange={(event) =>
                  setRelatives((rows) =>
                    rows.map((row, rowIndex) =>
                      rowIndex === index
                        ? { ...row, phone: event.target.value }
                        : row,
                    ),
                  )
                }
                placeholder="رابطہ نمبر"
                dir="ltr"
                className={inputClassName}
              />
              <input
                value={item.occupation}
                onChange={(event) =>
                  setRelatives((rows) =>
                    rows.map((row, rowIndex) =>
                      rowIndex === index
                        ? { ...row, occupation: event.target.value }
                        : row,
                    ),
                  )
                }
                placeholder="پیشہ"
                className={inputClassName}
              />
              <input
                value={item.address}
                onChange={(event) =>
                  setRelatives((rows) =>
                    rows.map((row, rowIndex) =>
                      rowIndex === index
                        ? { ...row, address: event.target.value }
                        : row,
                    ),
                  )
                }
                placeholder="پتہ / شہر"
                className={inputClassName}
              />
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    checked={item.is_emergency}
                    onChange={() =>
                      setRelatives((rows) =>
                        rows.map((row, rowIndex) => ({
                          ...row,
                          is_emergency: rowIndex === index,
                        })),
                      )
                    }
                  />
                  ایمرجنسی رابطہ
                </label>
                {relatives.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      setRelatives((rows) =>
                        rows.filter((_, rowIndex) => rowIndex !== index),
                      )
                    }
                  >
                    <X />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            setRelatives((rows) => [
              ...rows,
              {
                name: "",
                relation: "",
                address: "",
                phone: "",
                occupation: "",
                is_emergency: false,
              },
            ])
          }
        >
          <Plus />
          مزید رشتہ دار شامل کریں
        </Button>
      </StudentFormSection>

      {hasMutationError && (
        <p
          className="rounded-lg border border-destructive bg-destructive/10 px-4 py-3 text-sm text-destructive"
          role="alert"
        >
          {getErrorMessage(mutationError)}
        </p>
      )}
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-start">
        <Button type="reset" variant="outline" disabled={isSubmitting}>
          {text.reset}
        </Button>
        <Button type="submit" disabled={isSubmitting || isReferenceDataLoading}>
          <Save aria-hidden="true" />
          {isSubmitting
            ? isEditing
              ? text.updating
              : text.saving
            : isEditing
              ? text.update
              : text.save}
        </Button>
      </div>
    </form>
  );
}
