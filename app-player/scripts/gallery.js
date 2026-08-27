/* ============================================
   VideoVault — Gallery
   ============================================ */

function buildCard(entry, i) {
    const card = document.createElement("div");
    card.className = "card";
    card.dataset.id = entry.id;
    card.style.animationDelay = i * 0.025 + "s";
    card.title = entry.name;

    // Thumbnail
    const thumb = document.createElement("div");
    thumb.className = "card-thumb";
    if (entry.thumb) {
        const img = document.createElement("img");
        img.src = entry.thumb;
        img.alt = entry.title;
        img.loading = "lazy";
        img.draggable = false;
        thumb.appendChild(img);
    } else if (entry.isLink) {
        const fb = document.createElement("div");
        fb.className = "card-fallback";
        fb.innerHTML =
            '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" opacity="0.3">' +
            '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>' +
            '<path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>' +
            "</svg>";
        fb.title = "Web link";
        thumb.appendChild(fb);
    } else {
        const skel = document.createElement("div");
        skel.className = "card-skeleton";
        thumb.appendChild(skel);
        thumbObserver.observe(card);
    }

    // Play overlay
    const playOv = document.createElement("div");
    playOv.className = "card-play";
    playOv.innerHTML =
        '<div class="card-play-circle">' +
        '<svg width="20" height="20" viewBox="0 0 24 24" fill="#fff"><polygon points="8,5 20,12 8,19"/></svg>' +
        "</div>";
    thumb.appendChild(playOv);

    // Now-playing indicator
    const np = document.createElement("div");
    np.className = "card-now-playing";
    np.innerHTML =
        '<div class="now-playing-bars"><span></span><span></span><span></span><span></span></div>Playing';
    thumb.appendChild(np);

    // Progress bar
    const prog = document.createElement("div");
    prog.className = "card-progress";
    const progFill = document.createElement("div");
    progFill.className = "card-progress-fill";
    const savedProg = loadProgress(entry.id);
    if (savedProg > 0) progFill.style.width = savedProg + "%";
    prog.appendChild(progFill);

    // Watched badge
    if (isWatched(entry.name)) {
        const watchedBadge = document.createElement("div");
        watchedBadge.className = "card-watched-badge";
        watchedBadge.title = "Watched";
        watchedBadge.innerHTML =
            '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">' +
            '<polyline points="20 6 9 17 4 12"/>' +
            "</svg>";
        thumb.appendChild(watchedBadge);
    }

    // Favorite button
    const favBtn = document.createElement("button");
    favBtn.className = "card-fav" + (isFav(entry.name) ? " faved" : "");
    favBtn.title = "Toggle favorite";
    favBtn.setAttribute("aria-label", "Toggle favorite");
    favBtn.innerHTML =
        '<svg class="fav-icon-empty" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
        '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>' +
        "</svg>" +
        '<svg class="fav-icon-filled" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
        '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>' +
        "</svg>";
    favBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const nowFav = toggleFav(entry.name);
        favBtn.classList.toggle("faved", nowFav);
        updatePlayerFavBtn();
    });
    thumb.appendChild(favBtn);

    // Info
    const info = document.createElement("div");
    info.className = "card-info";
    const titleEl = document.createElement("div");
    titleEl.className = "card-title";
    titleEl.textContent = entry.title;
    const metaEl = document.createElement("div");
    metaEl.className = "card-meta";
    if (entry.isRTSP) {
        const badge = document.createElement("span");
        badge.className = "card-ext";
        badge.textContent = "RTSP";
        metaEl.appendChild(badge);
    } else if (entry.isHTTP) {
        const badge = document.createElement("span");
        badge.className = "card-ext";
        badge.textContent = "HTTP";
        metaEl.appendChild(badge);
    } else if (entry.isYouTube) {
        const badge = document.createElement("span");
        badge.className = "card-ext";
        badge.textContent = "YouTube";
        metaEl.appendChild(badge);
    } else if (entry.ext) {
        const extBadge = document.createElement("span");
        extBadge.className = "card-ext";
        extBadge.textContent = entry.ext;
        metaEl.appendChild(extBadge);
    }
    if (entry.duration > 0) {
        const dur = document.createElement("span");
        dur.textContent = fmtTime(entry.duration);
        metaEl.appendChild(dur);
    }
    if (entry.size) {
        const size = document.createElement("span");
        size.className = "card-size";
        size.textContent = fmtSize(entry.size);
        metaEl.appendChild(size);
    }
    info.appendChild(titleEl);
    info.appendChild(metaEl);

    card.appendChild(thumb);
    card.appendChild(prog);
    card.appendChild(info);
    card.addEventListener("click", () => playVideo(allVideos.indexOf(entry)));
    return card;
}

