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

   
