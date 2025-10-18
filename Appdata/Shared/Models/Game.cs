using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Demo_Web_API_Front.Appdata.Shared.Models;

[Table("game")]
public partial class Game
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Column("title")]
    [StringLength(150)]
    public string Title { get; set; } = null!;

    [Column("description")]
    public string Description { get; set; } = null!;

    [Column("price", TypeName = "money")]
    public decimal Price { get; set; }

    [Column("date_of_release")]
    public DateOnly DateOfRelease { get; set; }

    [Column("rating")]
    public byte? Rating { get; set; }

    [Column("genre_id")]
    public int? GenreId { get; set; }

    [ForeignKey("GenreId")]
    [InverseProperty("Games")]
    public virtual Genre? Genre { get; set; }
}
