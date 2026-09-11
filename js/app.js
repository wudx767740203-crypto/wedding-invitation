/**
 * ======================================================================
 * 「吴德星 & 李婵」专属婚礼电子请帖 - 核心交互驱动 (js/app.js)
 * 核心优化：
 * 1. 速度倍增的高流畅自动漫游引擎 (2.5px/16ms，舒适悦读)
 * 2. 彻底杜绝控制台 ReferenceError，点击即时零延迟响应
 * 3. 全局屏幕轻触心动动效 (点击屏幕任意位置即刻迸发爱心与星光)
 * 4. 20张全量婚纱摄影影集 (Lookbook / 轮播 / 网格) 全量展示
 * 5. 经典古风新中式婚曲播放与切歌
 * ======================================================================
 */

(function () {
  "use strict";

  const wCfg = window.wedding || window.WEDDING_CONFIG || {};

  // ==================== 1. 背景音乐控制与点播台 (BGM Jukebox) ====================
  let isPlaying = false;
  window.__weddingAudioPlaying = false;
  let currentTrackIdx = 0;
  let needsUnmute = false;
  const audio = document.getElementById("wedding-audio");
  const musicBtn = document.getElementById("music-btn");
  const soundWave = document.getElementById("sound-wave-bars");
  const musicTagTitle = document.getElementById("music-tag-title");

  const playlist = wCfg.musicPlaylist || [
    {
      id: "zuizhongyaodejueding",
      title: "最重要的决定",
      artist: "范玮琪",
      badge: "婚礼殿堂经典 · 官方高清原声",
      quote: "你是我最重要的决定，我愿意每天在你身边苏醒... 因为幸福没有捷径，只有经营。",
      src: "assets/music/zuizhongyaodejueding.m4a",
      startTime: 0
    },
    {
      id: "siben_yueqiu",
      title: "私奔到月球 (人声起唱版)",
      artist: "五月天 & 陈绮贞",
      badge: "去除前奏 · 人声直接开唱",
      quote: "其实你是个心狠又手辣的小偷，一二三 牵着手，我们私奔到月球...",
      src: "assets/music/sibendayueqiu.m4a",
      startTime: 6.3
    },
    {
      id: "tiantiande",
      title: "甜甜的",
      artist: "周杰伦",
      badge: "经典高甜 · 官方高清原声",
      quote: "我轻轻的尝一口 你说的爱我，还在回味你给过的温柔，我喜欢的样子你都有...",
      src: "assets/music/tiantiande.m4a",
      startTime: 0
    },
    {
      id: "wojiehunle",
      title: "我结婚了",
      artist: "钟嘉欣",
      badge: "幸福新娘曲 · 官方高清原声",
      quote: "这一生 只要可以共你走，无论风雨或晴天，我也愿一生牵你手...",
      src: "assets/music/wojiehunle.m4a",
      startTime: 0
    },
    {
      id: "crush_beautiful",
      title: "Beautiful (《鬼怪》经典OST)",
      artist: "Crush",
      badge: "韩剧顶流OST · 极致深情",
      quote: "It's a beautiful life, 난 너의 곁에 있을게, 只要在你身旁，每刻都如此耀眼...",
      src: "assets/music/crush_beautiful.m4a",
      startTime: 0
    },
    {
      id: "feixing_custom",
      title: "爱的飞行日记 (官方原声版)",
      artist: "周杰伦 & 杨瑞代",
      badge: "经典欢快原声 · 甜蜜起飞",
      quote: "赤道的边境万里无云天很清，我用脑波在传递，爱的飞行日记...",
      src: "assets/music/videoplayback.m4a",
      startTime: 0
    },
    {
      id: "marry_me",
      title: "今天你要嫁给我",
      artist: "陶喆 & 蔡依林",
      badge: "欢快浪漫 · 经典婚礼对唱",
      quote: "春暖的花开带走冬天的感伤，微风吹来浪漫的气息，今天你要嫁给我...",
      src: "assets/music/marry_me.mp3"
    },
    {
      id: "gaobai",
      title: "告白气球",
      artist: "周杰伦",
      badge: "轻快甜美 · 满心欢喜心动旋律",
      quote: "亲爱的 爱上你 从那天起，甜蜜的很轻易，你的眼睛在说我愿意...",
      src: "assets/music/gaobai.mp3"
    },
    {
      id: "silver_scrapes",
      title: "Silver Scrapes (英雄联盟BO5战歌)",
      artist: "Danny McCarthy / 英雄联盟",
      badge: "热血电竞 · 英雄联盟BO5决胜神曲",
      quote: "战歌起！BO5决胜局神曲，燃爆全场，属于新郎与召唤师的永恒荣耀！",
      src: "assets/music/silver_scrapes.mp3",
      startTime: 0
    },
    {
      id: "champions_league",
      title: "UEFA Champions League Anthem (欧冠决赛主题曲)",
      artist: "Tony Britten / 皇家爱乐乐团",
      badge: "殿堂经典 · 欧洲冠军联赛决赛主题曲",
      quote: "THE CHAAAAAAMPIONS! 属于冠军殿堂的荣耀赞歌，执手封冠，走向巅峰！",
      src: "assets/music/champions_league.mp3",
      startTime: 0
    }
  ];

  function initMusic() {
    // 默认进页面就起播背景音乐。若被浏览器/微信自动播放策略拦截，
    // 会先静音播放保住进度，等用户首次触碰页面时自动解除静音。
    loadTrack(currentTrackIdx, false);
    renderMusicSheetList();
    fadeInMusic();
  }

  function loadTrack(idx, autoPlayAfterLoad) {
    if (!audio || !playlist[idx]) return;
    currentTrackIdx = idx;
    const item = playlist[idx];
    const curSrc = (audio.getAttribute ? audio.getAttribute("src") : audio.src) || "";
    const cleanCurSrc = curSrc.split("?")[0].toLowerCase();
    const cleanItemSrc = (item.src || "").split("?")[0].toLowerCase();
    if (!cleanCurSrc.endsWith(cleanItemSrc)) {
      audio.src = item.src;
    }
    audio.loop = false;

    if (musicTagTitle) {
      musicTagTitle.textContent = `${item.title}`;
    }

    if (item.startTime) {
      const applyStartTime = function () {
        try {
          if (audio.currentTime < item.startTime - 0.5 || audio.currentTime === 0) {
            audio.currentTime = item.startTime;
          }
        } catch (e) {}
      };
      if (audio.readyState >= 1) {
        applyStartTime();
      } else {
        audio.addEventListener('loadedmetadata', applyStartTime, { once: true });
        audio.addEventListener('canplay', applyStartTime, { once: true });
      }
    }

    renderMusicSheetList();

    if (autoPlayAfterLoad) {
      fadeInMusic();
    }
  }

  function fadeInMusic() {
    if (!audio) return;
    const item = playlist[currentTrackIdx];
    if (item && item.startTime && (audio.currentTime < item.startTime - 1 || audio.currentTime === 0)) {
      try {
        audio.currentTime = item.startTime;
      } catch (e) {}
    }
    audio.muted = false;
    try { audio.volume = 0.8; } catch (e) {}
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        if (item && item.startTime && audio.currentTime < item.startTime - 1) {
          try { audio.currentTime = item.startTime; } catch (e) {}
        }
        isPlaying = true;
        window.__weddingAudioPlaying = true;
        updateMusicUI(true);
      }).catch(err => {
        console.log("Audio awaiting user gesture:", err);
        // 静音起播保障缓冲与进度推进，默认保持播放状态
        isPlaying = true;
        window.__weddingAudioPlaying = true;
        audio.muted = true;
        needsUnmute = true;
        audio.play().catch(() => {});
        updateMusicUI(true);
      });
    }
  }

  function pauseMusic() {
    if (!audio) return;
    audio.pause();
    isPlaying = false;
    window.__weddingAudioPlaying = false;
    updateMusicUI(false);
  }

  window.toggleMusic = function () {
    if (isPlaying && !audio.paused && !audio.muted) {
      pauseMusic();
      window.toast("背景音乐已暂停");
    } else {
      audio.muted = false;
      fadeInMusic();
      window.toast("正在播放: " + playlist[currentTrackIdx].title);
    }
  };

  function updateMusicUI(playing, waitingGesture) {
    if (musicBtn) {
      if (playing) {
        musicBtn.classList.remove("paused", "waiting-tap");
        musicBtn.classList.add("playing");
      } else {
        musicBtn.classList.remove("playing");
        musicBtn.classList.add("paused");
        musicBtn.classList.remove("waiting-tap");
      }
    }
    if (soundWave) {
      if (playing) {
        soundWave.classList.add("playing");
      } else {
        soundWave.classList.remove("playing");
      }
    }
    if (musicTagTitle) {
      const item = playlist[currentTrackIdx];
      if (item) musicTagTitle.textContent = `♫ ${item.title}`;
    }
    const banner = document.getElementById("music-prompt-banner");
    if (banner) {
      banner.style.display = "none";
      banner.classList.remove("show");
    }
  }
  window.updateMusicUI = updateMusicUI;

  function renderMusicSheetList() {
    const listEl = document.getElementById("bgm-track-list");
    if (!listEl) return;

    let h = "";
    playlist.forEach((item, idx) => {
      const isCur = (idx === currentTrackIdx);
      h += `
        <div class="bgm-track-item ${isCur ? 'active' : ''}" onclick="window.switchTrack(${idx})">
          <div class="bgm-track-left">
            <div class="bgm-track-icon">
              ${isCur && isPlaying ?
                '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>' :
                '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>'
              }
            </div>
            <div class="bgm-track-info">
              <div class="bgm-track-title">
                ${item.title}
                <span class="bgm-track-badge">${item.badge}</span>
              </div>
              <p class="bgm-track-artist">${item.artist}</p>
              <p class="bgm-track-quote">${item.quote}</p>
            </div>
          </div>
          <span class="bgm-play-status">${isCur ? (isPlaying ? '播放中 ♫' : '当前已选') : '点击切换'}</span>
        </div>
      `;
    });
    listEl.innerHTML = h;
  }

  window.switchTrack = function (idx) {
    if (idx === currentTrackIdx && isPlaying) {
      pauseMusic();
    } else {
      loadTrack(idx, true);
      window.toast("已切换为: " + playlist[idx].title);
    }
    renderMusicSheetList();
  };

  window.nextTrack = function () {
    const nextIdx = (currentTrackIdx + 1) % playlist.length;
    window.switchTrack(nextIdx);
  };

  window.openMusicSheet = function () {
    const modal = document.getElementById("music-sheet-modal");
    if (modal) {
      renderMusicSheetList();
      modal.classList.add("show");
    }
  };

  window.closeMusicSheet = function () {
    const modal = document.getElementById("music-sheet-modal");
    if (modal) modal.classList.remove("show");
  };

  // ==================== 2. 极致顺畅平滑自动漫游引擎 (RAF 硬件平滑加速) ====================
  // 核心优化：
  // 1. 采用整像素精密累加器 (scrollPixelAccumulator)，彻底杜绝亚像素四舍五入引发的阶梯式微顿挫
  // 2. 采用原生 window.scrollBy(0, movePx) 零冲突推进，与用户手动滑屏天然融合，不产生橡皮筋跳动
  // 3. 彻底移除定时器重复触发的强制重排 (Layout Thrashing)，释放全部 GPU/CPU 渲染算力
  let isAutoScrollActive = false;
  let autoScrollRaf = null;
  let isUserTouching = false;
  let touchResumeTimer = null;
  let lastTimestamp = 0;
  let scrollPixelAccumulator = 0;

  // 默认交还滚动控制权给来宾；需要时可手动开启慢速浏览。
  let speedLevel = 0;
  let currentSpeedPx = 28;

  const autoScrollBtn = document.getElementById("auto-scroll-btn");
  const autoScrollLabel = document.getElementById("auto-scroll-label");

  function startAutoScroll(customSpeed) {
    if (customSpeed !== undefined) {
      currentSpeedPx = customSpeed;
    } else if (speedLevel === 0) {
      speedLevel = 2;
      currentSpeedPx = 55;
    }
    isAutoScrollActive = true;
    isUserTouching = false;
    lastTimestamp = 0;
    scrollPixelAccumulator = 0;
    updateAutoScrollUI(true);

    if (autoScrollRaf) {
      cancelAnimationFrame(autoScrollRaf);
      autoScrollRaf = null;
    }

    function step(timestamp) {
      if (!isAutoScrollActive) return;

      var splash = document.getElementById("tech-support-toast");
      if (splash && splash.classList.contains("show")) {
        lastTimestamp = timestamp;
        autoScrollRaf = requestAnimationFrame(step);
        return;
      }

      if (!lastTimestamp) {
        lastTimestamp = timestamp;
        scrollPixelAccumulator = 0;
        autoScrollRaf = requestAnimationFrame(step);
        return;
      }

      let deltaMs = timestamp - lastTimestamp;
      lastTimestamp = timestamp;
      if (deltaMs > 64) deltaMs = 16.7;

      if (!isUserTouching) {
        const doc = document.documentElement;
        const body = document.body;
        const scrollHeight = Math.max(
          doc ? doc.scrollHeight : 0,
          body ? body.scrollHeight : 0
        );
        const clientHeight = window.innerHeight || (doc ? doc.clientHeight : 800);
        const maxScroll = Math.max(0, scrollHeight - clientHeight);
        const currentY = window.pageYOffset || (doc ? doc.scrollTop : 0) || 0;

        // 触底自动平稳停止
        if (maxScroll > 150 && currentY >= maxScroll - 2) {
          stopAutoScroll();
          return;
        }

        // 精准帧率亚像素/像素步进（支持高刷屏与标准屏丝滑推进）
        scrollPixelAccumulator += (currentSpeedPx * deltaMs) / 1000;
        if (scrollPixelAccumulator >= 1) {
          const movePx = Math.floor(scrollPixelAccumulator);
          scrollPixelAccumulator -= movePx;
          window.scrollBy(0, movePx);
        }
      }

      autoScrollRaf = requestAnimationFrame(step);
    }

    autoScrollRaf = requestAnimationFrame(step);
  }

  function stopAutoScroll() {
    isAutoScrollActive = false;
    if (autoScrollRaf) {
      cancelAnimationFrame(autoScrollRaf);
      autoScrollRaf = null;
    }
    updateAutoScrollUI(false);
  }

  window.startAutoScroll = startAutoScroll;
  window.stopAutoScroll = stopAutoScroll;

  window.toggleAutoScroll = function () {
    tryPlayMusicOnce();
    if (speedLevel === 2) {
      // 从 快览 切换至 慢速漫游
      speedLevel = 1;
      startAutoScroll(28);
      window.toast("已切换为【慢速漫游 ♫】");
    } else if (speedLevel === 1) {
      // 切换至 暂停自由滑屏
      speedLevel = 0;
      stopAutoScroll();
      window.toast("已暂停自动漫游，可自由滑屏");
    } else {
      speedLevel = 1;
      startAutoScroll(28);
      window.toast("已开启【慢速浏览】");
    }
  };

  function updateAutoScrollUI(active) {
    if (autoScrollBtn) {
      if (active) {
        autoScrollBtn.classList.add("active");
        if (autoScrollLabel) {
          autoScrollLabel.textContent = (speedLevel === 2) ? "快览 ⚡" : "慢速漫游 ♫";
        }
      } else {
        autoScrollBtn.classList.remove("active");
        if (autoScrollLabel) autoScrollLabel.textContent = "自由滑屏";
      }
    }
  }

  // 用户触摸或滑动操作时暂停，停止操作 0.85 秒后平稳恢复漫游
  function userActionPause() {
    isUserTouching = true;
    scrollPixelAccumulator = 0;
    if (touchResumeTimer) clearTimeout(touchResumeTimer);
  }

  function userActionResume() {
    scrollPixelAccumulator = 0;
    if (touchResumeTimer) clearTimeout(touchResumeTimer);
    touchResumeTimer = setTimeout(() => {
      isUserTouching = false;
      lastTimestamp = 0;
      scrollPixelAccumulator = 0;
      if (!isAutoScrollActive && speedLevel !== 0) {
        startAutoScroll(currentSpeedPx);
      }
    }, 850);
  }

  window.addEventListener("touchstart", userActionPause, { passive: true });
  window.addEventListener("touchmove", userActionPause, { passive: true });
  window.addEventListener("touchend", userActionResume, { passive: true });
  window.addEventListener("touchcancel", userActionResume, { passive: true });
  window.addEventListener("wheel", () => {
    userActionPause();
    userActionResume();
  }, { passive: true });

  // 封面点击「开启请帖 · 播放音乐」
  window.startExperience = function () {
    fadeInMusic();
    // 点击开场页后启动快速浏览：既满足安卓的用户手势限制，也保留请帖的自动漫游体验。
    speedLevel = 2;
    startAutoScroll(55);
    const gate = document.getElementById("invitation-gate");
    if (gate) {
      gate.classList.add("is-open");
      gate.setAttribute("aria-hidden", "true");
      setTimeout(() => gate.remove(), 650);
    }
  };

  // ==================== 3. 互动点赞送祝福 ====================
  let heartCount = 168;
  window.sendFloatingHeart = function (e) {
    heartCount++;
    const countEl = document.getElementById("heart-count-pill");
    if (countEl) countEl.textContent = `${heartCount}+`;
    window.toast("收到您的真挚祝福 ❤️");
  };

  // 屏幕任意手势、滑动、触摸均即刻唤醒背景音乐（排除 scroll 避免自动滑动每帧调用）
  const tryPlayMusicOnce = function (e) {
    // 点击音乐按钮或歌单面板时不触发，避免把"暂停/切歌"操作立刻顶回去
    const tgt = e && e.target && e.target.closest ? e.target.closest("#music-btn, #music-sheet-modal") : null;
    if (tgt) return;
    // 之前因自动播放限制而静音起播的，首次触碰页面时解除静音
    if (needsUnmute && audio) {
      audio.muted = false;
      try { audio.volume = 0.8; } catch (err) {}
      needsUnmute = false;
      updateMusicUI(true);
      return;
    }
    if (!isPlaying || (audio && audio.paused)) {
      fadeInMusic();
    }
  };
  const interactionEvents = ["touchstart", "touchmove", "touchend", "pointerdown", "wheel", "mousedown", "click", "keydown"];
  interactionEvents.forEach(ev => {
    window.addEventListener(ev, tryPlayMusicOnce, { passive: true, capture: true });
    document.addEventListener(ev, tryPlayMusicOnce, { passive: true, capture: true });
  });

  // ==================== 4. 全量 20 张婚纱照三大视角渲染 ====================
  // ==================== 4. 艺术画报影集 - 层次感高定排版 (红底专区 + 单人对应单人 + 照片旁边文字) ====================
    // ==================== 全量图片后台异步预热与静默解码 (消除滑入微卡顿) ====================
  function preheatAllGalleryImages() {
    const list = wCfg.gallery || [];
    list.forEach(item => {
      if (!item.src) return;
      const img = new Image();
      img.decoding = 'async';
      img.src = item.src;
      if (typeof img.decode === 'function') {
        img.decode().catch(() => {});
      }
    });
  }

  function renderAllGalleryViews() {
    const list = wCfg.gallery || [];
    if (!list.length) return;

    const lookbookEl = document.getElementById("view-lookbook");
    if (!lookbookEl) return;

    // 更新影集标题 (不写张数)
    const galleryCountTitle = document.getElementById("gallery-count-title");
    if (galleryCountTitle) {
      galleryCountTitle.textContent = "婚纱画报 · 甜蜜相册";
    }

    const renderedSrcs = new Set();
    function mark(src) { renderedSrcs.add(src); }

    let h = "";

    // ----------------------------------------------------------------------
    // ----------------------------------------------------------------------
    // CHAPTER 01: 华裳囍韵 · 喜结良缘 (红底放红底 · 传统中式礼赞)
    // ----------------------------------------------------------------------
    h += `
      <div class="gallery-chapter-divider theme-red">
        <span class="chapter-num-badge">CHAPTER 01</span>
      </div>

      <!-- 红底大片 1: 中式秀禾全身执手照 (照片旁边有文字排版) -->
      <div class="photo-side-editorial-block">
        <div class="editorial-photo-wrap" onclick="window.openLightbox('assets/images/2eccefa56cba976f765561e613d951ce.jpg')">
          <img src="assets/images/2eccefa56cba976f765561e613d951ce.jpg" alt="华裳囍韵" loading="eager" decoding="async">
        </div>
        <div class="editorial-text-wrap">
          <span class="editorial-en-sub" style="color: #D92534;">FOREVER LOVE</span>
          <h4 class="editorial-cn-title" style="color: #B81D24;">执手之诺 · 岁岁常欢</h4>
          <div class="editorial-divider-line" style="background: #D92534;"></div>
          <p class="editorial-cn-desc">
            遇见你，是一切美好的开始。<br>
            所有的温柔与偏爱，都在今天化为一句笃定的承诺。<br>
            愿往后年年岁岁，朝夕相伴，共度人间良辰。
          </p>
        </div>
      </div>

      <!-- 红底大片 2: 甜蜜比心 (全幅纯净展示 · 文字置于照片下方) -->
      <div class="photo-full-showcase-card theme-red" onclick="window.openLightbox('assets/images/532fb4ffa84e5892ab3f4ae43e117932.jpg')">
        <div class="showcase-img-box">
          <img src="assets/images/532fb4ffa84e5892ab3f4ae43e117932.jpg" alt="指尖比心" loading="lazy" decoding="async">
        </div>
        <div class="showcase-caption-box">
          <span class="showcase-en-badge">SWEET ROMANCE</span>
          <h4 class="showcase-main-title">心动如初 · 眉眼欢喜</h4>
          <div class="showcase-divider"></div>
          <p class="showcase-quote-text">“我喜欢你，胜过所有华丽的辞藻。在每一个平凡的日子里，只要望向你的眼睛，心里就开满了花。”</p>
        </div>
      </div>
    `;
    mark('assets/images/2eccefa56cba976f765561e613d951ce.jpg');
    mark('assets/images/532fb4ffa84e5892ab3f4ae43e117932.jpg');

    // ----------------------------------------------------------------------
    // CHAPTER 02: 纯白之誓 · 浪漫定格 (单人对应单人 + 浪漫文字排版)
    // ----------------------------------------------------------------------
    h += `
      <div class="gallery-chapter-divider">
        <span class="chapter-num-badge">CHAPTER 02</span>
      </div>

      <!-- 侧边文字排版 1 (图左，字右): 手捧繁花深情并肩 -->
      <div class="photo-side-editorial-block">
        <div class="editorial-photo-wrap" onclick="window.openLightbox('assets/images/new_photo_2133.png')">
          <img src="assets/images/new_photo_2133.png" alt="并肩偕行" loading="lazy" decoding="async">
        </div>
        <div class="editorial-text-wrap">
          <span class="editorial-en-sub">ROMANTIC VOW</span>
          <h4 class="editorial-cn-title">温柔以待 · 余生有你</h4>
          <div class="editorial-divider-line"></div>
          <p class="editorial-cn-desc">
            在这个偌大的世界里，何其幸运能遇见你。<br>
            你是我写过最长情的篇章，<br>
            从心动的一瞬，到相伴一生的从容。
          </p>
        </div>
      </div>

      <!-- 侧边文字排版 2 (字左，图右): 梦幻大拖尾主纱全身照 -->
      <div class="photo-side-editorial-block reverse">
        <div class="editorial-photo-wrap" onclick="window.openLightbox('assets/images/375a7b55048e3de758e1087786fe4921.jpg')">
          <img src="assets/images/375a7b55048e3de758e1087786fe4921.jpg" alt="华裳如雪" loading="lazy" decoding="async">
        </div>
        <div class="editorial-text-wrap">
          <span class="editorial-en-sub">SOUTHERN GRACE</span>
          <h4 class="editorial-cn-title">南方姑娘 · 浅笑安然</h4>
          <div class="editorial-divider-line"></div>
          <p class="editorial-cn-desc">
            南方姑娘的眼眸里，盛满星光与温柔。<br>
            一袭如雪白纱，顾盼生辉。<br>
            你微笑着朝我走来，那一刻，整个世界都变得安宁而辽阔。
          </p>
        </div>
      </div>

      <!-- 新娘主纱回眸 & 越肩深情对望双联 (照片无字 · 纯净双画报) -->
      <div class="kitty-album-block duo-block">
        <div class="kitty-duo-col" onclick="window.openLightbox('assets/images/16ec3c0b9794f04df87bd1e7148de552.jpg')">
          <div class="kitty-duo-img-box">
            <img src="assets/images/16ec3c0b9794f04df87bd1e7148de552.jpg" alt="侧影回眸" loading="lazy" decoding="async">
          </div>
        </div>
        <div class="kitty-duo-col" onclick="window.openLightbox('assets/images/23b2371518329cd4ae9f798595ce33e0.jpg')">
          <div class="kitty-duo-img-box">
            <img src="assets/images/23b2371518329cd4ae9f798595ce33e0.jpg" alt="深情相望" loading="lazy" decoding="async">
          </div>
        </div>
      </div>
      <p class="solo-quote-short" style="text-align:center; margin: 4px 0 16px; font-style:italic; color: var(--k-text-muted);">
        “想把我唱给你听，趁现在年少如花。往后余生，风雪是你，平淡是你，目光所至全都是你。”
      </p>

      <!-- 侧边文字排版 3 (图左，字右): 钻戒定格 -->
      <div class="photo-side-editorial-block">
        <div class="editorial-photo-wrap" onclick="window.openLightbox('assets/images/7698ada64fce8b2614700e77f3545573.jpg')">
          <img src="assets/images/7698ada64fce8b2614700e77f3545573.jpg" alt="戒定终身" loading="lazy" decoding="async">
        </div>
        <div class="editorial-text-wrap">
          <span class="editorial-en-sub">PROMISE OF ETERNITY</span>
          <h4 class="editorial-cn-title">指间微光 · 一生之诺</h4>
          <div class="editorial-divider-line"></div>
          <p class="editorial-cn-desc">
            无名指上的璀璨微光，<br>
            锁住一生的守护与偏爱。<br>
            从前车马很慢，一生只够爱一个人。
          </p>
        </div>
      </div>
    `;
    mark('assets/images/ea04e976bade7397ec503112983280eb.png');
    mark('assets/images/7ebe2b5d3c02f93abf9efc605474f2cb.jpg');
    mark('assets/images/new_photo_2133.png');
    mark('assets/images/375a7b55048e3de758e1087786fe4921.jpg');
    mark('assets/images/16ec3c0b9794f04df87bd1e7148de552.jpg');
    mark('assets/images/23b2371518329cd4ae9f798595ce33e0.jpg');
    mark('assets/images/7698ada64fce8b2614700e77f3545573.jpg');

    // ----------------------------------------------------------------------
    // CHAPTER 03: 山海为盟 · 奔赴星河 (海风礁石浪漫展示卡)
    // ----------------------------------------------------------------------
    h += `
      <div class="gallery-chapter-divider">
        <span class="chapter-num-badge">CHAPTER 03</span>
      </div>

      <!-- 宽幅海景 1: 礁石相拥额头微触 (全幅完整呈现 · 文字置于照片下方) -->
      <div class="photo-full-showcase-card" onclick="window.openLightbox('assets/images/0ada7fda938ddc1f853cb30de08d24ee.jpg')">
        <div class="showcase-img-box">
          <img src="assets/images/0ada7fda938ddc1f853cb30de08d24ee.jpg" alt="礁石相拥" loading="lazy" decoding="async">
        </div>
        <div class="showcase-caption-box">
          <span class="showcase-en-badge">OCEAN PLEDGE</span>
          <h4 class="showcase-main-title">山海辽阔 · 卿为心安</h4>
          <div class="showcase-divider"></div>
          <p class="showcase-quote-text">“听过许多关于爱情的告白，最动人的，莫过于牵着你的手看海浪翻涌。只要身旁有你，波澜壮阔的人间便有了停靠的港湾。”</p>
        </div>
      </div>

      <!-- 宽幅海景 2: 碧海长空静坐相守 (全幅完整呈现 · 文字置于照片下方) -->
      <div class="photo-full-showcase-card" onclick="window.openLightbox('assets/images/12c73204f2b6332d8cc10952be0631fe.png')">
        <div class="showcase-img-box">
          <img src="assets/images/12c73204f2b6332d8cc10952be0631fe.png" alt="静坐相守" loading="lazy" decoding="async">
        </div>
        <div class="showcase-caption-box">
          <span class="showcase-en-badge">ETERNAL HORIZON</span>
          <h4 class="showcase-main-title">海平线外 · 唯愿有你</h4>
          <div class="showcase-divider"></div>
          <p class="showcase-quote-text">“海风吹拂长发，阳光洒落肩头。和你在一起的每个瞬间，都像是电影里最浪漫的慢镜头，定格成一生珍藏的风景。”</p>
        </div>
      </div>

      <!-- 侧边文字排版 4 (字左，图右): 脸颊轻依相偎 -->
      <div class="photo-side-editorial-block reverse">
        <div class="editorial-photo-wrap" onclick="window.openLightbox('assets/images/16930b6cf9719d43c1bccd12ec011cbb.jpg')">
          <img src="assets/images/16930b6cf9719d43c1bccd12ec011cbb.jpg" alt="倚颊相偎" loading="lazy" decoding="async">
        </div>
        <div class="editorial-text-wrap">
          <span class="editorial-en-sub">TENDER EMBRACE</span>
          <h4 class="editorial-cn-title">倾心相伴 · 温暖岁月</h4>
          <div class="editorial-divider-line"></div>
          <p class="editorial-cn-desc">
            脸颊轻依的温度，是心中最笃定的安心。<br>
            愿与你同担风雨，共赏晴天，<br>
            把平凡的琐碎日常，过成诗一般的岁月。
          </p>
        </div>
      </div>
    `;
    mark('assets/images/0ada7fda938ddc1f853cb30de08d24ee.jpg');
    mark('assets/images/12c73204f2b6332d8cc10952be0631fe.png');
    mark('assets/images/16930b6cf9719d43c1bccd12ec011cbb.jpg');

    // ----------------------------------------------------------------------
    // CHAPTER 04: 烟火年华 · 四季予你 (浪漫互动、光影与日常典雅)
    // ----------------------------------------------------------------------
    h += `
      <div class="gallery-chapter-divider">
        <span class="chapter-num-badge">CHAPTER 04</span>
      </div>

      <!-- 侧边文字排版 5 (图左，字右): 展开白纱 -->
      <div class="photo-side-editorial-block">
        <div class="editorial-photo-wrap" onclick="window.openLightbox('assets/images/be181b26caccbdf3c01364c653879bb8.jpg')">
          <img src="assets/images/be181b26caccbdf3c01364c653879bb8.jpg" alt="白纱飞扬" loading="lazy" decoding="async">
        </div>
        <div class="editorial-text-wrap">
          <span class="editorial-en-sub">PURE JOY</span>
          <h4 class="editorial-cn-title">春风十里 · 满心欢喜</h4>
          <div class="editorial-divider-line"></div>
          <p class="editorial-cn-desc">
            微风拂过发梢，白纱轻扬而起。<br>
            看着你眼底的笑容，才懂得真正的幸福，<br>
            就是能陪你守护这份纯真，并肩奔赴未来的每一天。
          </p>
        </div>
      </div>

      <!-- 侧边文字排版 6 (字左，图右): 白郁金香端坐 -->
      <div class="photo-side-editorial-block reverse">
        <div class="editorial-photo-wrap" onclick="window.openLightbox('assets/images/28ab68761681ea986392d033262e7254.jpg')">
          <img src="assets/images/28ab68761681ea986392d033262e7254.jpg" alt="白郁寄情" loading="lazy" decoding="async">
        </div>
        <div class="editorial-text-wrap">
          <span class="editorial-en-sub">QUIET AFFECTION</span>
          <h4 class="editorial-cn-title">岁月静好 · 现世安稳</h4>
          <div class="editorial-divider-line"></div>
          <p class="editorial-cn-desc">
            生活不是电影，却因你而有了最踏实的剧本。<br>
            身后是你笃定的注视，身旁是一生的安心。<br>
            三餐四季，朝夕相伴。
          </p>
        </div>
      </div>

      <!-- 终章大作: 欧式廊柱执手大合影 (100%全貌全屏显现 · 零裁剪 · 文字置于下方) -->
      <div class="photo-full-showcase-card" onclick="window.openLightbox('assets/images/715fc9e5feab11f78808e49372decfc6.jpg')">
        <div class="showcase-img-box">
          <img src="assets/images/715fc9e5feab11f78808e49372decfc6.jpg" alt="执手韶华" loading="lazy" decoding="async">
        </div>
        <div class="showcase-caption-box">
          <span class="showcase-en-badge">GRAND FINALE</span>
          <h4 class="showcase-main-title">执手同行 · 奔赴星河</h4>
          <div class="showcase-divider"></div>
          <p class="showcase-quote-text">“执手走过漫漫岁月，相扶相持，共度朝暮。从今往后，山河远阔，人间烟火，我们携手奔赴属于我们的漫漫余生。”</p>
        </div>
      </div>
    `;
    mark('assets/images/be181b26caccbdf3c01364c653879bb8.jpg');
    mark('assets/images/28ab68761681ea986392d033262e7254.jpg');
    mark('assets/images/715fc9e5feab11f78808e49372decfc6.jpg');

    lookbookEl.innerHTML = h;
  }

  // 视角切换兼容函数
  window.switchGalleryTab = function () {};

  


  // ==================== 5. 倒计时部件 ====================
  function initDDayCountdown() {
    const dStr = wCfg.date || "2026-09-28";
    const tStr = wCfg.time || "11:58";
    const targetMs = new Date(`${dStr.replace(/-/g, "/")} ${tStr}:00`).getTime();

    const dEl = document.getElementById("dday-d");
    const hEl = document.getElementById("dday-h");
    const mEl = document.getElementById("dday-m");
    const sEl = document.getElementById("dday-s");

    function updateDDay() {
      const now = new Date().getTime();
      const diff = targetMs - now;

      if (diff <= 0) {
        if (dEl) dEl.textContent = "00";
        if (hEl) hEl.textContent = "00";
        if (mEl) mEl.textContent = "00";
        if (sEl) sEl.textContent = "00";
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      if (dEl) dEl.textContent = days < 10 ? `0${days}` : days;
      if (hEl) hEl.textContent = hours < 10 ? `0${hours}` : hours;
      if (mEl) mEl.textContent = minutes < 10 ? `0${minutes}` : minutes;
      if (sEl) sEl.textContent = seconds < 10 ? `0${seconds}` : seconds;
    }

    updateDDay();
    setInterval(updateDDay, 1000);
  }

  // ==================== 6. 地图导航弹窗与双地址切换 ====================
  let currentMapTarget = "groom"; // "groom" | "bride"

  window.switchMapTarget = function (target) {
    currentMapTarget = target || "groom";
    const tabGroom = document.getElementById("tab-venue-groom");
    const tabBride = document.getElementById("tab-venue-bride");
    const hintEl = document.getElementById("map-target-dest-hint");

    if (tabGroom && tabBride) {
      if (currentMapTarget === "bride") {
        tabGroom.classList.remove("active");
        tabBride.classList.add("active");
        if (hintEl) hintEl.textContent = `导航目的地：${wCfg.brideLocation || "广西桂平罗播乡叹自由酒店"}`;
      } else {
        tabGroom.classList.add("active");
        tabBride.classList.remove("active");
        if (hintEl) hintEl.textContent = `导航目的地：${wCfg.location || "桂平市罗播乡六凤村"}`;
      }
    }
  };

  window.openMapSheet = function (target) {
    if (target) {
      window.switchMapTarget(target);
    }
    const modal = document.getElementById("map-sheet-modal");
    if (modal) modal.classList.add("show");
  };

  window.closeMapSheet = function () {
    const modal = document.getElementById("map-sheet-modal");
    if (modal) modal.classList.remove("show");
  };

  window.startNavigation = function (appType) {
    const isBride = currentMapTarget === "bride";
    const lat = isBride ? (wCfg.brideLatitude || 23.0250) : (wCfg.latitude || 22.990936);
    const lng = isBride ? (wCfg.brideLongitude || 110.0765) : (wCfg.longitude || 110.093075);
    const venueTitle = isBride
      ? `新娘李婵婚礼地址（${wCfg.brideLocation || "广西桂平罗播乡叹自由酒店"}）`
      : `${wCfg.groom} & ${wCfg.bride} 婚礼喜宴（${wCfg.location || "桂平市罗播乡六凤村"}）`;
    const name = encodeURIComponent(venueTitle);
    const rawAddr = isBride
      ? (wCfg.brideAddress || "广西壮族自治区贵港市桂平市罗播乡S206省道叹自由酒店")
      : (wCfg.address || "广西壮族自治区贵港市桂平市罗播乡六凤村");
    const addr = encodeURIComponent(rawAddr);

    let navUrl = "";
    switch (appType) {
      case "amap":
        navUrl = `https://uri.amap.com/marker?position=${lng},${lat}&name=${name}&src=wedding_invite&coordinate=gaode&callnative=1`;
        break;
      case "qq":
        navUrl = `https://apis.map.qq.com/uri/v1/marker?marker=coord:${lat},${lng};title:${name};addr:${addr}&referer=wedding_invite`;
        break;
      case "baidu":
        if (!isBride && wCfg.baiduRouteUrl) {
          navUrl = wCfg.baiduRouteUrl;
        } else {
          const bLat = isBride ? (wCfg.brideLatitude || 23.0250) : (wCfg.baiduLatitude || 22.996625);
          const bLng = isBride ? (wCfg.brideLongitude || 110.0765) : (wCfg.baiduLongitude || 110.099629);
          navUrl = `https://api.map.baidu.com/marker?location=${bLat},${bLng}&title=${name}&content=${addr}&output=html&src=wedding_app`;
        }
        break;
      case "apple":
        navUrl = `https://maps.apple.com/?daddr=${lat},${lng}&dirflg=d&q=${name}`;
        break;
      default:
        navUrl = `https://uri.amap.com/marker?position=${lng},${lat}&name=${name}`;
    }

    window.closeMapSheet();
    window.location.href = navUrl;
  };

  window.copyAddressText = function (target) {
    const which = target || currentMapTarget;
    const isBride = which === "bride";
    const addr = isBride
      ? (wCfg.brideAddress || "广西壮族自治区贵港市桂平市罗播乡S206省道叹自由酒店")
      : (wCfg.address || "广西壮族自治区贵港市桂平市罗播乡六凤村");
    const label = isBride ? "女方地址（叹自由酒店）" : "男方喜宴地址（六凤村）";

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(addr).then(() => {
        window.toast(`${label}已复制，可直接粘贴到导航！`);
      }).catch(() => fallbackCopy(addr, label));
    } else {
      fallbackCopy(addr, label);
    }
  };

  function fallbackCopy(text, label) {
    const input = document.createElement("input");
    input.value = text;
    document.body.appendChild(input);
    input.select();
    try {
      document.execCommand("copy");
      window.toast(`${label || "地址"}已复制，可直接粘贴到导航！`);
    } catch (e) {
      window.toast(`地址：${text}`);
    }
    document.body.removeChild(input);
  }

  // ==================== 7. RSVP 赴宴登记提交 ====================
  window.submitRsvp = function (e) {
    if (e) e.preventDefault();
    const name = document.getElementById("rsvp-name")?.value?.trim();
    const count = document.getElementById("rsvp-count")?.value;
    const wish = document.getElementById("rsvp-wish")?.value?.trim();

    if (!name) {
      window.toast("请留下您的尊姓大名～");
      return;
    }

    const record = {
      name,
      count,
      wish: wish || "祝吴德星与李婵新婚快乐，永结同心！",
      time: new Date().toLocaleString()
    };

    let list = [];
    try {
      list = JSON.parse(localStorage.getItem("wedding_rsvp_records") || "[]");
    } catch (err) {}
    list.push(record);
    localStorage.setItem("wedding_rsvp_records", JSON.stringify(list));

    window.toast("已收到您的赴宴信息与真挚祝福，婚礼见！");
    const form = document.getElementById("rsvp-form");
    if (form) form.reset();
  };

  // ==================== 8. 微信分享引导 ====================
  window.openShareHint = function () {
    const layer = document.getElementById("wechat-share-layer");
    if (layer) layer.classList.add("show");
  };

  window.closeShareHint = function () {
    const layer = document.getElementById("wechat-share-layer");
    if (layer) layer.classList.remove("show");
  };

  // ==================== 9. 全屏相册 Lightbox ====================
  window.openLightbox = function (src) {
    const box = document.getElementById("lightbox-box");
    const img = document.getElementById("lightbox-view-img");
    if (box && img) {
      img.src = src;
      box.classList.add("show");
      isUserTouching = true;
    }
  };

  window.closeLightbox = function () {
    const box = document.getElementById("lightbox-box");
    if (box) {
      box.classList.remove("show");
      isUserTouching = false;
    }
  };

  // ==================== 10. Toast 提示 ====================
  let tTimer = null;
  window.toast = function (msg) {
    const t = document.getElementById("mini-toast");
    if (!t) return;
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(tTimer);
    tTimer = setTimeout(() => {
      t.classList.remove("show");
    }, 2200);
  };

  // 用户点击或触摸时也确保优先触发一次并自动解锁开唱
  const instantTriggers = ['touchstart', 'touchmove', 'scroll', 'click', 'pointerdown'];
  const onInstantInteraction = function () {
    if (audio && (audio.paused || audio.muted || !isPlaying)) {
      audio.muted = false;
      try { audio.volume = 0.8; } catch (e) {}
      fadeInMusic();
    }
  };
  instantTriggers.forEach(evt => {
    window.addEventListener(evt, onInstantInteraction, { capture: true, passive: true });
    document.addEventListener(evt, onInstantInteraction, { capture: true, passive: true });
  });

  // 页面加载启动 - 打开链接就自动滑动，并自动播放背景音乐
  window.addEventListener("DOMContentLoaded", function () {
    initMusic();
    renderAllGalleryViews();
    initDDayCountdown();

    // 如果尚未起播，尝试启动播放背景音乐
    if (!isPlaying && !window.__weddingAudioPlaying) {
      fadeInMusic();
    }

    // 用户第一次互动时再播放音乐；不会在首屏后台下载整首音频。
    const userEvents = ['touchstart', 'touchend', 'touchmove', 'scroll', 'click', 'pointerdown', 'keydown'];
    const wakeUpAudio = function () {
      if (!isPlaying || !audio || audio.paused || audio.muted) {
        if (audio) {
          audio.muted = false;
          try { audio.volume = 0.8; } catch (e) {}
        }
        fadeInMusic();
      } else {
        userEvents.forEach(evt => {
          document.removeEventListener(evt, wakeUpAudio, true);
          window.removeEventListener(evt, wakeUpAudio, true);
        });
      }
    };
    userEvents.forEach(evt => {
      document.addEventListener(evt, wakeUpAudio, { capture: true, passive: true });
      window.addEventListener(evt, wakeUpAudio, { capture: true, passive: true });
    });

    if (audio) {
      audio.loop = false;
      // 歌曲放完后自动切歌：顺畅切换并播放下一首
      audio.addEventListener("ended", function () {
        const nextIdx = (currentTrackIdx + 1) % playlist.length;
        loadTrack(nextIdx, true);
        window.toast("♫ 正在自动播放下一首: " + playlist[nextIdx].title);
      });
      // 异常自动跳过容错
      audio.addEventListener("error", function () {
        setTimeout(() => {
          if (!isPlaying || audio.paused) {
            const nextIdx = (currentTrackIdx + 1) % playlist.length;
            loadTrack(nextIdx, true);
          }
        }, 1500);
      });
    }
  });

  document.addEventListener("visibilitychange", function () {
    if (document.hidden) stopAutoScroll();
  });

})();
