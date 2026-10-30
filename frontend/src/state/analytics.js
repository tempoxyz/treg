
export default {
// Product analytics — only when this deployment opted in (meta.posthog_key present); self-hosters send nothing.
    initAnalytics(){
      // /sitetrack.js (deferred in index.html, it runs before the app entry) initialises PostHog
      // with pageviews on, so first-touch source survives into the person; this only identifies.
      this.analyticsIdentify(); this.analyticsForget();
    },
// A super property a finished experiment registered stays in a returning visitor's PostHog cookie
// and rides on every event they send, so it is dropped once that experiment is gone.
analyticsForget(){ try{ window.posthog?.unregister?.('catalog_arm'); }catch(e){} },
analyticsIdentify(){ if(!this.me)return; if(window.TregTracking){window.TregTracking.identify(this.me,this.activeSlugNow);return;} if(!window.posthog || !window.posthog.identify || !this.me) return;
      try{ window.posthog.identify(this.me, {email:this.me}); if(this.activeSlugNow) window.posthog.group('team', this.activeSlugNow); }catch(e){} },
track(name, props){ if(this.welcome.on && this.welcome.replay) props={...props, replay:true};
      try{ if(window.posthog && window.posthog.capture) window.posthog.capture(name, props||{}); }catch(e){} },
// Support chat (Intercom) — only when this deployment opted in (meta.intercom_app_id present);
    // self-hosters load nothing. Booted AFTER /auth/me resolves (not at the /meta fetch, like
    // analytics) so the common case boots identified once instead of anonymous→identified.
    initIntercom(){
      const app=this.meta && this.meta.intercom_app_id; if(!app || window.__icInit) return; window.__icInit=true;
      window.intercomSettings=this.intercomPayload();
      const s=document.createElement('script'); s.async=true; s.src='https://widget.intercom.io/widget/'+app;
      const i=function(){i.c(arguments)}; i.q=[]; i.c=function(a){i.q.push(a)}; if(!window.Intercom) window.Intercom=i;
      document.head.appendChild(s);
      try{ window.Intercom('boot', this.intercomPayload()); }catch(e){}
    },
intercomPayload(){
      const p={app_id:this.meta.intercom_app_id};
      // Never send email without user_hash: an unhashed identify is exactly the impersonation
      // vector identity verification exists to close. No hash (or no login) = anonymous visitor chat.
      if(this.me && this.icHash){ p.email=this.me; p.user_hash=this.icHash;
        if(this.activeSlugNow) p.company={id:this.activeSlugNow, name:this.activeSlugNow}; }
      return p;
    },
intercomUpdate(){ try{ if(window.__icInit && window.Intercom) window.Intercom('update', this.intercomPayload()); }catch(e){} }
}
