export type ITestimonialItem = {
  id: string;
  name: string;
  first_name: string; // Added field for first name
  last_name: string; // Added field for last name
  city: string;
  state: string;
  reserved_cities: string; // Added field for reserved city
  reserved_states: string; // Added field for reserved city
  role: string;
  email: string;
  phone_number: string; // Changed to snake_case
  phone: string; // Added field for phone
  referred_by_first_name?: string; // Changed to snake_case
  referred_by_last_name?: string; // Changed to snake_case
  status: string;
  address1: string;
  address2: string;
  country: string;
  zip_code: string; // Changed to snake_case
  company: string;
  avatar_url: string; // Changed to snake_case
  is_verified: boolean; // Changed to snake_case
};

export type ITestimonialTableFilters = {
  name: string;
  selectedColumn: string;
};
