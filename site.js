const menuButton=document.querySelector('.menu-button');
const navLinks=document.querySelector('.nav-links');
const closeNavigation=()=>{
  if(!menuButton||!navLinks)return;
  navLinks.classList.remove('open');
  menuButton.setAttribute('aria-expanded','false');
  menuButton.textContent='☰';
  const compactPanel=navLinks.querySelector('.site-mobile-mega');
  if(compactPanel){compactPanel.classList.remove('is-open');compactPanel.setAttribute('aria-hidden','true')}
  navLinks.querySelectorAll(':scope > a[data-mega-type]').forEach(link=>link.setAttribute('aria-expanded','false'));
};
if(menuButton&&navLinks){
  menuButton.addEventListener('click',()=>{
    const open=navLinks.classList.toggle('open');
    menuButton.setAttribute('aria-expanded',String(open));
    menuButton.textContent=open?'×':'☰';
    if(!open)closeNavigation();
  });
  navLinks.addEventListener('click',event=>{
    const link=event.target.closest('a');
    if(!link)return;
    if(window.innerWidth<=900&&link.dataset.megaType&&!link.closest('.site-mobile-mega'))return;
    closeNavigation();
  });
}

const motionReduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Navegación visual para las secciones con contenido exploratorio. En escritorio
// aparece al pasar el mouse; en celular funciona como un panel compacto.
const siteHeader=document.querySelector('.site-header');
if(siteHeader&&navLinks){
  const megaData={
    races:{eyebrow:'Nuestras razas',description:'Conoce el ganado y los cruces que orientan nuestro trabajo productivo.',allLabel:'Ver todas las razas',allHref:'ganado.html',cards:[
      ['Nelore','ganado.html','assets/nelore-closeup.webp','34% center'],
      ['Brahman','ganado.html','assets/breeds/brahman-v9.webp','center'],
      ['Cruce industrial','ganado.html','assets/angus-front.webp','58% center'],
      ['Sindi','ganado.html','assets/breeds/sindi-v9.webp','center']
    ]},
    sales:{eyebrow:'Animales disponibles',description:'Ingresa directamente a la categoría de venta que deseas consultar.',allLabel:'Ver toda la venta',allHref:'venta.html',cards:[
      ['Terneros','venta.html#terneros','assets/sales/terneros-v9.webp','center'],
      ['Vaquillas','venta.html#vaquillas','assets/sales/vaquillas-v9.webp','center'],
      ['Toros reproductores','venta.html#toros-reproductores','assets/sales/toros-v9.webp','center'],
      ['Descartes','venta.html#descartes','assets/sales/descartes-v9.webp','center']
    ]},
    genetics:{eyebrow:'Genética',description:'Selección, inseminación y seguimiento para producir mejor generación tras generación.',allLabel:'Ver genética mejorada',allHref:'genetica.html',cards:[
      ['Preparación','genetica.html#preparacion','assets/genetics/material-inseminacion.jpeg','center'],
      ['Inseminación','genetica.html#inseminacion','assets/genetics/pajuelas-seleccionadas.jpeg','center'],
      ['Diagnóstico','genetica.html#diagnostico','assets/genetics/diagnostico-ecografia-v12.webp','center'],
      ['Selección genética','genetica.html#seleccion-genetica','assets/genetics/seleccion-atardecer-v12.webp','center']
    ]},
    gallery:{eyebrow:'Galería',description:'Fotografías y videos reales del ganado, el campo y el trabajo cotidiano.',allLabel:'Abrir la galería',allHref:'galeria.html',cards:[
      ['Ganado en el corral','galeria.html#fotografias','assets/gallery/ganado-corral-1.jpg','center'],
      ['Nuestro hato','galeria.html#fotografias','assets/gallery/ganado-corral-2.jpg','center'],
      ['Videos','galeria.html#videos','assets/gallery/hacienda-video-1-poster.jpg','center'],
      ['Trabajo diario','galeria.html#videos','assets/gallery/hacienda-video-2-poster.jpg','center']
    ]}
  };
  const triggerConfig=[
    ['races',/ganado\.html|#razas/],
    ['sales',/venta\.html|#venta/],
    ['genetics',/genetica\.html|#genetica/],
    ['gallery',/galeria\.html|#galeria/]
  ];
  const triggerPairs=triggerConfig.map(([type,pattern])=>[
    [...navLinks.querySelectorAll(':scope > a')].find(link=>pattern.test(link.getAttribute('href')||'')),
    type
  ]).filter(([link])=>link);
  const mega=document.createElement('div');
  mega.className='site-mega-menu';
  mega.setAttribute('aria-hidden','true');
  siteHeader.append(mega);
  const mobileMega=document.createElement('div');
  mobileMega.className='site-mobile-mega';
  mobileMega.setAttribute('aria-hidden','true');
  let closeTimer;
  let currentTrigger=null;
  let currentMobileTrigger=null;

  const cardsMarkup=data=>data.cards.map(([title,href,image,position])=>`<a class="site-mega-card" href="${href}" style="--mega-image:url('${image}');--mega-position:${position}"><strong>${title}</strong><span aria-hidden="true">↗</span></a>`).join('');

  const closeMega=()=>{
    clearTimeout(closeTimer);
    mega.classList.remove('is-open');
    mega.setAttribute('aria-hidden','true');
    if(currentTrigger)currentTrigger.setAttribute('aria-expanded','false');
    currentTrigger=null;
  };
  const closeMobileMega=()=>{
    mobileMega.classList.remove('is-open');
    mobileMega.setAttribute('aria-hidden','true');
    if(currentMobileTrigger)currentMobileTrigger.setAttribute('aria-expanded','false');
    currentMobileTrigger=null;
  };
  const scheduleClose=()=>{clearTimeout(closeTimer);closeTimer=setTimeout(closeMega,90)};
  const openMega=(type,trigger)=>{
    if(window.innerWidth<=900)return;
    const data=megaData[type];
    if(currentTrigger&&currentTrigger!==trigger)currentTrigger.setAttribute('aria-expanded','false');
    currentTrigger=trigger;
    trigger.setAttribute('aria-expanded','true');
    mega.innerHTML=`<div class="container site-mega-menu-inner"><div class="site-mega-intro"><div><p class="eyebrow">${data.eyebrow}</p><p>${data.description}</p></div><a class="site-mega-all" href="${data.allHref}">${data.allLabel} <span aria-hidden="true">→</span></a></div><div class="site-mega-grid">${cardsMarkup(data)}</div></div>`;
    mega.classList.add('is-open');
    mega.setAttribute('aria-hidden','false');
  };
  const openMobileMega=(type,trigger)=>{
    const data=megaData[type];
    const alreadyOpen=currentMobileTrigger===trigger&&mobileMega.classList.contains('is-open');
    if(alreadyOpen){closeMobileMega();return}
    if(currentMobileTrigger)currentMobileTrigger.setAttribute('aria-expanded','false');
    currentMobileTrigger=trigger;
    trigger.setAttribute('aria-expanded','true');
    mobileMega.innerHTML=`<div class="site-mobile-mega-top"><div><p class="eyebrow">${data.eyebrow}</p><p>${data.description}</p></div><button type="button" data-mobile-mega-close aria-label="Cerrar opciones">×</button></div><div class="site-mobile-mega-grid">${cardsMarkup(data)}</div><a class="site-mobile-mega-all" href="${data.allHref}">${data.allLabel} <span aria-hidden="true">→</span></a>`;
    trigger.insertAdjacentElement('afterend',mobileMega);
    mobileMega.classList.add('is-open');
    mobileMega.setAttribute('aria-hidden','false');
  };

  triggerPairs.forEach(([link,type])=>{
    link.dataset.megaType=type;
    link.setAttribute('aria-haspopup','true');
    link.setAttribute('aria-expanded','false');
    link.addEventListener('pointerenter',()=>{clearTimeout(closeTimer);openMega(type,link)});
    link.addEventListener('pointerleave',event=>{
      if(window.innerWidth<=900)return;
      if(event.relatedTarget&&mega.contains(event.relatedTarget))return;
      scheduleClose();
    });
    link.addEventListener('focus',()=>openMega(type,link));
    link.addEventListener('blur',event=>{
      if(!event.relatedTarget||!mega.contains(event.relatedTarget))scheduleClose();
    });
    link.addEventListener('click',event=>{
      if(window.innerWidth>900)return;
      event.preventDefault();
      openMobileMega(type,link);
    });
  });
  mobileMega.addEventListener('click',event=>{
    if(event.target.closest('[data-mobile-mega-close]')){closeMobileMega();return}
    if(event.target.closest('a'))closeMobileMega();
  });
  mega.addEventListener('pointerenter',()=>clearTimeout(closeTimer));
  mega.addEventListener('pointerleave',scheduleClose);
  siteHeader.addEventListener('pointerleave',closeMega);
  siteHeader.addEventListener('pointerenter',()=>clearTimeout(closeTimer));
  mega.addEventListener('focusout',event=>{if(!siteHeader.contains(event.relatedTarget))scheduleClose()});
  document.addEventListener('keydown',event=>{if(event.key==='Escape'){closeMega();closeMobileMega()}});
  window.addEventListener('resize',()=>{
    if(window.innerWidth<=900)closeMega();
    else{closeMobileMega();closeNavigation()}
  });
}

// El mismo lenguaje de aparición se aplica en todas las páginas y se repite
// cada vez que un bloque vuelve a entrar a la pantalla, desde arriba o abajo.
document.querySelectorAll('.page-intro .container').forEach(element=>element.classList.add('reveal'));
document.querySelectorAll('.gallery-item,.gallery-video,.process-photo,.process-video').forEach((element,index)=>{
  if(!element.closest('.reveal'))element.classList.add('reveal');
  element.style.setProperty('--reveal-delay',`${Math.min(index%4,3)*55}ms`);
});
document.querySelectorAll('.about-photo,.home-editorial-photo,.home-sales-photo,.home-story-video,.contact-visual,.video-card').forEach(element=>element.classList.add('photo-panel'));

const revealElements=[...document.querySelectorAll('.reveal')];
if(motionReduced){revealElements.forEach(element=>element.classList.add('visible'))}
else{
  const revealObserver=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      const element=entry.target;
      if(entry.isIntersecting){
        requestAnimationFrame(()=>element.classList.add('visible'));
      }else{
        element.classList.remove('visible');
        element.classList.toggle('reveal-from-top',entry.boundingClientRect.top<0);
      }
    });
  },{threshold:.08,rootMargin:'-4% 0px -7% 0px'});
  revealElements.forEach(element=>revealObserver.observe(element));
}

