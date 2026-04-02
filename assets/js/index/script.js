import { preloadImages } from "../../main/js/utils.min.js";
import { customDropdown, createFilterTab } from "../../main/js/global.min.js";
("use strict");
$ = jQuery;

const lenis = new Lenis();

lenis.on("scroll", ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

function heroAnimation() {
  gsap.registerPlugin(SplitText);
  gsap.set(".hero-content h2", { visibility: "visible" });

  const tl = gsap.timeline();

  const splitTitle = SplitText.create(".hero-content h2", {
    type: "lines",
    mask: "lines",
    linesClass: "line",
  });

  tl.to(".hero-image img", {
    scale: 1,
    duration: 2,
    ease: "power3.inOut",
  });

  tl.fromTo(
    splitTitle.lines,
    { y: "100%" },
    {
      y: "0%",
      duration: 0.8,
      ease: "power3.inOut",
      stagger: 0.05,
    },
    "-=0.8",
  );
}

function revealClipImage() {
  document.querySelectorAll(".reveal-animation").forEach((section) => {
    const imageItems = Array.from(
      section.querySelectorAll(".reveal-image-item"),
    );

    const bgItems = Array.from(section.querySelectorAll(".reveal-bg-item"));
    const circle = section.querySelector(".circle-gradient");

    gsap.set(circle, {
      position: "fixed",
      top: "-50%",
      left: "50%",
      xPercent: -50,
      yPercent: -50,
    });

    gsap.to(circle, {
      top: "25%",
      left: "20%",
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top bottom",
        end: "top top",
        scrub: 1,
        // markers: true
      },
    });

    // stack image
    imageItems.forEach((item, i) => {
      item.style.zIndex = imageItems.length - i;
    });

    // stack bg
    bgItems.forEach((item, i) => {
      item.style.zIndex = bgItems.length - i;
    });

    gsap.set([...imageItems.slice(1), ...bgItems.slice(1)], {
      clipPath: "inset(0 0 0 0)",
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: `+=${window.innerHeight * (imageItems.length - 1)}`,
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        // refreshPriority: 1,
        // markers: true
      },
    });

    imageItems.forEach((item, i) => {
      if (i === 0) return;

      tl.to(
        imageItems[i - 1],
        {
          clipPath: "inset(0 0 100% 0)",
          duration: 1,
          ease: "none",
        },
        i,
      ); // 👈 KEY
    });

    bgItems.forEach((item, i) => {
      if (i === 0) return;

      tl.to(
        bgItems[i - 1],
        {
          clipPath: "inset(0 0 100% 0)",
          duration: 1,
          ease: "none",
        },
        i,
      );
    });
  });
}

function partnerSection() {
  const section = document.querySelector(".partner");
  if (!section) return;

  const panel1 = section.querySelector(".panel-1");
  const panel2 = section.querySelector(".panel-2");
  const title = panel1.querySelector("h2");
  const desc = panel1.querySelector(".desc");
  const bgImg = section.querySelector(".section-bg img");
  const circle = document.querySelector(".circle-gradient");

  gsap.set(desc, { opacity: 0 });
  gsap.set(panel2, { opacity: 0, pointerEvents: "none" });

  gsap.set(circle, {
    position: "fixed",
    top: "50%",
    left: "50%",
    xPercent: -50,
    yPercent: -50,
    opacity: 0,
    scale: 0.6,
  });

  gsap.to(circle, {
    left: "20%",
    yPercent: 50,
    ease: "none",
    scrollTrigger: {
      trigger: section,
      start: "top+=140% top",
      endTrigger: ".reveal-animation",
      end: "top+=100vh top",
      scrub: 1,
    },
  });

  const extraScroll = window.innerHeight * 0.5;

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: "top top",
      end: () => "+=" + (window.innerHeight + extraScroll),
      pin: true,
      scrub: 1,
      anticipatePin: 1,
      pinSpacing: false,
    },
  });

  // 1. Image fade
  tl.to(
    bgImg,
    {
      opacity: 1,
      ease: "none",
      duration: 0.4,
    },
    0,
  );

  // 🎬 2. Desc + hide title + circle (80%)
  tl.to(
    desc,
    {
      opacity: 1,
      duration: 0.2,
      ease: "power1.out",
    },
    0.8,
  );

  tl.to(
    title,
    {
      opacity: 0,
      duration: 0.4,
    },
    0,
  );

  tl.to(
    circle,
    {
      opacity: 0.9,
      scale: 1,
      duration: 0.5,
      ease: "power2.out",
    },
    0.3,
  );

  // 2. Desc + hide title + circle (80%)
  tl.to(
    desc,
    {
      opacity: 1,
      duration: 0.3,
      ease: "power1.out",
    },
    0.5,
  );

  tl.to(
    panel1,
    {
      opacity: 0,
      duration: 0.3,
      ease: "power2.out",
    },
    1,
  )

    .to(panel2, {
      opacity: 1,
      pointerEvents: "auto",
      duration: 0.3,
      ease: "power2.out",
    });
}

