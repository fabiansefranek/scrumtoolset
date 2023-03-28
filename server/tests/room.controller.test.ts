import { io, Socket } from "socket.io-client";
import * as dotenv from "dotenv";
import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import {
    RoomClosePayload,
    RoomCreationPayload,
    RoomJoinPayload,
    RoomVotePayload,
    UserStory,
} from "../src/types";
import { faker } from "@faker-js/faker";

dotenv.config({ path: "../.env" });

describe("test suite: room controller", () => {
    let socket: Socket = {} as Socket;
    let otherSocket: Socket = {} as Socket;

    // Setup and Tear down
    beforeEach((done) => {
        socket = io(`http://localhost:${process.env.SERVER_PORT}`, {
            forceNew: true,
            reconnectionDelay: 0,
        });
        otherSocket = io(`http://localhost:${process.env.SERVER_PORT}`, {
            forceNew: true,
            reconnectionDelay: 0,
        });
        socket.on("CONNECT", done);
    });

    afterEach((done) => {
        socket.disconnect();
        if (otherSocket.connected) {
            otherSocket.disconnect();
        }
        done();
    });

    // Tests

    test("test: room:create", (done) => {
        const payload: RoomCreationPayload = {
            base: {
                username: faker.name.firstName(),
                roomName: faker.name.firstName(),
            },
            options: {
                votingSystem: faker.helpers.arrayElement([
                    "fibonacci",
                    "tshirt",
                    "scrum",
                ]),
                userStories: [
                    {
                        name: faker.git.commitMessage(),
                        content: faker.hacker.phrase(),
                    },
                ],
                theme: faker.helpers.arrayElement(["dark", "light"]),
            },
        };

        // TODO: test for application errors
        socket.emit("room:create", payload);

        socket.on("room:joined", (response) => {
            expect(response.votingSystem).toBe(payload.options.votingSystem);
            expect(response.roomState).toBe("waiting");
            expect(response.currentUserStory.id).toBe(-1);
            expect(response.theme).toBe(payload.options.theme);
            done();
        });
    });

    test("test: room:join", (done) => {
        const creationPayload: RoomCreationPayload = {
            base: {
                username: faker.name.firstName(),
                roomName: faker.name.firstName(),
            },
            options: {
                votingSystem: faker.helpers.arrayElement([
                    "fibonacci",
                    "tshirt",
                    "scrum",
                ]),
                userStories: [
                    {
                        name: faker.git.commitMessage(),
                        content: faker.hacker.phrase(),
                    },
                ],
                theme: faker.helpers.arrayElement(["dark", "light"]),
            },
        };
        let joinPayload: RoomJoinPayload = {
            roomCode: "",
            username: faker.name.firstName(),
        };

        socket.emit("room:create", creationPayload);
        socket.on("room:joined", (response) => {
            joinPayload.roomCode = response.roomCode;
            otherSocket.emit("room:join", joinPayload);
        });

        otherSocket.on("room:joined", (response) => {
            expect(response.roomCode).toBe(joinPayload.roomCode);
            expect(response.roomState).toBe("waiting");
            expect(response.currentUserStory.id).toBe(-1);
            expect(response.theme).toBe(creationPayload.options.theme);
            otherSocket.disconnect();
            done();
        });
    });

    test("test: room:vote", (done) => {
        const creationPayload: RoomCreationPayload = {
            base: {
                username: faker.name.firstName(),
                roomName: faker.name.firstName(),
            },
            options: {
                votingSystem: faker.helpers.arrayElement([
                    "fibonacci",
                    "tshirt",
                    "scrum",
                ]),
                userStories: [
                    {
                        name: faker.git.commitMessage(),
                        content: faker.hacker.phrase(),
                    },
                ],
                theme: faker.helpers.arrayElement(["dark", "light"]),
            },
        };
        const joinPayload: RoomJoinPayload = {
            roomCode: "",
            username: faker.name.firstName(),
        };
        const votePayload: RoomVotePayload = {
            vote: faker.helpers
                .arrayElement([1, 2, 3, 5, 8, 13, 20, 40, 100])
                .toString(),
        };

        socket.emit("room:create", creationPayload);
        socket.on("room:joined", (response) => {
            joinPayload.roomCode = response.roomCode;
            otherSocket.emit("room:join", joinPayload);
        });

        otherSocket.on("room:joined", (response) => {
            otherSocket.emit("room:vote", votePayload);
        });

        socket.on("room:broadcastVote", (response) => {
            expect(response.sessionId).toBe(otherSocket.id);
            expect(response.vote).toBe("voted");
            otherSocket.disconnect();
            done();
        });
    });

    test("test: room:close", (done) => {
        const creationPayload: RoomCreationPayload = {
            base: {
                username: faker.name.firstName(),
                roomName: faker.name.firstName(),
            },
            options: {
                votingSystem: faker.helpers.arrayElement([
                    "fibonacci",
                    "tshirt",
                    "scrum",
                ]),
                userStories: [
                    {
                        name: faker.git.commitMessage(),
                        content: faker.hacker.phrase(),
                    },
                ],
                theme: faker.helpers.arrayElement(["dark", "light"]),
            },
        };
        const joinPayload: RoomJoinPayload = {
            roomCode: "",
            username: faker.name.firstName(),
        };
        const closePayload: RoomClosePayload = {
            roomCode: "",
        };

        socket.emit("room:create", creationPayload);
        socket.on("room:joined", (response) => {
            joinPayload.roomCode = response.roomCode;
            closePayload.roomCode = response.roomCode;
            otherSocket.emit("room:join", joinPayload);
        });

        otherSocket.on("room:joined", (response) => {
            socket.emit("room:close", closePayload);
        });

        otherSocket.on("room:closed", (response) => {
            done();
        });
    });

    test("test: disconnecting", (done) => {
        const creationPayload: RoomCreationPayload = {
            base: {
                username: faker.name.firstName(),
                roomName: faker.name.firstName(),
            },
            options: {
                votingSystem: faker.helpers.arrayElement([
                    "fibonacci",
                    "tshirt",
                    "scrum",
                ]),
                userStories: [
                    {
                        name: faker.git.commitMessage(),
                        content: faker.hacker.phrase(),
                    },
                ],
                theme: faker.helpers.arrayElement(["dark", "light"]),
            },
        };
        const joinPayload: RoomJoinPayload = {
            roomCode: "",
            username: faker.name.firstName(),
        };

        socket.emit("room:create", creationPayload);
        socket.on("room:joined", (response) => {
            joinPayload.roomCode = response.roomCode;
            otherSocket.emit("room:join", joinPayload);
        });

        let disconnected: boolean = false;

        otherSocket.on("room:joined", (response) => {
            socket.disconnect();
        });

        otherSocket.on("room:userListUpdate", (response) => {
            if (response.length != 1) return;
            expect(response[0].isModerator).toBe(1);
            done();
        });
    });

    // TODO: test if other user receives moderator status when moderator leaves room (disconnecting event)
});
