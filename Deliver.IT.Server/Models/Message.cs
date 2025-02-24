namespace Deliver.IT.Server.Models
{
    public class Message
    {
        public int Id { get; set; }
        public string? Text { get; set; }
        public string? SenderId { get; set; }
        public string? ReceiverId { get; set; }
        public string? SenderName { get; set; }
        public string? ReceiverName { get; set; }
        public DateTime TimeStamp { get; set; }

    }
    public class MessageModel
    {
        public string Text { get; set;}
        public string ReceiverId { get; set; }
    }
}
