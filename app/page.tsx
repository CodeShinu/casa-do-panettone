"use client";

import { useEffect, useState } from "react";

const videos = [
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

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [product, setProduct] = useState<string | null>(null);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [contactNotice, setContactNotice] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll(); window.addEventListener("scroll", onScroll, { passive: true });
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("isVisible")), { threshold: .14 });
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => { window.removeEventListener("scroll", onScroll); observer.disconnect(); };
  }, []);

  const order = () => { setContactNotice(true); document.querySelector("#contato")?.scrollIntoView({ behavior: "smooth" }); };

  return (
    <main>
      <header className={`siteHeader ${scrolled ? "isScrolled" : ""}`}>
        <a className="brand" href="#inicio" aria-label="Casa do Panettone, início">
          <span className="brandMark"><img src="/logo-premium.png" alt="" /></span>
          <span className="brandType"><b>Casa do Panettone</b><small>Loja de fábrica</small></span>
        </a>
        <nav className="navPill" aria-label="Navegação principal"><a href="#sabores"><span>01</span> Sabores</a><a href="#nossa-casa"><span>02</span> Nossa casa</a><a href="#experiencia"><span>03</span> Experiência</a><a href="#contato"><span>04</span> Contato</a></nav>
        <button className="button headerCta" onClick={order}><span className="ctaDot"/> Fazer meu pedido <b>↗</b></button>
        <button className="menuButton" onClick={() => setMenuOpen(!menuOpen)} aria-label="Abrir menu" aria-expanded={menuOpen}><span/><span/></button>
      </header>

      <div className={`mobileMenu ${menuOpen ? "open" : ""}`} aria-hidden={!menuOpen}>
        {[["Sabores","#sabores"],["Nossa casa","#nossa-casa"],["Experiência","#experiencia"],["Contato","#contato"]].map(([label,href],i)=><a key={href} href={href} onClick={()=>setMenuOpen(false)}><small>0{i+1}</small>{label}</a>)}
      </div>

      <section className="hero" id="inicio">
        <video className="heroVideo" autoPlay muted loop playsInline poster="/produto-hero.jpg"><source src="/hero.mp4" type="video/mp4" /></video>
        <div className="heroShade" />
        <div className="heroContent">
          <p className="eyebrow">Direto da nossa fábrica</p>
          <h1>O sabor que faz qualquer momento virar <em>celebração.</em></h1>
          <p className="lead">Receitas macias, generosas e cheias de carinho — feitas para compartilhar, presentear ou guardar só para você.</p>
          <div className="heroActions"><a className="button buttonGold" href="#sabores">Conheça os sabores <span>↓</span></a><button className="textLink" onClick={order}>Fazer meu pedido <span>↗</span></button></div>
        </div>
        <div className="heroFoot"><span>Casa do Panettone · Loja de fábrica</span><span>Role para sentir ↓</span></div>
      </section>

      <div className="ticker"><div><span>Loja de fábrica</span><b>✦</b><span>Feito para compartilhar</span><b>✦</b><span>Gotas de chocolate</span><b>✦</b><span>Frutas selecionadas</span><b>✦</b><span>Sabor que abraça</span><b>✦</b><span>Loja de fábrica</span><b>✦</b><span>Feito para compartilhar</span></div></div>

      <section className="manifesto reveal">
        <p className="sectionLabel">Tem coisas que a gente não explica. Sente.</p>
        <h2>Macio por dentro.<br/><em>Dourado por fora.</em><br/>Difícil é parar na primeira fatia.</h2>
        <div className="crumb" aria-hidden="true">✦</div>
      </section>

      <section className="products" id="sabores">
        <div className="sectionHead reveal"><div><p className="sectionLabel">Escolha o seu favorito</p><h2>Sabores que<br/>falam por si.</h2></div><p>Do café demorado ao presente inesperado, existe uma receita da nossa casa para deixar o momento ainda mais gostoso.</p></div>
        <div className="productGrid">
          <article className="productCard chocolate reveal" onClick={()=>setProduct("Gotas sabor chocolate")} tabIndex={0} onKeyDown={e=>e.key==="Enter"&&setProduct("Gotas sabor chocolate")}>
            <div className="productNumber">01</div><div className="productImage"><img src="/produto-close.jpg" alt="Panettone Casa do Panettone com gotas sabor chocolate, 400 gramas" /></div>
            <div className="productInfo"><div><p>Generoso · 400 g</p><h3>Gotas sabor<br/><em>chocolate</em></h3></div><button aria-label="Ver produto com gotas sabor chocolate">↗</button></div>
          </article>
          <article className="productCard fruits reveal" onClick={()=>setProduct("Panettone de frutas")} tabIndex={0} onKeyDown={e=>e.key==="Enter"&&setProduct("Panettone de frutas")}>
            <div className="productNumber">02</div><div className="productImage"><img src="/produto-hero.jpg" alt="Panettones Casa do Panettone de frutas e chocolate" /></div>
            <div className="productInfo"><div><p>Clássico · 400 g</p><h3>Panettone<br/><em>de frutas</em></h3></div><button aria-label="Ver panettone de frutas">↗</button></div>
          </article>
        </div>
      </section>

      <section className="story" id="nossa-casa">
        <div className="storyMedia reveal"><img src="/produto-hero.jpg" alt="Seleção de produtos da Casa do Panettone"/><span>Da nossa casa<br/>para a sua.</span></div>
        <div className="storyCopy reveal"><p className="sectionLabel">Nossa casa</p><h2>Uma receita feita para criar <em>memórias.</em></h2><p>Na Casa do Panettone, cada receita nasce para levar mais sabor à mesa. Da nossa fábrica para a sua casa, unimos carinho, tradição e aquela vontade irresistível de cortar só mais uma fatia.</p><div className="storyPoints"><span><b>01</b>Cuidado em cada receita</span><span><b>02</b>Direto da loja de fábrica</span><span><b>03</b>Perto de quem saboreia</span></div></div>
      </section>

      <section className="experience" id="experiencia">
        <div className="sectionHead light reveal"><div><p className="sectionLabel">Aperte o play</p><h2>Deu vontade?<br/><em>A gente entende.</em></h2></div><p>Um pouco do que acontece por aqui — e do que pode chegar até a sua mesa.</p></div>
        <div className="reelRow">{videos.map((video,i)=><figure className="reel reveal" key={video.src}><video controls playsInline preload="metadata" poster={i%2?"/produto-close.jpg":"/produto-hero.jpg"}><source src={video.src} type="video/mp4"/></video><figcaption><span>0{i+1}</span>{video.label}</figcaption></figure>)}</div>
      </section>

      <section className="occasions"><p className="sectionLabel reveal">Cabe em todos os momentos</p><div className="occasionList">{["Café sem pressa","Um presente gostoso","Mesa cheia de gente","Pedidos em quantidade"].map((item,i)=><div className="occasion reveal" key={item}><span>0{i+1}</span><h3>{item}</h3><b>↗</b></div>)}</div></section>

      <section className="faq"><div className="faqTitle reveal"><p className="sectionLabel">Antes da primeira fatia</p><h2>Perguntas<br/><em>frequentes.</em></h2></div><div className="faqList">{faqs.map(([q,a],i)=><div className={`faqItem reveal ${activeFaq===i?"active":""}`} key={q}><button onClick={()=>setActiveFaq(activeFaq===i?null:i)} aria-expanded={activeFaq===i}><span>0{i+1}</span>{q}<b>{activeFaq===i?"−":"+"}</b></button><div className="answer"><p>{a}</p></div></div>)}</div></section>

      <section className="contact" id="contato"><div className="contactGlow"/><p className="sectionLabel">A vontade bateu?</p><h2>Seu próximo momento gostoso <em>começa aqui.</em></h2><p>Escolha seu sabor e fale diretamente com a Casa do Panettone.</p><button className="button buttonCream" onClick={()=>setContactNotice(true)}>Quero fazer meu pedido <span>↗</span></button>{contactNotice&&<div className="notice" role="status">O contato oficial será adicionado aqui. Enquanto isso, fale com a loja pelos canais oficiais da marca.</div>}</section>

      <footer>
        <div className="footerTop">
          <div className="footerEmblem"><img src="/logo-premium.png" alt="Casa do Panettone — Loja de Fábrica"/></div>
          <div className="footerStatement"><p className="footerLabel">Uma última fatia?</p><h2>Da nossa casa<br/><em>para a sua.</em></h2></div>
          <button className="footerOrder" onClick={order}><span>Fazer meu<br/>pedido</span><b>↗</b></button>
        </div>
        <div className="footerMiddle">
          <div className="footerSignature"><b>Casa do Panettone</b><p>Receitas cheias de sabor, feitas para transformar qualquer momento em celebração.</p></div>
          <div className="footerColumn"><p className="footerLabel">Explore</p><a href="#inicio">Início <span>↗</span></a><a href="#sabores">Sabores <span>↗</span></a><a href="#nossa-casa">Nossa casa <span>↗</span></a><a href="#experiencia">Experiência <span>↗</span></a></div>
          <div className="footerColumn"><p className="footerLabel">Atendimento</p><button onClick={order}>Fazer um pedido <span>↗</span></button><a href="#contato">Fale com a gente <span>↗</span></a><p>Loja de fábrica</p></div>
          <a className="backTop" href="#inicio" aria-label="Voltar ao início">↑<small>Voltar ao topo</small></a>
        </div>
        <div className="footerBottom"><span>© {new Date().getFullYear()} Casa do Panettone</span><span className="footerSeal">✦ Feito com carinho · servido com sabor ✦</span><span>Todos os direitos reservados</span></div>
      </footer>

      {product&&<div className="modalBackdrop" onClick={()=>setProduct(null)} role="presentation"><div className="productModal" role="dialog" aria-modal="true" aria-label={product} onClick={e=>e.stopPropagation()}><button className="close" onClick={()=>setProduct(null)} aria-label="Fechar">×</button><p className="sectionLabel">Casa do Panettone</p><h2>{product}</h2><p>Uma receita macia e cheia de sabor, feita para deixar o momento ainda mais especial.</p><button className="button buttonGold" onClick={()=>{setProduct(null);order()}}>Quero este sabor <span>↗</span></button></div></div>}
    </main>
  );
}
