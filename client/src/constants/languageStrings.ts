import { LanguageStringsType } from "../types";

const strings: LanguageStringsType = {
    en: {
        cards: "Cards",
        points: "Points",
        votes: "Votes",
        join_room: "Join Room",
        create_room: "Create Room",
        username: "Username",
        all_userstories: "All User Stories",
        waiting_for_moderator_to_start: "Waiting for moderator to start round",
        click_to_copy_roomcode: "Click to copy the room code",
        roomState: {
            voting: "Voting",
        },
        userState: {
            not_voted: "Not Voted",
            voted: "Voted",
        },
        room: {
            name: "Room Name",
            code: "Room Code",
        },
        theme: {
            dark: "Dark",
            light: "Light",
        },
        buttons: {
            reveal_votes: "Reveal Votes",
            leave_room: "Leave Room",
            close_room: "Close Room",
            show_userstories: "Show User Stories",
            hide_userstories: "Hide User Stories",
            join: "Join",
            create: "Create",
            next_round: "Next Round",
            start_round: "Start Round",
            export_results: "Export voting results",
        },
        notifications: {
            user_name_invalid: "Please enter a valid user name",
            room_name_invalid: "Please enter a valid room name",
            missing_userstory: "Please enter at least one user story",
            revote_started:
                "Revote has been started, due to a lack of consensus",
            copy_roomcode: "Click to copy the room code:",
            now_a_moderator: "You are now a moderator",
            room_closed_by_moderator:
                "The room has been closed by the moderator",
            must_be_moderator: "You must be a moderator to do this",
            disconnected: "You disconnect",
            exported_results: "Voting results have been exported",
        },
    },
    de: {
        all_userstories: "Alle User Stories",
        cards: "Karten",
        points: "Punkte",
        votes: "Stimmen",
        join_room: "Raum beitreten",
        create_room: "Raum erstellen",
        username: "Benutzername",
        waiting_for_moderator_to_start:
            "Der Moderator hat die Runde noch nicht gestartet",
        click_to_copy_roomcode: "Hier klicken um den Roomcode zu kopieren",
        roomState: {
            voting: "Stimmen werden abgegeben",
        },
        userState: {
            not_voted: "Nicht abgestimmt",
            voted: "Abgestimmt",
        },
        room: {
            name: "Raumname",
            code: "Raumcode",
        },
        theme: {
            dark: "Dunkel",
            light: "Hell",
        },
        buttons: {
            reveal_votes: "Karten aufdecken",
            leave_room: "Raum verlassen",
            close_room: "Raum schließen",
            show_userstories: "User Stories anzeigen",
            hide_userstories: "User Stories verstecken",
            join: "Beitreten",
            create: "Erstellen",
            next_round: "Nächste Runde",
            start_round: "Runde starten",
            export_results: "Ergebnisse exportieren",
        },
        notifications: {
            user_name_invalid: "Bitte einen gültigen Benutzernamen eingeben",
            room_name_invalid: "Bitte einen gültigen Raumnamen eingeben",
            missing_userstory: "Bitte mindestens eine User Story eingeben",
            revote_started:
                "Abstimmung wird wiederholt, da keine Einigkeit herrschte",
            copy_roomcode: "Hier klicken um den Raumcode zu kopieren:",
            now_a_moderator: "Sie sind nun ein Moderator",
            room_closed_by_moderator:
                "Der Raum wurde vom Moderator geschlossen",
            must_be_moderator: "Sie müssen ein Moderator sein, um dies zu tun",
            disconnected: "Verbindung wurde getrennt",
            exported_results: "Abstimmungsergebnisse wurden exportiert",
        },
    },
};

export default strings;
