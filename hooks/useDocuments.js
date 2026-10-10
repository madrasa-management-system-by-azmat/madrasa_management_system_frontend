"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as documentsApi from "@/lib/api/documents";

const keys = ["document-dashboard", "document-categories", "document-folders", "documents", "document"];
function useDocumentMutation(mutationFn) { const queryClient = useQueryClient(); return useMutation({ mutationFn, onSuccess: () => keys.forEach((key) => queryClient.invalidateQueries({ queryKey: [key] })) }); }

export const useDocumentDashboard = () => useQuery({ queryKey: ["document-dashboard"], queryFn: documentsApi.getDocumentDashboard });
export const useDocumentCategories = () => useQuery({ queryKey: ["document-categories"], queryFn: documentsApi.getDocumentCategories });
export const useCreateDocumentCategory = () => useDocumentMutation(documentsApi.createDocumentCategory);
export const useDocumentFolders = () => useQuery({ queryKey: ["document-folders"], queryFn: documentsApi.getDocumentFolders });
export const useCreateDocumentFolder = () => useDocumentMutation(documentsApi.createDocumentFolder);
export const useDocuments = (params = {}) => useQuery({ queryKey: ["documents", params], queryFn: () => documentsApi.getDocuments(params) });
export const useDocument = (id) => useQuery({ queryKey: ["document", id], queryFn: () => documentsApi.getDocument(id), enabled: Boolean(id) });
export const useCreateDocument = () => useDocumentMutation(documentsApi.createDocument);
export const useUpdateDocument = () => useDocumentMutation(documentsApi.updateDocument);
export const useDocumentAction = () => useDocumentMutation(documentsApi.documentAction);
export const useDocumentPeople = () => useQuery({ queryKey: ["document-people"], queryFn: documentsApi.getDocumentPeople });
export const useUploadDocumentVersion = () => useDocumentMutation(documentsApi.uploadDocumentVersion);
export const useDownloadDocumentVersion = () => useMutation({ mutationFn: documentsApi.downloadDocumentVersion });
export const useCreateDocumentGrant = () => useDocumentMutation(documentsApi.createDocumentGrant);
export const useCreateDocumentComment = () => useDocumentMutation(documentsApi.createDocumentComment);
