const path = require('path');
const sassTrue = require('sass-true');

describe('Sass', () => {
  const sassFile = path.join(__dirname, 'test.scss');
  sassTrue.runSass({ file: sassFile }, { describe, it })
})
