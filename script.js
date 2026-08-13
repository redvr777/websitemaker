const $=s=>document.querySelector(s),$$=s=>document.querySelectorAll(s);
let history=[],future=[],zoom=100,selected=$('.siteElement.selected'),pages=['Home','About','Contact','Pricing','Blog','Shop','404'];

function toast(t){const x=$('#toast');x.textContent=t;x.classList.add('show');setTimeout(()=>x.classList.remove('show'),1800)}
function saveState(){history.push($('#siteCanvas').innerHTML);if(history.length>30)history.shift();future=[]}
function select(el){$$('.siteElement').forEach(x=>x.classList.remove('selected'));selected=el;el.classList.add('selected');$('#selectionName').textContent=el.dataset.name||el.dataset.type}
$$('.tab').forEach(b=>b.onclick=()=>{$$('.tab').forEach(x=>x.classList.remove('active'));b.classList.add('active');$$('.leftPanel').forEach(x=>x.classList.remove('active'));$('#panel-'+b.dataset.panel).classList.add('active')});
$$('.inspectTab').forEach(b=>b.onclick=()=>{$$('.inspectTab').forEach(x=>x.classList.remove('active'));b.classList.add('active');$$('.inspectContent').forEach(x=>x.classList.remove('active'));$('#inspect-'+b.dataset.inspect).classList.add('active')});
function bindCanvas(){ $$('.siteElement').forEach(el=>el.onclick=e=>{e.stopPropagation();select(el)}) }
bindCanvas();

$$('[data-add]').forEach(b=>b.onclick=()=>{
 saveState();
 const type=b.dataset.add, names={section:'Section',container:'Container',text:'Text Block',heading:'Heading',image:'Image',video:'Video',button:'Button',link:'Link',icon:'Icon',divider:'Divider',spacer:'Spacer',card:'Card',input:'Input',textarea:'Text Area',select:'Dropdown',checkbox:'Checkbox',radio:'Radio',form:'Form',navbar:'Navbar',footer:'Footer',gallery:'Gallery',carousel:'Carousel',tabs:'Tabs',accordion:'Accordion',map:'Map',embed:'Embed',html:'Custom HTML'};
 const el=document.createElement('div');el.className='siteElement';el.dataset.type=type;el.dataset.name=names[type]||type;el.innerHTML=`<div style="padding:35px;background:#f3f5f8;color:#151922;text-align:center;border:1px dashed #aeb5c3">${names[type]||type}</div>`;
 $('#siteCanvas').appendChild(el);bindCanvas();select(el);toast(`${names[type]||type} added`);
});
$$('.deviceBtn').forEach(b=>b.onclick=()=>{ $$('.deviceBtn').forEach(x=>x.classList.remove('active'));b.classList.add('active');const c=$('#siteCanvas');c.className='siteCanvas '+(b.dataset.device==='tablet'?'tabletCanvas':b.dataset.device==='mobile'?'mobileCanvas':'desktopCanvas')});
$('#zoomIn').onclick=()=>{zoom=Math.min(150,zoom+10);$('#zoom').textContent=zoom+'%';$('#siteCanvas').style.transform=`scale(${zoom/100})`;$('#siteCanvas').style.transformOrigin='top center'};
$('#zoomOut').onclick=()=>{zoom=Math.max(50,zoom-10);$('#zoom').textContent=zoom+'%';$('#siteCanvas').style.transform=`scale(${zoom/100})`;$('#siteCanvas').style.transformOrigin='top center'};
$('[data-action=undo]').onclick=()=>{if(!history.length)return toast('Nothing to undo');future.push($('#siteCanvas').innerHTML);$('#siteCanvas').innerHTML=history.pop();bindCanvas();toast('Undone')};
$('[data-action=redo]').onclick=()=>{if(!future.length)return toast('Nothing to redo');history.push($('#siteCanvas').innerHTML);$('#siteCanvas').innerHTML=future.pop();bindCanvas();toast('Redone')};
$('[data-action=publish]').onclick=()=>{localStorage.setItem('forgeSite',$('#siteCanvas').innerHTML);toast('Website published locally')};
$('[data-action=settings]').onclick=()=>$('#settingsModal').classList.add('show');
$('[data-action=preview]').onclick=()=>{const f=$('#previewFrame');f.srcdoc=`<style>body{margin:0;font-family:Arial}button{cursor:pointer}</style>${$('#siteCanvas').innerHTML}`;$('#previewModal').classList.add('show')};
$$('[data-close]').forEach(b=>b.onclick=()=>$('#'+b.dataset.close).classList.remove('show'));
$('#siteCanvas').onclick=e=>{if(e.target===$('#siteCanvas'))select($('#siteCanvas').firstElementChild)};
$('#newPage').onclick=()=>{const n=prompt('Page name');if(n){pages.push(n);renderPages();toast('Page created')}};
function renderPages(){$('#pageList').innerHTML=pages.map((p,i)=>`<button class="wide pageBtn" data-page="${p}">${i===0?'⌂':'○'} ${p}</button>`).join('');$$('.pageBtn').forEach(b=>b.onclick=()=>{$('#pageTitle').textContent=b.dataset.page;toast('Switched to '+b.dataset.page)})}
renderPages();
$('#assetInput').onchange=e=>{[...e.target.files].forEach(f=>{const d=document.createElement('div');d.className='asset';d.textContent=f.name;$('#assetGrid').appendChild(d)})};
$('#lockBtn').onclick=()=>{$('#lockBtn').textContent=$('#lockBtn').textContent==='🔓'?'🔒':'🔓';toast('Element lock toggled')};
$('#hideBtn').onclick=()=>{if(selected){selected.style.opacity=selected.style.opacity==='0'?'':'0';toast('Element visibility toggled')}};
$('#projectName').onchange=()=>toast('Project renamed');
window.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='s'){e.preventDefault();localStorage.setItem('forgeSite',$('#siteCanvas').innerHTML);toast('Saved')}});