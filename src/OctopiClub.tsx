import { Component, lazy, Suspense, useEffect, useRef, useState, type ReactNode } from 'react';
import type { GlobeMarker } from './components/ui/3d-globe';
const Globe = lazy(() => import('./components/ui/3d-globe'));
const markers: GlobeMarker[] = [[40.71,-74.01],[34.05,-118.24],[-23.55,-46.63],[51.5,-.12],[48.85,2.35],[25.2,55.27],[-33.92,18.42],[19.07,72.87],[1.35,103.82],[35.67,139.65],[-33.87,151.21]].map(([lat,lng])=>({lat,lng,src:'/globe/octopi-marker.png',label:'Octopi Poker',size:32}));
class GlobeBoundary extends Component<{children:ReactNode},{failed:boolean}> {
 state={failed:false};
 static getDerivedStateFromError(){return {failed:true};}
 render(){return this.state.failed?<div className="club-globe-fallback"/>:this.props.children;}
}
export default function OctopiClub({onStart}:{onStart:()=>void}) {
 const section=useRef<HTMLElement>(null);
 const [ready,setReady]=useState(false);
 const [visible,setVisible]=useState(false);
 const [reduced,setReduced]=useState(true);
 useEffect(()=>{
  const media=matchMedia('(prefers-reduced-motion: reduce)');
  const update=()=>setReduced(media.matches);update();media.addEventListener('change',update);
  const observer=new IntersectionObserver(([entry])=>{setVisible(entry.isIntersecting);if(entry.isIntersecting)setReady(true);},{rootMargin:'160px'});
  if(section.current)observer.observe(section.current);
  return()=>{observer.disconnect();media.removeEventListener('change',update);};
 },[]);
 return <section ref={section} id="octopi-club" className="section club-section" aria-labelledby="club-title">
  <div className="club-copy"><h2 id="club-title">Join the<br/>Octopi Club.</h2><p>Study, play and improve with players around the world.</p><button className="primary" onClick={onStart}>Join Octopi Poker <span aria-hidden="true">&#8599;</span></button></div>
  <div className="club-globe-area" aria-hidden="true"><GlobeBoundary><Suspense fallback={<div className="club-globe-fallback"/>}>{ready&&<Globe className="club-globe" active={visible} config={{textureUrl:'/globe/earth.jpg',bumpMapUrl:'/globe/earth-bump.png',showAtmosphere:true,atmosphereColor:'#6C5CE7',atmosphereIntensity:.18,initialRotation:{x:.3,y:1.1},bumpScale:2,autoRotateSpeed:reduced?0:.18,enableZoom:false,enablePan:false,ambientIntensity:1.2,pointLightIntensity:2,markerSize:32}} markers={markers}/>}</Suspense></GlobeBoundary></div>
 </section>;
}
