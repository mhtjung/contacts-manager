export class DisplayManager {
  constructor() {
    this.templates = {}
    this.registerTemplates();

    this.contactContainer = document.querySelector('#contact-container');
    this.formContainer = document.querySelector('#form-container');
    this.newContactForm = this.formContainer.querySelector('#new-contact-form');
    this.newContactCancelBtn = this.newContactForm.querySelector('input[type=button]')
    
    this.actionsContainer = document.querySelector('#actions-container');
    this.searchInput = this.actionsContainer.querySelector('#search');
    this.addContactBtn = this.actionsContainer.querySelector('#add-contact-btn')
    this.addTagsBtn = this.actionsContainer.querySelector('#add-tags-btn');
    
    this.refreshBtn = this.actionsContainer.querySelector('#refresh-btn');
    this.tagFormContainer = document.querySelector('#tag-form-container');
    this.updateContactForm = null;
  }
  
  registerTemplates() {
    const updateContact = Handlebars.compile(document.querySelector('#update-contact-template').innerHTML);
    const contact = Handlebars.compile(document.querySelector('#contact-template').innerHTML);
    Handlebars.registerPartial("contact", document.querySelector('#contact-template').innerHTML);
    const contacts = Handlebars.compile(document.querySelector('#contacts-template').innerHTML);
    this.templates = {updateContact, contacts, contact }
  }

  renderContacts(contacts) {
    const html = this.templates.contacts({contacts})
    while (this.contactContainer.firstChild) {
      this.contactContainer.removeChild(this.contactContainer.firstChild);
    }
    this.contactContainer.insertAdjacentHTML('afterbegin', html)
  }
  
  addContact(contactObj) {
    const html = this.templates.contact(contactObj);
    this.contactContainer.insertAdjacentHTML('beforeend', html);
  }

  removeContact(contactId) {
    this.contactContainer.removeChild(document.querySelector(`#contact-${contactId}`))
  }

  updateContact(contactObj) {
    const ulToReplace = document.querySelector(`#contact-${contactObj.id}`)
    const html = this.templates.contact(contactObj)
    const tempDiv = document.createElement('div');
    tempDiv.insertAdjacentHTML('afterbegin', html)
    ulToReplace.replaceWith(tempDiv.firstElementChild)
    this.updateContactForm.remove();
    this.toggleContactsDisplay();
    this.toggleActionsContainer();
  }

  populateTagDropdown(dropdown, tagsArr) {
    while (dropdown.firstChild) { dropdown.removeChild(dropdown.firstChild)}
    tagsArr.forEach(tag => {
      const option = document.createElement('option');
      option.value = tag;
      option.textContent = tag;
      dropdown.appendChild(option);
    }) 
  }

  getSelectedTags(form) {
    const selectedOptions = [...form.querySelector('select').selectedOptions];
    const tags = selectedOptions.map(element => element.value);  
    return tags.join(',');
  }
  
  renderUpdateForm(contactUl, tags) {
    this.toggleContactsDisplay();
    this.toggleActionsContainer();
    const contactInfo = [...contactUl.querySelectorAll('li')]
    const contactObj = {
      id: contactInfo[0].textContent,
      full_name: contactInfo[1].textContent,
      email: contactInfo[2].textContent,
      phone_number: contactInfo[3].textContent,
    }
    const html = this.templates.updateContact(contactObj);
    this.formContainer.insertAdjacentHTML('beforeend', html);
    this.updateContactForm = document.querySelector('#update-contact-form')    
    
    const tagDropdown = this.updateContactForm.querySelector('select');
    this.populateTagDropdown(tagDropdown, tags);
    const options = [...tagDropdown.options]

    const tagsToCheck = contactInfo[4].textContent.split(',');
    options.forEach(option => {
      if (tagsToCheck.includes(option.textContent)) {
        option.setAttribute('selected', 'selected');
      }
    })
  }

  removeUpdateForm() {
    this.formContainer.removeChild(this.updateContactForm);
    this.toggleContactsDisplay()
    this.toggleActionsContainer();
  }

  toggleNewContactForm() {
    this.toggleContactsDisplay();
    this.toggleActionsContainer();
    this.newContactForm.reset();
    this.newContactForm.classList.toggle('hide');
  }

  toggleAddTagsForm() {
    this.tagFormContainer.querySelector('input').value = ''
    this.toggleContactsDisplay();
    this.toggleActionsContainer();
    this.toggleTagsContainer();
  }

  toggleActionsContainer() {
    this.actionsContainer.classList.toggle('hide');
  }

  toggleContactsDisplay() {
    this.contactContainer.classList.toggle('hide');
  }

  toggleTagsContainer() {
    this.tagFormContainer.classList.toggle('hide');
  }
}

