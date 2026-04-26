using Application.Features.Notifications;
using AutoMapper;
using Domain.Entities;

namespace Application.Common.Mappings
{
    public class NotificationMappingProfile : Profile
    {
        public NotificationMappingProfile()
        {
            CreateMap<Notification, NotificationDto>()
                .ForMember(dest => dest.Created, opt => opt.MapFrom(src => src.CreatedDate));
        }
    }
}
