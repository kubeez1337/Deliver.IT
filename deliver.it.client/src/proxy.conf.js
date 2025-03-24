const { env } = require('process');

const target = env.ASPNETCORE_HTTPS_PORT ? `https://localhost:${env.ASPNETCORE_HTTPS_PORT}` :
    env.ASPNETCORE_URLS ? env.ASPNETCORE_URLS.split(';')[0] : 'https://localhost:7268';

const PROXY_CONFIG = [
  {
    context: [
      //"/weatherforecast",
      ///info-page",
      // "/orders-page",
      // "/login-page",
      // "/about-page",
      "/login",
      "/getUsers",
      "/order",
      "/getFoods",
      "/getFoods/*",
      "/order/",
      "/create-order",
      "/register",
      "/getUser",
      "/uploadFoods",
      "/exportFoods",
      "/updateFood",
      "/updateOrder",
      "/deleteFoods",
      "/updateUser",
      "/applyForCourier",
      "/getCourierApplications",
      "/processCourierApplication",
      "/claim-order",
      "/deliver-order",
      "/addFoods",
      "/getMessages",
      "/sendMessage",
      "/getUsers",
      "/getUserByUsername",
      "/getAddresses",
      "/seedDatabaseFromJson",
      "/foods/*/upload-picture",
      "/route/v1/driving",
      "/request-restaurant",
      "/approve-restaurant",
      "/reject-restaurant",
      "/pending-restaurant",
      "/getRestaurants",
      "/add-manager",
      "/managed-restaurants",
      "/courier/active-orders",
      
    ],
    target,
    secure: false,
    changeOrigin: true,
  },
  {
    // Proxy requests to your local OSRM Docker instance
    context: ["/osrm"],
    target: "http://localhost:5000",
    secure: false,
    changeOrigin: true,
    pathRewrite: {
      "^/osrm": "", // Ensure no prefix is sent to OSRM
    },
  },
]

module.exports = PROXY_CONFIG;
