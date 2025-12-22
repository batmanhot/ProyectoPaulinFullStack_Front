import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Edit, Trash2, Plus } from 'lucide-react';

const ServiceTable = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_URL_BACKEND}/api/services`);
            //const response = await axios.get('http://localhost:5000/api/services');
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
                //await axios.delete(`http://localhost:5000/api/services/${id}`);
                await axios.delete(`${import.meta.env.VITE_URL_BACKEND}/api/services/${id}`);

                setServices(services.filter(service => service._id !== id));
            } catch (error) {
                console.error('Error deleting service:', error);
                alert('Error al eliminar el registro');
            }
        }
    };

    if (loading) {
        return <div className="text-center py-10">Cargando...</div>;
    }

    return (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="px-4 md:px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                <h2 className="text-lg md:text-xl font-semibold text-gray-800">Listado de solicitud de servicios</h2>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                # Cotización
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
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Acciones
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {services.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                                    No hay registros encontrados.
                                </td>
                            </tr>
                        ) : (
                            services.map((service) => (
                                <tr key={service._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {service.cotizacion}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {service.cliente}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {service.tecnico}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(service.fechaServicio).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <Link
                                            to={`/compliance/${service._id}`}
                                            className="text-indigo-600 hover:text-indigo-900 mr-4 inline-flex items-center"
                                        >
                                            <Edit className="w-4 h-4 mr-1" /> Ver
                                        </Link>

                                        <Link
                                            to={`/compliance/${service._id}`}
                                            className="text-indigo-600 hover:text-indigo-900 mr-4 inline-flex items-center"
                                        >
                                            <Edit className="w-4 h-4 mr-1" /> Conformidad
                                        </Link>

                                        <Link
                                            to={`/compliance/${service._id}`}
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
                {services.length === 0 ? (
                    <div className="px-4 py-8 text-center text-sm text-gray-500">
                        No hay registros encontrados.
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200">
                        {services.map((service) => (
                            <div key={service._id} className="px-4 py-3 hover:bg-gray-50">
                                {/* Compact Card Layout */}
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xs font-medium text-gray-500">COT:</span>
                                            <span className="text-sm font-semibold text-gray-900 truncate">
                                                {service.cotizacion}
                                            </span>
                                        </div>
                                        <div className="text-sm text-gray-700 truncate mb-1">
                                            {service.cliente}
                                        </div>
                                        <div className="flex items-center gap-3 text-xs text-gray-500">
                                            <span className="truncate">👤 {service.tecnico}</span>
                                            <span>📅 {new Date(service.fechaServicio).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: '2-digit' })}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions - Compact */}
                                <div className="flex flex-col gap-2 mt-2">
                                    <Link
                                        to={`/compliance/${service._id}`}
                                        className="inline-flex items-center justify-center px-3 py-1.5 border border-indigo-600 rounded-md text-xs font-medium text-indigo-600 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        <Edit className="w-3 h-3 mr-1" />
                                        Ver Detalles
                                    </Link>
                                    <Link
                                        to={`/compliance/${service._id}`}
                                        className="inline-flex items-center justify-center px-3 py-1.5 border border-green-600 rounded-md text-xs font-medium text-green-600 bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                    >
                                        <Edit className="w-3 h-3 mr-1" />
                                        Conformidad
                                    </Link>
                                    <Link
                                        to={`/compliance/${service._id}`}
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
