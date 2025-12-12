import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Save, Search, FolderClosed, Eye } from 'lucide-react';


const ServiceForm = () => {

    const navigate = useNavigate();

    const query = new URLSearchParams(useLocation().search);
    const modo = query.get("modo"); // "ver", "conformidad", "evidencias"

    console.log('modo', modo);

    const mostrarCampoConformidad = modo === "conformidad";
    const mostrarCampoEvidencias = modo === "evidencias";


    // -------------------------------------------------------------------------------
    // -------------------------------------------------------------------------------
    // -------------------------------------------------------------------------------  

    const { id } = useParams();

    const [loading, setLoading] = useState(false);
    const [newFiles, setNewFiles] = useState({
        archivos1: null,
        archivos2: null,
        archivos3: null
    });
    const [formData, setFormData] = useState({
        cotizacion: '',
        fecha: new Date().toISOString().split('T')[0],
        cliente: '',
        detalleServicio: '',
        tecnico: '',
        fechaServicio: '',
        observacion: '',
        conformidadCliente: '',
        evidencia: {
            casilla1: false,
            casilla2: false,
            casilla3: false,
            archivos: '',
            archivos1: null,
            archivos2: null,
            archivos3: null
        },
        evidencias: [String] // rutas de imágenes
    });

    useEffect(() => {
        if (id) {
            fetchService();
        }
    }, [id]);

    const fetchService = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_URL_BACKEND}/api/services`);
            //const response = await axios.get(`http://localhost:5000/api/services`);
            // For now, I'll use the list endpoint and find.
            const found = response.data.find(s => s._id === id);
            if (found) {
                setFormData({
                    ...found,
                    fecha: found.fecha ? found.fecha.split('T')[0] : '',
                    fechaServicio: found.fechaServicio ? found.fechaServicio.split('T')[0] : '',
                });
            }
        } catch (error) {
            console.error('Error fetching service:', error);
        }
    };



    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        console.log('=== INICIO HANDLESUBMIT ===');
        console.log('📋 ID:', id);
        console.log('📋 Modo:', modo);
        console.log('📋 newFiles:', newFiles);
        console.log('📋 formData.evidencia:', formData.evidencia);

        try {
            // Verificar si hay archivos nuevos para subir
            const hasNewFiles = newFiles.archivos1 || newFiles.archivos2 || newFiles.archivos3;
            console.log('📋 hasNewFiles:', hasNewFiles);
            console.log('📋 Condición completa:', id && hasNewFiles && modo === 'evidencias');

            if (id && hasNewFiles && modo === 'evidencias') {
                // Si hay archivos nuevos en modo evidencias, usar FormData
                console.log('✅ Entrando a la rama de archivos...');

                const data = new FormData();

                // Agregar los archivos si existen
                if (newFiles.archivos1) {
                    data.append('evidencia1', newFiles.archivos1);
                    console.log('Archivo 1:', newFiles.archivos1.name);
                }
                if (newFiles.archivos2) {
                    data.append('evidencia2', newFiles.archivos2);
                    console.log('Archivo 2:', newFiles.archivos2.name);
                }
                if (newFiles.archivos3) {
                    data.append('evidencia3', newFiles.archivos3);
                    console.log('Archivo 3:', newFiles.archivos3.name);
                }

                // Agregar otros campos del formulario
                data.append('detalleServicio', formData.detalleServicio);
                data.append('fechaServicio', formData.fechaServicio);
                data.append('observacion', formData.observacion || '');
                data.append('conformidadCliente', formData.conformidadCliente || '');

                console.log('Enviando a:', `${import.meta.env.VITE_URL_BACKEND}/api/editar-servicio/${id}?modo=${modo}`);

                const response = await axios.put(
                    `${import.meta.env.VITE_URL_BACKEND}/api/editar-servicio/${id}?modo=${modo}`,
                    data,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    }
                );

                console.log('✅ Respuesta del servidor:', response.data);

                // Limpiar newFiles después de guardar
                setNewFiles({
                    archivos1: null,
                    archivos2: null,
                    archivos3: null
                });

                // Recargar los datos del servidor para obtener los nombres de archivo correctos
                await fetchService();

                alert('✅ Archivos guardados correctamente');

            } else if (id) {
                // Si no hay archivos nuevos, usar la ruta normal
                console.log('Actualizando sin archivos...');
                await axios.put(`${import.meta.env.VITE_URL_BACKEND}/api/services/${id}`, formData);
                navigate('/relacioncotizaciones');
            } else {
                // Crear nuevo servicio
                console.log('Creando nuevo servicio...');
                await axios.post(`${import.meta.env.VITE_URL_BACKEND}/api/services`, formData);
                navigate('/relacioncotizaciones');
            }

        } catch (error) {
            console.error('Error saving service:', error);
            console.error('Error details:', error.response?.data);
            alert('Error al guardar el servicio: ' + (error.response?.data?.error || error.message));
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name.startsWith('evidencia.')) {
            const evidenceField = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                evidencia: {
                    ...prev.evidencia,
                    [evidenceField]: checked
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleChangeFile = (e) => {
        const file = e.target.files[0];
        const { name } = e.target;

        if (!file) return;

        console.log('name', name);
        console.log('file', file);

        if (name.startsWith('evidencia.')) {
            const evidenceField = name.split('.')[1]; // archivos1, archivos2, archivos3
            console.log('evidenceField', evidenceField);

            // Guardar el nombre del archivo en formData (para mostrar en UI)
            setFormData(prev => ({
                ...prev,
                evidencia: {
                    ...prev.evidencia,
                    [evidenceField]: file.name
                }
            }));

            // Guardar el File object en newFiles (para subir al servidor)
            setNewFiles(prev => ({
                ...prev,
                [evidenceField]: file
            }));
        }

        console.log('Archivo seleccionado:', file.name);
    };

    const handleViewFile = (fileName) => {
        if (fileName) {
            // Construir la URL completa del archivo
            const fileUrl = `${import.meta.env.VITE_URL_BACKEND}/uploads/evidencias/${fileName}`;
            console.log('🔍 Abriendo archivo:', fileName);
            console.log('🔍 URL completa:', fileUrl);
            console.log('🔍 VITE_URL_BACKEND:', import.meta.env.VITE_URL_BACKEND);
            // Abrir en nueva pestaña
            window.open(fileUrl, '_blank');
        } else {
            console.error('❌ No hay nombre de archivo');
        }
    };


    const enviarFormulario = async (e) => {

        try {
            // const data = new FormData();

            // // ✅ Campos generales
            // data.append("detalle", formData.detalleServicio || "");
            // data.append("fechaServicio", formData.fechaServicio || "");

            // // ✅ Evidencias (solo si el modo es evidencias)
            // if (modo === "evidencias") {
            //     Object.keys(formData.evidencia.archivos).forEach((num) => {
            //         const file = formData.evidencia.archivos[num];
            //         if (file) {
            //             data.append(`evidencia${num}`, file);
            //         }
            //     });
            // }

            console.log('Datos enviados:', formData);

            response = await axios.put(`${import.meta.env.VITE_URL_BACKEND}/api/services/${id}`, formData)

            //const response = await axios.put(
            // `${import.meta.env.VITE_URL_BACKEND}/api/services/${id}?modo=${modo}`,
            // data,
            // {
            //     headers: {
            //         "Content-Type": "multipart/form-data"
            //     }
            // }                  
            //  );

            console.log("✅ Guardado en BD:", response.data);

        } catch (error) {
            console.error("❌ Error al enviar formulario:", error);
        }
    };


    return (
        <div className="max-w-4xl mx-auto bg-white p-8 shadow-lg rounded-lg border border-gray-200">

            {modo == 'ver' && <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">
                Ver Servicio #{id}</h2>}

            {modo == 'conformidad' && <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">
                Conformidad del Servicio #{id}</h2>}

            {modo == 'evidencias' && <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">
                Evidencias del Servicio #{id}</h2>}



            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Header Section: Cotizacion & Fecha */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1"># Cotización</label>
                        <input
                            disabled
                            type="text"
                            name="cotizacion"
                            value={formData.cotizacion}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-200 disabled:text-gray-800 disabled:cursor-not-allowed"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
                        <input
                            type="date"
                            name="fecha"
                            value={formData.fecha}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-200 disabled:text-gray-800 disabled:cursor-not-allowed"
                            disabled
                        />
                    </div>
                </div>

                {/* Cliente */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
                    <input
                        type="text"
                        name="cliente"
                        value={formData.cliente}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-200 disabled:text-gray-800 disabled:cursor-not-allowed"
                        required
                        disabled
                    />
                </div>

                {/* Detalle del Servicio */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Detalle del Servicio</label>
                    <textarea
                        name="detalleServicio"
                        value={formData.detalleServicio}
                        onChange={handleChange}
                        rows="4"
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-200 disabled:text-gray-800 disabled:cursor-not-allowed"
                        required
                        disabled
                    ></textarea>
                </div>

                {/* Técnico y Fecha Servicio */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Técnico</label>
                        <input
                            type="text"
                            name="tecnico"
                            value={formData.tecnico}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-200 disabled:text-gray-800 disabled:cursor-not-allowed"
                            required
                            disabled
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Servicio</label>
                        <input
                            type="date"
                            name="fechaServicio"
                            value={formData.fechaServicio}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-200 disabled:text-gray-800 disabled:cursor-not-allowed"
                            required
                            disabled={modo == 'ver'}
                        />
                    </div>
                </div>

                {/* Observación */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Observación</label>
                    <textarea
                        name="observacion"
                        value={formData.observacion}
                        onChange={handleChange}
                        rows="3"
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-200 disabled:text-gray-800 disabled:cursor-not-allowed"
                        disabled={modo == 'ver'}
                    ></textarea>
                </div>

                {/* Conformidad Cliente */}
                <div className="border border-gray-300 rounded-md p-4 bg-gray-50">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Conformidad Cliente (Firma)</label>
                    <input
                        type="text"
                        name="conformidadCliente"
                        value={formData.conformidadCliente}
                        onChange={handleChange}
                        placeholder="Nombre o Firma del Cliente"
                        className="w-full p-2 border-b border-gray-400 bg-transparent focus:outline-none focus:border-indigo-500 disabled:bg-gray-200 disabled:text-gray-800 disabled:cursor-not-allowed"
                        disabled={modo == 'ver'}
                    />
                    <p className="text-xs text-gray-500 mt-1 text-right">Firma</p>
                </div>

                {/* Evidencia */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Evidencias</label>

                    <div className="flex flex-col gap-4">

                        {[1, 2, 3].map((num) => (
                            <div key={num} className="border p-3 rounded-md">

                                {/* Checkbox */}
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name={`evidencia.casilla${num}`}
                                        checked={formData.evidencia[`casilla${num}`]}
                                        onChange={handleChange}
                                        disabled={modo === "ver"}
                                        className="h-5 w-5 text-indigo-600 border-gray-300 rounded disabled:bg-gray-200 disabled:cursor-not-allowed"
                                    />
                                    <span className="text-sm text-gray-600">Casilla {num}</span>
                                </label>

                                {/* Input de archivo */}
                                {formData.evidencia[`casilla${num}`] && (
                                    <div className="mt-3">
                                        <input
                                            type="file"
                                            name={`evidencia.archivos${num}`}
                                            onChange={handleChangeFile}
                                            accept="image/*"
                                            disabled={modo === "ver"}
                                            //style={{ display: "none" }}
                                            className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 
                                            file:rounded-md file:border-0 file:text-sm file:font-semibold 
                                            file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 
                                            disabled:bg-gray-200 disabled:cursor-not-allowed"
                                        />

                                        {/* Mostrar archivo guardado previamente */}
                                        {formData.evidencia[`archivos${num}`] && (
                                            <div className="mt-2 p-3 bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 rounded-md flex items-center justify-between">
                                                <div className="flex-1">
                                                    <p className="text-xs text-gray-600">
                                                        <span className="font-semibold">Archivo guardado: </span>
                                                        <span className="text-indigo-600 font-bold">{formData.evidencia[`archivos${num}`]}</span>
                                                    </p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => handleViewFile(formData.evidencia[`archivos${num}`])}
                                                    className="ml-3 px-3 py-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center gap-1.5 text-xs font-medium shadow-sm"
                                                    title="Ver archivo"
                                                >
                                                    <Eye className="w-3.5 h-3.5" />
                                                    Ver
                                                </button>
                                            </div>
                                        )}

                                        {/* Mostrar archivo nuevo seleccionado (aún no guardado) */}
                                        {newFiles[`archivos${num}`] && (
                                            <div className="mt-2 p-3 bg-green-50 border border-green-300 rounded-md">
                                                <p className="text-xs text-green-700">
                                                    <span className="font-semibold">✓ Nuevo archivo seleccionado: </span>
                                                    <span className="font-bold">{newFiles[`archivos${num}`].name}</span>
                                                    <span className="block mt-1 text-green-600">Haz clic en "Registrar" para guardar este archivo</span>
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}

                            </div>
                        ))}
                    </div>

                    <p className="text-xs text-gray-500 mt-1">
                        Puedes cargar hasta 3 imágenes. Marca la casilla para habilitar la carga.
                    </p>
                </div>




                {/* Buttons */}
                <div className="flex justify-end gap-4 pt-4 border-t">
                    <button
                        type="button"
                        // onClick={() => navigate('/compliance')}
                        onClick={() => navigate('/relacioncotizaciones')}
                        className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center"
                    >
                        <FolderClosed className="w-4 h-4 mr-2" />
                        Cerrar
                    </button>
                    <button
                        type="submit"
                        //onClick={enviarFormulario}
                        disabled={loading}
                        className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center"
                    >
                        <Save className="w-4 h-4 mr-2" />
                        {loading ? 'Guardando...' : 'Registrar'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ServiceForm;
