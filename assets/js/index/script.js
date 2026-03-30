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
    linesClass: "line"
  });

  tl.to(".hero-image img", {
    scale: 1,
    duration: 2,
    ease: "power3.inOut"
  });

  tl.fromTo(
    splitTitle.lines,
    { y: "100%" },
    {
      y: "0%",
      duration: 0.8,
      ease: "power3.inOut",
      stagger: 0.05
    },
    "-=0.8"
  );
}

function revealClipImage() {
  document.querySelectorAll(".reveal-animation").forEach((section) => {
    const imageItems = Array.from(
      section.querySelectorAll(".reveal-image-item")
    );

    const bgItems = Array.from(section.querySelectorAll(".reveal-bg-item"));
    console.log(bgItems);

    // stack image
    imageItems.forEach((item, i) => {
      item.style.zIndex = imageItems.length - i;
    });

    // stack bg
    bgItems.forEach((item, i) => {
      item.style.zIndex = bgItems.length - i;
    });

    gsap.set([...imageItems.slice(1), ...bgItems.slice(1)], {
      clipPath: "inset(0 0 0 0)"
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: `+=${window.innerHeight * (imageItems.length - 1)}`,
        pin: true,
        scrub: 1,
        anticipatePin: 1
        // refreshPriority: 1,
        // markers: true
      }
    });

    imageItems.forEach((item, i) => {
      if (i === 0) return;

      tl.to(
        imageItems[i - 1],
        {
          clipPath: "inset(0 0 100% 0)",
          duration: 1,
          ease: "none"
        },
        i
      ); // 👈 KEY
    });

    bgItems.forEach((item, i) => {
      if (i === 0) return;

      tl.to(
        bgItems[i - 1],
        {
          clipPath: "inset(0 0 100% 0)",
          duration: 1,
          ease: "none"
        },
        i
      ); // 👈 KEY sync
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
  gsap.set(circle, { opacity: 0, scale: 0.6 });
  gsap.set(panel2, { opacity: 0, pointerEvents: "none" });

  const extraScroll = window.innerHeight * 0.5;

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: "top top",
      end: () => "+=" + (window.innerHeight + extraScroll),
      pin: true,
      scrub: 1,
      anticipatePin: 1,
      pinSpacing: false
    }
  });

  // 🎬 1. Image fade
  tl.to(
    bgImg,
    {
      opacity: 1,
      ease: "none",
      duration: 1
    },
    0
  );

  // 🎬 2. Desc + hide title + circle (80%)
  tl.to(
    desc,
    {
      opacity: 1,
      duration: 0.3,
      ease: "power1.out"
    },
    0.8
  );

  tl.to(
    title,
    {
      opacity: 0,
      duration: 0.3
    },
    0.8
  );

  tl.to(
    circle,
    {
      opacity: 0.6,
      scale: 1,
      duration: 0.5,
      ease: "power2.out"
    },
    0.8
  );

  tl.to(
    panel1,
    {
      opacity: 0,
      duration: 0.5,
      ease: "power2.out"
    },
    1.2
  )

    .to(panel2, {
      opacity: 1,
      pointerEvents: "auto",
      duration: 0.5,
      ease: "power2.out"
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
      force3D: true
    });

    const tl = gsap.timeline({ repeat: -1 });
    tl.to(content, {
      x: -totalWidth,
      duration: totalWidth / speed,
      ease: "none",
      modifiers: {
        x: (x) => `${parseFloat(x) % totalWidth}px`
      }
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
      linesClass: "line"
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
          toggleActions: "play none none none"
        }
      }
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
          scrub: true
        }
      }
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
      pinSpacing: false
      // markers: true,
    }
  });
  const tl1 = gsap.timeline({
    scrollTrigger: {
      trigger: ".scale",
      start: "top 30%",
      end: "bottom top"
    }
  });
  tl1.to(".scale-image img", {
    scale: 1,
    duration: 2,
    ease: "power3.inOut"
  });
  const splitContent = SplitText.create(".scale-content ul li p", {
    type: "lines",
    mask: "lines",
    linesClass: "line"
  });
  const tl2 = gsap.timeline({
    scrollTrigger: {
      trigger: ".scale-content",
      start: "top 75%",
      end: "bottom 75%"
    }
  });
  tl2.fromTo(
    splitContent.lines,
    { y: "100%" },
    {
      y: "0%",
      duration: 1,
      ease: "power3.inOut",
      stagger: 0.05
    }
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
      end: "top top"
      // markers: true,
    }
  });
  tlCity.fromTo(
    ".city-overlay",
    {
      clipPath: "inset(0 0 0 0)"
    },
    {
      clipPath: "inset(0  0 100% 0)",
      ease: "none",
      duration: 1
    }
  );
  const splitContentCitySection = SplitText.create(".city-heading h2", {
    type: "lines",
    mask: "lines",
    linesClass: "line"
  });
  tlCity.fromTo(
    splitContentCitySection.lines,
    { y: "100%" },
    {
      y: "0%",
      duration: 1,
      ease: "power3.inOut",
      stagger: 0.05
    },
    "-=0.6"
  );
  tlCity.fromTo(
    ".city-description p",
    {
      opacity: 0,
      y: 60
    },
    {
      opacity: 1,
      y: 0,
      duration: 0.8
    },
    "-=0.6"
  );
}
function mapAnimation() {
  const tlMap = gsap.timeline({
    scrollTrigger: {
      trigger: ".map",
      start: "top top",
      end: "+=150%",
      pin: true,
      pinSpacing: false
      // markers: true,
    }
  });
  const splitContentCitySection = SplitText.create(".map-content h2", {
    type: "lines",
    mask: "lines",
    linesClass: "line"
  });
  tlMap.fromTo(
    ".map-img .map-river",
    {
      opacity: 0,
      z: 400
    },
    {
      opacity: 1,
      z: 0,
      duration: 1,
      ease: "power3.inOut"
    }
  );
  tlMap.fromTo(
    splitContentCitySection.lines,
    { y: "100%" },
    {
      y: "0%",
      duration: 2,
      ease: "power3.inOut",
      stagger: 0.05
    },
    "-=0.6"
  );

  tlMap.fromTo(
    ".map-content p",
    {
      opacity: 0,
      y: 60
    },
    {
      opacity: 1,
      y: 0,
      duration: 0.8
    },
    "-=0.6"
  );
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
  bgImageParallax();
  scaleSection();
  citySection();
  mapAnimation();
  partnerSection();
  marquee();
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
