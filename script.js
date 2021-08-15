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
  ['contact','Contact me','sf'],
  ['exp','Experience','tex'],
  ['research','Research','tex'],
  ['bib','Publications','tex'],
  ['tdi0','TDI project','tex']
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
    ( (!s || s.page===page)
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
  { const s = window.location.search.match(/^\?([^&]+)/);
    load_page(s ? decodeURIComponent(s[1]) : null);
  }
  { let x = window.location.search;
    if (x.length>0 && x[0]==='?') {
      let n = x.indexOf('&',1);
      if (n === -1) n = x.length;
      x = x.substring(1,n);
    } else {
      x = null;
    }
    load_page(x);
  }
  { const ul = make(_id('nav'),'ul');
    for (const [page,name] of pages) {
      const li = make(ul,'li','a');
      li.textContent = name;
      if (page.startsWith('http')) {
        li.href = page;
        li.target = '_blank';
      } else {
        li.href = '?'+encodeURIComponent(page);
        li.onclick = e => {
          if (!e.ctrlKey) {
            e.preventDefault();
            load_page(page);
          }
        };
      }
    }
  }
});
