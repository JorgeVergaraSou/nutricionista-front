// src/models/routes.ts
export const PublicRoutes = {
    LOGIN: '/login',
}

export const PrivateRoutes = {
    PRIVATE: '/private',
    ADMIN: '/admin',
    USER: '/user',
    GUEST: '/guest',
    LOGOUT: '/logout',
    PERFIL: '/perfil',

    BUSCAR_PACIENTE: '/admin/pacientes/buscar',
    NUEVO_PACIENTE: '/admin/pacientes/nuevo-paciente',
    VISITS_HISTORY: '/admin/pacientes/:patientId/history',
    VISITA_HISTORICA: '/admin/pacientes/history',
    PERFIL_PACIENTE: '/admin/pacientes/:patientId/perfil',
    EDITAR_PACIENTE: "/admin/pacientes/:patientId/editar",


    VISITS_NUEVA: '/admin/visits/nueva',

    

    AGENDA_TURNOS: '/admin/turnos/agenda-turnos',
    AGENDA_SEMANAL: '/admin/turnos/agenda-semanal',
    TURNOS_GESTION: '/admin/turnos/gestion',
    TURNOS_HISTORIAL: '/admin/turnos/historial-turnos',

}