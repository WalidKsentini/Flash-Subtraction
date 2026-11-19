const $ = id => document.getElementById(id);
const screens = ['settings','play','ask','result'];
let numbers = [], timer = null, last = null, autoTimer = null;

function stopAuto(){
      clearTimeout(autoTimer);
      $('again').classList.remove('filling');
}

function show(name){ screens.forEach(s => $(s).classList.toggle('hidden', s !== name)); }
function clamp(v,min,max,def){ v = parseInt(v,10); if (isNaN(v)) v = def; return Math.min(max, Math.max(min, v)); }
function rand(d){ const lo = d === 1 ? 1 : Math.pow(10,d-1), hi = Math.pow(10,d) - 1; return lo + Math.floor(Math.random() * (hi - lo + 1)); }
function fmt(n){ return n < 0 ? '\u2212' + Math.abs(n) : String(n); }

function readSettings(){
      const s = {
            count: clamp($('count').value,2,30,5),
            interval: clamp($('interval').value,100,5000,800),
            d1: clamp($('d1').value,1,9,3),
            d2: clamp($('d2').value,1,9,2)
      };
      $('count').value = s.count; $('interval').value = s.interval; $('d1').value = s.d1; $('d2').value = s.d2;
      return s;
}

function run(s){
      stopAuto();
      last = s;
      const lo = d => d === 1 ? 1 : Math.pow(10, d - 1);
      const hi = d => Math.pow(10, d) - 1;
      const between = (a, b) => a + Math.floor(Math.random() * (b - a + 1));

      const lo2 = lo(s.d2), hi2 = hi(s.d2);

      let total = between(Math.max(lo(s.d1), (s.count - 1) * lo2 + 1), hi(s.d1));
      numbers = [total];

      for (let i = 1; i < s.count; i++){
            const remaining = s.count - 1 - i;
            const max = Math.min(hi2, total - 1 - remaining * lo2);
            let n, tries = 0;
            do { n = between(lo2, max); } while (n === -numbers[i-1] && max > lo2 && ++tries < 10);
            total -= n;
            numbers.push(-n);
      }
      show('play');
      let i = 0;
      const step = () => {
            if (i >= numbers.length){ $('flash').textContent = ''; show('ask'); $('answer').value = ''; $('answer').focus(); return; }
            $('flash').textContent = fmt(numbers[i]);
            i++;
            timer = setTimeout(() => { $('flash').textContent = ''; timer = setTimeout(step, 100); }, s.interval);
      };
      $('flash').textContent = '';
      timer = setTimeout(step, 700);
}

function check(){
      const raw = $('answer').value.trim();
      if (raw === '') return;
      const given = parseInt(raw,10);
      const correct = numbers.reduce((a,b) => a + b, 0);
      const v = $('verdict');
      if (given === correct){ v.textContent = 'Correct!'; v.className = 'result ok'; }
      else { v.textContent = 'Wrong. Answer: ' + fmt(correct); v.className = 'result bad'; }
      $('sum').textContent = numbers.map((n,i) => i === 0 ? String(n) : (n < 0 ? '\u2212 ' + Math.abs(n) : '+ ' + n)).join('  ');
      show('result');
      if (document.activeElement) document.activeElement.blur();
      stopAuto();
      void $('again').offsetWidth;
      $('again').classList.add('filling');
      autoTimer = setTimeout(() => run(last), 1500);
}

$('start').onclick = () => run(readSettings());
$('check').onclick = check;
$('again').onclick = () => run(last);
$('params').onclick = () => { clearTimeout(timer); stopAuto(); show('settings'); };

document.addEventListener('keydown', e => {
      if (e.repeat) return;
      const cur = screens.find(s => !$(s).classList.contains('hidden'));
      if (e.key === 'Enter'){
            if (cur === 'settings'){ e.preventDefault(); $('start').click(); }
            else if (cur === 'ask'){ e.preventDefault(); check(); }
            else if (cur === 'result'){ e.preventDefault(); run(last); }
      } else if (e.key === 'Escape' && cur !== 'settings'){
            e.preventDefault(); $('params').click();
      }
});