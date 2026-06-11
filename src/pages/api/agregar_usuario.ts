import type { APIRoute } from "astro";
import { RegistrarUsuario } from "../../lib/creacion_tabla";
export const POST = (async ({request}) => {
    try{
        const {nombre, correo, contrasena} = await request.json();
        if(!nombre || !correo || !contrasena){
            return new Response(JSON.stringify({error: "Faltan campos requeridos"}), {status: 400});
        }
        const { message, error } = await RegistrarUsuario({ nombre, correo, contrasena });
        if (error) {
            return new Response(JSON.stringify({error: error || "Error desconocido"}), {status: 400 ,  headers: { "Content-Type": "application/json" }});
        }
        return new Response(JSON.stringify({message: message || "Usuario agregado exitosamente"}), {status: 200 , headers: { "Content-Type": "application/json" }});
    }catch(error){
        return new Response(JSON.stringify({error: error instanceof Error ? error.message : "Error desconocido"}), {status: 500, headers: { "Content-Type": "application/json" }});
    }
}) satisfies APIRoute;

export const ALL = (({ request, redirect }) => {
    return redirect("/404", 302);
}) satisfies APIRoute;