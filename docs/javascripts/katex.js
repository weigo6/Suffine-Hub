document$.subscribe(({ body }) => {
  const delimiters = [
    { left: "$$", right: "$$", display: true },
    { left: "$", right: "$", display: false },
    { left: "\\(", right: "\\)", display: false },
    { left: "\\[", right: "\\]", display: true }
  ]

  // Only render math protected by Arithmatex during Markdown conversion.
  body.querySelectorAll(".arithmatex").forEach((element) => {
    if (!element.querySelector(".katex")) {
      renderMathInElement(element, { delimiters })
    }
  })
})