// Los títulos entran por palabras completas, nunca por letras sueltas. La
// animación vuelve a ejecutarse cada vez que el título reaparece en pantalla.
const titleSelectors='.page-intro .display-title,.home-editorial-copy h2,.home-story-copy h2,.home-section-heading h2,.home-sales-copy h2,.home-contact h2,.contact-panel h2,.genetics-copy h2,.about-copy h2';
const animatedTitles=[...document.querySelectorAll(titleSelectors)];
animatedTitles.forEach(title=>{
  const original=title.textContent.trim().replace(/\s+/g,' ');
  if(!original)return;
  title.classList.add('title-animated');
  title.setAttribute('aria-label',original);
  const fragment=document.createDocumentFragment();
  original.split(' ').forEach((word,index,words)=>{
    const mask=document.createElement('span');
    mask.className='title-word-mask';
    const inner=document.createElement('span');
    inner.className='title-word-reveal';
    const wordStep=title.closest('[data-cinematic-story]')?45:70;
    inner.style.setProperty('--word-delay',`${index*wordStep}ms`);
    inner.textContent=word;
    mask.append(inner);
    fragment.append(mask);
    if(index<words.length-1)fragment.append(document.createTextNode(' '));
  });
  title.replaceChildren(fragment);
});

if(motionReduced)animatedTitles.forEach(title=>title.classList.add('title-visible'));
else{
  const titleObserver=new IntersectionObserver(entries=>{
    entries.forEach(entry=>entry.target.classList.toggle('title-visible',entry.isIntersecting));
  },{threshold:.18,rootMargin:'-4% 0px -9% 0px'});
  animatedTitles.filter(title=>!title.closest('[data-cinematic-story]')).forEach(title=>titleObserver.observe(title));
}

