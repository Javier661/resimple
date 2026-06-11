import type { APIRoute } from "astro";
import { ValidarUsuario } from "../../lib/creacion_tabla";
import jwt from "jsonwebtoken";
export const POST = (async ({ request, cookies }) => {
    const SECRET = import.meta.env.JWT_SECRET;
    try{
        if (!request.headers.get("Content-Type")?.includes("application/json")) {
            return new Response(JSON.stringify({ error: "Content-Type debe ser application/json" }), { status: 400, headers: { "Content-Type": "application/json" } })
        }
        const body = await request.json();
        const { correo, contrasena } = body;
        if (!correo || !contrasena) {
            return new Response(JSON.stringify({ error: "Correo y contraseña son obligatorios" }), { status: 400, headers: { "Content-Type": "application/json" } })
        }
        const result = await ValidarUsuario({ correo, contrasena });
        if (result.error) {
            return new Response(JSON.stringify({ error: result.error }), { status: 401, headers: { "Content-Type": "application/json" } })
        }
        const token = jwt.sign({nombre : result.nombre, id_usuario : result.id}, SECRET , { expiresIn: "1d" , algorithm: "HS256"});
        cookies.set("token",token,{
            secure : import.meta.env.PROD || false,
            httpOnly: true,
            sameSite: "strict",
            maxAge: 60 * 60 * 24, // 1 día
            path: "/"
        })
        return new Response(JSON.stringify({ message: result.message }), { status: 200, headers: { "Content-Type": "application/json" } })
    }catch(error){
        const newMessage = error instanceof Error ? error.message : "Error desconocido";
        return new Response(JSON.stringify({ error : newMessage }), { status: 500, headers: { "Content-Type": "application/json" } })
    }
}) satisfies APIRoute;

export const ALL = (({ request, redirect }) => {
    return redirect("/404", 302);
}) satisfies APIRoute;