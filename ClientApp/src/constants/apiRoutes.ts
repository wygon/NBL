export const ApiRoutes = {
  BaseUrl: 'http://10.0.2.2:2115/api', // lub pobierane z Process.env
  
  Appointments: {
    GetAll: '/appointments',
    GetById: (id: number | string) => `/appointments/${id}`,
    Requested: '/appointments/requested',
    Confirmed: '/appointments/confirmed',
    Cancel: (id: number | string) => `/appointments/cancel/${id}`,
  },
  
  Artists: {
    List: '/artists',
    Profile: (slug: string) => `/artists/${slug}`,
  },
  
  Auth: {
    Login: '/auth/login',
    Register: '/auth/register',
  }
} as const;