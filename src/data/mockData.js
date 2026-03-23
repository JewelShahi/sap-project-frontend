export const mockUsers = [
  {
    id: 1,
    username: "Ivan Petrov",
    email: "ivan@example.com",
    isEnabled: true,
    createdAt: "2026-03-01",
    updatedAt: "2026-03-15",
  },
  {
    id: 2,
    username: "Georgi Ivanov",
    email: "georgi@example.com",
    isEnabled: true,
    createdAt: "2026-03-02",
    updatedAt: "2026-03-14",
  },
  {
    id: 3,
    username: "Maria Dimitrova",
    email: "maria@example.com",
    isEnabled: true,
    createdAt: "2026-03-03",
    updatedAt: "2026-03-12",
  },
  {
    id: 4,
    username: "Nikolay Stoyanov",
    email: "nikolay@example.com",
    isEnabled: true,
    createdAt: "2026-03-04",
    updatedAt: "2026-03-11",
  },
];

export const mockDocuments = [
  {
    id: 1,
    createdBy: 1,
    title: "Employee Handbook",
    description:
      "Internal company handbook with updated onboarding policies and employee guidelines.",
    createdAt: "2026-03-01",
    updatedAt: "2026-03-15",
    isDeleted: false,
  },
  {
    id: 2,
    createdBy: 2,
    title: "Security Policy",
    description:
      "Security rules and internal access requirements for company systems.",
    createdAt: "2026-03-03",
    updatedAt: "2026-03-14",
    isDeleted: false,
  },
  {
    id: 3,
    createdBy: 3,
    title: "Quarterly Planning",
    description:
      "Quarterly planning draft for team goals, milestones, and priorities.",
    createdAt: "2026-03-05",
    updatedAt: "2026-03-12",
    isDeleted: false,
  },
  {
    id: 4,
    createdBy: 4,
    title: "Vendor Agreement",
    description:
      "Agreement document version history with approval and rejection states.",
    createdAt: "2026-03-02",
    updatedAt: "2026-03-11",
    isDeleted: false,
  },
];

export const mockVersions = [
  {
    id: 101,
    documentId: 1,
    versionNumber: 3,
    content: "Updated onboarding content and policy clarifications.",
    status: "APPROVED",
    parentVersionId: 102,
    createdAt: "2026-03-15",
    isActive: true,
    filePath: "/files/employee-handbook-v3.pdf",
    fileSize: 245760,
    checksum: "chk-emp-v3",
    summary: "Added onboarding updates and policy clarifications.",
    authorId: 1,
  },
  {
    id: 102,
    documentId: 1,
    versionNumber: 2,
    content: "Submitted revised handbook for review.",
    status: "PENDING",
    parentVersionId: 103,
    createdAt: "2026-03-10",
    isActive: false,
    filePath: "/files/employee-handbook-v2.pdf",
    fileSize: 233120,
    checksum: "chk-emp-v2",
    summary: "Submitted revised handbook for review.",
    authorId: 1,
  },
  {
    id: 103,
    documentId: 1,
    versionNumber: 1,
    content: "Initial approved employee handbook version.",
    status: "APPROVED",
    parentVersionId: null,
    createdAt: "2026-03-02",
    isActive: false,
    filePath: "/files/employee-handbook-v1.pdf",
    fileSize: 220000,
    checksum: "chk-emp-v1",
    summary: "Initial approved version of the employee handbook.",
    authorId: 3,
  },
  {
    id: 104,
    documentId: 1,
    versionNumber: 0.9,
    content: "Rejected draft missing compliance notes.",
    status: "REJECTED",
    parentVersionId: null,
    createdAt: "2026-03-01",
    isActive: false,
    filePath: "/files/employee-handbook-v0-9.pdf",
    fileSize: 210000,
    checksum: "chk-emp-v0-9",
    summary: "Rejected due to missing mandatory compliance notes.",
    authorId: 2,
  },
  {
    id: 201,
    documentId: 2,
    versionNumber: 1,
    content: "Initial version waiting for review.",
    status: "PENDING",
    parentVersionId: null,
    createdAt: "2026-03-14",
    isActive: true,
    filePath: "/files/security-policy-v1.pdf",
    fileSize: 180000,
    checksum: "chk-sec-v1",
    summary: "Initial version waiting for review.",
    authorId: 2,
  },
  {
    id: 301,
    documentId: 3,
    versionNumber: 2,
    content: "Draft update for quarterly priorities.",
    status: "DRAFT",
    parentVersionId: 302,
    createdAt: "2026-03-12",
    isActive: true,
    filePath: "/files/quarterly-planning-v2.pdf",
    fileSize: 190000,
    checksum: "chk-plan-v2",
    summary: "Draft update for quarterly priorities.",
    authorId: 3,
  },
  {
    id: 302,
    documentId: 3,
    versionNumber: 1,
    content: "Initial approved planning version.",
    status: "APPROVED",
    parentVersionId: null,
    createdAt: "2026-03-08",
    isActive: false,
    filePath: "/files/quarterly-planning-v1.pdf",
    fileSize: 175000,
    checksum: "chk-plan-v1",
    summary: "Initial approved planning version.",
    authorId: 3,
  },
  {
    id: 401,
    documentId: 4,
    versionNumber: 1,
    content: "Rejected agreement version.",
    status: "REJECTED",
    parentVersionId: null,
    createdAt: "2026-03-11",
    isActive: true,
    filePath: "/files/vendor-agreement-v1.pdf",
    fileSize: 205000,
    checksum: "chk-vendor-v1",
    summary: "Rejected because approval notes were missing.",
    authorId: 4,
  },
];

export const mockReviews = [
  {
    id: 1,
    versionId: 101,
    reviewerId: 2,
    reviewStatus: "APPROVED",
    comments: "Looks good.",
    reviewedAt: "2026-03-16",
  },
  {
    id: 2,
    versionId: 201,
    reviewerId: 4,
    reviewStatus: "PENDING",
    comments: "",
    reviewedAt: null,
  },
  {
    id: 3,
    versionId: 401,
    reviewerId: 3,
    reviewStatus: "REJECTED",
    comments: "Missing approval notes.",
    reviewedAt: "2026-03-12",
  },
];

export function getUserById(userId) {
  return mockUsers.find((user) => user.id === userId);
}

export function getVersionsByDocumentId(documentId) {
  return mockVersions.filter((version) => version.documentId === documentId);
}

export function getActiveVersionByDocumentId(documentId) {
  return mockVersions.find(
    (version) => version.documentId === documentId && version.isActive
  );
}

export function getDocumentById(documentId) {
  return mockDocuments.find((document) => document.id === documentId);
}

export function getDocumentListItems() {
  return mockDocuments.map((document) => {
    const author = getUserById(document.createdBy);
    const activeVersion = getActiveVersionByDocumentId(document.id);

    return {
      id: document.id,
      title: document.title,
      description: document.description,
      author: author?.username || "Unknown user",
      status: activeVersion?.status || "UNKNOWN",
      activeVersion: activeVersion
        ? `v${activeVersion.versionNumber}`
        : "N/A",
      updatedAt: document.updatedAt,
    };
  });
}