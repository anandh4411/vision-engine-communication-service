const whitelist = [
  "http://localhost:4300",
  "https://visionengine.vercel.app",
  "http://localhost:4300/home",
];

module.exports = corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};
