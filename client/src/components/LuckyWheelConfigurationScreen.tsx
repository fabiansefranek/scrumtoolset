import { ChangeEvent, Fragment, useRef, useState } from "react";
import styled from "styled-components";
import { useLanguage } from "../hooks/useLanguage";
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

type Props = {};

function LuckyWheelConfigurationScreen(props: Props) {
    const [choose, setChoose] = useState<boolean>(false);
    const selectedTeamRef = useRef<HTMLSelectElement>(null);

    const language = useLanguage();
    return (
        <Container>
            <LogoContainer>
                <Logo src={`${process.env.PUBLIC_URL}/wheel.png`} />
                <LogoText>Lucky Wheel</LogoText>
            </LogoContainer>
            {!choose ? (
                <InputContainer>
                    <Text>Create new team</Text>
                    <Input placeholder="Team name"></Input>
                    <Button>Create</Button>
                </InputContainer>
            ) : null}
            <InputContainer>
                <Text>
                    Select a team {choose ? " or " : null}
                    {choose ? (
                        <Link
                            onClick={() => {
                                setChoose(false);
                                selectedTeamRef.current!.value = "";
                            }}
                        >
                            create new team
                        </Link>
                    ) : null}
                </Text>
                <Select
                    placeholder={language.strings.username}
                    onChange={(event: ChangeEvent<HTMLSelectElement>) =>
                        setChoose(true)
                    }
                    ref={selectedTeamRef}
                    required
                >
                    <option value="" disabled selected>
                        ...
                    </option>
                    <option value="1">Team 1</option>
                    <option value="2">Team 2</option>
                    <option value="3">Team 3</option>
                </Select>
            </InputContainer>
            {choose ? (
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
                                console.log(event.target.value)
                            }
                            size={3}
                        >
                            <option value="1">Member 1</option>
                            <option value="2">Member 2</option>
                            <option value="3">Member 3</option>
                            <option value="4">Member 4</option>
                            <option value="5">Member 5</option>
                        </Select>
                        <ButtonContainer>
                            <Button secondary={true} style={{ flex: 1 }}>
                                Mark as absent
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
                        <Button>Start</Button>
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
