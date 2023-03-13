const jsonServer = require("json-server");
const clone = require("clone");
const data = require("./db.json");

const isProductionEnv = process.env.NODE_ENV === "production";
const server = jsonServer.create();

// --------CORS--------
// Import the library:
const cors = require("cors");
// Then use it before your routes are set up:
server.use(cors());
// Set up a domainList and check against it:
const domainList = ["http://localhost:3000", "https://alanaflix.vercel.app/"];
const corsOptions = {
  origin: domainList,
};
// Then pass them to cors:
server.use(cors(corsOptions));
// ----------------

// For mocking the POST request, POST request won't make any changes to the DB in production environment
const router = jsonServer.router(isProductionEnv ? clone(data) : "db.json", {
  _isFake: isProductionEnv,
});
server.use(router);

const middlewares = jsonServer.defaults();
server.use(middlewares);

const port = process.env.PORT || 8080;
server.listen(port, () => {
  console.log(`JSON Server is running in ${port}`);
});

server.use((req, _, next) => {
  if (req.path !== "/") router.db.setState(clone(data));
  next();
});

// Export the Server API
module.exports = server;

// references:
// https://javascript.plainenglish.io/how-to-set-up-deploy-fake-rest-api-server-using-json-server-24e26dc1d120
// https://stackoverflow.com/a/70911988
