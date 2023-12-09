// Custom information, to enable easy set-up.

// This is the entry point for our plugin code. There can only be one entry.
const figmaScript = {

  "figma/code": "./src/library/figma/main.ts"

};

// Add ui TS scripts here. All paths relative to "./src/custom/modules/". e.g. "module-ui.ts"
const uiScripts = [

  "figma/main-ui.ts"

];

// Add the web script exports here.
const webScripts = [
  {
    library: {
      name: "DistortedShape",
      type: "umd",
      export: "default"
    },
    file: {
      "js/umd/distortedges": "./src/custom/scripts/engine/entry.ts"
    }
  },
  {
    library: {
      type: "module",
      export: "default"
    },
    file: {
      "js/module/distortedges": "./src/custom/scripts/engine/entry.ts"
    }
  }
];




// Additional modules installed:
// html-webpack-plugin, inline-chunk-html-plugin, css-loader, style-loader
const HtmlWebpackPlugin = require("html-webpack-plugin");
const InlineChunkHtmlPlugin = require("inline-chunk-html-plugin");

const path = require("path");
const webpack = require("webpack");

// Generate information needed for webpack.
const uiCSS = "./src/library/ui/main.css",
      customFolder = "./src/custom/scripts/";

// Create the module.exports array as a variable.
let outputFiles = [ ];


// Generates the UI html files for webpack exporting.
let htmlPlugins = [ ];

for (let script of uiScripts) {

  // Create an entry for each script.
  let entryName = script.split(".")[0];

  figmaScript[`ignore/${entryName}`] = [ `${customFolder}${script}`, uiCSS ];


  // Create a plugin for each script.
  // https://github.com/jantimon/html-webpack-plugin
  // https://stackoverflow.com/questions/64825338/how-to-include-multiple-pages-in-webpack-output
  htmlPlugins.push(
    new HtmlWebpackPlugin({
      template: `/src/library/ui/starter.html`,
      inject: "body",
      chunks: [ `ignore/${entryName}` ],
      filename: `${entryName}.html`
    })
  );

  // https://www.npmjs.com/package/inline-chunk-html-plugin
  // https://stackoverflow.com/questions/39555511/inline-javascript-and-css-with-webpack
  htmlPlugins.push(
    new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [ RegExp(`ignore/${entryName}`) ]),
  );

}

// Add the figma plugin code to exports.
outputFiles.push({

  mode: "production",
  entry: figmaScript,
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
    publicPath: path.resolve(__dirname, "dist")
  },
  plugins: htmlPlugins
  
});


// Add the web scripts to exports.
for (let webScript of webScripts) {

  outputFiles.push({
    
    mode: "production",
    entry: webScript.file,
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: "ts-loader",
          exclude: /node_modules/,
        }
      ],
    },
    resolve: {
      extensions: [".ts", ".js"],
    },
    experiments: (webScript.library.type === "module") ?
      { outputModule: true } :
      undefined,
    output: {
      filename: "[name].js",
      publicPath: path.resolve(__dirname, "dist"),
      library: webScript.library
    },
    // optimization: {
    //   minimize: true,
    //   moduleIds: "size"
    // }

  });
  
}


module.exports = outputFiles;