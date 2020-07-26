const path = require("path");
//@ts-ignore
const svgToMiniDataURI = require('mini-svg-data-uri');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    mode: 'development',
    devtool: 'source-map',
    devServer: {
        contentBase: path.resolve(__dirname, './dist'),
        compress: false,
        port: 3000,
        writeToDisk: true
    },
    entry: {
        index: path.resolve(__dirname, './src/index.js')
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        devtoolModuleFilenameTemplate: 'file:///[absolute-resource-path]'
    },
    plugins: [
        new CopyPlugin({
            patterns: [{
                from: path.resolve(__dirname, './src/index.html'),
                to: path.resolve(__dirname, './dist/index.html'),
                toType: 'file'
            }]
        })
    ],
    module: {
        rules: [
            {
                test: /\.html$/i,
                loader: 'html-loader',
                options: {
                    minimize: {
                        removeAttributeQuotes: false
                    },
                    preprocessor: /** @param {string} content */ (content) => {
                        //Convert moustache syntax to Vue template syntax
                        return content.replace(/\son([a-z-]+)="{{\s*(.*?)\s*}}"/gi, ' @$1="$2"')
                                      .replace(/\s([a-z-]+)="{{\s*(.*?)\s*}}"/gi, ' :$1="$2"')
                                      .replace(/\sdata-if="{{\s*(.*?)\s*}}"/gi, ' v-if="$1"')
                                      .replace(/\sdata-for="{{\s*(.*?)\s*}}"/gi, ' v-for="$1"');
                    }
                }
            },
            {
                test: /\.svg$/i,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            generator: /** @param {string} content */ (content) => svgToMiniDataURI(content.toString()),
                        }
                    }
                ]
            },
            {
                test: /\.s[ac]ss$/,
                use: [
                    // Creates `style` nodes from JS strings
                    'style-loader',
                    // Translates CSS into CommonJS
                    'css-loader',
                    // Compiles Sass to CSS
                    'sass-loader',
                ],
            },
            {
                test: /\.m?js$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: require('./babel.config.js')
                }
            }
        ]
    }
};