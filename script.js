(function () {
  "use strict";

  const config = window.SITE_CONFIG || {};
  const hostName = config.HOST_NAME || "경민";
  const age = Number(config.AGE) || 35;
  const eventYear = Number(config.EVENT_YEAR) || new Date().getFullYear();
  const nextBanchilsunYear = eventYear + Math.max(0, 70 - age);
  const storageKey = `banchilsun-guestbook-${hostName}`;
  const likeStorageKey = `${storageKey}-likes`;
  const storageResetKey = `${storageKey}-reset-version`;
  const STORAGE_RESET_VERSION = "public-guestbook-v1";
  const PAGE_SIZE = 5;

  const randomJokes = [
    "35년 동안 큰 사고 없이 여기까지 온 것만으로 이미 대상감입니다.",
    "편의점 알바생이 ‘학생’ 대신 ‘고객님’이라고 부르는 나이, 축하해요.",
    "이제 밤을 새우는 게 아니라 밤에게 지는 거예요. 건강하세요.",
    "술 마신 다음 날이 전과 다르다면 정상입니다. 이미 많이 다르면… 늦었습니다.",
    "마음은 스물인데 카드 명세서와 목 디스크는 거짓말을 안 하네요.",
    "반칠순 축하해! 완칠순까지 업데이트 지원이 계속되길 바랍니다.",
    "35세는 늙은 게 아니라 빈티지입니다. 관리 잘 된 중고처럼 빛나세요.",
    "체력은 줄고 추억 보정은 늘어나는 황금기, 드디어 입장하셨습니다.",
    "생일 축하해. 무릎은 꺾여도 자존심은 꺾이지 말자.",
    "초는 35개지만 소원은 하나만 비세요. 소방 안전상 그렇습니다.",
    "다음 반칠순에도 만나자. 그때는 앉아서 축하하자.",
    "나이는 숫자에 불과하지만 숫자가 꽤 구체적이네요. 35 축하합니다.",
    "경민아 축하해. 이제 ‘요즘 애들’이라고 말할 때 한 번 더 생각해야 하는 나이야.",
    "스무 살엔 밤새 놀았고, 서른다섯엔 밤새 뒤척입니다. 레벨 업 축하해요.",
    "35년산 경민, 숙성은 잘됐고 보관법은 눕혀 두기입니다.",
    "주민등록상 35세, 플레이리스트상 22세, 체력상 금요일 저녁입니다.",
    "생일 축하해! 이제 ‘한 살 더 먹었다’보다 ‘한 끼 잘 먹었다’가 더 중요해졌네.",
    "청춘은 끝나지 않았습니다. 다만 로딩 시간이 조금 길어졌습니다.",
    "경민의 전성기는 아직 안 왔습니다. 배송 조회 결과 계속 출발 준비 중입니다.",
    "서른다섯의 장점: 웬만한 흑역사는 ‘그땐 어렸지’로 덮을 수 있습니다.",
    "건강, 행복, 그리고 다음 날 멀쩡한 간을 기원합니다.",
    "오늘은 네가 주인공이야. 내일부터는 다시 단체 채팅방 읽씹 담당이야.",
    "반칠순 축하해. 완칠순까지 남은 퀘스트: 허리 펴기, 물 마시기, 일찍 자기.",
    "35세는 꺾인 게 아니라 접힌 겁니다. 잘 펴서 오래 씁시다.",
    "생일 초보다 영양제 알 수가 많아지는 그날까지 건강하자.",
    "인생 2막이 아니라 시즌 35입니다. 전편 요약은 생략하겠습니다.",
    "경민아, 지금이 제일 젊다. 이 문장은 내년에도 재사용 가능합니다.",
    "축하의 마음은 무겁게, 선물은 더 무겁게 준비했습니다. 마음만요.",
    "오늘만큼은 나이를 묻지 않겠습니다. 홈페이지에 이미 크게 써 있으니까요.",
    "서른다섯인데 이 정도면 잘 컸다. 키 말고 사회성 이야기입니다.",
    "경민아 넌 늙는 게 아니라 클래식이 되는 중이야. 문제는 관리비가 명품급이라는 거지.",
    "국가가 왜 널 보호문화재로 지정 안 하는지 모르겠다. 이렇게 잘 보존된 1992년산인데.",
    "네가 웃으면 세상이 환해진다더니 전기요금이 올랐네. 적당히 빛나줘.",
    "경민이 미모는 와이파이야. 눈에 안 보여도 근처만 가면 자동으로 연결돼.",
    "오늘 케이크 칼로리는 나이에서 빼기로 했습니다. 축하합니다, 다시 스물아홉입니다.",
    "세월이 네 얼굴에 흔적을 남기려다가 얼굴값 보고 그냥 돌아갔대.",
    "네 사진 보고 휴대폰이 뜨거워졌어. 배터리 문제가 아니라 과도한 아름다움 처리 중이래.",
    "경민아, 너 때문에 지구 자전이 느려졌대. 사람들이 네 생일을 하루 더 축하하고 싶어서.",
    "35살이면 어때. 귀여움은 무기한이고 체력만 구독 만료 직전인걸.",
    "생일 축하해! 네 앞날이 꽃길이길 바라. 계단길은 무릎이 싫어하니까.",
    "너는 별이야. 밤에만 빛나는 별 말고, 낮에도 선글라스가 필요한 별.",
    "경민이 매력은 불법 증축이야. 해마다 늘어나는데 철거할 방법이 없어.",
    "오늘의 주인공은 경민, 내일의 주인공도 경민. 우리는 그냥 박수 담당으로 계약됐어.",
    "네 생일을 축하하려고 달력도 7월 3일에서 잠깐 숨을 고르고 간대.",
    "경민아, 넌 완벽해서 모자란 게 딱 하나야. 내 축하를 아직 덜 받은 것.",
    "케이크에 초를 다 꽂으면 소방서가 긴장하니까 마음속으로만 35개 켰습니다.",
    "1992년에 무슨 일이 있었나 찾아봤더니 경민 출시. 그해 최고 히트작 인정.",
    "네가 태어난 날 병원에서 울린 건 신생아 울음이 아니라 레전드 등장 알림이었대.",
    "경민이 나이를 와인으로 치면 최고 숙성기, 체력으로 치면 개봉 후 냉장 보관입니다.",
    "생일 선물로 시간을 멈춰주고 싶었는데 이미 사진 속에서 혼자 멈춰 있더라.",
  ];

  const relationMoods = {
    찐친: "😂",
    동창: "🫡",
    가족: "🥳",
    직장: "😎",
    후배: "🙇",
    동기: "😳",
  };

  const fortunes = [
    ["97%", "오늘 약속 취소 시 체력 완전 회복"],
    ["35.0", "아직 최신 버전입니다. 재부팅은 낮잠으로."],
    ["주의", "무리한 2차는 내일의 나에게 고소당합니다."],
    ["A+", "추억 보정 능력이 상위 1%입니다."],
    ["양호", "떡볶이만 있으면 청춘 모드 3시간 유지"],
    ["축복", "올해는 계단보다 엘리베이터 운이 좋습니다."],
  ];

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  const canVibrate =
    typeof navigator !== "undefined" && typeof navigator.vibrate === "function";

  // Light haptic feedback for touch devices. No-op where unsupported or when
  // the user prefers reduced motion.
  function buzz(pattern = 12) {
    if (!canVibrate) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    try {
      navigator.vibrate(pattern);
    } catch (error) {
      /* vibration is best-effort */
    }
  }

  let entries = [];
  let selectedRelation = "찐친";
  let activeFilter = "all";
  let currentPage = 1;
  let toastTimer = null;
  let focusScrollTimer = null;

  const hasRemoteStorage = Boolean(
    config.SUPABASE_URL &&
      config.SUPABASE_ANON_KEY &&
      /^https:\/\//.test(config.SUPABASE_URL)
  );

  const guestForm = $("#guest-form");
  const nameInput = $("#guest-name");
  const messageInput = $("#guest-message");
  const charCount = $("#char-count");
  const entryList = $("#entry-list");
  const entryCount = $("#entry-count");
  const emptyState = $("#empty-state");
  const pagination = $("#entry-pagination");
  const pageCurrent = $("#page-current");
  const pageTotal = $("#page-total");
  const pagePrev = $("#page-prev");
  const pageNext = $("#page-next");
  const toast = $("#toast");
  const mobileViewport = window.matchMedia("(max-width: 680px)");

  function setStableMobileViewportHeight() {
    if (!mobileViewport.matches) {
      document.documentElement.style.removeProperty("--mobile-viewport-height");
      return;
    }

    const viewportHeight = window.visualViewport?.height || window.innerHeight;
    document.documentElement.style.setProperty(
      "--mobile-viewport-height",
      `${Math.round(viewportHeight)}px`
    );
  }

  function keepFieldVisible(field) {
    // Scroll the focused field into the area that stays visible above the
    // on-screen keyboard. visualViewport reflects the keyboard-reduced area,
    // so we nudge the page only by what's needed to clear it.
    const viewport = window.visualViewport;
    const visibleHeight = viewport ? viewport.height : window.innerHeight;
    const visibleTop = viewport ? viewport.offsetTop : 0;
    const rect = field.getBoundingClientRect();
    const margin = 24;
    const topbarGap = 16;

    let delta = 0;
    if (rect.bottom > visibleTop + visibleHeight - margin) {
      delta = rect.bottom - (visibleTop + visibleHeight - margin);
    } else if (rect.top < visibleTop + topbarGap) {
      delta = rect.top - (visibleTop + topbarGap);
    }

    if (Math.abs(delta) > 1) {
      window.scrollBy({ top: delta, behavior: "auto" });
    }
  }

  function syncFormFocusState() {
    const focusedElement = document.activeElement;
    const isFormField = Boolean(
      mobileViewport.matches &&
        focusedElement &&
        guestForm.contains(focusedElement) &&
        focusedElement.matches("input, textarea")
    );

    document.documentElement.classList.toggle("is-form-focused", isFormField);

    if (isFormField) {
      window.clearTimeout(focusScrollTimer);
      focusScrollTimer = window.setTimeout(() => {
        keepFieldVisible(focusedElement);
      }, 200);
    } else {
      window.clearTimeout(focusScrollTimer);
    }
  }

  function configurePage() {
    $$('[data-host]').forEach((element) => {
      element.textContent = hostName;
    });
    $$('[data-age]').forEach((element) => {
      element.textContent = String(age);
    });
    $$('[data-next-year]').forEach((element) => {
      element.textContent = String(nextBanchilsunYear);
    });
    $$('[data-event-date]').forEach((element) => {
      element.textContent = config.EVENT_DATE || "2026.07.03";
    });
    $$('[data-event-place]').forEach((element) => {
      element.textContent = config.EVENT_PLACE || "경민이의 마음속 VIP석";
    });

    document.title = `${hostName}의 반칠순 생존기록소`;
    configureContactLinks();
  }

  function configureContactLinks() {
    const kakaoButton = $("#kakao-gift-button");
    const phoneButton = $("#phone-button");

    if (config.KAKAO_GIFT_URL) {
      kakaoButton.href = config.KAKAO_GIFT_URL;
      kakaoButton.target = "_blank";
      kakaoButton.rel = "noopener noreferrer";
    } else {
      kakaoButton.dataset.unconfigured = "카카오톡 선물 링크";
    }

    if (config.PHONE_NUMBER) {
      phoneButton.href = `tel:${String(config.PHONE_NUMBER).replace(/[^+\d]/g, "")}`;
    } else {
      phoneButton.dataset.unconfigured = "전화번호";
    }
  }

  function uid() {
    if (window.crypto && typeof window.crypto.randomUUID === "function") {
      return window.crypto.randomUUID();
    }
    return `local-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  function readLocalEntries() {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || "[]");
      return Array.isArray(saved) ? saved : [];
    } catch (error) {
      console.warn("방명록 로컬 데이터를 읽지 못했습니다.", error);
      return [];
    }
  }

  function resetLegacyLocalData() {
    try {
      if (localStorage.getItem(storageResetKey) === STORAGE_RESET_VERSION) return;
      localStorage.removeItem(storageKey);
      localStorage.removeItem(likeStorageKey);
      localStorage.setItem(storageResetKey, STORAGE_RESET_VERSION);
    } catch (error) {
      console.warn("기존 로컬 테스트 데이터를 초기화하지 못했습니다.", error);
    }
  }

  function saveLocalEntries(localEntries) {
    try {
      localStorage.setItem(storageKey, JSON.stringify(localEntries));
    } catch (error) {
      console.warn("방명록 로컬 데이터를 저장하지 못했습니다.", error);
    }
  }

  function readLikes() {
    try {
      const saved = JSON.parse(localStorage.getItem(likeStorageKey) || "[]");
      return new Set(Array.isArray(saved) ? saved : []);
    } catch (error) {
      return new Set();
    }
  }

  function saveLikes(likes) {
    try {
      localStorage.setItem(likeStorageKey, JSON.stringify(Array.from(likes)));
    } catch (error) {
      console.warn("좋아요 상태를 저장하지 못했습니다.", error);
    }
  }

  async function fetchRemoteEntries() {
    const endpoint = `${config.SUPABASE_URL}/rest/v1/guestbook?select=id,name,relationship,message,mood,created_at&order=created_at.desc&limit=100`;
    const response = await fetch(endpoint, {
      headers: {
        apikey: config.SUPABASE_ANON_KEY,
        Authorization: `Bearer ${config.SUPABASE_ANON_KEY}`,
      },
    });
    if (!response.ok) throw new Error(`공용 방명록 조회 실패: ${response.status}`);
    return response.json();
  }

  async function postRemoteEntry(entry) {
    const endpoint = `${config.SUPABASE_URL}/rest/v1/guestbook`;
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        apikey: config.SUPABASE_ANON_KEY,
        Authorization: `Bearer ${config.SUPABASE_ANON_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        name: entry.name,
        relationship: entry.relationship,
        message: entry.message,
        mood: entry.mood,
      }),
    });
    if (!response.ok) throw new Error(`공용 방명록 저장 실패: ${response.status}`);
    const saved = await response.json();
    return saved[0] || entry;
  }

  async function loadEntries() {
    if (hasRemoteStorage) {
      try {
        const remoteEntries = await fetchRemoteEntries();
        entries = remoteEntries;
        renderEntries();
        return;
      } catch (error) {
        console.warn(error);
      }
    }

    entries = readLocalEntries();
    entries.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    renderEntries();
  }

  function formatDate(dateString) {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return "방금 전";

    return new Intl.DateTimeFormat("ko-KR", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  }

  function createEntryCard(entry, likes) {
    const article = document.createElement("article");
    article.className = "entry-card";
    article.dataset.relationship = entry.relationship;

    const mood = document.createElement("span");
    mood.className = "entry-mood";
    mood.textContent = entry.mood || "🥳";
    mood.setAttribute("aria-hidden", "true");

    const body = document.createElement("div");

    const meta = document.createElement("div");
    meta.className = "entry-meta";

    const name = document.createElement("strong");
    name.className = "entry-name";
    name.textContent = entry.name;

    const relation = document.createElement("span");
    relation.className = "entry-relation";
    relation.textContent = entry.relationship;

    const message = document.createElement("p");
    message.className = "entry-message";
    message.textContent = entry.message;

    meta.append(name, relation);
    body.append(meta, message);

    const date = document.createElement("time");
    date.className = "entry-date";
    date.dateTime = entry.created_at;
    date.textContent = formatDate(entry.created_at);

    const likeButton = document.createElement("button");
    const isLiked = likes.has(entry.id);
    likeButton.type = "button";
    likeButton.className = `entry-like${isLiked ? " is-liked" : ""}`;
    likeButton.dataset.id = entry.id;
    likeButton.setAttribute("aria-label", `${entry.name}님의 글에 공감하기`);
    likeButton.setAttribute("aria-pressed", String(isLiked));
    likeButton.textContent = isLiked ? "♥ 공감함" : "♡ 공감";

    article.append(mood, body, date, likeButton);
    return article;
  }

  function renderEntries() {
    const visibleEntries = entries.filter(
      (entry) => activeFilter === "all" || entry.relationship === activeFilter
    );
    const likes = readLikes();
    const totalPages = Math.max(1, Math.ceil(visibleEntries.length / PAGE_SIZE));
    currentPage = Math.min(currentPage, totalPages);
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const pageEntries = visibleEntries.slice(startIndex, startIndex + PAGE_SIZE);

    entryList.replaceChildren(...pageEntries.map((entry) => createEntryCard(entry, likes)));
    entryCount.textContent = String(entries.length);
    emptyState.hidden = visibleEntries.length > 0;
    pagination.hidden = visibleEntries.length === 0;
    pageCurrent.textContent = String(currentPage);
    pageTotal.textContent = String(totalPages);
    pagePrev.disabled = currentPage === 1;
    pageNext.disabled = currentPage === totalPages;
  }

  function setButtonSelection(containerSelector, buttonSelector, value, dataKey) {
    $$(buttonSelector, $(containerSelector)).forEach((button) => {
      const isSelected = button.dataset[dataKey] === value;
      button.classList.toggle("is-selected", isSelected);
      button.setAttribute("aria-pressed", String(isSelected));
    });
  }

  function showToast(message) {
    $("p", toast).textContent = message;
    toast.classList.add("is-visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2800);
  }

  function fireConfetti(count = 64) {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const layer = $("#confetti-layer");
    const colors = ["#f34f7f", "#ffd742", "#405de6", "#78d7a5", "#fffaf3"];
    const fragment = document.createDocumentFragment();

    for (let index = 0; index < count; index += 1) {
      const piece = document.createElement("i");
      piece.className = "confetti-piece";
      piece.style.left = `${Math.random() * 100}%`;
      piece.style.background = colors[index % colors.length];
      piece.style.setProperty("--duration", `${2.2 + Math.random() * 2.2}s`);
      piece.style.setProperty("--drift", `${-110 + Math.random() * 220}px`);
      piece.style.setProperty("--spin", `${-720 + Math.random() * 1440}deg`);
      piece.style.animationDelay = `${Math.random() * 0.45}s`;
      fragment.append(piece);
    }

    layer.append(fragment);
    window.setTimeout(() => layer.replaceChildren(), 5000);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const name = nameInput.value.trim();
    const message = messageInput.value.trim();

    nameInput.setAttribute("aria-invalid", String(!name));
    messageInput.setAttribute("aria-invalid", String(!message));

    if (!name || !message) {
      showToast("이름과 한마디를 슬쩍 채워주세요.");
      (!name ? nameInput : messageInput).focus();
      return;
    }

    const submitButton = $(".button-submit", guestForm);
    submitButton.disabled = true;
    submitButton.textContent = "박제 처리 중…";

    let entry = {
      id: uid(),
      name: name.slice(0, 12),
      relationship: selectedRelation,
      mood: relationMoods[selectedRelation] || "🥳",
      message: message.slice(0, 140),
      created_at: new Date().toISOString(),
    };

    try {
      if (hasRemoteStorage) {
        entry = await postRemoteEntry(entry);
      } else {
        const localEntries = readLocalEntries();
        localEntries.unshift(entry);
        saveLocalEntries(localEntries);
      }

      entries.unshift(entry);
      activeFilter = "all";
      currentPage = 1;
      $$(".filter-button", $("#entry-filters")).forEach((button) => {
        button.classList.toggle("is-active", button.dataset.filter === "all");
      });
      renderEntries();
      guestForm.reset();
      selectedRelation = "찐친";
      setButtonSelection("#relation-options", ".choice-chip", selectedRelation, "relation");
      charCount.textContent = "0";
      showToast("증언이 안전하게 박제되었습니다.");
      buzz([15, 40, 15, 40, 30]);
      fireConfetti(76);
    } catch (error) {
      console.error(error);
      showToast("잠깐! 저장에 실패했어요. 한 번만 더 눌러주세요.");
    } finally {
      submitButton.disabled = false;
      submitButton.innerHTML = "영구 박제하기 <span>→</span>";
    }
  }

  async function sharePage() {
    const shareData = {
      title: `${hostName}의 반칠순 생존기록소`,
      text: `${hostName}의 35세 생존을 축하하고 한마디 남겨주세요.`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }
      await navigator.clipboard.writeText(window.location.href);
      showToast("주소를 복사했습니다. 이제 널리 퍼뜨리세요.");
    } catch (error) {
      if (error && error.name !== "AbortError") {
        showToast("주소창의 링크를 직접 복사해주세요.");
      }
    }
  }

  function bindEvents() {
    $("#relation-options").addEventListener("click", (event) => {
      const button = event.target.closest("[data-relation]");
      if (!button) return;
      selectedRelation = button.dataset.relation;
      setButtonSelection("#relation-options", ".choice-chip", selectedRelation, "relation");
      buzz(10);
    });

    messageInput.addEventListener("input", () => {
      charCount.textContent = String(messageInput.value.length);
      messageInput.removeAttribute("aria-invalid");
    });

    nameInput.addEventListener("input", () => nameInput.removeAttribute("aria-invalid"));

    $("#random-joke").addEventListener("click", () => {
      const candidates = randomJokes.filter((joke) => joke !== messageInput.value);
      messageInput.value = candidates[Math.floor(Math.random() * candidates.length)];
      charCount.textContent = String(messageInput.value.length);
      if (!mobileViewport.matches) messageInput.focus();
      messageInput.removeAttribute("aria-invalid");
    });

    guestForm.addEventListener("focusin", syncFormFocusState);
    guestForm.addEventListener("focusout", () => {
      window.setTimeout(syncFormFocusState, 80);
    });

    window.addEventListener("pageshow", setStableMobileViewportHeight);
    window.addEventListener("orientationchange", () => {
      window.setTimeout(setStableMobileViewportHeight, 320);
    });

    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", () => {
        if (document.documentElement.classList.contains("is-form-focused")) {
          syncFormFocusState();
        }
      });
    }

    guestForm.addEventListener("submit", handleSubmit);

    $("#entry-filters").addEventListener("click", (event) => {
      const button = event.target.closest("[data-filter]");
      if (!button) return;
      activeFilter = button.dataset.filter;
      currentPage = 1;
      $$(".filter-button", $("#entry-filters")).forEach((item) => {
        item.classList.toggle("is-active", item === button);
      });
      renderEntries();
    });

    pagePrev.addEventListener("click", () => {
      if (currentPage <= 1) return;
      currentPage -= 1;
      buzz(8);
      renderEntries();
    });

    pageNext.addEventListener("click", () => {
      const visibleCount = entries.filter(
        (entry) => activeFilter === "all" || entry.relationship === activeFilter
      ).length;
      const totalPages = Math.max(1, Math.ceil(visibleCount / PAGE_SIZE));
      if (currentPage >= totalPages) return;
      currentPage += 1;
      buzz(8);
      renderEntries();
    });

    // Swipe left/right across the testimonial list to page through entries.
    let swipeStartX = 0;
    let swipeStartY = 0;
    let swipeTracking = false;

    entryList.addEventListener(
      "touchstart",
      (event) => {
        if (event.touches.length !== 1) {
          swipeTracking = false;
          return;
        }
        swipeStartX = event.touches[0].clientX;
        swipeStartY = event.touches[0].clientY;
        swipeTracking = true;
      },
      { passive: true }
    );

    entryList.addEventListener(
      "touchend",
      (event) => {
        if (!swipeTracking) return;
        swipeTracking = false;
        const touch = event.changedTouches[0];
        const deltaX = touch.clientX - swipeStartX;
        const deltaY = touch.clientY - swipeStartY;
        // Horizontal intent only, with a comfortable threshold.
        if (Math.abs(deltaX) < 55 || Math.abs(deltaX) < Math.abs(deltaY) * 1.4) return;
        if (deltaX < 0) pageNext.click();
        else pagePrev.click();
      },
      { passive: true }
    );

    entryList.addEventListener("click", (event) => {
      const button = event.target.closest(".entry-like");
      if (!button) return;
      const likes = readLikes();
      const willLike = !likes.has(button.dataset.id);
      if (willLike) likes.add(button.dataset.id);
      else likes.delete(button.dataset.id);
      saveLikes(likes);
      buzz(willLike ? [10, 30, 10] : 8);
      renderEntries();
    });

    $("#fortune-button").addEventListener("click", () => {
      const [score, copy] = fortunes[Math.floor(Math.random() * fortunes.length)];
      $("span", $("#fortune-result")).textContent = score;
      $("p", $("#fortune-result")).textContent = copy;
      buzz([12, 40, 12]);
    });

    $("#confetti-button").addEventListener("click", () => {
      buzz([12, 30, 12]);
      fireConfetti(90);
    });
    $("#share-button").addEventListener("click", sharePage);

    $$(".contact-button[data-unconfigured]").forEach((button) => {
      button.addEventListener("click", (event) => {
        event.preventDefault();
        showToast(`${button.dataset.unconfigured}를 config.js에 넣으면 바로 연결됩니다.`);
      });
    });

    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      window.addEventListener("pointermove", (event) => {
        const spotlight = $(".cursor-spotlight");
        spotlight.style.left = `${event.clientX}px`;
        spotlight.style.top = `${event.clientY}px`;
      });
    }
  }

  function observeNavigationSections() {
    if (!("IntersectionObserver" in window)) return;

    const links = $$(".topbar nav a");
    const sectionById = new Map(
      links
        .map((link) => {
          const id = link.getAttribute("href")?.slice(1);
          const section = id ? document.getElementById(id) : null;
          return section ? [id, section] : null;
        })
        .filter(Boolean)
    );
    const visibility = new Map();

    const setCurrent = (id) => {
      links.forEach((link) => {
        if (link.getAttribute("href") === `#${id}`) {
          link.setAttribute("aria-current", "true");
        } else {
          link.removeAttribute("aria-current");
        }
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          visibility.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
        });

        const current = Array.from(visibility.entries()).sort((a, b) => b[1] - a[1])[0];
        if (current && current[1] > 0) {
          setCurrent(current[0]);
        } else {
          links.forEach((link) => link.removeAttribute("aria-current"));
        }
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: [0, 0.01, 0.1] }
    );

    sectionById.forEach((section) => observer.observe(section));
  }

  resetLegacyLocalData();
  setStableMobileViewportHeight();
  configurePage();
  bindEvents();
  setButtonSelection("#relation-options", ".choice-chip", selectedRelation, "relation");
  observeNavigationSections();
  loadEntries();
})();
