import axios from 'axios';
import config from '../config';

if (!config.apiKey && !localStorage.getItem('JF-apiKey')) {
  console.error('Your api key does not exist!');
}

const generateUrl = formID => `https://api.jotform.com/form/${formID}?apiKey=${config.apiKey || localStorage.getItem('JF-apiKey')}`;

const form = document.getElementById('form');
const input = document.getElementById('apiKey');
const formButton = form.querySelector('button');
const addButton = document.getElementById('add-form');

const saveApiKey = () => {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    localStorage.setItem('JF-apiKey', input.value);
    formButton.innerText = 'Update';
  });
};

const addForm = () => {
  addButton.addEventListener('click', () => {
    JotformAnywhere.launchFormBuilder({});
  });
};

const subscribeCreateEvent = () => {
  JotformAnywhere.subscribe('jotform.formCreated', (response) => {
    if (response.formID) {
      return getFormDetails(response.formID);
    }

    console.error('formID not found!');
  });
};

const getFormDetails = (formID) => {
  axios.get(generateUrl(formID))
    .then((response) => {
      if (response.status === 200) {
        console.log('form details: ', response.data.content);

        return;
      }

      console.log('response', response);
    })
    .catch((err) => {
      console.error('Error: ', err);
    });
};

const init = () => {
  saveApiKey();
  addForm();
  subscribeCreateEvent();
};

init();
