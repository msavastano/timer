# timer

## How to run this application

This application is packaged using Docker. To run it, you will need to have Docker installed on your system.

### Build the Docker image

Open a terminal and navigate to the root directory of this project. Then, run the following command to build the Docker image:

```bash
docker build -t timer-app .
```

### Run the Docker container

Once the image is built, you can run the application in a container using the following command:

```bash
docker run -p 8080:80 timer-app
```

This will start the application and make it accessible at `http://localhost:8080` in your web browser.