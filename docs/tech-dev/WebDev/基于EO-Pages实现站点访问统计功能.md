---
title: 基于 EdgeOne Pages 实现站点访问统计功能
tags:
  - Web
  - Zensical
  - EdgeOne
  - Cloudflare
icon: material/web
comments: true
status: new
---

# 用 EdgeOne Pages 零成本搭建博客访问计数器

在搭建个人博客时，我们往往需要一个简单、精准且保护隐私的访问量统计工具。Google Analytics 功能强大但过于臃肿且涉及隐私问题，市面上的商业统计服务又大多收费。

笔者为了满足自己博客全站访问数及文章页访问数的统计需求，开发了 **EO-Counter** ，这是一个利用 **腾讯云 EdgeOne Pages** 的边缘函数（Edge Functions）和 KV 存储构建的轻量级访问统计方案。它完全免费（在免费额度内）、无需维护服务器、自带可视化后台，并且支持极其灵活的前端集成。

本文以 Zensical/Mkdocs-material 这类现代静态文档站点为例，讲解如何部署 EO-Counter 项目。

!!! tip
    其他站点的部署及更详细的后端部署细则参考 **EO-Counter** 的 [Github README说明](https://github.com/weigo6/eo-counter) 。

## 🌟 EO-Counter 的优势是什么？

- **💸 真正的零成本**：利用 EdgeOne Pages 的免费额度，个人博客绰绰有余。
- **⚡ 边缘低延迟**：统计逻辑运行在边缘节点，全球访问速度极快。
- **🔒 数据私有化**：数据存储在你自己的腾讯云账号下，安全可控。
- **📊 可视化看板**：自带管理后台，支持查看热力图、搜索路径、甚至手动修正数据。
- **🧩 完美适配 SSG**：专为 Hexo, Hugo, MkDocs, Zensical 等静态博客设计。

## 🛠️ 第一步：后端部署 (EdgeOne Pages)

只需五分钟即可完成服务端的搭建。

1.  **获取代码**：
    登录 GitHub，Fork 或下载 [EO-Counter 仓库](https://github.com/weigo6/eo-counter)。

2.  **创建项目**：
    前往 [腾讯云 EdgeOne Pages 控制台](https://console.cloud.tencent.com/edgeone/pages)，点击“新建项目”，选择你刚才 Fork 的 GitHub 仓库。构建配置保持默认即可。

3.  **配置数据库 (KV)**：
    - 在 Pages 控制台创建 KV 命名空间。
    - 在项目设置中，绑定 KV 命名空间，**变量名必须填写为 `BLOG_DB`**。

4.  **设置环境变量**：
    在项目设置中添加以下环境变量：
    - `DASHBOARD_PWD`：设置一个复杂的密码，用于登录管理后台。
    - `ALLOWED_ORIGIN`：允许跨域的域名。
      - 调试填：`*`
      - 上线填：`https://你的博客域名.com` (多个域名用逗号分隔)

5.  **部署上线**：
    保存配置并触发一次重新部署。部署成功后，你会获得一个 `*.edgeone.dev` (或类似) 的访问地址，这就是你的 **API 服务地址**。

> 需要绑定自己的域名作为 API 地址，Edge One Pages默认提供的域名存在访问期限。未备案域名加速区域请选择全球可用区（不含中国大陆）。

## 💻 第二步：前端集成（Zensical/Mkdocs-material）

### 1. 引入统计脚本

针对 **MkDocs-Material** 和 **Zensical** 这类现代静态文档站点，由于它们通常使用了 Instant Loading (PJAX/SPA) 技术，传统的 `window.onload` 埋点往往会在页面跳转时失效。

为了确保**无论是首次加载还是站内跳转，都能准确统计 PV**，请在`docs/javascripts/`路径下创建`count.js`文件。

然后将下述代码粘贴进去：

```js
// 网站计数器，PV统计
// docs/javascripts/count.js

(function() {
  // === ⚠️云端 Worker API 地址，请务必将此处填写为自己的 EdgeOne Pages访问域名/api/visit的形式===
  const WORKER_URL = "https://example.com/api/visit";

  function fetchStats() {
    const siteElem = document.getElementById("site_pv");
    const pageElem = document.getElementById("page_pv");

    // 如果页面上找不到这两个元素（比如还没加载完），就不执行
    if (!siteElem || !pageElem) return;

    // 获取当前路径
    const currentPath = window.location.pathname;

    // 发送请求
    fetch(`${WORKER_URL}/?url=${encodeURIComponent(currentPath)}`)
      .then(response => response.json())
      .then(data => {
        // 更新页面数字
        siteElem.innerText = data.total;
        pageElem.innerText = data.page;
      })
      .catch(err => {
        console.error("访问统计出错:", err);
        // 出错时可以显示 "--" 或者隐藏
        siteElem.innerText = "--";
        pageElem.innerText = "--";
      });
  }

  // === 关键逻辑：处理 MkDocs Material/Zensical 的加载机制 ===
  
  // 检查是否支持 Instant Loading (MkDocs Material 特性)
  if (typeof document$ !== "undefined") {
    // 如果开启了 Instant Loading，RxJS 的 document$ 会负责监听所有跳转（包括首次加载）
    document$.subscribe(function() {
      // 这里的 setTimeout 是必须的，等待页面 DOM 替换完成
      setTimeout(fetchStats, 100);
    });
  } else {
    // 如果没有开启 Instant Loading，则回退到标准的 DOMContentLoaded
    document.addEventListener("DOMContentLoaded", fetchStats);
  }
})();
```

!!! warning
    假设你的 EdgeOne Pages 项目的**访问地址**为：https://your-eocount.com，则你需要在前端 js 代码中设置的 WORKER_URL 地址为：https://your-eocount.com/api/visit

    **环境变量必须配置**✅

    DASHBOARD_PWD 用于管理员控制台登录密钥，用于 `api/admin.js` 的身份验证（`X-Auth-Token`）。

    ALLOWED_ORIGIN 示例场景如下（**请勿遗漏`https://`**）：

      - 场景 1：仅生产环境
          ALLOWED_ORIGIN = https://yourblog.com,https://www.yourblog.com
      - 场景 2：生产环境 + 本地开发
          ALLOWED_ORIGIN = https://yourblog.com,http://localhost:3000
      - 场景 3：完全开放 (仅测试用)
          ALLOWED_ORIGIN = *

### 2. 修改配置文件

编辑 `zensical.toml`或者`mkdocs.yml`，引入刚才创建的脚本：

=== "zensical.toml"
    ```toml
    [project]
    extra_javascript = [
        "javascripts/count.js" # 访问计数脚本
    ]
    ```

=== "mkdocs.yml"
    ```yaml
    extra_javascript:
      - assets/js/counter.js # 访问计数脚本
    ```

### 3. 插入展示 HTML

为了美观，建议通过 **Overrides** 机制将统计显示在页脚。

!!! note "设置模板覆盖"
    要添加新模板或覆盖现有模板的部分内容，首先需要配置 custom_dir 设置，使其指向存储模板覆盖文件的目录：

    === "zensical.toml"
        ```toml
        [project.theme]
        custom_dir = "overrides"
        ```

    === "mkdocs.yml"
        ```yaml
        theme:
          custom_dir: overrides
        ```

    `custom_dir` 路径相对于您的配置文件进行解析。

创建 `overrides/partials/footer.html` (如果不存在则新建文件夹)，内容如下：

```html
<!--
  Copyright (c) 2016-2025 Martin Donath <martin.donath@squidfunk.com>

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to
  deal in the Software without restriction, including without limitation the
  rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
  sell copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NON-INFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
  FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
  IN THE SOFTWARE.
-->

<!-- Footer -->
<footer class="md-footer">

  <!-- Link to previous and/or next page -->
  {% if "navigation.footer" in features %}
    {% if page.previous_page or page.next_page %}
      {% if page.meta and page.meta.hide %}
        {% set hidden = "hidden" if "footer" in page.meta.hide %}
      {% endif %}
      <nav
        class="md-footer__inner md-grid"
        aria-label="{{ lang.t('footer') }}"
        {{ hidden }}
      >

        <!-- Link to previous page -->
        {% if page.previous_page %}
          {% set direction = lang.t("footer.previous") %}
          <a
            href="{{ page.previous_page.url | url }}"
            class="md-footer__link md-footer__link--prev"
            aria-label="{{ direction }}: {{ page.previous_page.title | e }}"
          >
            <div class="md-footer__button md-icon">
              {% set icon = config.theme.icon.previous or "material/arrow-left" %}
              {% include ".icons/" ~ icon ~ ".svg" %}
            </div>
            <div class="md-footer__title">
              <span class="md-footer__direction">
                {{ direction }}
              </span>
              <div class="md-ellipsis">
                {{ page.previous_page.title }}
              </div>
            </div>
          </a>
        {% endif %}

        <!-- Link to next page -->
        {% if page.next_page %}
          {% set direction = lang.t("footer.next") %}
          <a
            href="{{ page.next_page.url | url }}"
            class="md-footer__link md-footer__link--next"
            aria-label="{{ direction }}: {{ page.next_page.title | e }}"
          >
            <div class="md-footer__title">
              <span class="md-footer__direction">
                {{ direction }}
              </span>
              <div class="md-ellipsis">
                {{ page.next_page.title }}
              </div>
            </div>
            <div class="md-footer__button md-icon">
              {% set icon = config.theme.icon.next or "material/arrow-right" %}
              {% include ".icons/" ~ icon ~ ".svg" %}
            </div>
          </a>
        {% endif %}
      </nav>
    {% endif %}
  {% endif %}

  <!-- Further information -->
  <div class="md-footer-meta md-typeset">
    <div class="md-footer-meta__inner md-grid">
      {% include "partials/copyright.html" %}

      <!-- Site Visits -->
      <style>
      .site-visit-count {
        padding: 0 12px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 0.65rem;
        color: var(--md-default-fg-color);
      }
      </style>
      <div class="site-visit-count">
        本站访问量：<span id="site_pv">--</span>&nbsp;| 当前页浏览量：<span id="page_pv">--</span>
      </div>

      <!-- Social links -->
      {% if config.extra.social %}
        {% include "partials/social.html" %}
      {% endif %}
    </div>
  </div>
</footer>
```


## 📊 第三步：管理与维护

部署完成后，直接访问你的 EdgeOne Pages 域名（例如 `https://example.edgeone.dev`），你将看到一个精美的可视化仪表盘。

1.  **登录**：输入在环境变量中设置的 `DASHBOARD_PWD`。
2.  **功能**：
    - **Dashboard**：查看全站 PV 趋势。
    - **Pages Management**：搜索特定文章路径，查看单篇阅读量。
    - **Edit/Delete**：如果某篇文章改名了，你可以手动修改旧路径的 PV 数值，或者删除测试数据。

> **💡 设计哲学说明**：
> 当你在后台删除某个子页面的数据时，**全站总 PV (`site_total_pv`) 会同步扣减**。
> 但当你**修改**某个子页面的 PV 时，**全站总 PV 不会自动变化**。这是因为全站 PV 代表的是历史累计点击，而子页面 PV 修正通常是为了数据对齐或迁移，两者在逻辑上是解耦的。

## 🎉 结语

通过 EO-Counter，我们成功地将博客的访问统计权收回到了自己手中。如果你正在寻找网站统计分析的解决方案，不妨试试这个 **EO-Counter** ！

欢迎在评论区分享你的部署体验，或在 GitHub 上为项目点星！🌟

## 番外：使用 Cloudflare Workers 为 Zensical 站点引入访问统计

### 接入步骤
1. 与上文 [引入统计脚本](#1)步骤相同，注意将`WORKER_URL`替换为`Cloudflare Worker`访问地址。
2. 与上文 [修改配置文件](#2)步骤相同。
3. 与上文 [插入展示 HTML](#3-html)步骤相同。
4. 创建一个`Cloudflare Worker`项目，绑定KV存储，KV空间`Variable name`设置为`COUNTER_DB`，点击`Edit code`，清空原有的代码，将以下代码填入：
```js
export default {
  async fetch(request, env, ctx) {
    // === 配置允许的域名 ===
    // 建议同时加上 localhost，否则你在本地调试时会报错跨域，或者统计不到数据
    // 如果你只想在线上生效，可以去掉 localhost 的那一行
    const ALLOWED_ORIGINS = [
      "https://example.com",           // 你的线上博客地址
      "https://www.example.com",       // 兼容www
      "http://127.0.0.1:8000",         // 本地预览地址
      "http://localhost:8000"          // 备用本地地址
    ];

    // 获取请求来源 (Origin 主要是 fetch 请求会自动带上)
    const origin = request.headers.get("Origin");
    
    // === 1. 安全检查与 CORS 设置 ===
    
    // 默认禁止
    let allowOrigin = null;

    // 如果请求携带了 Origin 头，检查它是否在白名单里
    if (origin && ALLOWED_ORIGINS.includes(origin)) {
      allowOrigin = origin;
    } else if (!origin) {
      // 部分请求可能没有 Origin (比如直接在浏览器地址栏输入)，
      // 这里的策略是：如果没有 Origin，为了安全通常可以选择拒绝，
      // 但为了方便测试，这里暂时放行，或者你可以检查 Referer。
      // 严格模式下，建议保持 null。
      
      // 简单的防盗链：检查 Referer (引用页)
      const referer = request.headers.get("Referer");
      if (referer && referer.startsWith("https://sufine.top")) {
         // 如果 Referer 是你的域名，也允许，CORS 头设为你的域名
         allowOrigin = "https://sufine.top";
      }
    }

    // 准备返回的 Header
    const corsHeaders = {
      // 动态设置 Allow-Origin，如果不在白名单就设为 null 或不返回该头
      "Access-Control-Allow-Origin": allowOrigin || "null", 
      "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
      "Access-Control-Max-Age": "86400",
    };

    // 如果不在白名单，且不是 OPTIONS 预检请求，直接拒绝 (返回 403 Forbidden)
    if (!allowOrigin && request.method !== "OPTIONS") {
      // 只有当 origin 存在且不在白名单时才拒绝。
      // 如果完全没有 origin (比如 curl)，视你的安全需求决定是否拦截。
      // 这里为了防止被滥用，如果 origin 存在但不匹配，直接拦截。
      if (origin) {
        return new Response("Forbidden: Origin not allowed", { status: 403 });
      }
    }

    // 处理 OPTIONS 预检请求
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    // === 2. 获取文章路径 ===
    const url = new URL(request.url);
    const pagePath = url.searchParams.get("url");

    if (!pagePath) {
      return new Response("Error: Missing url parameter", { 
        status: 400, 
        headers: corsHeaders 
      });
    }

    // === 3. 读取数据库 ===
    const TOTAL_KEY = "TOTAL_VIEWS";
    let totalViews = await env.COUNTER_DB.get(TOTAL_KEY);
    let pageViews = await env.COUNTER_DB.get(pagePath);

    if (!totalViews) totalViews = 0;
    if (!pageViews) pageViews = 0;

    // === 4. 数字 +1 ===
    totalViews = parseInt(totalViews) + 1;
    pageViews = parseInt(pageViews) + 1;

    // === 5. 存回数据库 ===
    ctx.waitUntil(env.COUNTER_DB.put(TOTAL_KEY, totalViews.toString()));
    ctx.waitUntil(env.COUNTER_DB.put(pagePath, pageViews.toString()));

    // === 6. 返回结果 ===
    const result = {
      total: totalViews,
      page: pageViews
    };

    return new Response(JSON.stringify(result), {
      headers: { 
        "Content-Type": "application/json",
        ...corsHeaders 
      },
    });
  },
};
```
将自己的站点域名填入 `ALLOWED_ORIGINS` 变量中。

至此，所有的步骤都已经完成了，理想情况应该可以在站点页脚看到访问统计数据。

### 提示事项

!!! note ""
    注意，Cloudflare 的 Workers KV API 存在每日1000次的写入限额（免费版）。

    基于 Cloudflare 的站点统计方案未做可视化后台监控屏，数据管理需要使用官网 Workers KV 面板。