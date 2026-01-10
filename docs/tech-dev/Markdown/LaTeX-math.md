---
title: LaTeX数学语法学习
tags:
  - Markdown
  - LaTeX
icon: material/sigma
comments: true
---

# LaTeX数学语法学习

## 关于LaTex
LaTeX 是一种基于 TEX 的排版系统，以其强大的排版能力和对数学公式、科学符号的完美支持而闻名，广泛应用于学术论文、书籍出版等领域。其优势在于能够将内容与格式分离，通过编写简单的文本代码，结合特定的宏包和命令，生成高质量的排版文档，尤其在处理复杂数学公式和专业符号时，表现出无可比拟的精确性和美观性。

Markdown 是一种轻量级标记语言，旨在让人们 “易读易写”，专注于内容本身。而在 Markdown 中引入 LaTeX 语法，极大地拓展了其功能。许多 Markdown 编辑器和平台，如 Typora、GitHub 等，都支持嵌入 LaTeX 代码来渲染数学公式和特殊符号。

例如，在 Typora 中，只需将 LaTeX 数学公式代码包裹在美元符号`$`中（行内公式）或使用`$$`包裹（独占一行的公式），就能直接渲染出美观的公式。以二次方程的求根公式为例，在 Markdown 中输入`$$x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$$`，即可呈现出标准的数学公式排版效果。这种将 LaTeX 融入 Markdown 的方式，使得科研人员、学生等群体能够在简洁的 Markdown 环境中，方便地编写包含复杂公式的文档。

## 基础语法
### 行内公式与块公式
```latex
这是行内公式 $E=mc^2$ 示例
使用括号的写法 \( \frac{1}{2} \) 也是行内公式

单独成行的块公式：
$$ \sum_{i=1}^n i = \frac{n(n+1)}{2} $$
或者使用方括号：
\[ \int_a^b f(x)dx \]
```

这是行内公式 $E=mc^2$ 示例

使用括号的写法 \( \frac{1}{2} \) 也是行内公式

单独成行的块公式：
$$ \sum_{i=1}^n i = \frac{n(n+1)}{2} $$
或者使用方括号：
\\[ \int_a^b f(x)dx \\]

### 注释与空格
```latex
$E=mc^2% 这是单行注释（不会出现在渲染结果中）$

公式中的空格需要特殊符号：
$a\,b$（小空格）  
$a\quad b$（大空格）  
$a\!b$（负空格）
```

$E=mc^2% 这是单行注释$

公式中的空格需要特殊符号：
$a\,b$（小空格）  
$a\quad b$（大空格）  
$a\!b$（负空格）

### 关于换行
```latex
可以通过在公式末尾添加\\表示换行，但该特性并不会被所有编辑器支持。
另外一种换行的办法是引入gather环境(多行公式居中对齐)：
\begin{gather}
a^2,a_1\\
x^{y+z},p_{ij},p_ij\\
x_i,x_{\text i}\\
\end{gather}
单行公式换行:
\begin{multline} 1 + 2 + 3 + 4 + 5 + 6 \
+ 7 + 8 + 9 + 10 = 55 \end{multline}
```

\begin{gather}
a^2,a_1\\
x^{y+z},p_{ij},p_ij\\
x_i,x_{\text i}\\
\end{gather}

\begin{multline} 1 + 2 + 3 + 4 + 5 + 6 \
+ 7 + 8 + 9 + 10 = 55 \end{multline}

### 常用环境
```latex
$$
\begin{equation}
    e^{i\pi} + 1 = 0
\end{equation}
$$

$$
\begin{align}
    (a+b)^2 &= a^2 + 2ab + b^2 \\
    (a-b)^2 &= a^2 - 2ab + b^2
\end{align}
$$

$$
f(x) = 
\begin{cases}
    x^2 & x \geq 0 \\
    -x  & x < 0
\end{cases}
$$
```
> Tips：
> 
> 1. equation 环境：用于单个带自动编号（需要编辑器支持）的公式，适合独立方程的场景
> 
> 2. align 环境：用于多行对齐公式（用 & 指定对齐位置），每行默认带编号
> 
> 3. cases 环境：用于分段函数（需搭配 amsmath 宏包），用大括号包裹多个条件分支

$$
\begin{equation}
    e^{i\pi} + 1 = 0
\end{equation}
$$

$$
\begin{align}
    (a+b)^2 &= a^2 + 2ab + b^2 \\
    (a-b)^2 &= a^2 - 2ab + b^2
