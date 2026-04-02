using Domain.Entities;
using Domain.Exceptions;
using Domain.Interfaces.Repositories;
using Infrastructure.Database;

namespace Infrastructure.Repositories
{
    public class UserRepository(AppDbContext context) : IUserRepository
    {
        private readonly AppDbContext _context = context;
        public async Task<int> SaveUser(UserCreateDto userDto)
        {
            if (_context.Users.Any(u => u.InstagramName.Equals(userDto.InstagramName)))
            {
                throw new RecordExistsException("User with the same instagram name exists.");
            }

            if (_context.Users.Any(u => u.Email.Equals(userDto.Email)))
            {
                throw new RecordExistsException("User with the same email exists.");
            }

            _context.Users.Add(new User
            {
                Name = userDto.Name,
                InstagramName = userDto.InstagramName,
                PhoneNumber = userDto.PhoneNumber,
                Email = userDto.Email,
            });

            return await _context.SaveChangesAsync();
        }

        public async Task<UserEditDto> UpdateUser(UserEditDto userDto)
        {
            User user = _context.Users.FirstOrDefault(u => u.Id == userDto.Id)
                ?? throw new RecordNotFoundException("User not found.");

            user.Name = userDto.Name;
            user.Email = userDto.Email;
            user.PhoneNumber = userDto.PhoneNumber;

            await _context.SaveChangesAsync();

            return userDto;
        }
    }
}
