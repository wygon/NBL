using AutoMapper;

namespace Application.Common.Mappings
{
    public class AppointmentMappingProfile : Profile
    {
        public AppointmentMappingProfile()
        {
            //CreateMap<Service, ServiceDto>();
            //CreateMap<Addon, AddonDto>();

            //CreateMap<Appointment, AppointmentDto>()
            //    // Mapowanie statusu (to już masz, jest super)
            //    .ForMember(dest => dest.Status,
            //        opt => opt.MapFrom(src => src.Status.GetType().Name.Replace("Status", "")))

            //    // Mapowanie enumów na string (dla bezpieczeństwa)
            //    .ForMember(dest => dest.NailSize, opt => opt.MapFrom(src => src.NailSize.ToString()))
            //    .ForMember(dest => dest.Variant, opt => opt.MapFrom(src => src.Variant.ToString()))

            //    // AutoMapper automatycznie zmapuje listę Addon -> AddonDto, 
            //    // jeśli zdefiniowałeś CreateMap<Addon, AddonDto>()
            //    .ForMember(dest => dest.Addons, opt => opt.MapFrom(src => src.Addons));
        }
    }
}
