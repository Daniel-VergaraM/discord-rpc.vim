" vim-discord-rpc - Discord Rich Presence for Vim
" Maintainer: Daniel-VergaraM
" Version: 1.0

if exists('g:loaded_discord_rpc')
    finish
endif
let g:loaded_discord_rpc = 1

" Default configuration
if !exists('g:discord_rpc_enabled')
    let g:discord_rpc_enabled = 1
    echom "Discord RPC: Enabled by default"
endif

if !exists('g:discord_application_id')
    let g:discord_application_id = '1371323562992074852' " You should change this to your Discord application ID
endif

" Check if Node.js is available
if !executable('node')
    echohl ErrorMsg
    echo "Discord RPC requires Node.js to be installed"
    echohl None
    finish
endif

" Auto commands
augroup DiscordRPC
    autocmd!
    autocmd VimEnter,BufEnter * call discord_rpc#update()
augroup END

" Commands
command! RPCon call discord_rpc#enable()
command! RPCoff call discord_rpc#disable()
