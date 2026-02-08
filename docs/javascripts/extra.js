/* ASK AI按钮和音乐控制按钮与播放器自动避让页脚 */
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
        let offset = 0;

        if (distanceToFooter > 0) {
            offset = distanceToFooter;
        }

        // 更新 Ask AI 按钮位置
        const askAiToggle = document.getElementById("ask-ai-toggle");
        if (askAiToggle) {
            askAiToggle.style.bottom = `${baseBottom + offset}px`;
        }
        
        // 更新音乐播放器按钮位置 (位于 Ask AI 上方 52px)
        const musicToggle = document.getElementById("music-player-toggle");
        if (musicToggle) {
            musicToggle.style.bottom = `${baseBottom + 52 + offset}px`;
        }
        
        // 更新音乐播放器容器位置
        const musicContainer = document.getElementById("music-player-container");
        if (musicContainer) {
            musicContainer.style.bottom = `${baseBottom + offset}px`;
        }
    }

    window.addEventListener("scroll", updateButtonPosition);
    window.addEventListener("resize", updateButtonPosition);
    
    // 初始化检查 (延时一小段时间以确保动态元素已加载)
    setTimeout(updateButtonPosition, 100);
});
