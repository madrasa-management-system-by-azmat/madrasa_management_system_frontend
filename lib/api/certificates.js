import apiClient from "@/lib/apiClient";
import axios from "axios";
import { API_BASE_URL } from "@/lib/apiClient";
const results = (r) => (Array.isArray(r.data) ? r.data : r.data.results);
export const getCertificateDashboard = () =>
  apiClient.get("certificates/dashboard/").then((r) => r.data);
export const getCertificates = (search = "") =>
  apiClient
    .get("certificates/records/", {
      params: search.trim() ? { search: search.trim() } : {},
    })
    .then(results);
export const createCertificate = (d) =>
  apiClient.post("certificates/records/", d).then((r) => r.data);
export const getOrCreateIssuedStudentCertificate = async ({
  student,
  certificateType,
  title,
  body,
}) => {
  const sourceFingerprint = `student:${student.id}:${certificateType}:print-v1`;
  const certificates = await apiClient
    .get("certificates/records/", {
      params: { source_fingerprint: sourceFingerprint },
    })
    .then(results);
  let certificate = certificates.find((item) => item.status === "issued");
  if (certificate) return certificate;
  certificate = certificates.find((item) => item.status === "approved");
  if (certificate)
    return certificateAction({ id: certificate.id, action: "issue" });
  certificate = certificates.find((item) => item.status === "draft");
  if (certificate) {
    certificate = await certificateAction({
      id: certificate.id,
      action: "approve",
    });
    return certificateAction({ id: certificate.id, action: "issue" });
  }
  certificate = await createCertificate({
    certificate_type: certificateType,
    recipient_kind: "student",
    student: student.id,
    recipient_name_snapshot: student.full_name,
    recipient_identifier_snapshot: student.registration_number,
    title,
    body_snapshot: body,
    credential_snapshot: {
      class_name: student.class_name || "",
      guardian_name: student.guardian_name || "",
    },
    source_type: "student_certificate_print",
    source_object_id: student.id,
    source_fingerprint: sourceFingerprint,
  });
  certificate = await certificateAction({
    id: certificate.id,
    action: "approve",
  });
  return certificateAction({ id: certificate.id, action: "issue" });
};
export const certificateAction = ({ id, action, data = {} }) =>
  apiClient
    .post(`certificates/records/${id}/${action}/`, data)
    .then((r) => r.data);
export const verifyPublicCertificate = (id) =>
  axios
    .get(`${API_BASE_URL}certificates/public/verify/${id}/`)
    .then((r) => r.data);