// Relato cinematográfico: la imagen comienza contenida, crece hasta ocupar la
// pantalla y solo entonces revela el texto. El recorrido se adapta al alto y
// ancho reales de cada dispositivo.
const cinematicStory=document.querySelector('[data-cinematic-story]');
if(cinematicStory){
  const storyCard=cinematicStory.querySelector('.home-story-video');
  const storyTitle=cinematicStory.querySelector('.home-story-copy h2');
  let storyFrame;
  const clamp01=value=>Math.min(1,Math.max(0,value));
  const easeOutCubic=value=>1-Math.pow(1-value,3);

  const updateCinematicStory=()=>{
    const rect=cinematicStory.getBoundingClientRect();
    const travel=Math.max(1,cinematicStory.offsetHeight-window.innerHeight);
    const progress=clamp01(-rect.top/travel);
    const expansion=easeOutCubic(clamp01(progress/.42));
    const copyProgress=clamp01((progress-.43)/.16);
    const mobile=window.innerWidth<=620;
    const startScale=mobile?.84:.7;
    const scale=startScale+(1-startScale)*expansion;

    storyCard.style.setProperty('--story-scale',scale.toFixed(4));
    storyCard.style.setProperty('--story-radius',`${((1-expansion)*(mobile?18:30)).toFixed(2)}px`);
    storyCard.style.setProperty('--story-shade-opacity',(0.28+copyProgress*.72).toFixed(3));
    storyCard.classList.toggle('story-copy-visible',copyProgress>.04);
    if(storyTitle)storyTitle.classList.toggle('title-visible',copyProgress>.08);
  };
  const queueCinematicStory=()=>{
    cancelAnimationFrame(storyFrame);
    storyFrame=requestAnimationFrame(updateCinematicStory);
  };

  if(motionReduced){
    storyCard.style.setProperty('--story-scale','1');
    storyCard.style.setProperty('--story-radius','0px');
    storyCard.style.setProperty('--story-shade-opacity','1');
    storyCard.classList.add('story-copy-visible');
    if(storyTitle)storyTitle.classList.add('title-visible');
  }else{
    window.addEventListener('scroll',queueCinematicStory,{passive:true});
    window.addEventListener('resize',queueCinematicStory);
    updateCinematicStory();
  }
}

