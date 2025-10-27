export type Finder = {
  name: string;
  nim: string;
  contact: string;
  photoUrl: string;
};

export type Claimer = {
  name: string;
  nim: string;
  claimedDate: string;
  photoUrl: string;
};

export type categoryItem = {
  id: number;
  name: string;
  status?: boolean;
};

export type Item = {
  id: number;
  name: string;
  description: string;
  foundDate: string;
  status: "DITEMUKAN" | "DIAMBIL";
  imageUrl: string;
  location: string;
  kategoriBarang: categoryItem;
  finder: Finder;
  claimer?: Claimer | null;
  createdAt: string;
};

export type User = {
  id: number;
  name: string;
  nim: string;
  email: string;
  contact: string;
  role: "admin" | "user";
};

export type ClaimRequest = {
  id: number;
  itemId: number;
  itemName: string;
  userId: number;
  userName: string;
  userNim: string;
  alasan: string;
  buktiUrl: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED";
  adminNote: string | null;
  createdAt: string;
  processedAt?: string;
};
