export const Registro = async ({diatrabajado, origin} : {diatrabajado : number, origin : string}) => {
    try{
        const response = await fetch(`${origin}/api/registro`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ diatrabajado })
        });
        
        const result = await response.json();
        if(!response.ok) {
            throw new Error(result.error || "Error en la petición");
        }
        return {rows : result.rows, error: null}
    }catch(error){
        const message = error instanceof Error ? error.message : "Error desconocido";
        return { message }
    }
}

export const Agregar = async ({ data, origin }: { data: any[], origin: string }) => {
    try {
        const response = await fetch(`${origin}/api/agregar`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ registros: data }) // 👈 mandas la data real
        })
        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.error || "Error en la petición");
        }
        
        return { message: result.message, error: null }

    } catch (error) {
        const message = error instanceof Error ? error.message : "Error desconocido";
        return { message: null, error: message }
    }
}