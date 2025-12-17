import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
    Activity, CheckCircle, XCircle, Clock, Users, FileText,
    TrendingUp, Calendar, Image
} from 'lucide-react';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState({
        startDate: '',
        endDate: ''
    });

    // Establecer el rango de fechas del mes actual por defecto
    useEffect(() => {
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        setDateRange({
            startDate: firstDay.toISOString().split('T')[0],
            endDate: lastDay.toISOString().split('T')[0]
        });
    }, []);

    // Cargar estadísticas cuando cambie el rango de fechas
    useEffect(() => {
        if (dateRange.startDate && dateRange.endDate) {
            fetchStats();
        }
    }, [dateRange]);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:5000/api/dashboard/stats', {
                params: {
                    startDate: dateRange.startDate,
                    endDate: dateRange.endDate
                }
            });
            setStats(response.data);
        } catch (error) {
            console.error('Error al cargar estadísticas:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDateChange = (e) => {
        setDateRange({
            ...dateRange,
            [e.target.name]: e.target.value
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500">No hay datos disponibles</p>
            </div>
        );
    }

    // Colores para los gráficos
    const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444'];

    // Datos para el gráfico de pastel (Servicios Cerrados vs Abiertos)
    const pieData = [
        { name: 'Cerrados', value: stats.resumen.serviciosCerrados },
        { name: 'Abiertos', value: stats.resumen.serviciosAbiertos }
    ];

    return (
        <div className="space-y-6">
            {/* Filtros de fecha */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-300">
                <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        <span className="font-semibold text-gray-700 dark:text-gray-200">Período:</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <label className="text-sm text-gray-600">Desde:</label>
                        <input
                            type="date"
                            name="startDate"
                            value={dateRange.startDate}
                            onChange={handleDateChange}
                            className="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <label className="text-sm text-gray-600">Hasta:</label>
                        <input
                            type="date"
                            name="endDate"
                            value={dateRange.endDate}
                            onChange={handleDateChange}
                            className="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                </div>
            </div>

            {/* KPIs - Tarjetas de resumen */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    icon={<Activity className="w-8 h-8" />}
                    title="Total Servicios"
                    value={stats.resumen.totalServicios}
                    subtitle={`${stats.resumen.totalServiciosHistorico} histórico`}
                    color="bg-gradient-to-br from-blue-500 to-blue-600"
                />
                <StatCard
                    icon={<CheckCircle className="w-8 h-8" />}
                    title="Servicios Cerrados"
                    value={stats.resumen.serviciosCerrados}
                    subtitle={`${((stats.resumen.serviciosCerrados / stats.resumen.totalServicios) * 100 || 0).toFixed(1)}% del total`}
                    color="bg-gradient-to-br from-green-500 to-green-600"
                />
                <StatCard
                    icon={<Clock className="w-8 h-8" />}
                    title="Pendientes"
                    value={stats.resumen.serviciosPendientes}
                    subtitle="Sin conformidad"
                    color="bg-gradient-to-br from-orange-500 to-orange-600"
                />
                <StatCard
                    icon={<Image className="w-8 h-8" />}
                    title="Con Evidencias"
                    value={stats.resumen.serviciosConEvidencias}
                    subtitle={`${((stats.resumen.serviciosConEvidencias / stats.resumen.totalServicios) * 100 || 0).toFixed(1)}% del total`}
                    color="bg-gradient-to-br from-purple-500 to-purple-600"
                />
            </div>

            {/* Gráficos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Gráfico de Pastel - Estado de Servicios */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-300">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        Estado de Servicios
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Gráfico de Barras - Servicios por Técnico */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-300">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                        <Users className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        Servicios por Técnico
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={stats.serviciosPorTecnico}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="_id" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="count" fill="#6366f1" name="Servicios" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Gráfico de Línea - Tendencia Diaria */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 lg:col-span-2 transition-colors duration-300">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        Tendencia de Servicios
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={stats.serviciosPorDia}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="_id" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="count"
                                stroke="#6366f1"
                                strokeWidth={2}
                                name="Servicios"
                                dot={{ fill: '#6366f1', r: 4 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Top Clientes */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-300">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                        <Users className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        Top 10 Clientes
                    </h3>
                    <div className="space-y-3 max-h-80 overflow-y-auto">
                        {stats.serviciosPorCliente.map((cliente, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold text-sm">
                                        {index + 1}
                                    </div>
                                    <span className="text-gray-700 dark:text-gray-200 font-medium">{cliente._id}</span>
                                </div>
                                <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                    {cliente.count}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Últimos Servicios */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-300">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        Últimos Servicios
                    </h3>
                    <div className="space-y-3 max-h-80 overflow-y-auto">
                        {stats.ultimosServicios.map((servicio, index) => (
                            <div key={servicio._id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-semibold text-indigo-600">#{servicio.cotizacion}</span>
                                    {servicio.servicioCerrado ? (
                                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold">
                                            Cerrado
                                        </span>
                                    ) : (
                                        <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs font-semibold">
                                            Abierto
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-300">{servicio.cliente}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Técnico: {servicio.tecnico}</p>
                                <p className="text-xs text-gray-400 mt-1">
                                    {new Date(servicio.createdAt).toLocaleDateString('es-ES')}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Componente de tarjeta de estadística
const StatCard = ({ icon, title, value, subtitle, color }) => {
    return (
        <div className={`${color} rounded-lg shadow-lg p-6 text-white transform hover:scale-105 transition-transform duration-200`}>
            <div className="flex items-center justify-between mb-4">
                <div className="opacity-80">{icon}</div>
            </div>
            <h3 className="text-3xl font-bold mb-2">{value}</h3>
            <p className="text-sm font-semibold opacity-90">{title}</p>
            <p className="text-xs opacity-75 mt-1">{subtitle}</p>
        </div>
    );
};

export default Dashboard;
