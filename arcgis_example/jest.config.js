module.exports = {
  "moduleNameMapper": {
    "^[./a-zA-Z0-9$_-]+\\.svg$": "<rootDir>/mock.js",
    "^[./a-zA-Z0-9$_-]+\\.png$": "<rootDir>/mock.js",
    "^[./a-zA-Z0-9$_-]+\\.scss$": "<rootDir>/mock.js",
    "\\.(css|less)$": "identity-obj-proxy"
  }
}