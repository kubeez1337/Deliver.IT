using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using System.Threading.Tasks;
using System.IO;
using System.Collections.Generic;
using Deliver.IT.Server;
namespace Deliver.IT.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class MapController : ControllerBase
    {
        private readonly DeliverItDbContext _context;
        private readonly ILogger<MapController> _logger;

        public MapController(DeliverItDbContext context, ILogger<MapController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpPost("/seedDatabaseFromJson")]
        //[Authorize(Roles = "1")]
        public async Task<IActionResult> SeedDatabaseFromJson()
        {
            if (await _context.Addresses.AnyAsync())
            {
                return BadRequest("Database has already been seeded.");
            }

            try
            {
                var json = await System.IO.File.ReadAllTextAsync("Resources/filtered_nodes.json");
                _logger.LogInformation("JSON content: {Json}", json);

                var nodes = JsonSerializer.Deserialize<List<Node>>(json);
                if (nodes == null || nodes.Count == 0)
                {
                    _logger.LogWarning("No nodes found in the JSON file.");
                    return BadRequest("No nodes found in the JSON file.");
                }

                foreach (var node in nodes)
                {
                    _logger.LogInformation("Deserialized Node: {Node}", JsonSerializer.Serialize(node));

                    if (string.IsNullOrEmpty(node.Id) || string.IsNullOrEmpty(node.Lat) || string.IsNullOrEmpty(node.Lon))
                    {
                        _logger.LogWarning("Node with missing required fields: {Node}", JsonSerializer.Serialize(node));
                        continue;
                    }

                    var address = new Address
                    {
                        Latitude = node.Lat,
                        Longitude = node.Lon,
                        City = node.Tags.ContainsKey("addr:city") ? node.Tags["addr:city"] : null,
                        ConscriptionNumber = node.Tags.ContainsKey("addr:conscriptionnumber") ? node.Tags["addr:conscriptionnumber"] : null,
                        HouseNumber = node.Tags.ContainsKey("addr:housenumber") ? node.Tags["addr:housenumber"] : null,
                        Postcode = node.Tags.ContainsKey("addr:postcode") ? node.Tags["addr:postcode"] : null,
                        Street = node.Tags.ContainsKey("addr:street") ? node.Tags["addr:street"] : null,
                        StreetNumber = node.Tags.ContainsKey("addr:streetnumber") ? node.Tags["addr:streetnumber"] : null,
                        Suburb = node.Tags.ContainsKey("addr:suburb") ? node.Tags["addr:suburb"] : null,
                        //Entrance = node.Tags.ContainsKey("entrance") ? node.Tags["entrance"] : null,
                        //RefMinvskAddress = node.Tags.ContainsKey("ref:minvskaddress") ? node.Tags["ref:minvskaddress"] : null,
                        //SourceAddr = node.Tags.ContainsKey("source:addr") ? node.Tags["source:addr"] : null
                    };
                    address.SetAddress();
                    _context.Addresses.Add(address);
                    await _context.SaveChangesAsync(); // Save to get the generated ID

                   
                }

                await _context.SaveChangesAsync();
                return Ok("Database seeded successfully.");
            }
            catch (JsonException ex)
            {
                _logger.LogError(ex, "Error deserializing JSON file.");
                return StatusCode(500, "Error deserializing JSON file.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while seeding the database.");
                return StatusCode(500, "An error occurred while seeding the database.");
            }
        }
        [HttpGet("/getAddresses")]
        public async Task<ActionResult<IEnumerable<Address>>> GetAddresses()
        {
            var addresses = await _context.Addresses.ToListAsync();

            return Ok(addresses);
        }
    }
    


}
