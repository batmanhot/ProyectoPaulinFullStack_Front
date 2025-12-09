import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import soportetecnico from '../assets/soportetecnico.jpg';
import Slider from '../helper/slider';

const LandingPage = () => {
    return (
        <div className="bg-white">

            {/* <Slider /> */}

            <div className="relative isolate px-6 pt-5 lg:px-8">
                <div className="text-center flex justify-center items-center mb-10">
                    {/* <img src={soportetecnico} alt="Logo" className="w-full max-w-xs object-cover rounded-lg shadow-[0_20px_50px_rgba(8,112,184,0.7)] transition-shadow duration-300" /> */}
                    <img src={soportetecnico} alt="Logo" className="w-full max-w-xs shadow-xl shadow-gray-700  rounded-lg" />
                </div>

                {/* <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56"> */}
                <div className="mx-auto max-w-2xl">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                            Gestión de Servicios Técnicos
                        </h1>
                        <p className="mt-6 text-lg leading-8 text-gray-600">
                            Sistema integral para el registro, control y seguimiento de servicios técnicos.
                            Optimice su flujo de trabajo con nuestra plataforma moderna y eficiente.
                        </p>
                        <div className="mt-10 flex items-center justify-center gap-x-6">
                            <Link
                                to="/services"
                                className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 flex items-center"
                            >
                                Solicitud de Servicios <ArrowRight className="ml-2 w-4 h-4" />
                            </Link>
                            <Link
                                // to="/compliance"
                                to="/relacioncotizaciones"
                                className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 flex items-center"
                            >
                                Conformidades de Atención <ArrowRight className="ml-2 w-4 h-4" />
                            </Link>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
