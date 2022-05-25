import {DataManager} from './modules/dataManager.js';
import {DisplayManager} from './modules/displayManager.js';
import {ContactsManager} from './modules/contactsManager.js';

document.addEventListener('DOMContentLoaded', () => {
  const App = new ContactsManager( new DataManager(), new DisplayManager());
})