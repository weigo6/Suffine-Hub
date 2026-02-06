/* ASK AI按钮自动避让页脚 */
document.addEventListener("DOMContentLoaded", function () {
    // 按钮避让页脚逻辑 (Footer Avoidance Logic)
    function updateButtonPosition() {
        const footer = document.querySelector(".md-footer") || document.querySelector("footer");
        if (!footer) return;

        const footerRect = footer.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const distanceToFooter = viewportHeight - footerRect.top;

        // 基础底部距离 (Base bottom offset)
        const baseBottom = 20;
        let newBottom = baseBottom;

        if (distanceToFooter > 0) {
            newBottom = baseBottom + distanceToFooter;
        }

        // 更新 Ask AI 按钮位置
        const askAiToggle = document.getElementById("ask-ai-toggle");
        if (askAiToggle) {
            askAiToggle.style.bottom = `${newBottom}px`;
        }
    }

    window.addEventListener("scroll", updateButtonPosition);
    window.addEventListener("resize", updateButtonPosition);
    
    // 初始化检查 (延时一小段时间以确保动态元素已加载)
    setTimeout(updateButtonPosition, 100);
});
