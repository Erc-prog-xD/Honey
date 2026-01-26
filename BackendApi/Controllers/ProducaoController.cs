using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using BackendApi.Services.ProducaoService;
using BackendApi.Dto.ProducaoDTO;

namespace BackendApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ProducaoController : ControllerBase
    {
        private readonly IProducaoService _producaoInterface;

        public ProducaoController(IProducaoService producaoInterface)
        {
            _producaoInterface = producaoInterface;
        }

        // [HttpPost("CriarProducao")]
        // public async Task<ActionResult> CriarProducao(ProducaoCreateDTO dto)
        // {
        //     var response = await _producaoInterface.CriarProducao(dto);
        //     return Ok(response);
        // }

        // [HttpGet("BuscarProducoesDoApiario")]
        // public async Task<ActionResult> BuscarProducoesDoApiario(int apiarioId)
        // {
        //     var response = await _producaoInterface.BuscarProducoesDoApiario(apiarioId);
        //     return Ok(response);
        // }
    }
}
