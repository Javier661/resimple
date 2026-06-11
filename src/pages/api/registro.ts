import type { APIRoute } from "astro";
import { Informacion } from "../../lib/creacion_tabla";
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
        const diatrabajado = body.diatrabajado;
        if (!diatrabajado) {
            return new Response(
                JSON.stringify({ error: "El campo es obligatorio" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            )
        }

        if(diatrabajado < 0){
            return new Response(
                JSON.stringify({ error: "El día trabajado no puede ser negativo" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            )
        }

        const payload = jwt.verify(token, import.meta.env.JWT_SECRET) as { id_usuario: string, nombre : string };

        const result = await Informacion({id_usuario : payload?.id_usuario , diatrabajado: Number(diatrabajado) });
        if (result.error) {
            return new Response(
                JSON.stringify({ error: result.error }),
                { status: 404, headers: { "Content-Type": "application/json" } }
            )
        }
        return new Response(
            JSON.stringify({ rows: result.rows }),
            { status: 200, headers: { "Content-Type": "application/json" } }
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