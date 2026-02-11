// 网站计数器，PV统计
// docs/javascripts/count.js

(function() {
  // === 云端 Worker API 地址 ===
  const WORKER_URL = "https://eocount.9420000.xyz/api/visit";

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