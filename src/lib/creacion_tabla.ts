import pool from "./db"
import bcrypt from "bcryptjs"
export const Informacion = async ({id_usuario, diatrabajado }: {id_usuario: string, diatrabajado: number }) => {
    try {
        if(!diatrabajado) throw new Error("El día trabajado no fue ingresado")
        const { rows } = await pool.query(`SELECT * FROM reciclaje WHERE usuario_id = $1 AND diatrabajado = $2`, [id_usuario,diatrabajado])
        if (rows.length === 0) throw new Error("No hay datos ingresados");
        return { rows }
    } catch (error) {
        const message = error instanceof Error ? error.message : "Error desconocido"
        return { error: message }
    }
}

export const agregarData = async ({
    data,
    diatrabajado,
    fecha,
    recolector,
    id_usuario
}: {
    data: object[],
    diatrabajado: number, // 👈 estaba "diatrabajdo" (typo)
    fecha: string,
    recolector: string,
    id_usuario: string
}) => {
    try {
        const result = await pool.query(
            'INSERT INTO reciclaje (fecha, data, recolector, diatrabajado, usuario_id) VALUES ($1, $2, $3, $4, $5)',
            [fecha, JSON.stringify(data), recolector, diatrabajado, id_usuario] // 👈 JSONB necesita stringify
        )
        if (result.rowCount === 0) return { error: "No pude ingresar la data" }
        return { message: "Locaciones agregadas exitosamente" }
    } catch (error) {
        const message = error instanceof Error ? error.message : "Error desconocido"
        return { error: message }
    }
}

export const RegistrarUsuario = async ({ nombre, correo, contrasena }: { nombre: string, correo: string, contrasena: string }) => {
    try{
        const hashedPassword = bcrypt.hashSync(contrasena, 10);
        const {rows} = await pool.query(`SELECT * FROM usuario WHERE correo = $1`, [correo]);
        if(rows.length > 0) return { error: "Correo ya registrado" }
        const insertResult = await pool.query(`INSERT INTO usuario (nombre, correo, contrasena) VALUES ($1, $2, $3) RETURNING id` , [nombre, correo, hashedPassword]);
        if(insertResult.rowCount === 0) return { error: "No pude registrar el usuario" }
        return { message: "Usuario registrado exitosamente" }
    }catch(error){
        const message = error instanceof Error ? error.message : "Error desconocido"
        return { error: message }
    }
}

export const ValidarUsuario = async ({ correo, contrasena }: { correo: string, contrasena: string }) => {
    try {
        const { rows } = await pool.query(`SELECT * FROM usuario WHERE correo = $1` , [correo])
        if (rows.length === 0) return { error: "Correo no registrado" }
        const user = rows[0];
        if(!bcrypt.compareSync(contrasena, user.contrasena)) return { error: "Contraseña incorrecta" };
        return {nombre : user.nombre, id : user.id, message: "Login exitoso" }
    }catch(error){
        const message = error instanceof Error ? error.message : "Error desconocido"
        return { error: message }
    }
}
