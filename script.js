const $id = id => document.getElementById(id);
const $ = (p,tag1,...tags) => {
  tag1 = document.createElement(tag1);
  p = p!==null ? p.appendChild(tag1) : tag1;
  for (const t of tags)
    p = p.appendChild(document.createElement(t));
  return p;
};
const clear = p => {
  for (let x; x = p.lastChild; ) x.remove();
  return p;
};
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
  ['about','About me'],
  ['work','Experience'],
  ['skills','Skills'],
  ['edu','Education'],
  ['bib','Publications']
];

let main, nav, burger;
function load_page(page) {
  let def = null;
  if (page) def = pages.find(x => x[0]===page);
  if (!def) {
    def = pages[0];
    page = def[0];
  }
  fetch('pages/'+page+'.html')
  .then(r => {
    if (r.ok) return r.text();
    throw new Error(`${page}: response status ${r.status}`);
  })
  .then(r => {
    main.innerHTML = r;
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

let wide_layout = null;
function layout() {
  if (window.innerWidth > 500) {
    if (wide_layout!==true) {
      wide_layout = true;
      main.parentNode.insertBefore(nav,main);
      main.parentNode.className = 'main-grid';
      burger.style.display = 'none';
      nav.style.display = null;
    }
  } else {
    if (wide_layout!==false) {
      wide_layout = false;
      main.parentNode.className = 'pad';
      nav.style.display = 'none';
      burger.style.display = null;
      burger.appendChild(nav);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  main = $id('main');
  burger = $id('burger');
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
  { nav = $(null,'ul');
    nav.id = 'nav';
    nav.classList.add('sf');
    nav.style.display = 'none';
    const re_http = /^https?:\/\//;
    for (const [page,name] of pages) {
      if (name) {
        const a = $(nav,'li','a');
        a.textContent = name;
        a.href = re_http.test(page) ? page : '?'+encodeURIComponent(page);
      }
    }
    burger.onclick = (e) => {
      nav.style.display = nav.style.display ? null : 'none';
    };
  }
  layout();
  fix_all_links(document.documentElement);

  window.addEventListener('resize',layout);
});
