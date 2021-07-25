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

document.addEventListener('DOMContentLoaded', () => {
  const main = _id('main');
  for (const id of ['contact','bib']) {
    _id(id).onclick = function(){
      fetch('pages/'+id+'.html', { method: 'GET' })
      .then(r => r.text())
      .then(r => { main.innerHTML = r; });
    };
  }
});
