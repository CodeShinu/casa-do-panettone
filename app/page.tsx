"use client";

import { useEffect, useRef, useState } from "react";

const videos = [
  { src: "/casa-reel-01.mp4", label: "Sabor que começa pelos olhos" },
  { src: "/casa-reel-02.mp4", label: "Um carinho em forma de receita" },
  { src: "/casa-reel-03.mp4", label: "Direto da nossa casa" },
  { src: "/casa-reel-04.mp4", label: "Detalhes que dão água na boca" },
  { src: "/casa-reel-05.mp4", label: "Feito para momentos especiais" },
  { src: "/casa-reel-06.mp4", label: "A textura de perto" },
  { src: "/casa-reel-07.mp4", label: "Da fábrica para a sua mesa" },
  { src: "/reel-1.mp4", label: "Um sabor que chama" },
  { src: "/reel-2.mp4", label: "De perto é ainda melhor" },
  { src: "/reel-3.mp4", label: "Momentos da nossa casa" },
  { src: "/reel-4.mp4", label: "Feito para dividir" },
];

const faqs = [
  ["Quais sabores estão disponíveis?", "A disponibilidade varia. Fale com a Casa do Panettone para conhecer os sabores do momento."],
  ["Como faço meu pedido?", "Escolha o sabor que despertou sua vontade e entre em contato com a equipe para confirmar o pedido."],
  ["Vocês trabalham com encomendas?", "Consulte a equipe para confirmar disponibilidade, quantidades e prazo para sua encomenda."],
  ["Posso comprar em quantidade?", "Sim, consulte as condições e a disponibilidade diretamente com a loja de fábrica."],
  ["Onde fica a loja de fábrica?", "O endereço e o melhor horário para visitar podem ser confirmados diretamente com a equipe."],
];

