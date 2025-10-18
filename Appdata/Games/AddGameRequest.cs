namespace Demo_Web_API_Front.Appdata.Games;

public record class AddGameRequest(
    string title,
    string description,
    string releaseDate,
    byte rating,
    decimal price,
    int genreId
);