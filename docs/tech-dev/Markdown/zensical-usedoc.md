---
title: Zensical 使用文档
tags:
  - Markdown
  - Zensical
icon: material/web
comments: true
---

# 基于 Zensical 的博客搭建

完整文档请访问 [zensical.org](https://zensical.org/docs/)。

## 安装与构建命令

* [`zensical new`][new] - 创建新项目  
* [`zensical serve`][serve] - 启动本地 Web 服务器  
* [`zensical build`][build] - 构建你的网站  

  [new]: https://zensical.org/docs/usage/new/  
  [serve]: https://zensical.org/docs/usage/preview/  
  [build]: https://zensical.org/docs/usage/build/  

## 写作语法

### 提示框（Admonitions）

> 参见 [文档](https://zensical.org/docs/authoring/admonitions/)

!!! note

    这是一个 **note（提示）** 类型的提示框，用于提供有用的信息。

!!! warning

    这是一个 **warning（警告）** 类型的提示框，请小心！

### 可折叠区块（Details）

> 参见 [文档](https://zensical.org/docs/authoring/admonitions/#collapsible-blocks)

??? info "点击展开查看更多信息"
    
    此内容默认隐藏，点击后展开。  
    非常适合用于常见问题（FAQ）或较长的说明。

### 代码块

> 参见 [文档](https://zensical.org/docs/authoring/code-blocks/)

``` python hl_lines="2" title="Code blocks"
def greet(name):
    print(f"Hello, {name}!") # (1)!

greet("Python")
```

1.  > 参见 [文档](https://zensical.org/docs/authoring/code-blocks/#code-annotations)

    代码注解（Code annotations）可用于为代码行添加注释说明。

代码也可以在行内高亮显示：`#!python print("Hello, Python!")`。

### 内容标签页（Content Tabs）

> 参见 [文档](https://zensical.org/docs/authoring/content-tabs/)

=== "Python"

    ``` python
    print("Hello from Python!")
    ```

=== "Rust"

    ``` rs
    println!("Hello from Rust!");
    ```

### 图表（Diagrams）

> 参见 [文档](https://zensical.org/docs/authoring/diagrams/)

``` mermaid
graph LR
  A[Start] --> B{Error?};
  B -->|Yes| C[Hmm...];
  C --> D[Debug];
  D --> B;
  B ---->|No| E[Yay!];
```

### 脚注（Footnotes）

> 参见 [文档](https://zensical.org/docs/authoring/footnotes/)

这是一句带有脚注的句子。[^1]

将鼠标悬停其上即可看到提示。

[^1]: 这是脚注内容。

### 文本格式（Formatting）

> 参见 [文档](https://zensical.org/docs/authoring/formatting/)

- ==这是高亮标记的文字==
- ^^这是下划线插入的文字^^
- ~~这是删除线文字~~
- H~2~O（下标）
- A^T^A（上标）
- ++ctrl+alt+del++（键盘按键）

### 图标与表情符号（Icons & Emojis）

> 参见 [文档](https://zensical.org/docs/authoring/icons-emojis/)

* :sparkles: `:sparkles:`
* :rocket: `:rocket:`
* :tada: `:tada:`
* :memo: `:memo:`
* :eyes: `:eyes:`

### 数学公式（Maths）

> 参见 [文档](https://zensical.org/docs/authoring/math/)

$$
\cos x=\sum_{k=0}^{\infty}\frac{(-1)^k}{(2k)!}x^{2k}
$$

!!! warning "需要配置"
    请注意，本页通过 `<script>` 标签手动引入了 MathJax，**默认配置中并未启用**，以避免在不需要数学公式的页面中加载不必要的资源。如需在全站启用，请参考文档中的配置说明。

<script id="MathJax-script" async src="https://unpkg.com/mathjax@3/es5/tex-mml-chtml.js"></script>
<script>
  window.MathJax = {
    tex: {
      inlineMath: [["\\(", "\\)"]],
      displayMath: [["\\[", "\\]"]],
      processEscapes: true,
      processEnvironments: true
    },
    options: {
      ignoreHtmlClass: ".*|",
      processHtmlClass: "arithmatex"
    }
  };
</script>

### 任务列表（Task Lists）

> 参见 [文档](https://zensical.org/docs/authoring/lists/#using-task-lists)

* [x] 安装 Zensical
* [x] 配置 `zensical.toml`
* [x] 编写出色的文档
* [ ] 部署到任意平台

### 工具提示（Tooltips）

> 参见 [文档](https://zensical.org/docs/authoring/tooltips/)

[将鼠标悬停在此处][example]

  [example]: https://example.com   "我是一个工具提示！"

---

> 💡 **说明**：Zensical 由 mkdocs-material 团队开发，其 Markdown 语法与 Mkdocs-material 相同。