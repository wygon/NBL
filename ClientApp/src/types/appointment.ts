export interface ServiceDto {
  id: number;
  name: string;
  defaultPrice: number;
  defaultDurationInMinutes: number;
}

export interface VariantDto {
  id: number;
  name: string;
}

export interface AddonDto {
  id: number;
  name: string;
  additionalPrice: number;
  additionalDurationMinutes: number;
}

export interface AppointmentDto {
  id: number;
  artistId: number | null;
  artistName: string | null;
  status: string;
  from: string | null;
  to: string | null;

  totalPrice: number; 
  totalDurationInMinutes: number;

  service: ServiceDto | null;
  variant: VariantDto | null;
  addons: AddonDto[] | null;

  nailSize: number | null;
  additionalNotesUser: string | null;
  additionalNotesArtist: string | null;
  
  customerName?: string; 
  customerPhone?: string;
  
  requestedDates: { from: string; to: string }[] | null;
}

export interface GetAppointmentsResponse {
  appointments: AppointmentDto[];
  totalCount: number;
  page: number;
  count: number;
}

export enum NailSize {
  Short = 1,
  Medium = 2,
  Long = 3
}

export interface DateTimeFromTo {
  from: Date | string; // string przydaje się przy serializacji JSON do API
  to: Date | string;
}

export interface GetAppointmentsQuery {
  requestedByUserId?: number | null;
  artistId?: number | null;
  nullArtist?: boolean;
  status?: string | null;
  from?: string | null;
  to?: string | null;
  page: number;
  count: number;
}

export interface GetAppointmentsResponse {
  appointments: AppointmentDto[];
  totalCount: number;
  page: number;
  count: number;
}