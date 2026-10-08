/**
 * Supabase queries in this project are made on an untyped client (no generated
 * Database schema), so table rows are not described by any interface. Rows are
 * intentionally typed as `any` until a schema type is generated; consumers
 * access columns freely, matching the runtime behavior of the queries.
 */
export type UntypedRow = any;
export type UntypedRowList = UntypedRow[];
