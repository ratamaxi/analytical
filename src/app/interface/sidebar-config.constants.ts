import { SidebarConfig } from "./sidebar.interfaces"

export const GYM_ROUTES_CONFIG: SidebarConfig[] = [
    {
        id: 'home',
        name: 'Home',
        url: '/panel/home',
        icon: 'fa-home'
    },
    {
        id: 'base',
        name: 'Base Instalada',
        url: '/panel/base',
        icon: 'fa-database'
    },
    {
        id: 'historial',
        name: 'Historial de Reparaciones',
        url: '/panel/historial',
        icon: 'fa-file'
    },
    {
        id: 'calendario',
        name: 'Calendario',
        url: '/panel/calendario',
        icon: 'fa-calendar'
    },
    {
        id: 'cliente',
        name: 'Datos de Cliente',
        url: '/panel/cliente',
        icon: 'fa-user'
    },
    {
        id: 'stock',
        name: 'Stock',
        url: '/panel/stock',
        icon: 'fa-box'
    },
    {
        id: 'config',
        name: 'Configuracion',
        url: '/panel/configuracion',
        icon: 'fa-gear'
    },
]
