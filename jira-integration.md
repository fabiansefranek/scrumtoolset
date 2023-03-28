## Start containers in production mode

1. clone Git repository
2. copy .env.example and rename it to .env
3. customize .env (ports, DB credentials)
4. start container with `docker compose -f docker-compose.prod.yml up --build`.

## Execute tests

1. change directory to `server`with `cd server`
1. install dev dependencies with `npm i -D`
1. execute test cases with `cd server && npm run test`

# Jira Integration Documentation

## Jira Connect Integration

1. The Atlassian Connect File is to be filled in according to the following schema:

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

The Base URL is to be replaced by the Path of the Application, in our case the Frontend. 2. Import the Atlassian Connect file as an App in the Jira Space 3. Test the Connection
