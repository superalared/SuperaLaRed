document.addEventListener('DOMContentLoaded', () => {
    const applyBtn = document.getElementById('applyChanges');
    const modalEl = document.getElementById('customizerModal');

    if (!applyBtn || !modalEl) return;

    applyBtn.addEventListener('click', () => {
        const textColor = document.getElementById("textColor")?.value;
        if (textColor) {
            document.querySelectorAll("h1, p").forEach(el => el.style.color = textColor);
        }

        const fontSizeH1 = document.getElementById("fontSizeH1")?.value;
        const fontSizeP = document.getElementById("fontSizeP")?.value;
        if (fontSizeH1) document.querySelectorAll("h1").forEach(h => h.style.fontSize = `${fontSizeH1}px`);
        if (fontSizeP) document.querySelectorAll("p").forEach(p => p.style.fontSize = `${fontSizeP}px`);

        const hero = document.querySelector(".hero");
        if (hero) {
            const heroValue = document.getElementById("heroBackground")?.value;
            const heroUploadInput = document.getElementById("heroUpload");
            const heroFile = heroUploadInput?.files?.[0];

            const setHeroBg = (bg) => {
                hero.style.backgroundImage = bg;
                hero.style.backgroundSize = "cover";
                hero.style.backgroundPosition = "center";
                hero.style.backgroundRepeat = "no-repeat";
            };

            if (heroFile) {
                const reader = new FileReader();
                reader.onload = e => setHeroBg(`url('${e.target.result}')`);
                reader.readAsDataURL(heroFile);
            } else if (heroValue) {
                setHeroBg(`url('img/hero${heroValue}.jpg')`);
            }
        }

        const cursorSelect = document.getElementById("cursorSelect")?.value;
        if (cursorSelect === "default") {
            document.body.style.cursor = "auto";
        } else if (cursorSelect != null) {
            document.body.style.cursor = `url('img/palaCursor${cursorSelect}.png') 16 16, auto`;
        }

        const contactBg = document.getElementById("contactBg")?.value;
        const contacto = document.getElementById("contacto");
        if (contacto && contactBg) {
            contacto.classList.remove(
                "contact-gradient1", "contact-gradient2", "contact-gradient3",
                "contact-solid", "contact-dark", "contact-transparent"
            );
            switch (contactBg) {
                case "gradient1": contacto.classList.add("contact-gradient1"); break;
                case "gradient2": contacto.classList.add("contact-gradient2"); break;
                case "gradient3": contacto.classList.add("contact-gradient3"); break;
                case "dark":      contacto.classList.add("contact-dark"); break;
                case "transparent":
                    contacto.classList.add("contact-transparent");
                    break;
                default: contacto.classList.add("contact-solid");
            }
        }
    });

    modalEl.addEventListener('show.bs.modal', () => {
        const firstH1 = document.querySelector('.hero h1') || document.querySelector('h1');
        const firstP = document.querySelector('p');
        if (firstH1) {
            document.getElementById('fontSizeH1').value =
              Math.round(parseFloat(getComputedStyle(firstH1).fontSize)) || '';
            document.getElementById('textColor').value =
              rgbToHex(getComputedStyle(firstH1).color);
        }
        if (firstP) {
            document.getElementById('fontSizeP').value =
              Math.round(parseFloat(getComputedStyle(firstP).fontSize)) || '';
        }

        const heroBgInline = document.querySelector('.hero')?.style.backgroundImage || '';
        const match = heroBgInline.match(/hero(\d+)\.jpg/);
        if (match) document.getElementById('heroBackground').value = match[1];

        const currentCursor = document.body.style.cursor || '';
        const cMatch = currentCursor.match(/palaCursor(\d+)\.png/);
        document.getElementById('cursorSelect').value = cMatch ? cMatch[1] : 'default';

        const contacto = document.getElementById('contacto');
        const contactSelect = document.getElementById('contactBg');
        if (contacto && contactSelect) {
            if (contacto.classList.contains('contact-gradient1')) contactSelect.value = 'gradient1';
            else if (contacto.classList.contains('contact-gradient2')) contactSelect.value = 'gradient2';
            else if (contacto.classList.contains('contact-gradient3')) contactSelect.value = 'gradient3';
            else if (contacto.classList.contains('contact-dark'))      contactSelect.value = 'dark';
            else if (contacto.classList.contains('contact-transparent'))contactSelect.value = 'transparent';
            else contactSelect.value = 'solid';
        }
    });

    function rgbToHex(rgbString) {
        const nums = rgbString.match(/\d+/g);
        if (!nums || nums.length < 3) return '#ffffff';
        const [r, g, b] = nums.slice(0, 3).map(n => (+n).toString(16).padStart(2, '0'));
        return `#${r}${g}${b}`;
    }
});
