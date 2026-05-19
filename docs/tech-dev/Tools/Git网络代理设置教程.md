---
title: Git网络代理设置教程
tags:
  - 工具资源
  - Git
icon: lucide/git-merge
comments: true
status: new
---

# Git网络代理设置教程

在科学上网环境下，进行代码编程，向 GitHub 进行 Git 提交操作（`git push` 或 `git clone`）经常失败，这大概率是因为 Git 命令行没有走你的代理网络。

浏览器能上 GitHub 不代表终端（Terminal/CMD）也能上。我们需要把 Git 的网络流量指向你的代理端口。可以按照以下步骤排查和解决。

## 获取你的代理端口

打开你的代理软件（如 Clash、v2rayN、Sing-box 等），寻找 LAN 端口（Local Port） 或 HTTP/SOCKS5 代理端口。

- 常见的 HTTP 端口通常是：`7890`、`10809`、`1080` 等。
- 常见的 SOCKS5 端口通常是：`7890`、`10808`、`1080` 等。

## 为 Git 设置代理

根据你使用的连接方式（HTTPS 还是 SSH），解决办法不同。

### 情况 A：如果你使用的是 HTTPS 链接

（即你的项目仓库地址是 `[https://github.com/](https://github.com/)...`）

打开终端（Windows 的 CMD/PowerShell，或 Mac/Linux 的 Terminal），运行以下命令（**注意：请将 `7890` 替换为你自己代理软件的实际端口**）：

**使用 HTTP 代理（推荐）：**

```bash
# 全局设置 HTTP 代理
git config --global http.proxy http://127.0.0.1:7890
git config --global https.proxy http://127.0.0.1:7890
```

**或者使用 SOCKS5 代理：**

```bash
git config --global http.proxy socks5://127.0.0.1:7890
git config --global https.proxy socks5://127.0.0.1:7890
```

> **💡 只对 GitHub 生效的小技巧：**
>
> 如果你不想让国内的 Git 码云（Gitee）等也走代理，可以只针对 GitHub 进行配置：
>
> ```bash
> git config --global http.https://github.com.proxy http://127.0.0.1:7890
> git config --global https.https://github.com.proxy http://127.0.0.1:7890
> ```

### 情况 B：如果你使用的是 SSH 链接

（即你的项目仓库地址是 `git@github.com:...`）

SSH 连接不走 Git 的 HTTP 代理配置，它需要修改系统的 SSH 配置文件。

1. 打开或创建 `~/.ssh/config` 文件（Windows 路径一般是 `C:\Users\你的用户名\.ssh\config`）。
2. 在文件中添加以下内容（同样注意替换端口 `7890`）：

**Windows 用户：**

```bash
Host github.com
    User git
    # ConnectCommand 后面需要根据你的代理类型二选一
    # 如果是 HTTP 代理：
    ProxyCommand connect -H 127.0.0.1:7890 %h %p
    # 如果是 SOCKS5 代理：
    # ProxyCommand connect -S 127.0.0.1:7890 %h %p
```

**Mac / Linux 用户：**

```bash
Host github.com
    User git
    # 如果是 HTTP 代理：
    ProxyCommand nc -X connect -x 127.0.0.1:7890 %h %p
    # 如果是 SOCKS5 代理：
    # ProxyCommand nc -X 5 -x 127.0.0.1:7890 %h %p
```

## 测试是否成功

- HTTPS 测试： 尝试直接在你的项目里执行 `git push`。
- SSH 测试： 在终端输入 `ssh -T git@github.com`。如果看到 `Hi username! You've successfully authenticated...` 这样的提示，说明代理成功打通！

## 常用辅助命令

**查看当前 Git 全局代理：**

```bash
git config --global --get http.proxy
git config --global --get https.proxy
```
**取消 Git 全局代理（如果以后不用代理了）：**

```bash
git config --global --unset http.proxy
git config --global --unset https.proxy
```