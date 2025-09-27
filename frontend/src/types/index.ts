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
};

export type Item = {
  id: number;
  name: string;
  description: string;
  foundDate: string;
  status: "Ditemukan" | "Diambil";
  imageUrl: string;
  location: string;
  kategoriBarang: categoryItem;
  finder: Finder;
  claimer?: Claimer | null;
  createdAt: string;
};
