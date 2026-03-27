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
document.addEventListener("DOMContentLoaded", () => {
  heroAnimation();
});
const init = () => {
  gsap.registerPlugin(ScrollTrigger);
  customDropdown();
  createFilterTab();
  animationTextHeading();
  bgImageParallax();
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
