using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Demo_Web_API_Front.Appdata.Shared.Models;

[Table("genre")]
public partial class Genre
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Column("name")]
    [StringLength(50)]
    public string Name { get; set; } = null!;

    [Column("description")]
    public string? Description { get; set; }

    [InverseProperty("Genre")]
    public virtual ICollection<Game> Games { get; set; } = new List<Game>();
}
