import pool from "./db"

export const ObtenerData = async ({ id_usuario }: { id_usuario: string }) => {
    try {
        if (!id_usuario) throw new Error("El id no fue ingresado");
        const { rows } = await pool.query(`SELECT * FROM reciclaje WHERE usuario_id = $1`, [id_usuario]) 
        if(rows.length === 0) throw new Error("No hay datos ingresados");
        return { data: rows }
    }catch (error) {
        const message = error instanceof Error ? error.message : "Error desconocido"
        return { error: message }
    }
}


export const obtenerUsuarios = async () => {
    try {
        const { rows } = await pool.query(`SELECT * FROM usuario`);
        if(rows.length === 0) throw new Error("No hay usuarios registrados");
        return { data: rows }
    }
    catch (error) {
        const message = error instanceof Error ? error.message : "Error desconocido"
        return { error: message }
    }
}