\end{align}
$$

$$
f(x) = 
\begin{cases}
    x^2 & x \geq 0 \\
    -x  & x < 0
\end{cases}
$$

### 数学字体
```latex
$$ \begin{gather} 
\mathbb{ABCD} \quad \text{黑板粗体} \\ 
\mathcal{ABCD} \quad \text{花体} \\ 
\mathscr{ABCD} \quad \text{手写体} \\ 
\mathbf{ABCD} \quad \text{粗体} \\ 
\mathsf{ABCD} \quad \text{无衬线体} 
\end{gather} 
$$
```

$$ \begin{gather} 
\mathbb{ABCD} \quad \text{黑板粗体} \\ 
\mathcal{ABCD} \quad \text{花体} \\ 
\mathscr{ABCD} \quad \text{手写体} \\
\mathbf{ABCD} \quad \text{粗体} \\ 
\mathsf{ABCD} \quad \text{无衬线体} 
\end{gather} 
$$

### 公式编号与引用
**使用 equation 环境自动编号**
```latex
\begin{equation}
F = ma
\end{equation}
```
如果需要引用：
```latex
\begin{equation}\label{eq:1}
e^{i\pi} + 1 = 0
\end{equation}
在文本中引用：见公式 \eqref{eq:1}
```

\begin{equation}\label{eq:1}
e^{i\pi} + 1 = 0
\end{equation}

在文本中引用：见公式 (1)

> Tips：没有找到能在Mkdocs中显示自动编号的方法。

**使用 `\tag{...}` 手动编号**

这是最通用的方法，适用于绝大多数支持 LaTeX 的 Markdown 环境。你可以自定义括号内的内容（数字、罗马数字或文字）。
```latex
$$
e^{i\pi} + 1 = 0 \tag{1.1}
$$
```

$$
e^{i\pi} + 1 = 0 \tag{1.1}
$$

> 只有在双美元符号 $$...$$ 包裹的块级公式中，\tag 才会正常显示在右侧。行内公式 `$ ... $` 通常不支持编号。

### 特殊符号输入
```latex
角度符号：90^\circ  
微分符号：\mathrm{d}（直立体）  
存在号：\exists\, x \in \mathbb{R}  
梯度：\nabla f
```

$$
\begin{gather}
角度符号：90^\circ\\
微分符号：\mathrm{d}（直立体）\\
存在号：\exists\, x \in \mathbb{R}\\
梯度：\nabla f
\end{gather}
$$

## 常用符号
### 希腊字母
??? latex
    ```latex
    $$
    \begin{gather}
    \delta,\lambda\\
    \Delta,\Lambda\\
    A B\\
    \phi,\varphi\\
    \epsilon,\varepsilon\\
    π
    \end{gather}
    $$
    ```

$$
\begin{gather}
\delta,\lambda\\
\Delta,\Lambda\\
A B\\
\phi,\varphi\\
\epsilon,\varepsilon\\
π
\end{gather}
$$

### 上下标
??? latex
    ```latex
    $$
    \begin{gather}
    a^2,a_1\\
    x^{y+z},p_{ij},p_ij\\
    x_i,x_{\text i}\\
    \text{A B},\rm{A B}\\
    \text A B,\rm A B\\
    {\rm A} B\\
    \text{e},\text{i}
    \end{gather}
    $$
    ```

$$
\begin{gather}
a^2,a_1\\
x^{y+z},p_{ij},p_ij\\
x_i,x_{\text i}\\
\text{A B},\rm{A B}\\
\text A B,\rm A B\\
{\rm A} B\\
\text{e},\text{i}
\end{gather}
$$

### 分式与根式
??? latex
    ```latex
    $$
    \frac{1}{2},\frac 1 2,\\
    \frac 1 {x+y},\\
    \frac {\dfrac 1 x + 1}{y + 1}
    $$

    $$
    \sqrt 2,\sqrt{x+y},\sqrt[3]x
    $$
    ```

$$
\frac{1}{2},\frac 1 2,\\
\frac 1 {x+y},\\
\frac {\dfrac 1 x + 1}{y + 1}
$$

$$
\sqrt 2,\sqrt{x+y},\sqrt[3]x
$$

