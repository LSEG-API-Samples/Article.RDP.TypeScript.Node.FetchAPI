# Testing Node.js native Fetch API with Refinitiv Data Platform APIs
- version: 1.0
- Last update: April 2022
- Environment: Docker
- Prerequisite: [Access to RDP credentials](#prerequisite)

Example Code Disclaimer:
ALL EXAMPLE CODE IS PROVIDED ON AN “AS IS” AND “AS AVAILABLE” BASIS FOR ILLUSTRATIVE PURPOSES ONLY. REFINITIV MAKES NO REPRESENTATIONS OR WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, AS TO THE OPERATION OF THE EXAMPLE CODE, OR THE INFORMATION, CONTENT, OR MATERIALS USED IN CONNECTION WITH THE EXAMPLE CODE. YOU EXPRESSLY AGREE THAT YOUR USE OF THE EXAMPLE CODE IS AT YOUR SOLE RISK.

## <a id="intro"></a>Introduction

The [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) provides an interface for fetching resources resources asynchronously across the network using Promise. The Fetch API is wildly used by the frontend web developers for a while, but the [Node.js](https://nodejs.org/en/) just added this API as an experimental feature with Node version 17.5.0 on February 2022 for the backend developers. 

This example project shows how to use the Node.js experimental native Fetch API with the [Refinitiv Data Platform (RDP) APIs](https://developers.refinitiv.com/en/api-catalog/refinitiv-data-platform/refinitiv-data-platform-apis) as the example HTTP REST APIs. The application source codes are implemented in the [TypeScript](https://www.typescriptlang.org) language, and then runs the applciation in a controlled environment such as Docker using the [Node Docker Image](https://hub.docker.com/_/node). This helps to avoid mess-up your local development environment with this experimental feature.

## <a id="intro_fetch"></a>Node native Fetch API Overview

The JavaScript [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) is the modern successor of the [XMLHttpRequest](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest) API for performing asynchronous HTTP requests. The API is supported by most modern web browsers today. It  lets developers implment the HTTP request code loging using  JavaScript [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) which is much simpler then the XMLHttpRequest's callbak hell. The example codes are as follows:

Fetch API Promise example code:
```
fetch('http://example.com')
  .then(response => response.json())
  .then(data => console.log(data));
```
Fetch API [async/await syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) example code:
```
async function getData() {
    const respose = await fetch('http://example.com')
    const data = await response.json()
    console.log(data)
}
```

While the frontend JavaScript web developers have been using the Fetch API since 2015, the API has not been included in [Node.js](https://nodejs.org/en/) runtime environment. The backend JavaScript developers need to use the other libraries such as [the deprecated request module](https://www.npmjs.com/package/request), [postman-request (a fork of request)](https://www.npmjs.com/package/postman-request), [axios module](https://www.npmjs.com/package/axios), [Node Fetch module](https://www.npmjs.com/package/node-fetch), etc to make the HTTP request (with Promise) on Node.js.

Introduction in [Node version 17.5.0](https://nodejs.org/en/blog/release/v17.5.0/), the **native Fetch API** is now available as an **experimental feature**. The [Node version 18.0.0](https://nodejs.org/en/blog/release/v18.0.0/) also enables this experimental fetch API  on the global scope by default. The backend JavaScript developers do not need to install extra fetch-like-modules anymore. The frontend developers will be familiar with the server-side code in Node.js. 

Example code from [Node official page](https://nodejs.org/en/blog/release/v18.0.0/):
```
const res = await fetch('https://nodejs.org/api/documentation.json');
if (res.ok) {
  const data = await res.json();
  console.log(data);
}
```

To test this built-in API, you can run the native Fetch code with the ```--experimental-fetch``` with Node.js 17.5.0 or just a node command with Node.js 18.0.0 when you run the Node application as follow:

```
$> node app.js //node 18.0.0
$> node --experimental-fetch app.js //node 17.5.0
```

This example project is focusing on the Node version 18.0.0.  

### <a id="whatis_rdp"></a>What is Refinitiv Data Platform (RDP) APIs?

The [Refinitiv Data Platform (RDP) APIs](https://developers.refinitiv.com/en/api-catalog/refinitiv-data-platform/refinitiv-data-platform-apis) provide various Refinitiv data and content for developers via easy to use Web-based API.

RDP APIs give developers seamless and holistic access to all of the Refinitiv content such as Historical Pricing, Environmental Social and Governance (ESG), News, Research, etc and commingled with their content, enriching, integrating, and distributing the data through a single interface, delivered wherever they need it.  The RDP APIs delivery mechanisms are the following:
* Request - Response: RESTful web service (HTTP GET, POST, PUT or DELETE) 
* Alert: delivery is a mechanism to receive asynchronous updates (alerts) to a subscription. 
* Bulks:  deliver substantial payloads, like the end-of-day pricing data for the whole venue. 
* Streaming: deliver real-time delivery of messages.

This example project is focusing on the Request-Response: RESTful web service delivery method only.  

For more detail regarding Refinitiv Data Platform, please see the following APIs resources: 
- [Quick Start](https://developers.refinitiv.com/en/api-catalog/refinitiv-data-platform/refinitiv-data-platform-apis/quick-start) page.
- [Tutorials](https://developers.refinitiv.com/en/api-catalog/refinitiv-data-platform/refinitiv-data-platform-apis/tutorials) page.
- [RDP APIs: Introduction to the Request-Response API](https://developers.refinitiv.com/en/api-catalog/refinitiv-data-platform/refinitiv-data-platform-apis/tutorials#introduction-to-the-request-response-api) page.
- [RDP APIs: Authorization - All about tokens](https://developers.refinitiv.com/en/api-catalog/refinitiv-data-platform/refinitiv-data-platform-apis/tutorials#authorization-all-about-tokens) page.

## <a id="prerequisite"></a>Prerequisite
This demo project requires the following dependencies software.
1. RDP Access credentials.
2. [Visual Studio Code](https://code.visualstudio.com/) editor.
3. [Docker Desktop/Engine](https://docs.docker.com/get-docker/) application.
4. [VS Code - Remote Development extension pack](https://aka.ms/vscode-remote/download/extension)
5. Internet connection.

Please contact your Refinitiv's representative to help you to access the RDP account and services. You can find more detail regarding the RDP access credentials set up from the lease see the *Getting Started for User ID* section of [Getting Start with Refinitiv Data Platform](https://developers.refinitiv.com/en/article-catalog/article/getting-start-with-refinitiv-data-platform) article.

## Running as VS Code DevContainer

1. Go to the project's *.devcontainer* folder and create a file name ```.env.devcontainer```  with the following content.
    ```
    RDP_BASE_URL=https://api.refinitiv.com
    RDP_AUTH_URL=/auth/oauth2/v1/token
    RDP_AUTH_REVOKE_URL=/auth/oauth2/v1/revoke
    RDP_SYMBOLOGY_URL=/discovery/symbology/v1/lookup

    RDP_USERNAME=<RDP UserName>
    RDP_PASSWORD=<RDP Password>
    RDP_APP_KEY=<RDP Client_ID>
    ```
2. Start a Docker desktop or Docker engine on your machine.
4. Install the [VS Code - Remote Development extension pack](https://aka.ms/vscode-remote/download/extension).
5. Open the VS Code Command Palette with the ```F1``` key, and then select the **Remote-Containers: Reopen in Container** command.
6. Once this build completes, VS Code automatically connects to the container, runs ```npm install``` to initialize the project for developers. 
7. Build and run the example by pressing the ```F5``` button or selecting *Run* then *Start Debugging* option from VS Code menu.

## Running as a manual Docker Container

1. Start Docker
2. create a file name ```.env``` in a project folder root with the following content.
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
    $> docker build . -t testfetch
    ```
4. Run a Docker container with the following command: 
    ```
    $> docker run -it --name testfetch --env-file .env testfetch --symbol <RIC> --newslimit <numbers of news limit>
    ```
5. To stop and delete a Docker container, press ```Ctrl+C``` (or run ```docker stop testfetch```) then run the following command:
    ```
    $> docker rm testfetch
    ```
Note: You can change the version of Node in a Docker image to be newer than *17.5.0* with the following command:

```
$> docker build . -t testfetch --build-arg NODE_VERSION=17.6.0
```

https://sdtimes.com/softwaredev/node-js-18-available-with-fetch-api-enabled-by-default/