using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using MySql.Data.MySqlClient;
using System.Data;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
        policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());
});
var app = builder.Build();

app.UseCors();

string connStr = "Server=localhost;Database=felhasznalok;Uid=root;Pwd=;";

// 🟢 Regisztráció
app.MapPost("/api/register", async (HttpContext context) =>
{
    var data = await context.Request.ReadFromJsonAsync<User>();
    if (data == null || string.IsNullOrWhiteSpace(data.Username) ||
        string.IsNullOrWhiteSpace(data.Email) || string.IsNullOrWhiteSpace(data.Password))
    {
        context.Response.StatusCode = 400;
        await context.Response.WriteAsync("Hiányzó adatok");
        return;
    }

    using var conn = new MySqlConnection(connStr);
    conn.Open();

    var checkCmd = new MySqlCommand("SELECT COUNT(*) FROM adatok WHERE email=@e", conn);
    checkCmd.Parameters.AddWithValue("@e", data.Email);
    var exists = Convert.ToInt32(checkCmd.ExecuteScalar()) > 0;

    if (exists)
    {
        context.Response.StatusCode = 409;
        await context.Response.WriteAsync("Ez az email már regisztrálva van.");
        return;
    }

    var cmd = new MySqlCommand(
        "INSERT INTO adatok (felhasznalonev, email, jelszo) VALUES (@u, @e, @p)", conn);
    cmd.Parameters.AddWithValue("@u", data.Username);
    cmd.Parameters.AddWithValue("@e", data.Email);
    cmd.Parameters.AddWithValue("@p", data.Password);
    cmd.ExecuteNonQuery();

    await context.Response.WriteAsync("Sikeres regisztráció!");
});

// 🔵 Bejelentkezés
app.MapPost("/api/login", async (HttpContext context) =>
{
    var data = await context.Request.ReadFromJsonAsync<User>();
    if (data == null || string.IsNullOrWhiteSpace(data.Email) || string.IsNullOrWhiteSpace(data.Password))
    {
        context.Response.StatusCode = 400;
        await context.Response.WriteAsync("Hiányzó adatok");
        return;
    }

    using var conn = new MySqlConnection(connStr);
    conn.Open();

    var cmd = new MySqlCommand(
        "SELECT * FROM adatok WHERE (email=@e OR felhasznalonev=@e) AND jelszo=@p", conn);
    cmd.Parameters.AddWithValue("@e", data.Email);
    cmd.Parameters.AddWithValue("@p", data.Password);

    using var reader = cmd.ExecuteReader();
    if (reader.Read())
    {
        var user = new
        {
            Id = reader.GetInt32("id"),
            Username = reader.GetString("felhasznalonev"),
            Email = reader.GetString("email")
        };
        await context.Response.WriteAsJsonAsync(user);
    }
    else
    {
        context.Response.StatusCode = 401;
        await context.Response.WriteAsync("Hibás bejelentkezési adatok!");
    }
});

app.Run();

record User(string? Username, string? Email, string? Password);