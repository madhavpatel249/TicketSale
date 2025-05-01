module.exports = {
  // other webpack config settings...
  resolve: {
    fallback: {
      "zlib": require.resolve("browserify-zlib"),
      "querystring": require.resolve("querystring-es3"),
      "path": require.resolve("path-browserify"),
      "crypto": require.resolve("crypto-browserify"),
      "fs": false, // fs can't be polyfilled in the browser
      "stream": require.resolve("stream-browserify"),
      "http": require.resolve("stream-http"),
      "net": false, // not needed for browser
      "util": require.resolve("util/"),
    }
  }
};
