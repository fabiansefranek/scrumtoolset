# Development Environment

## Start development containers with Docker

1. `docker compose up --build`

## Remove development Docker containers

1. `docker compose down`
 <hr>

# Ports

| Name    | Port |
| ------- | ---- |
| Server  | 3000 |
| Client  | 8080 |
| MariaDB | 3030 |

<hr>

# Events

## Emitted Events

| Name                 | Parameter         | Description                                                                                                                            |
| -------------------- | ----------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| room:joined          | RoomJoinedPayload | Gets fired when user successfully joined a room                                                                                        |
| room:userListUpdate  | User[]            | Gets fired whenever a user joins or leaves the room                                                                                    |
| room:broadcastVote   | Vote              | Gets fired when a user votes                                                                                                           |
| room:userStoryUpdate | UserStory         | Gets fired when new round starts                                                                                                       |
| room:revealedVotes   | Vote[]            | Gets fired when votes are broadcasted, which happens when last the last user story gets voted on and when room enters the voting state |
| room:closed          | -                 | Gets fired when moderator closes room                                                                                                  |
| error                | ApplicationError  | Gets fired when ApplicationError is thrown                                                                                             |

## Received Events

| Name           | Parameter           | Description                                                 |
| -------------- | ------------------- | ----------------------------------------------------------- |
| room:join      | RoomJoinPayload     | Gets fired when a user joins an existing room               |
| room:create    | RoomCreationPayload | Gets fired when a moderator creates a new room and joins it |
| room:vote      | RoomVotePayload     | Gets fired when a user votes (not revealed)                 |
| room:close     | RoomClosePayload    | Gets fired when the room is closed                          |
| room:nextRound | -                   | Gets fired when going to the next room state                |
| disconnecting  | DisconnectReason    | Gets fired when a connected socket disconnects              |

<hr>

# References

[Documenting SocketIO Server](https://socket.io/docs/v4/server-api/)

Licenses:
Home Page Illustration by [Manypixels](https://www.manypixels.co/gallery/) (does not need attribution)
Icons by [Icons8](https://icons8.com/) (needs attribution)
