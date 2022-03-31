const Express = require("express");
const RequestHandler = require("./handlers/todos");
const {initializeDB} = require("./lib/db");
const cors = require("cors");

const App = Express();

App.use(Express.json());
App.use(Express.urlencoded({extended:false}));
App.use(cors());
App.use(RequestHandler);


App.listen(3001, ()=>{
    console.log("I'M READY :)");
    initializeDB().then(() => console.log("DB IS READY"));
});