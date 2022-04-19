# Testing Node.js native Fetch API with Refinitiv Data Platform APIs

## Running

#### Build Docker Image
```
docker build . -t testfetch
```
#### Running Docker Container
```
docker run -it --env-file .env --name testfetch testfetch
```
#### Stop and Clear the application 

Press ```Ctrl+C``` or ```docker stop testfetch```.

Then
```
docker rm testfetch

docker rmi testfetch
```

start": "node --experimental-fetch ./dist/rdp_nodefetch.js"