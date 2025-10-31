document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("contactForm");
  const msg  = document.getElementById("formMsg");
  if (!form || !msg) return;

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { "Accept": "application/json" }
      });

      if (response.ok) {
        showMsg("✅ ¡Gracias! Tu mensaje fue enviado.", "success");
        form.reset();
      } else {
        showMsg("❌ No se pudo enviar. Revisa los campos e inténtalo de nuevo.", "danger");
      }
    } catch {
      showMsg("⚠️ Problema de conexión. Vuelve a intentarlo.", "warning");
    } finally {
      submitBtn.disabled = false;
    }
  });

  function showMsg(text, type) {
    msg.textContent = text;
    msg.className = `alert alert-${type} mt-3`;
    setTimeout(() => {
      msg.classList.add("d-none");
      msg.textContent = "";
    }, 7000);
  }
});
