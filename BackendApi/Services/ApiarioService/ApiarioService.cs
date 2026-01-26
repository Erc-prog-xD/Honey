using BackendApi.Enums;
using BackendApi.Data;
using BackendApi.Dto.ApiarioDTO;
using BackendApi.Models;
using Microsoft.EntityFrameworkCore;

namespace BackendApi.Services.ApiarioService
{
    public class ApiarioService : IApiarioService
    {
        private readonly AppDbContext _context;

        public ApiarioService(AppDbContext context)
        {
            _context = context;
        }

        // ----------------------------
        // Criar Apiário
        // ----------------------------
       public async Task<Response<string>> CriarApiario(ApiarioCreateDTO dto, int userId)
        {
            var response = new Response<string>();

            try
            {
                var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);

                if (user == null)
                {
                    response.Status = false;
                    response.Mensage = "Usuário não encontrado.";
                    return response;
                }

                var apiario = new Apiario
                {
                    User = user,
                    Localizacao = dto.Localizacao,
                    Coord_X = dto.Coord_X,
                    Coord_Y = dto.Coord_Y,
                    Bioma = dto.Bioma,
                    TipoDeAbelha = dto.TipoDeAbelha,
                    TipoDeMel = dto.TipoDeMel,
                    Atividade = dto.Atividade,
                    CreationDate = DateTime.Now
                };

                _context.Apiarios.Add(apiario);
                await _context.SaveChangesAsync();

                // Agora cria a Producao vinculada ao Apiario recém-criado
                var producao = new ProducaoApiario
                {
                    Apiario = apiario,
                    TotalProduzidoKg = 0m,
                    EstoqueAtualKg = 0m,
                    CreationDate = DateTime.Now
                };

                _context.ProducaoApiarios.Add(producao);
                await _context.SaveChangesAsync();

                response.Dados = null;
                response.Mensage = "Operação realizada com sucesso.";
                response.Status = true;
            }
            catch (Exception ex)
            {
                response.Dados = null;
                response.Mensage = "Erro ao criar apiário: " + ex.Message;
                response.Status = false;
            }

            return response;
        }


        // ----------------------------
        // Buscar Apiários do Usuário
        // ----------------------------
       public async Task<Response<List<ApiarioResponseDTO>>> BuscarApiariosDoUsuario(int userId)
        {
            var response = new Response<List<ApiarioResponseDTO>>();

            try
            {
                var apiarios = await _context.Apiarios
                    .AsNoTracking()
                    .Where(a => a.User.Id == userId && a.DeletionDate == null)
                    .Select(a => new ApiarioResponseDTO
                    {
                        Id = a.Id,
                        UserId = a.User.Id,
                        Localizacao = a.Localizacao,
                        Coord_X = a.Coord_X,
                        Coord_Y = a.Coord_Y,
                        Bioma = a.Bioma,
                        TipoDeAbelha = a.TipoDeAbelha,
                        TipoDeMel = a.TipoDeMel,
                        Atividade = a.Atividade,
                        CreationDate = a.CreationDate,
                        DeletionDate = a.DeletionDate
                    })
                    .ToListAsync();

                response.Status = true;
                response.Dados = apiarios;
            }
            catch (Exception ex)
            {
                response.Status = false;
                response.Mensage = $"Erro ao buscar apiários: {ex.Message}";
            }

            return response;
        }
        /*
            Aqui Bioma e Ativida sendo atualizadas.
            Como eu não sei é necessário o response dos dados de apiário eu coloquei o responde como bool e eu tentei criar o ApiarioResponseDTO.
         */

        public async Task<Response<bool>> EditarApiario(int userId,int apiarioId, ApiarioUpdateDTO dto){
            var response = new Response<bool>();

            try
            {
                var apiario = await _context.Apiarios
                    .Include(c => c.User)
                    .FirstOrDefaultAsync(u => 
                        u.Id == apiarioId && 
                        u.User.Id == userId && 
                        u.DeletionDate == null
                    );

                if(apiario == null){
                    response.Status = false;
                    response.Mensage = "Apiario não encontrado ou acesso negado.";
                    response.Dados = false;
                    return response;
                }

                apiario.Bioma = dto.Bioma ?? apiario.Bioma;
                apiario.Atividade = dto.Atividade ?? apiario.Atividade;
                apiario.Coord_X = dto.Coord_X;
                apiario.Coord_Y = dto.Coord_Y;
                apiario.Localizacao = dto.Localizacao ?? apiario.Localizacao;
                apiario.TipoDeAbelha = dto.TipoDeAbelha ?? apiario.TipoDeAbelha;
                apiario.TipoDeMel = dto.TipoDeMel ?? apiario.TipoDeMel;


                _context.Apiarios.Update(apiario);
                await _context.SaveChangesAsync();

                response.Status = true;
                response.Mensage = "Apiario atualizado com sucesso!";
                response.Dados = true;

            }catch(Exception ex){
                response.Status = false;
                response.Mensage = "Erro ao editar apiario: " + ex.Message;
                response.Dados = false;
            }

            return response;
        }

        public async Task<Response<bool>> DeletarApiario(int userId, int apiarioId){
            var response = new Response<bool>();

            try
            {
                var apiario = await _context.Apiarios
                    .Include(c => c.User)
                    .FirstOrDefaultAsync(u => 
                        u.Id == apiarioId && 
                        u.User.Id == userId && 
                        u.DeletionDate == null
                    );

                if(apiario == null){
                    response.Status = false;
                    response.Mensage = "Apiario não encontrado ou acesso negado.";
                    response.Dados = false;
                    return response;
                }

                apiario.Atividade = StatusAtividadeEnum.Desativada;
                apiario.DeletionDate = DateTime.Now;

                var colmeiasVinculadas = await _context.Colmeias
                    .Where(c => c.Apiario.Id == apiarioId && c.DeletionDate == null)
                    .ToListAsync();
                
                foreach(var colmeia in colmeiasVinculadas)
                {
                    colmeia.Status = StatusAtividadeEnum.Desativada;
                    colmeia.DeletionDate = DateTime.Now;
                }

                _context.Apiarios.Update(apiario);
                await _context.SaveChangesAsync();

                response.Status = true;
                response.Mensage = "Apiario delete com sucesso!";
                response.Dados = true;

            }catch(Exception ex){
                response.Status = false;
                response.Mensage = "Erro ao deletar apiario: " + ex.Message;
                response.Dados = false;
            }

            return response;
        }   
    }
}