### 普通运算符
??? latex
    ```latex
    $$
    \begin{gather}
    +-\\
    \times,\cdot,\div\\
    \pm,\mp\\
    ><,\ge,\le,\gg,\ll,\ne,\approx,\equiv\\
    \cap,\cup,\in,\notin,\subseteq,\subsetneqq,\varnothing\\
    \forall,\exists,\nexists\\
    \because,\therefore\\
    \mathbb R,R,Q,N,Z_+\\
    \mathcal F,\mathscr F
    \end{gather}
    $$

    $$
    \cdots,\vdots,\ddots
    $$

    $$
    \infty,\partial,∂,\nabla,\propto,^{\circ}
    $$

    $$
    \begin{gather}
    \sin x,\sec x,\cosh x\\
    \log_2 x, \ln x,\lg x\\
    \lim\limits_{x \to 0} \frac { x}{\sin x}\\
    \max x
    \end{gather}
    $$

    $$
    \text{MSE}(x)
    $$
    ```

$$
\begin{gather}
+-\\
\times,\cdot,\div\\
\pm,\mp\\
><,\ge,\le,\gg,\ll,\ne,\approx,\equiv\\
\cap,\cup,\in,\notin,\subseteq,\subsetneqq,\varnothing\\
\forall,\exists,\nexists\\
\because,\therefore\\
\mathbb R,R,Q,N,Z_+\\
\mathcal F,\mathscr F
\end{gather}
$$

$$
\cdots,\vdots,\ddots
$$

$$
\infty,\partial,∂,\nabla,\propto,^{\circ}
$$

$$
\begin{gather}
\sin x,\sec x,\cosh x\\
\log_2 x, \ln x,\lg x\\
\lim\limits_{x \to 0} \frac { x}{\sin x}\\
\max x
\end{gather}
$$

$$
\text{MSE}(x)
$$

### 大型运算符
??? latex
    ```latex
    $$
    \sum,\prod,\\
    \sum_i,\sum_{i=0}^N,\\
    \frac{\sum\limits_{i=1}^n x_i}{\prod\limits_{i=1}^n x_i}
    $$

    $$
    \int,\iint,\iiint,\oint,\\
    \int_{-\infty}^0 f(x)\,\text d x
    $$

    $$
    \begin{gather}
    a\, a\\
    a\ a\\
    a\quad a\\
    a\qquad a
    \end{gather}
    $$
    ```

$$
\sum,\prod,\\
\sum_i,\sum_{i=0}^N,\\
\frac{\sum\limits_{i=1}^n x_i}{\prod\limits_{i=1}^n x_i}
$$

$$
\int,\iint,\iiint,\oint,\\
\int_{-\infty}^0 f(x)\,\text d x
$$

$$
\begin{gather}
a\, a\\
a\ a\\
a\quad a\\
a\qquad a
\end{gather}
$$

### 标注符号
??? latex
    ```latex
    $$
    \vec x,\overrightarrow {AB},\\
    \bar x,\overline{AB}
    $$
    ```

$$
\vec x,\overrightarrow {AB},\\
\bar x,\overline{AB}
$$

### 箭头
??? latex
    ```latex
    $$
    \leftarrow,\Rightarrow,\Leftrightarrow,\longleftarrow
    $$
    ```

$$
\leftarrow,\Rightarrow,\Leftrightarrow,\longleftarrow
$$

### 括号与定界符
??? latex
    ```latex
    $$
    \begin{gather}
    ([])\{ \}\\
    \lceil,\rceil,\lfloor,\rfloor,||\\
    \left(0,\frac 1 a\right]\\
    \left.\frac {∂f}{∂x}\right|_{x=0}
    \end{gather}
    $$
    ```

$$
\begin{gather}
([])\{ \}\\
\lceil,\rceil,\lfloor,\rfloor,||\\
\left(0,\frac 1 a\right]\\
\left.\frac {∂f}{∂x}\right|_{x=0}
\end{gather}
$$

### 多行公式
??? latex
    ```latex
    $$
    \begin{align}
    a&=b+c+d\\
    &=e+f
    \end{align}
    $$
    ```

$$
\begin{align}
a&=b+c+d\\
&=e+f
\end{align}
$$

### 大括号
??? latex
    ```latex
    $$
    f(x)=
    \begin{cases}
    \sin x, & -π\le x \le π\\
    0,& \text{其他}
    \end{cases}
    $$
    ```

$$
f(x)=
\begin{cases}
\sin x, & -π\le x \le π\\
0,& \text{其他}
\end{cases}
$$

