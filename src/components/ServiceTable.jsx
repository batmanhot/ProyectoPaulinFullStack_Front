import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Edit, Trash2, Plus, Search, X } from 'lucide-react';

const ServiceTable = () => {
    const [services, setServices] = useState([]);
    const [filteredServices, setFilteredServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterTecnico, setFilterTecnico] = useState('');
    const [filterCliente, setFilterCliente] = useState('');

    useEffect(() => {
        fetchServices();
    }, []);

    useEffect(() => {
        filterServices();
    }, [services, searchTerm, filterTecnico, filterCliente]);

    const fetchServices = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_URL_BACKEND}/api/services`);
            setServices(response.data);
            setFilteredServices(response.data);
        } catch (error) {
            console.error('Error fetching services:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterServices = () => {
        let filtered = services;

        if (searchTerm) {
            filtered = filtered.filter(service =>
                service.cotizacion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                service.cliente?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                service.tecnico?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (filterTecnico) {
            filtered = filtered.filter(service =>
                service.tecnico?.toLowerCase().includes(filterTecnico.toLowerCase())
            );
        }

        if (filterCliente) {
            filtered = filtered.filter(service =>
                service.cliente?.toLowerCase().includes(filterCliente.toLowerCase())
            );
        }

        setFilteredServices(filtered);
    };

    const clearFilters = () => {
        setSearchTerm('');
        setFilterTecnico('');
        setFilterCliente('');
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

    if (loading) {
        return <div className="text-center py-10">Cargando...</div>;
    }

    return (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
            {/* Header */}
            <div className="px-4 md:px-6 py-4 border-b border-gray-200 bg-gray-50">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
                    <h2 className="text-lg md:text-xl font-semibold text-gray-800">Listado de Servicios</h2>
                    <Link
                        to="/create"
                        className="inline-flex items-center justify-center px-3 md:px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        <Plus className="w-4 h-4 mr-1 md:mr-2" />
                        <span className="hidden sm:inline">Nuevo Registro</span>
                        <span className="sm:hidden">Nuevo</span>
                    </Link>
                </div>
            </div>

            {/* Filters - Responsive */}
            <div className="px-4 md:px-6 py-3 md:py-4 bg-gray-50 border-b border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-3">
                    {/* Search General */}
                    <div className="relative col-span-1 md:col-span-2">
                        <Search className="absolute left-2 md:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Buscar..."
                            size="18"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="md:w-full pl-8 md:pl-10 pr-3 py-1.5 md:py-2 text-sm border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    {/* Filter by Técnico - Hidden on mobile, shown on tablet+ */}
                    <div className="hidden md:block">
                        <input
                            type="text"
                            placeholder="Filtrar por técnico"
                            value={filterTecnico}
                            onChange={(e) => setFilterTecnico(e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    {/* Clear Filters Button */}
                    <div className="flex gap-2">
                        <button
                            onClick={clearFilters}
                            className="flex-1 md:flex-none inline-flex items-center justify-center px-3 py-1.5 md:py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            <X className="w-4 h-4 mr-1" />
                            <span className="hidden sm:inline">Limpiar</span>
                            <span className="sm:hidden">Limpiar</span>
                        </button>
                    </div>
                </div>
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
                        {filteredServices.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                                    No hay registros encontrados.
                                </td>
                            </tr>
                        ) : (
                            filteredServices.map((service) => (
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
                                            to={`/edit/${service._id}`}
                                            className="text-indigo-600 hover:text-indigo-900 mr-4 inline-flex items-center"
                                        >
                                            <Edit className="w-4 h-4 mr-1" /> Editar
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(service._id)}
                                            className="text-red-600 hover:text-red-900 inline-flex items-center"
                                        >
                                            <Trash2 className="w-4 h-4 mr-1" /> Eliminar
                                        </button>
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
                        No hay registros encontrados.
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200">
                        {filteredServices.map((service) => (
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
                                <div className="flex gap-2 mt-2">
                                    <Link
                                        to={`/edit/${service._id}`}
                                        className="flex-1 inline-flex items-center justify-center px-3 py-1.5 border border-indigo-600 rounded-md text-xs font-medium text-indigo-600 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        <Edit className="w-3 h-3 mr-1" />
                                        Editar
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(service._id)}
                                        className="flex-1 inline-flex items-center justify-center px-3 py-1.5 border border-red-600 rounded-md text-xs font-medium text-red-600 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                    >
                                        <Trash2 className="w-3 h-3 mr-1" />
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Results Counter */}
            <div className="px-4 md:px-6 py-2 md:py-3 bg-gray-50 border-t border-gray-200">
                <p className="text-xs md:text-sm text-gray-600">
                    Mostrando <span className="font-medium">{filteredServices.length}</span> de <span className="font-medium">{services.length}</span> registros
                </p>
            </div>
        </div>
    );
};

export default ServiceTable;
