# Very simple smart lights web app

![Screenshot of web app](/readme-assets/screenshot.png)

- Currently only supports Yeelight


## Setup production instance with Docker

Change "server.hostname" to the locally reachable hostname of the server
in the first command:

1. `docker-compose build --build-arg REACT_APP_BACKEND_URL="http://server.hostname:4001"`

2. `docker-compose up`

The web app is now reachable via http://server.hostname:4000


