# Start containers in production mode

1. Clone Git repository
2. Copy .env.example and rename it to .env
3. Customize .env (ports, DB credentials)
4. Start container with `docker compose -f docker-compose.prod.yml up --build`.

# Run test cases

1. Change directory to `server` with `cd server`
2. Install dev dependencies with `npm i -D`
3. Execute test cases with `cd server && npm run test`

# Jira Integration

1. Locate the `atlassian-connect.json` in `client/public/`
2. Fill out the json file with the necessary information. The `baseUrl` should be the URL of the React App.

```json
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

3. Paste the following script and stylesheet into the index.html file in the `public` folder of the React App.

```html
<link rel="stylesheet" href="https://unpkg.com/@atlaskit/css-reset@2.0.0/dist/bundle.css" media="all" />
<script src="https://connect-cdn.atl-paas.net/all.js" async></script>
```

4. Then, in a Jira Space where you have administration rights, in the header go to `Apps -> Manage Apps` and under `Upload App` fill in the path of the hosted `atlassian-connect.json` in `client/public/`, e.g.: `https://url-to-react-app.com/atlassian-connect.json`
5. Open the app and test connectivity

Additional Information can be found in the [Jira Connect Getting Started Documentation](https://developer.atlassian.com/cloud/jira/platform/getting-started-with-connect/).
