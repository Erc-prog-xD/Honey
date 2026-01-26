using BackendApi.Dto;
using BackendApi.Models;

namespace BackendApi.Services.AuthService
{
    public interface IAuthInterface
    {
        Task<Response<UserCriacaoDTO>> Registrar(UserCriacaoDTO UserRegister);
        Task<Response<string>> Login(UserLoginDTO UserLogin);

    }
}
