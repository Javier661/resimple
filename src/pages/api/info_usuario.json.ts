import type { APIRoute } from "astro";
import { ObtenerData } from "../../lib/usuario.db";
import jwt from "jsonwebtoken";
export const POST = (async ({ request, cookies }) => {
    try{
        const token = cookies.get("token")?.value;
        if (!token) {
            return new Response(
                JSON.stringify({ error: "No se proporcionó un token de autenticación" }),
                { status: 401, headers: { "Content-Type": "application/json" } }
            );
        }
        const decoded = jwt.verify(token, import.meta.env.JWT_SECRET) as { id_usuario: string, nombre : string };
        const result = await ObtenerData({ id_usuario: decoded.id_usuario });
        if (result.error) {
            return new Response(
                JSON.stringify({ error: result.error }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }
        return new Response(
            JSON.stringify({ data: result.data }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
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