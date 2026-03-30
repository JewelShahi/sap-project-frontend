import api from "@/components/api/api";

export async function fetchDocumentById(documentId) {
  const response = await api.get(`/documents/${documentId}/`);
  return response.data;
}

export async function fetchVersionsByDocumentId(documentId) {
  const response = await api.get(`/versions/document/${documentId}/`);
  return response.data;
}