export class DataManager {
  #contacts = [];
  #tags = [];
  constructor() {
  }
  
  getContacts() {
    return this.#contacts.slice();
  }

  getTags() {
    return this.#tags.slice();
  }

  addTags(newTags) {
    newTags.split(',').forEach(tag => this.#tags.push(tag.toLowerCase()));
  }

  registerTags() {
    const allTags = []
    this.#contacts.forEach(contact => {
      if (contact.tags) { allTags.push(contact.tags) }
    });
    this.#tags = Array.from(new Set(allTags.flat()));
  }

  filterByTag(tag) {
    return this.getContacts().filter(contact => {
      if (contact.tags) { return contact.tags.includes(tag) };
    })
  }

  filterByName(substring) {
    return this.getContacts().filter(contact => {
      return contact.full_name.toLowerCase().includes(substring.toLowerCase())
    })
  }

  async deleteContact(contactId) {
    try {
      await this.makeRequest('DELETE', `/api/contacts/${contactId}`)
      alert('Contact deleted!')  
      this.#contacts = this.#contacts.filter( contact => contact.id !== Number(contactId))
    } catch(error) {
      alert(error.message);
    }
  }

  getIndexById(id) {
    for (let i = 0; i < this.#contacts.length; i++) {
      if (Number(id) === this.#contacts[i].id) {
        return i
      }
    }
  }

  async editContact(form, tags) {
    try {
      const formData = new FormData(form);
      const contactObj = Object.fromEntries(formData);
      contactObj.tags = tags;
      const payload = JSON.stringify(contactObj);
      const response = await this.makeRequest('PUT', `/api/contacts/${contactObj.id}`, payload);
      const index = this.getIndexById(response.id);
      response.tags = response.tags.split(',');
      this.#contacts[index] = response;
      return response;
      } catch(error) {
        alert(error)
      }  
  }

  async createContact(form, tags) {
    try {
    const formData = new FormData(form);
    const contactObj = Object.fromEntries(formData);
    contactObj.tags = tags
    const payload = JSON.stringify(contactObj);
    const response = await this.makeRequest('POST', '/api/contacts/', payload);
    response.tags = response.tags.split(',')
    this.#contacts.push(response);
    return response;
    } catch(error) {
      alert(error)
    }
  }

  async reqAllContacts() {
    this.#contacts = await this.makeRequest('GET', '/api/contacts')
    this.#contacts.forEach(contact => {
      if (contact.tags) {
        contact.tags = contact.tags.split(',');
      }
    })
  }

  makeRequest(method, url, payload = null, responseType = 'json') {
    return new Promise((resolve, reject) => {
      const request = new XMLHttpRequest();
      request.open(method, url);
      if (method === 'POST' || method === 'PUT') {
        request.setRequestHeader('Content-Type', 'application/json')
      }
      request.responseType = responseType;
      request.onload = () => {
        if (request.status >= 200 && request.status < 300) {
          resolve(request.response)
        } else {
          reject({
            response: request.response,
            status: request.status,
            message: request.statusText,
          })
        }
      }
      request.onerror = () => {
        reject({
          response: request.response,
          status: request.status,
          message: request.statusText,
        })
      }
      request.send(payload);
    })
  }
}