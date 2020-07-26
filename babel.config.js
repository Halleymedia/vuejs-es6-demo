{
    module.exports = {
        "presets": [
            "@babel/preset-env"
        ],
        "plugins": [
            [
                "@babel/plugin-proposal-decorators",
                {
                    "legacy": true
                }
            ],
            [
                "@babel/plugin-proposal-class-properties",
                {
                    "loose": false
                }
            ],
            [
                "@babel/plugin-proposal-private-methods",
                {
                    "loose": false
                }
            ],
            "@babel/plugin-transform-named-capturing-groups-regex",
            "@babel/plugin-transform-object-assign",
            "@babel/plugin-transform-spread",
            [
                "module-resolver",
                {
                    "root": [
                        "./src"
                    ],
                    "alias": {
                        "components": "./src/components",
                        "services": "./src/services",
                        "models": "./src/models",
                        "vue": "./node_modules/vue/dist/vue.min.js"
                    }
                }
            ]
        ]
    }
};