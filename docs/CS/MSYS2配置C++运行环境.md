---
title: MSYS2配置C/C++运行环境
tags:
  - MSYS2
  - C/C++
icon: material/console-line
comments: true
status: new
---

# MSYS2配置C/C++运行环境

在 Windows 下整一套干净、现代化的 C/C++ 开发环境，确实是个折磨人的事。要么得装动辄几十个 G 的 Visual Studio，要么得手动去各种奇形怪状的网站下载 MinGW 压缩包，配个环境变量还要担心路径里有没有空格和中文。本文介绍一套**VSCode + CMake Tools 插件 + MSYS2**配置C/C++运行环境的方法。

MSYS2 就像 Ubuntu 的 `apt` 一样，能让你在 Windows 下一行命令搞定编译器和第三方库的安装与更新；而 CMake Tools 插件则能彻底解放你，让你告别魔改 `tasks.json` 和 `launch.json` 的痛苦，实现真正的一键编译和调试。

## 1. 搞定包管理器：安装 MSYS2

把 MSYS2 理解成 Windows 下的 Linux 软件中心就行。我们用它来装 GCC 编译器和 CMake。

### 下载与安装

1. 去 [MSYS2 官网](https://www.msys2.org/) 载最新的安装包。
2. 运行安装程序。**注意：** 安装路径尽量直接放在盘符根目录（比如 `C:\msys64`），**千万不要有中文、空格或特殊字符**。

### 换国内源

默认国外源极慢，更换**清华源**一键提速。

通过资源管理器进入MSYS2的安装路径，进入到`C:\msys64\etc\pacman.d`路径下。

打开编辑文件`/etc/pacman.d/mirrorlist.mingw`，在文件最顶部添加以下内容：

```bash
Server = https://mirrors.tuna.tsinghua.edu.cn/msys2/mingw/$repo/
Server = https://mirrors.ustc.edu.cn/msys2/mingw/$repo/
Server = https://mirrors.sjtug.sjtu.edu.cn/msys2/mingw/$repo/
```

打开编辑文件`/etc/pacman.d/mirrorlist.msys`，在文件最顶部添加以下内容：

```bash
Server = https://mirrors.tuna.tsinghua.edu.cn/msys2/msys/$arch/
Server = https://mirrors.ustc.edu.cn/msys2/msys/$arch/
Server = https://mirrors.sjtug.sjtu.edu.cn/msys2/msys/$arch/
```

完成后进行系统更新，执行以下命令：

```bash
pacman -Syu   # 第一次更新核心，中途可能要求关终端
pacman -Su   # 提示关闭终端 → 关掉重开，再执行该命令，补全剩余更新
```

### 安装 C/C++ 工具链

安装完成后，在开始菜单里找到并打开 **MSYS2 UCRT64**（注意：一定要选 **UCRT64**，这是目前最符合现代 Windows 规范的环境）。

在弹出的黑色终端里，依次执行下面的命令：

```bash
# 1. 稳妥起见，先更新一下软件源仓库
pacman -Syu

# 2. 安装主流工具链（包含 gcc, g++, gdb, make 等核心工具）
pacman -S mingw-w64-ucrt-x86_64-toolchain

# 3. 安装 Windows 下的 CMake
pacman -S mingw-w64-ucrt-x86_64-cmake
```

*提示：安装过程中如果碰到提示“Enter a selection”，直接敲回车（默认全选），后面提示 `[Y/n]` 时输 `y` 回车即可。*

### 配置全局环境变量

让 Windows 终端 / VSCode 直接调用 GCC，需要配置系统变量，让系统知道你把编译器藏在哪了。

1. 在 Windows 搜索框输入“环境变量”，选择“编辑系统环境变量”。

2. 点击“环境变量”按钮，在下方的“系统变量”里找到 `Path`，双击进去。

3. 点击“新建”，把刚才 UCRT64 环境下的 `bin` 目录加进去。默认路径是：

   `C:\msys64\ucrt64\bin`

4. 一路点确定保存。

系统变量 → Path → 新增：

```bash
C:\msys64\ucrt64\bin
```

执行完成后打开 powershell 终端（需要重启VSCode），通过以下命令验证：

```bash
gcc --version
g++ -version
cmake -version
```

如果能吐出版本号，说明底层环境已经通了，大功告成。

## 2. 安装 VSCode 调试插件

打开 VSCode，点左侧的扩展市场图标（Ctrl+Shift+X），安装下述插件：

1. **C/C++**（微软官方的，管代码高亮和智能提示）
2. **CMake Tools**（有了它就不需要手敲命令行了）

C/C++插件可以通过在 Github 官方仓库下载VSIX 文件([Releases · microsoft/vscode-cpptools](https://github.com/microsoft/vscode-cpptools/releases)) 的形式实现在第三方IDE（Cursor、Trea）中安装。

## 3. 实战：创建一个 CMake 项目

现在开始，我们要用现代化（Modern CMake）的方式来写代码。

1. 在电脑上新建一个空文件夹（比如 `hello_cpp`，注意工程路径不能包含中文，否则进入调试环节gdb会报错），用 VSCode 打开它。
2. 召唤快捷键：按下 `Ctrl + Shift + P` 调出命令面板。
3. 输入 `CMake: Quick Start` 并回车。
4. 选择工具箱 (Kit)： 此时插件会自动扫描你的系统。在弹出的列表里，选择刚才用 MSYS2 装好的 `GCC X.X.X x86_64-w64-mingw32`。
5. 顺着提示输入你的项目名称（比如 `main_app`），然后类型选择 **Executable**（可执行程序）。

这时候，CMake Tools 会贴心地帮你自动生成两个文件：一个 `main.cpp`，一个 `CMakeLists.txt`。

默认的 `CMakeLists.txt` 长这样：

```cmake
cmake_minimum_required(VERSION 3.0.0)
project(main_app VERSION 0.1.0 LANGUAGES CXX)

add_executable(main_app main.cpp)
```

## 4. 一键编译与调试

点击 VSCode 左侧的 Cmake 图标，现在可以通过鼠标点击的方式来编译调试和运行项目：

- **Build（构建）：** 状态栏上有一个大大的 `Build` 按钮。点它一下（或者直接按 `F7`），CMake 就会自动在项目下建一个 `build` 文件夹，在里面默默把 `.exe` 给你编译出来。
- **Run（运行）：** 状态栏上有一个像小播放键一样的 `🖵 Launch` 按钮。点一下，程序就会在下方的终端里跑起来。
- **Debug（调试）：** 找到 `main.cpp`，在代码行号左边点个红点（打断点）。然后点击状态栏上那个小甲虫一样的 `🪲 Debug` 按钮。GDB 调试器瞬间启动，变量监控、调用栈一应俱全。

## 番外：用 MSYS2 安装第三方库

用这套环境最大的方便之处在于不用手动编译第三方库了。

假设你的项目以后要用到图形库 SFML 或者矩阵库 Eigen、网络库等。你只需要重新打开 MSYS2 UCRT64 终端：

```bash
# 模糊搜索你想要的库
pacman -Ss sfml

# 一键安装
pacman -S mingw-w64-ucrt-x86_64-sfml
```

装完之后，它会自动躺进系统的默认搜寻路径里。你只需要在项目的 `CMakeLists.txt` 里加两行标准代码：

```cmake
find_package(SFML 2.5 REQUIRED system window graphics)
target_link_libraries(main_app PRIVATE sfml-graphics sfml-window sfml-system)
```

重新点一下 Cmake Tools 中的 `Build`，库就已经自动连上了，方便使用和管理。

常用的包管理命令如下：

```bash
pacman -S 包名        # 安装
pacman -R 包名        # 卸载
pacman -Ss 关键词     # 搜索包
pacman -Qs 关键词     # 查已安装
pacman -Syu            # 全系统更新（常用）
```