// Los videos ambientales solo se reproducen cuando están cerca de la pantalla.
// Si el visitante prefiere menos movimiento, se conserva el fotograma de portada.
const ambientVideos=[...document.querySelectorAll('.home-story-video video,.home-editorial-photo--video video')];
if(motionReduced)ambientVideos.forEach(video=>video.pause());
else if(ambientVideos.length){
  const videoObserver=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      const video=entry.target;
      if(entry.isIntersecting)video.play().catch(()=>{});
      else video.pause();
    });
  },{rootMargin:'30% 0px'});
  ambientVideos.forEach(video=>videoObserver.observe(video));
}

// La indicación de contacto llama la atención solo al entrar, sin parpadear
// de forma permanente.
const contactActions=[...document.querySelectorAll('.home-contact-actions,.contact-links')];
if(contactActions.length&&!motionReduced){
  const contactObserver=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(!entry.isIntersecting)return;
      entry.target.classList.add('contact-cue-active');
      contactObserver.unobserve(entry.target);
    });
  },{threshold:.45});
  contactActions.forEach(actions=>contactObserver.observe(actions));
}
document.querySelectorAll('[data-year]').forEach(element=>{element.textContent=new Date().getFullYear()});

document.querySelectorAll('[data-carousel]').forEach(carousel=>{
  const track=carousel.querySelector('[data-carousel-track]');
  const slides=[...track.querySelectorAll('.cattle-slide')];
  const previous=carousel.querySelector('[data-carousel-prev]');
  const next=carousel.querySelector('[data-carousel-next]');
  const counter=carousel.querySelector('[data-carousel-counter]');
  const progress=carousel.querySelector('[data-carousel-progress]');
  let activeIndex=0;
  let scrollFrame;

  const update=()=>{
    const left=track.scrollLeft;
    activeIndex=slides.reduce((closest,slide,index)=>Math.abs(slide.offsetLeft-slides[0].offsetLeft-left)<Math.abs(slides[closest].offsetLeft-slides[0].offsetLeft-left)?index:closest,0);
    slides.forEach((slide,index)=>{
      slide.classList.toggle('is-active',index===activeIndex);
      slide.setAttribute('aria-current',index===activeIndex?'true':'false');
    });
    counter.textContent=`${String(activeIndex+1).padStart(2,'0')} / ${String(slides.length).padStart(2,'0')}`;
    progress.style.width=`${((activeIndex+1)/slides.length)*100}%`;
    previous.disabled=activeIndex===0;
    next.disabled=activeIndex===slides.length-1;
  };

  const goTo=index=>{
    const target=Math.max(0,Math.min(index,slides.length-1));
    track.scrollTo({left:slides[target].offsetLeft-slides[0].offsetLeft,behavior:'smooth'});
  };

  previous.addEventListener('click',()=>goTo(activeIndex-1));
  next.addEventListener('click',()=>goTo(activeIndex+1));
  track.addEventListener('keydown',event=>{
    if(event.key==='ArrowLeft'){event.preventDefault();goTo(activeIndex-1)}
    if(event.key==='ArrowRight'){event.preventDefault();goTo(activeIndex+1)}
  });
  track.addEventListener('scroll',()=>{cancelAnimationFrame(scrollFrame);scrollFrame=requestAnimationFrame(update)},{passive:true});
  window.addEventListener('resize',update);
  update();
});

