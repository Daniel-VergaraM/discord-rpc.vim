const DiscordRPC = require('discord-rpc');
const { exec } = require('child_process');
const clientId = process.argv[2];
const filename = process.argv[3];
const filetype = process.argv[4];

let rpc = null;
let retryCount = 0;
let connectionCheckInterval = null;
let activityCheckInterval = null;
let startTimestamp = Date.now(); // Store initial timestamp
const RECONNECT_INTERVAL = 5000; // 5 seconds
const ACTIVITY_CHECK_INTERVAL = 15000; // 15 seconds

// Check if Discord is running
function isDiscordRunning() {
  return new Promise((resolve) => {
    const cmd = process.platform === 'win32'
      ? 'tasklist /FI "IMAGENAME eq Discord.exe"'
      : 'pgrep -x Discord';

    exec(cmd, (error, stdout) => {
      resolve(stdout.toLowerCase().includes('discord'));
    });
  });
}

// Handle cleanup
function cleanup() {
  if (connectionCheckInterval) {
    clearInterval(connectionCheckInterval);
  }
  if (activityCheckInterval) {
    clearInterval(activityCheckInterval);
  }
  if (rpc) {
    rpc.destroy().catch(() => { });
    rpc = null;
  }
  process.exit(0);
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

async function updateActivity() {
  if (!rpc) return; try {
    await rpc.setActivity({
      details: `Editing ${filename}`,
      state: `Filetype: ${filetype}`,
      startTimestamp: startTimestamp,
      largeImageKey: 'vim',
      largeImageText: 'A One of a Kind Editor',
      // smallImageKey: 'editing',
      // smallImageText: 'Editing'
    });
  } catch (error) {
    console.error('Failed to update activity:', error);
    await reconnect();
  }
}

async function reconnect() {
  if (rpc) {
    try {
      await rpc.destroy();
    } catch (e) {
      // Ignore destroy errors
    }
    rpc = null;
  }
  retryCount = 0;
  // Don't reset the timestamp on reconnect
  await connectWithRetry();
}

async function connectWithRetry() {
  try {
    const isRunning = await isDiscordRunning();
    if (!isRunning) {
      console.log('Discord is not running. Waiting for Discord to start...');
      return;
    }

    if (rpc) return; // Already connected

    rpc = new DiscordRPC.Client({ transport: 'ipc' });

    rpc.on('ready', async () => {
      console.log('Discord RPC Connected');
      retryCount = 0;
      await updateActivity();
    });

    rpc.on('disconnected', () => {
      console.log('Discord RPC disconnected, will retry...');
      rpc = null;
    });

    rpc.on('error', async (error) => {
      console.error('Discord RPC Error:', error);
      await reconnect();
    });

    await rpc.login({ clientId });
  } catch (error) {
    console.error('Connection error:', error);
    retryCount++;
    console.log(`Retrying connection (attempt ${retryCount})...`);
    setTimeout(connectWithRetry, 5000);
  }
}

// Start connection check interval
connectionCheckInterval = setInterval(async () => {
  if (!rpc) {
    await connectWithRetry();
  }
}, RECONNECT_INTERVAL);

// Start activity check interval
activityCheckInterval = setInterval(async () => {
  if (rpc) {
    await updateActivity();
  }
}, ACTIVITY_CHECK_INTERVAL);

// Start the initial connection process
connectWithRetry();
