const navLinks = document.querySelectorAll("[data-navLink]");

navLinks.forEach((link) => {
    if (link.getAttribute("href") === window.location.pathname) {
        link.setAttribute("aria-current", "page");
    }
})



function trackEmailSignup(e, t, a, i) {
    const n = document.getElementById(e);
    if (!n) return console.warn(`form ${e} not found`);
    const s = "invalid",
        r = "error-msg",
        l = !n.hasAttribute("novalidate"),
        o = n.querySelector('input[type="email"]'),
        d = () => n.getElementsByClassName(r)[0] ? .remove();
    o.addEventListener("focus", (() => { n.classList.remove(s), d() })), n.addEventListener("submit", (e => {
        e.preventDefault();
        if (!n.checkValidity()) {
            if (d(), !l) {
                const e = document.createElement("p");
                e.classList.add(r), e.innerText = "Please enter a valid email address", o.after(e)
            }
            return void n.classList.add(s)
        }
        let c = !1;
        const u = () => { c || (c = !0, n.submit()) };
        window.plausible ? (plausible(i, { callback: u, props: { origin: a, variant: t } }), setTimeout(u, 1e3)) : u()
    }))
}
