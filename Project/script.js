document.addEventListener('DOMContentLoaded',function(){
const d=document,w=window,nb=d.getElementById('navbar'),mm=d.getElementById('mobileMenuToggle'),mn=d.getElementById('mobileNav'),cf=d.getElementById('contactForm'),sb=d.getElementById('submitBtn'),bt=sb.querySelector('.btn-text'),bl=sb.querySelector('.btn-loading'),t=d.getElementById('toast'),tm=t.querySelector('.toast-message'),tc=t.querySelector('.toast-close');

// Navigation & Mobile Menu
function initNav(){
const nls=d.querySelectorAll('.nav-link,.mobile-nav-link'),mnls=d.querySelectorAll('.mobile-nav-link');
w.addEventListener('scroll',()=>{
nb.classList[w.scrollY>50?'add':'remove']('scrolled');
const ss=d.querySelectorAll('section[id]'),sp=w.scrollY+100;
ss.forEach(s=>{
const st=s.offsetTop,sh=s.offsetHeight,si=s.getAttribute('id');
if(sp>=st&&sp<st+sh){
nls.forEach(l=>{
l.classList.remove('active');
if(l.getAttribute('data-section')===si)l.classList.add('active');
});
}
});
});
mm.addEventListener('click',()=>{
mn.classList.toggle('active');
const i=mm.querySelector('i');
i.className=mn.classList.contains('active')?'fas fa-times':'fas fa-bars';
});
mnls.forEach(l=>l.addEventListener('click',()=>{
mn.classList.remove('active');
mm.querySelector('i').className='fas fa-bars';
}));
d.addEventListener('click',e=>{
if(!mn.contains(e.target)&&!mm.contains(e.target)){
mn.classList.remove('active');
mm.querySelector('i').className='fas fa-bars';
}
});
}

// Smooth Scrolling
function initScroll(){
const ls=d.querySelectorAll('a[href^="#"]');
ls.forEach(l=>l.addEventListener('click',e=>{
e.preventDefault();
const ti=l.getAttribute('href').substring(1),ts=d.getElementById(ti);
if(ts)w.scrollTo({top:ts.getBoundingClientRect().top+w.pageYOffset-80,behavior:'smooth'});
}));
}

// Scroll Animations
function initAnims(){
const o=new IntersectionObserver(es=>es.forEach(e=>e.isIntersecting&&e.target.classList.add('visible')),{threshold:.1,rootMargin:'0px 0px -50px 0px'});
[{s:'.section-header',a:'fade-in'},{s:'.about-text',a:'slide-in-left'},{s:'.stats-grid',a:'slide-in-right'},{s:'.skill-category',a:'fade-in'},{s:'.project-card',a:'scale-in'},{s:'.contact-card',a:'fade-in'},{s:'.stat-card',a:'scale-in'}].forEach(i=>{
const es=d.querySelectorAll(i.s);
es.forEach((e,x)=>{
e.classList.add(i.a);
e.style.transitionDelay=`${x*.1}s`;
o.observe(e);
});
});
}

// Skill Bars
function initSkills(){
const sb=d.querySelectorAll('.skill-progress'),o=new IntersectionObserver(es=>es.forEach(e=>{
if(e.isIntersecting){
const s=e.target,w=s.getAttribute('data-width');
setTimeout(()=>s.style.width=w+'%',500);
o.unobserve(s);
}
}),{threshold:.5});
sb.forEach(b=>o.observe(b));
}

// Contact Form
function initForm(){
cf.addEventListener('submit',e=>{
e.preventDefault();
if(validate())submit();
});
function validate(){
const n=d.getElementById('name'),e=d.getElementById('email'),s=d.getElementById('subject'),m=d.getElementById('message');
let v=true;
clear();
if(n.value.trim().length<2){showError('name','Name must be at least 2 characters');v=false;}
if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.value.trim())){showError('email','Invalid email');v=false;}
if(s.value.trim().length<5){showError('subject','Subject too short');v=false;}
if(m.value.trim().length<10){showError('message','Message too short');v=false;}
return v;
}
function showError(f,m){
const fd=d.getElementById(f),fg=fd.parentElement,er=d.getElementById(f+'Error');
fg.classList.add('error');
er.textContent=m;
}
function clear(){
d.querySelectorAll('.form-group').forEach(g=>g.classList.remove('error'));
d.querySelectorAll('.error-message').forEach(e=>e.textContent='');
}
function submit(){
bt.style.display='none';
bl.style.display='inline-flex';
sb.disabled=true;
fetch('contact.php',{method:'POST',body:new FormData(cf)})
.then(r=>r.json())
.then(data=>{
if(data.success){
showToast('Message sent! I\'ll get back to you soon.','success');
cf.reset();
}else showToast(data.message||'Failed to send. Try again.','error');
})
.catch(()=>showToast('Failed to send. Try again.','error'))
.finally(()=>{
bt.style.display='inline-flex';
bl.style.display='none';
sb.disabled=false;
});
}
}

// Toast
function showToast(m,type='success'){
tm.textContent=m;
t.className=`toast ${type}`;
t.classList.add('show');
const h=setTimeout(()=>t.classList.remove('show'),5000);
tc.onclick=()=>{
clearTimeout(h);
t.classList.remove('show');
};
}

// Scroll Indicator
function initInd(){
const si=d.querySelector('.scroll-indicator');
if(si){
si.addEventListener('click',()=>{
const ab=d.getElementById('about');
if(ab)ab.scrollIntoView({behavior:'smooth'});
});
w.addEventListener('scroll',()=>si.style.opacity=w.scrollY>100?'0':'1');
}
}

// Parallax
function initPar(){
if(w.innerWidth>768){
const bs=d.querySelectorAll('.blob');
w.addEventListener('scroll',()=>{
const s=w.pageYOffset;
bs.forEach((b,i)=>{
const sp=.2+(i*.1),y=-(s*sp);
b.style.transform=`translate3d(0,${y}px,0)`;
});
});
}
}

// Debounce
const db=(f,w)=>{let t;return(...a)=>{clearTimeout(t);t=setTimeout(()=>f(...a),w);};};

// Initialize all
initNav();
initScroll();
initAnims();
initSkills();
initForm();
initInd();
initPar();

// Window events
w.addEventListener('scroll',db(()=>{},16));
w.addEventListener('load',()=>{
d.body.classList.add('loaded');
d.querySelectorAll('.animate-on-load').forEach((e,i)=>setTimeout(()=>{
e.style.opacity='1';
e.style.transform='translateY(0)';
},i*100));
});
w.addEventListener('popstate',()=>{
const h=w.location.hash;
if(h){
d.querySelectorAll('.nav-link,.mobile-nav-link').forEach(l=>{
l.classList.remove('active');
if(l.getAttribute('href')===h)l.classList.add('active');
});
}
});
w.addEventListener('resize',db(()=>{
if(w.innerWidth>768){
mn.classList.remove('active');
mm.querySelector('i').className='fas fa-bars';
}
},250));
d.addEventListener('keydown',e=>{
if(e.key==='Escape'&&mn.classList.contains('active')){
mn.classList.remove('active');
mm.querySelector('i').className='fas fa-bars';
}
});

// Preload images
['4f46e5','059669','dc2626','7c3aed','ea580c','10b981'].forEach(c=>{
const i=new Image();
i.src=`https://via.placeholder.com/400x300/${c}/ffffff?text=Project`;
});
});