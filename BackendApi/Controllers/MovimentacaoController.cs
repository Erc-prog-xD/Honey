using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using BackendApi.Dto.MovimentacaoDTO;
using System.Security.Claims;

namespace BackendApi.Controllers
{
    [ApiController]
    [Authorize]
    [Route("api/apiarios/{apiarioId}/movimentacoes")]
    public class MovimentacaoController : ControllerBase
    {
        private readonly IMovimentacaoService _movimentacaoService;

        public MovimentacaoController(IMovimentacaoService movimentacaoService)
        {
            _movimentacaoService = movimentacaoService;
        }

        [HttpPost]
        public async Task<ActionResult> CriarMovimentacao(int apiarioId, [FromBody] MovimentacaoCreateDTO dto)
        {
            int userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var response = await _movimentacaoService.CriarMovimentacao(userId ,apiarioId, dto);
            
            return Ok(response);
        }
    }
}
