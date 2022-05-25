TODO:

Algo:

  If the contacts-container is hidden,
    

1. Tagging Feature
  Tag Creation
  - On first render, the model object should retrieve the unique tags and add them to a 'this.tags' array
  - Create a 'create tag' button;
    - When pressed, hide the contacts container
    - Display a form that has an input;
      - Add tooltip that tells user to comma-separate tags;
    - On form submission, add 'tags' to model object;
  - On contact edit or creation, display a multiselect dropdown of model.tags
    - Add functionality that pre-selects the values already added.
  Tag Filtering
    - When rendering tags within the contacts template, place them each in an a tag
      - Find a way to split the tags by commas
    - When a tag is clicked,
      - Create a function called 'filter by tags' that uses the 'tags' array on each contact
      - Update the render contacts function to accept an optional filter object.
    
2. Search filter functionality
  - Searches are based on names, specifically substrings of names
  - Don't make a request - rather, alter the model to save an array of contacts
    - Need the 'edit' functionality to update this array accordingly
    - Need the 'delete' functionality to update this array accordingly
  - Create a function 'filterBySubstring' that accepts a substring and returns an array of contacts that match
  - Re render the contacts container

  Algo
    - Add event listener to the search input
      - Read up on throttling      


1. Add a 'create contact' button
  - When pressed, renders the nee contact form
    - This should set the 'contact-container' element's display to none;
    - This should append the new contact form to the page;
  - Send appropriate post request on form submission
  - If the response is ok, hide the form, and use the response and contact template to append it to the page.

2. For edit/delete functionality
  - Add event listener to contact-container div
    - Check for edit-btn || delete-btn
    - If it's edit, render the edit form (use another function for this);
      - Get the id to send for the edit request from the parent ul
    - Else, confirm the deletion;
      - Then send the delete request 

Handlebars Templates
  Displaying Contacts
  1. Contacts
    2. Use 'contact' partial
      - Hidden field for contact id;
      - Full name
      - Email
      - Phone number
      - tags
      - Edit button
      - Delete button
  
  Adding/updating contacts can use the same form template
    - Just pass optional values to the update form for prefill

On first page load,
  1. Send request to /api/contacts (Get all contacts);
  2. Place all contacts into local storage for faster querying
  2. For each contact that is returned, pass to appropriate Handlebars template

First, build out functionality to add contacts;
  1. Create 'add contact' button
  2. When button is pressed, display new contact form;
  3. On form submission
    - Send post request to /api/contacts
      - Response should JSON object that includes a contact id;
  
Search functionality
 1. Need to delay by a second or so;


Model
  - Should handle adding and editing contacts;

View
  - Should handle rendering templates

Controller
  - Should handle passing information between the model and the view;

