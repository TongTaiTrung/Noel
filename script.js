const memories = [
  {
    id: 1,
    img: "/textures/img7.jpg",
    caption: "Tấm hình kỷ niệm đầu tiên của hai mình.",
    date: "21/10/2025",
  },
  {
    id: 2,
    img: "/textures/img1.jpg",
    caption: "Những ngày khi chúng ta còn bỡ ngỡ khi bắt chuyện với nhau.",
    date: "22/10/2025",
  },
  {
    id: 3,
    img: "/textures/img6.jpg",
    caption: "Lúc ra về nhưng lại không muốn rời xa em.",
    date: "25/10/2025",
  },
  {
    id: 4,
    img: "/textures/img4.jpg",
    caption: "Buổi đi chơi giống như hẹn hò vậy, anh cứ nhớ mãi.",
    date: "14/11/2025",
  },
  {
    id: 5,
    img: "/textures/img8.jpg",
    caption: "Món quà em tặng anh nhân ngày 19/11.",
    date: "19/11/2025",
  },
  {
    id: 6,
    img: "/textures/img9.png",
    caption:
      "Em lại đến bên anh với một bất ngờ. Có lẽ trước đó anh đã không nói, nhưng món quà của em khiến anh xúc động rất nhiều!",
    date: "19/11/2025",
  },
  {
    id: 7,
    img: "/textures/img2.jpg",
    caption: "Mỗi giây phút bên em, đối với anh đó đều là những món quà.",
    date: "20/11/2025",
  },
];
const startDate = new Date(2025, 9, 22, 7, 40, 0);

// SCROLL
const lenis = new Lenis({
  duration: 1.5,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  direction: "vertical",
  gestureDirection: "vertical",
  smooth: true,
  smoothTouch: false,
  touchMultiplier: 2,
});

let proxy = { skew: 0 },
  skewSetter = gsap.quickSetter(".img-card", "skewY", "deg"),
  clamp = gsap.utils.clamp(-10, 10);

