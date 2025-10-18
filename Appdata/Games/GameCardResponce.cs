namespace Demo_Web_API_Front.Appdata.Games;

public record class GameCardResponce(
    int Id,
    string Title,
    string Description,
    string Genre,
    string DateOfRelease,
    byte Rating,
    string Price
);