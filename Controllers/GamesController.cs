using Demo_Web_API_Front.Appdata.Games;
using Demo_Web_API_Front.Appdata.Shared;
using Demo_Web_API_Front.Appdata.Shared.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Demo_Web_API_Front.Controllers;

[Route("api/games")]
[ApiController]
public class GamesController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public GamesController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public IActionResult Get()
    {
        var games = _context
            .Database
            .SqlQuery<GameCardResponce>($"""
            SELECT  [g].[id] as [Id],
                    [g].[title] as [Title],
                    [g].[description] as [Description],
                    [gr].[name] as [Genre],
                    FORMAT([g].[date_of_release], N'dd.MM.yyyy') as [DateOfRelease],
                    [g].[rating] as [Rating],
                    FORMAT([g].[price], N'C', N'en-us') as [Price]
            FROM [game] as [g] 
            JOIN [genre] as [gr]
                 ON [g].[genre_id] = [gr].[id]
            """)
            .ToList();

        return Ok(games);
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        var game = _context.Games.Find(id);

        if (game is null)
        {
            return NotFound(new { error = "Game not found" });
        }

        _context.Games.Remove(game);
        _context.SaveChanges();

        return NoContent();
    }

    [HttpPost]
    public IActionResult Add([FromBody] AddGameRequest request)
    {
        if (!DateOnly.TryParse(request.releaseDate, out var date))
        {
            return BadRequest(new { error = "Invalid game date of release" });
        }

        var game = new Game()
        {
            Title = request.title,
            Description = request.description,
            DateOfRelease = date,
            GenreId = request.genreId,
            Price = request.price,
            Rating = request.rating,
        };

        _context.Games.Add(game);
        _context.SaveChanges();

        return Ok(game);
    }

    [HttpPut("{id}")]
    public IActionResult Update(int id, [FromBody] UpdateGameRequest request)
    {
        var game = _context.Games.Find(id);
        if (game is null)
        {
            return NotFound(new { error = "Game not found" });
        }

        if (!DateOnly.TryParse(request.releaseDate, out var date))
        {
            return BadRequest(new { error = "Invalid game date of release" });
        }

        game.Title = request.title;
        game.Description = request.description;
        game.DateOfRelease = date;
        game.GenreId = request.genreId;
        game.Price = request.price;
        game.Rating = request.rating;

        _context.Games.Update(game);
        _context.SaveChanges();
        return Ok(game);
    }
}