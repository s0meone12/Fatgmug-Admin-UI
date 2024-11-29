import { create } from "zustand";

type ProductStore = {
  products: string[];
  addProduct: (product: string) => void;
};

export const useProductStore = create<ProductStore>((set) => ({
  products: [],
  addProduct: (product) =>
    set((state) => ({ products: [...state.products, product] })),
}));


type CustomerStore = {
  customers: string[];
  addCustomer: (customer: string) => void;
};

export const useCustomerStore = create<CustomerStore>((set) => ({
  customers: [],
  addCustomer: (customer) =>
    set((state) => ({ customers: [...state.customers, customer] })),
}));