const saleCarousel=document.querySelector('[data-sale-carousel]');
if(saleCarousel){
  const track=saleCarousel.querySelector('[data-sale-track]');
  const slides=[...saleCarousel.querySelectorAll('[data-sale-slide]')];
  const previous=saleCarousel.querySelector('[data-sale-prev]');
  const next=saleCarousel.querySelector('[data-sale-next]');
  const counter=saleCarousel.querySelector('[data-sale-counter]');
  const progress=saleCarousel.querySelector('[data-sale-progress]');
  const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const animationFrames=new WeakMap();
  let activeIndex=-1;
  let isVisible=false;
  let scrollFrame;

  slides.forEach(slide=>{
    const number=slide.querySelector('[data-sale-count]');
    if(number&&!reducedMotion)number.textContent='0';
  });

  const animateCount=slide=>{
    const number=slide.querySelector('[data-sale-count]');
    if(!number)return;
    const target=Number(number.dataset.saleCount);
    const existing=animationFrames.get(number);
    if(existing)cancelAnimationFrame(existing);
    if(reducedMotion){number.textContent=String(target);return}
    const duration=1050;
    const started=performance.now();
    const tick=now=>{
      const progress=Math.min(1,(now-started)/duration);
      const eased=1-Math.pow(1-progress,3);
      number.textContent=String(Math.round(target*eased));
      if(progress<1)animationFrames.set(number,requestAnimationFrame(tick));
      else animationFrames.delete(number);
    };
    number.textContent='0';
    animationFrames.set(number,requestAnimationFrame(tick));
  };

  const update=()=>{
    const left=track.scrollLeft;
    const nextIndex=slides.reduce((closest,slide,index)=>Math.abs(slide.offsetLeft-slides[0].offsetLeft-left)<Math.abs(slides[closest].offsetLeft-slides[0].offsetLeft-left)?index:closest,0);
    const changed=nextIndex!==activeIndex;
    activeIndex=nextIndex;
    slides.forEach((slide,index)=>{
      slide.classList.toggle('is-active',index===activeIndex);
      slide.setAttribute('aria-current',index===activeIndex?'true':'false');
    });
    counter.textContent=`${String(activeIndex+1).padStart(2,'0')} / ${String(slides.length).padStart(2,'0')}`;
    progress.style.width=`${((activeIndex+1)/slides.length)*100}%`;
    previous.disabled=activeIndex===0;
    next.disabled=activeIndex===slides.length-1;
    if(changed&&isVisible)animateCount(slides[activeIndex]);
  };

  const goTo=index=>{
    const target=Math.max(0,Math.min(index,slides.length-1));
    track.scrollTo({left:slides[target].offsetLeft-slides[0].offsetLeft,behavior:reducedMotion?'auto':'smooth'});
  };

  previous.addEventListener('click',()=>goTo(activeIndex-1));
  next.addEventListener('click',()=>goTo(activeIndex+1));
  track.addEventListener('keydown',event=>{
    if(event.key==='ArrowLeft'){event.preventDefault();goTo(activeIndex-1)}
    if(event.key==='ArrowRight'){event.preventDefault();goTo(activeIndex+1)}
  });
  track.addEventListener('scroll',()=>{cancelAnimationFrame(scrollFrame);scrollFrame=requestAnimationFrame(update)},{passive:true});
  window.addEventListener('resize',update);

  const visibilityObserver=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      isVisible=entry.isIntersecting;
      if(isVisible&&activeIndex>=0)animateCount(slides[activeIndex]);
    });
  },{threshold:.22});
  visibilityObserver.observe(saleCarousel);
  update();

  const requestedId=decodeURIComponent(window.location.hash.slice(1));
  const requestedIndex=slides.findIndex(slide=>slide.id===requestedId);
  if(requestedIndex>=0)setTimeout(()=>goTo(requestedIndex),80);
}

