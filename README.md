# Testing Node.js native Fetch API with Refinitiv Data Platform APIs

Example Code Disclaimer:
ALL EXAMPLE CODE IS PROVIDED ON AN “AS IS” AND “AS AVAILABLE” BASIS FOR ILLUSTRATIVE PURPOSES ONLY. REFINITIV MAKES NO REPRESENTATIONS OR WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, AS TO THE OPERATION OF THE EXAMPLE CODE, OR THE INFORMATION, CONTENT, OR MATERIALS USED IN CONNECTION WITH THE EXAMPLE CODE. YOU EXPRESSLY AGREE THAT YOUR USE OF THE EXAMPLE CODE IS AT YOUR SOLE RISK.


## <a id="intro"></a>Introduction

The Node.js **native** [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) is now available as experimental feature in [Node v17.5](https://nodejs.org/en/blog/release/v17.5.0/). Developers do not need to install extra fetch packages anymore. Frontend Developers will be familiar with the HTTP code in Node. 

To test this built-in API, you can run the native Fetch code with the ```--experimental-fetch``` when you run the Node application as follow:

```
$> node app.js --experimental-fetch 
```

Since it is still an experimental feature, so it is advisable to test it in a controlled environment such as Docker. This helps to avoid mess-up your local environment. 

## Running as VS Code DevContainer

1. Go to the project's *.devcontainer* folder and create a file name ```.env.devcontainer```  with the following content.
    ```
    RDP_BASE_URL=https://api.refinitiv.com
    RDP_AUTH_URL=/auth/oauth2/v1/token
    RDP_AUTH_REVOKE_URL=/auth/oauth2/v1/revoke
    RDP_ESG_URL=/data/environmental-social-governance/v2/views/scores-full
    RDP_SYMBOLOGY_URL=/discovery/symbology/v1/lookup

    RDP_USERNAME=<RDP UserName>
    RDP_PASSWORD=<RDP Password>
    RDP_APP_KEY=<RDP Client_ID>
    ```
2. Start a Docker desktop or Docker engine on your machine.
4. Install the [VS Code - Remote Development extension pack](https://aka.ms/vscode-remote/download/extension).
5. Open the VS Code Command Palette with the ```F1``` key, and then select the **Remote-Containers: Reopen in Container** command.
6. Once this build completes, VS Code automatically connects to the container. Open VS Code terminal and go to *project* folder
    ```
    $workspace> cd project
    $workspace/project>
    ```
7. Run the following command in */workspace/project* folder to install all dependencies 
    ```
    $workspace/project> npm install
    ```
8. Build and run the example by pressing the ```F5``` button or selecting *Run* then *Start Debugging* option from VS Code menu.

## Running as a manual Docker Container

1. Start Docker
2. create a file name ```.env``` in a *project* folder with the following content.
    ```
    RDP_BASE_URL=https://api.refinitiv.com
    RDP_AUTH_URL=/auth/oauth2/v1/token
    RDP_AUTH_REVOKE_URL=/auth/oauth2/v1/revoke
    RDP_ESG_URL=/data/environmental-social-governance/v2/views/scores-full
    RDP_SYMBOLOGY_URL=/discovery/symbology/v1/lookup

    RDP_USERNAME=<RDP UserName>
    RDP_PASSWORD=<RDP Password>
    RDP_APP_KEY=<RDP Client_ID>
    ```
3. Build a Docker image with the following command:
    ```
    $project> docker build . -t testfetch
    ```
4. Run a Docker container with the following command: 
    ```
    $project> docker run -it --name testfetch --env-file .env testfetch --symbol <RIC> --newslimit <numbers of news limit>
    ```
5. To stop and delete a Docker container, run the following command:
    ```
    $project> docker stop testfetch
    $project> docker rm testfetch
    ```

https://sdtimes.com/softwaredev/node-js-18-available-with-fetch-api-enabled-by-default/