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
        refreshPriority: 1,
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
      ); // 👈 KEY sync
    });
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
  );
}
function mapAnimation() {}
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
