---
title: Python文件查重程序
tags:
  - uv
  - Python
icon: material/package-variant
comments: true
status: new
---

# Python 下一代包管理器 uv 上手指南

**uv** 是一个基于 Rust 编写的超高性能 Python 包管理器。它不仅是 `pip` 的替代品，更试图整合 `pip`、`pip-tools`、`pipx`、`poetry`、`pyenv` 和 `virtualenv` 的功能。

## 为什么选择 uv？

1.  **极速**：比 pip 快 10-100 倍（不夸张，Rust 的加持让依赖解析瞬间完成）。
2.  **大一统**：一个二进制文件搞定 Python 版本管理、项目管理、脚本运行和工具安装。
3.  **节省空间**：使用全局缓存，不同项目依赖同一个版本的包时无需重复下载。
4.  **兼容性**：完全兼容现有的 `pyproject.toml` 标准。

## 官方独立安装程序安装 UV

uv 的安装非常简单，它是一个独立的二进制文件，不依赖 Python 本身即可运行。

**MacOS / Linux:**

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

**Windows:**

```powershell
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
```

**通过 pip 安装 (不推荐，但可行):**

```bash
pip install uv
```

安装完成后，验证一下：
```bash
uv --version
```

!!! note "更新uv自身的版本"
    通过官方推荐的 curl (macOS/Linux) 或 PowerShell (Windows) 脚本安装的独立的 uv 二进制文件自带了自我更新功能：

    ```bash
    uv self update
    ```

    如果将 uv 当作一个 Python 包安装的：
    ```bash
    pip install --upgrade uv
    # 或者
    pip install -U uv
    ```

## 核心工作流：项目管理

这是 uv 官方推荐的现代工作流，类似于 Poetry 或 npm，基于 `pyproject.toml`。

### 初始化项目

创建一个新项目或初始化现有目录：

```bash
# 创建一个名为 my-app 的新项目
uv init my-app

# 或者在当前目录初始化
uv init
```
这会生成 `pyproject.toml` 和 `.python-version` 文件。

### 添加依赖
不再使用 `pip install` 吧，现在可以通过`uv`使用 `add`。这会自动更新 `pyproject.toml` 并生成/更新 `uv.lock` 文件。

```bash
# 添加标准依赖
uv add requests

# 添加开发依赖 (例如测试框架)
uv add --dev pytest
```

**注意**：uv 会自动为你创建并管理虚拟环境（默认为 `.venv`），你不需要手动运行 `python -m venv`。

### 移除依赖

```bash
uv remove requests
```

### 同步环境

当你拉取别人的代码，或者手动修改了 `pyproject.toml` 后，使用 sync 让环境与配置对齐：
```bash
uv sync
```

### 运行代码

因为虚拟环境是 uv 管理的，你不需要手动“激活”环境即可运行代码：

```bash
# 运行项目中的脚本
uv run main.py

# 运行模块
uv run python -m flask run
```
`uv run` 会自动确保环境已同步，并在隔离的环境中执行命令。

!!! note
    > 如何激活 Python 虚拟环境？
    >
    > **方法一：不激活（uv 推荐方式）**
    >
    > **这是 uv 最强大的特性之一。** 你不需要手动激活环境，直接使用 uv run 即可。uv 会自动加载 .venv 中的环境配置并运行命令。
    >
    > ```bash
    > # 自动使用虚拟环境运行 python
    > uv run python app.py
    > 
    > # 自动使用虚拟环境运行已安装的工具（如 pytest）
    > uv run pytest
    > ```
    >
    > **方法二：手动激活（传统方式）**
    >
    > 如果你需要在终端中持续停留在该环境下（例如为了让 IDE 识别，或者连续运行多条命令），操作方式与标准 Python venv 完全一致：
    >
    > **macOS / Linux:**
    >
    > ```bash
    > source .venv/bin/activate
    > ```
    >
    > **Windows (PowerShell):**
    >
    > ```bash
    > .venv\Scripts\activate
    > ```
    >
    > **Windows (Command Prompt / cmd):**
    >
    > ```bash
    > which python   # Linux/Mac
    > where python   # Windows
    > ```
    >
    > **验证激活状态：**
    > 激活后，你的命令行提示符前通常会出现 (项目名) 或 (.venv) 字样。你可以输入以下命令确认 python 的路径是否指向 .venv 内部：
    >
    > ```bash
    > which python   # Linux/Mac
    > where python   # Windows
    > ```

