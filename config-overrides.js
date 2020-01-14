
// config-overrides.js
const {
  rewireWorkboxInject,
  defaultInjectConfig
} = require("react-app-rewire-workbox");
const path = require("path");

module.exports = function override(config, env) {
  const workboxConfig = {
    ...defaultInjectConfig,
    swSrc: path.join(__dirname, "public", "custom-sw.js")
  };
  if (env === "production") { // load workbox from your own server in production
    workboxConfig.importWorkboxFrom = "local";
  }
  config = rewireWorkboxInject(workboxConfig)(config, env);
  return config;
};