namespace BackendApi.Dto.ProducaoDTO
{
    public class ProducaoAddDTO
    {
        public int ApiarioId { get; set; }
        public decimal QuantidadeKg { get; set; }
        public DateOnly Data { get; set; }
        public string? Observacao { get; set; }
    }
}
