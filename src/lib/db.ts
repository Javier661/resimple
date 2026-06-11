import { Pool } from 'pg';
const pool = new Pool({
    connectionString: import.meta.env.DATABASE_URL,
    ssl: import.meta.env.PROD && process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: false } : false
})

await pool.connect();

await pool.query(`
    CREATE TABLE IF NOT EXISTS usuario (
        id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        nombre     TEXT NOT NULL,
        correo     TEXT NOT NULL UNIQUE,
        contrasena TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS reciclaje (
        id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
        fecha        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        data         JSONB       NOT NULL,
        recolector   TEXT        NOT NULL,
        diatrabajado INTEGER     NOT NULL,
        usuario_id   UUID        NOT NULL REFERENCES usuario(id) ON DELETE CASCADE
    );
`)

export default pool;