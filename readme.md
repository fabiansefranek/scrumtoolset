# Development Environment

## Start development containers with Docker

1. `docker compose up --build`

## Remove development Docker containers

1. `docker compose down`

# Ports

| Name    | Port |
| ------- | ---- |
| Server  | 3000 |
| Client  | 8080 |
| MariaDB | 3030 |

# React Components

## PokerSessionScreen

_Renders scrum poker room_
`client/src/components/PokerSessionScreen.tsx`
| Prop Name | Type | Description |
|---|---|---|
| userList | User array | - |

<hr>

## PokerVoteContainer

_Renders users and poker cards_
`client/src/components/PokerVoteContainer.tsx`
| Prop Name | Type | Description |
|---|---|---|
| userList | User array | - |

<hr>

## PokerUserStoryContainer

_Renders the current user story and a button to see all user stories_
`client/src/components/PokerUserStoryContainer.tsx`
| Prop Name | Type | Description |
|---|---|---|
| userStory | string | - |

<hr>

## PokerUserContainer

_Renders all users in a room_
`client/src/components/PokerUserContainer.tsx`
| Prop Name | Type | Description |
|---|---|---|
| userList | User array | - |

<hr>

## PokerCardContainer

_Renders all poker cards from a list of strings_
`client/src/components/PokerCardContainer.tsx`
| Prop Name | Type | Description |
|---|---|---|
| cards | string array | Texts that should be rendered on cards |

<hr>

## PokerCard

_Description_: Renders a single poker card
`client/src/components/PokerCard.tsx`
| Prop Name | Type | Description |
|---|---|---|
| text | string | Text to be displayed on card |
| active | boolean | Wether card should be clickable |

<hr>

## PokerUser

_Description_: Renders User including profile picture, username & state
`client/src/components/PokerUser.tsx`
| Prop Name | Type | Description |
|---|---|---|
| user | User | - |

<hr>

## PokerProfilePicture

_Description_: Renders profile picture with first letter of username
`client/src/components/PokerProfilePicture.tsx`
| Prop Name | Type | Description |
|---|---|---|
| username | string | - |

<hr>

# Conventions

## Naming Conventions

-   Javascript Variables: camelCase
-   Javascript Functions: camelCase
-   React States: camelCase
-   Git Branches: spinal-case
-   Env Variables: UPPERCASE
-   SQL Entities: PascalCase
-   SQL Attribute: camelCase
-   Typescript Files: camelCase
-   React Component Files: PascalCase

# References

[Documenting React Components](https://plainenglish.io/blog/document-your-react-applications-the-right-way-f648053c3a70)