lenis.on("scroll", (e) => {
  let skew = clamp(e.velocity / 100);
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// CANVAS
const canvas = document.getElementById("gradient-canvas");
const ctx = canvas.getContext("2d");
let width, height;
let blobs = [];
const colors = ["#b76e79", "#e6e6fa", "#ffdab9", "#ffffff"];

function resizeCanvas() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

class Blob {
  constructor() {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = (Math.random() - 0.5) * 0.5;
    this.r = Math.random() * 150 + 100;
    this.color = colors[Math.floor(Math.random() * colors.length)];
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < -100 || this.x > width + 100) this.vx *= -1;
    if (this.y < -100 || this.y > height + 100) this.vy *= -1;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}
for (let i = 0; i < 6; i++) blobs.push(new Blob());

function animateGradient() {
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#fdfbfd";
  ctx.fillRect(0, 0, width, height);
  blobs.forEach((blob) => {
    blob.update();
    blob.draw();
  });
  requestAnimationFrame(animateGradient);
}
animateGradient();

// WINDOWS
const colLeft = document.querySelector(".col-left");
const colRight = document.querySelector(".col-right");

memories.forEach((mem, i) => {
  const card = document.createElement("div");
  card.className = "img-card";
  card.onclick = () => openModal(mem.img, mem.caption, mem.date);

  card.innerHTML = `
            <div class="img-wrapper">
                <img src="${mem.img}" class="parallax-img">
            </div>
            <div class="click-hint">
               <i class="fas fa-expand"></i>
            </div>
            <div class="img-caption-overlay">${mem.date}</div>
        `;

  if (i % 2 === 0) colLeft.appendChild(card);
  else colRight.appendChild(card);
});

// ANIMATIONS
gsap.registerPlugin(ScrollTrigger);

const tlHero = gsap.timeline();
tlHero
  .fromTo(
    ".hero-title",
    { y: 100, opacity: 0, rotateX: -20 },
    { y: 0, opacity: 1, rotateX: 0, duration: 1.5, ease: "power4.out" }
  )
  .fromTo(
    ".hero-sub",
    { y: 50, opacity: 0 },
    { y: 0, opacity: 1, duration: 1.5, ease: "power4.out" },
    "-=1.2"
  );

gsap.to(".hero-wrapper", {
  yPercent: 50,
  opacity: 0,
  scrollTrigger: {
    trigger: "section:first-child",
    start: "top top",
    end: "bottom top",
    scrub: true,
  },
});

gsap.utils.toArray(".reveal-card").forEach((card) => {
  gsap.to(card, {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    duration: 1.2,
    ease: "power2.out",
    scrollTrigger: {
      trigger: card,
      start: "top 90%",
      toggleActions: "play none none reverse",
    },
  });
});

gsap.to(".col-left", {
  y: -40,
  ease: "none",
  scrollTrigger: {
    trigger: ".gallery-wrapper",
    start: "top bottom",
    end: "bottom top",
    scrub: 1,
  },
});
gsap.to(".col-right", {
  y: 60,
  ease: "none",
  scrollTrigger: {
    trigger: ".gallery-wrapper",
    start: "top bottom",
    end: "bottom top",
    scrub: 1,
  },
});

gsap.utils.toArray(".parallax-img").forEach((img) => {
  gsap.fromTo(
    img,
    { yPercent: -10 },
    {
      yPercent: 10,
      ease: "none",
      scrollTrigger: {
        trigger: img.closest(".img-card"),
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    }
  );
});

gsap.to(".circle-deco", {
  rotation: 360,
  scrollTrigger: {
    trigger: ".counter-section",
    start: "top bottom",
    end: "bottom top",
    scrub: 2,
  },
});

// DAY COUNTER
const now = new Date();
const diff = now - startDate;
const days = Math.floor(diff / (1000 * 60 * 60 * 24));
// Đảm bảo không hiển thị số âm nếu ngày bắt đầu ở tương lai
const finalDays = days > 0 ? days : 0;

const counterObj = { val: 0 };
const counterEl = document.getElementById("days-counter");

ScrollTrigger.create({
  trigger: ".counter-section",
  start: "top 80%", // Bắt đầu chạy khi cuộn tới 80% màn hình
  once: true,       // Chỉ chạy 1 lần
  onEnter: () => {
    // Animation cuộn số
    gsap.to(counterObj, {
      val: finalDays,
      duration: 3.5,        // Thời gian cuộn dài hơn chút cho 'chill'
      ease: "power4.out",   // Hiệu ứng nhanh ở đầu, chậm dần cực mượt về cuối
      snap: { val: 1 },     // Quan trọng: Làm tròn số mỗi frame để tạo hiệu ứng cuộn dứt khoát
      onUpdate: () => {
        counterEl.innerText = counterObj.val;
      },
    });

    // Thêm hiệu ứng "nảy nhẹ" (Scale) khi số chạy để thu hút sự chú ý
    gsap.fromTo(counterEl, 
        { scale: 0.8, opacity: 0.5, filter: "blur(4px)" }, 
        { scale: 1, opacity: 1, filter: "blur(0px)", duration: 2, ease: "power2.out" }
    );
  },
});

// MODAL
const modal = document.getElementById("modal");
const mImg = document.getElementById("modal-img");
const mTitle = document.getElementById("modal-title");
const mDate = document.getElementById("modal-date");
const mCaption = document.getElementById("info-desc");

function openModal(src, cap, date) {
  mImg.src = src;
  mTitle.innerText = date;
  mDate.innerText = "MEMORY";
  mCaption.innerText = cap;
  modal.classList.add("active");
  lenis.stop();

  const tlModal = gsap.timeline();
  tlModal.fromTo(
    "#modal-img",
    { scale: 1.2 },
    { scale: 1, duration: 1.5, ease: "power2.out" }
  );
  tlModal.fromTo(
    ".info-top > *",
    { y: 20, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.5, stagger: 0.1 },
    "-=1"
  );
}

function closeModal() {
  modal.classList.remove("active");
  lenis.start();
}

function fireConfetti(e) {
  e.stopPropagation();
  confetti({
    particleCount: 150,
    spread: 70,
    origin: { y: 0.7 },
    colors: ["#b76e79", "#ffccd5", "#fff"],
    disableForReducedMotion: true,
  });
}

const s = document.createElement("style");
s.innerHTML = `@keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(10px)} }`;
document.head.appendChild(s);
