namespace BackendApi.Models
{
    public class ProducaoApiario
    {
        public int Id { get; set; }
        public required Apiario Apiario { get; set; }
        public decimal TotalProduzidoKg { get; set; } = 0m;
        public decimal TotalVendido {get; set;}
        public decimal EstoqueAtualKg { get; set; } = 0m;   // sobe e desce
        public string? Observacao { get; set; }
        public DateTime CreationDate { get; set; } = DateTime.Now;
        public DateTime? DeletionDate { get; set; } = null;
    }
}
