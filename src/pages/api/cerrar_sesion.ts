import type { APIRoute } from "astro";

export const GET = (async ({request, cookies, redirect}) => {
    try{
        const token = cookies.get("token")?.value;
        if(!token) {
            return redirect("/", 302);
        }
        cookies.delete("token", { path: "/" });
        return new Response(JSON.stringify({ message: "Sesión cerrada exitosamente" }), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }catch(error){
        return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Error desconocido" }), {
            status: 500,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }
}) satisfies APIRoute;

export const ALL = (({ request, redirect }) => {
    return redirect("/404", 302);
}) satisfies APIRoute;