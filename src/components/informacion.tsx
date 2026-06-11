import { useState } from "react";
import { Registro } from "../hooks/registro";
interface props {
    original: string;
}
interface Row {
    data: { direccion: string; numero: number; region: string; comuna : string; };
    recolector: string;
    fecha: string;
    diatrabajado: number;
}
const Informacion = ({ original }: props) => {
    const [info, setInfo] = useState<{ rows: Row[]; error: string }>({ rows: [], error: "" });
    const [diatrabajado, setDiatrabajado] = useState<number>(0);
    const [loading, setLoading] = useState(false);
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setInfo({ rows: [], error: "" });
        try{
            const { rows, message , error} = await Registro({ diatrabajado: Number(diatrabajado) , origin : original });
            if(error) {
                setInfo({ rows: [], error: error || "Error desconocido" });                
            }
            setInfo({
                rows: rows ?? [],
                error: message ?? "",
            });
        }catch(error){
            setInfo({ rows: [], error: error instanceof Error ? error.message : "Error desconocido" });
        }finally{
            setLoading(false);
        }
    }
    return (
        <div style={{ maxWidth: "860px", margin: "0 auto" }}>
            <p style={{ fontSize: "11px", color: "#52525b", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "1.5rem" }}>
                Reciclaje <span style={{ color: "#3f3f46" }}>/</span> <span style={{ color: "#4ade80" }}>Ver Registros</span>
            </p>

            {/* Buscador */}
            <div style={{ border: "1px solid #27272a", background: "#18181b", borderRadius: "4px", overflow: "hidden", marginBottom: "2rem" }}>
                <div style={{ borderBottom: "1px solid #27272a", padding: "12px 20px", display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ color: "#4ade80", fontSize: "12px" }}>⬡</span>
                    <h2 style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#71717a" }}>
                        Buscar por día trabajado
                    </h2>
                </div>

                <form onSubmit={handleSubmit} style={{ padding: "20px", display: "flex", gap: "12px", alignItems: "flex-end" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px", flex: 1 }}>
                        <label style={{ fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", color: "#71717a" }}>
                            Día N°
                        </label>
                        <input
                            type="number"
                            name="diatrabajado"
                            placeholder="Ej: 3"
                            value={diatrabajado}
                            onChange={(e) => setDiatrabajado(Number(e.target.value))}
                            style={{ background: "#09090b", border: "1px solid #3f3f46", borderRadius: "3px", padding: "9px 14px", fontSize: "13px", fontFamily: "monospace", color: "#f4f4f5", outline: "none", width: "100%" }}
                            onFocus={e => e.target.style.borderColor = "#4ade80"}
                            onBlur={e => e.target.style.borderColor = "#3f3f46"}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        style={{ background: loading ? "#15803d" : "#16a34a", border: "none", borderRadius: "3px", padding: "9px 24px", fontSize: "10px", fontFamily: "monospace", letterSpacing: "0.12em", textTransform: "uppercase", color: "#fff", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", whiteSpace: "nowrap", opacity: loading ? 0.7 : 1 }}
                        onMouseOver={e => !loading && (e.currentTarget.style.background = "#15803d")}
                        onMouseOut={e => !loading && (e.currentTarget.style.background = "#16a34a")}
                    >
                        {loading ? "Buscando..." : "Buscar →"}
                    </button>
                </form>
            </div>

            {/* Error */}
            {info.error && (
                <div style={{ border: "1px solid rgba(239,68,68,0.3)", background: "rgba(127,29,29,0.2)", borderRadius: "4px", padding: "12px 20px", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ color: "#f87171", fontSize: "14px" }}>✕</span>
                    <p style={{ fontSize: "12px", color: "#f87171", fontFamily: "monospace" }}>{info.error}</p>
                </div>
            )}

            {/* Resultados */}
            {info.rows.length > 0 && (
                <div style={{ border: "1px solid #27272a", background: "#18181b", borderRadius: "4px", overflow: "hidden" }}>
                    <div style={{ borderBottom: "1px solid #27272a", padding: "12px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <h2 style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#71717a" }}>
                            Resultados
                        </h2>
                        <span style={{ fontSize: "11px", background: "rgba(20,83,45,0.3)", color: "#4ade80", padding: "2px 10px", borderRadius: "3px", border: "1px solid rgba(20,83,45,0.5)" }}>
                            {info.rows.length} registro{info.rows.length !== 1 ? "s" : ""}
                        </span>
                    </div>

                    {/* Cabecera columnas */}
                    <div style={{ display: "grid", gridTemplateColumns: "40px 1fr 1fr 1fr 1fr 80px", padding: "8px 20px", borderBottom: "1px solid #27272a", background: "#09090b" }}>
                        {["#", "Dirección", "Región / Comuna", "Recolector", "Fecha", "Día"].map(col => (
                            <span key={col} style={{ fontSize: "9px", letterSpacing: "0.15em", textTransform: "uppercase", color: "#52525b", fontWeight: 600 }}>
                                {col}
                            </span>
                        ))}
                    </div>

                    {/* Filas */}
                    {info.rows.map((row, i) => (
                        <div
                            key={i}
                            style={{ display: "grid", gridTemplateColumns: "40px 1fr 1fr 1fr 1fr 80px", padding: "14px 20px", borderBottom: "1px solid #1c1c1f", alignItems: "center", transition: "background 0.1s" }}
                            onMouseOver={e => (e.currentTarget.style.background = "rgba(39,39,42,0.4)")}
                            onMouseOut={e => (e.currentTarget.style.background = "transparent")}
                        >
                            {/* # */}
                            <span style={{ fontSize: "11px", color: "#3f3f46", fontVariantNumeric: "tabular-nums" }}>
                                {String(i + 1).padStart(2, "0")}
                            </span>

                            {/* Dirección */}
                            <span style={{ fontSize: "13px", color: "#f4f4f5", fontWeight: 600 }}>
                                {row.data?.direccion}
                                <span style={{ color: "#4ade80", fontWeight: 400, marginLeft: "6px" }}>
                                    #{row.data?.numero}
                                </span>
                            </span>

                            {/* Región / Comuna — apiladas verticalmente */}
                            <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                                <span style={{ fontSize: "11px", color: "#a1a1aa" }}>
                                    {row.data?.region ?? "—"}
                                </span>
                                <span style={{ fontSize: "10px", color: "#52525b", letterSpacing: "0.04em" }}>
                                    ◎ {row.data?.comuna ?? "—"}
                                </span>
                            </div>

                            {/* Recolector */}
                            <span style={{ fontSize: "12px", color: "#a1a1aa" }}>
                                👤 {row.recolector}
                            </span>

                            {/* Fecha */}
                            <span style={{ fontSize: "11px", color: "#71717a" }}>
                                {new Date(row.fecha).toLocaleDateString("es-CL", { day: "2-digit", month: "short", year: "numeric" })}
                            </span>

                            {/* Día */}
                            <span style={{ fontSize: "11px", color: "#52525b" }}>
                                Día {row.diatrabajado}
                            </span>
                        </div>
                    ))}
                </div>
            )}

            {/* Empty state */}
            {info.rows.length === 0 && !info.error && (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "5rem 2rem", gap: "12px", color: "#3f3f46", border: "1px dashed #27272a", borderRadius: "4px" }}>
                    <span style={{ fontSize: "2.5rem" }}>♻</span>
                    <p style={{ fontSize: "10px", letterSpacing: "0.15em", textTransform: "uppercase" }}>Ingresa un día para buscar</p>
                </div>
            )}
        </div>
    )
}

export default Informacion;