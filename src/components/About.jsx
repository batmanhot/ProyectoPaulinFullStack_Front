import React from 'react';
import { CheckCircle, Zap, Shield, BarChart3, Users, Clock } from 'lucide-react';
import soportetecnico from '../assets/soportetecnico.jpg'; // Reutilizamos la imagen si la necesitas, o usamos iconos

const About = () => {
    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100 flex flex-col md:flex-row items-center gap-8">
                <div className="flex-1 space-y-4">
                    <div className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-50 text-indigo-700 text-sm font-semibold">
                        Versión 1.0.0
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900">
                        Gestión de Servicios Técnicos
                    </h1>
                    <p className="text-lg text-gray-600 leading-relaxed">
                        Una plataforma integral diseñada para transformar la manera en que administras,
                        controlas y das seguimiento a los servicios técnicos y mantenimientos.
                        Simplificamos lo complejo para que tú te enfoques en la calidad del servicio.
                    </p>
                </div>
                {/* Puedes poner una imagen ilustrativa o un icono grande aquí */}
                <div className="w-full md:w-1/3 flex justify-center">
                    <div className="w-48 h-48 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl">
                        <Zap className="w-24 h-24 text-white" />
                    </div>
                </div>
            </div>

            {/* What it does section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FeatureCard
                    icon={<Shield className="w-6 h-6 text-emerald-600" />}
                    title="Control Total"
                    description="Registra cada detalle del servicio, desde la solicitud inicial hasta la conformidad del cliente, garantizando que nada se pierda."
                    color="bg-emerald-50"
                />
                <FeatureCard
                    icon={<BarChart3 className="w-6 h-6 text-blue-600" />}
                    title="Métricas en Tiempo Real"
                    description="Visualiza el rendimiento de tu equipo a través de un Dashboard interactivo con indicadores clave de desempeño (KPIs)."
                    color="bg-blue-50"
                />
                <FeatureCard
                    icon={<Users className="w-6 h-6 text-purple-600" />}
                    title="Gestión de Clientes"
                    description="Mantén un historial organizado de todas las atenciones por cliente, facilitando el seguimiento y la fidelización."
                    color="bg-purple-50"
                />
            </div>

            {/* Benefits List */}
            <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Beneficios Clave</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <BenefitItem text="Centralización de la información en una sola base de datos segura." />
                    <BenefitItem text="Registro de evidencias fotográficas para mayor transparencia." />
                    <BenefitItem text="Firmas digitales y conformidades integradas en el flujo de trabajo." />
                    <BenefitItem text="Optimización de tiempos de respuesta y cierre de servicios." />
                    <BenefitItem text="Acceso rápido al historial de servicios para auditorías o consultas." />
                    <BenefitItem text="Interfaz moderna e intuitiva que reduce la curva de aprendizaje." />
                </div>
            </div>

            {/* Footer / Credits */}
            <div className="text-center text-gray-500 py-8">
                <p>Desarrollado con ❤️ para la excelencia operativa.</p>
                <p className="text-sm mt-2">&copy; {new Date().getFullYear()} Sistema de Gestión.</p>
            </div>
        </div>
    );
};

// Componente auxiliar para tarjetas de características
const FeatureCard = ({ icon, title, description, color }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center mb-4`}>
            {icon}
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm leading-relaxed">
            {description}
        </p>
    </div>
);

// Componente auxiliar para items de lista de beneficios
const BenefitItem = ({ text }) => (
    <div className="flex items-start gap-3">
        <CheckCircle className="w-5 h-5 text-indigo-500 flex-shrink-0 mt-0.5" />
        <span className="text-gray-700">{text}</span>
    </div>
);

export default About;
