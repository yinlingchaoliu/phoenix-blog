---
title: homebrew换源
date: 2024-03-24 11:47:50
category:
  - 日常问题锦集
tag:
  - archive
---

####替换brew源
```
#brew 备用地址-1
cd "$(brew --repo)"
git remote set-url origin https://mirrors.ustc.edu.cn/brew.git
#homebrew-core
#替换homebrew-core.git
cd "$(brew --repo)/Library/Taps/homebrew/homebrew-core"
git remote set-url origin https://mirrors.ustc.edu.cn/homebrew-core.git
brew update

# 备用地址-2
cd "$(brew --repo)"
git remote set-url origin https://mirrors.tuna.tsinghua.edu.cn/git/brew.git
cd "$(brew --repo)/Library/Taps/homebrew/homebrew-core"
git remote set-url origin https://mirrors.tuna.tsinghua.edu.cn/git/homebrew-core.git
brew update

```

####官方地址
```
#重置brew.git
cd "$(brew --repo)"
git remote set-url origin https://github.com/Homebrew/brew.git

#重置homebrew-core.git
cd "$(brew --repo)/Library/Taps/homebrew/homebrew-core"
git remote set-url origin https://github.com/Homebrew/homebrew-core.git
```
