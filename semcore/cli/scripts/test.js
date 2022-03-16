const path = require('path');
const fs = require('fs');

const { task, getTaskOptions, question } = require('./utils/task');
const { cwdPath, args } = getTaskOptions();

module.exports = (async function init() {
  // Support cwd path component
  if (args['_'] && args['_'].includes('.')) {
    const cwdPathList = cwdPath.split('/');
    args.destination = '..';
    args.component = cwdPathList.slice(-1);
  }

  const destination = await question(args, {
    type: 'input',
    name: 'destination',
    default: 'components',
    message: 'Please enter destination name',
  });

  const component = await question(args, {
    type: 'list',
    name: 'component',
    message: 'Select the component:',
    choices: args.component ? [] : fs.readdirSync(`${cwdPath}/${destination}`),
  });

  const filePath = path.resolve(`${cwdPath}/${destination}/${component}`);

  task(`npm run test -- --roots=${filePath} --no-cache`, ['destination', 'component', '.']);
})();