function marquee() {
  document.querySelectorAll(".marquee-container").forEach((container) => {
    const content = container.querySelector(".marquee-content");
    const items = [...container.querySelectorAll(".marquee-item")];
    const speed = parseFloat(container.getAttribute("data-speed")) || 50;

    content.innerHTML = "";
    items.forEach((item) => content.appendChild(item.cloneNode(true)));

    const clonedItems = [...content.children];
    let totalWidth = 0;

    clonedItems.forEach((item) => (totalWidth += item.offsetWidth));

    const containerWidth = container.offsetWidth;
    const copiesNeeded = Math.ceil(containerWidth / totalWidth) + 2;

    for (let i = 0; i < copiesNeeded; i++) {
      clonedItems.forEach((item) => {
        content.appendChild(item.cloneNode(true));
      });
    }

    let fullWidth = 0;
    [...content.children].forEach((item) => (fullWidth += item.offsetWidth));

    gsap.set(content, {
      x: 0,
      willChange: "transform",
      force3D: true,
    });

    const tl = gsap.timeline({ repeat: -1 });
    tl.to(content, {
      x: -totalWidth,
      duration: totalWidth / speed,
      ease: "none",
      modifiers: {
        x: (x) => `${parseFloat(x) % totalWidth}px`,
      },
    });

    // Hover pause
    const pause = container.getAttribute("hover-pause") === "1";

    if (pause) {
      container.addEventListener("mouseenter", () => tl.pause());
      container.addEventListener("mouseleave", () => tl.resume());
    }
  });
}

function animationTextHeading() {
  gsap.registerPlugin(SplitText, ScrollTrigger);

  document.querySelectorAll(".el-heading-line").forEach((el) => {
    if (el.dataset.scriptInitialized) return;
    el.dataset.scriptInitialized = "true";

    const splitTitle = SplitText.create(el, {
      type: "lines",
      mask: "lines",
      linesClass: "line",
    });

    gsap.fromTo(
      splitTitle.lines,
      { y: "100%" },
      {
        y: "0%",
        duration: 0.8,
        ease: "power3.inOut",
        stagger: 0.05,
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          end: "bottom 85%",
          toggleActions: "play none none none",
        },
      },
    );
  });
}
function bgImageParallax() {
  document.querySelectorAll(".bg-parallax").forEach((el) => {
    if (el.dataset.scriptInitialized) return;
    el.dataset.scriptInitialized = "true";
    const img = el.querySelector("img");
    if (!img) return;
    const percentParallax = 30;
    gsap.fromTo(
      img,
      { yPercent: `-${percentParallax}` },
      {
        yPercent: percentParallax,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      },
    );
  });
}