const progressSections=[...document.querySelectorAll('[data-scroll-section]')];
const progressCurrent=document.querySelector('[data-page-progress-current]');
const progressTotal=document.querySelector('[data-page-progress-total]');
const progressLabel=document.querySelector('[data-page-progress-label]');
const progressFill=document.querySelector('[data-page-progress-fill]');
if(progressSections.length&&progressCurrent&&progressTotal&&progressLabel&&progressFill){
  progressTotal.textContent=String(progressSections.length).padStart(2,'0');
  let progressFrame;
  const updatePageProgress=()=>{
    const marker=window.scrollY+window.innerHeight*.42;
    let active=0;
    progressSections.forEach((section,index)=>{if(section.offsetTop<=marker)active=index});
    const maxScroll=Math.max(1,document.documentElement.scrollHeight-window.innerHeight);
    progressCurrent.textContent=String(active+1).padStart(2,'0');
    progressLabel.textContent=progressSections[active].dataset.sectionLabel||'';
    progressFill.style.transform=`scaleY(${Math.min(1,Math.max(0,window.scrollY/maxScroll))})`;
  };
  const queuePageProgress=()=>{cancelAnimationFrame(progressFrame);progressFrame=requestAnimationFrame(updatePageProgress)};
  window.addEventListener('scroll',queuePageProgress,{passive:true});
  window.addEventListener('resize',queuePageProgress);
  updatePageProgress();
}

const breedData={
  nelore:{title:'Nelore',description:'Es la raza con mayor presencia en Hacienda El Mundo. Su rusticidad, tolerancia al calor y capacidad para aprovechar pasturas variables la convierten en una opción especialmente adecuada para las condiciones tropicales de la región.',facts:[['Fortaleza','Rusticidad'],['Clima','Tropical y cálido'],['Objetivo','Producción de carne']]},
  angus:{title:'Angus',description:'Raza reconocida por la calidad de su carne, fertilidad y habilidad materna. En cruzamientos con Nelore puede aportar precocidad y características carniceras, complementando la adaptación de las razas cebuinas.',facts:[['Fortaleza','Calidad cárnica'],['Aporte','Precocidad'],['Uso','Raza pura y cruzas']]},
  brahman:{title:'Brahman',description:'Raza cebuina apreciada por su tolerancia al calor, resistencia y capacidad de adaptación. Su longevidad y desempeño reproductivo también la convierten en una base valiosa para programas de cruzamiento.',facts:[['Fortaleza','Adaptabilidad'],['Clima','Cálido y húmedo'],['Uso','Cría y cruzamientos']]},
  cruce:{title:'Cruce industrial',description:'No es una raza única, sino una estrategia que combina dos razas diferentes, como Nelore y Angus. Su objetivo es aprovechar el vigor híbrido para complementar rusticidad, adaptación, precocidad y potencial de ganancia de peso.',facts:[['Ejemplo','Nelore × Angus'],['Objetivo','Vigor híbrido'],['Resultado','Mejor desempeño']]},
  sindi:{title:'Sindi',description:'Raza cebuina de tamaño compacto y pelaje generalmente rojizo. Es valorada por su rusticidad, fertilidad, precocidad y eficiencia en el aprovechamiento del alimento, especialmente en ambientes exigentes.',facts:[['Fortaleza','Eficiencia'],['Rasgo','Tamaño compacto'],['Uso','Carne y reproducción']]}
};

