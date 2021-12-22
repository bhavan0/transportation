## Transportation Scheduling Updates(Bus Schedule Updates)

Zip file contains the following files
- backend
- client
- db
- mediator
- punlisher1
- punlisher2
- punlisher3
- subscriber
- docker-compose.yml
- README.md
- demo-view-recording.mp4

<br />

* Architecture Diagram
  
![Architecture diagram image](./images-for-readme/architectural-diagram.png)

<br />

* Sequence Diagram
  
![Sequence diagram image](./images-for-readme/sequential-diagram.png)

Sequence Diagram explaination:
* The client sends the bus ids to which the user subscribes to the backend
* Backend saves the user subscriptions to the DB
* Publishers runs every 1 min to fetch the bus info from the External API and sends it to the mediator
* Mediator saves the published data to the Db, and also creats a list for each user which have subscribed to that respective buses
* Client creates a websocket connection with the subscriber to get the data of the buses
* Subscriber creates a new thread for every websocket opened by the client (so every user will have a seperate thread running of the subscriber), it then reads the data from the queue which are published by the mediator.
* Subscriber sends this information to the client to display

<br />

### Stack used:
- Frontend: Angular 9
- Backend/Publishers: Python, flask
- Database: MongoDb
- External Api: Chicago bus data
  
<br />
<br />

### Steps to run the project:

Step 1: Copy and extract the zip file into local system

Step 2: Run docker desktop 

Step 3: Go to the project directory

### Step 4: Run the following command in the terminal to run and deploy the application on docker
          
        docker-compose up

Step 5: Open http://localhost:8080/
![Login page image](./images-for-readme/login-page.png)

Step 6: Login using any name (without any space)
![Login page with name image](./images-for-readme/login-page-with-name.png)

Step 7: Click on the left icon to view stops.
![Stops menu image](./images-for-readme/stops-menu.png)

Step 8: Open any stop to view current buses reaching the stop. (9160 stop number usually has buses always coming towards it)
![Stops display image](./images-for-readme/9160-stop-search.png)

Step 9: In the details of the Stop, Check the different buses displayed in the table format.
![Stops view image](./images-for-readme/9160-stop-view.png)

Step 10: Select buses which you want to subscribe to and click on the subscribe button.
![Bus selection in stop view image](./images-for-readme/bus-selection.png)
![Bus subscribed toaster image](./images-for-readme/bus-subscribed-toaster.png)

Step 11: Go back to main menu and go to Bus Menu, to view the subscribed buses by the user.
![Subscribed buses menu image](./images-for-readme/buses-menu.png)

Step 12: Observe when there is new location of the bus has been updated from the external API, there will be a toaster indicating the update and the location of the buses would get updated.
![Subscribed Buses list image](./images-for-readme/subscribed-buses.png)
![Buses updated notification image](./images-for-readme/buses-updated-notification.png)

Step 13: To unsubscribe from getting updates for any bus, select the buses and click on unsubscribe button.
![Buses selection for unsubscribe image](./images-for-readme/unsubscribe-bus-selection.png)
![Buses unsubscribed toaster image](./images-for-readme/buses-unsubscribed-toaster.png)
<br />

<br />
NOTE: We can login as multiple users and see different subscribed buses. Each user creats a new thread in the subscriber -> Hence they each get a seperate entity of the subscriber

![Multiple User subscription view image](./images-for-readme/multiple-users-subscription.png)

<br />
## Docker compose file Steps
The docker compose file runs the following commands to start up the project.
It deploys the following components

![Docker containers image](./images-for-readme/docker-containers.png)


|   Component    | Port  |                                                    Description                                                     |
| :------------: | :---: | :----------------------------------------------------------------------------------------------------------------: |
|     redis      | 6379  |                               Used for communication between broker and subscriber.                                |
|    mongodb     | 27017 |                                            Used for saving Data in DB.                                             |
|     db     | 5003  |                                        Used to inject base data into the DB                                        |
|  backend   | 5000  |                                The service used by the client to fetch information.                                |
|  broker  | 7000  | It acts as a broker to save data published by the publisher to the DB and sends it to respective subscriber Queue. |
| publisher1 | 6001  |                                      It publishes first few records of buses.                                      |
| publisher2 | 6002  |                                      It publishes next few records of buses.                                       |
| publisher3 | 6003  |                                        It publishes the rest of the buses.                                         |
| subscriber1 | 9001  |  Subscribes to the buses information based on the user logged in, creates different threads for different users.   |
| subscriber2 | 9002  |  Subscribes to the buses information based on the user logged in, creates different threads for different users.   |
| subscriber3 | 9003  |  Subscribes to the buses information based on the user logged in, creates different threads for different users.   |
|  frontend  | 8080  |                        Is the client application which has the views displayed to the user.                        |



The following commands are run from the docker-compose file for different projects.

        docker build -t [image-name] .

        docker run -p port:port [image-name]


PS: First 5 mins of recording includes the explanation of project structure, architecture diagram, sequential diagram and running the application.
        Skip to 5:00 min to start with the UI demo
