// Custom information, to enable easy set-up.
let uiScripts = [

  // Add ui TS scripts here. All paths relative to "./src/custom/modules/". e.g. "module-ui.ts"
  "example-ui.ts",
  "ui-examples/form-components/form-components-ui.ts",
  "ui-examples/navigation-components/navigation-components-ui.ts"

];


// Additional modules installed:
// html-webpack-plugin, inline-chunk-html-plugin, css-loader, style-loader
const HtmlWebpackPlugin = require("html-webpack-plugin");
const InlineChunkHtmlPlugin = require("inline-chunk-html-plugin");

// Generate information needed for webpack.
const uiCSS = "./src/library/ui/main.css";
const custom = "./src/custom/modules/";

let dynamicEntry = {
  "code": "./src/library/figma/main.ts" // This is the entry point for our plugin code.
}

let dynamicPlugins = [ ];

for (let script of uiScripts) {

  // Create an entry for each script.
  let entryFile = script.split("/"),
      entryName = entryFile[entryFile.length - 1].split(".")[0];

  dynamicEntry[`ignore/${entryName}`] = [ `${custom}${script}`, uiCSS ];


  // Create a plugin for each script.
  // https://github.com/jantimon/html-webpack-plugin
  // https://stackoverflow.com/questions/64825338/how-to-include-multiple-pages-in-webpack-output
  dynamicPlugins.push(
    new HtmlWebpackPlugin({
      template: `./src/library/ui/starter.html`,
      inject: "body",
      chunks: [ `ignore/${entryName}` ],
      filename: `${entryName}.html`
    })
  );

  // https://www.npmjs.com/package/inline-chunk-html-plugin
  // https://stackoverflow.com/questions/39555511/inline-javascript-and-css-with-webpack
  dynamicPlugins.push(
    new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [ RegExp(`ignore/${entryName}`) ]),
  );

}




const path = require("path");
const webpack = require("webpack");

module.exports = (env, argv) => ({
mode: argv.mode === "production" ? "production" : "development",

devtool: argv.mode === "production" ? false : "inline-source-map",

  entry: dynamicEntry,
  
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: [
          "style-loader",
          "css-loader",
        ],
      },
    ],
  },

  resolve: {
    extensions: [".ts", ".js"],
  },

  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
  },

  plugins: dynamicPlugins
});