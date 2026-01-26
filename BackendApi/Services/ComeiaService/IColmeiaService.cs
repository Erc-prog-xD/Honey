using BackendApi.Dto.ColmeiaDTO;
using BackendApi.Models;

namespace BackendApi.Services.ColmeiaService
{
    public interface IColmeiaService
    {
        Task<Response<string>> CriarColmeia(int userId, ColmeiaCreateDTO dto);
        Task<Response<List<ColmeiaResponseDTO>>> BuscarColmeiasDoApiario(int apiarioId);
        Task<Response<string>> EditarColmeia(int userId, int colmeiaId, ColmeiaUpdateDTO dto);
        Task<Response<string>> DeletarColmeia(int userId, int colmeiaId);
    }
}