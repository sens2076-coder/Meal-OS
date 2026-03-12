const Storage = {
  API_KEY_NAME: 'mealos_api_key',
  INPUT_SESSION_KEY: 'mealos_input',

  saveApiKey(key) {
    localStorage.setItem(this.API_KEY_NAME, key);
  },

  getApiKey() {
    return localStorage.getItem(this.API_KEY_NAME);
  },

  clearApiKey() {
    localStorage.removeItem(this.API_KEY_NAME);
  },

  saveInputData(data) {
    sessionStorage.setItem(this.INPUT_SESSION_KEY, JSON.stringify(data));
  },

  getInputData() {
    const data = sessionStorage.getItem(this.INPUT_SESSION_KEY);
    return data ? JSON.parse(data) : null;
  }
};
