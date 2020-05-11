# Serverless Sports tracker based App
Github link: https://github.com/praneethnarisetty/Sports-Spending-Tracker
This project is a simple spending tracker application using AWS Lambda combined with Serverless Framework. It used AWS DynamoDB for storing data and AWS S3 to store image. Also auth0 service is used for authentication of the user.
## Github link
https://github.com/praneethnarisetty/Sports-Spending-Tracker
# Functionality of the application

This application allows to perform CRUD operation on Spending items. Each Spending item can also optinally have an attachment image. Each authenticated user can access only his/her own created spending items.

# Spending items

The application stores Spending items, and each item contains the following fields:

* `spendingId` (string) - a unique id for an item
* `userId` (string) - user id of authenticated user
* `createdAt` (string) - date and time when an item was created
* `name` (string) - name of a Spending item (e.g. "Buy Snacks")
* `date` (string) - date and time by which an item transaction occured
* `category` (string) - category of a Spending item (e.g. "food, transportaion, utility, entertainment")
* `attachmentUrl` (string) (optional) - a URL pointing to an image attached to a spending item

# Frontend

The `client` folder contains a web application that can use the API that should be developed in the project.

This frontend should work with your serverless application once it is developed, you don't need to make any changes to the code. The only file that you need to edit is the `config.ts` file in the `client` folder. This file configures your client application just as it was done in the course and contains an API endpoint and Auth0 configuration:

```ts
const apiId = '...' API Gateway id
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  domain: '...',    // Domain from Auth0
  clientId: '...',  // Client id from an Auth0 application
  callbackUrl: 'http://localhost:3000/callback'
}
```

# How to run the application

## Backend

To deploy an application run the following commands:

```
cd backend
npm install
sls deploy -v
```

## Frontend

To run a client application first edit the `client/src/config.ts` file to set correct parameters. And then run the following commands:

```
cd client
npm install
npm run start
```

This should start a development server with the React application that will interact with the serverless spending tracker react app.

# Postman collection

An alternative way to test your API, you can use the Postman collection that contains sample requests. You can find a Postman collection in this project. To import this collection, do the following.

Click on the import button:

![Alt text](images/import-collection-1.png?raw=true "Image 1")


Click on the "Choose Files":

![Alt text](images/import-collection-2.png?raw=true "Image 2")


Select a file to import:

![Alt text](images/import-collection-3.png?raw=true "Image 3")


Right click on the imported collection to set variables for the collection:

![Alt text](images/import-collection-4.png?raw=true "Image 4")

Provide variables for the collection (similarly to how this was done in the course):

![Alt text](images/import-collection-5.png?raw=true "Image 5")
