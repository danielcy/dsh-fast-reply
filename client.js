window.__ModuleLoader__.load({
  id: 'dsh-fast-reply',
  factory(require) {
    const React = require('react')
    const h = React.createElement
    // Versioned storage key kept stable across the rename so existing replies are not lost.
    const STORAGE_KEY = 'dsh.quick-replies.v1'
    const DEFAULTS = [
      { id: 'review', name: '代码审查', content: '请使用 @dsh-doc 先确认规范，然后审查下面的改动，重点关注 bug、回归和测试缺口。' },
      { id: 'explain', name: '解释代码', content: '请解释下面这段代码的职责、关键流程和潜在风险，并给出简短示例。' },
    ]
    const FALLBACK = { button: '快捷回复', manage: '管理', add: '新增快捷回复', edit: '编辑', remove: '删除', save: '保存', cancel: '取消', name: '名称', content: '内容', empty: '还没有快捷回复', hint: '支持文本与技能引用，例如 @dsh-doc', deleteConfirm: '确定删除这条快捷回复吗？' }
    const STYLE = `
      .dsh-qr { --qr-bg:#fff; --qr-panel:#fff; --qr-text:#1f2937; --qr-muted:#6b7280; --qr-border:#d7dde5; --qr-hover:#f0fdfa; --qr-accent:#0f766e; --qr-shadow:0 16px 42px rgba(15,23,42,.18); color:var(--qr-text); font-family:inherit; }
      [data-ds-dark-theme] .dsh-qr { --qr-bg:#20242b; --qr-panel:#252b34; --qr-text:#f3f4f6; --qr-muted:#aab3c0; --qr-border:#424b59; --qr-hover:#173b3a; --qr-shadow:0 18px 44px rgba(0,0,0,.5); }
      @media (prefers-color-scheme: dark) { .dsh-qr:not([data-force-light]) { --qr-bg:#20242b; --qr-panel:#252b34; --qr-text:#f3f4f6; --qr-muted:#aab3c0; --qr-border:#424b59; --qr-hover:#173b3a; --qr-shadow:0 18px 44px rgba(0,0,0,.5); } }
      :root[data-ds-theme-source="light"] .dsh-qr { --qr-bg:#fff; --qr-panel:#fff; --qr-text:#1f2937; --qr-muted:#6b7280; --qr-border:#d7dde5; --qr-hover:#f0fdfa; --qr-shadow:0 16px 42px rgba(15,23,42,.18); }
      :root[data-ds-theme-source="dark"] .dsh-qr { --qr-bg:#20242b; --qr-panel:#252b34; --qr-text:#f3f4f6; --qr-muted:#aab3c0; --qr-border:#424b59; --qr-hover:#173b3a; --qr-shadow:0 18px 44px rgba(0,0,0,.5); }
      .dsh-qr button { font:inherit; } .dsh-qr-trigger { display:inline-flex; align-items:center; justify-content:center; flex:0 0 34px; width:34px; height:34px; min-width:34px; border:1px solid var(--qr-border); border-radius:8px; padding:0; color:var(--qr-text); background:var(--qr-bg); cursor:pointer; transition:.15s ease; }
      .dsh-qr-trigger:hover:not(:disabled) { border-color:var(--qr-accent); background:var(--qr-hover); } .dsh-qr-trigger:disabled { opacity:.5; cursor:not-allowed; }
      .dsh-qr-panel { position:absolute; right:0; bottom:calc(100% + 8px); z-index:30; width:290px; max-width:calc(100vw - 20px); overflow:hidden; border:1px solid var(--qr-border); border-radius:10px; background:var(--qr-panel); box-shadow:var(--qr-shadow); }
      .dsh-qr-head { display:flex; align-items:center; justify-content:space-between; gap:6px; padding:6px 8px; border-bottom:1px solid var(--qr-border); } .dsh-qr-title { font-size:12px; font-weight:650; } .dsh-qr-subtitle { display:none; }
      .dsh-qr-list { display:grid; gap:1px; max-height:220px; overflow:hidden; padding:4px; } .dsh-qr-item { display:block; width:100%; border:0; border-radius:6px; padding:7px 8px; text-align:left; color:var(--qr-text); background:transparent; cursor:pointer; transition:background .12s ease; } .dsh-qr .dsh-qr-item:hover, .dsh-qr .dsh-qr-item:focus-visible { background:rgba(15,118,110,.1); outline:none; }
      .dsh-qr-item strong { display:block; overflow:hidden; font-size:12px; font-weight:600; text-overflow:ellipsis; white-space:nowrap; transition:color .12s ease; } .dsh-qr .dsh-qr-item:hover strong { color:var(--qr-accent); } .dsh-qr-item span { display:block; margin-top:2px; overflow:hidden; color:var(--qr-muted); font-size:10px; line-height:1.3; text-overflow:ellipsis; white-space:nowrap; }
      .dsh-qr-manage { display:grid; gap:1px; padding:5px; } .dsh-qr-row { display:flex; align-items:center; gap:5px; padding:6px 4px; border-bottom:1px solid var(--qr-border); } .dsh-qr-row-name { flex:1; min-width:0; overflow:hidden; font-size:11px; text-overflow:ellipsis; white-space:nowrap; } .dsh-qr-small { border:0; border-radius:5px; padding:3px 5px; color:var(--qr-muted); background:transparent; cursor:pointer; font-size:10px; } .dsh-qr-small:hover { color:var(--qr-text); background:var(--qr-hover); } .dsh-qr-primary { border:0; border-radius:6px; padding:5px 7px; color:#fff; background:var(--qr-accent); cursor:pointer; font-size:10px; } .dsh-qr-primary:disabled { opacity:.5; cursor:not-allowed; }
      .dsh-qr-form { display:grid; gap:6px; padding:8px; border-top:1px solid var(--qr-border); } .dsh-qr-input { width:100%; box-sizing:border-box; border:1px solid var(--qr-border); border-radius:6px; padding:6px 7px; outline:none; color:var(--qr-text); background:var(--qr-bg); font:inherit; font-size:11px; } .dsh-qr-input:focus { border-color:var(--qr-accent); } .dsh-qr-actions { display:flex; justify-content:flex-end; gap:5px; }
      .dsh-qr-foot { display:none; }
    `
    function load() { try { const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null'); return Array.isArray(value) ? value.filter(x => x && x.id && x.name && typeof x.content === 'string') : DEFAULTS } catch (_) { return DEFAULTS } }
    function save(value) { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(value)) } catch (_) {} }
    function TextButton({ children, onClick, primary, disabled }) { return h(primary ? 'button' : 'button', { type:'button', className: primary ? 'dsh-qr-primary' : 'dsh-qr-small', onClick, disabled }, children) }
    function Editor({ value, onChange, labels, onSave, onCancel }) { return h('div', { className:'dsh-qr-form' }, h('input', { className:'dsh-qr-input', value:value.name, placeholder:labels.name, 'aria-label':labels.name, onChange:e=>onChange({ ...value, name:e.target.value }) }), h('textarea', { className:'dsh-qr-input', rows:4, value:value.content, placeholder:labels.content, 'aria-label':labels.content, onChange:e=>onChange({ ...value, content:e.target.value }) }), h('div', { className:'dsh-qr-actions' }, h(TextButton, { onClick:onCancel }, labels.cancel), h(TextButton, { primary:true, disabled:!value.name.trim() || !value.content.trim(), onClick:onSave }, labels.save))) }
    function FastReply({ inputActions, onActiveChange, locked, t }) {
      const label = (key) => { try { const value = t(key); return typeof value === 'string' && value.trim() ? value : FALLBACK[key] } catch (_) { return FALLBACK[key] } }
      const labels = Object.keys(FALLBACK).reduce((out,key) => { out[key] = label(key); return out }, {})
      const [open,setOpen] = React.useState(false); const [manage,setManage] = React.useState(false); const [editing,setEditing] = React.useState(null); const [replies,setReplies] = React.useState(load); const [span,setSpan] = React.useState(null)
      const rootRef = React.useRef(null)
      React.useEffect(() => { const style = document.createElement('style'); style.textContent=STYLE; document.head.appendChild(style); return () => style.remove() }, [])
      React.useEffect(() => () => onActiveChange(false), [onActiveChange])
      const close = () => { setOpen(false); setManage(false); setEditing(null); setSpan(null); onActiveChange(false) }
      const closeRef = React.useRef(close)
      closeRef.current = close
      React.useEffect(() => {
        if (!open) return
        const onDocMouseDown = e => { if (rootRef.current && !rootRef.current.contains(e.target)) closeRef.current() }
        document.addEventListener('mousedown', onDocMouseDown)
        return () => document.removeEventListener('mousedown', onDocMouseDown)
      }, [open])
      const toggle = () => { if (open) close(); else { setSpan(inputActions.captureInsertion()); setOpen(true); onActiveChange(true) } }
      const choose = item => { if (inputActions.insertText(item.content, span || inputActions.captureInsertion())) close() }
      const commit = value => { const next = value.id ? replies.map(x => x.id===value.id ? { ...value, name:value.name.trim() } : x) : [...replies, { ...value, id:`reply-${Date.now()}`, name:value.name.trim() }]; setReplies(next); save(next); setEditing(null) }
      const trigger = h('button', { type:'button', className:'dsh-qr-trigger', disabled:locked, onClick:toggle, 'aria-expanded':open, 'aria-label':labels.button, title:labels.button }, h('span', { 'aria-hidden':true }, '✦'))
      const header = h('div', { className:'dsh-qr-head' }, h('div', null, h('div', { className:'dsh-qr-title' }, labels.button)), h(TextButton, { onClick:()=>{setManage(!manage);setEditing(null)} }, manage ? labels.cancel : labels.manage))
      const list = h('div', { className:'dsh-qr-list' }, replies.length ? replies.map(item=>h('button', { key:item.id, className:'dsh-qr-item', type:'button', title:`${item.name}\n${item.content}`, onClick:()=>choose(item) }, h('strong', null, item.name), h('span', null, item.content))) : h('div', { style:{padding:'14px',color:'var(--qr-muted)',fontSize:12} }, labels.empty))
      const manager = h('div', { className:'dsh-qr-manage' }, replies.map(item=>h('div', { className:'dsh-qr-row', key:item.id }, h('span', { className:'dsh-qr-row-name' }, item.name), h(TextButton, { onClick:()=>setEditing(item) }, labels.edit), h(TextButton, { onClick:()=>{ if (confirm(labels.deleteConfirm)){ const next=replies.filter(x=>x.id!==item.id);setReplies(next);save(next) } } }, labels.remove))), editing ? h(Editor, { value:editing, onChange:setEditing, labels, onSave:()=>commit(editing), onCancel:()=>setEditing(null) }) : h('button', { type:'button', className:'dsh-qr-primary', onClick:()=>setEditing({id:'',name:'',content:''}) }, labels.add))
      const panel = open && h('div', { className:'dsh-qr-panel', role:'dialog', 'aria-label':labels.button }, header, manage ? manager : list)
      return h('div', { ref:rootRef, className:'dsh-qr', style:{ position:'relative' } }, trigger, panel)
    }
    return { inject:['slots','locale'], apply(ctx) { ctx.effect(() => ctx.locale.register('dshFastReply', { en:{ button:'Quick replies', manage:'Manage', add:'New quick reply', edit:'Edit', remove:'Delete', save:'Save', cancel:'Cancel', name:'Name', content:'Content', empty:'No quick replies yet', hint:'Text and skill references, e.g. @dsh-doc', deleteConfirm:'Delete this quick reply?' }, zh:FALLBACK })); ctx.slots.inject('conversation.input.activity', () => ctx.slots.register({ name:'conversation.input.activity', id:'dsh-fast-reply', locale:'dshFastReply', order:20 }, FastReply)) } }
  },
})
