const QURAN_API = "https://api.alquran.cloud/v1";

document.addEventListener("DOMContentLoaded", () => {
    initializeReader();
});

async function initializeReader() {
    setupMobileMenu();

    const surahSelect =
        document.getElementById("surahSelect");

    const reciterSelect =
        document.getElementById("reciterSelect");

    const speedSelect =
        document.getElementById("speedSelect");

    const loadSurahButton =
        document.getElementById("loadSurahButton");

    const previousSurahButton =
        document.getElementById("previousSurahButton");

    const nextSurahButton =
        document.getElementById("nextSurahButton");

    const playEntireSurahButton =
        document.getElementById("playEntireSurahButton");

    const pauseAudioButton =
        document.getElementById("pauseAudioButton");

    const stopAudioButton =
        document.getElementById("stopAudioButton");

    const quranAudio =
        document.getElementById("quranAudio");

    const surahTitle =
        document.getElementById("surahTitle");

    const surahSubtitle =
        document.getElementById("surahSubtitle");

    const readerStatus =
        document.getElementById("readerStatus");

    const ayahCount =
        document.getElementById("ayahCount");

    const ayahContainer =
        document.getElementById("ayahContainer");

    let currentSurahNumber = 1;
    let currentAyahs = [];
    let currentAudioIndex = -1;
    let playingEntireSurah = false;

    function setStatus(message, type = "") {
        readerStatus.textContent = message;

        readerStatus.classList.remove(
            "success",
            "error"
        );

        if (type) {
            readerStatus.classList.add(type);
        }
    }

    function showLoading(message) {
        ayahContainer.innerHTML = `
            <div class="loading-box">
                <div class="spinner"></div>
                ${message}
            </div>
        `;
    }

    function showError(message) {
        ayahContainer.innerHTML = `
            <div class="error-box">
                ${message}
            </div>
        `;

        setStatus(message, "error");
    }

    async function fetchApi(path) {
        const controller = new AbortController();

        const timeout = window.setTimeout(() => {
            controller.abort();
        }, 20000);

        try {
            const response = await fetch(
                `${QURAN_API}${path}`,
                {
                    method: "GET",
                    cache: "no-store",
                    headers: {
                        Accept: "application/json"
                    },
                    signal: controller.signal
                }
            );

            if (!response.ok) {
                throw new Error(
                    `Request failed with status ${response.status}`
                );
            }

            const result = await response.json();

            if (!result || !result.data) {
                throw new Error(
                    "The Quran service returned no data."
                );
            }

            return result.data;
        } finally {
            window.clearTimeout(timeout);
        }
    }

    async function loadSurahList() {
        try {
            const surahs = await fetchApi("/surah");

            surahSelect.innerHTML = "";

            surahs.forEach((surah) => {
                const option =
                    document.createElement("option");

                option.value = String(surah.number);

                option.textContent =
                    `${surah.number}. ${surah.englishName} — ${surah.name}`;

                surahSelect.appendChild(option);
            });
        } catch (error) {
            console.error(error);

            /*
             * The reader can still work if the list request fails.
             * This creates 114 numbered choices as a fallback.
             */
            surahSelect.innerHTML = "";

            for (let number = 1; number <= 114; number += 1) {
                const option =
                    document.createElement("option");

                option.value = String(number);
                option.textContent = `Surah ${number}`;

                surahSelect.appendChild(option);
            }

            setStatus(
                "The surah names could not load, but numbered surahs are available.",
                "error"
            );
        }

        const parameters =
            new URLSearchParams(window.location.search);

        const requestedSurah =
            Number(parameters.get("surah"));

        const requestedReciter =
            parameters.get("reciter");

        if (
            requestedSurah >= 1 &&
            requestedSurah <= 114
        ) {
            surahSelect.value =
                String(requestedSurah);
        } else {
            surahSelect.value = "1";
        }

        if (
            requestedReciter &&
            Array.from(reciterSelect.options).some(
                (option) =>
                    option.value === requestedReciter
            )
        ) {
            reciterSelect.value = requestedReciter;
        }
    }

    async function loadSelectedSurah() {
        const surahNumber =
            Number(surahSelect.value);

        const reciterEdition =
            reciterSelect.value;

        if (
            !Number.isInteger(surahNumber) ||
            surahNumber < 1 ||
            surahNumber > 114
        ) {
            showError("Please choose a valid surah.");
            return;
        }

        currentSurahNumber = surahNumber;
        currentAyahs = [];
        currentAudioIndex = -1;
        playingEntireSurah = false;

        stopAudio(false);

        loadSurahButton.disabled = true;
        playEntireSurahButton.disabled = true;

        surahTitle.textContent = "Loading surah...";

        surahSubtitle.textContent =
            "Loading Arabic text and recitation.";

        ayahCount.textContent = "Loading...";

        showLoading("Loading Quran text and audio...");

        setStatus(
            "Connecting to Al Quran Cloud..."
        );

        updatePageUrl();

        try {
            /*
             * Text and audio are loaded separately.
             * If one fails, the other can still be used.
             */
            const results = await Promise.allSettled([
                fetchApi(
                    `/surah/${surahNumber}/quran-uthmani`
                ),

                fetchApi(
                    `/surah/${surahNumber}/${reciterEdition}`
                )
            ]);

            const textData =
                results[0].status === "fulfilled"
                    ? results[0].value
                    : null;

            const audioData =
                results[1].status === "fulfilled"
                    ? results[1].value
                    : null;

            const displayData =
                textData || audioData;

            if (
                !displayData ||
                !Array.isArray(displayData.ayahs)
            ) {
                throw new Error(
                    "Neither Quran text nor audio could load."
                );
            }

            currentAyahs =
                displayData.ayahs.map(
                    (displayAyah, index) => {
                        const textAyah =
                            textData?.ayahs?.[index];

                        const audioAyah =
                            audioData?.ayahs?.[index];

                        return {
                            number:
                                displayAyah.number,

                            numberInSurah:
                                displayAyah.numberInSurah,

                            text:
                                textAyah?.text ||
                                displayAyah.text ||
                                "",

                            audio:
                                audioAyah?.audio || ""
                        };
                    }
                );

            surahTitle.textContent =
                `${displayData.number}. ${displayData.englishName}`;

            surahSubtitle.textContent =
                `${displayData.name} • ${displayData.englishNameTranslation}`;

            ayahCount.textContent =
                `${currentAyahs.length} ayahs`;

            document.title =
                `${displayData.englishName} | QuranAcademy`;

            renderAyahs();

            const availableAudio =
                currentAyahs.filter(
                    (ayah) => ayah.audio
                ).length;

            if (availableAudio > 0) {
                playEntireSurahButton.disabled = false;

                setStatus(
                    `Surah loaded with ${availableAudio} playable ayahs.`,
                    "success"
                );
            } else {
                setStatus(
                    "The Quran text loaded, but this reciter's audio was unavailable. Choose another reciter.",
                    "error"
                );
            }
        } catch (error) {
            console.error(error);

            surahTitle.textContent =
                "Quran could not load";

            surahSubtitle.textContent =
                "Please check the internet connection.";

            ayahCount.textContent = "0 ayahs";

            showError(
                "The Quran service could not be reached. Wait a few seconds, refresh the page, and try again."
            );
        } finally {
            loadSurahButton.disabled = false;
        }
    }

    function renderAyahs() {
        ayahContainer.innerHTML = "";

        currentAyahs.forEach((ayah, index) => {
            const card =
                document.createElement("article");

            card.className = "ayah-card";
            card.dataset.ayahIndex = String(index);

            const header =
                document.createElement("div");

            header.className = "ayah-card-header";

            const number =
                document.createElement("span");

            number.className = "ayah-number";

            number.textContent =
                `Ayah ${ayah.numberInSurah}`;

            const playButton =
                document.createElement("button");

            playButton.type = "button";

            playButton.className =
                "ayah-play-button";

            playButton.textContent =
                ayah.audio
                    ? "▶ Play Ayah"
                    : "Audio unavailable";

            playButton.disabled = !ayah.audio;

            playButton.addEventListener(
                "click",
                () => {
                    playingEntireSurah = false;
                    playAyah(index);
                }
            );

            const text =
                document.createElement("div");

            text.className = "ayah-text";
            text.lang = "ar";
            text.dir = "rtl";
            text.textContent = ayah.text;

            header.appendChild(number);
            header.appendChild(playButton);

            card.appendChild(header);
            card.appendChild(text);

            ayahContainer.appendChild(card);
        });
    }

    async function playAyah(index) {
        if (
            index < 0 ||
            index >= currentAyahs.length
        ) {
            playingEntireSurah = false;

            clearHighlight();

            setStatus(
                "The complete surah has finished.",
                "success"
            );

            return;
        }

        const ayah = currentAyahs[index];

        if (!ayah.audio) {
            if (playingEntireSurah) {
                playAyah(index + 1);
            } else {
                setStatus(
                    "Audio is unavailable for this ayah.",
                    "error"
                );
            }

            return;
        }

        currentAudioIndex = index;

        quranAudio.src = ayah.audio;

        quranAudio.playbackRate =
            Number(speedSelect.value);

        quranAudio.load();

        highlightAyah(index);

        setStatus(
            `Playing ayah ${ayah.numberInSurah} at ${speedSelect.value}× speed.`
        );

        try {
            await quranAudio.play();
        } catch (error) {
            console.error(error);

            setStatus(
                "Press the play button inside the audio player to begin.",
                "error"
            );
        }
    }

    function playEntireSurah() {
        if (!currentAyahs.length) {
            setStatus(
                "Load a surah first.",
                "error"
            );

            return;
        }

        playingEntireSurah = true;
        playAyah(0);
    }

    function pauseAudio() {
        quranAudio.pause();
        setStatus("Audio paused.");
    }

    function stopAudio(showMessage = true) {
        quranAudio.pause();

        quranAudio.removeAttribute("src");
        quranAudio.load();

        currentAudioIndex = -1;
        playingEntireSurah = false;

        clearHighlight();

        if (showMessage) {
            setStatus("Audio stopped.");
        }
    }

    function highlightAyah(index) {
        clearHighlight();

        const card =
            document.querySelector(
                `[data-ayah-index="${index}"]`
            );

        if (!card) {
            return;
        }

        card.classList.add("current");

        card.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    }

    function clearHighlight() {
        document
            .querySelectorAll(".ayah-card.current")
            .forEach((card) => {
                card.classList.remove("current");
            });
    }

    function updatePageUrl() {
        const url =
            new URL(window.location.href);

        url.searchParams.set(
            "surah",
            String(currentSurahNumber)
        );

        url.searchParams.set(
            "reciter",
            reciterSelect.value
        );

        window.history.replaceState(
            {},
            "",
            url
        );
    }

    function goToPreviousSurah() {
        if (currentSurahNumber <= 1) {
            setStatus(
                "You are already at the first surah."
            );

            return;
        }

        surahSelect.value =
            String(currentSurahNumber - 1);

        loadSelectedSurah();
    }

    function goToNextSurah() {
        if (currentSurahNumber >= 114) {
            setStatus(
                "You are already at the final surah."
            );

            return;
        }

        surahSelect.value =
            String(currentSurahNumber + 1);

        loadSelectedSurah();
    }

    quranAudio.addEventListener("ended", () => {
        if (!playingEntireSurah) {
            setStatus(
                "Ayah finished.",
                "success"
            );

            return;
        }

        playAyah(currentAudioIndex + 1);
    });

    quranAudio.addEventListener("error", () => {
        if (!quranAudio.src) {
            return;
        }

        setStatus(
            "This recording could not play. Try another reciter.",
            "error"
        );
    });

    speedSelect.addEventListener("change", () => {
        quranAudio.playbackRate =
            Number(speedSelect.value);

        localStorage.setItem(
            "quranAcademyReaderSpeed",
            speedSelect.value
        );

        setStatus(
            `Speed changed to ${speedSelect.value}×.`
        );
    });

    surahSelect.addEventListener(
        "change",
        loadSelectedSurah
    );

    reciterSelect.addEventListener(
        "change",
        loadSelectedSurah
    );

    loadSurahButton.addEventListener(
        "click",
        loadSelectedSurah
    );

    previousSurahButton.addEventListener(
        "click",
        goToPreviousSurah
    );

    nextSurahButton.addEventListener(
        "click",
        goToNextSurah
    );

    playEntireSurahButton.addEventListener(
        "click",
        playEntireSurah
    );

    pauseAudioButton.addEventListener(
        "click",
        pauseAudio
    );

    stopAudioButton.addEventListener(
        "click",
        () => stopAudio(true)
    );

    const savedSpeed =
        localStorage.getItem(
            "quranAcademyReaderSpeed"
        );

    if (
        [
            "0.5",
            "0.75",
            "1",
            "1.25",
            "1.5",
            "2"
        ].includes(savedSpeed)
    ) {
        speedSelect.value = savedSpeed;
    }

    await loadSurahList();
    await loadSelectedSurah();
}

function setupMobileMenu() {
    const menuButton =
        document.getElementById("menuButton");

    const navigation =
        document.getElementById("navigation");

    if (!menuButton || !navigation) {
        return;
    }

    menuButton.addEventListener("click", () => {
        const open =
            navigation.classList.toggle("open");

        menuButton.classList.toggle(
            "active",
            open
        );

        menuButton.setAttribute(
            "aria-expanded",
            String(open)
        );
    });

    navigation.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            navigation.classList.remove("open");
            menuButton.classList.remove("active");
        });
    });
}
