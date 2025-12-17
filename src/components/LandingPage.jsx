import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import soportetecnico from '../assets/soportetecnico.jpg';
import Slider from '../helper/slider';
import Dashboard from './Dashboard';

const LandingPage = () => {
    return (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen transition-colors duration-300">

            {/* Hero Section */}
            <div className="relative isolate px-6 pt-8 lg:px-8 bg-white dark:bg-gray-900 shadow-md transition-colors duration-300">
                <div className="text-center flex justify-center items-center mb-8">
                    <img src={soportetecnico} alt="Logo" className="w-full max-w-xs shadow-xl shadow-gray-700 rounded-lg" />
                </div>

                <div className="mx-auto max-w-4xl pb-12">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent sm:text-6xl">
                            Gestión de Servicios Técnicos
                        </h1>
                        <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
                            Sistema integral para el registro, control y seguimiento de servicios técnicos.
                            Optimice su flujo de trabajo con nuestra plataforma moderna y eficiente.
                        </p>
                        <div className="mt-10 flex items-center justify-center gap-x-6">
                            <Link
                                to="/services"
                                className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 flex items-center transform hover:scale-105 transition-transform"
                            >
                                Solicitud de Servicios <ArrowRight className="ml-2 w-4 h-4" />
                            </Link>
                            <Link
                                to="/relacioncotizaciones"
                                className="rounded-md bg-purple-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline-offset-2 focus-visible:outline-purple-600 flex items-center transform hover:scale-105 transition-transform"
                            >
                                Conformidades de Atención <ArrowRight className="ml-2 w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Dashboard Section */}
            <div className="px-6 py-12 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Panel de Control</h2>
                        <p className="text-gray-600 dark:text-gray-400">Vista general de las operaciones y estadísticas</p>
                    </div>
                    <Dashboard />
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
