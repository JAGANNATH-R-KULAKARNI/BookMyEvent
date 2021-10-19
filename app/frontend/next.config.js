module.exports = {
  webpackDevMiddleware: (config) => {
    config.watchOptions.poll = 300;
    return config;
  },
};

//Webpack Dev Middleware is middleware which can be mounted in an express server
// to serve the latest compilation of your bundle during development. 
//This uses webpack's Node API in watch mode and instead of outputting to the file system it outputs to memory.

//For more info got to 
// https://stackoverflow.com/questions/42294827/webpack-vs-webpack-dev-server-vs-webpack-dev-middleware-vs-webpack-hot-middlewar