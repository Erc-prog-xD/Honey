using BackendApi.Enums;


namespace BackendApi.Dto.ColmeiaDTO
{    
    public class ColmeiaUpdateDTO
    {
        public int? AnoColmeia { get; set; } 
        public int? AnoRainha { get; set; }
        public StatusAtividadeEnum? Status { get; set; }           
    }
}
