"use client";
import { useEffect, useState, useRef } from "react";
import { ArrowLeft, ArrowUpRight, Download, ChevronDown, Check, Eye, Upload } from "lucide-react";
import { categories, galleryProjects, PortfolioContent, ProjectNotes } from "./portfolio-data";

import Portfolio from "./Portfolio";
import { parseContent } from "./content";

export default function Editor({initial}:{initial:PortfolioContent}){
  const [content,setContent]=useState(initial);
  const projects = galleryProjects(content);
  const [busy,setBusy]=useState(false);
  const [dirty,setDirty]=useState(false);
  const [preview,setPreview]=useState(false);
  useEffect(()=>{if(!preview)document.title="Portfolio Text Editor";},[preview]);
  const importInput=useRef<HTMLInputElement>(null);
  const [message,setMessage]=useState("");
  const [error,setError]=useState(false);
  const update=(key:keyof PortfolioContent,value:string)=>{setContent(v=>({...v,[key]:value}));setDirty(true);setMessage("");};
  const updateProject=(id:string,key:keyof ProjectNotes,value:string)=>{setContent(v=>({...v,projects:{...v.projects,[id]:{...v.projects[id],[key]:value}}}));setDirty(true);setMessage("");};
  const updateCaption=(id:string,image:string,value:string)=>{setContent(v=>({...v,projects:{...v.projects,[id]:{...v.projects[id],captions:{...v.projects[id].captions,[image]:value}}}}));setDirty(true);setMessage("");};
  useEffect(()=>{const listener=(e:BeforeUnloadEvent)=>{if(dirty){e.preventDefault();e.returnValue="";}};window.addEventListener("beforeunload",listener);return()=>window.removeEventListener("beforeunload",listener);},[dirty]);
  useEffect(()=>{if(location.hash.startsWith("#project-")){const target=document.getElementById(location.hash.slice(1));if(target instanceof HTMLDetailsElement){target.open=true;target.scrollIntoView();}}},[]);
  function download(e:React.FormEvent){
    e.preventDefault();
    if(busy)return;
    try{parseContent(content);}catch(err){setError(true);setMessage(err instanceof Error?err.message:"Check your text fields.");return;}
    const blob=new Blob([JSON.stringify(content,null,2)+"\n"],{type:"application/json"});
    const url=URL.createObjectURL(blob);
    const link=document.createElement("a");link.href=url;link.download="portfolio.json";link.click();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
    setDirty(false);setError(false);setMessage("Text file downloaded. Replace docs/portfolio.json in your GitHub repository to publish these changes.");
  }
  async function importFile(e:React.ChangeEvent<HTMLInputElement>){
    const file=e.target.files?.[0];if(!file)return;
    try{if(file.size>20000000)throw new Error("Choose a portfolio.json text file smaller than 20 MB.");
      setContent(parseContent(JSON.parse(await file.text())));setDirty(true);setError(false);setMessage("Text file loaded into this draft. Preview it, then download when ready.");
    }catch(err){setError(true);setMessage(err instanceof Error?err.message:"This text file could not be read.");}
    e.target.value="";
  }
  async function addImages(id:string, files:File[]) {
    setBusy(true); setError(false);
    try {
      if ((content.extraImages?.[id]?.length||0)+files.length>30) throw new Error("Choose at most 30 extra pictures per project.");
      const added = [];
      for(const file of files) {
        if(!["image/jpeg","image/png","image/webp"].includes(file.type) || file.size>20000000) throw new Error("Choose JPG, PNG, or WebP images under 20 MB each.");
        const bitmap=await createImageBitmap(file);
        const ratio=Math.min(1,1600/Math.max(bitmap.width,bitmap.height));
        const canvas=document.createElement("canvas"); canvas.width=Math.max(1,Math.round(bitmap.width*ratio)); canvas.height=Math.max(1,Math.round(bitmap.height*ratio));
        canvas.getContext("2d")!.drawImage(bitmap,0,0,canvas.width,canvas.height); bitmap.close();
        const src=canvas.toDataURL("image/webp",0.82);
        if(src.length>2000000) throw new Error("One picture is too large. Please resize it first.");
        added.push({id:"upload-"+crypto.randomUUID(),src,thumb:src,label:file.name.replace(/\.[^.]+$/,"").slice(0,200)});
      }
      const next={...content,extraImages:{...content.extraImages,[id]:[...(content.extraImages?.[id]||[]),...added]}};
      if(JSON.stringify(next).length>19000000) throw new Error("This portfolio is approaching 20 MB. Add fewer pictures.");
      setContent(next);setDirty(true);setMessage("Pictures added to your draft. Preview, then download portfolio.json and upload it to docs on GitHub.");
    } catch(err) {setError(true);setMessage(err instanceof Error?err.message:"Unable to load image.");}
    finally {setBusy(false);}
  }
  if(preview)return <><div className="preview-bar"><span>Draft preview · not published</span><button className="button dark" onClick={()=>{setPreview(false);window.scrollTo(0,0);}}><ArrowLeft size={16}/> Back to editor</button></div><Portfolio content={content} canEdit={false}/></>;
  return <div className="editor"><header className="editor-header"><a href="./index.html" className="text-link"><ArrowLeft size={17}/> Portfolio</a><span className="eyebrow">PORTFOLIO EDITOR</span><a href="./index.html" target="_blank" rel="noopener noreferrer" className="text-link">View site <ArrowUpRight size={16}/></a></header><form onSubmit={download}><div className="editor-toolbar"><div><h1>Make it yours.</h1><p>Edit your story and add pictures to your projects.</p></div><div className="save-area"><span>{dirty?"Draft changes":"Ready to personalize"}</span><button type="submit" className="button dark" ><Download size={16}/> Download portfolio</button></div></div><div className="editor-instructions"><p><strong>Three steps to update the website</strong><br/>Edit the text below, preview your changes, then download <code>portfolio.json</code>. Replace docs/portfolio.json in your GitHub repository to publish.</p><div className="editor-actions"><button className="button outline" type="button" onClick={()=>{setPreview(true);window.scrollTo(0,0);}}><Eye size={16}/> Preview changes</button><button className="button outline" type="button" onClick={()=>importInput.current?.click()}><Upload size={16}/> Load text file</button><input ref={importInput} type="file" accept=".json,application/json" hidden onChange={importFile}/></div></div>{message&&<div className={`save-message ${error?"error":""}`} role={error?"alert":"status"}>{!error&&<Check size={17}/>} {message}</div>}<div className="editor-layout"><aside className="editor-nav"><a href="#profile">Name & introduction</a>{categories.map(c=><a key={c.id} href={`#edit-${c.id}`}><span>{c.number}</span>{c.short}</a>)}<p>Blank descriptions stay hidden. Changes are drafts until you upload the downloaded text file to GitHub.</p></aside><fieldset className="editor-fields"><section id="profile" className="edit-section"><p className="eyebrow">START HERE</p><h2>Name & introduction</h2><div className="field-pair"><label>Designer’s name<input value={content.name} onChange={e=>update("name",e.target.value)} placeholder="Add her name" maxLength={100}/></label><label>Contact email<input type="email" value={content.email} onChange={e=>update("email",e.target.value)} placeholder="name@example.com" maxLength={254}/></label></div><label>Specialty / short title<input value={content.specialty} onChange={e=>update("specialty",e.target.value)} maxLength={160}/></label><label>Homepage headline<textarea rows={2} value={content.headline} onChange={e=>update("headline",e.target.value)} maxLength={120} required/><small>Use a new line to set the second line in italic.</small></label><label>Short introduction<textarea rows={3} value={content.introduction} onChange={e=>update("introduction",e.target.value)} maxLength={650}/></label><label>About the designer<textarea rows={5} value={content.about} onChange={e=>update("about",e.target.value)} maxLength={2400} placeholder="Add her background, approach, and interests."/></label></section>{categories.map(c=><section key={c.id} id={`edit-${c.id}`} className="edit-section"><p className="eyebrow">SECTION {c.number}</p><h2>{c.name}</h2>{projects.filter(p=>p.category===c.id).map(p=><details key={p.id} id={`project-${p.id}`} className="edit-project"><summary><img src={p.images[0].thumb} alt=""/><span><strong>{content.projects[p.id].title}</strong><small>{p.images.length} image{p.images.length>1?"s":""} · {content.projects[p.id].description?"Description added":"Add a description"}</small></span><ChevronDown size={18}/></summary><div className="project-fields"><label>Project title<input value={content.projects[p.id].title} onChange={e=>updateProject(p.id,"title",e.target.value)} maxLength={100} required/></label><label>Project description<textarea rows={4} value={content.projects[p.id].description} onChange={e=>updateProject(p.id,"description",e.target.value)} maxLength={2400} placeholder="What was the brief? Who was it for? Explain the idea, your contribution, and the result."/></label><div className="field-pair"><label>Your role<input value={content.projects[p.id].role} onChange={e=>updateProject(p.id,"role",e.target.value)} maxLength={180} placeholder="Add your contribution"/></label><label>Year<input value={content.projects[p.id].year} onChange={e=>updateProject(p.id,"year",e.target.value)} maxLength={40} placeholder="Add the year"/></label></div><label>Tools & process<input value={content.projects[p.id].tools} onChange={e=>updateProject(p.id,"tools",e.target.value)} maxLength={180} placeholder="Add the tools and techniques used"/></label><h3>Pictures</h3><label>Add pictures to this project<input type="file" accept="image/jpeg,image/png,image/webp" multiple disabled={busy} onChange={e=>{const files=Array.from(e.target.files||[]);e.target.value="";if(files.length)addImages(p.id,files);}}/></label><p className="form-hint">{busy?"Preparing images…":"Choose JPG, PNG, or WebP. Pictures are resized and included in portfolio.json."}</p><h3>Image descriptions</h3><p className="form-hint">These appear beneath each image when someone opens the project.</p>{p.images.map(im=><div key={im.id} className="caption-field"><a href={im.src} target="_blank" rel="noopener noreferrer" aria-label={`Open ${im.label}`} style={{background:im.background}}><img src={im.thumb} alt={im.label}/></a><label>{im.label}{im.id.startsWith("upload-")&&<button type="button" className="button outline" disabled={busy} onClick={()=>{setContent(v=>({...v,extraImages:{...v.extraImages,[p.id]:(v.extraImages?.[p.id]||[]).filter(x=>x.id!==im.id)}}));setDirty(true);}}>Remove added picture</button>}<textarea rows={3} value={content.projects[p.id].captions[im.id]||""} onChange={e=>updateCaption(p.id,im.id,e.target.value)} maxLength={1200} placeholder="Add context, design choices, or production details for this image."/></label></div>)}</div></details>)}</section>)}</fieldset></div><div className="editor-bottom"><p>{dirty?"Download your text before leaving.":"Download portfolio.json, then upload it to GitHub to publish."}</p><button className="button dark" type="submit" ><Download size={16}/> Download portfolio</button></div></form></div>;
}
