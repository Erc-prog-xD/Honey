using BackendApi.Dto.ApiarioDTO;
using BackendApi.Models;

namespace BackendApi.Services.ApiarioService
{
    public interface IApiarioService
    {
        Task<Response<string>> CriarApiario(ApiarioCreateDTO dto, int userId);
        Task<Response<List<ApiarioResponseDTO>>> BuscarApiariosDoUsuario(int userId);
        Task<Response<bool>> EditarApiario(int userId,int apiarioId, ApiarioUpdateDTO dto);
        Task<Response<bool>> DeletarApiario(int userId, int apiarioId);        
    }
}