function scaleSection() {
  gsap.registerPlugin(SplitText);
  if (!document.querySelector(".scale")) return;
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".scale",
      start: "top top",
      end: "+=150%",
      pin: true,
      pinSpacing: false,
      // markers: true,
    },
  });
  const tl1 = gsap.timeline({
    scrollTrigger: {
      trigger: ".scale",
      start: "top 30%",
      end: "bottom top",
    },
  });
  tl1.to(".scale-image img", {
    scale: 1,
    duration: 2,
    ease: "power3.inOut",
  });
  const splitContent = SplitText.create(".scale-content ul li p", {
    type: "lines",
    mask: "lines",
    linesClass: "line",
  });
  const tl2 = gsap.timeline({
    scrollTrigger: {
      trigger: ".scale-content",
      start: "top 75%",
      end: "bottom 75%",
    },
  });
  tl2.fromTo(
    splitContent.lines,
    { y: "100%" },
    {
      y: "0%",
      duration: 1,
      ease: "power3.inOut",
      stagger: 0.05,
    },
  );
  // gsap.from(".city", {
  //   scrollTrigger: {
  //     trigger: ".city",
  //     start: "top bottom",
  //     end: "top top",
  //     scrub: 1,
  //     markers: true,
  //   },

  //   // y: "30%",
  //   // ease: "none",
  // });
}
function citySection() {
  if (!document.querySelector(".city")) return;
  const tlCity = gsap.timeline({
    scrollTrigger: {
      trigger: ".city",
      start: "top 50%",
      end: "top top",
      // markers: true,
    },
  });
  tlCity.fromTo(
    ".city-overlay",
    {
      clipPath: "inset(0 0 0 0)",
    },
    {
      clipPath: "inset(0  0 100% 0)",
      ease: "none",
      duration: 1,
    },
  );
  const splitContentCitySection = SplitText.create(".city-heading h2", {
    type: "lines",
    mask: "lines",
    linesClass: "line",
  });
  tlCity.fromTo(
    splitContentCitySection.lines,
    { y: "100%" },
    {
      y: "0%",
      duration: 1,
      ease: "power3.inOut",
      stagger: 0.05,
    },
    "-=0.6",
  );
  tlCity.fromTo(
    ".city-description p",
    {
      opacity: 0,
      y: 60,
    },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
    },
    "-=0.6",
  );
}
function mapAnimation() {
  const tlMap = gsap.timeline({
    scrollTrigger: {
      trigger: ".map",
      start: "top top",
      end: "+=150%",
      pin: true,
      pinSpacing: false,
      // markers: true,
    },
  });
  const splitContentCitySection = SplitText.create(".map-content h2", {
    type: "lines",
    mask: "lines",
    linesClass: "line",
  });
  // tlMap.fromTo(
  //   ".map-img .map-river",
  //   {
  //     opacity: 0,
  //     z: 400,
  //   },
  //   {
  //     opacity: 1,
  //     z: 0,
  //     duration: 1,
  //     ease: "power3.inOut",
  //   },
  // );
  tlMap.fromTo(
    splitContentCitySection.lines,
    { y: "100%" },
    {
      y: "0%",
      duration: 1,
      ease: "power3.inOut",
      stagger: 0.05,
    },
  );

  tlMap.fromTo(
    ".map-content p",
    {
      opacity: 0,
      y: 60,
    },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
    },
    "-=0.5",
  );
}
function viewSection() {
  if (!document.querySelector(".view")) return;
  const tlView = gsap.timeline({
    scrollTrigger: {
      trigger: ".view",
      start: "top 50%",
      end: "top top",
      // markers: true,
    },
  });
  tlView.to(".view-image img", {
    scale: 1,
    duration: 2,
    ease: "power3.inOut",
  });

  const splitContentView = SplitText.create(".view-content h2", {
    type: "lines",
    mask: "lines",
    linesClass: "line",
  });
  tlView.fromTo(
    splitContentView.lines,
    { y: "100%" },
    {
      y: "0%",
      duration: 1,
      ease: "power3.inOut",
      stagger: 0.05,
    },
    "-=1.6",
  );
  tlView.fromTo(
    ".view-content p",
    {
      opacity: 0,
      y: 60,
    },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
    },
    "-=1.0",
  );
}
function ripplesView() {
  if (!document.querySelector(".view")) return;
  $(".view-image ").ripples({
    resolution: 256,
    perturbance: 0,
    interactive: true,
    dropRadius: 60,
    crossOrigin: "",
    strength0: 0.003,
  });
  const $el = $(".view-image");

  $el.on("mousemove", function (e) {
    const rect = this.getBoundingClientRect();

    const xPercent = (e.clientX - rect.left) / rect.width - 0.5;
    const yPercent = (e.clientY - rect.top) / rect.height - 0.5;

    const moveX = 50 + xPercent * 20;
    const moveY = 50 + yPercent * 20;

    gsap.to($el, {
      backgroundPositionX: `${moveX}%`,
      backgroundPositionY: `${moveY}%`,
      duration: 1.2,
      ease: "power2.out",
    });
  });

  $el.on("mouseleave", function () {
    gsap.to($el, {
      backgroundPositionX: "50%",
      backgroundPositionY: "50%",
      duration: 1.5,
      ease: "power2.out",
    });
  });
}
function directionCols() {
  gsap.registerPlugin(SplitText);
  if (!document.querySelector(".direction-cols")) return;
  const PADDING = 48;

  document.querySelectorAll(".direction-cols").forEach((section) => {
    function calcScrollDistance(listEl) {
      const sectionRect = section.getBoundingClientRect();
      const listRect = listEl.getBoundingClientRect();
      return listRect.height - (sectionRect.height - PADDING * 2);
    }
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "+=200%",
        pin: true,
        pinSpacing: false,
        // markers: true,
      },
    });
    // timeline fade content first
    const tlf = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 50%",
        end: "bottom 50%",
        // markers: true,
      },
    });
    const splitTxt = SplitText.create(".el-start-txt h2", {
      type: "lines",
      mask: "lines",
      linesClass: "line",
    });
    tlf.fromTo(
      splitTxt.lines,
      { y: "100%" },
      {
        y: "0%",
        duration: 1,
        ease: "power3.inOut",
        stagger: 0.05,
      },
    );
    tlf.fromTo(
      ".el-start-txt h6",
      {
        opacity: 0,
        y: 60,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
      },
      "-=0.5",
    );
    // timeline animation
    const scrollConfig = {
      trigger: section,
      start: "top top",
      end: "+=150%",
      invalidateOnRefresh: true,
    };
    const contentsItem = section.querySelectorAll(".change-content-item");
    const itemsContentArray = Array.from(contentsItem);
    const total = itemsContentArray.length;
    let currentIndex = 0;
    gsap.set(itemsContentArray.slice(1), { opacity: 0 });
    function showItem(index) {
      if (index === currentIndex) return;

      // Kill animation đang chạy dở của 2 item liên quan
      gsap.killTweensOf(itemsContentArray[currentIndex]);
      gsap.killTweensOf(itemsContentArray[index]);

      gsap.to(itemsContentArray[currentIndex], { opacity: 0, duration: 0.3 });
      gsap.to(itemsContentArray[index], {
        opacity: 1,
        duration: 0.5,
        delay: 0.3,
      });

      currentIndex = index;
    }
    ScrollTrigger.create({
      ...scrollConfig,
      // pin: true,
      anticipatePin: 1,
      onUpdate: (self) => {
        const index = Math.min(Math.floor(self.progress * total), total - 1);
        showItem(index);
      },
    });
    const animations = [
      {
        target: section.querySelector(
          ".direction-col:first-child .direction-list-image",
        ),
        vars: {
          y: () =>
            calcScrollDistance(
              section.querySelector(
                ".direction-col:first-child .direction-list-image",
              ),
            ),
        },
      },
      {
        target: section.querySelector(
          ".direction-col:last-child .direction-list-image",
        ),
        vars: {
          y: () =>
            -calcScrollDistance(
              section.querySelector(
                ".direction-col:last-child .direction-list-image",
              ),
            ),
        },
      },
      {
        target: section.querySelectorAll(".direction-col .direction-item img"),
        vars: { xPercent: -10 },
      },
    ];

    animations.forEach(({ target, vars }) => {
      gsap.to(target, {
        ...vars,
        ease: "none",
        scrollTrigger: { ...scrollConfig, scrub: 1 },
      });
    });
  });
}

