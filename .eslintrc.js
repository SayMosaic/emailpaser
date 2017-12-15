module.exports = {
    "env": {
        "browser": true,
        "es6": true
    },
    "extends":["plugin:you-dont-need-lodash-underscore/compatible"],
    "parserOptions": {
        "sourceType": "module"
    },
    "rules": {
        "indent": [
            "error",
            "tab"
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "always"
        ]
    }
};
