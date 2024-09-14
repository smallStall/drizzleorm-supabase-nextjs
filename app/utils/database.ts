import { PostgresJsQueryResultHKT, drizzle } from "drizzle-orm/postgres-js";
import { ExtractTablesWithRelations, sql } from "drizzle-orm";
import postgres from "postgres";
import { PgTransaction } from "drizzle-orm/pg-core";

const connectionString = `postgresql://${process.env.SUPAVISOR_USER}.${process.env.SUPAVISOR_TENANT}:${process.env.SUPAVISOR_PASSWORD}@${process.env.SUPAVISOR_PORT}/postgres`;
//Disable prefetch as it is not supported for "Transaction" pool mode
const client = postgres(connectionString, { prepare: false });

export const db = drizzle(client);

type QueryInTransaction<T> = (
  tx: PgTransaction<
    PostgresJsQueryResultHKT,
    Record<string, never>,
    ExtractTablesWithRelations<Record<string, never>>
  >
) => Promise<T>;

export const rlsQuery = async <T>(
  userId: string,
  txFunc: QueryInTransaction<T>
) =>
  await db.transaction(async (tx) => {
    await tx.execute(
      sql`SELECT set_config('request.jwt.claim.sub', '${sql.raw(
        userId
      )}', TRUE)`
    );
    return await txFunc(tx);
  });
