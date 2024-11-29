// Define the types for customer addresses
export interface AddressCoordinates {
  lat: number;
  lng: number;
}

export interface Address {
  address: string;
  city: string;
  state: string;
  stateCode: string;
  postalCode: string;
  country: string;
  coordinates: AddressCoordinates;
}

// Define the types for customer company information
export interface Company {
  department: string;
  name: string;
  title: string;
  address: Address;
}

// Define the types for customer bank information
export interface Bank {
  cardExpire: string;
  cardNumber: string;
  cardType: string;
  currency: string;
  iban: string;
}

// Define the types for customer crypto wallet information
export interface Crypto {
  coin: string;
  wallet: string;
  network: string;
}

// Define the types for customer hair information
export interface Hair {
  color: string;
  type: string;
}

// Define the customer type
export interface Customer {
  id: number;
  firstName: string;
  lastName: string;
  maidenName: string;
  age: number;
  gender: string;
  email: string;
  phone: string;
  username: string;
  password: string;
  birthDate: string;
  image: string;
  bloodGroup: string;
  height: number;
  weight: number;
  eyeColor: string;
  hair: Hair;
  ip: string;
  address: Address;
  macAddress: string;
  university: string;
  bank: Bank;
  company: Company;
  ein: string;
  ssn: string;
  userAgent: string;
  crypto: Crypto;
  role: string;
}

// Define the store structure for customers
export interface CustomerStore {
  customers: Customer[]; // List of all customers
  customer: Customer | null; // A single customer's details
  loadingList: boolean; // Loading state for fetching customer list
  loadingCustomer: boolean; // Loading state for fetching a single customer
  error: string | null; // General error state
  fetchCustomers: () => Promise<void>; // Fetch all customers
  fetchCustomer: (id: number) => Promise<void>; // Fetch a single customer by ID
}
