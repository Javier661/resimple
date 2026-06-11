import { useState } from "react";
import { AgregarUsuario } from "../hooks/usuario";
import Swal from "sweetalert2";
export default function Registrar({open, close}: {open: boolean, close: () => void}) {
    if(!open) return null;
    const [form, setForm] = useState({nombre: "", correo: "", contrasena: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target as HTMLInputElement;
        setForm(prev => ({ 
            ...prev, 
            [name]: value 
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try{
            const { message, error } = await AgregarUsuario({nombre: form.nombre, correo: form.correo, contrasena: form.contrasena });
            if (error) {
                setError(error || "Error desconocido");
                return;
            }
            Swal.fire({
                icon: 'success',
                title: '¡Exito!',
                text: message,
                background: '#1f2937',
                color: '#f9fafb',
                confirmButtonColor: '#22c55e',
                customClass: {
                    popup: 'bg-zinc-900 text-zinc-100 border border-zinc-800 rounded-sm',
                }
            })
        }
        catch(error){
            setError(error instanceof Error ? error.message : "Error desconocido");
        }finally{
            setLoading(false);
        }
    }
    return (
        <>
        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
                <label className="text-xs tracking-widest uppercase text-zinc-500">
                    Nombre
                </label>
                <input
                    type="text"
                    name="nombre"
                    value={form.nombre}
                    onChange={handleChange}
                    placeholder="Juan Pérez"
                    required
                    className="bg-zinc-950 border border-zinc-700 rounded-sm px-3 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-green-500 transition-colors font-mono"
                />
            </div>
            {/* Correo */}
            <div className="flex flex-col gap-1.5">
                <label className="text-xs tracking-widest uppercase text-zinc-500">
                    Correo
                </label>
                <input
                    type="email"
                    name="correo"
                    value={form.correo}
                    onChange={handleChange}
                    placeholder="usuario@correo.cl"
                    required
                    className="bg-zinc-950 border border-zinc-700 rounded-sm px-3 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-green-500 transition-colors font-mono"
                />
            </div>

            {/* Contraseña */}
            <div className="flex flex-col gap-1.5">
                <label className="text-xs tracking-widest uppercase text-zinc-500">
                    Contraseña
                </label>
                <input
                    type="password"
                    name="contrasena"
                    value={form.contrasena}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    className="bg-zinc-950 border border-zinc-700 rounded-sm px-3 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-green-500 transition-colors font-mono"
                />
            </div>

            {/* Error */}
            {error && (
                <div className="flex items-center gap-2 border border-red-900/40 bg-red-900/20 rounded-sm px-3 py-2">
                    <span className="text-red-400 text-xs">✕</span>
                    <p className="text-xs text-red-400 font-mono">{error}</p>
                </div>
            )}

            {/* Botón */}
            <button
                type="submit"
                disabled={loading}
                className="mt-1 bg-green-600 hover:bg-green-500 disabled:opacity-60 disabled:cursor-not-allowed text-white text-xs tracking-widest uppercase font-bold py-2.5 rounded-sm transition-colors"
            >
                {loading ? "Iniciando..." : "Iniciar Sesion →"}
            </button>
        </form>
        <p className="text-center text-xs text-zinc-600 tracking-wider py-3 border-t border-zinc-800">
            ¿Tienes cuenta? <button onClick={close} className="text-green-400 hover:underline">Inicia Sesion</button>
        </p>
        </>
    )
}