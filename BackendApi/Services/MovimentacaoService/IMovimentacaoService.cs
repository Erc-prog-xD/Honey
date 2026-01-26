using BackendApi.Dto.MovimentacaoDTO;
using BackendApi.Models;

public interface IMovimentacaoService
{
    Task<Response<string>> CriarMovimentacao(int userId, int apiarioId, MovimentacaoCreateDTO dto);
}
