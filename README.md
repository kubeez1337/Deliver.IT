# Inštalácia Deliver.IT projektu

## Inštalácia

Je potrebné nainštalovať .NET Sdk, Entity framework, Node.js

https://dotnet.microsoft.com/en-us/download \
https://nodejs.org/en \
https://learn.microsoft.com/en-us/ef/core/cli/dotnet \
Potom treba nainštalovať Angular použitím príkazu \
`npm install -g @angular/cli`\
ďalej Angular Material UI library 
https://material.angular.io/ \
pomocou príkazu `ng add @angular/material`

## Spustenie

po naklonovaní repozitára použitím príkazu `git clone https://github.com/kubeez1337/Deliver.IT.git` je potreba sa presmerovať do adresára serveru `/Deliver.IT.Server/` kde je potreba vykonať následujúce kroky ktoré vytvoria migrácie databázy SQLite pre entity framework definovanej v serviceDependencies.json \
`dotnet ef migrations add <Názov>` \
`dotnet ef database update` \
po týchto krokoch by mala zbenúť spomínaná príprava databázových tabuliek definovaná v `DeliverITDbContext.cs` \
pre spustenie samotného backendu je potreba v tomto istom adresári spustiť `dotnet run` alebo `dotnet watch` \
v prípade že by sa frontendová aplikácia nepustila je treba sa navigovať do adresára `./deliver.it.client/` kde treba spustiť `ng serve` alebo `npm start`

### OSRM
#### Node.js
`npm install @mapbox/polyline` \
`npm install leaflet`
#### Windows

Nainstalujte Rancher Desktop alebo docker, spustite aplikaciu. \
Stiahnite backend `docker pull osrm/osrm-backend` \
Vytvorte adresar pre stiahnutie osrm datovych suborov. \
Stiahnite datovy subor `curl -o slovakia-latest.osm.pbf https://download.geofabrik.de/europe/slovakia-latest.osm.pbf` 
1. extract `docker run -t -v [ABSOLUTNA CESTA K PRIECINKU]:/data osrm/osrm-backend osrm-extract -p /opt/car.lua /data/slovakia-latest.osm.pbf` 
2. partition `docker run -t -v [ABSOLUTNA CESTA K PRIECINKU]:/data osrm/osrm-backend osrm-partition /data/slovakia-latest.osrm` 
3. customize `docker run -t -v [ABSOLUTNA CESTA K PRIECINKU]:/data osrm/osrm-backend osrm-customize /data/slovakia-latest.osrm` 
4. `start docker run -t -i -p 5000:5000 -v [ABSOLUTNA CESTA K PRIECINKU]:/data osrm/osrm-backend osrm-routed --algorithm mld /data/slovakia-latest.osrm --max-table-size 1000 --max-viaroute-size 1000`


