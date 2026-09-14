// provides the smallest valid ASP.NET Core application entry point.
var builder = WebApplication.CreateBuilder(args);

var app = builder.Build();

app.Run();