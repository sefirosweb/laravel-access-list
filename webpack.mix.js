const mix = require("laravel-mix");
const path = require("path");

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

mix
  .setPublicPath(process.env.ASSET_PATH)
  .setResourceRoot('/laravel-mailing')
  .ts('resources/js/app.tsx', 'js')
  .sass('resources/sass/app.scss', 'css')
  .react()
  .webpackConfig({
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: "ts-loader",
          exclude: /node_modules/
        }
      ]
    },
    resolve: {
      extensions: ["*", ".js", ".jsx", ".vue", ".ts", ".tsx"],
      alias: {
        '@': path.resolve(__dirname, 'resources/js/')
      }
    }
  });