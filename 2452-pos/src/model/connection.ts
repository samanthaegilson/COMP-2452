import { PGlite } from '@electric-sql/pglite';
import ddl from '../../create-tables.sql?raw';

// idb://2452-emon says to use IndexedDB as the backing storage for PGlite,
// this is "permanent" storage for us.


// I want to ask questions about the environment to decide where to
// put or store our database (so in memory vs IndexedDB).
// VITE_ prefix is important, but anything after that is
// up to you to define (you could use DB_URL).
let src = import.meta.env.VITE_DATABASE_URL;

const pgliteDb = await PGlite.create(src)

// in the test environment we need to populate the tables
// in our databse:
if (src == 'memory://') {
    db().exec(ddl)
}

export default function db() {
    return pgliteDb;
}
