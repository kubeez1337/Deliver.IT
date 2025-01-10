namespace Deliver.IT.Server.Models
{
    public class CourierApplication
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public string UserName { get; set; }
        public string Message { get; set; }
    }
    public class CourierApplicationModel
    {
        public string Message { get; set; }
    }
    public class ProcessCourierApplicationModel
    {
        public int ApplicationId { get; set; }
        public bool Approve { get; set; }
    }
}
