document.querySelector(".page").style.height = window.innerHeight + "px";
document.querySelector(".page").style.width =
  document.documentElement.scrollWidth + "px";
let touchstart_x;
window.addEventListener("touchstart", (e) => {
  touchstart_x = e.targetTouches[0].clientX;
});
window.addEventListener("touchend", (e) => {
  window.scrollBy({
    left: touchstart_x - e.changedTouches[0].clientX,
    behavior: "smooth",
  });
});

let hint = document.querySelector(".hint");
if (hint.getBoundingClientRect().left != 0) {
  hint.style.display = "none";
}

let skyStar = false;
window.addEventListener("wheel", (e) => {
  hint.style.display = "none";
  if (e.deltaY > 0) {
    // 向下滾動
    window.scrollBy({ left: 650, behavior: "smooth" });
  } else {
    // 向上滾動
    window.scrollBy({ left: -650, behavior: "smooth" });
  }
});

window.addEventListener("keydown", (e) => {
  hint.style.display = "none";
  if (e.keyCode == 39) {
    window.scrollBy({ left: 500, behavior: "smooth" });
  } else if (e.keyCode == 37) {
    window.scrollBy({ left: -500, behavior: "smooth" });
  }
});

let original_X = document.querySelector(".page").getBoundingClientRect().x;
window.addEventListener("scroll", function () {
  let my = document.querySelector(".my_img");

  let scroll_X = document.querySelector(".page").getBoundingClientRect().x;
  //雲
  let cloud = document.querySelectorAll(".cloud");
  //山
  let mountain = document.querySelector(".mountain");

  //山變化
  mountain.style.transform = `translateX(${window.scrollX / 1.5}px)`;

  //船
  let ship = document.querySelector("#ship");
  let water = document.querySelector("#water");
  let water_x = water.getBoundingClientRect();
  let ship_img = document.querySelector("#ship_img");
  if (
    water_x.left + 100 < window.innerWidth / 2 &&
    water_x.right - 100 > window.innerWidth / 2
  ) {
    let Y = (window.innerHeight * 20) / 100 - 50;
    ship.className = "ship ship_move";
    ship.style.bottom = Y + "px";
    setTimeout(() => {
      ship_img.style.left = "-300px";
    }, 100);
    shipDebounce(ship_img);
  } else if (
    water_x.left + 100 < window.innerWidth / 2 &&
    water_x.right - 100 < window.innerWidth / 2
  ) {
    ship.className = "ship ship_rigth";
    ship.style.bottom = "";
  } else {
    ship.className = "ship ship_left";
    ship.style.bottom = "";
  }

  //睡覺
  let bed = document.querySelector("#bed").getBoundingClientRect();
  let bed_img = document.querySelector("#bed_img");
  //台階
  let house_floor = document
    .querySelector("#house_floor")
    .getBoundingClientRect();
  let house_my = document.querySelector(".my");
  let Y = (window.innerHeight * 20) / 100 + 25;
  if (
    house_floor.left < window.innerWidth / 2 &&
    house_floor.right > window.innerWidth / 2
  ) {
    house_my.style.bottom = Y + "px";
  } else {
    house_my.style.bottom = "";
  }

  if (window.innerWidth / 2 > bed.left + bed.width / 2) {
    //sleeping
    bed_img.style.left = "-200px";
    my.style.display = "none";
    //夜晚變天
    document.querySelector("body").style.backgroundColor = "rgb(35,35,35)";
    //月亮出現
    document.querySelector(".moon").style.right = "10%";
    //太陽消失
    document.querySelector(".sun").style.left = "-200px";
    cloud.forEach((d) => {
      d.style.opacity = "0";
    });
    //星空
    if (!skyStar) {
      stars(skyStar);
      skyStar = true;
    }
  } else {
    //月亮消失
    document.querySelector(".moon").style.right = "-200px";
    //太陽出現
    this.document.querySelector(".sun").style.left = "10%";
    //get up
    bed_img.style.left = "0px";
    my.style.display = "";
    document.querySelector("body").style.backgroundColor = "";
    cloud.forEach((d) => {
      d.style.opacity = "1";
    });
    if (skyStar) {
      stars(skyStar);
      skyStar = false;
    }
  }

  //走路
  if (original_X > scroll_X) {
    my.style.top = "0px ";
    my.style.left = "-200px";
    updateWalk(my, original_X > scroll_X);
    updateDebounce(my, original_X > scroll_X);
    updateDebounceStand(my);

    //雲變化
    cloud.forEach((c) => {
      let cloud_x = c.getBoundingClientRect().x - 0.5;
      c.style.left = cloud_x + "px";
    });
  } else {
    my.style.top = "-200px ";
    my.style.left = "-200px";
    updateWalk(my, original_X > scroll_X);
    updateDebounce(my, original_X > scroll_X);
    updateDebounceStand(my);

    //雲變化
    cloud.forEach((c) => {
      let cloud_x = c.getBoundingClientRect().x + 0.5;
      c.style.left = cloud_x + "px";
    });
  }

  original_X = scroll_X;

  schedule();
});

const updateWalk = walk((my, direction) => {
  if (direction) {
    my.style.top = "0px ";
    my.style.left = "-400px";
  } else {
    my.style.top = "-200px ";
    my.style.left = "-400px";
  }
});
function walk(callback, time = 150) {
  let timer;
  return (my, x) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      callback(my, x);
    }, time);
  };
}

