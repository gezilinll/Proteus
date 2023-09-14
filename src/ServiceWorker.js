self.addEventListener('install', function (event) {
    event.waitUntil(self.skipWaiting()); // Activate worker immediately
});

self.addEventListener('activate', function (event) {
    event.waitUntil(self.clients.claim()); // Become available to all pages
});

let token = '';
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SET_TOKEN') {
        token = event.data.token;
    }
});

const addAuthHeader = function (event) {
    const modifiedHeaders = new Headers(event.request.headers);
    if (token) {
        modifiedHeaders.append('Authorization', `Bearer ${token}`);
    }
    const authReq = new Request(event.request, {
        headers: modifiedHeaders,
        mode: 'cors',
    });
    event.respondWith((async () => fetch(authReq))());
};
self.addEventListener('fetch', addAuthHeader);
