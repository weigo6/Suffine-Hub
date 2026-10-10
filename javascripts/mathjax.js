// 数学公式配置
// docs/javascripts/mathjax.js

window.MathJax = {
    tex: {
      inlineMath: [["\\(", "\\)"],["$", "$"]],
      displayMath: [["\\[", "\\]"],["$$", "$$"]],
      processEscapes: true,
      processEnvironments: true
    },
    options: {
      ignoreHtmlClass: "code",
      processHtmlClass: "arithmatex"
    }
  };
  
  document$.subscribe(() => { 
    MathJax.startup.output.clearCache()
    MathJax.typesetClear()
    MathJax.texReset()
    MathJax.typesetPromise()
  })