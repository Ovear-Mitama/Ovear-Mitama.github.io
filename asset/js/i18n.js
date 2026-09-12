/* ============================================================
   Damage Engine API 文档 - 多语言词典
   新增文案:在 zh / en 中各加一条同名字典键,并在 api.html 中用
   data-i18n="键名" 标记;代码块内的注释/字符串同样支持 data-i18n。
   ============================================================ */
/* 可选语言(供右上角语言下拉渲染) */
window.DE_LANGS = [
  { code: 'zh', label: '简体中文' },
  { code: 'zhTW', label: '繁體中文' },
  { code: 'en', label: 'English' }
];

window.DE_I18N = {
  zh: {
    'btn.menu': '目录',
    'brand.title': 'Damage Engine API',

    /* 侧栏分类与条目 */
    'nav.group.start': '入门',
    'nav.group.rating': '评分 API',
    'nav.group.general': '通用',
    'nav.overview': '简介',
    'nav.requirements': '前置条件',
    'nav.quickstart': '快速开始',
    'nav.register': '注册加分项',
    'nav.reference': 'API 参考',
    'nav.example': '完整示例',
    'nav.ingame': '在游戏内查看',
    'nav.notes': '注意事项',

    /* 首屏 */
    'hero.title': 'Damage Engine API',
    'hero.lead': '为其他模组提供的扩展接口。当前包含<strong>评分 API（加分项）</strong>，后续将持续划分并扩展更多 API。',

    /* 简介 */
    'sec.overview': '简介',
    'overview.p1': '通过注册一个 <code class="inline">BonusProvider</code>，让其他模组的自定义规则参与 Damage Engine 的评分（Rating）计算——<strong>加分条件由你自己的模组定义</strong>。',
    'overview.p2': 'Damage Engine 只负责在每次命中时回调所有已注册的加分项并累加返回值，具体在什么条件下加分、加多少分，完全由你的模组决定。',
    'overview.note.label': '提示：',
    'overview.note.body': 'API 位于 <code class="inline">damage.engine.api</code> 包，Fabric 与 NeoForge 通用，注册方式完全一致。',

    /* 前置条件 */
    'sec.requirements': '前置条件',
    'requirements.text': '适用于 Damage Engine 1.4.7+（含）。',

    /* 快速开始 */
    'sec.quickstart': '快速开始',
    'quick.li1': '在你的模组初始化阶段引入 <code class="inline">damage.engine.api.DamageEngineApi</code>。',
    'quick.li2': '调用 <code class="inline">DamageEngineApi.registerBonusProvider(...)</code> 注册加分项。',
    'quick.li3': '每次命中时，Damage Engine 会回调你的 <code class="inline">bonusOnHit(...)</code>，返回值即为该次命中增加的分数。',
    'quick.li4': '打开配置界面 → <strong>评分</strong> → <strong>其他mod加分项</strong>，可看到已注册的加分项列表。',
    'quick.deps.title': '添加依赖',
    'quick.deps.p': '将 Damage Engine 作为编译期依赖（按你使用的发布渠道替换坐标）：',
    'quick.tip.label': '建议：',
    'quick.tip.body': '加分项 API 只在运行时生效，推荐使用 <code class="inline">compileOnly</code> / <code class="inline">modCompileOnly</code>，并在 <code class="inline">fabric.mod.json</code> / <code class="inline">neoforge.mods.toml</code> 中声明可选依赖。',

    /* 注册加分项 */
    'sec.register': '注册加分项',
    'register.p': '最小示例：单次伤害 ≥ 100 时额外 +50 分。',

    /* API 参考 */
    'sec.reference': 'API 参考',
    'ref.th.method': '方法',
    'ref.th.member': '成员',
    'ref.th.type': '类型',
    'ref.th.desc': '说明',
    'ref.api.r1': '注册一个加分项。同一 <code class="inline">id()</code> 只注册一次，重复注册会被忽略并返回 <code class="inline">false</code>。',
    'ref.api.r2': '返回当前已注册的全部加分项（只读）。',
    'ref.bp.r1': '唯一标识，建议使用 <code class="inline">命名空间:路径</code> 形式；用于去重与界面展示。',
    'ref.bp.r2': '在配置界面“其他mod加分项”中展示的名称。',
    'ref.bp.r3': '每次命中时计算加分；返回 <code class="inline">0</code> 或负数表示不加分。',
    'ref.hit.r1': '本次命中造成的伤害',
    'ref.hit.r2': '本次命中是否被判定为暴击',
    'ref.ss.r1': '当前连击数',
    'ref.ss.r2': '命中次数（含暴击）',
    'ref.ss.r3': '暴击次数',
    'ref.ss.r4': '本次评分会话的累计伤害',

    /* 完整示例 */
    'sec.example': '完整示例',
    'example.p': '条件完全自定义：连击 ≥ 5 的暴击额外加分，且对单次高额伤害追加奖励。',

    /* 游戏内查看 */
    'sec.ingame': '在游戏内查看',
    'ingame.p': '打开配置界面（默认按键可在“按键”标签页查看），进入 <strong>评分</strong> 标签页，展开“单次伤害大小加分”下方的 <strong>其他mod加分项</strong>：',
    'ingame.li1': '已注册的加分项会以 <code class="inline">显示名 (id)</code> 的形式列出；',
    'ingame.li2': '若没有任何模组注册加分项，该分组内会显示一行占位提示。',

    /* 注意事项 */
    'sec.notes': '注意事项',
    'notes.li1': '<strong>幂等注册：</strong><code class="inline">id()</code> 相同的加分项只注册一次，适合在模组初始化时无条件调用。',
    'notes.li2': '<strong>异常隔离：</strong>单个加分项抛出异常不会影响整体评分，但请尽量保证实现健壮。',
    'notes.li3': '<strong>调用次数：</strong>每次命中会对“每个已注册加分项”调用一次 <code class="inline">bonusOnHit</code>，请保持实现轻量。',
    'notes.li4': '<strong>评分在客户端计算：</strong>加分项用于本地评分显示，请勿在其中执行昂贵的网络或世界操作。',
    'notes.li5': '<strong>条件自定义：</strong>Damage Engine 只负责在命中时回调并累加返回值，具体加分规则完全由你的模组实现。',

    /* 代码块内的注释与示例字符串 */
    'code.example.name': '重击额外加分',
    'code.bonus.name': '连击暴击奖励',
    'code.gradle.c1': '// 若通过 Maven 发布，替换为实际坐标',
    'code.gradle.c2': '// 或者直接引用本地 jar',
    'code.bonus.c1': '// 条件 1：连击 ≥ 5 且本次为暴击',
    'code.bonus.c2': '// 条件 2：本次伤害超过 50',
    'code.bonus.c3': '// 条件 3：整场累计伤害达到阈值后额外奖励',

    /* 控件 */
    'btn.copy': '复制',
    'btn.copied': '已复制',
    'footer.text': 'Damage Engine API · 适用于 Damage Engine 1.4.7+（含）'
  },

  en: {
    'btn.menu': 'Menu',
    'brand.title': 'Damage Engine API',

    'nav.group.start': 'Getting Started',
    'nav.group.rating': 'Rating API',
    'nav.group.general': 'General',
    'nav.overview': 'Overview',
    'nav.requirements': 'Requirements',
    'nav.quickstart': 'Quick Start',
    'nav.register': 'Register a Bonus',
    'nav.reference': 'API Reference',
    'nav.example': 'Full Example',
    'nav.ingame': 'In-Game Preview',
    'nav.notes': 'Notes',

    'hero.title': 'Damage Engine API',
    'hero.lead': 'Extension APIs for other mods. Currently includes the <strong>Rating API (bonus providers)</strong>; more APIs will be added over time.',

    'sec.overview': 'Overview',
    'overview.p1': 'Register a <code class="inline">BonusProvider</code> to let your own rules take part in Damage Engine\u2019s Rating calculation \u2014 <strong>the bonus conditions are defined by your mod</strong>.',
    'overview.p2': 'Damage Engine only invokes every registered provider on each hit and sums up the returned values. When and how much to add is entirely up to your mod.',
    'overview.note.label': 'Note:',
    'overview.note.body': 'The API lives in the <code class="inline">damage.engine.api</code> package and is shared by Fabric and NeoForge \u2014 registration is identical on both.',

    'sec.requirements': 'Requirements',
    'requirements.text': 'Works with Damage Engine 1.4.7+ (inclusive).',

    'sec.quickstart': 'Quick Start',
    'quick.li1': 'Reference <code class="inline">damage.engine.api.DamageEngineApi</code> during your mod initialization.',
    'quick.li2': 'Call <code class="inline">DamageEngineApi.registerBonusProvider(...)</code> to register a bonus provider.',
    'quick.li3': 'On every hit, Damage Engine calls your <code class="inline">bonusOnHit(...)</code>; the returned value is the score added for that hit.',
    'quick.li4': 'Open the config screen \u2192 <strong>Rating</strong> \u2192 <strong>Other Mod Bonuses</strong> to see all registered providers.',
    'quick.deps.title': 'Adding the dependency',
    'quick.deps.p': 'Add Damage Engine as a compile-time dependency (replace the coordinates with your distribution channel):',
    'quick.tip.label': 'Tip:',
    'quick.tip.body': 'The bonus API is runtime-only. Prefer <code class="inline">compileOnly</code> / <code class="inline">modCompileOnly</code> and declare it as an optional dependency in <code class="inline">fabric.mod.json</code> / <code class="inline">neoforge.mods.toml</code>.',

    'sec.register': 'Register a Bonus',
    'register.p': 'Minimal example: add +50 points when a single hit deals at least 100 damage.',

    'sec.reference': 'API Reference',
    'ref.th.method': 'Method',
    'ref.th.member': 'Member',
    'ref.th.type': 'Type',
    'ref.th.desc': 'Description',
    'ref.api.r1': 'Registers a bonus provider. The same <code class="inline">id()</code> is only registered once; duplicates are ignored and return <code class="inline">false</code>.',
    'ref.api.r2': 'Returns all currently registered providers (read-only).',
    'ref.bp.r1': 'Unique identifier; <code class="inline">namespace:path</code> is recommended. Used for de-duplication and display.',
    'ref.bp.r2': 'Name shown in the \u201cOther Mod Bonuses\u201d section of the config screen.',
    'ref.bp.r3': 'Computes the bonus for one hit; return <code class="inline">0</code> or a negative value to add nothing.',
    'ref.hit.r1': 'Damage dealt by this hit',
    'ref.hit.r2': 'Whether this hit was treated as a critical hit',
    'ref.ss.r1': 'Current combo count',
    'ref.ss.r2': 'Number of hits (including crits)',
    'ref.ss.r3': 'Number of critical hits',
    'ref.ss.r4': 'Total damage of the current rating session',

    'sec.example': 'Full Example',
    'example.p': 'Fully custom conditions: extra points for crits at combo \u2265 5, plus a reward for high single-hit damage.',

    'sec.ingame': 'In-Game Preview',
    'ingame.p': 'Open the config screen (see the Keybinds tab for the default key), go to the <strong>Rating</strong> tab and expand <strong>Other Mod Bonuses</strong> below \u201cSingle-Hit Damage Bonus\u201d:',
    'ingame.li1': 'Registered providers are listed as <code class="inline">displayName (id)</code>;',
    'ingame.li2': 'if no mod registered any provider, a placeholder line is shown instead.',

    'sec.notes': 'Notes',
    'notes.li1': '<strong>Idempotent:</strong> providers with the same <code class="inline">id()</code> are registered only once, so calling it unconditionally during init is fine.',
    'notes.li2': '<strong>Exception isolation:</strong> a provider that throws will not break the overall score, but please keep implementations robust.',
    'notes.li3': '<strong>Call count:</strong> <code class="inline">bonusOnHit</code> is called once per hit for every registered provider \u2014 keep it lightweight.',
    'notes.li4': '<strong>Client-side scoring:</strong> providers are used for local rating display; do not perform expensive network or world operations inside them.',
    'notes.li5': '<strong>Custom conditions:</strong> Damage Engine only calls back and sums the returned value \u2014 the rules are entirely up to your mod.',

    'code.example.name': 'Heavy Hit Bonus',
    'code.bonus.name': 'Combo Crit Bonus',
    'code.gradle.c1': '// Replace with the actual coordinates if published to Maven',
    'code.gradle.c2': '// Or reference the local jar directly',
    'code.bonus.c1': '// Condition 1: combo >= 5 and this hit is a crit',
    'code.bonus.c2': '// Condition 2: this hit deals more than 50 damage',
    'code.bonus.c3': '// Condition 3: extra reward once total session damage reaches the threshold',

    'btn.copy': 'Copy',
    'btn.copied': 'Copied',
    'footer.text': 'Damage Engine API \u00b7 Works with Damage Engine 1.4.7+ (inclusive)'
  },

  zhTW: {
    'btn.menu': '目錄',
    'brand.title': 'Damage Engine API',

    /* 側欄分類與條目 */
    'nav.group.start': '入門',
    'nav.group.rating': '評分 API',
    'nav.group.general': '通用',
    'nav.overview': '簡介',
    'nav.requirements': '前置條件',
    'nav.quickstart': '快速開始',
    'nav.register': '註冊加分項',
    'nav.reference': 'API 參考',
    'nav.example': '完整範例',
    'nav.ingame': '在遊戲內查看',
    'nav.notes': '注意事項',

    /* 首屏 */
    'hero.title': 'Damage Engine API',
    'hero.lead': '為其他模組提供的擴充介面。目前包含<strong>評分 API（加分項）</strong>，後續將持續劃分並擴充更多 API。',

    /* 簡介 */
    'sec.overview': '簡介',
    'overview.p1': '透過註冊一個 <code class="inline">BonusProvider</code>，讓其他模組的自訂規則參與 Damage Engine 的評分（Rating）計算——<strong>加分條件由你自己的模組定義</strong>。',
    'overview.p2': 'Damage Engine 只負責在每次命中時回呼所有已註冊的加分項並累加回傳值，具體在什麼條件下加分、加多少分，完全由你的模組決定。',
    'overview.note.label': '提示：',
    'overview.note.body': 'API 位於 <code class="inline">damage.engine.api</code> 套件，Fabric 與 NeoForge 通用，註冊方式完全一致。',

    /* 前置條件 */
    'sec.requirements': '前置條件',
    'requirements.text': '適用於 Damage Engine 1.4.7+（含）。',

    /* 快速開始 */
    'sec.quickstart': '快速開始',
    'quick.li1': '在你的模組初始化階段引入 <code class="inline">damage.engine.api.DamageEngineApi</code>。',
    'quick.li2': '呼叫 <code class="inline">DamageEngineApi.registerBonusProvider(...)</code> 註冊加分項。',
    'quick.li3': '每次命中時，Damage Engine 會回呼你的 <code class="inline">bonusOnHit(...)</code>，回傳值即為該次命中增加的分數。',
    'quick.li4': '開啟設定介面 → <strong>評分</strong> → <strong>其他mod加分項</strong>，可看到已註冊的加分項清單。',
    'quick.deps.title': '加入依賴',
    'quick.deps.p': '將 Damage Engine 作為編譯期依賴（依你使用的發布管道替換座標）：',
    'quick.tip.label': '建議：',
    'quick.tip.body': '加分項 API 只在執行時生效，推薦使用 <code class="inline">compileOnly</code> / <code class="inline">modCompileOnly</code>，並在 <code class="inline">fabric.mod.json</code> / <code class="inline">neoforge.mods.toml</code> 中宣告為可選依賴。',

    /* 註冊加分項 */
    'sec.register': '註冊加分項',
    'register.p': '最小範例：單次傷害 ≥ 100 時額外 +50 分。',

    /* API 參考 */
    'sec.reference': 'API 參考',
    'ref.th.method': '方法',
    'ref.th.member': '成員',
    'ref.th.type': '型別',
    'ref.th.desc': '說明',
    'ref.api.r1': '註冊一個加分項。同一 <code class="inline">id()</code> 只註冊一次，重複註冊會被忽略並回傳 <code class="inline">false</code>。',
    'ref.api.r2': '回傳目前所有已註冊的加分項（唯讀）。',
    'ref.bp.r1': '唯一識別碼，建議使用 <code class="inline">命名空間:路徑</code> 形式；用於去重與介面顯示。',
    'ref.bp.r2': '在設定介面「其他mod加分項」中顯示的名稱。',
    'ref.bp.r3': '每次命中時計算加分；回傳 <code class="inline">0</code> 或負數表示不加分。',
    'ref.hit.r1': '本次命中造成的傷害',
    'ref.hit.r2': '本次命中是否判定為暴擊',
    'ref.ss.r1': '目前連擊數',
    'ref.ss.r2': '命中次數（含暴擊）',
    'ref.ss.r3': '暴擊次數',
    'ref.ss.r4': '本次評分階段的累計傷害',

    /* 完整範例 */
    'sec.example': '完整範例',
    'example.p': '條件完全自訂：連擊 ≥ 5 的暴擊額外加分，並對單次高額傷害追加獎勵。',

    /* 遊戲內查看 */
    'sec.ingame': '在遊戲內查看',
    'ingame.p': '開啟設定介面（預設按鍵可在「按鍵」頁籤查看），進入 <strong>評分</strong> 頁籤，展開「單次傷害大小加分」下方的 <strong>其他mod加分項</strong>：',
    'ingame.li1': '已註冊的加分項會以 <code class="inline">顯示名 (id)</code> 的形式列出；',
    'ingame.li2': '若沒有任何模組註冊加分項，該分組內會顯示一行佔位提示。',

    /* 注意事項 */
    'sec.notes': '注意事項',
    'notes.li1': '<strong>冪等註冊：</strong><code class="inline">id()</code> 相同的加分項只註冊一次，適合在模組初始化時無條件呼叫。',
    'notes.li2': '<strong>例外隔離：</strong>單一加分項拋出例外不會影響整體評分，但請盡量確保實作穩健。',
    'notes.li3': '<strong>呼叫次數：</strong>每次命中會對「每個已註冊加分項」呼叫一次 <code class="inline">bonusOnHit</code>，請保持實作輕量。',
    'notes.li4': '<strong>評分在客戶端計算：</strong>加分項用於本機評分顯示，請勿在其中執行昂貴的網路或世界操作。',
    'notes.li5': '<strong>條件自訂：</strong>Damage Engine 只負責在命中時回呼並累加回傳值，具體加分規則完全由你的模組實作。',

    /* 程式碼區塊內的註解與範例字串 */
    'code.example.name': '重擊額外加分',
    'code.bonus.name': '連擊暴擊獎勵',
    'code.gradle.c1': '// 若透過 Maven 發布，替換為實際座標',
    'code.gradle.c2': '// 或者直接引用本機 jar',
    'code.bonus.c1': '// 條件 1：連擊 ≥ 5 且本次為暴擊',
    'code.bonus.c2': '// 條件 2：本次傷害超過 50',
    'code.bonus.c3': '// 條件 3：整場累計傷害達到門檻後額外獎勵',

    /* 控制項 */
    'btn.copy': '複製',
    'btn.copied': '已複製',
    'footer.text': 'Damage Engine API · 適用於 Damage Engine 1.4.7+（含）'
  }
};
