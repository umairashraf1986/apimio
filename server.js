const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

server.post('/selection-mode', (req, res) => {
    const { selectionMode } = req.body;
    router.db.set('settings.selectionMode', selectionMode).write();
    res.json({ settings: { selectionMode } });
});

server.get('/selection-mode', (req, res) => {
    const selectionMode = router.db.get('settings.selectionMode').value();
    res.json({ settings: { selectionMode } });
});

server.get('/mock-gtm-event', (req, res) => {
    // Mock response for GTM event
    res.status(200).json({ message: 'Mock GTM event sent successfully' });
});

server.use(router);

const port = 3000;
server.listen(port, () => {
    console.log(`JSON Server is running at http://localhost:${port}`);
});