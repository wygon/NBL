import { DateTimeFromTo, NailService, NailAddons, NailSize, NailForm } from "../appointment";

export interface CreateAppointmentCommand {
  requestedArtistId?: number; // ? oznacza nullowalne (int?)
  userId: number;             // required (int)
  requestedDates: DateTimeFromTo[];
  nailService?: NailService;
  nailSize?: NailSize;
  nailForm?: NailForm;
  nailAddons: NailAddons[];   // List<NailAddons>
  additionalNotes?: string;
}