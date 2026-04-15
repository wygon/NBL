import { DateTimeFromTo, NailSize } from "../appointment";

export interface CreateAppointmentCommand {
  requestedArtistId: number | null;
  userId: number;
  requestedDates: DateTimeFromTo[];
  serviceId: number;
  nailSize: NailSize | null;
  variantId: number;
  addonsIds: number[];
  additionalNotes: string | null;
}