## Python 版本管理

uv 可以替代 `pyenv`。它可以帮你下载并安装不同版本的 Python。

### 查看可用版本

```bash
uv python list
```

### 安装 Python

```bash
# 安装最新版
uv python install

# 安装特定版本
uv python install 3.12
```

### 为项目指定版本

在项目目录下：
```bash
uv python pin 3.11
```
这会更新 `.python-version` 文件，`uv run` 或 `uv sync` 时会自动使用该版本。

## 升级依赖包

### 场景 A：如果使用的是项目管理模式（推荐）

即使用了 uv init 和 uv add，并且目录下有 pyproject.toml 和 uv.lock 文件。

**升级单个包（在允许的版本范围内）：**
如果只想把 requests 更新到 pyproject.toml 允许的最新版本（例如从 2.31.0 更新到 2.32.0），并更新锁文件：

````bash
uv lock --upgrade-package requests
````

**升级所有包：**

```bash
uv lock --upgrade
```

**强制升级到特定版本（修改配置）：**
如果想升级到一个超出当前 pyproject.toml 限制的版本（例如升级大版本），直接再次运行 add 命令并指定版本：

````bash
uv add "requests>=3.0"
````

### 场景 B：如果你仅把它当作 pip 使用（Pip 接口模式）

即使用的是 `uv pip ...` 命令

```
uv pip install --upgrade requests
# 或者简写
uv pip install -U requests
```

### 场景 C：如果升级的是全局工具

即使用的是 `uv tool install ...`

```
uv tool upgrade ruff
# 升级所有工具
uv tool upgrade --all
```

## 单脚本运行

如果你只是想写一个简单的脚本，不想创建复杂的项目结构，uv 支持PEP 723 (Inline Script Metadata)。

创建一个文件 `script.py`，在顶部声明依赖：

```python
# /// script
# requires-python = ">=3.11"
# dependencies = [
#     "requests<3",
#     "rich",
# ]
# ///

import requests
from rich import print

resp = requests.get("https://peps.python.org/api/peps.json")
data = resp.json()
print(f"PEP count: {len(data)}")
```

直接运行：
```bash
uv run script.py
```
uv 会创建一个临时的虚拟环境，下载 `requests` 和 `rich`，运行脚本，然后清理——不仅速度快，而且不会污染你的全局环境。

你甚至可以直接用 `uv add` 来给脚本添加依赖头：
```bash
uv add --script script.py pandas
```

---

## 工具管理

替代 `pipx`。用于安装像 `ruff`、`black`、`httpie` 这种命令行工具。

```bash
# 安装工具
uv tool install ruff

# 运行工具
ruff check .

# 一次性运行工具 (无需安装)
uv tool run cowsay "Hello uv!"
# 或者简写
uvx cowsay "Hello uv!"
```

---

## 兼容旧习惯：Pip 接口

如果你还不想切换到 `pyproject.toml` 模式，只想把 uv 当作一个“更快的 pip”来用，也是完全支持的。

```bash
# 创建虚拟环境
uv venv

# 激活环境 (Linux/Mac)
source .venv/bin/activate
# 激活环境 (Windows)
.venv\Scripts\activate

# 像 pip 一样安装
uv pip install requests
uv pip install -r requirements.txt

# 导出依赖
uv pip freeze > requirements.txt
```

## 结语

uv 正在迅速改变 Python 的开发体验。它将分散的工具链整合为一个单一的、高性能的二进制文件。

**速查表：**

| 任务            | 旧方式 (Pip/Poetry/Pyenv)             | 新方式 (uv)              |
| :-------------- | :------------------------------------ | :----------------------- |
| **创建环境**    | `python -m venv .venv`                | `uv init` (自动管理)     |
| **安装包**      | `pip install xxx` / `poetry add xxx`  | `uv add xxx`             |
| **运行代码**    | `source .venv/...` -> `python app.py` | `uv run app.py`          |
| **安装 Python** | `pyenv install 3.12`                  | `uv python install 3.12` |
| **运行工具**    | `pipx run cowsay`                     | `uvx cowsay`             |

如果你还没尝试过 uv，现在就是最好的时机。体验一下 Rust 带来的极致速度吧！