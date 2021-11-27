module.exports = {
  plugins: [
    "@babel/transform-runtime",
    "@babel/plugin-transform-async-to-generator",
    "@babel/plugin-syntax-class-properties",
    "@babel/plugin-proposal-class-properties",
    //"@babel/plugin-proposal-export-default-from"
  ],
  presets: [
    "@babel/preset-env",
    //{ targets: { node: 'current'}},
    "@babel/preset-react",
  ],
};
