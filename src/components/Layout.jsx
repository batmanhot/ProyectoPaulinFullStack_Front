import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    List,
    PlusCircle,
    FileCheck,
    Settings,
    LogOut,
    Menu,
    Search,
    Bell,
    ChevronDown,
    Info,
    Sun,
    Moon
} from 'lucide-react';

const Layout = ({ children }) => {
    const location = useLocation();
    const companyName = import.meta.env.VITE_NAME_BUSINESS || "Soporte Técnico";

    // Estado para controlar la visibilidad del sidebar en móvil
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Estado para el tema (oscuro/claro)
    const [theme, setTheme] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            return savedTheme;
        }
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    });

    // Efecto para aplicar la clase al documento
    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    };

    // Función para cerrar el sidebar en móvil al hacer clic en un enlace
    const handleLinkClick = () => {
        setIsSidebarOpen(false);
    };

    // Función para toggle del sidebar
    const toggleSidebar = () => {
        setIsSidebarOpen(prev => !prev);
    };

    // Función para manejar clases activas del menú
    const getLinkClass = (path) => {
        const isActive = location.pathname === path;
        return `flex items-center px-6 py-3 text-sm font-medium transition-colors duration-200 
            ${isActive
                ? 'bg-white/10 text-white border-l-4 border-white'
                : 'text-white/70 hover:bg-white/5 hover:text-white border-l-4 border-transparent'
            }`;
    };

    const handleLogout = () => {
        const confirmExit = window.confirm("¿Estás seguro de que deseas cerrar la sesión y salir?");
        if (confirmExit) {
            // Intento de cerrar la ventana
            window.close();

            // Fallback: Si el navegador bloquea el cierre, mostramos un mensaje o redirigimos
            // setTimeout para dar tiempo al navegador de intentar cerrar
            setTimeout(() => {
                if (!window.closed) {
                    alert("Por seguridad del navegador, esta pestaña no se puede cerrar automáticamente. Por favor, ciérrela manualmente.");
                    // Opcional: Redirigir a una página en blanco o de login si existiera
                    // window.location.href = "about:blank"; 
                }
            }, 100);
        }
    };

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden font-sans transition-colors duration-300">
            {/* Overlay para móvil - se muestra cuando el sidebar está abierto */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden transition-opacity duration-300"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed lg:static inset-y-0 left-0 z-40
                w-64 flex-shrink-0 
                bg-gradient-to-b from-teal-400 to-blue-600 dark:from-gray-800 dark:to-gray-900 
                shadow-xl flex flex-col 
                transition-transform duration-300 ease-in-out
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                {/* Logo Area */}
                <div className="h-16 flex items-center px-6 bg-black/10">
                    <div className="flex items-center gap-2 text-white">
                        <div className="p-1.5 bg-white/20 rounded-md">
                            <Settings className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-lg font-bold tracking-wide">Admin Panel</span>
                    </div>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 mt-6 space-y-1 overflow-y-auto">
                    <div className="px-6 mb-2 text-xs font-semibold text-white/50 uppercase tracking-wider">
                        Menu Principal
                    </div>

                    <Link to="/" className={getLinkClass('/')} onClick={handleLinkClick}>
                        <LayoutDashboard className="w-5 h-5 mr-3" />
                        Panel de Control
                    </Link>

                    <Link to="/services" className={getLinkClass('/services')} onClick={handleLinkClick}>
                        <List className="w-5 h-5 mr-3" />
                        Listado Servicios
                    </Link>

                    <Link to="/relacioncotizaciones" className={getLinkClass('/relacioncotizaciones')} onClick={handleLinkClick}>
                        <FileCheck className="w-5 h-5 mr-3" />
                        Conformidades
                    </Link>

                    <div className="px-6 mt-8 mb-2 text-xs font-semibold text-white/50 uppercase tracking-wider">
                        Operaciones
                    </div>

                    <Link to="/create" className={getLinkClass('/create')} onClick={handleLinkClick}>
                        <PlusCircle className="w-5 h-5 mr-3" />
                        Nuevo Servicio
                    </Link>

                    <div className="px-6 mt-8 mb-2 text-xs font-semibold text-white/50 uppercase tracking-wider">
                        Sistema
                    </div>

                    <Link to="/about" className={getLinkClass('/about')} onClick={handleLinkClick}>
                        <Info className="w-5 h-5 mr-3" />
                        Acerca de
                    </Link>
                </nav>

                {/* User Profile / Footer Sidebar */}
                <div className="p-4 border-t border-white/10">
                    <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-white/80 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                    >
                        <LogOut className="w-5 h-5 mr-3" />
                        Cerrar Sesión
                    </button>
                    <div className="mt-4 px-4 text-xs text-white/40 text-center">
                        {companyName} &copy; 2025
                    </div>
                </div>
            </aside>

            {/* Main Content Wrapper */}
            <div className="flex-1 flex flex-col overflow-hidden relative">

                {/* Top Header */}
                <header className="h-16 bg-white dark:bg-gray-800 shadow-sm flex items-center justify-between px-4 lg:px-8 z-10 sticky top-0 transition-colors duration-300">
                    <div className="flex items-center gap-4">
                        {/* Botón Hamburguesa para móvil */}
                        <button
                            onClick={toggleSidebar}
                            className="lg:hidden p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            aria-label="Toggle menu"
                        >
                            <Menu className="w-6 h-6" />
                        </button>

                        <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                            {location.pathname === '/' && 'Overview'}
                            {location.pathname === '/services' && 'Listado de Servicios'}
                            {location.pathname === '/create' && 'Registrar Servicio'}
                            {location.pathname === '/relacioncotizaciones' && 'Conformidades'}
                            {location.pathname.includes('/edit') && 'Editar Servicio'}
                            {location.pathname.includes('/detalle') && 'Detalle Cotización'}
                        </h2>
                    </div>

                    <div className="flex items-center gap-3 lg:gap-6">
                        <div className="relative hidden md:block">
                            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Buscar..."
                                className="pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border-none rounded-full text-sm focus:ring-2 focus:ring-blue-500 user-select-none dark:text-white w-64 transition-all"
                            />
                        </div>
                        <button className="relative p-2 text-gray-500 hover:text-blue-600 transition-colors hidden sm:block">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-gray-800"></span>
                        </button>

                        {/* Botón Toggle Dark Mode */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                            title={theme === 'dark' ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
                        >
                            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>

                        <div className="hidden sm:flex items-center gap-2 cursor-pointer border-l pl-3 lg:pl-6 border-gray-200 dark:border-gray-700">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                                AD
                            </div>
                            <div className="hidden md:block text-sm text-right">
                                <p className="font-semibold text-gray-700 dark:text-gray-200 leading-none">Admin User</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Administrador</p>
                            </div>
                            <ChevronDown className="w-4 h-4 text-gray-400 hidden md:block" />
                        </div>
                    </div>
                </header>

                {/* Scrollable Content Area */}
                <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 p-4 lg:p-8 transition-colors duration-300">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;
