# Jira Integration Documentation

## Jira Connect Integration
* Atlassian Connect Datei nach folgenden Schema ausfüllen:
```
{
  "name": "Scrum",
  "description": "Atlassian Connect app",
  "key": "com.example.myapp",
  "baseUrl": "https://clean-falcons-sip-146-255-62-186.loca.lt/",
  "vendor": {
    "name": "Example, Inc.",
    "url": "http://example.com/"
  },
  "authentication": {
    "type": "none"
  },
  "apiVersion": 1,
  "modules": {
    "generalPages": [
      {
        "url": "/t",
        "key": "index",
        "location": "system.top.navigation.bar",
        "name": {
          "value": "Scrum"
        }
      }
    ]
  }
}
```
Die Base URL ist dabei mit dem übergeordnteten Pfad der zu ladenden Applikation, in unserem Fall das Frontend, zu ersetzen.
* Atlassian Connect als App in das Jira Space importieren
* Verbindung Testetn
