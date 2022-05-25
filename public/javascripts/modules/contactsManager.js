export class ContactsManager {
  constructor(dataManager, displayManager) {
    this.model = dataManager;
    this.view = displayManager;

    this.firstRender();
    this.bindEvents();
  }

  bindEvents() {
    this.view.contactContainer.addEventListener('click', this.handleContactActions.bind(this));
    this.view.addContactBtn.addEventListener('click', this.view.toggleNewContactForm.bind(this.view));
    this.view.newContactCancelBtn.addEventListener('click', this.view.toggleNewContactForm.bind(this.view))
    this.view.newContactForm.addEventListener('submit', this.createContact.bind(this));
    this.view.searchInput.addEventListener('keyup', this.handleSearch.bind(this));
    this.view.addTagsBtn.addEventListener('click', this.view.toggleAddTagsForm.bind(this.view));
    this.view.refreshBtn.addEventListener('click', this.handleRefresh.bind(this));
    this.view.tagFormContainer.addEventListener('reset', this.view.toggleAddTagsForm.bind(this.view))
    this.view.tagFormContainer.addEventListener('submit', this.addTags.bind(this));
  }

  handleRefresh(event) {
    event.preventDefault();
    this.view.renderContacts(this.model.getContacts())
  }

  addTags(event) {
    event.preventDefault();
    const tagInput = this.view.tagFormContainer.querySelector('#create-tag-input');
    const tags = tagInput.value;
    this.model.addTags(tags);
    this.view.populateTagDropdown(document.querySelector('#new-tags'), this.model.getTags())
    this.view.toggleAddTagsForm();
  }

  handleSearch() {
    if (this.view.contactContainer.classList.contains('hide')) { return };
    const substring = this.view.searchInput.value;
    if (substring.length === 0) {
      this.view.renderContacts(this.model.getContacts())
      return
    }
    const matches = this.model.filterByName(substring);
    this.view.renderContacts(matches);
  }

  async createContact(event) {
    event.preventDefault();
    const form = this.view.newContactForm;
    const tags = this.view.getSelectedTags(form)
    const response = await this.model.createContact(form, tags);
    this.view.addContact(response);
    this.view.toggleNewContactForm();
  }

  handleContactActions(event) {
    if (event.target.tagName !== 'A') { return }

    const contactUl = event.target.closest('ul');
    const contactId = contactUl.id.split('-')[1];
    
    if (event.target.classList.contains('edit-btn')) {
      this.renderUpdateForm(contactUl);
    } else if (event.target.classList.contains('delete-btn')) {
      if (confirm('Are you sure you want to delete this contact?')) {
        this.deleteContact(contactId)
      }
    } else {
      this.handleTagClick(event.target)
    }
  }

  handleTagClick(anchorTag) {
    const tag = anchorTag.textContent;
    const matches = this.model.filterByTag(tag);
    this.view.renderContacts(matches);
  }

  renderUpdateForm(contactUl) {
    this.view.renderUpdateForm(contactUl, this.model.getTags())
    this.view.updateContactForm.addEventListener('submit', this.handleUpdateSubmit.bind(this));
    this.view.updateContactForm.addEventListener('reset', this.view.removeUpdateForm.bind(this.view))
  }

  async handleUpdateSubmit(event) {
    event.preventDefault();
    const newContactObj = await this.model.editContact(this.view.updateContactForm, this.view.getSelectedTags(this.view.updateContactForm))
    this.view.updateContact(newContactObj);
  }

  async deleteContact(contactId) {
    await this.model.deleteContact(contactId);
    this.view.removeContact(contactId);
  }

  async firstRender() {
    await this.model.reqAllContacts();  
    const contacts = this.model.getContacts();
    this.view.renderContacts(contacts);
    this.model.registerTags();
    this.view.populateTagDropdown(document.querySelector('#new-tags'), this.model.getTags())
  }
}