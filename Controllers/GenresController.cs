using Demo_Web_API_Front.Appdata.Shared;
using Microsoft.AspNetCore.Mvc;

namespace Demo_Web_API_Front.Controllers;

[Route("api/genres")]
[ApiController]
public class GenresController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public GenresController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public IActionResult Get()
    {
        var genres = _context
            .Genres
            .Select(genre => new 
            {
                id = genre.Id,
                name = genre.Name,
            })
            .ToList();

        return Ok(genres);
    }
}