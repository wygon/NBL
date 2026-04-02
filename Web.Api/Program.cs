using Application.Common.Interfaces;
using AspNet.Security.OAuth.Instagram;
using Microsoft.AspNetCore.Authentication.Cookies;
using Web.Api.Services;
using static Infrastructure.DependencyInjection;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

builder.Services.AddCors(options =>
{
    options.AddPolicy("WebReactPolicy", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddInfrastructure(builder.Configuration);

builder.Services.AddAuthentication(options =>
{
    options.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = InstagramAuthenticationDefaults.AuthenticationScheme;
})
.AddCookie() // Instagram potrzebuje ciasteczka, by "pamiętać" stan logowania
.AddInstagram(options =>
{
    options.ClientId = builder.Configuration["Instagram:ClientId"];
    options.ClientSecret = builder.Configuration["Instagram:ClientSecret"];
    options.SaveTokens = true; // Zapisze AccessToken Instagrama w Claimsach
});

builder.Services.AddProblemDetails();

builder.Services.AddHttpContextAccessor(); //wymagane aby zapisywac dane o uzytkowniku
builder.Services.AddScoped<IUser, CurrentUser>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseCors("WebReactPolicy");

app.UseAuthorization();

app.MapControllers();

app.Run();