const modal=document.getElementById('breedModal');let lastFocused=null;
if(modal){const title=document.getElementById('modalTitle'),text=document.getElementById('modalText'),facts=document.getElementById('modalFacts'),close=document.getElementById('modalClose');
  const shut=()=>{modal.classList.remove('open');modal.setAttribute('aria-hidden','true');document.body.classList.remove('modal-open');if(lastFocused)lastFocused.focus()};
  document.querySelectorAll('[data-breed]').forEach(card=>card.addEventListener('click',()=>{const data=breedData[card.dataset.breed];lastFocused=card;title.textContent=data.title;text.textContent=data.description;facts.innerHTML=data.facts.map(([label,value])=>`<div class="modal-fact"><strong>${label}</strong><span>${value}</span></div>`).join('');modal.classList.add('open');modal.setAttribute('aria-hidden','false');document.body.classList.add('modal-open');close.focus()}));
  close.addEventListener('click',shut);modal.addEventListener('click',event=>{if(event.target===modal)shut()});document.addEventListener('keydown',event=>{if(event.key==='Escape'&&modal.classList.contains('open'))shut()})
}

const lightbox=document.getElementById('lightbox');
if(lightbox){const image=document.getElementById('lightboxImage'),close=document.getElementById('lightboxClose');
  const shut=()=>{lightbox.classList.remove('open');lightbox.setAttribute('aria-hidden','true');image.src='';document.body.classList.remove('modal-open');if(lastFocused)lastFocused.focus()};
  document.querySelectorAll('.gallery-item').forEach(button=>button.addEventListener('click',()=>{const thumb=button.querySelector('img');lastFocused=button;image.src=button.dataset.full;image.alt=thumb.alt;lightbox.classList.add('open');lightbox.setAttribute('aria-hidden','false');document.body.classList.add('modal-open');close.focus()}));
  close.addEventListener('click',shut);lightbox.addEventListener('click',event=>{if(event.target===lightbox)shut()});document.addEventListener('keydown',event=>{if(event.key==='Escape'&&lightbox.classList.contains('open'))shut()})
}

const videoLightbox=document.getElementById('videoLightbox');
if(videoLightbox){
  const player=document.getElementById('videoLightboxPlayer');
  const title=document.getElementById('videoLightboxTitle');
  const close=document.getElementById('videoLightboxClose');
  const shut=()=>{
    player.pause();
    player.removeAttribute('src');
    player.removeAttribute('poster');
    player.load();
    videoLightbox.classList.remove('open');
    videoLightbox.setAttribute('aria-hidden','true');
    document.body.classList.remove('modal-open');
    if(lastFocused)lastFocused.focus();
  };
  document.querySelectorAll('.gallery-video-open').forEach(button=>button.addEventListener('click',()=>{
    lastFocused=button;
    player.src=button.dataset.videoSrc;
    player.poster=button.dataset.videoPoster||'';
    title.textContent=button.dataset.videoTitle||'Video de Hacienda El Mundo';
    videoLightbox.classList.add('open');
    videoLightbox.setAttribute('aria-hidden','false');
    document.body.classList.add('modal-open');
    player.play().catch(()=>{});
    close.focus();
  }));
  close.addEventListener('click',shut);
  videoLightbox.addEventListener('click',event=>{if(event.target===videoLightbox)shut()});
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&videoLightbox.classList.contains('open'))shut()});
}

