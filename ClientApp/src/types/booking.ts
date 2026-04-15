export interface ServiceDto {
  id: number;
  name: string;
  defaultPrice: number;
  defaultDurationInMinutes: number;
}

export interface CategoryDto {
  id: number;
  name: string;
  description: string | null;
  services: ServiceDto[];
}

export interface AddonDto {
  id: number;
  name: string;
  additionalPrice: number;
  additionalDurationMinutes: number;
}

export interface FormDto {
  id: number;
  name: string;
}

export interface BookingDataResponse {
  categories: CategoryDto[];
  addons: AddonDto[];
  forms: FormDto[];
}