export type AppointmentDto = {
  id: number; // Dodane, bo musi być!
  status: string;
  from: string | null; // w JS daty z API to zwykle stringi ISO
  to: string | null;
  nailService: string | null;
  nailSize: string | null;
  nailForm: string | null;
  nailAddons: string[] | null;
  additionalNotesUser: string | null;
  additionalNotesArtist: string | null;
  // requestedDates pominięte dla czytelności, ale wiesz jak działają :)
};