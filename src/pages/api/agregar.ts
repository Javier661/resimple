import type { APIRoute } from "astro";
import { agregarData } from "../../lib/creacion_tabla";
import jwt from "jsonwebtoken";

export const POST = (async ({ request , cookies}) => {
    try{

        const token = cookies.get("token")?.value;

        if(!token){
            return new Response(
                JSON.stringify({ error: "Token no encontrado o sesión expirada" }),
                { status: 401, headers: { "Content-Type": "application/json" } }
            )
        }

        if (!request.headers.get("Content-Type")?.includes("application/json")) {
            return new Response(
                JSON.stringify({ error: "Content-Type debe ser application/json" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            )
        }

        const body = await request.json();
        const { registros } = body; // 👈 array de objetos

        if (!registros || !Array.isArray(registros) || registros.length === 0) {
            return new Response(
                JSON.stringify({ error: "No hay registros para insertar" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            )
        }

        const playload = jwt.verify(token, import.meta.env.JWT_SECRET) as { id_usuario: string, nombre : string };

        // Insertar cada registro
        const resultados = await Promise.all(
            registros.map(({ data, diaTrabajado, fecha, recolector }) =>
                agregarData({ data, diatrabajado: diaTrabajado, fecha, recolector, id_usuario: playload.id_usuario })
            )
        )

        const errores = resultados.filter(r => r.error);
        if (errores.length > 0) {
            return new Response(
                JSON.stringify({ error: "Algunos registros fallaron", errores }),
                { status: 500, headers: { "Content-Type": "application/json" } }
            )
        }

        return new Response(
            JSON.stringify({ message: `${registros.length} registros insertados correctamente` }),
            { status: 201, headers: { "Content-Type": "application/json" } }
        )
    }catch(error){
        const newMessage = error instanceof Error ? error.message : "Error desconocido";
        return new Response(
            JSON.stringify({
                error : newMessage
            }), { status: 500, headers: { "Content-Type": "application/json" } }
        ) 
    }
}) satisfies APIRoute;

export const ALL = (({ request, redirect }) => {
    return redirect("/404", 302);
}) satisfies APIRoute;