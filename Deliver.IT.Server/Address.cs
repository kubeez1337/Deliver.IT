using System.Text.Json.Serialization;

namespace Deliver.IT.Server
{
    public class Address
    {
        public int Id { get; set; } // Change to int and let EF generate the ID
        public string Latitude { get; set; }
        public string Longitude { get; set; }
        public string? City { get; set; }
        public string? ConscriptionNumber { get; set; }
        public string? HouseNumber { get; set; }
        public string? Postcode { get; set; }
        public string? Street { get; set; }
        public string? StreetNumber { get; set; }
        public string? Suburb { get; set; }

    }
    public class Node
    {
        [JsonPropertyName("id")]
        public string Id { get; set; }
        [JsonPropertyName("lat")]
        public string Lat { get; set; }
        [JsonPropertyName("lon")]
        public string Lon { get; set; }
        [JsonPropertyName("tags")]
        public Dictionary<string, string> Tags { get; set; }
    }
}
