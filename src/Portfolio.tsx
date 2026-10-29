"use client";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, ArrowDown, ArrowRight, ChevronLeft, ChevronRight, X, Plus, Pencil, Download, Asterisk } from "lucide-react";
import { categories, galleryProjects, Project, PortfolioContent } from "./portfolio-data";

export default function Portfolio({content,canEdit}:{content:PortfolioContent;canEdit:boolean}){
  const projects = galleryProjects(content);
  const [selected,setSelected]=useState<{project:Project;index:number}|null>(null);
  const dialog=useRef<HTMLDialogElement>(null);
  const headline=content.headline.split("\n");
  const open=(project:Project,index=0)=>setSelected({project,index});
  const close=()=>setSelected(null);
  const step=(delta:number)=>setSelected(s=>s?{...s,index:(s.index+delta+s.project.images.length)%s.project.images.length}:null);
  useEffect(()=>{
    document.title=content.name?`${content.name} | Design Portfolio`:"Design Portfolio | Mission & Material";
  },[content.name]);
  useEffect(()=>{
    if(selected){dialog.current?.showModal();document.body.style.overflow="hidden";}
    else{dialog.current?.close();document.body.style.overflow="";}
    return ()=>{document.body.style.overflow="";};
  },[Boolean(selected)]);
  const card=(p:Project)=>{
    const notes=content.projects[p.id];
    return <article className={`project-card project-${p.id}`} key={p.id}>
      <button className={`artboard ${p.presentation??""}`} onClick={()=>open(p)} aria-label={`View ${notes.title}`}>
        {p.id==="bayonet"?<div className="publication-spread">{[0,1,5].map(i=><img key={i} src={p.images[i].thumb} alt={p.images[i].label} loading="lazy"/>)}</div>
          :p.id==="shirt"?<div className="shirt-pair">{p.images.slice(0,2).map(im=><figure key={im.id}><img src={im.thumb} alt={im.label} loading="lazy"/><figcaption>{im.id.endsWith("front")?"FRONT":"BACK"}</figcaption></figure>)}</div>
          :p.id==="condor"?<div className="condor-pair">{p.images.slice(0,2).map(im=><div key={im.id} style={{background:im.background}}><img src={im.thumb} alt={im.label} loading="lazy"/></div>)}</div>
          :p.id==="liquids-embroidery"?<div className="embroidery-pair"><img src={p.images[0].thumb} alt={p.images[0].label} loading="lazy"/><img src={p.images[1].thumb} alt={p.images[1].label} loading="lazy"/></div>
          :<img className="single-art" src={p.images[0].thumb} alt={p.images[0].label} loading="lazy"/>}
        {p.images.length>1&&<span className="image-count">{p.images.length} {p.id==="bayonet"?"pages":"views"}</span>}
        <span className="expand-icon"><Plus size={20}/></span>
      </button>
      <div className="project-info"><div className="project-title-row"><button onClick={()=>open(p)} className="project-title">{notes.title}<ArrowUpRight size={19}/></button>{notes.year&&<span className="year">{notes.year}</span>}</div><p className="project-type">{p.type}</p>{notes.description&&<p className="project-description">{notes.description}</p>}{canEdit&&!notes.description&&<a href={`./edit.html#project-${p.id}`} className="caption-prompt"><Plus size={12}/> Add project description</a>}</div>
    </article>;
  };
  const featured=projects.find(p=>p.id==="cratermaker")!;
  const artwork=selected?.project.images[selected.index];
  const notes=selected?content.projects[selected.project.id]:null;
  return <>
    <a href="#work" className="skip-link">Skip to work</a>
    {canEdit&&<div className="owner-bar"><span>Make it yours. Add a name, contact details, and project descriptions.</span><a href="./edit.html"><Pencil size={13}/> Edit portfolio</a></div>}
    <header className="site-header wrap"><a className="wordmark" href="#"><Asterisk size={33} strokeWidth={1.8}/><span>{content.name||"Design Portfolio"}</span></a><nav aria-label="Main navigation"><a href="#work">Work</a><a href="#about">About</a><a href="#contact" className="nav-contact">Get in touch <ArrowUpRight size={16}/></a></nav></header>
    <main>
      <section className="hero wrap" aria-labelledby="hero-title"><div className="hero-copy"><p className="eyebrow"><span className="small-dot"/>{content.specialty}</p><h1 id="hero-title">{headline.map((line,i)=><span key={i} className={i?"serif-line":""}>{line}</span>)}</h1><p className="hero-intro">{content.introduction}</p><a className="button dark" href="#work">Explore the work <ArrowDown size={17}/></a><div className="hero-caption"><span className="thin-line"/> From concept to something you can hold.</div></div>
        <button className="hero-art" onClick={()=>open(featured)} aria-label="Explore the CraterMaker Special mission patch"><span className="hero-art-top"><span>FEATURED WORK</span><span>01 / MISSION IDENTITY</span></span><div className="orbit-circle"/><img src="./art/cratermaker.webp" alt="CraterMaker Special mission patch: a rocket, Boilermaker helmet, and lunar landscape" fetchPriority="high"/><span className="hero-art-bottom"><span>{content.projects.cratermaker.title}<small>PSP LIQUIDS</small></span><span className="hero-open"><ArrowUpRight size={22}/></span></span></button>
      </section>
      <div id="work" className="work-start wrap"><span className="eyebrow">THE PORTFOLIO</span><span className="work-counter">14 PROJECTS · 5 DISCIPLINES</span></div>
      <nav className="category-nav" aria-label="Portfolio categories"><div className="wrap category-links">{categories.map(c=><a key={c.id} href={`#${c.id}`}><span>{c.number}</span>{c.short}</a>)}</div></nav>
      <div className="work-sections wrap">{categories.map(c=><section id={c.id} key={c.id} className={`portfolio-section section-${c.id}`} aria-labelledby={`heading-${c.id}`}><div className="section-heading"><div><p className="section-index">{c.number} / SELECTED WORK</p><h2 id={`heading-${c.id}`}>{c.name}</h2></div><p>{c.description}</p></div><div className={`project-grid grid-${c.id}`}>{projects.filter(p=>p.category===c.id).map(card)}</div></section>)}</div>
      <section id="about" className="about-section"><div className="wrap about-inner"><div><p className="eyebrow">BEHIND THE WORK</p><h2>Across mediums.<br/><em>With intention.</em></h2></div><div><p className="about-copy">{content.about}</p><div className="discipline-list"><span>Visual identity</span><span>Illustration</span><span>Textile graphics</span><span>Print & editorial</span></div>{canEdit&&<a className="text-link" href="./edit.html#profile">Edit introduction <Pencil size={13}/></a>}</div></div></section>
      <section id="contact" className="contact-section wrap"><div><p className="eyebrow">LET’S CONNECT</p><h2>{content.email?"Have a project in mind?":"Thanks for taking a look."}</h2></div>{content.email?<a className="contact-link" href={`mailto:${content.email}`}>{content.email}<ArrowUpRight size={26}/></a>:canEdit?<a className="button outline" href="./edit.html#profile">Add contact details <Plus size={17}/></a>:<a href="#work" className="text-link">Back to the work <ArrowRight size={17}/></a>}</section>
    </main>
    <footer className="site-footer wrap"><span>{content.name||"Design Portfolio"} <span className="footer-divider">/</span> Selected work</span><div><a href="./edit.html" target="_top">{canEdit?"Edit portfolio":"Portfolio editor"}</a><a href="#">Back to top ↑</a></div></footer>
    <dialog ref={dialog} className="project-dialog" onCancel={close} onClick={e=>{if(e.target===e.currentTarget)close();}} onKeyDown={e=>{if(e.key==="ArrowRight"){e.preventDefault();step(1);}if(e.key==="ArrowLeft"){e.preventDefault();step(-1);}}} aria-labelledby="dialog-title">
      {selected&&artwork&&notes&&<div className="dialog-shell"><header className="dialog-header"><span className="eyebrow">{categories.find(c=>c.id===selected.project.category)?.name}</span><button onClick={close} className="icon-button" aria-label="Close project"><X size={24}/></button></header><div className="dialog-grid"><div className="viewer"><div className="viewer-stage" style={{background:artwork.background??"#eeeee8"}}><img src={artwork.src} alt={artwork.label}/>{selected.project.images.length>1&&<><button className="gallery-arrow previous" aria-label="Previous image" onClick={()=>step(-1)}><ChevronLeft size={25}/></button><button className="gallery-arrow next" aria-label="Next image" onClick={()=>step(1)}><ChevronRight size={25}/></button></>}</div><div className="image-label"><span>{artwork.label}</span><span>{String(selected.index+1).padStart(2,"0")} / {String(selected.project.images.length).padStart(2,"0")}</span></div>{notes.captions[artwork.id]&&<p className="image-caption">{notes.captions[artwork.id]}</p>}{selected.project.images.length>1&&<div className="thumbnail-strip" aria-label="Choose an image">{selected.project.images.map((im,i)=><button key={im.id} onClick={()=>open(selected.project,i)} className={i===selected.index?"active":""} aria-label={`View ${im.label}`} aria-pressed={i===selected.index}><img src={im.thumb} alt="" loading="lazy"/><span>{i+1}</span></button>)}</div>}</div><aside className="project-details"><h2 id="dialog-title">{notes.title}</h2><p className="project-type">{selected.project.type}</p>{notes.description&&<p className="detail-description">{notes.description}</p>}{(notes.role||notes.tools||notes.year)&&<dl>{notes.role&&<><dt>Role</dt><dd>{notes.role}</dd></>}{notes.tools&&<><dt>Tools & process</dt><dd>{notes.tools}</dd></>}{notes.year&&<><dt>Year</dt><dd>{notes.year}</dd></>}</dl>}<div className="detail-links"><a href={artwork.src} target="_blank" rel="noopener noreferrer" className="text-link">Open full image <ArrowUpRight size={17}/></a>{selected.project.pdf&&<a href={selected.project.pdf} target="_blank" rel="noopener noreferrer" className="text-link">{selected.project.pdfLabel} <Download size={17}/></a>}{canEdit&&<a className="text-link editor-detail-link" href={`./edit.html#project-${selected.project.id}`}>Add or edit descriptions <Pencil size={14}/></a>}</div></aside></div></div>}
    </dialog>
  </>;
}
