const inquirer = require('inquirer');
const { taskOptionQuestions } = require('../inquirers/tasks');
const {
  createTasks,
  startTasks,
  stopTasks,
  deleteTasks,
  showTasks,
  saveTemplate,
  loadTemplate,
  importTasks,
  deleteTemplate,
} = require('../services/tasks');
const massChange = require('./massChange');
const atob = require('atob');

const tasksSection = async (tasks) => {
  while (true) {
    const { option } = await inquirer.prompt(taskOptionQuestions);
    switch (option) {
      case 'Go Back':
        return;
      case 'Import Tasks':
        await importTasks(tasks);
        break;
      case 'Create Tasks':
        await createTasks(tasks);
        break;
      case 'Start Tasks':
        await startTasks(tasks);
        break;
      case 'Stop Tasks':
        await stopTasks(tasks);
        break;
      case 'Mass Change':
        await massChange(tasks);
        break;
      case 'Delete Tasks':
        await deleteTasks(tasks);
        break;
      case 'Show Tasks':
        await showTasks(tasks);
        break;
      case 'Save Tasks':
        await saveTemplate(tasks);
        break;
      case 'Load Tasks':
        await loadTemplate(tasks);
        break;
      case 'Delete Templates':
        await deleteTemplate();
        break;
      default:
        break;
    }
  }
};

module.exports = tasksSection;