// Relato visual de genética: el paso activo controla fotografía, rótulo y línea.
document.querySelectorAll('[data-genetics-story]').forEach(story=>{
  const steps=[...story.querySelectorAll('[data-genetics-step]')];
  const images=[...story.querySelectorAll('[data-genetics-image]')];
  const number=story.querySelector('[data-genetics-caption-number]');
  const title=story.querySelector('[data-genetics-caption-title]');
  const progress=story.querySelector('[data-genetics-progress]');
  let current=0;

  const activate=index=>{
    if(index<0||index>=steps.length)return;
    current=index;
    steps.forEach((step,stepIndex)=>step.classList.toggle('is-active',stepIndex===index));
    images.forEach((image,imageIndex)=>image.classList.toggle('is-active',imageIndex===index));
    number.textContent=String(index+1).padStart(2,'0');
    title.textContent=steps[index].dataset.stepTitle;
    progress.style.transform=`scaleY(${(index+1)/steps.length})`;
  };

  if(!motionReduced){
    const stepObserver=new IntersectionObserver(entries=>{
      const visible=entries.filter(entry=>entry.isIntersecting).sort((a,b)=>Math.abs(a.boundingClientRect.top-innerHeight*.48)-Math.abs(b.boundingClientRect.top-innerHeight*.48));
      if(visible.length)activate(steps.indexOf(visible[0].target));
    },{threshold:.25,rootMargin:'-28% 0px -38% 0px'});
    steps.forEach(step=>stepObserver.observe(step));
  }
  activate(current);
});

// Movimiento editorial muy leve en la portada para conservar nitidez.
const homeHero=document.querySelector('.home-hero');
if(homeHero&&!motionReduced){
  let heroFrame;
  const updateHero=()=>{
    const shift=Math.min(46,Math.max(0,window.scrollY*.075));
    homeHero.style.setProperty('--hero-parallax',`${shift}px`);
  };
  const queueHero=()=>{cancelAnimationFrame(heroFrame);heroFrame=requestAnimationFrame(updateHero)};
  window.addEventListener('scroll',queueHero,{passive:true});
  updateHero();
}

// Microinteracción magnética, limitada a dispositivos con mouse.
if(!motionReduced&&window.matchMedia('(hover: hover) and (pointer: fine)').matches){
  document.querySelectorAll('.button,.cattle-carousel-buttons button,.sale-carousel-buttons button,.card-arrow,.text-link').forEach(element=>{
    element.classList.add('magnetic');
    element.addEventListener('pointermove',event=>{
      if(element.disabled)return;
      const rect=element.getBoundingClientRect();
      const x=((event.clientX-rect.left)/rect.width-.5)*7;
      const y=((event.clientY-rect.top)/rect.height-.5)*7;
      element.style.setProperty('--magnetic-x',`${x.toFixed(2)}px`);
      element.style.setProperty('--magnetic-y',`${y.toFixed(2)}px`);
    });
    element.addEventListener('pointerleave',()=>{
      element.style.setProperty('--magnetic-x','0px');
      element.style.setProperty('--magnetic-y','0px');
    });
  });
}

// Transición breve entre páginas internas con el símbolo de la hacienda.
const pageTransition=document.createElement('div');
pageTransition.className='page-transition';
pageTransition.setAttribute('aria-hidden','true');
pageTransition.innerHTML='<div class="page-transition-mark"><img src="assets/logo-nelore-frontal.png" alt=""><span>Hacienda El Mundo</span></div>';
document.body.append(pageTransition);

const showPage=()=>{
  document.body.classList.remove('page-leaving');
  requestAnimationFrame(()=>document.body.classList.add('page-ready'));
};
setTimeout(showPage,motionReduced?0:90);
window.addEventListener('pageshow',showPage);

document.addEventListener('click',event=>{
  const link=event.target.closest('a[href]');
  if(!link||event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey||link.target==='_blank'||link.hasAttribute('download'))return;
  const href=link.getAttribute('href');
  if(!href||href.startsWith('#')||href.startsWith('mailto:')||href.startsWith('tel:')||href.startsWith('javascript:'))return;
  const destination=new URL(link.href,window.location.href);
  const isLocal=(destination.protocol==='file:'&&location.protocol==='file:')||destination.origin===location.origin;
  if(!isLocal||!destination.pathname.endsWith('.html'))return;
  event.preventDefault();
  document.body.classList.remove('page-ready');
  document.body.classList.add('page-leaving');
  setTimeout(()=>{window.location.href=destination.href},motionReduced?0:520);
});
