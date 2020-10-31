(()=>{"use strict";window.util={isEnterEvent:(e,t)=>{13===e.keyCode&&t()},isMainMouseButtonEvent:(e,t)=>{0===e.button&&t()},isEscEvent:(e,t)=>{27===e.keyCode&&t()}},window.decorator={debounce:e=>{let t=null;return(...o)=>{t&&clearTimeout(t),t=setTimeout((()=>{e.call(null,...o)}),500)}}},window.http={load:(e,t,o)=>{const n=new XMLHttpRequest;n.responseType="json",n.addEventListener("load",(()=>{let e;switch(n.status){case 200:t(n.response);break;case 400:e="Неверный запрос";break;case 401:e="Пользователь не авторизован";break;case 404:e="Ничего не найдено";break;default:n.status,n.statusText}e&&o(e)})),n.addEventListener("error",(()=>o("Произошла ошибка соединения"))),n.addEventListener("timeout",(()=>{o(`Запрос не успел выполниться за ${n.timeout} мс`)})),n.open("GET",e),n.send()},upload:(e,t,o,n)=>{const r=new XMLHttpRequest;r.responseType="json",r.addEventListener("load",(()=>{o(r.response)})),r.addEventListener("error",(()=>{n()})),r.addEventListener("timeout",(()=>{n()})),r.open("POST",e),r.send(t)}},(()=>{const e=["gif","jpg","jpeg","png"];window.preview={subscribe:(t,o)=>{t.addEventListener("change",(()=>{Array.from(t.files).forEach((t=>{const n=t.name.toLowerCase();if(e.some((e=>n.endsWith(e)))){const e=new FileReader,n=()=>{o(e.result),e.removeEventListener("load",n)};e.addEventListener("load",n),e.readAsDataURL(t)}}))}))}}})(),window.pin={create:(e,t,o)=>{if(!(t&&t.offer&&t.location&&t.location.x&&t.location.y))return null;const n=e.cloneNode(!0);n.dataset.key=o;const r=t.location.x-Math.floor(25),s=t.location.y-70;n.style.left=r+"px",n.style.top=s+"px";const a=n.querySelector("img");return t.author&&t.author.avatar&&(a.src=t.author&&t.author.avatar),a.alt=t.offer.title,n}},(()=>{const e={palace:"Дворец",flat:"Квартира",house:"Дом",bungalow:"Бунгало"},t=document.querySelector("#card").content.querySelector(".map__card");let o;const n=(e,t,o)=>{e&&(t?e.textContent=o:e.hidden=!0)},r=e=>{o&&o(e.target.parentElement)};window.card={create:o=>{const r=t.cloneNode(!0);r.dataset.key=o.key;const s=r.querySelector(".popup__title");n(s,o.offer.title,o.offer.title);const a=r.querySelector(".popup__text--address");n(a,o.offer.address,o.offer.address);const c=r.querySelector(".popup__text--price");n(c,o.offer.price,o.offer.price+"₽/ночь");const i=r.querySelector(".popup__type");var d;n(i,o.offer.type,(d=o.offer.type,e[d]));const u=r.querySelector(".popup__text--capacity");n(u,o.offer.rooms&&o.offer.guests,(e=>{let t="комнаты",o="гостей";return 11!==e.rooms&&e.rooms%10==1?t="комната":(e.rooms%10>=5||e.rooms>=11&&e.rooms<=14||e.rooms%10==0)&&(t="комнат"),11!==e.guests&&e.guests%10==1&&(o="гостя"),`${e.rooms} ${t} для ${e.guests} ${o}`})(o.offer));const l=r.querySelector(".popup__text--time");n(l,o.offer.checkin&&o.offer.checkout,`Заезд после ${o.offer.checkin}, выезд до ${o.offer.checkout}`),((e,t)=>{const o=e.querySelector(".popup__features");if(o.innerHTML="",!t||0===t.length)return void(o.hidden=!0);const n=document.createDocumentFragment();t.forEach((e=>{let t=document.createElement("li"),o=["popup__feature","popup__feature--"+e];t.classList.add(...o),n.append(t)})),o.append(n)})(r,o.offer.features);const p=r.querySelector(".popup__description");n(p,o.offer.description,o.offer.description),((e,t)=>{const o=e.querySelector(".popup__photos"),n=o.querySelector("img");if(o.innerHTML="",!t||0===t.length)return void(o.hidden=!0);const r=document.createDocumentFragment();t.forEach((e=>{let t=n.cloneNode();t.src=e,r.append(t)})),o.append(r)})(r,o.offer.photos);const m=r.querySelector(".popup__avatar");return o.author&&o.author.avatar&&(m.src=o.author.avatar),r},close:e=>{e&&(e.querySelector(".popup__close").removeEventListener("click",r),e.remove())},open:(e,t)=>{t.before(e),e.querySelector(".popup__close").addEventListener("click",r)},subscribeToPopupClose:e=>{o=e}}})(),(()=>{const{util:e,pin:t,card:o,http:n,decorator:r}=window,s=document.querySelector(".map"),a=s.querySelector(".map__pin--main"),c=document.querySelector(".map__filters-container"),i=c.querySelector(".map__filters"),d=i.querySelector("#housing-type"),u=i.querySelector("#housing-price"),l=i.querySelector("#housing-rooms"),p=i.querySelector("#housing-guests"),m=i.querySelector(".map__features"),v=document.querySelector("#pin").content.querySelector(".map__pin"),y=document.querySelector(".map__pins"),f={x:Math.floor(32.5),y:Math.floor(32.5)};let E,h,L;const _=e=>{f.y=e?Math.floor(84):Math.floor(32.5)},g=()=>{const e={},t=parseInt(a.style.left,10),o=parseInt(a.style.top,10);return e.x=t+f.x,e.y=o+f.y,e},b=()=>{y.querySelectorAll('.map__pin:not([class*="map__pin--main"])').forEach((e=>e.remove()))},w=()=>{const e=S(),o=Array.from(e).slice(0,5);(e=>{const o=[];e.forEach(((e,n)=>{const r=t.create(v,e,n);r&&o.push(r)})),b(),y.append(...o)})(new Map(o))},S=()=>{const e=Array.from(L).filter((e=>{const t=e[1];return q(t)&&k(t)&&M(t)&&T(t)&&x(t)}));return new Map(e)},q=e=>"any"===d.value||d.value===e.offer.type,k=e=>"any"===u.value||"low"===u.value&&e.offer.price<1e4||"middle"===u.value&&e.offer.price>=1e4&&e.offer.price<=5e4||"high"===u.value&&e.offer.price>5e4,M=e=>"any"===l.value||+l.value===e.offer.rooms,T=e=>"any"===p.value||+p.value===e.offer.guests,x=e=>{const t=m.querySelectorAll(".map__checkbox:checked");return 0===t.length||Array.from(t).every((t=>e.offer.features.includes(t.value)))},C=()=>{P(),w()},D=e=>{const t=y.querySelector(".map__pin--active");t&&P(t),e.classList.add("map__pin--active"),H(e)},P=e=>{e||(e=y.querySelector(".map__pin--active")),e&&(e.classList.remove("map__pin--active"),X(e))},V=e=>{if(!e)return;const t=s.querySelector(`.map__pin[data-key="${e.dataset.key}"]`);P(t)},$=r.debounce(C),O=r.debounce(C),A=r.debounce(C),F=r.debounce(C),U=r.debounce(C),j=t=>{e.isMainMouseButtonEvent(t,(()=>K(t,D)))},R=t=>{e.isEnterEvent(t,(()=>K(t,D)))},N=e=>{e.preventDefault();const t={x:e.clientX,y:e.clientY},o=e=>{const o=t.x-e.clientX,n=t.y-e.clientY,{x:r,y:s}=g();let a=r-o,c=s-n;a<0?a=0:a>1200&&(a=1200),c<130?c=130:c>630&&(c=630),t.x=e.clientX,t.y=e.clientY,r===a&&s===c||(G(a,c),E&&E(g()))},n=e=>{e.preventDefault(),E(g()),document.removeEventListener("mousemove",o),document.removeEventListener("mouseup",n)};document.addEventListener("mousemove",o),document.addEventListener("mouseup",n)},X=e=>{if(!e)return;const t=s.querySelector(`.map__card[data-key="${e.dataset.key}"]`);t&&o.close(t)},H=e=>{const t=+e.dataset.key,n=L.get(t);n.key=t,(e=>{const t=o.create(e);o.open(t,c)})(n)},K=(e,t)=>{const o=e.target.closest('.map__pin:not([class*="map__pin--main"])');o&&t(o)},B=e=>{L=I(e),f.y=84,w();const t=y.querySelectorAll('.map__pin:not([class*="map__pin--main"])');t&&t.length>0&&(()=>{for(const e of i.children)e.disabled=!1;d.addEventListener("change",$),u.addEventListener("change",O),l.addEventListener("change",A),p.addEventListener("change",F),m.addEventListener("click",U)})()},Y=e=>{h(e)},I=e=>{if(!e||0===e.length)return null;const t=new Map;return e.forEach(((e,o)=>t.set(o+1,e))),t},G=(e,t)=>{const{x:o,y:n}=g(),r=o-e,s=n-t,c=a.offsetLeft-r,i=a.offsetTop-s;W(c,i)},W=(e,t)=>{a.style.left=e+"px",a.style.top=t+"px"};window.map={activate:()=>{s.classList.remove("map--faded"),o.subscribeToPopupClose(V),_(!0),E(g()),n.load("https://21.javascript.pages.academy/keksobooking/data",B,Y),s.addEventListener("mousedown",j),s.addEventListener("keydown",R),a.addEventListener("mousedown",N)},deactivate:()=>{s.classList.add("map--faded"),P(),b(),_(!1),W(570,375),E(g()),(()=>{for(const e of i.children)e.disabled=!0;i.reset(),d.removeEventListener("change",$),u.removeEventListener("change",O),l.removeEventListener("change",A),p.removeEventListener("change",F),m.addEventListener("click",U)})(),E=null},addOnMainPinMouseDown:e=>{a.addEventListener("mousedown",e)},addOnMainPinKeyDown:e=>{a.addEventListener("keydown",e)},removeOnMainPinMouseDown:e=>{a.removeEventListener("mousedown",e)},removeOnMainPinKeyDown:e=>{a.removeEventListener("keydown",e)},subscribeToMainPinUpdates:e=>{E=e},subscribeToLoadFailure:e=>{h=e},deactivateAnyPin:()=>P(null)}})(),(()=>{const e={100:[0],1:[1],2:[1,2],3:[1,2,3]},t={bungalow:0,flat:1e3,house:5e3,palace:1e4},{map:o,http:n,preview:r}=window;let s,a,c;const i=document.querySelector(".ad-form"),d=i.querySelector("#title"),u=i.querySelector("#type"),l=i.querySelector("#price"),p=i.querySelector("#room_number"),m=i.querySelector("#capacity"),v=i.querySelector("#timein"),y=i.querySelector("#timeout"),f=i.querySelector("#address"),E=i.querySelector(".ad-form__reset"),h=i.querySelector("#avatar"),L=i.querySelector(".ad-form-header__preview img"),_=L.src,g=i.querySelector("#images"),b=i.querySelector(".ad-form__photo"),w=()=>{const e=t[u.value];l.placeholder=e,l.min=e},S=t=>{const o=(n=+p.value,r=+m.value,e[n].includes(r));var n,r;p.setCustomValidity(""),m.setCustomValidity(""),o||t.setCustomValidity("Количество комнат не соответствует количеству гостей"),t.reportValidity()},q=e=>{S(e.target)},k=e=>{S(e.target)},M=()=>{d.validity.tooShort?d.setCustomValidity("Заголовок объявления должен состоять минимум из 30 символов"):d.validity.tooLong?d.setCustomValidity("Заголовок объявления не должен превышать 100 символов"):d.validity.valueMissing?d.setCustomValidity("Заголовок объявления это обязательное поле"):d.setCustomValidity("")},T=()=>{d.setCustomValidity("")},x=()=>{P()},C=()=>{w(),P()},D=()=>{P()},P=()=>{l.validity.valueMissing?l.setCustomValidity("Цена за ночь это обязательное поле"):l.validity.rangeOverflow&&l.setCustomValidity("Цена за ночь не должна превышать 1000000"),l.validity.valueMissing||l.validity.rangeOverflow||(V(u.value,l.value)?l.setCustomValidity(""):l.setCustomValidity(`Цена за ночь должна быть минимум ${t[u.value]} для данного типа жилья`)),l.reportValidity()},V=(e,o)=>t[e]<=o,$=()=>{y.value=v.value},O=()=>{v.value=y.value},A=e=>{n.upload("https://21.javascript.pages.academy/keksobooking",new FormData(i),F,U),e.preventDefault()},F=e=>{i.reset(),R(),s&&s(e)},U=()=>{a&&a()},j=()=>{R(),setTimeout(c,0)},R=()=>{_&&(L.src=_);for(const e of b.children)e.remove()},N=e=>{const{x:t,y:o}=e;f.value=`${t}, ${o}`};window.form={enable:()=>{i.classList.remove("ad-form--disabled"),i.addEventListener("submit",A),d.addEventListener("invalid",M),d.addEventListener("input",T),l.addEventListener("input",x),u.addEventListener("change",C),v.addEventListener("change",$),y.addEventListener("change",O),p.addEventListener("change",q),m.addEventListener("change",k),E.addEventListener("click",j),(()=>{for(const e of i.children)e.matches("#address")||(e.disabled=!1)})(),o.subscribeToMainPinUpdates(N),r.subscribe(h,(e=>{L.src=e})),r.subscribe(g,(e=>{for(const e of b.children)e.remove();const t=document.createElement("img");t.src=e,t.width=70,t.height=70,b.append(t)})),S(p),w(),P(u)},disable:()=>{i.classList.add("ad-form--disabled"),i.removeEventListener("submit",A),d.removeEventListener("invalid",M),d.removeEventListener("input",T),l.removeEventListener("input",x),u.removeEventListener("change",C),l.removeEventListener("change",D),v.removeEventListener("change",$),y.removeEventListener("change",O),p.removeEventListener("change",q),m.removeEventListener("change",k),E.removeEventListener("click",j),s=null,a=null,(()=>{for(const e of i.children)e.matches("#address")||(e.disabled=!0)})(),o.subscribeToMainPinUpdates(N)},subscribeToUploadSuccess:e=>{s=e},subscribeToUploadFailure:e=>{a=e},subscribeToReset:e=>{c=e}}})(),(()=>{const{map:e,form:t,util:o}=window,n=document.querySelector("main"),r=document.querySelector("#success").content.querySelector(".success"),s=document.querySelector("#error").content.querySelector(".error"),a=()=>{e.removeOnMainPinMouseDown(_),e.removeOnMainPinKeyDown(g),e.subscribeToLoadFailure(h),t.subscribeToUploadSuccess(f),t.subscribeToUploadFailure(E),t.subscribeToReset(y),t.enable(),e.activate(),document.addEventListener("keydown",L)},c=()=>{t.disable(),e.deactivate(),e.addOnMainPinMouseDown(_),e.addOnMainPinKeyDown(g),document.removeEventListener("keydown",L)},i=()=>{n.querySelector(".success").remove(),document.removeEventListener("click",p),document.removeEventListener("keydown",l)},d=e=>{let t;e?(t=document.createElement("div"),t.classList.add("error"),t.append(e)):t=s.cloneNode(!0),n.append(t),document.addEventListener("click",v),document.addEventListener("keydown",m)},u=()=>{n.querySelector(".error").remove(),document.removeEventListener("click",v),document.removeEventListener("keydown",m)},l=e=>{o.isEscEvent(e,i)},p=()=>{i()},m=e=>{o.isEscEvent(e,u)},v=()=>{u()},y=()=>{c()},f=()=>{c(),(()=>{const e=r.cloneNode(!0);n.append(e),document.addEventListener("click",p),document.addEventListener("keydown",l)})()},E=()=>{d()},h=()=>{setTimeout((()=>{d((()=>{const e=document.createElement("p");e.textContent="Ошибка запроса при загрузке данных сервера.",e.classList.add("error__message");const t=document.createElement("button");t.classList.add("error__button"),t.textContent="Закрыть";const o=document.createDocumentFragment();return o.append(e,t),o})())}),100)},L=t=>{o.isEscEvent(t,e.deactivateAnyPin)},_=e=>{o.isMainMouseButtonEvent(e,a)},g=e=>{o.isEnterEvent(e,a)};c()})()})();