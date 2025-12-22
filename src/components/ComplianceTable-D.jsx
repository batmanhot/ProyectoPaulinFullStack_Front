import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Edit, Trash2, Plus, Search } from 'lucide-react';

const ServiceTable = () => {

    const navigate = useNavigate();

    const abrirFormulario = (modo, cotizacionId) => {
        navigate(`/detallecotizacion/${cotizacionId}?modo=${modo}`);
        console.log("Table")
        console.log(cotizacionId);
        console.log(modo);
    };

    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);

    // Estados para filtros de búsqueda
    const [searchCotizacion, setSearchCotizacion] = useState('');
    const [searchCliente, setSearchCliente] = useState('');
    const [searchTecnico, setSearchTecnico] = useState('');

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_URL_BACKEND}/api/services`);
            setServices(response.data);
        } catch (error) {
            console.error('Error fetching services:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Está seguro de eliminar este registro?')) {
            try {
                await axios.delete(`${import.meta.env.VITE_URL_BACKEND}/api/services/${id}`);

                setServices(services.filter(service => service._id !== id));
            } catch (error) {
                console.error('Error deleting service:', error);
                alert('Error al eliminar el registro');
            }
        }
    };

    // Función para filtrar servicios
    const filteredServices = services.filter(service => {
        const matchCotizacion = service.cotizacion.toLowerCase().includes(searchCotizacion.toLowerCase());
        const matchCliente = service.cliente.toLowerCase().includes(searchCliente.toLowerCase());
        const matchTecnico = service.tecnico.toLowerCase().includes(searchTecnico.toLowerCase());

        return matchCotizacion && matchCliente && matchTecnico;
    });

    if (loading) {
        return <div className="text-center py-10">Cargando...</div>;
    }

    return (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="px-4 md:px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                <h2 className="text-lg md:text-xl font-semibold text-gray-800">Listado de solicitud de servicios</h2>
            </div>

            {/* Sección de filtros de búsqueda - Responsive */}
            <div className="px-4 md:px-6 py-3 md:py-4 bg-gray-50 border-b border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                            <Search className="w-3 h-3 inline mr-1" />
                            Buscar por Cotización
                        </label>
                        <input
                            type="text"
                            value={searchCotizacion}
                            onChange={(e) => setSearchCotizacion(e.target.value)}
                            placeholder="Filtrar cotización..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                            <Search className="w-3 h-3 inline mr-1" />
                            Buscar por Cliente
                        </label>
                        <input
                            type="text"
                            value={searchCliente}
                            onChange={(e) => setSearchCliente(e.target.value)}
                            placeholder="Filtrar cliente..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                            <Search className="w-3 h-3 inline mr-1" />
                            Buscar por Técnico
                        </label>
                        <input
                            type="text"
                            value={searchTecnico}
                            onChange={(e) => setSearchTecnico(e.target.value)}
                            placeholder="Filtrar técnico..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                </div>
                {(searchCotizacion || searchCliente || searchTecnico) && (
                    <div className="mt-2 text-xs text-gray-600">
                        Mostrando {filteredServices.length} de {services.length} registros
                    </div>
                )}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Cotización
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Cliente
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Técnico
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Fecha Servicio
                            </th>
                            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Estado
                            </th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Acciones
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredServices.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                                    {services.length === 0 ? 'No hay registros encontrados.' : 'No se encontraron resultados para la búsqueda.'}
                                </td>
                            </tr>
                        ) : (
                            filteredServices.map((service) => (
                                <tr
                                    key={service._id}
                                    className={`hover:bg-gray-50 ${service.servicioCerrado ? 'bg-green-50' : ''}`}
                                >
                                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${service.servicioCerrado ? 'text-green-700' : 'text-gray-900'}`}>
                                        {service.cotizacion}
                                    </td>
                                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${service.servicioCerrado ? 'text-green-600' : 'text-gray-500'}`}>
                                        {service.cliente}
                                    </td>
                                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${service.servicioCerrado ? 'text-green-600' : 'text-gray-500'}`}>
                                        {service.tecnico}
                                    </td>
                                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${service.servicioCerrado ? 'text-green-600' : 'text-gray-500'}`}>
                                        {new Date(service.fechaServicio).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        {service.servicioCerrado ? (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                🔒 Cerrado
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                📝 Abierto
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <Link
                                            to={`/detallecotizacion/${service._id}?modo=ver`}
                                            className="text-indigo-600 hover:text-indigo-900 mr-4 inline-flex items-center"
                                        >
                                            <Edit className="w-4 h-4 mr-1" /> Ver
                                        </Link>

                                        <Link
                                            to={`/detallecotizacion/${service._id}?modo=conformidad`}
                                            className="text-indigo-600 hover:text-indigo-900 mr-4 inline-flex items-center"
                                        >
                                            <Edit className="w-4 h-4 mr-1" /> Conformidad
                                        </Link>

                                        <Link
                                            to={`/detallecotizacion/${service._id}?modo=evidencias`}
                                            className="text-indigo-600 hover:text-indigo-900 mr-4 inline-flex items-center"
                                        >
                                            <Edit className="w-4 h-4 mr-1" /> Evidencias
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden">
                {filteredServices.length === 0 ? (
                    <div className="px-4 py-8 text-center text-sm text-gray-500">
                        {services.length === 0 ? 'No hay registros encontrados.' : 'No se encontraron resultados para la búsqueda.'}
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200">
                        {filteredServices.map((service) => (
                            <div
                                key={service._id}
                                className={`px-4 py-3 hover:bg-gray-50 ${service.servicioCerrado ? 'bg-green-50' : ''}`}
                            >
                                {/* Compact Card Layout */}
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xs font-medium text-gray-500">COT:</span>
                                            <span className={`text-sm font-semibold truncate ${service.servicioCerrado ? 'text-green-700' : 'text-gray-900'}`}>
                                                {service.cotizacion}
                                            </span>
                                            {service.servicioCerrado ? (
                                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    🔒
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                    📝
                                                </span>
                                            )}
                                        </div>
                                        <div className={`text-sm truncate mb-1 ${service.servicioCerrado ? 'text-green-600' : 'text-gray-700'}`}>
                                            {service.cliente}
                                        </div>
                                        <div className={`flex items-center gap-3 text-xs ${service.servicioCerrado ? 'text-green-600' : 'text-gray-500'}`}>
                                            <span className="truncate">👤 {service.tecnico}</span>
                                            <span>📅 {new Date(service.fechaServicio).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: '2-digit' })}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions - Compact */}
                                <div className="flex flex-col gap-2 mt-2">
                                    <Link
                                        to={`/detallecotizacion/${service._id}?modo=ver`}
                                        className="inline-flex items-center justify-center px-3 py-1.5 border border-indigo-600 rounded-md text-xs font-medium text-indigo-600 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        <Edit className="w-3 h-3 mr-1" />
                                        Ver Detalles
                                    </Link>
                                    <Link
                                        to={`/detallecotizacion/${service._id}?modo=conformidad`}
                                        className="inline-flex items-center justify-center px-3 py-1.5 border border-green-600 rounded-md text-xs font-medium text-green-600 bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                    >
                                        <Edit className="w-3 h-3 mr-1" />
                                        Conformidad
                                    </Link>
                                    <Link
                                        to={`/detallecotizacion/${service._id}?modo=evidencias`}
                                        className="inline-flex items-center justify-center px-3 py-1.5 border border-blue-600 rounded-md text-xs font-medium text-blue-600 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        <Edit className="w-3 h-3 mr-1" />
                                        Evidencias
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ServiceTable;
