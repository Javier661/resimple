import { useState, useEffect, useCallback} from "react";
import { ValidarUsuario } from "../hooks/usuario";
import Registrar from "./registrar";
import Swal from "sweetalert2";
export default function Inicio({title}: {title: string}) {
    const [form, setForm] = useState({ correo: "", contrasena: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

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
            const { message, error } = await ValidarUsuario({ correo: form.correo, contrasena: form.contrasena });
            if (error) {
                setError(error || "Error desconocido");
                return;
            }
            Swal.fire({
                icon: 'success',
                title: '¡Bienvenido!',
                text: message,
                confirmButtonText: 'Continuar',
                background: '#1f2937',
                color: '#f9fafb',
                confirmButtonColor: '#22c55e',
                customClass: {
                    popup: 'bg-zinc-900 text-zinc-100 border border-zinc-800 rounded-sm',
                }
            }).then(confirm => {
                if (confirm.isConfirmed) {
                    window.location.href = "/dashboard"; // Redirige a la página de información después del login exitoso
                }
            })
        }
        catch(error){
            setError(error instanceof Error ? error.message : "Error desconocido");
        }finally{
            setLoading(false);
        }
    }

    const MensajeDown = useCallback(() => {
        const mensaje = localStorage.getItem("logout");
        if(mensaje){
            Swal.fire({
                icon: 'success',
                title: '¡Hasta luego!',
                text: mensaje,
                confirmButtonText: 'Cerrar',
                background: '#1f2937',
                color: '#f9fafb',
                confirmButtonColor: '#22c55e',
                customClass: {
                    popup: 'bg-zinc-900 text-zinc-100 border border-zinc-800 rounded-sm',
                }
            });
            localStorage.removeItem("logout");
        }
    },[])
    useEffect(() => {
        MensajeDown();
    }, [MensajeDown]);
    return (
        <div className="min-h-[calc(100vh-60px)] flex items-center justify-center px-4">
            <div className="w-full max-w-sm">

                {/* Logo */}
                <div className="flex flex-col items-center mb-8">
                    <span className="text-4xl mb-3">♻</span>
                    <h1 className="text-sm font-bold tracking-widest uppercase text-green-400">
                        ReciclaTrack
                    </h1>
                    <p className="text-xs text-zinc-600 tracking-wider mt-1">
                        {!open ? "Accede a tu cuenta" : "Crea tu cuenta para empezar a reciclar"}
                    </p>
                </div>

                {/* Card */}
                <div className="border border-zinc-800 bg-zinc-900 rounded-sm overflow-hidden">

                    {/* Header */}
                    <div className="border-b border-zinc-800 px-5 py-3 flex items-center gap-2">
                        <span className="text-green-400 text-xs">⬡</span>
                        <h2 className="text-xs font-bold tracking-widest uppercase text-zinc-500">
                            {!open ? title : "Registrar Cuenta"}
                        </h2>
                    </div>

                    {/* Form */}
                    {open ? <Registrar open={open} close={() => setOpen(false)}/> : (
                        <>
                        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">

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
                            {loading ? "Ingresando..." : "Ingresar →"}
                        </button>
                    </form>
                    <p className="text-center text-xs text-zinc-600 tracking-wider py-3 border-t border-zinc-800">
                        ¿No tienes cuenta? <button onClick={() => setOpen(true)} className="text-green-400 hover:underline">Registrate</button>
                    </p>
                    </>
                    )}
                </div>

                {/* Footer */}
                <p className="text-center text-xs text-zinc-700 mt-6 tracking-wider">
                    ReciclaTrack · Sistema de recolección
                </p>
            </div>
        </div>
    )
}

