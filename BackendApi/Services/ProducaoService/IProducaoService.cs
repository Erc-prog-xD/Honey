using BackendApi.Dto.ProducaoDTO;
using BackendApi.Models;

namespace BackendApi.Services.ProducaoService
{
    public interface IProducaoService
    {
        Task<Response<string>> CriarProducao(ProducaoAddDTO dto);
        //Task<Response> BuscarProducoesDoApiario(int apiarioId);
    }
}
