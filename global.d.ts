// Global ambient type declarations
// Makes the Supabase generated Database type available everywhere without importing.

import type { Database as GeneratedDatabase } from "./lib/types";

declare global {
  // Represents the Supabase database schema (public + other exposed schemas)
  // Usage: const x: Database['public']['Tables']['profiles']['Row']
  type Database = GeneratedDatabase;
}

export {}; // Ensure this file is treated as a module.
