import { create } from "zustand";
import { ProductStore } from "./types";

// Define the Zustand store
export const useProductStore = create<ProductStore>((set) => ({
  products: [],
  product: null,
  loadingList: false,
  loadingProduct: false,
  error: null,

  //api https://www.test.backend.fatmug.co.in/amzsku/
  //api https://www.test.backend.fatmug.co.in/orderitem/
  // Fetch all products
  fetchProducts: async () => {
    set({ loadingList: true, error: null });
    try {
      const response = await fetch("https://dummyjson.com/products/", {
        method:"GET",
        headers: {
          // "Authorization": `Bearer ${Token}`
        }
      });
      const data = await response.json();
      set({ products: data.products, loadingList: false });
    } catch (err) {
      console.log(err)
      set({ error: "Failed to fetch products", loadingList: false });
    }
  },

  // Fetch a single product by ID
  fetchProduct: async (id: number) => {
    set({ loadingProduct: true, error: null });
    try {
      const response = await fetch(`https://dummyjson.com/products/${id}`);
      const data = await response.json();
      set({ product: data, loadingProduct: false });
    } catch (err) {
      console.log(err)
      set({ error: `Failed to fetch product ${id}`, loadingProduct: false });
    }
  },
}));
