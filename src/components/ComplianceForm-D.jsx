import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Save, Search, FolderClosed, Eye, Trash2 } from 'lucide-react';
import SignatureCanvas from 'react-signature-canvas';


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
    const [servicioCerradoOriginal, setServicioCerradoOriginal] = useState(false); // Valor original de la BD
    const signatureRef = useRef(null); // Ref para el canvas de firma
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
        firmaCliente: '', // URL o base64 de la firma del cliente
        servicioCerrado: false, // Nuevo campo para indicar si el servicio está cerrado
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
                // Guardar el valor original de servicioCerrado
                setServicioCerradoOriginal(found.servicioCerrado || false);
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
        console.log('📋 formData:', formData);

        try {
            // Verificar si hay archivos nuevos para subir
            const hasNewFiles = newFiles.archivos1 || newFiles.archivos2 || newFiles.archivos3;
            console.log('📋 hasNewFiles:', hasNewFiles);
            console.log('📋 Condición completa:', id && hasNewFiles && modo === 'conformidad');

            // MODO CONFORMIDAD - Ahora aquí se guardan las imágenes
            if (id && modo === 'conformidad') {
                console.log('✅ Entrando a modo conformidad...');

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
                data.append('conformidadCliente', formData.conformidadCliente || '');
                data.append('fechaServicio', formData.fechaServicio);
                data.append('observacion', formData.observacion || '');
                data.append('servicioCerrado', formData.servicioCerrado);

                // Agregar la firma si existe
                if (formData.firmaCliente) {
                    data.append('firmaCliente', formData.firmaCliente);
                    console.log('Firma del cliente agregada');
                }

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

                alert('✅ Datos guardados correctamente');

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
        } else if (type === 'checkbox') {
            setFormData(prev => ({
                ...prev,
                [name]: checked
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

    // Función para guardar la firma
    const handleSaveSignature = () => {
        if (signatureRef.current && !signatureRef.current.isEmpty()) {
            const signatureDataURL = signatureRef.current.toDataURL('image/png');
            setFormData(prev => ({
                ...prev,
                firmaCliente: signatureDataURL
            }));
            alert('✅ Firma guardada correctamente');
        } else {
            alert('⚠️ Por favor, dibuje su firma primero');
        }
    };

    // Función para limpiar la firma
    const handleClearSignature = () => {
        if (signatureRef.current) {
            signatureRef.current.clear();
            setFormData(prev => ({
                ...prev,
                firmaCliente: ''
            }));
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
                    {/* Fecha Servicio - No mostrar en modo Ver */}
                    {modo !== 'ver' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Servicio</label>
                            <input
                                type="date"
                                name="fechaServicio"
                                value={formData.fechaServicio}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-200 disabled:text-gray-800 disabled:cursor-not-allowed"
                                required
                                disabled={modo === 'evidencias' || servicioCerradoOriginal}
                            />
                        </div>
                    )}
                </div>

                {/* Observación - No mostrar en modo Ver */}
                {modo !== 'ver' && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Observación</label>
                        <textarea
                            name="observacion"
                            value={formData.observacion}
                            onChange={handleChange}
                            rows="3"
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-200 disabled:text-gray-800 disabled:cursor-not-allowed"
                            disabled={modo === 'evidencias' || servicioCerradoOriginal}
                        ></textarea>
                    </div>
                )}

                {/* Conformidad Cliente - Solo mostrar en modo Conformidad */}
                {modo === 'conformidad' && (
                    <div className="border border-gray-300 rounded-md p-4 bg-gray-50">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Conformidad Cliente (Firma)</label>

                        {/* Input para nombre del cliente */}
                        <input
                            type="text"
                            name="conformidadCliente"
                            value={formData.conformidadCliente}
                            onChange={handleChange}
                            placeholder="Nombre del Cliente"
                            className="w-full p-2 mb-3 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500 disabled:bg-gray-200 disabled:text-gray-800 disabled:cursor-not-allowed"
                            disabled={servicioCerradoOriginal}
                        />

                        {/* Canvas de firma - Solo en modo conformidad */}
                        {!servicioCerradoOriginal && (
                            <div className="mt-3">
                                <label className="block text-xs font-medium text-gray-600 mb-2">
                                    ✍️ Dibuje su firma aquí:
                                </label>
                                <div className="border-2 border-indigo-300 rounded-md bg-white">
                                    <SignatureCanvas
                                        ref={signatureRef}
                                        canvasProps={{
                                            className: 'w-full h-40 cursor-crosshair',
                                            style: { touchAction: 'none' }
                                        }}
                                        backgroundColor="white"
                                    />
                                </div>
                                <div className="flex gap-2 mt-2">
                                    <button
                                        type="button"
                                        onClick={handleSaveSignature}
                                        className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                                    >
                                        <Save className="w-4 h-4" />
                                        Guardar Firma
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleClearSignature}
                                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Limpiar
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Mostrar firma guardada */}
                        {formData.firmaCliente && (
                            <div className="mt-3 p-3 bg-indigo-50 border border-indigo-200 rounded-md">
                                <p className="text-xs font-semibold text-indigo-700 mb-2">Firma guardada:</p>
                                <div className="bg-white border border-indigo-300 rounded-md p-2">
                                    <img
                                        src={formData.firmaCliente}
                                        alt="Firma del cliente"
                                        className="w-full h-32 object-contain"
                                    />
                                </div>
                            </div>
                        )}

                        <p className="text-xs text-gray-500 mt-2">Firma digital del cliente</p>
                    </div>
                )}

                {/* Checkbox Servicio Cerrado - Solo en modo conformidad */}
                {modo === 'conformidad' && (
                    <div className="border border-amber-300 rounded-md p-4 bg-amber-50">
                        <label className="flex items-center space-x-3 cursor-pointer">
                            <input
                                type="checkbox"
                                name="servicioCerrado"
                                checked={formData.servicioCerrado}
                                onChange={handleChange}
                                disabled={servicioCerradoOriginal}
                                className="h-5 w-5 text-amber-600 border-gray-300 rounded focus:ring-amber-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
                            />
                            <span className="text-sm font-medium text-gray-700">
                                🔒 Marcar este servicio como cerrado (no se podrá modificar después)
                            </span>
                        </label>
                        {formData.servicioCerrado && !servicioCerradoOriginal && (
                            <p className="text-xs text-amber-700 mt-2 ml-8">
                                ⚠️ Este servicio está cerrado. Haz clic en "Registrar" para guardar este cambio. Después no se permitirán más modificaciones.
                            </p>
                        )}
                        {servicioCerradoOriginal && (
                            <p className="text-xs text-red-700 mt-2 ml-8 font-semibold">
                                🔒 Este servicio ya está cerrado permanentemente. No se pueden realizar modificaciones.
                            </p>
                        )}
                    </div>
                )}

                {/* Evidencias - Carga de imágenes en CONFORMIDAD */}
                {modo === 'conformidad' && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Evidencias (Imágenes)</label>

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
                                            disabled={servicioCerradoOriginal}
                                            className="h-5 w-5 text-indigo-600 border-gray-300 rounded disabled:bg-gray-200 disabled:cursor-not-allowed"
                                        />
                                        <span className="text-sm text-gray-600">Evidencia {num}</span>
                                    </label>

                                    {/* Input de archivo */}
                                    {formData.evidencia[`casilla${num}`] && (
                                        <div className="mt-3">
                                            <input
                                                type="file"
                                                name={`evidencia.archivos${num}`}
                                                onChange={handleChangeFile}
                                                accept="image/*"
                                                disabled={servicioCerradoOriginal}
                                                className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 
                                                file:rounded-md file:border-0 file:text-sm file:font-semibold 
                                                file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 
                                                disabled:bg-gray-200 disabled:cursor-not-allowed"
                                            />

                                            {/* Mostrar archivo guardado previamente */}
                                            {formData.evidencia[`archivos${num}`] && (
                                                <div className="mt-2 p-3 bg-linear-to-r from-indigo-50 to-blue-50 border border-indigo-200 rounded-md flex items-center justify-between">
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
                )}

                {/* Evidencias - Solo visualización en modo EVIDENCIAS */}
                {modo === 'evidencias' && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Evidencias (Solo lectura)</label>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {[1, 2, 3].map((num) => (
                                formData.evidencia[`casilla${num}`] && formData.evidencia[`archivos${num}`] && (
                                    <div key={num} className="border border-indigo-200 rounded-md overflow-hidden shadow-sm">
                                        <div className="bg-indigo-50 px-3 py-2 border-b border-indigo-200">
                                            <p className="text-xs font-semibold text-indigo-700">Evidencia {num}</p>
                                        </div>
                                        <div className="p-2">
                                            <img
                                                src={`${import.meta.env.VITE_URL_BACKEND}/uploads/evidencias/${formData.evidencia[`archivos${num}`]}`}
                                                alt={`Evidencia ${num}`}
                                                className="w-full h-48 object-cover rounded cursor-pointer hover:opacity-90 transition-opacity"
                                                onClick={() => handleViewFile(formData.evidencia[`archivos${num}`])}
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23ddd" width="200" height="200"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EImagen no disponible%3C/text%3E%3C/svg%3E';
                                                }}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handleViewFile(formData.evidencia[`archivos${num}`])}
                                                className="mt-2 w-full px-3 py-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center justify-center gap-1.5 text-xs font-medium"
                                            >
                                                <Eye className="w-3.5 h-3.5" />
                                                Ver en tamaño completo
                                            </button>
                                        </div>
                                    </div>
                                )
                            ))}
                        </div>

                        {!formData.evidencia.casilla1 && !formData.evidencia.casilla2 && !formData.evidencia.casilla3 && (
                            <div className="text-center py-8 text-gray-500">
                                <p className="text-sm">No hay evidencias cargadas para este servicio.</p>
                            </div>
                        )}

                        {/* Mostrar firma del cliente en modo evidencias */}
                        {formData.firmaCliente && (
                            <div className="mt-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Firma del Cliente</label>
                                <div className="border border-green-200 rounded-md overflow-hidden shadow-sm bg-green-50">
                                    <div className="bg-green-100 px-3 py-2 border-b border-green-200">
                                        <p className="text-xs font-semibold text-green-700">
                                            ✍️ {formData.conformidadCliente || 'Cliente'}
                                        </p>
                                    </div>
                                    <div className="p-4 bg-white">
                                        <img
                                            src={formData.firmaCliente}
                                            alt="Firma del cliente"
                                            className="w-full max-w-md mx-auto h-32 object-contain border border-gray-300 rounded"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}




                {/* Buttons */}
                <div className="flex justify-end gap-4 pt-4 border-t">
                    <button
                        type="button"
                        onClick={() => navigate('/relacioncotizaciones')}
                        className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center"
                    >
                        <FolderClosed className="w-4 h-4 mr-2" />
                        Cerrar
                    </button>

                    {/* Solo mostrar botón Registrar si NO está en modo ver ni evidencias */}
                    {modo !== 'evidencias' && modo !== 'ver' && (
                        <button
                            type="submit"
                            disabled={loading || servicioCerradoOriginal}
                            className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center disabled:bg-gray-400 disabled:cursor-not-allowed"
                            title={servicioCerradoOriginal ? "Este servicio está cerrado y no se puede modificar" : ""}
                        >
                            <Save className="w-4 h-4 mr-2" />
                            {loading ? 'Guardando...' : servicioCerradoOriginal ? 'Servicio Cerrado' : 'Registrar'}
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default ServiceForm;
