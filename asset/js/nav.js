/* ============================================================
   Damage Engine API 文档 - 侧栏导航配置
   新增 API:在此数组追加一个分组(或往已有分组加条目)即可,
   侧栏由 asset/js/app.js 依此渲染。
     key   : 分类标题的词典键
     items : 条目列表 { href: 页面锚点, key: 条目标题词典键 }
   ============================================================ */
window.DE_NAV = [
  {
    key: 'nav.group.start',
    items: [
      { href: '#overview', key: 'nav.overview' },
      { href: '#requirements', key: 'nav.requirements' },
      { href: '#quickstart', key: 'nav.quickstart' }
    ]
  },
  {
    /* 评分 API:后续可在此分组内继续扩展 */
    key: 'nav.group.rating',
    items: [
      { href: '#register', key: 'nav.register' },
      { href: '#reference', key: 'nav.reference' },
      { href: '#example', key: 'nav.example' }
    ]
  },
  {
    key: 'nav.group.general',
    items: [
      { href: '#ingame', key: 'nav.ingame' },
      { href: '#notes', key: 'nav.notes' }
    ]
  }
];
