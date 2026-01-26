using Microsoft.EntityFrameworkCore;
using BackendApi.Dto;
using BackendApi.Models;
using BackendApi.Services.SenhaService;
using BackendApi.Data;

namespace BackendApi.Services.AuthService
{
    public class AuthService : IAuthInterface
    {
        private readonly AppDbContext _context;
        private readonly ISenhaInterface _senhaInterface;
        public AuthService(AppDbContext context, ISenhaInterface senhaInterface)
        {
            _context = context;
            _senhaInterface = senhaInterface;
        }
        

        public async Task<Response<UserCriacaoDTO>> Registrar(UserCriacaoDTO userRegister)
        {
            Response<UserCriacaoDTO> response = new Response<UserCriacaoDTO>();
            try
            {
                if (!VerificaCpfJaExiste(userRegister))
                {
                    response.Dados = null;
                    response.Status = false;
                    response.Mensage = "Cpf ou Email ja cadastrado!";
                    return response;
                }

                _senhaInterface.CriarSenhaHash(userRegister.Password, out byte[] senhaHash, out byte[] senhaSalt);
                User User = new User
                {
                    Nome = userRegister.Nome,
                    Cpf = userRegister.Cpf,
                    Celular = userRegister.Celular,
                    Email = userRegister.Email,
                    PasswordHash = senhaHash,
                    PasswordSalt = senhaSalt,
                    TentativasLogin = 0
                };
                _context.Add(User);
                await _context.SaveChangesAsync();

                response.Mensage = "Usuário Cadastrado!";
               
            }
            catch (Exception ex)
            {
                response.Dados = null;
                response.Status = false;
                response.Mensage = ex.Message;
            }
            return response;

        }

       public async Task<Response<string>> Login(UserLoginDTO userLogin)
        {
            Response<string> response = new Response<string>();

            try
            {
                var user = await _context.Users
                    .FirstOrDefaultAsync(u => u.Email == userLogin.Email && u.DeletionDate == null);

                // Mensagem genérica por segurança
                if (user == null)
                {
                    response.Status = false;
                    response.Mensage = "Email ou senha inválidos.";
                    return response;
                }

                // Verifica se está bloqueado
                if (user.LoginBloqueado != null && user.LoginBloqueado > DateTime.Now)
                {
                    response.Status = false;
                    response.Mensage = "Usuário bloqueado. Tente novamente em alguns minutos.";
                    return response;
                }

                // Validação da senha
                if (!_senhaInterface.VerificaSenhaHash(
                    userLogin.Password,
                    user.PasswordHash,
                    user.PasswordSalt))
                {
                    user.TentativasLogin++;

                    if (user.TentativasLogin >= 3)
                    {
                        user.LoginBloqueado = DateTime.Now.AddMinutes(5);
                        user.TentativasLogin = 0;

                        response.Mensage =
                            "Usuário bloqueado por 5 minutos após 3 tentativas inválidas.";
                    }
                    else
                    {
                        response.Mensage = "Email ou senha inválidos.";
                    }

                    response.Status = false;
                    await _context.SaveChangesAsync();
                    return response;
                }

                // Login bem-sucedido
                var token = _senhaInterface.CriarToken(user);

                user.TentativasLogin = 0;
                user.LoginBloqueado = null;

                await _context.SaveChangesAsync();

                response.Status = true;
                response.Mensage = "Login realizado com sucesso!";
                response.Dados = token;
            }
            catch (Exception ex)
            {
                response.Status = false;
                response.Mensage = "Erro ao realizar login.";
                response.Dados = ex.Message;
            }

            return response;
        }


          public bool VerificaCpfJaExiste(UserCriacaoDTO userRegister)
        {
            var user = _context.Users.FirstOrDefault(User => User.Cpf == userRegister.Cpf || User.Email == userRegister.Email);
            return user == null ? true : false;
        }
    }
}
