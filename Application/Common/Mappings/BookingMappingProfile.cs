using Application.Features.Appointments.Queries.GetAppointmentBookingData;
using AutoMapper;
using Domain.Entities;

namespace Application.Common.Mappings
{
    public class BookingMappingProfile : Profile
    {
        public BookingMappingProfile()
        {
            CreateMap<ServiceCategory, ServiceCategoryDto>();
            CreateMap<Service, ServiceDto>();
            CreateMap<Addon, AddonDto>();
            CreateMap<Variant, VariantDto>();
        }
    }
}
