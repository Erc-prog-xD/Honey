using BackendApi.Enums;

namespace BackendApi.Dto.ColmeiaDTO
{
    
public class ColmeiaResponseDTO
{   
    public int Id { get; set; }
    public required int ApiarioId { get; set; }
    public required int AnoColmeia { get; set; }
    public int? AnoRainha { get; set; }
    public StatusAtividadeEnum Status { get; set; }
    public DateTime CreationDate {get; set;}
    public DateTime? DeletionDate { get; set; }

}
}