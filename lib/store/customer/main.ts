import { create } from "zustand";
import { CustomerStore } from "./types";

// Define the Zustand store
export const useCustomerStore = create<CustomerStore>((set) => ({
  customers: [],
  customer: null,
  loadingList: false,
  loadingCustomer: false,
  error: null,

  // Fetch all customers
  fetchCustomers: async () => {
    set({ loadingList: true, error: null });
    try {
      const response = await fetch("https://dummyjson.com/users");
      const data = await response.json();
      console.log(data)
      set({ customers: data.users, loadingList: false });
    } catch (err) {
      console.log(err)
      set({ error: "Failed to fetch customers", loadingList: false });
    }
  },

  // Fetch a single customers by ID
  fetchCustomer: async (id: number) => {
    set({ loadingCustomer: true, error: null });
    try {
      const response = await fetch(`https://dummyjson.com/users/${id}`);
      const data = await response.json();
      set({ customer: data, loadingCustomer: false });
    } catch (err) {
      console.log(err)
      set({ error: `Failed to fetch customer ${id}`, loadingCustomer: false });
    }
  },
}));
