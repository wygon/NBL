using System.Collections.Generic;
using Domain.Entities.Common;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class NullableLists : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<List<DateTimeFromTo>>(
                name: "requested_dates",
                table: "appointments",
                type: "jsonb",
                nullable: true,
                oldClrType: typeof(List<DateTimeFromTo>),
                oldType: "jsonb");

            migrationBuilder.AlterColumn<string>(
                name: "nail_addons",
                table: "appointments",
                type: "jsonb",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "jsonb");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<List<DateTimeFromTo>>(
                name: "requested_dates",
                table: "appointments",
                type: "jsonb",
                nullable: false,
                oldClrType: typeof(List<DateTimeFromTo>),
                oldType: "jsonb",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "nail_addons",
                table: "appointments",
                type: "jsonb",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "jsonb",
                oldNullable: true);
        }
    }
}
