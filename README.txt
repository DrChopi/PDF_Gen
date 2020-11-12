#PDF_GENERATOR

## Prérequis

- `node > v13`
- `mongodb`

## Installation

- `npm i`
- Remplir le .env avec PORT, DB_STRING

## NOTES

- Dans le markdown sont remplacé les {{ variable }}

## Responses

- mongo est plus compatible avec les api node mais si le projet devait prendre de l'ampleur il vaudrait mieux prioriser postgres
- mongoose dans le cas de mongo ou pg dans le cas de postgres
- les routes login, subscribe, admin, user
- un validateur de type avec des regex sans compter que mongoose en possède également un ( mais on est jamais trop prudent )
- l'argument suivant la route ( /route/{page} )
- par JWT token
- un champ rank contenu dans le JWT