function sectionOverview() {
  const section = document.querySelector(".overview");
  if (!section) return;

  const title = section.querySelector(".overview-content h2");
  const desc = section.querySelector(".overview-content .desc");

  gsap.registerPlugin(SplitText);

  gsap.set(title, { visibility: "visible" });
  gsap.set(desc, { opacity: 0 });

  const splitTitle = SplitText.create(title, {
    type: "lines",
    mask: "lines",
    linesClass: "line",
  });

  const textTl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: "top 50%",
      toggleActions: "play none none none",
    },
  });

  textTl.fromTo(
    splitTitle.lines,
    { y: "100%" },
    {
      y: "0%",
      duration: 0.5,
      ease: "power3.inOut",
      stagger: 0.05,
    },
  );

  textTl.fromTo(
    desc,
    {
      opacity: 0,
      y: 10,
    },
    {
      opacity: 1,
      y: 0,
      duration: 0.4,
      ease: "power2.out",
    },
    "+=0.2",
  );

  const items = Array.from(section.querySelectorAll(".overview-image-item"));
  const itemsImg = Array.from(
    section.querySelectorAll(".overview-image-item img"),
  );

  section.style.marginBottom = `${(items.length - 1) * 100}vh`;

  items.forEach((item, i) => {
    item.style.zIndex = items.length - i;
  });

  gsap.set(itemsImg.slice(0, -1), {
    scale: 1.1,
  });

  gsap.set(items.slice(1), {
    clipPath: "inset(0 0 0 0)",
  });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: "top top",
      end: () => "+=" + (items.length - 1) * window.innerHeight,
      pin: true,
      scrub: 1,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      pinSpacing: false,
    },
  });

  items.forEach((item, i) => {
    if (i === 0) return;

    tl.to(
      items[i - 1],
      {
        clipPath: "inset(0 100% 0 0)",
        duration: 1,
        ease: "none",
      },
      i,
    );

    tl.to(
      items[i - 1].querySelector("img"),
      {
        scale: 1,
        duration: 1,
        ease: "none",
      },
      i,
    );
  });
}
function ctaRun() {
  const cta = document.getElementById("cta");
  if (!cta) return;
  ScrollTrigger.create({
    trigger: "body",
    start: "top top",
    end: "bottom bottom",
    onUpdate: (self) => {
      cta.classList.toggle("run-right", self.direction === 1);
    },
  });
}
function introSection() {
  if (!document.querySelector(".intro")) return;

  const img = document.querySelector(".intro-image");

  const mainTl = gsap.timeline({
    scrollTrigger: {
      trigger: ".intro",
      start: "top top",
      end: "+=100%",
      pin: true,
      pinSpacing: false,
      scrub: true,
    },
  });

  mainTl.fromTo(
    ".intro-gradient",
    { yPercent: 0 },
    { yPercent: -50, ease: "none", duration: 0.67 },
    0,
  );

  if (img) {
    const parallaxTl = gsap.timeline({
      scrollTrigger: {
        trigger: ".intro",
        start: "top top",
        end: "+=100%",
        scrub: true,
      },
    });

    parallaxTl.fromTo(img, { yPercent: -5 }, { yPercent: 5, ease: "none" });
  }
}

function footer() {
  const footer = document.querySelector(".footer-container");
  const heightOverlay = document.querySelector(".footer-overlay");
  if (!footer) return;

  const heightFooter = footer.offsetHeight;

  heightOverlay.style.height = `${heightFooter}px`;
}

document.addEventListener("DOMContentLoaded", () => {
  heroAnimation();
});

const init = () => {
  gsap.registerPlugin(ScrollTrigger);
  customDropdown();
  createFilterTab();
  revealClipImage();
  animationTextHeading();
  // bgImageParallax();
  scaleSection();
  citySection();
  mapAnimation();
  partnerSection();
  marquee();
  viewSection();
  ripplesView();
  directionCols();
  sectionOverview();
  ctaRun();
  introSection();
  footer();
  ScrollTrigger.refresh();
};
preloadImages("img").then(() => {
  init();
});

// event click element a
let isLinkClicked = false;

document.addEventListener("click", (e) => {
  const link = e.target.closest("a");
  if (
    link?.href &&
    !link.href.startsWith("#") &&
    !link.href.startsWith("javascript:")
  ) {
    isLinkClicked = true;
  }
});

window.addEventListener("beforeunload", () => {
  if (!isLinkClicked) window.scrollTo(0, 0);
  isLinkClicked = false;
});
