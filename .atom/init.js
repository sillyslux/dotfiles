const fs = require('fs');
const path = require('path');
const home = require('os').homedir();
const gtk3dir = path.join(home, '.config/gtk-3.0');
const gtk3file = path.join(gtk3dir, 'settings.ini');

let currentMode = '';

const updateTheme = debounce(function() {
  fs.readFile(gtk3file, (err, gtk3upd) => {
    if (err) return;
    const newMode = decode(gtk3upd.toString()).Settings['gtk-application-prefer-dark-theme'];
    if (newMode !== currentMode) {
      currentMode = newMode;
      atom.config.settings.core.themes = atom.themes.getActiveThemeNames().map(name => name.replace(/(dark|light)/, currentMode==='0'?'light':'dark'));
      atom.themes.activateThemes();
    }
  });
}, 100);

setTimeout(updateTheme, 15e3);
fs.watch(gtk3dir, updateTheme);

atom.contextMenu.add({
  'atom-text-editor': [{
      type: 'separator'
    },{
      label: 'fold all',
      command: 'editor:fold-all'
    },{
      label: 'unfold all',
      command: 'editor:unfold-all'
    },{
      label: 'fold 1',
      command: 'editor:fold-at-indent-level-1'
    },{
      label: 'fold 2',
      command: 'editor:fold-at-indent-level-2'
    },{
      type: 'separator'
    }]
});

function debounce(a,b,c){var d;return function(){var e=this,f=arguments;clearTimeout(d),d=setTimeout(function(){d=null,c||a.apply(e,f)},b),c&&!d&&a.apply(e,f)}};
/* ini parser */function dotSplit(r){return r.replace(/\1/g,"LITERAL\\1LITERAL").replace(/\\\./g,"").split(/\./).map(function(r){return r.replace(/\1/g,"\\.").replace(/\2LITERAL\\1LITERAL\2/g,"")})}function decode(r){var e={},t=e,n=null,a=/^\[([^\]]*)\]$|^([^=]+)(=(.*))?$/i,i=r.split(/[\r\n]+/g);return i.forEach(function(r,i,c){if(r&&!r.match(/^\s*[;#]/)){var f=r.match(a);if(f){if(void 0!==f[1])return n=unsafe(f[1]),void(t=e[n]=e[n]||{});var s=unsafe(f[2]),u=!f[3]||unsafe(f[4]||"");switch(u){case"true":case"false":case"null":u=JSON.parse(u)}s.length>2&&"[]"===s.slice(-2)&&(s=s.substring(0,s.length-2),t[s]?Array.isArray(t[s])||(t[s]=[t[s]]):t[s]=[]),Array.isArray(t[s])?t[s].push(u):t[s]=u}}}),Object.keys(e).filter(function(r,t,n){if(!e[r]||"object"!=typeof e[r]||Array.isArray(e[r]))return!1;var a=dotSplit(r),i=e,c=a.pop(),f=c.replace(/\\\./g,".");return a.forEach(function(r,e,t){i[r]&&"object"==typeof i[r]||(i[r]={}),i=i[r]}),(i!==e||f!==c)&&(i[f]=e[r],!0)}).forEach(function(r,t,n){delete e[r]}),e}function isQuoted(r){return'"'===r.charAt(0)&&'"'===r.slice(-1)||"'"===r.charAt(0)&&"'"===r.slice(-1)}function safe(r){return"string"!=typeof r||r.match(/[=\r\n]/)||r.match(/^\[/)||r.length>1&&isQuoted(r)||r!==r.trim()?JSON.stringify(r):r.replace(/;/g,"\\;").replace(/#/g,"\\#")}function unsafe(r,e){if(r=(r||"").trim(),!isQuoted(r)){for(var t=!1,n="",a=0,i=r.length;a<i;a++){var c=r.charAt(a);if(t)n+="\\;#".indexOf(c)!==-1?c:"\\"+c,t=!1;else{if(";#".indexOf(c)!==-1)break;"\\"===c?t=!0:n+=c}}return t&&(n+="\\"),n}"'"===r.charAt(0)&&(r=r.substr(1,r.length-2));try{r=JSON.parse(r)}catch(r){}return r}var eol="\n";
