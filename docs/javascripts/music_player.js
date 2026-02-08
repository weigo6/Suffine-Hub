const MUSIC_ICON = `<svg viewBox="0 0 24 24"><path d="M12,3V12.26C11.5,12.09 11,12 10.5,12C8,12 6,14 6,16.5C6,19 8,21 10.5,21C13,21 15,19 15,16.5V6H19V3H12Z" /></svg>`;

document.addEventListener("DOMContentLoaded", function () {
    // Only initialize if the toggle button doesn't exist yet
    if (document.getElementById("music-player-toggle")) return;

    createMusicUI();
});

function createMusicUI() {
    // Create Toggle Button
    const toggleBtn = document.createElement("button");
    toggleBtn.id = "music-player-toggle";
    toggleBtn.title = "Music Player";
    toggleBtn.innerHTML = MUSIC_ICON;
    document.body.appendChild(toggleBtn);

    // Create Player Container
    const playerContainer = document.createElement("div");
    playerContainer.id = "music-player-container";
    
    // Create MetingJS Element
    // Defaulting to a chill playlist. User can change ID here.
    const metingElement = document.createElement("meting-js");
    metingElement.setAttribute("server", "netease");
    metingElement.setAttribute("type", "playlist");
    metingElement.setAttribute("id", "17741904561"); // 网易云 Playlist ID
    metingElement.setAttribute("fixed", "false");
    metingElement.setAttribute("mini", "false");
    metingElement.setAttribute("autoplay", "false");
    metingElement.setAttribute("list-folded", "true");
    metingElement.setAttribute("theme", "#2980b9");
    metingElement.setAttribute("volume", "0.7");
    metingElement.setAttribute("preload", "none");
    
    playerContainer.appendChild(metingElement);
    document.body.appendChild(playerContainer);

    // Toggle Logic
    toggleBtn.addEventListener("click", () => {
        playerContainer.classList.toggle("show");
        toggleBtn.classList.toggle("active");
    });
}
