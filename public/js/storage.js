const Storage = {
  get: (key) => JSON.parse(localStorage.getItem(key)),
  set: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
  getApiKey: () => localStorage.getItem("gemini_api_key"),
  setApiKey: (key) => localStorage.setItem("gemini_api_key", key),
  clear: () => localStorage.clear()
};