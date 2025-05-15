# vim-discord-rpc

A Vim plugin that shows your editing status in Discord using Rich Presence.

## Requirements

- Node.js
- Discord desktop client

## Installation

1. Install the required Node.js package:
```bash
cd ~/.vim_runtime/my_plugins/vim-discord-rpc
npm install
```

2. The plugin should be automatically loaded by your vim configuration.

## Configuration

Add these to your vimrc to customize the plugin:

```vim
" Enable/disable Discord RPC (enabled by default)
let g:discord_rpc_enabled = 1

" Set your Discord application ID (you need to create one at Discord Developer Portal)
let g:discord_application_id = 'YOUR_APP_ID'
```

## Commands

- `:DiscordRPCEnable` - Enable Discord RPC
- `:DiscordRPCDisable` - Disable Discord RPC

## Features

- Shows current editing file name
- Displays file type
- Shows editing duration
- Custom Discord presence with Vim logo

## Setting up Discord Application

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new application
3. Note down the Application ID
4. In the Rich Presence section, upload assets:
   - Upload a Vim logo named "vim" for the large image
   - Upload an editing icon named "editing" for the small image
5. Add the Application ID to your vimrc or update it directly in the plugin

## Troubleshooting

If you encounter any issues:

1. Make sure Node.js is installed and available in your PATH
   ```bash
   node --version
   ```

2. Check if Discord is running
3. Verify your Application ID is correct
4. Check the Vim command output for any error messages
   - Upload an editing icon named "editing" for the small image
5. Set the Application ID in your vim configuration
