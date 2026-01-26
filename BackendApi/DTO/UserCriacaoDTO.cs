using System.ComponentModel.DataAnnotations;

namespace BackendApi.Dto
{
    public class UserCriacaoDTO
    {
        [Required(ErrorMessage = "O campo Nome é obrigatório.")]
        public required string Nome { get; set; }

        [Required(ErrorMessage = "O campo Cpf é obrigatório.")]
        public required string Cpf { get; set; }
        
        [Required(ErrorMessage = "O campo Email é obrigatório.")]
        public required string Email {get;set;}

        [Required(ErrorMessage = "O campo Phone é obrigatório.")]
        public required string Celular {get; set;}
        
        [Required(ErrorMessage = "O campo Password é obrigatório.")]
        public required string Password { get; set; }
    }
}
