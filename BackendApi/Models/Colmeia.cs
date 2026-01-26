using BackendApi.Enums;

namespace BackendApi.Models
{
    public class Colmeia
    {
        public int Id { get; set; }
        public required Apiario Apiario { get; set; }
        public required int AnoColmeia { get; set; }
        public int? AnoRainha { get; set; }
        public StatusAtividadeEnum Status { get; set; }
        public DateTime CreationDate { get; set; } = DateTime.Now;
        public DateTime? DeletionDate { get; set; } = null;
    }
}