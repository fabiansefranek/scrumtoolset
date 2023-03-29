# Start containers in production mode

1. Clone Git repository
2. Copy .env.example and rename it to .env
3. Customize .env (ports, DB credentials)
4. Start container with `docker compose -f docker-compose.prod.yml up --build`.

# Run test cases

1. Change directory to `server`with `cd server`
2. Install dev dependencies with `npm i -D`
3. Execute test cases with `cd server && npm run test`

# Jira Integration Documentation

1. Locate the `atlassian-connect.json` in `client/public/`
2. Fill out the json file with the necessary information. The `baseUrl` should be the URL of the React App.

```
{
  "name": "Scrum Toolset",
  "description": "",
  "key": "com.example.myapp",
  "baseUrl": "https://url-to-react-app.com",
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

2. Import the Atlassian Connect file as an App in the Jira Space
3. Open the app

Additional Information can be found in the [Jira Connect Getting Started Documentation](https://developer.atlassian.com/cloud/jira/platform/getting-started-with-connect/).
