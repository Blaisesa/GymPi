using System;

using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GymPi.Infrastructure.Persistence.Migrations;

public partial class AddHydrationEntries : Migration
{
    private static readonly string[] HydrationEntryIndexColumns =
        ["profile_id", "consumed_at_utc"];

    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.CreateTable(
            name: "hydration_entries",
            columns: table => new
            {
                id = table.Column<Guid>(type: "uuid", nullable: false),
                profile_id = table.Column<Guid>(type: "uuid", nullable: false),
                amount_ml = table.Column<int>(type: "integer", nullable: false),
                consumed_at_utc = table.Column<DateTimeOffset>(
                    type: "timestamp with time zone",
                    nullable: false),
            },
            constraints: table =>
            {
                table.PrimaryKey("pk_hydration_entries", entry => entry.id);
                table.CheckConstraint(
                    "ck_hydration_entries_amount",
                    "amount_ml BETWEEN 1 AND 5000");
                table.ForeignKey(
                    name: "fk_hydration_entries_household_profiles_profile_id",
                    column: entry => entry.profile_id,
                    principalTable: "household_profiles",
                    principalColumn: "id",
                    onDelete: ReferentialAction.Restrict);
            });

        migrationBuilder.CreateIndex(
            name: "ix_hydration_entries_profile_consumed_at",
            table: "hydration_entries",
            columns: HydrationEntryIndexColumns);
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropTable(name: "hydration_entries");
    }
}
