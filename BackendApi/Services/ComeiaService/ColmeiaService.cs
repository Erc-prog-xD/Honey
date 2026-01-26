using BackendApi.Enums;
using BackendApi.Data;
using BackendApi.Models;
using Microsoft.EntityFrameworkCore;
using BackendApi.Dto.ColmeiaDTO;

namespace BackendApi.Services.ColmeiaService
{
    public class ColmeiaService : IColmeiaService
    {
        private readonly AppDbContext _context;

        public ColmeiaService(AppDbContext context)
        {
            _context = context;
        }

       public async Task<Response<string>> CriarColmeia(int userId, ColmeiaCreateDTO dto)
        {
            var response = new Response<string>();

            try
            {
                var apiario = await _context.Apiarios.FirstOrDefaultAsync(u => u.Id == dto.ApiarioId && u.User.Id == userId && u.DeletionDate == null);

                if (apiario == null)
                {
                    response.Status = false;
                    response.Mensage = "Apiario não encontrado.";
                    return response;
                }

                var colmeia = new Colmeia
                {
                    Apiario = apiario,
                    AnoColmeia = dto.AnoColmeia,
                    AnoRainha = dto.AnoRainha,
                    Status = dto.Status
                };

                _context.Colmeias.Add(colmeia);
                await _context.SaveChangesAsync();

                response.Dados = null;
                response.Mensage = "Colmeia criada e vinculada ao apiario!";
                response.Status = true;
            }

            catch (Exception ex)
            {
                response.Status = false;
                response.Mensage = "Erro ao criar colmeia: " + ex.Message;
            }

            return response;
        }

        public async Task<Response<List<ColmeiaResponseDTO>>> BuscarColmeiasDoApiario(int apiarioId)
        {
            var response = new Response<List<ColmeiaResponseDTO>>();
            
            try
            {
                // 1. Inclua o Apiario para evitar NullReferenceException se for acessado no DTO
                var colmeias = await _context.Colmeias
                    .Include(c => c.Apiario) // BOA PRÁTICA: Garante que Apiario está carregado
                    .Where(c => c.Apiario.Id == apiarioId && c.DeletionDate == null)
                    .ToListAsync();
                
                if (colmeias == null || colmeias.Count == 0)
                {
                    response.Status = false;
                    response.Mensage = "Nenhuma colmeia encontrada para este Apiário."; 
                    response.Dados = new List<ColmeiaResponseDTO>(); 
                }
                else
                {
                    // 🚨 SOLUÇÃO: Mapeamento de Entidade (Colmeia) para DTO (ColmeiaResponseDTO)
                    var colmeiaDTOs = colmeias.Select(c => new ColmeiaResponseDTO
                    {
                        Id = c.Id,
                        ApiarioId = c.Apiario.Id, // Assumindo que a entidade Colmeia tem Apiario (objeto)
                        AnoColmeia = c.AnoColmeia,
                        AnoRainha = c.AnoRainha,
                        Status = c.Status,
                        CreationDate = c.CreationDate,
                        DeletionDate = c.DeletionDate ?? null
                    }).ToList();
                    
                    response.Status = true;
                    response.Mensage = "Colmeias buscadas com sucesso.";
                    response.Dados = colmeiaDTOs; // Atribui a lista de DTOs
                }
            }
            catch (Exception ex)
            {
                response.Status = false;
                response.Mensage = "Erro ao buscar colmeias: " + ex.Message;
                response.Dados = null; 
            }
            return response;
        }


        /*
            Eu coloquei id aqui, só para garantir que nenhuma ação de CRUD posssa ser feita por um usuário que está logado, mas 
            que não seja dono do apiário onde a colmeia está. Se for demais basta tirar. Creio eu que não haja muitos problemas nisso não!

            Caso as informação de em qual apiário a colmeia está poderem ser mudadas, precisasse garantir que o apiário para onde a colmeia será transferida
            produza o mesmo tipo de mel que a colmeia atualmente produz (aparentemente ela não pode ser mudada de apiário, mas nunca se sabe).
        */

        public async Task<Response<string>> EditarColmeia(int userId, int colmeiaId, ColmeiaUpdateDTO dto){
            var response = new Response<string>();

            try{
                var colmeia = await _context.Colmeias
                    .Include(c => c.Apiario)
                    .FirstOrDefaultAsync(u => 
                        u.Id ==  colmeiaId && 
                        u.Apiario.User.Id == userId &&
                        u.DeletionDate == null
                    );
                
                if (colmeia == null){
                    response.Status = false;
                    response.Mensage = "Colmeia não encontrado ou acesso negado.";
                    return response;
                }

                colmeia.AnoRainha = dto.AnoRainha ?? colmeia.AnoRainha;
                colmeia.AnoColmeia = dto.AnoColmeia ?? colmeia.AnoColmeia;
                colmeia.Status = dto.Status ?? colmeia.Status;

                _context.Colmeias.Update(colmeia);
                await _context.SaveChangesAsync();

                response.Status = true;
                response.Mensage = "Colmeia atualizada com sucesso!";
                response.Dados = null;

            }catch (Exception ex){
                response.Status = false;
                response.Mensage = "Erro ao editar colmeia: " + ex.Message;
                response.Dados = null; 
            }

            return response;
        }


        public async Task<Response<string>> DeletarColmeia(int userId, int colmeiaId){
            var response = new Response<string>();

            try
            {
                var colmeia = await _context.Colmeias
                    .Include(c => c.Apiario)
                    .FirstOrDefaultAsync(u => 
                        u.Id == colmeiaId && 
                        u.Apiario.User.Id == userId && 
                        u.DeletionDate == null);

                if (colmeia == null)
                {
                    response.Status = false;
                    response.Mensage = "Colmeia não encontrada ou acesso negado.";
                    response.Dados = null;
                    return response;
                }

                colmeia.Status = StatusAtividadeEnum.Desativada;
                colmeia.DeletionDate = DateTime.Now;
                _context.Colmeias.Update(colmeia);

                await _context.SaveChangesAsync();
                
                response.Status = true;
                response.Mensage = "Colmeia removida com sucesso!";
                response.Dados = null;

            }catch (Exception ex){
                response.Status = false;
                response.Mensage = "Erro ao deletar colmeia: " + ex.Message;
                response.Dados = null;
            }

            return response;
        }
    }
}