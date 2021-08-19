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

function fix_link(a) {
  let href = a.getAttribute('href');
  if (href.startsWith('?')) {
    href = href.substring(1);
    a.onclick = e => {
      if (!e.ctrlKey) {
        e.preventDefault();
        load_page(href);
      }
    };
  } else if (href!=='.') {
    a.target = '_blank';
  }
}
function fix_all_links(x) {
  for (const a of x.getElementsByTagName('a'))
    fix_link(a);
}

const pages = [
  ['about','About me','tex'],
  ['contact','Contact me','sf'],
  ['exp','Experience','tex'],
  ['research','Research','tex'],
  ['bib','Publications','tex'],
  ['tdi','TDI project','tex'],
  ['tdi0',null,'tex'],
  ['tdi1',null,'tex']
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
    fix_all_links(main);
    number_figures(main);
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

function number_figures(node) {
  for (const [i,x] of node.querySelectorAll('figure > figcaption').entries()) {
    x.innerHTML = `Fig. ${i+1}: ` + x.innerHTML;
    x.parentNode.id = `fig${i+1}`;
  }
}

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
    const re_http = /^https?:\/\//;
    for (const [page,name] of pages) {
      if (name) {
        const a = make(ul,'li','a');
        a.textContent = name;
        a.href = re_http.test(page) ? page : '?'+encodeURIComponent(page);
      }
    }
  }
  fix_all_links(document.documentElement);
});
