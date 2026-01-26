using BackendApi.Enums;
using BackendApi.Models;

namespace BackendApi.Dto.ApiarioDTO
{   
public class ApiarioCreateDTO
{   
    public Localizacao? Localizacao {get; set;}
    public string? Coord_X { get; set; }
    public string? Coord_Y { get; set; }
    public required string Bioma { get; set; }
    public required string TipoDeAbelha { get; set; }
    public required string TipoDeMel {get; set;}
    public StatusAtividadeEnum Atividade { get; set; }
}

}