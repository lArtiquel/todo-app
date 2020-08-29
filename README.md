# TODO App
Todo App that stores tasks on server in mongo db and uses advanced JWT token-based authentication system.

This app finished and deployed, so you can check it here -->
[![Netlify Deploy Status](https://api.netlify.com/api/v1/badges/6951ac70-8528-49c5-b968-2484ee405bce/deploy-status)](https://app.netlify.com/sites/tododo-app/deploys)

## App internals

### Frontend
Frontend app is a single-page application written using React library.
It has very similar UI that i used in previous Todo App that stores todos locally.

***Tech stack***:
- React (Functional Components only, React Router 5).
- Redux (with Thunk middleware).
- Material UI.
- Axios.
    
### Backend
Backend app written with Java 11. 
It has advanced JWT token-based authentication system and simple to use for CRUD operations REST Api.
You can check backend REST Api description [here](https://spring-mongo-jwt-todo-app.herokuapp.com/swagger-ui/index.html?configUrl=/v3/api-docs/swagger-config)

***Tech stack***
- Java 11.
- Spring Boot, JPA, Security.
- Mongo DB.
- JJWT.
- Project Lombok.
- Swagger UI.

***Note:***
This app stores your todos in database on server and developer(me) does not responsible for them.

If you want the app that stores your todos locally, you can check [my previous Todo App](https://github.com/lArtiquel/react-todo-app).

Ok, that's it. If you liked this app, please, leave a star and feel free to contribute.

*Best regards, your ***Arti***!*

