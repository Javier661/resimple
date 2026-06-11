export const ValidarUsuario = async ({ correo, contrasena }: { correo: string, contrasena: string }) => {
    try {
        const response = await fetch("/api/validar_usuario", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ correo, contrasena }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Error en la autenticación");
        return { message: data.message || "Login exitoso" }
    } catch (error) {
        const message = error instanceof Error ? error.message : "Error desconocido"
        return { error: message }
    }
}

export const AgregarUsuario = async ({nombre,correo, contrasena}: {nombre: string, correo: string, contrasena: string}) => {
    try {
        const response = await fetch("/api/agregar_usuario", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nombre, correo , contrasena }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Error al agregar usuario");
        return { message: data.message || "Usuario agregado exitosamente" }
    } catch (error) {
        const message = error instanceof Error ? error.message : "Error desconocido"
        return { error: message }
    }
}

export const ObtenerInfoUsuario = async ({origin, cookieHeader} : {origin: string, cookieHeader?: string}) => {
    try {
        const response = await fetch(`${origin}/api/info_usuario.json`, {
            method: "POST",
            headers: { "Content-Type": "application/json", ...(cookieHeader && { "Cookie": cookieHeader }) },
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Error al obtener información del usuario");
        return { datos : result.data };
    } catch (error) {
        const message = error instanceof Error ? error.message : "Error desconocido";
        return { error: message };
    }
}