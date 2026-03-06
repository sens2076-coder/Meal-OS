/* ===== public/js/storage.js ===== */

const STORAGE_KEY = 'todays_baby_food';

const getStorage = () => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
}

const updateStorage = (data) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

const getApiKey = () => {
    return localStorage.getItem('gemini_api_key');
}

const setApiKey = (key) => {
    localStorage.setItem('gemini_api_key', key);
}
