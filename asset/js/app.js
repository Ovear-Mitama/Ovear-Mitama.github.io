/* ============================================================
   Damage Engine API 文档 - 页面逻辑
   依赖:asset/js/i18n.js(window.DE_I18N / window.DE_LANGS)
         asset/js/nav.js (window.DE_NAV)
   ============================================================ */
(function () {
  'use strict';

  var I18N = window.DE_I18N || { zh: {}, en: {} };
  var LANGS = window.DE_LANGS || [{ code: 'zh', label: '简体中文' }];
  var NAV = window.DE_NAV || [];

  var LANG_KEY = 'de-doc-lang';
  var THEME_KEY = 'de-doc-theme';

  var currentLang = 'zh';
  var currentTheme = 'light';

  /* ---------- 本地存储(隐私模式下静默失败) ---------- */
  function store(key, value) {
    try { localStorage.setItem(key, value); } catch (e) {}
  }
  function read(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }

  /* ---------- 侧栏:按 nav.js 配置渲染 ---------- */
  function renderNav() {
    var nav = document.getElementById('sidebar');
    if (!nav || !NAV.length) return;

    NAV.forEach(function (group, index) {
      var section = document.createElement('div');
      /* 第一个分类(入门)默认展开,其余默认收起 */
      section.className = 'nav-section' + (index > 0 ? ' collapsed' : '');

      var btn = document.createElement('button');
      btn.className = 'nav-group-btn';
      btn.type = 'button';

      var title = document.createElement('span');
      title.setAttribute('data-i18n', group.key);

      var chev = document.createElement('i');
      chev.className = 'fa-solid fa-chevron-right chev';

      btn.appendChild(title);
      btn.appendChild(chev);
      section.appendChild(btn);

      var items = document.createElement('div');
      items.className = 'nav-items';
      (group.items || []).forEach(function (item) {
        var a = document.createElement('a');
        a.setAttribute('href', item.href);
        a.setAttribute('data-i18n', item.key);
        items.appendChild(a);
      });
      section.appendChild(items);

      nav.appendChild(section);
    });
  }

  /* ---------- 多语言 ---------- */
  function langMeta(code) {
    for (var i = 0; i < LANGS.length; i++) {
      if (LANGS[i].code === code) return LANGS[i];
    }
    return null;
  }

  function applyLang(lang) {
    var dict = I18N[lang] || I18N.zh || {};
    currentLang = lang;

    var htmlLang = (lang === 'zh') ? 'zh-CN' : (lang === 'zhTW' ? 'zh-Hant' : 'en');
    document.documentElement.lang = htmlLang;
    document.title = dict['brand.title'] || 'Damage Engine API';

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (dict[key] != null) el.innerHTML = dict[key];
    });

    var label = document.getElementById('langLabel');
    var meta = langMeta(lang);
    if (label) label.textContent = meta ? meta.label : lang;

    document.querySelectorAll('.lang-option').forEach(function (opt) {
      opt.classList.toggle('active', opt.getAttribute('data-lang') === lang);
    });

    store(LANG_KEY, lang);
  }

  function initLangSelect() {
    var select = document.getElementById('langSelect');
    var btn = document.getElementById('langBtn');
    var menu = document.getElementById('langMenu');

    if (menu) {
      LANGS.forEach(function (lang) {
        var opt = document.createElement('button');
        opt.className = 'lang-option';
        opt.type = 'button';
        opt.textContent = lang.label;
        opt.setAttribute('data-lang', lang.code);
        opt.addEventListener('click', function () {
          applyLang(lang.code);
          if (select) select.classList.remove('open');
        });
        menu.appendChild(opt);
      });
    }

    if (select && btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        select.classList.toggle('open');
      });
      document.addEventListener('click', function () {
        select.classList.remove('open');
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') select.classList.remove('open');
      });
    }

    var saved = read(LANG_KEY);
    applyLang(langMeta(saved) ? saved : 'zh');
  }

  /* ---------- 深色 / 浅色主题 ---------- */
  function applyTheme(theme) {
    currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);

    var icon = document.querySelector('#themeBtn i');
    if (icon) {
      icon.className = theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    }
    var btn = document.getElementById('themeBtn');
    if (btn) {
      btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    }
  }

  function initTheme() {
    var btn = document.getElementById('themeBtn');
    var saved = read(THEME_KEY);
    var prefersDark = !!(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
    applyTheme(saved === 'dark' || saved === 'light' ? saved : (prefersDark ? 'dark' : 'light'));

    if (btn) {
      btn.addEventListener('click', function () {
        var next = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(next);
        store(THEME_KEY, next);
      });
    }
  }

  /* ---------- 代码块复制 ---------- */
  function initCopyButtons() {
    document.querySelectorAll('.copy-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var head = btn.closest('.code-head');
        var pre = head && head.nextElementSibling;
        if (!pre || !navigator.clipboard) return;

        navigator.clipboard.writeText(pre.innerText).then(function () {
          var dict = I18N[currentLang] || I18N.zh || {};
          btn.textContent = dict['btn.copied'] || 'Copied';
          setTimeout(function () {
            btn.textContent = dict['btn.copy'] || 'Copy';
          }, 1200);
        });
      });
    });
  }

  /* ---------- 分类展开 / 收起 ---------- */
  function initCollapse() {
    document.querySelectorAll('nav.sidebar .nav-group-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var section = btn.closest('.nav-section');
        if (section) section.classList.toggle('collapsed');
      });
    });
  }

  /* ---------- 当前小节高亮 ---------- */
  function initScrollSpy() {
    var links = Array.prototype.slice.call(document.querySelectorAll('nav.sidebar .nav-items a'));
    var sections = links
      .map(function (a) { return document.querySelector(a.getAttribute('href')); })
      .filter(Boolean);
    if (!sections.length) return;

    function onScroll() {
      var pos = window.scrollY + 90;
      var current = sections[0];
      sections.forEach(function (sec) {
        if (sec.offsetTop <= pos) current = sec;
      });
      links.forEach(function (a) {
        a.classList.toggle('active', current && a.getAttribute('href') === '#' + current.id);
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- 移动端目录抽屉 ---------- */
  function initDrawer() {
    var sidebar = document.getElementById('sidebar');
    var backdrop = document.getElementById('backdrop');
    var menuBtn = document.getElementById('menuBtn');
    if (!sidebar || !menuBtn) return;

    function closeMenu() {
      sidebar.classList.remove('open');
      if (backdrop) backdrop.classList.remove('show');
    }

    menuBtn.addEventListener('click', function () {
      sidebar.classList.toggle('open');
      if (backdrop) backdrop.classList.toggle('show', sidebar.classList.contains('open'));
    });
    if (backdrop) backdrop.addEventListener('click', closeMenu);

    document.querySelectorAll('nav.sidebar a').forEach(function (a) {
      a.addEventListener('click', closeMenu);
    });
  }

  /* ---------- 初始化 ---------- */
  initTheme();
  renderNav();
  initLangSelect();
  initCopyButtons();
  initCollapse();
  initScrollSpy();
  initDrawer();
})();
