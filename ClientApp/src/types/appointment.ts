// types/appointment.ts

export enum NailService {
  ManicureHybrid = 1,
  ManicureClassic = 2,
  ZelNaturalnaPlytka = 3,
  PrzedluzenieZelowe = 4,
  UzupelnienieZelowe = 5,
  Pedicure = 6,
  PedicureFrezarkowy = 7,
  SciaganieHybrydyZelu = 8,
  ClassicManicure = 9
}

export enum NailSize {
  Short = 1,
  Medium = 2,
  Long = 3
}

export enum NailForm {
  Migdal = 1,
  Kwadrat = 2,
  MiekkiKwadrat = 3,
  Owal = 4
}

// Mimo że w C# jest to [Flags], we frontendzie zazwyczaj 
// najwygodniej przesyłać to jako tablicę wybranych wartości (number[]).
export enum NailAddons {
  French = 1,
  Ozdoby3D = 2,
  Cyrkonie = 3,
  Pylek = 4,
  Syrenka = 5,
  Princess = 6,
  Folia = 7,
  ZdobieniaMalowane = 8
}

export interface DateTimeFromTo {
  from: Date | string; // string przydaje się przy serializacji JSON do API
  to: Date | string;
}