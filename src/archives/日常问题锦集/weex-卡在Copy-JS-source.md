---
title: weex-卡在Copy-JS-source
date: 2024-03-24 11:47:50
category:
  - 日常问题锦集
tag:
  - archive
---
>yingzi:GSYGithubAppWeex chentong$ weex run android 
[✔] Compile JSBundle done
[✔] Use Nexus_5X (Simulator)
[✔] Start hotreload server done
[✔] Set native config done
⠋ Copy JS source - this may take a few secondsError: ENOENT: no such file or directory, lstat '/Users/chentong/Android/weex/GSYGithubAppWeex/dist'
⠹ Copy JS source - this may take a few secondsError: Command failed: npm run dev
sh: webpack: command not found
npm ERR! file sh
npm ERR! code ELIFECYCLE
npm ERR! errno ENOENT
npm ERR! syscall spawn
npm ERR! gsy-github-weex-app@1.0.0 dev: `webpack --env.NODE_ENV=common --progress --watch`
npm ERR! spawn ENOENT
npm ERR! 
npm ERR! Failed at the gsy-github-weex-app@1.0.0 dev script.
npm ERR! This is probably not a problem with npm. There is likely additional logging output above.
npm WARN Local package.json exists, but node_modules missing, did you mean to install?
> gsy-github-weex-app@1.0.0 dev /Users/chentong/Android/weex/GSYGithubAppWeex
> webpack --env.NODE_ENV=common --progress --watch
>at makeError (/Users/chentong/.wx/core/node_modules/_execa@0.10.0@execa/index.js:172:9)
    at Promise.all.then.arr (/Users/chentong/.wx/core/node_modules/_execa@0.10.0@execa/index.js:277:16)
    at process._tickCallback (internal/process/next_tick.js:68:7)
⠋ Copy JS source - this may take a few seconds

解决方案
```
首先 npm  install 
```
