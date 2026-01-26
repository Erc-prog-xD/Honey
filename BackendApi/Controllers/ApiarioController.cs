using BackendApi.Dto.ApiarioDTO;
using BackendApi.Services.ApiarioService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace BackendApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ApiarioController : ControllerBase
    {
        private readonly IApiarioService _apiarioService;

        public ApiarioController(IApiarioService apiarioService)
        {
            _apiarioService = apiarioService;
        }

        // ----------------------------
        // Criar Apiário
        // ----------------------------
        [HttpPost("CriarApiario")]
        public async Task<IActionResult> CriarApiario([FromBody] ApiarioCreateDTO dto)
        {
            int userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var response = await _apiarioService.CriarApiario(dto, userId);
            return Ok(response);
        }

        // ----------------------------
        // Buscar Apiários do Usuário
        // ----------------------------
        [HttpGet("BuscarApiariosUserLogado")]
        public async Task<IActionResult> BuscarApiarios()
        {
            int userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var response = await _apiarioService.BuscarApiariosDoUsuario(userId);
            return Ok(response);
        }

        [HttpPut("EditarApiario/{apiarioId}")]
        public async Task<IActionResult> EditarApiario(int apiarioId ,ApiarioUpdateDTO dto)
        {
            int userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var response = await _apiarioService.EditarApiario(userId, apiarioId, dto);
            return Ok(response);
        }

        [HttpDelete("DeletarApiario/{apiarioId}")]
        public async Task<IActionResult> DeletarApiario(int apiarioId)
        {
            int userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var response = await _apiarioService.DeletarApiario(userId, apiarioId);
            return Ok(response);
        }
    }
}
