import { ChangeEvent, Fragment, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import styled from "styled-components";
import { useLanguage } from "../hooks/useLanguage";
import { useToast } from "../hooks/useToast";
import { LuckyWheelSegment, Team, TeamMember } from "../types";
import { Button } from "./Button";

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
    const selectedTeamIndexRef = useRef<number | undefined>(undefined);
    const selectedTeamRef = useRef<HTMLSelectElement>(null);
    const selectedMemberRef = useRef<HTMLSelectElement>(null);
    const newMemberRef = useRef<HTMLInputElement>(null);
    const newTeamRef = useRef<HTMLInputElement>(null);
    const toast = useToast();
    const language = useLanguage();

    useEffect(() => {
        const socket = connect();
        socket.on("receivedTeams", (teams: Team[]) => {
            const parsedMembersTeams = teams.map((team) => {
                return {
                    ...team,
                    members: (team.members
                        ? (JSON.parse(team.members as string) as string[])
                        : []
                    ).map((member) => {
                        return {
                            name: member,
                            absent: false,
                        };
                    }) as TeamMember[],
                } as Team;
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
            toast.error(
                language.strings.notifications
                    .minimum_team_members_not_reached + " (2)"
            );
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

    function updateTeam(team: Team) {
        if (selectedTeamIndex === undefined) return;
        if (socket === null) return;
        const names = (team.members as TeamMember[]).map(
            (member) => member.name
        );
        const newTeam = { ...team };
        newTeam.members = JSON.stringify(names);
        socket.emit("lucky:updateTeam", newTeam);
    }

    function deleteTeam(team: Team) {
        if (socket === null) return;
        if (selectedTeamIndex === undefined) return;
        const newTeams = [...teams];
        newTeams.splice(selectedTeamIndex, 1);
        setTeams(newTeams);
        setSelectedTeamIndex(undefined);
        socket.emit("lucky:deleteTeam", team.name);
    }

    function createTeam() {
        if (socket === null) return;
        const teamName = newTeamRef.current!.value;
        if (teamName.length === 0) {
            toast.error("Team name must not be empty");
        }

        const newTeam = {
            name: teamName,
            members: [] as TeamMember[],
        } as Team;

        const jsonTeam = {
            ...newTeam,
            members: (newTeam.members as TeamMember[])
                .map((member) => member.name)
                .toString(),
        };
        setTeams((teams) => [...teams, newTeam]);

        selectedTeamIndexRef.current = teams.length + 1;
        setSelectedTeamIndex(teams.length);
        //setSelectedTeamIndex(teams.length);

        socket.emit("lucky:addTeam", jsonTeam);
    }

    function addMember() {
        if (selectedTeamIndex === undefined) return;
        const newTeam = teams[selectedTeamIndex];
        console.log((newTeam.members as TeamMember[]).length);
        if ((newTeam.members as TeamMember[]).length >= 20) {
            toast.error(
                language.strings.notifications.maximum_team_members_reached +
                    " (20)"
            );
            return;
        }
        (newTeam.members as TeamMember[]).push({
            name: newMemberRef.current!.value,
            absent: false,
        } as TeamMember);
        const newTeams = [...teams];
        newTeams[selectedTeamIndex] = newTeam;
        setTeams(newTeams);
        updateTeam(newTeam);
    }

    function removeMember() {
        if (selectedMemberIndex === undefined) return;
        if (selectedTeamIndex === undefined) return;
        const newTeam = { ...teams[selectedTeamIndex] };
        (newTeam.members as TeamMember[]).splice(selectedMemberIndex, 1);
        const newTeams = [...teams];
        newTeams[selectedTeamIndex] = newTeam;
        setSelectedMemberIndex((index) => (index === 0 ? 0 : index! - 1));
        setTeams(newTeams);
        updateTeam(newTeam);
    }

    function handleGoBackLinkClick() {
        setSelectedTeamIndex(undefined);
        selectedTeamRef.current!.value = "";
        const newTeams = [...teams];
        newTeams.forEach((team, teamIndex) => {
            (team.members as TeamMember[]).forEach((member, memberIndex) => {
                (
                    newTeams[teamIndex].members[memberIndex] as TeamMember
                ).absent = false;
            });
        });
        setTeams(newTeams);
    }

    function onTeamSelectChange(event: ChangeEvent<HTMLSelectElement>) {
        const teamIndex = teams.findIndex(
            (team) => team.name === event.target.value
        );
        selectedTeamIndexRef.current = teamIndex + 1;
        setSelectedTeamIndex(teamIndex);
    }

    function handleTeamDeleteButtonClick() {
        if (selectedTeamIndex === undefined) return;
        deleteTeam(teams[selectedTeamIndex]);
    }

    function handleMemberSelectChange(event: ChangeEvent<HTMLSelectElement>) {
        if (selectedTeamIndex === undefined) return;
        setSelectedMemberIndex(
            (teams[selectedTeamIndex].members as TeamMember[]).findIndex(
                (member) => member.name === event.target.value
            )
        );
    }

    function handleTogglePresenceButtonClick() {
        if (selectedTeamIndex === undefined) return;
        const memberIndex = (
            teams[selectedTeamIndex].members as TeamMember[]
        ).findIndex(
            (member) => member.name === selectedMemberRef.current!.value
        );
        if (memberIndex === -1) return;
        const newTeams = [...teams];
        (
            (newTeams[selectedTeamIndex].members as TeamMember[])[
                memberIndex
            ] as TeamMember
        ).absent = !(
            (newTeams[selectedTeamIndex].members as TeamMember[])[
                memberIndex
            ] as TeamMember
        ).absent;
        setTeams(newTeams);
    }

    return (
        <Container>
            <LogoContainer>
                <Logo src={`${process.env.PUBLIC_URL}/wheel.png`} />
                <LogoText>Lucky Wheel</LogoText>
            </LogoContainer>
            {selectedTeamIndex === undefined ? (
                <InputContainer>
                    <Text>{language.strings.create_new_team}</Text>
                    <Input
                        placeholder={language.strings.team_name}
                        ref={newTeamRef}
                    ></Input>
                    <Button onClick={createTeam}>
                        {language.strings.buttons.create}
                    </Button>
                </InputContainer>
            ) : null}
            <InputContainer>
                <Text>
                    {language.strings.select_team}{" "}
                    {selectedTeamIndex !== undefined
                        ? ` ${language.strings.or} `
                        : null}
                    {selectedTeamIndex !== undefined ? (
                        <Link onClick={handleGoBackLinkClick}>
                            {language.strings.create_new_team}
                        </Link>
                    ) : null}
                </Text>
                <Select
                    placeholder={language.strings.username}
                    onChange={onTeamSelectChange}
                    ref={selectedTeamRef}
                    value={selectedTeamIndexRef.current}
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
                        <Text>{language.strings.delete_selected_team}</Text>
                        <Button
                            secondary={true}
                            onClick={handleTeamDeleteButtonClick}
                        >
                            {language.strings.delete}
                        </Button>
                    </InputContainer>
                    <InputContainer>
                        <Text>{language.strings.team_members}</Text>
                        <Select
                            placeholder={language.strings.username}
                            onChange={handleMemberSelectChange}
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
                                onClick={handleTogglePresenceButtonClick}
                            >
                                {language.language === "de"
                                    ? language.strings.mark_as.split(" ")[0] // Als
                                    : language.strings.mark_as}{" "}
                                {selectedMemberIndex !== undefined &&
                                (
                                    teams[selectedTeamIndex]
                                        .members as TeamMember[]
                                ).length > 0
                                    ? (
                                          teams[selectedTeamIndex]
                                              .members as TeamMember[]
                                      )[selectedMemberIndex].absent
                                        ? language.strings.present
                                        : language.strings.absent
                                    : language.strings.absent}{" "}
                                {language.language === "de"
                                    ? language.strings.mark_as.split(" ")[1] // markieren
                                    : null}
                            </Button>
                            <Button
                                secondary={true}
                                style={{ flex: 1 }}
                                onClick={removeMember}
                            >
                                {language.strings.remove_member}
                            </Button>
                        </ButtonContainer>
                    </InputContainer>
                    <InputContainer>
                        <Text>{language.strings.add_member}</Text>
                        <Input placeholder="Name" ref={newMemberRef}></Input>
                        <Button secondary={true} onClick={addMember}>
                            {language.strings.add}
                        </Button>
                    </InputContainer>
                    <InputContainer>
                        <Text>{language.strings.start_lucky_wheel}</Text>
                        <Button onClick={handleStart}>
                            {language.strings.start}
                        </Button>
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
    text-transform: lowercase;
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
    opacity: 0.05;
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
