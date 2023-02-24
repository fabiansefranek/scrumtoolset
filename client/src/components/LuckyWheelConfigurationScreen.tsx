import { ChangeEvent, Fragment, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import styled from "styled-components";
import { useLanguage } from "../hooks/useLanguage";
import { useToast } from "../hooks/useToast";
import { LuckyWheelSegment, Team, TeamMember } from "../types";
import { Button } from "./Button";

function convertLinesToUserStoryArray(lines: string): string[] | undefined {
    if (lines.length === 0) return [];
    /*return lines
        .trim()
        .split("\n")
        .map((line: string) => ({
            name: line.split(";")[0],
            content: line.split(";")[1],
        }));*/
}

type Props = {
    setSegments: Function;
};

function LuckyWheelConfigurationScreen(props: Props) {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [teams, setTeams] = useState<Team[]>([]);
    const [selectedTeamIndex, setSelectedTeamIndex] = useState<
        number | undefined
    >(undefined);
    const [selectedMemberIndex, setSelectedMemberIndex] = useState<
        number | undefined
    >(0);
    const selectedTeamRef = useRef<HTMLSelectElement>(null);
    const selectedMemberRef = useRef<HTMLSelectElement>(null);
    const toast = useToast();
    const language = useLanguage();

    useEffect(() => {
        const socket = connect();

        socket.on("receivedTeams", (teams: Team[]) => {
            const parsedMembersTeams = teams.map((team) => {
                return {
                    ...team,
                    members: (
                        JSON.parse(team.members as string) as string[]
                    ).map((member) => {
                        return {
                            name: member,
                            absent: false,
                        };
                    }),
                };
            });
            console.info("Received teams: ");
            console.table(parsedMembersTeams);
            setTeams(parsedMembersTeams);
        });

        return () => {
            socket.off("receivedTeams");
        };
    }, []);

    useEffect(() => {
        getTeams();
    }, [isConnected, socket]);

    function connect(): Socket {
        const socket = io("http://localhost:3000");
        setSocket(socket);
        console.log("Connected to server");
        return socket;
    }

    function disconnect(): void {
        if (socket === null) return;
        setSelectedTeamIndex(undefined);
        socket.disconnect();
        setSocket(null);
        console.log("Disconnected from server");
    }

    function getTeams() {
        if (socket === null) return;
        socket.emit("lucky:receiveTeams");
        console.log("Sent request for getting teams");
    }

    function handleStart() {
        if (socket === null) return;
        if (selectedTeamIndex === undefined) return;
        const nonAbsentMembers = (
            teams[selectedTeamIndex].members as TeamMember[]
        ).filter((member) => !member.absent);
        if (nonAbsentMembers.length < 2) {
            toast.error("At least 2 members must be present");
            return;
        }
        const segments = nonAbsentMembers.map((member) => {
            return {
                text: member.name,
                color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
            } as LuckyWheelSegment;
        });
        disconnect();
        props.setSegments(segments);
        console.info("Start button clicked");
        console.table(nonAbsentMembers);
    }

    return (
        <Container>
            <LogoContainer>
                <Logo src={`${process.env.PUBLIC_URL}/wheel.png`} />
                <LogoText>Lucky Wheel</LogoText>
            </LogoContainer>
            {selectedTeamIndex === undefined ? (
                <InputContainer>
                    <Text>Create new team</Text>
                    <Input placeholder="Team name"></Input>
                    <Button>Create</Button>
                </InputContainer>
            ) : null}
            <InputContainer>
                <Text>
                    Select a team{" "}
                    {selectedTeamIndex !== undefined ? " or " : null}
                    {selectedTeamIndex !== undefined ? (
                        <Link
                            onClick={() => {
                                setSelectedTeamIndex(undefined);
                                selectedTeamRef.current!.value = "";
                                const newTeams = [...teams];
                                newTeams.forEach((team, teamIndex) => {
                                    (team.members as TeamMember[]).forEach(
                                        (member, memberIndex) => {
                                            (
                                                newTeams[teamIndex].members[
                                                    memberIndex
                                                ] as TeamMember
                                            ).absent = false;
                                        }
                                    );
                                });
                                setTeams(newTeams);
                            }}
                        >
                            create new team
                        </Link>
                    ) : null}
                </Text>
                <Select
                    placeholder={language.strings.username}
                    onChange={(event: ChangeEvent<HTMLSelectElement>) => {
                        setSelectedTeamIndex(
                            teams.findIndex(
                                (team) => team.name === event.target.value
                            )
                        );
                    }}
                    ref={selectedTeamRef}
                    defaultValue=""
                    required
                >
                    <option value="" disabled>
                        ...
                    </option>
                    {teams.map((team) => (
                        <option key={team.name} value={team.name}>
                            {team.name}
                        </option>
                    ))}
                </Select>
            </InputContainer>
            {selectedTeamIndex !== undefined ? (
                <Fragment>
                    <InputContainer>
                        <Text>Delete selected team</Text>
                        <Button secondary={true}>Delete</Button>
                    </InputContainer>
                    <InputContainer>
                        <Text>Team members</Text>
                        <Select
                            placeholder={language.strings.username}
                            onChange={(event: ChangeEvent<HTMLSelectElement>) =>
                                setSelectedMemberIndex(
                                    (
                                        teams[selectedTeamIndex]
                                            .members as TeamMember[]
                                    ).findIndex(
                                        (member) =>
                                            member.name === event.target.value
                                    )
                                )
                            }
                            ref={selectedMemberRef}
                            defaultValue={selectedMemberIndex}
                            size={3}
                        >
                            {selectedTeamIndex !== undefined
                                ? (
                                      teams[selectedTeamIndex]
                                          .members as TeamMember[]
                                  ).map((member: TeamMember) => (
                                      <option
                                          key={member.name}
                                          value={member.name}
                                          style={{
                                              opacity: member.absent ? 0.5 : 1,
                                          }}
                                      >
                                          {member.name}
                                      </option>
                                  ))
                                : null}
                        </Select>
                        <ButtonContainer>
                            <Button
                                secondary={true}
                                style={{ flex: 1 }}
                                onClick={() => {
                                    if (selectedTeamIndex === undefined) return;
                                    const memberIndex = (
                                        teams[selectedTeamIndex]
                                            .members as TeamMember[]
                                    ).findIndex(
                                        (member) =>
                                            member.name ===
                                            selectedMemberRef.current!.value
                                    );
                                    if (memberIndex === -1) return;
                                    const newTeams = [...teams];
                                    (
                                        newTeams[selectedTeamIndex].members[
                                            memberIndex
                                        ] as TeamMember
                                    ).absent = !(
                                        newTeams[selectedTeamIndex].members[
                                            memberIndex
                                        ] as TeamMember
                                    ).absent;
                                    setTeams(newTeams);
                                }}
                            >
                                Mark as{" "}
                                {(
                                    teams[selectedTeamIndex]
                                        .members as TeamMember[]
                                )[selectedMemberIndex!].absent
                                    ? "present"
                                    : "absent"}
                            </Button>
                            <Button secondary={true} style={{ flex: 1 }}>
                                Remove member
                            </Button>
                        </ButtonContainer>
                    </InputContainer>
                    <InputContainer>
                        <Text>Add a member</Text>
                        <Input placeholder="Name"></Input>
                        <Button secondary={true}>Add</Button>
                    </InputContainer>
                    <InputContainer>
                        <Text>Start the lucky wheel</Text>
                        <Button onClick={handleStart}>Start</Button>
                    </InputContainer>
                </Fragment>
            ) : null}
        </Container>
    );
}

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2rem;
    width: 30vw;
    background-color: ${({ theme }) => theme.colors.secondaryBackground};
    border-radius: 0.3rem;
    box-shadow: ${({ theme }) =>
        theme.name === "Light"
            ? "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px"
            : null};
    padding: 2rem;
`;

const InputContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    font-size: 16px;
`;

const ButtonContainer = styled.div`
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
`;

const Text = styled.p`
    margin: 0;
    color: ${({ theme }) => theme.colors.text};
    font-size: 16px;
`;

const Input = styled.input`
    padding: 0.5rem;
    background-color: ${(props) => props.theme.colors.inputBackground};
    color: ${(props) => props.theme.colors.text};
    border: ${(props) => props.theme.colors.border} 1px solid;
    border-radius: 0.25rem;
    padding: 0.75rem;
    font-size: 16px;

    &:focus {
        outline: none;
    }
`;

const Select = styled.select`
    background-color: ${(props) => props.theme.colors.inputBackground};
    color: ${(props) => props.theme.colors.text};
    border: ${(props) => props.theme.colors.border} 1px solid;
    border-radius: 0.25rem;
    padding: 0.75rem;
    font-size: 16px;
`;

const Link = styled.a`
    color: ${(props) => props.theme.colors.text};
    text-decoration: underline;
    cursor: pointer;
`;

const TextArea = styled.textarea`
    background-color: ${(props) => props.theme.colors.inputBackground};
    color: ${(props) => props.theme.colors.text};
    border: ${(props) => props.theme.colors.border} 1px solid;
    border-radius: 0.25rem;
    padding: 0.75rem;
    resize: none;
    font-family: inherit;

    &:focus {
        outline: none;
    }
`;

const LogoContainer = styled.div`
    position: absolute;
    top: 20px;
    left: 20px;
    display: flex;
    flex-direction: row;
    gap: 0.25rem;
    align-items: center;
    user-select: none;
    opacity: 0.3;
`;

const LogoText = styled.h2`
    margin: 0;
    color: ${({ theme }) => theme.colors.text};
`;

const Logo = styled.img`
    width: 30px;
    height: 30px;
    filter: ${({ theme }) =>
        theme.name === "Dark" ? "invert(1)" : "invert(0)"};
`;

export default LuckyWheelConfigurationScreen;
