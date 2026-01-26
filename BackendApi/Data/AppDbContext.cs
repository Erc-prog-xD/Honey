
using BackendApi.Models;
using Microsoft.EntityFrameworkCore;

namespace BackendApi.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
            
        }
        public DbSet<User> Users { get; set; }
        public DbSet<Apiario> Apiarios {get; set;}
        public DbSet<Colmeia> Colmeias { get; set; }
        public DbSet<ProducaoApiario> ProducaoApiarios {get; set;}
        public DbSet<MovimentoMel> MovimentacaoMel {get; set;}

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // 🔹 Diz ao EF que Endereco faz parte de Agendamento
            modelBuilder.Entity<Apiario>().OwnsOne(a => a.Localizacao);

            modelBuilder.Entity<MovimentoMel>()
                .Property(x => x.QuantidadeKg)
                .HasPrecision(18, 3); // até 999 trilhões, com 3 casas decimais (kg)

            modelBuilder.Entity<ProducaoApiario>()
                .Property(x => x.TotalProduzidoKg)
                .HasPrecision(18, 3);

             modelBuilder.Entity<ProducaoApiario>()
                .Property(x => x.TotalVendido)
                .HasPrecision(18, 2);

             modelBuilder.Entity<ProducaoApiario>()
                .Property(x => x.EstoqueAtualKg)
                .HasPrecision(18, 3);
            
              // Se você tiver Valor (dinheiro):
            modelBuilder.Entity<MovimentoMel>()
                .Property(x => x.Valor)
                .HasPrecision(18, 2); // dinheiro normalmente 2 casas
        }

    }
}