const tickerPhrases = ["Feito para compartilhar", "Gotas de chocolate", "Frutas selecionadas", "Sabor que abraça", "Direto da loja de fábrica", "Receita feita com carinho", "Tradição em cada pedaço", "Ingredientes selecionados", "Um presente cheio de sabor", "Momentos que ficam na memória", "Qualidade artesanal", "Perfeito para celebrar", "Do forno para a sua mesa", "Carinho em cada detalhe", "Uma experiência deliciosa", "Feito para reunir pessoas", "Sabor de momentos especiais", "Fresquinho e irresistível", "Tradição que conquista", "Compartilhe felicidade"];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [product, setProduct] = useState<string | null>(null);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [contactNotice, setContactNotice] = useState(false);
  const [activeSection, setActiveSection] = useState("inicio");
  const closeModalRef = useRef<HTMLButtonElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const reelRowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const updateScroll = () => {
      frame = 0;
      const top = window.scrollY;
      const distance = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      setScrolled(top > 40);
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${Math.min(1, top / distance)})`;
      if (heroRef.current && finePointer && !reducedMotion) heroRef.current.style.setProperty("--hero-shift", `${Math.min(54, top * .075)}px`);
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(updateScroll); };
    updateScroll(); window.addEventListener("scroll", onScroll, { passive: true });
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("isVisible")), { threshold: .14 });
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    const sectionObserver = new IntersectionObserver((entries) => {
      const visible = entries.filter(entry => entry.isIntersecting).sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActiveSection(visible.target.id);
    }, { rootMargin: "-28% 0px -58%", threshold: [0, .2, .5] });
    ["inicio","sabores","diferenciais","nossa-casa","visite"].forEach(id => { const section = document.getElementById(id); if (section) sectionObserver.observe(section); });
    const videoObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      const video = entry.target as HTMLVideoElement;
      if (!entry.isIntersecting) video.pause();
      else if (video.classList.contains("heroVideo") && !document.hidden) video.play().catch(() => undefined);
    }), { threshold: .12 });
    document.querySelectorAll("video").forEach(video => videoObserver.observe(video));
    const cards = document.querySelectorAll<HTMLElement>(".productCard,.whyCard");
    const onPointer = (event: Event) => {
      const pointer = event as PointerEvent; const card = pointer.currentTarget as HTMLElement; const rect = card.getBoundingClientRect();
      card.style.setProperty("--mouse-x", `${pointer.clientX - rect.left}px`); card.style.setProperty("--mouse-y", `${pointer.clientY - rect.top}px`);
    };
    if (finePointer && !reducedMotion) cards.forEach(card => card.addEventListener("pointermove", onPointer, { passive: true }));
    const onVisibility = () => document.body.classList.toggle("tabHidden", document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => { window.removeEventListener("scroll", onScroll); if(frame) cancelAnimationFrame(frame); observer.disconnect(); sectionObserver.disconnect(); videoObserver.disconnect(); cards.forEach(card => card.removeEventListener("pointermove", onPointer)); document.removeEventListener("visibilitychange", onVisibility); document.body.classList.remove("tabHidden"); };
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen || product ? "hidden" : "";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setMenuOpen(false); setProduct(null); }
    };
    window.addEventListener("keydown", onKey);
    if (product) requestAnimationFrame(() => closeModalRef.current?.focus());
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", onKey); };
  }, [menuOpen, product]);

  const order = () => { setContactNotice(true); document.querySelector("#contato")?.scrollIntoView({ behavior: "smooth" }); };
  const moveReels = (direction: number) => reelRowRef.current?.scrollBy({ left: direction * Math.min(430, window.innerWidth * .78), behavior: "smooth" });

  return (
    <main>
      <a className="skipLink" href="#conteudo">Pular para o conteúdo</a>
      <div className="scrollProgress" ref={progressRef} aria-hidden="true" />
      <header className={`siteHeader ${scrolled ? "isScrolled" : ""}`}>
        <a className="brand" href="#inicio" aria-label="Casa do Panettone, início">
          <span className="brandMark"><img src="/logo-premium.png" alt="" /></span>
          <span className="brandType"><b>Casa do Panettone</b><small>Loja de fábrica</small></span>
        </a>
        <nav className="navPill" aria-label="Navegação principal"><a className={activeSection==="sabores"?"active":""} href="#sabores"><span>01</span> Sabores</a><a className={activeSection==="diferenciais"?"active":""} href="#diferenciais"><span>02</span> Diferenciais</a><a className={activeSection==="nossa-casa"?"active":""} href="#nossa-casa"><span>03</span> Nossa casa</a><a className={activeSection==="visite"?"active":""} href="#visite"><span>04</span> Visite</a></nav>
        <button className="button headerCta" onClick={order}><span className="ctaDot"/> Fazer meu pedido <b>↗</b></button>
        <button className="menuButton" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? "Fechar menu" : "Abrir menu"} aria-expanded={menuOpen} aria-controls="menu-mobile"><span/><span/></button>
      </header>

      <div id="menu-mobile" className={`mobileMenu ${menuOpen ? "open" : ""}`} aria-hidden={!menuOpen}>
        {[["Sabores","#sabores"],["Nossa casa","#nossa-casa"],["Experiência","#experiencia"],["Contato","#contato"]].map(([label,href],i)=><a key={href} href={href} onClick={()=>setMenuOpen(false)}><small>0{i+1}</small>{label}</a>)}
      </div>

      <section className="hero" id="inicio" ref={heroRef}>
        <video className="heroVideo" autoPlay muted loop playsInline poster="/produto-hero.jpg"><source src="/hero.mp4" type="video/mp4" /></video>
        <div className="heroShade" />
        <div className="heroContent" id="conteudo">
          <p className="eyebrow">Direto da nossa fábrica</p>
          <h1>O sabor que faz qualquer momento virar <em>celebração.</em></h1>
          <p className="lead">Receitas macias, generosas e cheias de carinho — feitas para compartilhar, presentear ou guardar só para você.</p>
          <div className="heroActions"><a className="button buttonGold" href="#sabores">Conheça os sabores <span>↓</span></a><button className="textLink" onClick={order}>Fazer meu pedido <span>↗</span></button></div>
        </div>
        <div className="heroFoot"><span>Casa do Panettone · Loja de fábrica</span><span>Role para sentir ↓</span></div>
      </section>

      <div className="ticker" aria-label="Diferenciais da Casa do Panettone"><div className="tickerTrack">{[0,1].map(group=><div className="tickerGroup" aria-hidden={group===1} key={group}>{tickerPhrases.map(phrase=><span key={`${group}-${phrase}`}><b>✦</b>{phrase}</span>)}</div>)}</div></div>

      <section className="manifesto reveal">
        <p className="sectionLabel">Tem coisas que a gente não explica. Sente.</p>
        <h2>Macio por dentro.<br/><em>Dourado por fora.</em><br/>Difícil é parar na primeira fatia.</h2>
        <div className="crumb brandSymbol" aria-hidden="true"><img src="/simbolo-casa-panettone.png" alt="" width="1536" height="1536" loading="lazy" decoding="async"/></div>
      </section>

      <section className="products" id="sabores">
        <div className="sectionHead reveal"><div><p className="sectionLabel">Escolha o seu favorito</p><h2>Sabores que<br/>falam por si.</h2></div><p>Do café demorado ao presente inesperado, existe uma receita da nossa casa para deixar o momento ainda mais gostoso.</p></div>
        <div className="productGrid">
          <article className="productCard chocolate reveal" onClick={()=>setProduct("Gotas sabor chocolate")} tabIndex={0} onKeyDown={e=>e.key==="Enter"&&setProduct("Gotas sabor chocolate")}>
            <div className="productNumber">01</div><div className="productImage"><img src="/produto-close.jpg" alt="Panettone Casa do Panettone com gotas sabor chocolate, 400 gramas" width="1080" height="1440" loading="lazy" decoding="async" /></div>
            <div className="productInfo"><div><p>Generoso · 400 g</p><h3>Gotas sabor<br/><em>chocolate</em></h3></div><button aria-label="Ver produto com gotas sabor chocolate">↗</button></div>
          </article>
          <article className="productCard fruits reveal" onClick={()=>setProduct("Panettone de frutas")} tabIndex={0} onKeyDown={e=>e.key==="Enter"&&setProduct("Panettone de frutas")}>
            <div className="productNumber">02</div><div className="productImage"><img src="/produto-hero.jpg" alt="Panettones Casa do Panettone de frutas e chocolate" width="1440" height="1920" loading="lazy" decoding="async" /></div>
            <div className="productInfo"><div><p>Clássico · 400 g</p><h3>Panettone<br/><em>de frutas</em></h3></div><button aria-label="Ver panettone de frutas">↗</button></div>
          </article>
        </div>
      </section>

      <section className="whyUs" id="diferenciais">
        <div className="whyIntro reveal"><p className="sectionLabel">O cuidado mora nos detalhes</p><h2>Mais que panettone.<br/><em>Um momento inteiro.</em></h2><p>Cada escolha importa: o sabor, a textura, a apresentação e a alegria de colocar algo especial no centro da mesa.</p></div>
        <div className="whyGrid">
          <article className="whyCard reveal"><span>01</span><div className="whyMark"><img src="/simbolo-casa-panettone.png" alt="" width="1536" height="1536" loading="lazy"/></div><div className="whyWord">Fábrica</div><h3>Direto da loja<br/>de fábrica</h3><p>Uma experiência próxima da marca, com atendimento para conhecer os sabores disponíveis.</p></article>
          <article className="whyCard featured reveal"><span>02</span><div className="whyMark"><img src="/simbolo-casa-panettone.png" alt="" width="1536" height="1536" loading="lazy"/></div><div className="whyWord">Encontro</div><h3>Receitas para<br/>compartilhar</h3><p>Panettones que chegam à mesa para acompanhar encontros, presentes e momentos especiais.</p></article>
          <article className="whyCard reveal"><span>03</span><div className="whyMark"><img src="/simbolo-casa-panettone.png" alt="" width="1536" height="1536" loading="lazy"/></div><div className="whyWord">Sabor</div><h3>Sabor em cada<br/>pedaço</h3><p>Opções com gotas sabor chocolate e frutas para escolher a receita que combina com você.</p></article>
        </div>
      </section>

      <section className="factoryMoment reveal" aria-label="Panettones recém-produzidos">
        <img src="/fornada-panettone.webp" alt="Grande fornada de panettones com gotas de chocolate na fábrica" width="1080" height="1920" loading="lazy" decoding="async"/>
        <div className="factoryShade"/>
        <div className="factoryMomentCopy"><p className="sectionLabel">Uma fornada cheia de sabor</p><h2>Feitos para chegar<br/><em>fresquinhos à mesa.</em></h2><p>Da produção ao momento de compartilhar, cada panettone carrega o cuidado da nossa casa.</p></div>
        <span className="factoryCounter">Da fábrica para você</span>
      </section>

      <section className="story" id="nossa-casa">
        <div className="storyMedia reveal"><img src="/produto-hero.jpg" alt="Seleção de produtos da Casa do Panettone" width="1440" height="1920" loading="lazy" decoding="async"/><span>Da nossa casa<br/>para a sua.</span></div>
        <div className="storyCopy reveal"><p className="sectionLabel">Nossa casa</p><h2>Uma receita feita para criar <em>memórias.</em></h2><p>Na Casa do Panettone, cada receita nasce para levar mais sabor à mesa. Da nossa fábrica para a sua casa, unimos carinho, tradição e aquela vontade irresistível de cortar só mais uma fatia.</p><div className="storyPoints"><span><b>01</b>Cuidado em cada receita</span><span><b>02</b>Direto da loja de fábrica</span><span><b>03</b>Perto de quem saboreia</span></div></div>
      </section>

      <section className="experience" id="experiencia">
        <div className="sectionHead light reveal"><div><p className="sectionLabel">Aperte o play</p><h2>Deu vontade?<br/><em>A gente entende.</em></h2></div><div className="experienceIntro"><p>Novos registros da nossa casa, dos produtos e dos detalhes que fazem cada receita chegar à mesa ainda mais especial.</p><div className="reelControls" aria-label="Navegar pelos vídeos"><button onClick={()=>moveReels(-1)} aria-label="Vídeos anteriores">←</button><span>Arraste para explorar</span><button onClick={()=>moveReels(1)} aria-label="Próximos vídeos">→</button></div></div></div>
        <div className="reelRow" ref={reelRowRef}>{videos.map((video,i)=><figure className="reel reveal" key={video.src}><div className="reelMedia"><video controls playsInline preload="none" poster={i%2?"/produto-close.jpg":"/produto-hero.jpg"}><source src={video.src} type="video/mp4"/></video><span className="reelIndex">{String(i+1).padStart(2,"0")}</span></div><figcaption><span>Casa do Panettone</span>{video.label}</figcaption></figure>)}</div>
      </section>

      <section className="occasions"><p className="sectionLabel reveal">Cabe em todos os momentos</p><div className="occasionList">{["Café sem pressa","Um presente gostoso","Mesa cheia de gente","Pedidos em quantidade"].map((item,i)=><div className="occasion reveal" key={item}><span>0{i+1}</span><h3>{item}</h3><b>↗</b></div>)}</div></section>

      <section className="orderGuide">
        <div className="orderGuideHead reveal"><p className="sectionLabel">Simples do começo ao último pedaço</p><h2>Do desejo<br/><em>ao pedido.</em></h2></div>
        <div className="orderSteps">
          <div className="orderStep reveal"><span>01</span><h3>Escolha seu sabor</h3><p>Conheça as opções apresentadas e descubra qual combina com o seu momento.</p></div>
          <div className="orderStep reveal"><span>02</span><h3>Fale com a nossa casa</h3><p>Consulte diretamente a equipe sobre disponibilidade, quantidades e encomendas.</p></div>
          <div className="orderStep reveal"><span>03</span><h3>Leve sabor para a mesa</h3><p>Confirme os detalhes do pedido e prepare-se para compartilhar uma experiência deliciosa.</p></div>
        </div>
        <button className="button buttonGold orderGuideCta" onClick={order}>Começar meu pedido <span>↗</span></button>
      </section>

      <section className="giftSection">
        <div className="giftCopy reveal"><p className="sectionLabel">Para dividir, presentear e celebrar</p><h2>Um gesto simples.<br/><em>Cheio de sabor.</em></h2><p>Seja para levar à mesa, surpreender alguém ou organizar um pedido em quantidade, a equipe pode orientar sobre as opções disponíveis.</p><div className="giftActions"><button className="button buttonGold" onClick={order}>Consultar opções <span>↗</span></button><a className="giftLink" href="#sabores">Ver sabores <span>↓</span></a></div></div>
        <div className="giftMosaic reveal"><div className="giftTall"><img src="/produto-close.jpg" alt="Panettone com gotas sabor chocolate" width="1080" height="1440" loading="lazy" decoding="async"/></div><div className="giftSmall"><img src="/produto-hero.jpg" alt="Seleção de panettones da marca" width="1440" height="1920" loading="lazy" decoding="async"/></div><div className="giftQuote"><small>Para presentear</small><p>Um presente que começa pelos olhos e fica na memória pelo sabor.</p></div></div>
      </section>

      <section className="foodInfo">
        <div className="foodInfoTitle reveal"><p className="sectionLabel">Escolha com informação</p><h2>Antes de<br/><em>saborear.</em></h2></div>
        <div className="foodInfoContent reveal"><p>Informações de ingredientes, alergênicos, conservação e validade devem ser consultadas diretamente no rótulo de cada produto. Em caso de dúvida, fale com a equipe antes de realizar o pedido.</p><div className="foodInfoChecks"><span>Consulte o rótulo do produto</span><span>Confirme informações com a loja</span><span>Verifique o produto no recebimento</span></div><button className="textButton" onClick={order}>Tirar uma dúvida <b>↗</b></button></div>
      </section>

      <section className="visitUs" id="visite">
        <div className="visitPhoto reveal"><img src="/produto-hero.jpg" alt="Produtos disponíveis na Casa do Panettone" width="1440" height="1920" loading="lazy" decoding="async"/><div className="visitBadge">Loja de fábrica</div></div>
        <div className="visitCopy reveal"><p className="sectionLabel">Venha conhecer a nossa casa</p><h2>Mais perto do<br/><em>sabor.</em></h2><p>Quer receber a localização, consultar o horário de atendimento ou saber o que está disponível hoje? Fale com a equipe antes de visitar.</p><div className="visitFacts"><div><small>Localização</small><strong>Consulte a rota com a equipe</strong></div><div><small>Funcionamento</small><strong>Confirme o horário de hoje</strong></div><div><small>Atendimento</small><strong>Direto com a loja de fábrica</strong></div></div><button className="button buttonGold" onClick={order}>Pedir informações <span>↗</span></button></div>
      </section>

      <section className="faq"><div className="faqTitle reveal"><p className="sectionLabel">Antes da primeira fatia</p><h2>Perguntas<br/><em>frequentes.</em></h2></div><div className="faqList">{faqs.map(([q,a],i)=><div className={`faqItem ${activeFaq===i?"active":""}`} key={q}><button onClick={()=>setActiveFaq(activeFaq===i?null:i)} aria-expanded={activeFaq===i} aria-controls={`faq-answer-${i}`}><span>0{i+1}</span>{q}<b aria-hidden="true">{activeFaq===i?"−":"+"}</b></button><div className="answer" id={`faq-answer-${i}`} aria-hidden={activeFaq!==i}><p>{a}</p></div></div>)}</div></section>

      <section className="contact" id="contato"><div className="contactGlow"/><p className="sectionLabel">A vontade bateu?</p><h2>Seu próximo momento gostoso <em>começa aqui.</em></h2><p>Escolha seu sabor e fale diretamente com a Casa do Panettone.</p><button className="button buttonCream" onClick={()=>setContactNotice(true)}>Quero fazer meu pedido <span>↗</span></button>{contactNotice&&<div className="notice" role="status">O contato oficial será adicionado aqui. Enquanto isso, fale com a loja pelos canais oficiais da marca.</div>}</section>

      <div className="mobileAction" aria-label="Ação rápida"><button onClick={order}><span>Fazer meu pedido</span><b>↗</b></button></div>

      <footer>
        <div className="footerTop">
          <div className="footerStatement"><p className="footerLabel">Uma última fatia?</p><h2>Da nossa casa<br/><em>para a sua.</em></h2></div>
          <button className="footerOrder" onClick={order}><span>Fazer meu<br/>pedido</span><b>↗</b></button>
        </div>
        <div className="footerMiddle">
          <div className="footerSignature"><b>Casa do Panettone</b><p>Receitas cheias de sabor, feitas para transformar qualquer momento em celebração.</p><button className="footerContact" onClick={order}>Falar com a loja <span>↗</span></button></div>
          <div className="footerColumn"><p className="footerLabel">Links rápidos</p><a href="#inicio">Início <span>↗</span></a><a href="#sabores">Sabores <span>↗</span></a><a href="#nossa-casa">Nossa casa <span>↗</span></a><a href="#experiencia">Experiência <span>↗</span></a><a href="#contato">Contato <span>↗</span></a></div>
          <div className="footerColumn"><p className="footerLabel">Visite e acompanhe</p><button onClick={order}>WhatsApp <span>↗</span></button><p>Instagram · perfil oficial</p><p>Endereço · consulte a localização</p><p>Horário · confirme antes de visitar</p></div>
          <a className="backTop" href="#inicio" aria-label="Voltar ao início">↑<small>Voltar ao topo</small></a>
        </div>
        <div className="footerBottom"><span>© {new Date().getFullYear()} Casa do Panettone</span><span className="footerSeal">Feito com carinho · servido com sabor</span><span>Todos os direitos reservados</span></div>
      </footer>

      {product&&<div className="modalBackdrop" onClick={()=>setProduct(null)} role="presentation"><div className="productModal" role="dialog" aria-modal="true" aria-label={product} onClick={e=>e.stopPropagation()}><button ref={closeModalRef} className="close" onClick={()=>setProduct(null)} aria-label="Fechar">×</button><p className="sectionLabel">Casa do Panettone</p><h2>{product}</h2><p>Uma receita macia e cheia de sabor, feita para deixar o momento ainda mais especial.</p><button className="button buttonGold" onClick={()=>{setProduct(null);order()}}>Quero este sabor <span>↗</span></button></div></div>}
    </main>
  );
}
