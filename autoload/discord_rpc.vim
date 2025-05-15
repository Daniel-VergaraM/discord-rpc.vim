" Discord RPC autoload functions
" Maintainer: Daniel-VergaraM
" Version: 1.0

let s:plugin_dir = expand('<sfile>:p:h:h')

function! discord_rpc#update() abort
    if !g:discord_rpc_enabled
        return
    endif
    
    let l:filename = expand('%:t')
    if empty(l:filename)
        let l:filename = '[No Name]'
    endif
    
    let l:filetype = &filetype
    if empty(l:filetype)
        let l:filetype = 'text'
    endif
    
    let l:cmd = 'node ' . shellescape(s:plugin_dir . '/discord-rpc.js') . ' '
                \ . shellescape(g:discord_application_id) . ' '
                \ . shellescape(l:filename) . ' '
                \ . shellescape(l:filetype)
    
    call job_start(['bash', '-c', l:cmd], {
        \ 'err_cb': function('discord_rpc#handle_error'),
        \ 'out_cb': function('discord_rpc#handle_success')
        \ })
endfunction

function! discord_rpc#handle_success(channel, msg) abort
    echom "Discord RPC: Successfully updated presence"
endfunction

function! discord_rpc#handle_error(channel, msg) abort
    echohl ErrorMsg
    echom "Discord RPC error: " . a:msg
    echohl None
endfunction

function! discord_rpc#enable() abort
    let g:discord_rpc_enabled = 1
    call discord_rpc#update()
    echom "Discord RPC: Enabled"
endfunction

function! discord_rpc#disable() abort
    let g:discord_rpc_enabled = 0
    echom "Discord RPC: Disabled"
endfunction
