document.addEventListener("DOMContentLoaded", () => {
  const placeholder = document.getElementById("navbar-placeholder");
  if (!placeholder) return;

  fetch("navbar.html", { cache: "no-cache" })
    .then(res => res.ok ? res.text() : Promise.reject(res.status))
    .then(html => {
      placeholder.innerHTML = html;
      highlightActiveLink();
    })
    .catch(err => console.error("Error cargando navbar:", err));
});

function highlightActiveLink() {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  const links = document.querySelectorAll(".navbar .nav-link");

  links.forEach(link => {
    const href = link.getAttribute("href");
    if (!href) return;
    const normalizedHref = href.split("/").pop();
    if (normalizedHref === currentPage) {
      link.classList.add("active-page");
      link.setAttribute("aria-current", "page");
    } else {
      link.classList.remove("active-page");
      link.removeAttribute("aria-current");
    }
  });
}
