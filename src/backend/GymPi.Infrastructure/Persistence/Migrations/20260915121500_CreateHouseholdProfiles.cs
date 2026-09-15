using System;

using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GymPi.Infrastructure.Persistence.Migrations;

public partial class CreateHouseholdProfiles : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.CreateTable(
            name: "household_profiles",
            columns: table => new
            {
                id = table.Column<Guid>(type: "uuid", nullable: false),
                display_name = table.Column<string>(
                    type: "character varying(80)",
                    maxLength: 80,
                    nullable: false),
                time_zone_id = table.Column<string>(
                    type: "character varying(100)",
                    maxLength: 100,
                    nullable: false),
                daily_hydration_goal_ml = table.Column<int>(
                    type: "integer",
                    nullable: false),
                created_at_utc = table.Column<DateTimeOffset>(
                    type: "timestamp with time zone",
                    nullable: false),
            },
            constraints: table =>
            {
                table.PrimaryKey("pk_household_profiles", profile => profile.id);
                table.CheckConstraint(
                    "ck_household_profiles_hydration_goal",
                    "daily_hydration_goal_ml BETWEEN 250 AND 10000");
            });
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropTable(name: "household_profiles");
    }
}
