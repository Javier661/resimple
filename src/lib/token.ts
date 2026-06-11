import jwt from "jsonwebtoken";
import type { AstroGlobal } from "astro";
interface TokenPayload {
    nombre: string;
    id_usuario: string;
}
const getToken = (Astro: AstroGlobal) => {
    try {
        const token = Astro.cookies.get("token")?.value;
        if (!token) throw new Error("Token no encontrado o sesion expirada");

        const SECRET = import.meta.env.JWT_SECRET;
        const payload = jwt.verify(token, SECRET) as TokenPayload;

        return { token: payload, error: null }
    } catch (error) {
        const message = error instanceof Error ? error.message : "Error desconocido";
        return { token: null, error: message }
    }
}

export default getToken;