/* ============================================================
   文档站 - 页面逻辑
   依赖: asset/js/nav.js  (window.ANIMA_DOCS)
         asset/js/i18n.js (window.SITE_LANGS / window.SITE_I18N)
   负责: 顶部「切换模组」下拉、右上角语言切换、侧栏渲染、分类折叠、
         滚动高亮、深浅色主题、代码复制、移动端目录抽屉
   ============================================================ */
(function () {
  'use strict';

  var DOCS = window.ANIMA_DOCS || { siteTitle: '文档', mods: [], nav: {} };
  var MODS = DOCS.mods || [];
  var NAV = DOCS.nav || {};
  var VERSIONS = DOCS.versions || {};
  var I18N = window.SITE_I18N || { zh: {} };
  var LANGS = window.SITE_LANGS || [{ code: 'zh', label: '简体中文' }];

  var THEME_KEY = 'anima-doc-theme';
  var LANG_KEY = 'anima-doc-lang';

  var currentTheme = 'light';
  var currentLang = 'zh';

  /* ---------- 当前是哪个模组 / 哪一个页面 ---------- */
  function pathName() {
    return decodeURIComponent(location.pathname);
  }

  function pathSegments() {
    return pathName().split('/').filter(function (p) { return p !== ''; });
  }

  function currentMod() {
    var path = pathName();
    for (var i = 0; i < MODS.length; i++) {
      if (path.indexOf('/' + MODS[i].id + '/') !== -1) return MODS[i];
    }
    return null;
  }

  /* 页面 key = 相对站点根的路径(含版本目录),如 anima/26.1/api.html */
  function currentPageKey() {
    var segs = pathSegments();
    var mod = currentMod();
    if (!mod) return segs.length ? segs[segs.length - 1] : 'index.html';
    var idx = segs.indexOf(mod.id);
    var rest = segs.slice(idx + 1).join('/');
    return mod.id + '/' + (rest || 'index.html');
  }

  /* 当前页面的文件名(不含目录) */
  function currentFile() {
    var segs = pathSegments();
    var last = segs.length ? segs[segs.length - 1] : '';
    return /\.[a-z0-9]+$/i.test(last) ? last : 'index.html';
  }

  /* ---------- MC 版本分档(没配 versions 的模组不分档) ---------- */
  function versionsFor(mod) {
    var list = mod ? VERSIONS[mod.id] : null;
    return (list && list.length) ? list : null;
  }

  function defaultVersion(list) {
    for (var i = 0; i < list.length; i++) {
      if (list[i].default) return list[i];
    }
    return list[0];
  }

  /* 地址里模组目录之后的第一段如果命中版本表,它就是当前版本 */
  function currentVersion(mod) {
    var list = versionsFor(mod);
    if (!list) return null;
    var segs = pathSegments();
    var idx = segs.indexOf(mod.id);
    var seg = idx >= 0 ? segs[idx + 1] : null;
    for (var i = 0; i < list.length; i++) {
      if (list[i].id === seg) return list[i];
    }
    return null;
  }

  /* 页面里 %mc% / %jdk% 的替换值来自当前版本;不分档的模组原样保留 */
  function fillVersion(text) {
    var mod = currentMod();
    var list = versionsFor(mod);
    if (!list) return text;
    var ver = currentVersion(mod) || defaultVersion(list);
    return String(text)
      .replace(/%mc%/g, ver.mc || ver.label)
      .replace(/%jdk%/g, ver.jdk || '21');
  }

  /* mods 里的 home / icon 都是相对站点根写的(如 anima/index.html),而页面可能在下一层
     (/anima/api.html)。这里算出回到站点根要补的前缀,否则在模组页点另一个模组会拼成
     /anima/damage-engine/index.html 而 404。 */
  function rootBase() {
    var segs = pathName().split('/').filter(function (p) { return p !== ''; });
    /* 末段是文件名(带扩展名)就去掉,剩下的目录层数就是要补的 ../ 个数 */
    if (segs.length && /\.[a-z0-9]+$/i.test(segs[segs.length - 1])) segs.pop();
    var out = '';
    for (var i = 0; i < segs.length; i++) out += '../';
    return out;
  }

  /* ---------- 本地存储(隐私模式下静默失败) ---------- */
  function store(key, value) {
    try { localStorage.setItem(key, value); } catch (e) {}
  }
  function read(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }

  /* ---------- 顶栏:站点标题 + 模组切换下拉(标题右侧) ---------- */
  function initTopbar() {
    var select = document.getElementById('docSelect');
    var btn = document.getElementById('docBtn');
    var menu = document.getElementById('docMenu');
    var label = document.getElementById('docLabel');
    if (!select || !btn || !menu) return;

    var here = currentMod();
    applyBrandIcon(here);

    MODS.forEach(function (mod) {
      var opt = document.createElement('a');
      opt.className = 'doc-option' + (here && here.id === mod.id ? ' active' : '');
      opt.href = rootBase() + mod.home;
      opt.textContent = mod.label;
      if (mod.hint) {
        var hint = document.createElement('span');
        hint.className = 'doc-hint';
        hint.textContent = mod.hint;
        opt.appendChild(hint);
      }
      menu.appendChild(opt);
    });

    if (label) label.textContent = here ? here.label : '切换模组';

    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      closeOtherSelects(select);
      select.classList.toggle('open');
    });
    document.addEventListener('click', function () { select.classList.remove('open'); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') select.classList.remove('open');
    });
  }

  /* 顶栏的几个下拉(模组 / 版本)同时只开一个 */
  function closeOtherSelects(keep) {
    document.querySelectorAll('.doc-select.open').forEach(function (el) {
      if (el !== keep) el.classList.remove('open');
    });
  }

  /* ---------- 顶栏图标:模组页面显示该模组自己的图标(落地页保持站点图标) ---------- */
  function applyBrandIcon(mod) {
    var logo = document.querySelector('.brand .logo');
    if (!logo || !mod || !mod.icon) return;
    logo.src = rootBase() + mod.icon;
    logo.alt = mod.label || '';
    /* 模组图标细节多,用平滑缩放而不是 style.css 里给站点图标定的像素化 */
    logo.classList.add('logo-mod');
  }

  /* ---------- 顶栏:MC 版本下拉(紧挨着模组下拉;只有配了 versions 的模组才有) ---------- */
  function initVersionSelect() {
    var mod = currentMod();
    var list = versionsFor(mod);
    if (!list) return;

    var docSelect = document.getElementById('docSelect');
    if (!docSelect || !docSelect.parentNode) return;

    var here = currentVersion(mod) || defaultVersion(list);
    var file = currentFile();

    var box = document.createElement('div');
    box.className = 'doc-select ver-select';
    box.id = 'verSelect';

    var btn = document.createElement('button');
    btn.className = 'doc-current';
    btn.type = 'button';
    btn.id = 'verBtn';
    btn.title = 'MC';

    var icon = document.createElement('i');
    icon.className = 'fa-solid fa-code-branch chev';
    btn.appendChild(icon);

    var label = document.createElement('span');
    label.id = 'verLabel';
    /* 这里放的是版本号本身,不能挂 data-i18n,否则会被词典文案覆盖 */
    label.textContent = here.label;
    btn.appendChild(label);

    var caret = document.createElement('i');
    caret.className = 'fa-solid fa-chevron-down chev';
    btn.appendChild(caret);

    var menu = document.createElement('div');
    menu.className = 'doc-menu';
    menu.id = 'verMenu';

    list.forEach(function (v) {
      var opt = document.createElement('a');
      opt.className = 'doc-option' + (v.id === here.id ? ' active' : '');
      /* 切版本时尽量停在同一个页面,没有那个文件就回该版本首页 */
      opt.href = rootBase() + mod.id + '/' + v.id + '/' + file;
      opt.textContent = v.label;
      if (v.mc) {
        var hint = document.createElement('span');
        hint.className = 'doc-hint';
        hint.textContent = 'Minecraft ' + v.mc;
        opt.appendChild(hint);
      }
      menu.appendChild(opt);
    });

    box.appendChild(btn);
    box.appendChild(menu);
    docSelect.parentNode.insertBefore(box, docSelect.nextSibling);

    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      closeOtherSelects(box);
      box.classList.toggle('open');
    });
    document.addEventListener('click', function () { box.classList.remove('open'); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') box.classList.remove('open');
    });
  }

  /* ---------- 侧栏:按 nav.js 里当前页的配置渲染 ---------- */
  function renderNav() {
    var nav = document.getElementById('sidebar');
    if (!nav) return;

    var groups = NAV[currentPageKey()] || [];
    /* 落地页没有侧栏:让正文占满整行 */
    if (!groups.length) {
      var layout = document.querySelector('.layout');
      if (layout) layout.classList.add('no-side');
      return;
    }

    groups.forEach(function (group, index) {
      var section = document.createElement('div');
      /* 第一个分类默认展开,其余默认收起 */
      section.className = 'nav-section' + (index > 0 ? ' collapsed' : '');

      var head = document.createElement('button');
      head.className = 'nav-group-btn';
      head.type = 'button';

      var title = document.createElement('span');
      title.textContent = group.group;
      if (group.key) title.setAttribute('data-i18n', group.key);
      var chev = document.createElement('i');
      chev.className = 'fa-solid fa-chevron-right chev';

      head.appendChild(title);
      head.appendChild(chev);
      section.appendChild(head);

      var items = document.createElement('div');
      items.className = 'nav-items';
      (group.items || []).forEach(function (item) {
        var a = document.createElement('a');
        a.setAttribute('href', item.href);
        a.textContent = item.label;
        if (item.key) a.setAttribute('data-i18n', item.key);
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

  /** 记下每个带 data-i18n 的元素最初的文字(页面里写的中文),切换语言时用它兜底。 */
  function snapshotOriginal() {
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      if (el.getAttribute('data-i18n-orig') == null) {
        el.setAttribute('data-i18n-orig', el.innerHTML);
      }
    });
  }

  function applyLang(lang) {
    var dict = I18N[lang] || I18N.zh || {};
    currentLang = lang;
    document.documentElement.lang = (lang === 'zh') ? 'zh-CN' : (lang === 'zhTW' ? 'zh-Hant' : 'en');

    /* data-i18n 标记的元素:没有对应词条时回到页面原本的文字(中文回退) */
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      var orig = el.getAttribute('data-i18n-orig');
      if (dict[key] != null) {
        el.innerHTML = fillVersion(dict[key]);
      } else if (orig != null) {
        el.innerHTML = fillVersion(orig);
      }
    });

    /* 没有 data-i18n 的几处固定文案 */
    var brand = document.getElementById('brandName');
    if (brand) brand.textContent = dict['site.title'] || DOCS.siteTitle || '文档';
    if (!currentMod()) {
      var dl = document.getElementById('docLabel');
      if (dl) dl.textContent = dict['doc.switch'] || '切换模组';
    }
    document.querySelectorAll('.copy-btn').forEach(function (b) {
      b.textContent = dict['btn.copy'] || '复制';
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
    if (!select || !btn || !menu) return;

    LANGS.forEach(function (lang) {
      var opt = document.createElement('button');
      opt.className = 'lang-option';
      opt.type = 'button';
      opt.textContent = lang.label;
      opt.setAttribute('data-lang', lang.code);
      opt.addEventListener('click', function () {
        applyLang(lang.code);
        select.classList.remove('open');
      });
      menu.appendChild(opt);
    });

    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      select.classList.toggle('open');
    });
    document.addEventListener('click', function () { select.classList.remove('open'); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') select.classList.remove('open');
    });

    var saved = read(LANG_KEY);
    applyLang(langMeta(saved) ? saved : 'zh');
  }

  /* ---------- 移动端那个「目录」按钮:图标保留,文字可翻译 ---------- */
  function initMenuButton() {
    var mb = document.getElementById('menuBtn');
    if (!mb) return;
    mb.textContent = '';
    var icon = document.createElement('i');
    icon.className = 'fa-solid fa-bars';
    var text = document.createElement('span');
    text.setAttribute('data-i18n', 'btn.menu');
    text.textContent = '目录';
    mb.appendChild(icon);
    mb.appendChild(document.createTextNode(' '));
    mb.appendChild(text);
  }

  /* ---------- 深色 / 浅色主题 ---------- */
  function applyTheme(theme) {
    currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);

    var icon = document.querySelector('#themeBtn i');
    if (icon) icon.className = theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';

    var btn = document.getElementById('themeBtn');
    if (btn) btn.setAttribute('aria-label', theme === 'dark' ? '切换到浅色' : '切换到深色');
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
          btn.textContent = dict['btn.copied'] || '已复制';
          setTimeout(function () { btn.textContent = dict['btn.copy'] || '复制'; }, 1200);
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

    menuBtn.addEventListener('click', function (e) {
      e.stopPropagation();
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
  initTopbar();
  initVersionSelect();
  renderNav();
  initMenuButton();
  initCopyButtons();
  snapshotOriginal();  // 必须在 renderNav 之后:侧栏是脚本生成的
  initLangSelect();
  initCollapse();
  initScrollSpy();
  initDrawer();
})();
