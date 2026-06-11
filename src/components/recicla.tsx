import { useState , useEffect} from "react";
import Swal from "sweetalert2";
import { REGIONES } from "../hooks/comunas";
import { Agregar } from "../hooks/registro";

interface DataRegistro {
    fecha: string;
    data: {
        direccion: string;
        numero: number;
        region : string;
        comuna: string;
    };
    recolector: string;
    diaTrabajado: number;
}

const Recicla = ({origin, nombre} : {origin:string, nombre:string} ) => {
    const [data, setData] = useState<DataRegistro[]>([]);
    const [message, setError] = useState<string>("");
    const [region, setRegion] = useState("");
    const [comuna, setComuna] = useState("");
    const [formData, setFormData] = useState({
        calle: "",
        numero: 0,
        region: "",
        comuna: "",
        recolector: nombre,
        diaTrabajado: 0,
    });

    const comunas = region ? REGIONES[region] : [];

    const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setRegion(e.target.value);
        setComuna(""); // ✅ reset comuna al cambiar región
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "number" ? Number(value) : value,
        }));
    };

    const handleAgregar = () => {
        if (data.find(item =>
                item.data.direccion === "" ||
                !item.data.numero ||
                item.data.region === "" ||
                item.data.comuna === "" ||
                item.recolector === "" ||
                !item.diaTrabajado
            )
        ) {

            Swal.fire({
                icon: "warning",
                title: "⚠ Campos incompletos",
                html: `
                    <div style="
                        font-family: monospace;
                        text-align:left;
                        font-size:14px;
                        color:#d4d4d8;
                        line-height:1.7;
                        margin-top:12px;
                    ">

                        Existen registros con información pendiente.

                        <br><br>

                        Debes completar:

                        <ul style="
                            margin-top:12px;
                            padding-left:20px;
                            color:#a1a1aa;
                        ">
                            <li>Región</li>
                            <li>Comuna</li>
                            <li>Calle</li>
                            <li>Número</li>
                            <li>Recolector</li>
                            <li>Día trabajado</li>
                        </ul>

                    </div>
                `,
                background:"#18181b",
                color:"#f4f4f5",

                confirmButtonText:"Entendido",

                confirmButtonColor:"#16a34a",

                customClass:{
                    popup:"swal-popup-custom",
                    title:"swal-title-custom"
                },

                didOpen: () => {

                    const popup = document.querySelector(
                        ".swal-popup-custom"
                    ) as HTMLElement;

                    if (popup) {
                        popup.style.borderRadius = "4px";
                        popup.style.border = "1px solid #3f3f46";
                        popup.style.fontFamily = "monospace";
                    }

                    const title = document.querySelector(
                        ".swal-title-custom"
                    ) as HTMLElement;

                    if (title) {
                        title.style.fontSize = "16px";
                        title.style.letterSpacing = "0.1em";
                        title.style.color = "#facc15";
                    }
                }
            });

            return;
        }

        if (data.find(item => item.data.numero === formData.numero)) {
            setError("Ya existe un registro con ese numero");
            return;
        }
        const dataRegistro: DataRegistro = {
            fecha: new Date().toISOString(),
            data: { direccion: formData.calle, numero: formData.numero, region: region, comuna: comuna },
            recolector: formData.recolector,
            diaTrabajado: formData.diaTrabajado,
        };
        setData(prev => [...prev, dataRegistro]);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (data.length === 0) {
            Swal.fire({
                icon: "info",
                title: "No hay registros",
                background:"#18181b",
                color:"#f4f4f5",
                confirmButtonText:"Entendido",
                confirmButtonColor:"#16a34a",
                customClass:{
                    popup:"swal-popup-custom",
                    title:"swal-title-custom"
                },
            })
            return;
        }

        const result = await Agregar({ data, origin });

        if (result.error) {
            Swal.mixin({
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                background:"#18181b",
                color:"#f4f4f5",
                customClass:{
                    popup:"swal-popup-custom",
                    title:"swal-title-custom"
                },
                didOpen: (toast) => {
                    toast.onmouseenter = Swal.stopTimer;
                    toast.onmouseleave = Swal.resumeTimer;
                }
            }).fire({
                icon: "error",
                title: result.message!,
            })
            return;
        }
        Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            background:"#18181b",
            color:"#f4f4f5",
            customClass:{
                popup:"swal-popup-custom",
                title:"swal-title-custom"
            },
            didOpen: (toast) => {
                toast.onmouseenter = Swal.stopTimer;
                toast.onmouseleave = Swal.resumeTimer;
            }
        }).fire({
            icon: "success",
            title: result.message!,
        })
        setFormData({ calle: "", numero: 0, recolector: "", diaTrabajado: 0, region: "", comuna: "" });
    };

    const handleEliminar = (index: number) => {
        setData(prev => prev.filter((_, i) => i !== index));
    };

    const Editar = (index: number) => {
        const registro = data[index];
        if (!registro) return;

        const regionesOptions = Object.keys(REGIONES).map(r =>
            `<option value="${r}" ${r === registro.data.region ? "selected" : ""}>
                ${r}
            </option>`
        ).join("");

        const comunasOptions = REGIONES[registro.data.region]?.map(c =>
            `<option value="${c}" ${c === registro.data.comuna ? "selected" : ""}>
                ${c}
            </option>`
        ).join("");


        Swal.fire({
            title: "✏️ Editar registro",
            html: `
                <style>
                    .swal-edit-container { display: flex; flex-direction: column; gap: 16px; margin-top: 8px; }
                    .swal-field { display: flex; flex-direction: column; gap: 6px; text-align: left; }
                    .swal-label {
                        font-size: 10px;
                        font-family: monospace;
                        letter-spacing: 0.15em;
                        text-transform: uppercase;
                        color: #71717a;
                        font-weight: 600;
                    }
                    .swal-input-custom {
                        width: 100%;
                        background: #09090b;
                        border: 1px solid #3f3f46;
                        border-radius: 4px;
                        padding: 10px 14px;
                        font-size: 14px;
                        font-family: monospace;
                        color: #f4f4f5;
                        outline: none;
                        box-sizing: border-box;
                        transition: border-color 0.15s;
                    }
                    .swal-input-custom::placeholder { color: #52525b; }
                    .swal-input-custom:focus { border-color: #4ade80; box-shadow: 0 0 0 3px rgba(74,222,128,0.1); }
                </style>
                <div class="swal-edit-container">

                <div class="swal-field">
                    <label>Región</label>

                    <select id="swal-region" class="swal-input-custom">
                        ${regionesOptions}
                    </select>
                </div>

                <div class="swal-field">
                    <label>Comuna</label>

                    <select id="swal-comuna" class="swal-input-custom">
                        ${comunasOptions}
                    </select>
                </div>

                <div class="swal-field">
                    <label>Calle</label>

                    <input
                        id="swal-calle"
                        class="swal-input-custom"
                        value="${registro.data.direccion}"
                    />
                </div>

                <div class="swal-field">
                    <label>Número</label>

                    <input
                        id="swal-numero"
                        type="number"
                        class="swal-input-custom"
                        value="${registro.data.numero}"
                    />
                </div>

            </div>
            `,
            background: "#18181b",
            color: "#f4f4f5",
            confirmButtonText: "Guardar cambios",
            confirmButtonColor: "#16a34a",
            showCancelButton: true,
            cancelButtonText: "Cancelar",
            cancelButtonColor: "#3f3f46",
            customClass: {
                popup: "swal-popup-custom",
                title: "swal-title-custom",
            },
            didOpen: () => {
                // Estilos al popup y título que no se pueden hacer desde html
                const popup = document.querySelector(".swal-popup-custom") as HTMLElement;
                if (popup) {
                    popup.style.borderRadius = "4px";
                    popup.style.border = "1px solid #3f3f46";
                    popup.style.fontFamily = "monospace";
                }
                const title = document.querySelector(".swal-title-custom") as HTMLElement;
                if (title) {
                    title.style.fontSize = "16px";
                    title.style.letterSpacing = "0.1em";
                    title.style.color = "#4ade80";
                }

                const regionSelect = document.getElementById("swal-region") as HTMLSelectElement;
                const comunaSelect = document.getElementById("swal-comuna") as HTMLSelectElement;

                // Cambio dinámico de comunas
                regionSelect.addEventListener("change", () => {
                    const nuevasComunas = REGIONES[regionSelect.value] || [];
                    comunaSelect.innerHTML =
                        nuevasComunas.map(c=>
                            `<option value="${c}">
                                ${c}
                            </option>`
                        ).join("");
                });
            },
            preConfirm: () => {
                const regionEl = document.getElementById("swal-region") as HTMLSelectElement | null;
                const comunaEl = document.getElementById("swal-comuna") as HTMLSelectElement | null;
                const calleEl = document.getElementById("swal-calle") as HTMLInputElement | null;
                const numeroEl = document.getElementById("swal-numero") as HTMLInputElement | null;
                if (!calleEl || !numeroEl) return null;
                return { 
                    calle: calleEl.value, 
                    numero: Number(numeroEl.value) , 
                    region: regionEl!.value,
                    comuna: comunaEl!.value
                };
            }
        }).then((result) => {
            if (result.isConfirmed && result.value) {
                setData(prev =>
                    prev.map((item, i) =>
                        i === index
                            ? { ...item, data: { direccion: result.value.calle, numero: result.value.numero, region: result.value.region, comuna: result.value.comuna } }
                            : item
                    )
                );
            }
        });
    };

    const formatFecha = (iso: string) => {
        const d = new Date(iso);
        return d.toLocaleDateString("es-CL", { day: "2-digit", month: "short", year: "numeric" });
    };

    const selectStyle: React.CSSProperties = {
        background: "#09090b",
        border: "1px solid #3f3f46",
        borderRadius: "3px",
        padding: "9px 14px",
        fontSize: "13px",
        fontFamily: "monospace",
        color: "#f4f4f5",
        outline: "none",
        width: "100%",
        cursor: "pointer",
        appearance: "none",
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2371717a' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 12px center",
        paddingRight: "32px",
    };

    const labelStyle: React.CSSProperties = {
        fontSize: "10px",
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: "#71717a",
    };

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setError("");
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [message]);

    return (
        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr", gap: "2rem" }}
            className="lg:grid-cols-5-custom">
                {message && (
                    <div style={{ border: "1px solid rgba(239,68,68,0.3)", background: "rgba(127,29,29,0.2)", borderRadius: "4px", padding: "12px 20px", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "10px" }}>
                        <span style={{ color: "#f87171", fontSize: "14px" }}>✕</span>
                        <p style={{ fontSize: "12px", color: "#f87171", fontFamily: "monospace" }}>{message}</p>
                    </div>
                )}
            <div style={{ display: "grid", gridTemplateColumns: "2fr 3fr", gap: "2rem", alignItems: "start" }}>
                {/* ── Formulario ── */}
                <div>
                    <p style={{ fontSize: "11px", color: "#52525b", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "1rem" }}>
                        Reciclaje <span style={{ color: "#3f3f46" }}>/</span> <span style={{ color: "#4ade80" }}>Ingresar</span>
                    </p>

                    <div style={{ border: "1px solid #27272a", background: "#18181b", borderRadius: "4px", overflow: "hidden" }}>
                        <div style={{ borderBottom: "1px solid #27272a", padding: "12px 20px" }}>
                            <h2 style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#71717a" }}>
                                Nuevo registro
                            </h2>
                        </div>

                        <form onSubmit={handleSubmit} style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
                            <div style={{ display: "grid", gridTemplateColumns: region ? "1fr 1fr" : "1fr", gap: "12px", transition: "all 0.2s" }}>
                                {/* Región */}
                                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                                    <label style={labelStyle}>Región</label>
                                    <select
                                        value={region}
                                        onChange={handleRegionChange}
                                        style={selectStyle}
                                        onFocus={e => e.target.style.borderColor = "#4ade80"}
                                        onBlur={e => e.target.style.borderColor = "#3f3f46"}
                                    >
                                        <option value="">— Selecciona una región —</option>
                                        {Object.keys(REGIONES).map(r => (
                                            <option key={r} value={r}>{r}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Comuna — solo aparece si hay región seleccionada */}
                                {region && (
                                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                                        <label style={labelStyle}>
                                            Comuna <span style={{ color: "#4ade80" }}>· {region}</span>
                                        </label>
                                        <select
                                            value={comuna}
                                            onChange={e => setComuna(e.target.value)}
                                            style={selectStyle}
                                            onFocus={e => e.target.style.borderColor = "#4ade80"}
                                            onBlur={e => e.target.style.borderColor = "#3f3f46"}
                                        >
                                            <option value="">— Selecciona una comuna —</option>
                                            {comunas.map(c => (
                                                <option key={c} value={c}>{c}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                            </div>
                            {[
                                { label: "Calle", name: "calle", type: "text", placeholder: "Av. Los Aromos", value: formData.calle },
                                { label: "Número", name: "numero", type: "number", placeholder: "1234", value: formData.numero || "" },
                                { label: "Recolector", name: "recolector", type: "text", placeholder: "Nombre del recolector", value: formData.recolector },
                                { label: "Día trabajado", name: "diaTrabajado", type: "number", placeholder: "0", value: formData.diaTrabajado || "" },
                            ].map(field => (
                                <div key={field.name} style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                                    <label style={{ fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", color: "#71717a" }}>
                                        {field.label}
                                    </label>
                                    <input
                                        type={field.type}
                                        name={field.name}
                                        value={field.value}
                                        placeholder={field.placeholder}
                                        onChange={handleChange}
                                        style={{
                                            background: "#09090b",
                                            border: "1px solid #3f3f46",
                                            borderRadius: "3px",
                                            padding: "8px 12px",
                                            fontSize: "13px",
                                            fontFamily: "monospace",
                                            color: "#f4f4f5",
                                            outline: "none",
                                            width: "100%",
                                        }}
                                        onFocus={e => e.target.style.borderColor = "#4ade80"}
                                        onBlur={e => e.target.style.borderColor = "#3f3f46"}
                                        disabled={field.name === "recolector" ? true : false}
                                    />
                                </div>
                            ))}

                            <div style={{ display: "flex", gap: "8px", paddingTop: "4px" }}>
                                <button
                                    type="button"
                                    onClick={handleAgregar}
                                    style={{
                                        flex: 1, background: "#27272a", border: "1px solid #3f3f46",
                                        borderRadius: "3px", padding: "10px", fontSize: "10px",
                                        letterSpacing: "0.12em", textTransform: "uppercase",
                                        color: "#a1a1aa", cursor: "pointer", fontFamily: "monospace",
                                    }}
                                    onMouseEnter={e => (e.currentTarget.style.background = "#3f3f46")}
                                    onMouseLeave={e => (e.currentTarget.style.background = "#27272a")}
                                >
                                    + Agregar
                                </button>
                                <button
                                    type="submit"
                                    style={{
                                        flex: 1, background: "#16a34a", border: "none",
                                        borderRadius: "3px", padding: "10px", fontSize: "10px",
                                        letterSpacing: "0.12em", textTransform: "uppercase",
                                        color: "#fff", cursor: "pointer", fontWeight: 700, fontFamily: "monospace",
                                    }}
                                    onMouseEnter={e => (e.currentTarget.style.background = "#15803d")}
                                    onMouseLeave={e => (e.currentTarget.style.background = "#16a34a")}
                                >
                                    Enviar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* ── Tabla ── */}
                <div>
                    <p style={{ fontSize: "11px", color: "#52525b", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "1rem" }}>
                        Reciclaje <span style={{ color: "#3f3f46" }}>/</span> <span style={{ color: "#4ade80" }}>Registros del día</span>
                    </p>

                    <div style={{ border: "1px solid #27272a", background: "#18181b", borderRadius: "4px", overflow: "hidden" }}>
                        <div style={{ borderBottom: "1px solid #27272a", padding: "12px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <h2 style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#71717a" }}>
                                Registros
                            </h2>
                            {data.length > 0 && (
                                <span style={{ fontSize: "11px", background: "rgba(20,83,45,0.3)", color: "#4ade80", padding: "2px 8px", borderRadius: "3px", border: "1px solid rgba(20,83,45,0.6)" }}>
                                    {data.length} total
                                </span>
                            )}
                        </div>

                        {data.length === 0 ? (
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "5rem 2rem", gap: "12px", color: "#3f3f46" }}>
                                <span style={{ fontSize: "2.5rem" }}>♻</span>
                                <p style={{ fontSize: "10px", letterSpacing: "0.15em", textTransform: "uppercase" }}>Sin registros aún</p>
                                <p style={{ fontSize: "10px", color: "#27272a" }}>Agrega uno desde el formulario</p>
                            </div>
                        ) : (
                            <div>
                                {data.map((item, index) => (
                                    <div
                                        key={index}
                                        style={{ padding: "16px 20px", borderBottom: "1px solid #27272a", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px" }}
                                        onMouseEnter={e => (e.currentTarget.style.background = "rgba(39,39,42,0.4)")}
                                        onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                                        className="registro-row"
                                    >
                                        <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                                            <span style={{ fontSize: "11px", color: "#3f3f46", minWidth: "20px", textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
                                                {String(index + 1).padStart(2, "0")}
                                            </span>
                                            <div>
                                                <p style={{ fontSize: "13px", color: "#f4f4f5", fontWeight: 600 }}>
                                                    {item.data.direccion}
                                                    <span style={{ color: "#4ade80", marginLeft: "8px", fontWeight: 400 }}>#{item.data.numero}</span>,
                                                    {item.data.region}, {item.data.comuna}
                                                </p>
                                                <div style={{ display: "flex", gap: "12px", marginTop: "6px", flexWrap: "wrap" }}>
                                                    {item.recolector && (
                                                        <span style={{ fontSize: "11px", color: "#71717a" }}>👤 {item.recolector}</span>
                                                    )}
                                                    <span style={{ fontSize: "11px", color: "#71717a" }}>📅 Día {item.diaTrabajado}</span>
                                                    <span style={{ fontSize: "11px", color: "#52525b" }}>{formatFecha(item.fecha)}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div style={{ display: "flex", gap: "4px", flexShrink: 0 }}>
                                            <button
                                                onClick={() => Editar(index)}
                                                style={{ fontSize: "11px", padding: "6px 10px", background: "#27272a", border: "1px solid #3f3f46", borderRadius: "3px", color: "#a1a1aa", cursor: "pointer", fontFamily: "monospace" }}
                                                onMouseEnter={e => (e.currentTarget.style.background = "#3f3f46")}
                                                onMouseLeave={e => (e.currentTarget.style.background = "#27272a")}
                                            >
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => handleEliminar(index)}
                                                style={{ fontSize: "11px", padding: "6px 10px", background: "rgba(127,29,29,0.2)", border: "1px solid rgba(127,29,29,0.4)", borderRadius: "3px", color: "#f87171", cursor: "pointer", fontFamily: "monospace" }}
                                                onMouseEnter={e => (e.currentTarget.style.background = "rgba(127,29,29,0.5)")}
                                                onMouseLeave={e => (e.currentTarget.style.background = "rgba(127,29,29,0.2)")}
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Recicla;