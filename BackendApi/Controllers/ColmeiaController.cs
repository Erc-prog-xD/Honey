using Microsoft.AspNetCore.Mvc;
using BackendApi.Services.ColmeiaService;
using Microsoft.AspNetCore.Authorization;
using BackendApi.Dto.ColmeiaDTO;
using System.Security.Claims;

namespace BackendApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ColmeiaController : ControllerBase
    {
        private readonly IColmeiaService _colmeiaInterface;
        public ColmeiaController(IColmeiaService colmeiaInterface)
        {
            _colmeiaInterface = colmeiaInterface;
        }

        [HttpPost("CriarColmeia")]
        public async Task<ActionResult> CriarColmeia(ColmeiaCreateDTO dto)
        {
            int userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var response = await _colmeiaInterface.CriarColmeia(userId ,dto);
            return Ok(response);
        }

        [HttpGet("BuscarColmeiasDoApiario/{apiarioId}")]
        public async Task<ActionResult> BuscarColmeiasDoApiario(int apiarioId)
        {
            var response = await _colmeiaInterface.BuscarColmeiasDoApiario(apiarioId);
            return Ok(response);
        }

        [HttpPut("EditarColmeia/{colmeiaId}")]
        public async Task<ActionResult> EditarColmeia(int colmeiaId, ColmeiaUpdateDTO dto)
        {
            int userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var response = await _colmeiaInterface.EditarColmeia(userId , colmeiaId, dto);
            return Ok(response);
        }

        [HttpDelete("DeletarColmeia/{colmeiaId}")]
        public async Task<ActionResult> DeletarColmeia(int colmeiaId)
        {
            int userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var response = await _colmeiaInterface.DeletarColmeia(userId , colmeiaId);
            return Ok(response);
        }
    }
}