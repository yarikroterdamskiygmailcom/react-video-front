const path = require('path');
const {setLoader, setPlugin} = require('webpacker/utils');
const scssVariables = path.resolve(__dirname, './src/scss/_variables.scss');

module.exports = {
  output: fn => fn({
    path: path.join(__dirname, 'build'),
    publicPath: '/'
  }),
  preset: {
    loaders: [
      setLoader('react'),
      setLoader('css', {postcssOpts: require('autoprefixer')}),
      setLoader('scss', {scssVariables, postcssOpts: require('autoprefixer')}),
    ],
    plugins: [
      setPlugin('css'),
      setPlugin('html'),
    ],
  }
};