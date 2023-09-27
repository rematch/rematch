"use strict";(self.webpackChunkrematch_docs=self.webpackChunkrematch_docs||[]).push([[3237],{6658:function(e,t,a){a.d(t,{Z:function(){return c}});var l=a(7378),n=a(5894);function r(){var e=n.Z.canUseDOM&&window;return{width:e.innerWidth,height:e.innerHeight}}function c(){var e=(0,l.useState)(r()),t=e[0],a=e[1];return(0,l.useEffect)((function(){function e(){a(r())}return n.Z.canUseEventListeners&&window.addEventListener("resize",e),function(){n.Z.canUseEventListeners&&window.removeEventListener("resize",e)}}),[]),t}},3253:function(e,t,a){a.r(t),a.d(t,{Wave:function(){return p}});var l=a(2685),n=a(7378),r=a(8944),c=a(3164),s=a(1191),o=a(1218),m=a(1847),i=a(3488),u=a(6658),d=[{title:"No configuration",imageUrl:"icons/tool.svg",description:n.createElement(n.Fragment,null,"No more thunks, switch statements, action types, action creators. All is handled out of the box with just one file.")},{title:"Plugins API",imageUrl:"icons/globe.svg",description:n.createElement(n.Fragment,null,"Rematch exposes a simple API interface to create custom plugins for extend Rematch functionality. Official plugins also out-of-the-box.")},{title:"Built-in side-effects",imageUrl:"icons/radio.svg",description:n.createElement(n.Fragment,null,"Native ",n.createElement("code",null,"async/await")," to call your external API's. You won't need redux-thunks anymore.")},{title:"TypeScript support",imageUrl:"icons/type.svg",description:n.createElement(n.Fragment,null,n.createElement("code",null,"TypeScript")," support out of the box. You will have autocomplete of all your methods, state and reducers. Written 100% in TypeScript.")},{title:"Framework agnostic",imageUrl:"icons/cpu.svg",description:n.createElement(n.Fragment,null,"Use Rematch in the browser, in React, in Angular, in Vue... anywhere. We ship ESM, UMD and CJS builds.")},{title:"The smallest",imageUrl:"icons/zap.svg",description:n.createElement(n.Fragment,null,"Less than ",n.createElement("code",null,"2kb")," and supports tree-shaking.",n.createElement("div",{className:"margin-top--sm"},n.createElement("img",{loading:"lazy",alt:"Rematch Core Size",src:"https://img.shields.io/bundlephobia/minzip/@rematch/core?style=flat"})," ",n.createElement("img",{loading:"lazy",alt:"Rematch Core tree-shaking enabled",src:"https://badgen.net/bundlephobia/tree-shaking/@rematch/core?style=flat"})))}],h=function(e){var t=e.imageUrl,a=e.title,l=e.description,c=(0,m.Z)(t);return n.createElement("div",{className:(0,r.Z)("col col--4 text--center margin-top--lg",i.Z.feature)},c&&n.createElement("div",null,n.createElement("img",{loading:"lazy",className:i.Z.featureImage,src:c,alt:a})),n.createElement("h3",null,a),n.createElement("div",{className:i.Z.p},l))},p=function(){return n.createElement("div",{className:i.Z.underWave})},g=function(){return n.createElement("section",{className:(0,r.Z)(i.Z.features,i.Z.waveTop)},n.createElement("div",{className:"container"},n.createElement("div",{className:"row"},n.createElement("div",{className:"col col--8 text--center m-auto"},n.createElement("h1",null,"Unreal features"),n.createElement("p",{className:i.Z.p},"Using Redux always has been complicated, but now with Rematch you have more features than Redux offers with less than 2 kilobytes."))),n.createElement("div",{className:"row"},d.map((function(e,t){return n.createElement(h,(0,l.Z)({key:t},e))})))))},E=function(){return n.createElement("section",{className:(0,r.Z)(i.Z.features,i.Z.absoluteFeatures)},n.createElement("div",{className:"container margin-top--lg"},n.createElement("div",{className:"row text--center row--align-center"},n.createElement("div",{className:"col col--6 m-auto"},n.createElement("h1",{className:"h1"},"Open Sourcerers \ud83e\uddd9\ud83c\udffb\u200d\u2642\ufe0f"),n.createElement("div",{className:"m-auto"},n.createElement("a",{href:"https://github.com/rematch/rematch/graphs/contributors"},n.createElement("img",{className:i.Z.rematchContributorsImage,alt:"Rematch Contributors",src:"https://contrib.rocks/image?repo=rematch/rematch"})))),n.createElement("div",{className:"col col--6"},n.createElement("div",{className:"row row--align-center"},n.createElement("div",{className:"col col--6 text--center"},n.createElement("h3",null,"+2000"),n.createElement("p",{className:i.Z.p},"Projects using Rematch")),n.createElement("div",{className:"col col--6 text--center"},n.createElement("h3",null,"+7000 \u2b50\ufe0f"),n.createElement("p",{className:i.Z.p},"On Github"))),n.createElement("div",{className:"row"},n.createElement("div",{className:"col col--6 text--center"},n.createElement("h3",null,"+20.000"),n.createElement("p",{className:i.Z.p},"Weekly downloads")),n.createElement("div",{className:"col col--6 text--center"},n.createElement("h3",null,"A++"),n.createElement("p",{className:i.Z.p},"Maintainability")))))),n.createElement(p,null))},f=function(){return n.createElement("div",{className:(0,r.Z)(i.Z.ball),"aria-hidden":"true"},n.createElement("svg",{width:"1360",height:"578",viewBox:"0 0 1360 578",xmlns:"http://www.w3.org/2000/svg"},n.createElement("defs",null,n.createElement("linearGradient",{x1:"50%",y1:"0%",x2:"50%",y2:"100%",id:"illustration-01"},n.createElement("stop",{stopColor:"#FFF",offset:"0%"}),n.createElement("stop",{stopColor:"#EAEAEA",offset:"77.402%"}),n.createElement("stop",{stopColor:"#DFDFDF",offset:"100%"}))),n.createElement("g",{fill:"url(#illustration-01)",fillRule:"evenodd"},n.createElement("circle",{cx:"1232",cy:"128",r:"128"}),n.createElement("circle",{cx:"155",cy:"443",r:"64"}))))},v=function(){return n.createElement("section",{className:i.Z.features},n.createElement("div",{className:"container"},n.createElement("div",{className:"row row--align-center"},n.createElement("div",{className:"col col--6 text--left"},n.createElement("h1",null,"Never has been that easy"),n.createElement("p",{className:i.Z.p},n.createElement("ul",null,n.createElement("li",{className:"margin-top--md"},"Automatic intellisense with TypeScript steroids, autocomplete everything, avoid regressions."),n.createElement("li",{className:"margin-top--md"},"In just one file you can handle all your business logic with native Redux performance."),n.createElement("li",{className:"margin-top--md"},"Rematch it's less than 1,7kb introduces best-practices to avoid Redux boilerplate."))),n.createElement(s.Z,{className:(0,r.Z)("button button--outline button--tertiary button--lg",i.Z.getStarted),to:(0,m.Z)("docs/")},"Get Started ","->")),n.createElement("div",{className:"col col--6 text--center margin-top--lg"},n.createElement("img",{loading:"lazy",alt:"Real code of Rematch with TypeScript",style:{borderRadius:"0.75rem"},src:(0,m.Z)("/img/real-code.gif")})))))},b=function(e){var t,a=e.isMobile,l=e.company,r=e.children;return n.createElement(o.Z,{title:"Toggle testimonials",preferredAutoPlacement:"top",triggerDelay:a?0:375,trigger:a?"click":"hover",content:n.createElement("div",{className:i.Z.postelContainer},n.createElement("div",{className:i.Z.postelHeader},n.createElement("img",{loading:"lazy",src:l.logo,alt:l.name+" Logo",className:i.Z.postelImg}),n.createElement("p",{className:i.Z.postelHeaderName},l.name)),n.createElement("div",null,n.createElement("p",{className:i.Z.postelInfo},null==(t=l.popover)?void 0:t.testimonial)))},r)},w=function(){var e=(0,u.Z)().width<=1224;return n.createElement("section",{className:i.Z.features},n.createElement("div",{className:"container"},n.createElement("div",{className:"row"},n.createElement("div",{className:"col col--12 text--center"},n.createElement("h1",null,"Trusted by the best frontend teams")),n.createElement("div",{className:"col col--12 text--center margin-top--lg"},[{name:"Adobe",logo:(0,m.Z)("/img/showroom/adobe.png"),href:"https://www.adobe.com/es"},{name:"Alibaba",href:"https://www.alibaba.com",logo:(0,m.Z)("/img/showroom/alibaba.png")},{name:"Gatsby",href:"https://www.gatsbyjs.com/",logo:(0,m.Z)("/img/showroom/gatsby.svg")},{name:"Facebook",href:"https://opensource.facebook.com/",logo:(0,m.Z)("/img/showroom/fb-incubator.png")},{name:"Allfunds",logo:(0,m.Z)("/img/showroom/allfunds.png"),href:"https://allfunds.com/"},{name:"Kuaishou",logo:(0,m.Z)("/img/showroom/kuaishou.png"),href:"https://www.kuaishou.com/en",popover:{testimonial:"We are using Rematch in some of our internal projects. Rematch is an awesome wrapper of redux which let me think so little about state management. Thanks for the community!"}},{name:"Sueddeutsche",href:"https://www.sueddeutsche.de/",logo:(0,m.Z)("/img/showroom/suddeutsche.png")}].sort((function(e,t){return e.name.localeCompare(t.name)})).map((function(t){var a=n.createElement("a",{target:"__blank",rel:"noopener",href:t.href},n.createElement("div",{className:i.Z.trustedBy},n.createElement("div",{className:i.Z.trustedByContainerImage},n.createElement("img",{loading:"lazy",className:i.Z.trustedByImage,src:t.logo,alt:t.name+" Logo"}))));return t.popover?n.createElement(b,{company:t,isMobile:e},a):a}))))))},N=function(){return n.createElement("section",{className:i.Z.features},n.createElement("div",{className:"container"},n.createElement("div",{className:"row"},n.createElement("div",{className:"col col--12 text--center"},n.createElement("h1",null,"Redux vs Rematch"),n.createElement("div",{className:"align--center"},n.createElement("table",{className:"table-align--center"},n.createElement("thead",null,n.createElement("tr",null,n.createElement("th",null,"Features"),n.createElement("th",null,"Redux"),n.createElement("th",null,"Rematch"))),n.createElement("tbody",null,[{feature:"Simple setup",rematchHas:!0,reduxHas:!1},{feature:"No boilerplate",rematchHas:!0,reduxHas:!1},{feature:"Maintainability",rematchHas:!0,reduxHas:!1},{feature:"Configurable",rematchHas:!0,reduxHas:!0},{feature:"Redux Devtools",rematchHas:!0,reduxHas:!0},{feature:"Async/await effects",rematchHas:!0,reduxHas:!1},{feature:"Official plugins",rematchHas:!0,reduxHas:!1},{feature:"Mobile ready",rematchHas:!0,reduxHas:!1}].map((function(e){var t=e.feature,a=e.rematchHas,l=e.reduxHas;return n.createElement("tr",{key:t},n.createElement("td",null,t),n.createElement("td",null,l?n.createElement("span",null,"\u2705"):n.createElement("span",null,"\u274c")),n.createElement("td",null,a?n.createElement("span",null,"\u2705"):n.createElement("span",null,"\u274c")))})))))))))};t.default=function(){return n.createElement(c.Z,{title:"Rematch",description:"Redux made easy with Rematch"},n.createElement("header",null,n.createElement("div",{className:(0,r.Z)("container",i.Z.heroContainer)},n.createElement("h5",{className:i.Z.h5},"Redux made ",n.createElement("u",null,"easy")),n.createElement("h1",{className:i.Z.h1},"Rematch"),n.createElement("p",{className:i.Z.p},"Rematch is Redux best practices without the boilerplate"),n.createElement("div",{className:i.Z.buttons},n.createElement(s.Z,{className:(0,r.Z)("button button--outline button--tertiary button--lg",i.Z.getStarted),to:(0,m.Z)("docs/")},"Are you ready to Rematch?")),n.createElement("img",{className:(0,r.Z)(i.Z.heroImage),src:(0,m.Z)("/img/code.svg"),alt:"Example of Rematch Code"}))),n.createElement("main",null,n.createElement(g,null),n.createElement(E,null),n.createElement(N,null),n.createElement(w,null),n.createElement(v,null),n.createElement(p,null),n.createElement(f,null)))}},3488:function(e,t){t.Z={features:"features_3azU",featureImage:"featureImage_ZtzX",h1:"h1_3Sda",h2:"h2_2mdz",h3:"h3_YZSW",heroContainer:"heroContainer_fDSk",p:"p_Kl5r",h5:"h5_EeTg",buttons:"buttons_1r9m",flex:"flex_2tA3","flex-column":"flex-column_1Zgh",video:"video_2U-D",heroImage:"heroImage_1wJS",ball:"ball_3XR1",waveTop:"waveTop_3dpj",underWave:"underWave_1oUi",absoluteContainer:"absoluteContainer_hORf",absoluteFeatures:"absoluteFeatures_C7pa",trustedBy:"trustedBy_2PM_",trustedByContainerImage:"trustedByContainerImage_1sx_",trustedByImage:"trustedByImage_zRoE",postelContainer:"postelContainer_3fG1",postelHeader:"postelHeader_32fR",postelHeaderName:"postelHeaderName_Jzhi",postelInfo:"postelInfo_2I8T",postelImg:"postelImg_30kU",rematchContributorsImage:"rematchContributorsImage_1lz4"}}}]);