//停止後側邊站立
const updateDebounce = debounce((my, direction) => {
  if (direction) {
    my.style.left = "0px";
    my.style.top = "0px ";
  } else {
    my.style.left = "0px";
    my.style.top = "-200px ";
  }
});
function debounce(callback, time = 300) {
  let timer;
  return (my, x) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      callback(my, x);
    }, time);
  };
}

//樹長大
let trunk = document.querySelector("#trunk");
let leave_bottom = document.querySelector("#leave_bottom");
let leave_main = document.querySelector("#leave_main");
let leave_top = document.querySelector("#leave_top");
let apples = this.document.querySelectorAll(".apple");
document.querySelector("#circle").addEventListener("click", function () {
  let treeHight;
  if (window.innerWidth < 800) {
    treeHight = 80;
  } else {
    treeHight = 100;
  }
  document.querySelector("#small_tree").style.transform = "scale(0)";
  document
    .querySelector("#small_tree")
    .addEventListener("transitionend", () => {
      trunk.style.height = treeHight * 2 + "px";
      document.querySelector("#small_tree").style.display = "none";
    });
  trunk.addEventListener("transitionend", () => {
    leave_bottom.style.height = treeHight + "px";
  });
  leave_bottom.addEventListener("transitionend", () => {
    leave_main.style.height = treeHight * 3 + "px";
  });
  leave_main.addEventListener("transitionend", () => {
    leave_top.style.height = treeHight + "px";
  });
  leave_top.addEventListener("transitionend", () => {
    apples.forEach((apple) => {
      apple.style.transform = "scale(1)";
    });
  });
});

//停止後正面站立
const updateDebounceStand = standUp((my) => {
  my.style.top = "0px";
  my.style.left = "-600px";
});

function standUp(callback, time = 1500) {
  let timer;
  return (my) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      callback(my);
    }, time);
  };
}

//船划槳
const shipDebounce = shipMoveFc((ship) => {
  ship.style.left = "0px";
});

function shipMoveFc(callback, time = 500) {
  let timer;
  return (ship) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      callback(ship);
    }, time);
  };
}

//star
function stars(check) {
  let clouds = document.querySelector(".clouds");
  if (check) {
    let starry = document.querySelector(".starry");
    clouds.removeChild(starry);
    return;
  }

  let starry = document.createElement("div");
  starry.className = "starry";
  clouds.appendChild(starry);
  let count = 200;
  let i = 0;
  document.querySelector("body").addEventListener("transitionend", () => {
    while (i < count) {
      let star = document.createElement("i");
      let x = Math.floor(Math.random() * window.innerWidth);
      let y = Math.floor(Math.random() * window.innerHeight);
      let duration = Math.random() * 10;
      let size = Math.random() * 2;
      star.style.left = x + "px";
      star.style.top = y + "px";
      star.style.width = 1 + size + "px";
      star.style.height = 1 + size + "px";
      star.style.animationDuration = 6 + duration + "s";
      star.style.animationDelay = duration + "s";
      starry.appendChild(star);
      i++;
    }
  });
}

//信箱訊息
document.querySelector(".mail").addEventListener("click", () => {
  document
    .querySelector(".account_after")
    .classList.toggle("account_after_centen");
});
//複製連結
document.querySelector(".copy").addEventListener("click", (e) => {
  //信箱帳號
  let text = document.querySelector(".account_text").innerText;
  let tempInput = document.createElement("input");
  tempInput.value = text;
  document.body.appendChild(tempInput);
  tempInput.select();
  document.execCommand("copy");
  document.body.removeChild(tempInput);
  document.querySelector(".copy_mesg").style.opacity = "1";
});

//進度條
function schedule() {
  let circles = document.querySelectorAll("#progress_circle");
  let = prog = document.querySelector(".indicator");
  let currentStep = 1;

  let pageTitle = document.querySelectorAll(".page_title");
  pageTitle.forEach((p) => {
    if (p.getBoundingClientRect().left < window.innerWidth / 2) {
      currentStep++;
    }
  });

  circles.forEach((circle, index) => {
    circle.classList[`${index < currentStep ? "add" : "remove"}`]("active");
  });
  prog.style.width = `${((currentStep - 1) / (circles.length - 1)) * 100}%`;
}

progressClick();
function progressClick() {
  let circles = document.querySelectorAll("#progress_circle");
  let pageTitle = document.querySelectorAll(".page_title");
  circles.forEach((circle, index) => {
    circle.addEventListener("click", (e) => {
      if (index == 0) return window.scrollTo({ left: 0, behavior: "smooth" });
      pageTitle[index - 1].scrollIntoView({
        behavior: "smooth",
        inline: "center",
      });
    });
  });
}

//close
let progress_arrow = document.querySelector(".progress_arrow");
let closes = document.querySelectorAll(".progress_arrow div");
let steps = document.querySelector(".steps");
console.log(steps);
progress_arrow.addEventListener("click", () => {
  closes.forEach((close) => {
    if (close.classList.contains("close")) {
      close.classList.remove("close");
      steps.style.opacity = "0";
    } else {
      close.classList.add("close");
      steps.style.opacity = "1";
    }
  });
});
