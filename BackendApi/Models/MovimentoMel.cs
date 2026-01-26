using BackendApi.Enums;


namespace BackendApi.Models
{
    public class MovimentoMel
    {
        public int Id { get; set; }
        public required Apiario Apiario { get; set; }
        public TipoMovimentoMelEnum Tipo { get; set; }
        public Colmeia? RetiradoDaColmeia {get; set;}
        public decimal QuantidadeKg { get; set; }
        public decimal Valor {get; set;}
        public DateOnly Data { get; set; }
        public string? Motivo { get; set; } // ex: "Colheita", "Venda", "Perda"
        public string? Observacao { get; set; }
        public DateTime CreationDate { get; set; } = DateTime.Now;
        public DateTime? DeletionDate { get; set; } = null;
    }
}