// ── Sort & Render ────────────────────────────
function sortAndRender(forceRebuild) {
    const q = searchInput.value.toLowerCase().trim();
    const sort = sortSelect.value;

    let list = [...allVideos];
    if (showFavoritesOnly)
        list = list.filter((v) => isFav(v.name));
    if (q)
        list = list.filter(
            (v) =>
                v.title.toLowerCase().includes(q) ||
                v.name.toLowerCase().includes(q) ||
                (v.folder && v.folder.toLowerCase().includes(q))
        );
    switch (sort) {
        case "az":
            list.sort((a, b) => a.title.localeCompare(b.title));
            break;
        case "za":
            list.sort((a, b) => b.title.localeCompare(a.title));
            break;
        case "newest":
            list.sort((a, b) => b.lastModified - a.lastModified);
            break;
        case "oldest":
            list.sort((a, b) => a.lastModified - b.lastModified);
            break;
    }

    noResults.classList.toggle("hidden", list.length > 0);
    galleryCount.textContent = list.length + " of " + allVideos.length;

    const newIds = list.map((e) => e.id);
    const listChanged =
        forceRebuild ||
        newIds.length !== renderedIds.length ||
        newIds.some((id, i) => id !== renderedIds[i]);

    const activeId = currentIndex >= 0 ? allVideos[currentIndex].id : -1;

    if (listChanged) {
        gallery.innerHTML = "";
        cardElements = {};

        const favEntries = [];
        const remaining = [];
        list.forEach((entry) => {
            if (isFav(entry.name)) {
                favEntries.push(entry);
            } else {
                remaining.push(entry);
            }
        });

        let cardIndex = 0;

        // Favorites group
        if (favEntries.length > 0) {
            const favGroup = document.createElement("div");
            favGroup.className = "folder-group fav-group";

            const favCollapsed = isFolderCollapsed("Favorites");
            if (favCollapsed) favGroup.classList.add("collapsed");

            const favHeader = document.createElement("div");
            favHeader.className = "folder-header fav-header folder-header-collapsible";
            favHeader.innerHTML =
                '<svg class="folder-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">' +
                '<polyline points="9 18 15 12 9 6"/>' +
                "</svg>" +
                '<svg class="folder-icon fav-heart-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
                '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>' +
                "</svg>" +
                '<span class="folder-name">Favorites</span>' +
                '<span class="folder-count fav-count">' +
                favEntries.length +
                " video" +
                (favEntries.length !== 1 ? "s" : "") +
                "</span>";

            favHeader.addEventListener("click", () => {
                const isNowCollapsed = toggleFolderCollapsed("Favorites");
                favGroup.classList.toggle("collapsed", isNowCollapsed);
            });

            favGroup.appendChild(favHeader);

            const favCards = document.createElement("div");
            favCards.className = "folder-cards";
            favEntries.forEach((entry) => {
                const card = buildCard(entry, cardIndex++);
                if (entry.id === activeId) card.classList.add("active");
                favCards.appendChild(card);
                cardElements[entry.id] = card;
            });
            favGroup.appendChild(favCards);
            gallery.appendChild(favGroup);
        }

        // Folder groups
        const groups = {};
        const groupOrder = [];
        remaining.forEach((entry) => {
            const folder = entry.folder || "All Videos";
            if (!groups[folder]) {
                groups[folder] = [];
                groupOrder.push(folder);
            }
            groups[folder].push(entry);
        });

        groupOrder.forEach((folderName) => {
            const entries = groups[folderName];
            const groupEl = document.createElement("div");
            groupEl.className = "folder-group";

            const collapsed = isFolderCollapsed(folderName);
            if (collapsed) groupEl.classList.add("collapsed");

            const header = document.createElement("div");
            header.className = "folder-header folder-header-collapsible";
            header.innerHTML =
                '<svg class="folder-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">' +
                '<polyline points="9 18 15 12 9 6"/>' +
                "</svg>" +
                '<svg class="folder-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
                '<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>' +
                "</svg>" +
                '<span class="folder-name">' + folderName + "</span>" +
                '<span class="folder-count">' +
                entries.length +
                " video" +
                (entries.length !== 1 ? "s" : "") +
                "</span>";
            if (entries[0] && entries[0].folderPath) {
                header.innerHTML +=
                    '<span class="folder-path" title="' +
                    entries[0].folderPath +
                    '">' +
                    entries[0].folderPath +
                    "</span>";
            }

            header.addEventListener("click", () => {
                const isNowCollapsed = toggleFolderCollapsed(folderName);
                groupEl.classList.toggle("collapsed", isNowCollapsed);
            });

            groupEl.appendChild(header);

            const cardsGrid = document.createElement("div");
            cardsGrid.className = "folder-cards";
            entries.forEach((entry) => {
                const card = buildCard(entry, cardIndex++);
                if (entry.id === activeId) card.classList.add("active");
                cardsGrid.appendChild(card);
                cardElements[entry.id] = card;
            });
            groupEl.appendChild(cardsGrid);
            gallery.appendChild(groupEl);
        });

        renderedIds = newIds;
    } else {
        // Diff update
        for (const id of renderedIds) {
            const card = cardElements[id];
            if (!card) continue;
            card.classList.toggle("active", id === activeId);
            const entry = allVideos.find((e) => e.id === id);
            if (entry) {
                const fill = card.querySelector(".card-progress-fill");
                if (fill) {
                    const pct = loadProgress(entry.id);
                    fill.style.width = pct > 0 ? pct + "%" : "0%";
                }
            }
        }
    }
}

// ── Player Fav & Watched UI ──────────────────
function updatePlayerFavBtn() {
    if (currentIndex < 0 || !allVideos[currentIndex]) {
        playerFavBtn.classList.remove("faved");
        return;
    }
    const entry = allVideos[currentIndex];
    const fav = isFav(entry.name);
    playerFavBtn.classList.toggle("faved", fav);
    playerFavBtn
        .querySelector(".fav-icon-empty")
        .classList.toggle("hidden", fav);
    playerFavBtn
        .querySelector(".fav-icon-filled")
        .classList.toggle("hidden", !fav);
}

function updatePlayerWatchedBadge() {
    if (currentIndex < 0 || !allVideos[currentIndex]) {
        playerWatchedBadge.classList.add("hidden");
        return;
    }
    const entry = allVideos[currentIndex];
    playerWatchedBadge.classList.toggle("hidden", !isWatched(entry.name));
}
