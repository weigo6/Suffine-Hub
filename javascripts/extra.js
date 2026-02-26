/* ASK AI按钮和音乐控制按钮与播放器自动避让页脚 */
document.addEventListener("DOMContentLoaded", function () {
    // 按钮避让页脚逻辑 (Footer Avoidance Logic)
    function updateFooterAvoidance() {
        // 获取所有元素
        const askAiToggle = document.getElementById("ask-ai-toggle");
        const musicToggle = document.getElementById("music-player-toggle");
        const musicContainer = document.getElementById("music-player-container");
        
        // 宽度 <= 720px 时，不避让页脚，且恢复默认位置
        if (window.innerWidth <= 720) {
            if (askAiToggle) askAiToggle.style.bottom = ''; // Revert to CSS default
            if (musicToggle) musicToggle.style.bottom = ''; // Revert to CSS default
            if (musicContainer) musicContainer.style.bottom = ''; // Revert to CSS default
            return;
        }

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
        if (askAiToggle) {
            askAiToggle.style.bottom = `${baseBottom + offset}px`;
        }
        
        // 更新音乐播放器按钮位置 (位于 Ask AI 上方 52px)
        if (musicToggle) {
            musicToggle.style.bottom = `${baseBottom + 52 + offset}px`;
        }
        
        // 更新音乐播放器容器位置
        if (musicContainer) {
            musicContainer.style.bottom = `${baseBottom + offset}px`;
        }
    }

    window.addEventListener("scroll", updateFooterAvoidance);
    window.addEventListener("resize", updateFooterAvoidance);
    
    // 初始化检查 (延时一小段时间以确保动态元素已加载)
    setTimeout(updateFooterAvoidance, 100);

    // AI Chat & Music Player Conflict Resolution (Observer Pattern)
    function updatePlayerVisibility() {
        const chatWindow = document.getElementById("ask-ai-window");
        if (!chatWindow) {
            // Retry if not found yet (e.g. if ask_ai.js loads slower)
            setTimeout(updatePlayerVisibility, 100);
            return;
        }

        const observer = new MutationObserver(() => {
            const isOpen = chatWindow.classList.contains("open");
            const musicToggleBtn = document.getElementById("music-player-toggle");
            const musicContainer = document.getElementById("music-player-container");

            if (isOpen) {
                // Hide Music Player
                if (musicToggleBtn) {
                    musicToggleBtn.style.display = 'none';
                    musicToggleBtn.classList.remove("active");
                }
                if (musicContainer && musicContainer.classList.contains("show")) {
                    musicContainer.classList.remove("show");
                }
            } else {
                // Show Music Player
                if (musicToggleBtn) {
                    musicToggleBtn.style.display = '';
                }
            }
        });

        observer.observe(chatWindow, {
            attributes: true,
            attributeFilter: ['class']
        });
    }

    updatePlayerVisibility();
});