### 矩阵
??? latex
    ```latex
    $$
    \begin{matrix}
    a & b & \cdots & c \\
    \vdots& \vdots & \ddots & \vdots \\
    e & f& \cdots & g
    \end{matrix}
    $$

    $$
    \begin{bmatrix}
    a & b & \cdots & c \\
    \vdots& \vdots & \ddots & \vdots \\
    e & f& \cdots & g
    \end{bmatrix}
    $$

    $$
    \begin{pmatrix}
    a & b & \cdots & c \\
    \vdots& \vdots & \ddots & \vdots \\
    e & f& \cdots & g
    \end{pmatrix}
    $$

    $$
    \begin{vmatrix}
    a & b & \cdots & c \\
    \vdots& \vdots & \ddots & \vdots \\
    e & f& \cdots & g
    \end{vmatrix}
    $$

    $$
    \bf A,\bf B^{\rm T}
    $$
    ```

$$
\begin{matrix}
a & b & \cdots & c \\
\vdots& \vdots & \ddots & \vdots \\
e & f& \cdots & g
\end{matrix}
$$

$$
\begin{bmatrix}
a & b & \cdots & c \\
\vdots& \vdots & \ddots & \vdots \\
e & f& \cdots & g
\end{bmatrix}
$$

$$
\begin{pmatrix}
a & b & \cdots & c \\
\vdots& \vdots & \ddots & \vdots \\
e & f& \cdots & g
\end{pmatrix}
$$

$$
\begin{vmatrix}
a & b & \cdots & c \\
\vdots& \vdots & \ddots & \vdots \\
e & f& \cdots & g
\end{vmatrix}
$$

$$
\bf A,\bf B^{\rm T}
$$



## 实战演练
??? latex
    ```latex
    $$
    f(x) = \frac 1 {\sqrt{2\pi} \sigma} {\rm e} ^ {-\frac {(x-\mu)^2}{2\sigma ^ 2}}\\
    f(x) = \frac 1 {\sqrt{2\pi} \sigma} \exp \left[ {-\frac {(x-\mu)^2}{2\sigma ^ 2}}\right]
    $$

    $$
    \lim\limits_{N\to \infty} P \left\{ \left| \frac {I\left( \alpha_i \right)}{N} - H(s) \right| < \varepsilon  \right\} = 1
    $$

    $$
    x(n) = \frac 1 {2\pi} \int _{-π} ^ π X\left( {\rm e} ^ {{\rm j} \omega } \right) {\rm e} ^ {{\rm j} \omega n} \, {\rm d}\omega\\
    $$

    $$
    \begin{align}
    \vec B \left( \vec r \right) &= \frac {\mu_0}{4\pi}\oint_C \frac {I \, {\rm d} \vec l \times \vec R}{R^3}\\
    &= \frac {\mu_0}{4\pi} \int_V \frac{\vec J_V \times \vec R}{R^3}\, {\rm d} V'
    \end{align}
    $$
    ```

$$
f(x) = \frac 1 {\sqrt{2\pi} \sigma} {\rm e} ^ {-\frac {(x-\mu)^2}{2\sigma ^ 2}}
$$

$$
f(x) = \frac 1 {\sqrt{2\pi} \sigma} \exp \left[ {-\frac {(x-\mu)^2}{2\sigma ^ 2}}\right]
$$

$$
\lim\limits_{N\to \infty} P \left\{ \left| \frac {I\left( \alpha_i \right)}{N} - H(s) \right| < \varepsilon  \right\} = 1
$$

$$
x(n) = \frac 1 {2\pi} \int _{-π} ^ π X\left( {\rm e} ^ {{\rm j} \omega } \right) {\rm e} ^ {{\rm j} \omega n} \, {\rm d}\omega\\
$$

$$
\begin{align}
\vec B \left( \vec r \right) &= \frac {\mu_0}{4\pi}\oint_C \frac {I \, {\rm d} \vec l \times \vec R}{R^3}\\
&= \frac {\mu_0}{4\pi} \int_V \frac{\vec J_V \times \vec R}{R^3}\, {\rm d} V'
\end{align}
$$

## 常见错误示例
❌ 错误：x^2 + y^2 = z^2 % 缺少 $ 符号
✅ 正确：$x^2 + y^2 = z^2$

❌ 错误：\sqrt x + 1 （根号范围错误）
✅ 正确：$\sqrt{x + 1}$

❌ 错误：\text{误差} = 0.1%（百分号需要转义）
✅ 正确：$\text{误差} = 0.1\%$

`$x^2 + y^2 = z^2$` `$\sqrt{x + 1}$` `$\text{误差} = 0.1\%$`