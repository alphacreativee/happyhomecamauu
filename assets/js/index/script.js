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
        scrub: true
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
          clipPath: "inset(0  0 100% 0)",
          duration: 1,
          ease: "none"
        },
        i
      ); // 👈 KEY sync
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  heroAnimation();
});
const init = () => {
  gsap.registerPlugin(ScrollTrigger);
  customDropdown();
  createFilterTab();
  revealClipImage();
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
