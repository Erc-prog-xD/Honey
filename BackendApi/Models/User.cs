
namespace BackendApi.Models
{
    public class User
    {
        public int Id { get; set; }
        public required string Nome { get; set; }
        public required string Cpf { get; set; }
        public required string Celular { get; set; }
        public required string Email {get; set;}
        public required byte[] PasswordHash { get; set; }
        public required byte[] PasswordSalt { get; set; }
        public bool IsAdmin { get; set; } = false;
        public int TentativasLogin {get; set; } = 0;
        public DateTime? LoginBloqueado {get; set;} = null;
        public DateTime CreationDate { get; set; } = DateTime.Now;
        public DateTime? DeletionDate { get; set; } = null;

    }
}