import { fraction, get, save } from './preferences.mjs';

for (const select of document.querySelectorAll('[data-setting]')) {
  const key = select.dataset.setting;
  const saved = get(key);
  if ([...select.options].some(option => option.value === saved)) select.value = saved;
  function apply() { document.documentElement.dataset[key] = select.value; }
  apply();
  select.addEventListener('change', () => { apply(); save(key, select.value); });
}
const summary = document.querySelector('[data-summary]');
if (summary) {
  const id = summary.dataset.summary;
  for (const [key, label] of [['position', 'Reprendre'], ['bookmark', 'Marque-page']]) {
    const saved = get(key + ':' + id);
    const chapter = [...summary.querySelectorAll('ol a')].find(a => a.pathname === saved?.path);
    if (!chapter) continue;
    const link = document.createElement('a');
    link.href = chapter.pathname + '?reprise=' + key;
    link.textContent = label + ' · ' + chapter.textContent;
    if (key === 'position') link.textContent += ' (' + Math.round(100 * saved.progress) + ' % du roman)';
    summary.querySelector('[data-resume]').append(link);
  }
}
const article = document.querySelector('[data-chapter]');
if (article) {
  const { book, index, total } = article.dataset;
  const maxScroll = () => Math.max(0, document.documentElement.scrollHeight - innerHeight);
  function position() {
    const offset = fraction(scrollY, maxScroll());
    return { path: location.pathname, offset, progress: (Number(index) + offset) / Number(total) };
  }
  const record = () => save('position:' + book, position());
  const resume = new URLSearchParams(location.search).get('reprise');
  const previous = ['position','bookmark'].includes(resume) && get(resume + ':' + book);
  const restore = () => {
    if (previous?.path === location.pathname && Number.isFinite(previous.offset)) scrollTo(0, previous.offset * maxScroll());
    record();
  };
  if (document.readyState === 'complete') restore();
  else window.addEventListener('load', restore, {once:true});
  let timer;
  addEventListener('scroll', () => { clearTimeout(timer); timer = setTimeout(record, 200); }, {passive:true});
  addEventListener('pagehide', record);
  article.querySelector('[data-mark]').addEventListener('click', () => {
    article.querySelector('[role=status]').textContent = save('bookmark:' + book, position()) ? 'Marque-page enregistré.' : 'Stockage indisponible sur cet appareil.';
  });
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/viveplume/sw.js').catch(() => {});
  });
}
