const io = require('socket.io-client');
const http = require('http');
const ioBack = require('socket.io');

let socket;
let httpServer;
let httpServerAddr;
let ioServer;


// only runs once before the test suite is run
// sets up an httpServer and websocket server, and then connects them
beforeAll((done) => {
  httpServer = http.createServer();
  httpServer.listen(() => {
    httpServerAddr = httpServer.address();
    ioServer = ioBack(httpServer);
    done();
  });
});

// only runs once after the test suite is run
// closes websocket server and http server
afterAll((done) => {
  ioServer.close();
  httpServer.close(done);
});

// runs before each test is run
// sets up socket connection to websocket server
beforeEach((done) => {
  socket = io.connect(
    `http://[${httpServerAddr.address}]:${httpServerAddr.port}`,
    {
      reconnectionDelay: 0,
      reopenDelay: 0,
      forceNew: true,
      transports: ['websocket'],
    }
  );
  socket.on('connect', () => {
    done();
  });
});

// runs after each test is done
// disconnects socket connection
afterEach((done) => {
  if (socket.connected) {
    socket.disconnect();
  }
  done();
});



describe('basic socket.io example', () => {


    // Tests that there is communication between client and server sockets
  test('Should have communication between client and server sockets', (done) => {
    ioServer.emit('echo', 'Testing connection');
    socket.once('echo', (message) => {
      expect(message).toBe('Testing connection');
      done();
    });
    ioServer.on('connection', (mySocket) => {
      expect(mySocket).toBeDefined();
    });
  });


// checks if socket.io can communicate
  test('Should communicate with waiting for socket.io handshakes', (done) => {
    socket.emit('example', 'some messages');
    setTimeout(() => {
      // Put your server-side expect() here
      done();
    }, 50);
  });
});
