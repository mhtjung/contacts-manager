import {DataManager} from './dataManager.js';
import {DisplayManager} from './displayManager.js';
import {ContactsManager} from './contactsManager.js';

document.addEventListener('DOMContentLoaded', () => {
  const App = new ContactsManager( new DataManager(), new DisplayManager());
})