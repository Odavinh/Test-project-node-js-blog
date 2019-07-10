const config = require("./config");
const app = require("./app");

app.listen(config.PORT, function() {
  console.log(`Example app listening on port ${config.PORT}!`);
});
