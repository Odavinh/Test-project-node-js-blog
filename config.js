module.exports = {
  PORT: 3000,
  MONGO_URL: "mongodb://localhost:27017/Blog",
  IS_PRODUCTION: process.env.NODE_ENV === "production",
  SESSION_SECRET: "AhhkeduTAHsaMJuket",
  COUNT_PAGE: 3,
  DESTINATION: "uploads"
};
