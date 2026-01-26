using System.ComponentModel.DataAnnotations;
using BackendApi.Enums;

namespace BackendApi.Dto.MovimentacaoDTO
{
    public class MovimentacaoCreateDTO
    {      

        [EnumDataType(typeof(TipoMovimentoMelEnum), ErrorMessage = "Tipo invalido")]
        public TipoMovimentoMelEnum Tipo { get; set; }
        public int? ColmeiaId {get; set;} = null;
        public decimal QuantidadeKg { get; set; }
        public decimal Valor { get; set; }
        public DateOnly Data { get; set; }
        public string? Observacao { get; set; }
    }
}
