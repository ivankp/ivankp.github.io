const _id = id => document.getElementById(id);
function make(p,...tags) {
  for (const t of tags)
    p = p.appendChild(document.createElement(t))
  return p;
}
function clear(x) {
  for (let c; c = x.firstChild; ) x.removeChild(c);
  return x;
}
const round = x => x.toFixed(4).replace(/\.?0*$/,'');
const last = xs => xs[xs.length-1];

const pages = [
  ['about','About me','tex'],
  ['contact','Contact me'],
  ['edu','Education','tex'],
  ['bib','Publications','tex'],
  ['research','Research']
];

let main;
function load_page(page) {
  let def = null;
  if (page) def = pages.find(x => x[0]===page);
  if (!def) {
    def = pages[0];
    page = def[0];
  }
  fetch('pages/'+page+'.html', { method: 'GET' })
  .then(r => {
    if (r.ok) return r.text();
    throw new Error(`${page}: response status ${r.status}`);
  })
  .then(r => {
    main.innerHTML = r;
    main.className = def[2] || '';
    const s = window.history.state;
    ( (s && s.page===page)
      ? window.history.replaceState
      : window.history.pushState
    ).call( window.history, { page }, '', '?'+encodeURIComponent(page) );
  })
  .catch(e => { alert(e.message); throw e; });
}
window.onpopstate = function(e) {
  if (e.state!==null) load_page(e.state.page);
};

document.addEventListener('DOMContentLoaded', () => {
  main = _id('main');
  { const search = window.location.search.match(/(?<=\?)[^&]+/);
    load_page(search ? decodeURIComponent(search[0]) : null);
  }
  { const ul = make(_id('nav'),'ul');
    for (const [page,name] of pages) {
      const li = make(ul,'li','a');
      li.textContent = name;
      li.href = '?'+encodeURIComponent(page);
      li.onclick = e => {
        e.preventDefault();
        load_page(page);
      };
    }
  }
});
