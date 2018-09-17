const path = require('path');
const {setLoader, setPlugin} = require('webpacker/utils');
const scssVariables = path.resolve(__dirname, './src/scss/_variables.scss');

module.exports = {
  output: fn => fn({path: path.join(__dirname, 'build')}),
  preset: {
    loaders: [
      setLoader('react'),
      setLoader('css'),
      setLoader('scss', {scssVariables}),
    ],
    plugins: [
      setPlugin('css'),
      setPlugin('html'),
    ],
  }
};