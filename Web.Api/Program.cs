using Application;
using Application.Common.Interfaces;
using Application.Configuration;
using AutoMapper;
using Domain.Interfaces.Services;
using Infrastructure.Services;
using Microsoft.OpenApi.Models;
using Web.Api.Persistence.Extensions;
using Web.Api.Services;
using static Infrastructure.DependencyInjection;

var builder = WebApplication.CreateBuilder(args);

builder.Services.Configure<RouteOptions>(options => options.LowercaseUrls = true);
builder.Services.Configure<StorageSettings>(builder.Configuration.GetSection("StorageSettings"));

builder.Services.AddControllers()
    .AddJsonOptions(options =>
{
    options.JsonSerializerOptions.Converters.Add(new System.Text.Json.Serialization.JsonStringEnumConverter());
});

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
//builder.Services.AddOpenApi();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo { Title = "Moje API", Version = "v1" });

    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "Wpisz token JWT w formacie: Bearer {twój_token}",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("WebReactPolicy", policy =>
    {
        //policy.WithOrigins("http://localhost:5173")
        //      .AllowAnyHeader()
        //      .AllowAnyMethod();
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddApplication();

builder.Services.AddInfrastructure(builder.Configuration);

builder.Services.AddProblemDetails();

builder.Services.AddHttpContextAccessor(); //wymagane aby zapisywac dane o uzytkowniku
builder.Services.AddScoped<IIdentityProvider, CurrentUser>(); //to wrzucic do dependencyinjection.cs
builder.Services.AddScoped<IFileStorageService, FileLocalStorageSystem>();

builder.Logging.AddConsole();

WebApplication app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    //app.MapOpenApi();
    //app.MapScalarApiReference();

    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Moje API v1");
    });

    IMapper mapper = app.Services.GetRequiredService<IMapper>();
    try
    {
        mapper.ConfigurationProvider.AssertConfigurationIsValid();
    }
    catch (AutoMapperConfigurationException ex)
    {
        Console.WriteLine(ex.Message);
        throw;
    }
}

app.UseHttpsRedirection();

app.UseCors("WebReactPolicy");

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

await app.InitialiseDatabaseAsync(app.Environment.IsDevelopment());

app.UseStaticFiles();

app.Run();
