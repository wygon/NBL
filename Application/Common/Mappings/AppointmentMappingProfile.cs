using Application.Features.Appointments;
using AutoMapper;
using Domain.Entities;

namespace Application.Common.Mappings
{
    public class AppointmentMappingProfile : Profile
    {
        public AppointmentMappingProfile()
        {
            CreateMap<Appointment, AppointmentDto>()
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src =>
                    src.Status.GetType().Name.Replace("Status", "")))
                .ForMember(dest => dest.CustomerName, opt => opt.MapFrom(src =>
                    src.Customer != null ? $"{src.Customer.Name}".Trim() : null))
                .ForMember(dest => dest.CustomerPhone, opt => opt.MapFrom(src =>
                    src.Customer != null ? src.Customer.PhoneNumber : null));
        }
    }
}
