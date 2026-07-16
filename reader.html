const QURAN_API = "https://api.alquran.cloud/v1";

const AUDIO_CDN =
    "https://cdn.islamic.network/quran";

const RECITER_SETTINGS = {
    "ar.alafasy": {
        bitrate: 128
    },

    "ar.husary": {
        bitrate: 128
    },

    "ar.minshawi": {
        bitrate: 128
    },

    "ar.shuraim": {
        bitrate: 128
    },

    "ar.sudais": {
        bitrate: 192
    },

    "ar.abdulbasit": {
        bitrate: 192
    }
};

document.addEventListener("DOMContentLoaded", () => {
    initializeQuranReader();
});

async function initializeQuranReader() {
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

    const playSurahButton =
        document.getElementById("playSurahButton");

    const pauseAudioButton =
        document.getElementById("pauseAudioButton");

    const restartAudioButton =
        document.getElementById("restartAudioButton");

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

    if (
        !surahSelect ||
        !reciterSelect ||
        !speedSelect ||
        !loadSurahButton ||
        !previousSurahButton ||
        !nextSurahButton ||
        !playSurahButton ||
        !pauseAudioButton ||
        !restartAudioButton ||
        !stopAudioButton ||
        !quranAudio ||
        !surahTitle ||
        !surahSubtitle ||
        !readerStatus ||
        !ayahCount ||
        !ayahContainer
    ) {
        console.error(
            "The Quran Reader is missing one or more required elements."
        );

        return;
    }

    let surahList = [];
    let currentSurah = null;
    let currentAudioMode = "surah";
    let currentAyahCard = null;

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
        ayahContainer.innerHTML = "";

        const loadingBox =
            document.createElement("div");

        loadingBox.className =
            "reader-loading";

        const spinner =
            document.createElement("div");

        spinner.className =
            "reader-spinner";

        const text =
            document.createElement("p");

        text.textContent = message;

        loadingBox.appendChild(spinner);
        loadingBox.appendChild(text);

        ayahContainer.appendChild(
            loadingBox
        );
    }

    function showError(message) {
        ayahContainer.innerHTML = "";

        const errorBox =
            document.createElement("div");

        errorBox.className =
            "reader-error-box";

        errorBox.textContent = message;

        ayahContainer.appendChild(
            errorBox
        );

        setStatus(message, "error");
    }

    async function fetchJson(url) {
        const controller =
            new AbortController();

        const timeout =
            window.setTimeout(() => {
                controller.abort();
            }, 20000);

        try {
            const response =
                await fetch(url, {
                    method: "GET",
                    signal: controller.signal,
                    cache: "no-cache"
                });

            if (!response.ok) {
                throw new Error(
                    `Request failed with status ${response.status}.`
                );
            }

            return await response.json();
        } finally {
            window.clearTimeout(timeout);
        }
    }

    function clearAyahHighlight() {
        if (currentAyahCard) {
            currentAyahCard.classList.remove(
                "current-ayah"
            );

            currentAyahCard = null;
        }

        document
            .querySelectorAll(
                ".ayah-card.current-ayah"
            )
            .forEach((card) => {
                card.classList.remove(
                    "current-ayah"
                );
            });
    }

    function highlightAyah(card) {
        clearAyahHighlight();

        currentAyahCard = card;

        card.classList.add(
            "current-ayah"
        );

        card.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    }

    function getSelectedBitrate() {
        const reciter =
            reciterSelect.value;

        return (
            RECITER_SETTINGS[reciter]
                ?.bitrate || 128
        );
    }

    function getWholeSurahAudioUrl(
        surahNumber
    ) {
        const reciter =
            reciterSelect.value;

        const bitrate =
            getSelectedBitrate();

        return (
            `${AUDIO_CDN}/audio-surah/` +
            `${bitrate}/${reciter}/` +
            `${surahNumber}.mp3`
        );
    }

    function getAyahAudioUrl(
        globalAyahNumber
    ) {
        const reciter =
            reciterSelect.value;

        const bitrate =
            getSelectedBitrate();

        return (
            `${AUDIO_CDN}/audio/` +
            `${bitrate}/${reciter}/` +
            `${globalAyahNumber}.mp3`
        );
    }

    function updatePageUrl(
        surahNumber
    ) {
        const url =
            new URL(window.location.href);

        url.searchParams.set(
            "surah",
            String(surahNumber)
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

    function stopAudio() {
        quranAudio.pause();
        quranAudio.currentTime = 0;

        clearAyahHighlight();

        setStatus("Audio stopped.");
    }

    function loadWholeSurahAudio() {
        if (!currentSurah) {
            return;
        }

        currentAudioMode = "surah";

        clearAyahHighlight();

        quranAudio.src =
            getWholeSurahAudioUrl(
                currentSurah.number
            );

        quranAudio.playbackRate =
            Number(speedSelect.value);

        quranAudio.load();
    }

    function renderAyahs(ayahs) {
        ayahContainer.innerHTML = "";

        ayahs.forEach((ayah) => {
            const card =
                document.createElement(
                    "article"
                );

            card.className =
                "ayah-card";

            const cardHeader =
                document.createElement(
                    "div"
                );

            cardHeader.className =
                "ayah-card-header";

            const number =
                document.createElement(
                    "span"
                );

            number.className =
                "ayah-number";

            number.textContent =
                `Ayah ${ayah.numberInSurah}`;

            const playButton =
                document.createElement(
                    "button"
                );

            playButton.type = "button";

            playButton.className =
                "ayah-play-button";

            playButton.textContent =
                "▶ Play Ayah";

            playButton.addEventListener(
                "click",
                async () => {
                    currentAudioMode =
                        "ayah";

                    highlightAyah(card);

                    quranAudio.src =
                        getAyahAudioUrl(
                            ayah.number
                        );

                    quranAudio.playbackRate =
                        Number(
                            speedSelect.value
                        );

                    quranAudio.load();

                    setStatus(
                        `Playing ayah ${ayah.numberInSurah}.`
                    );

                    try {
                        await quranAudio.play();
                    } catch (error) {
                        console.error(error);

                        setStatus(
                            "The ayah audio could not start. Press play on the audio player.",
                            "error"
                        );
                    }
                }
            );

            const text =
                document.createElement(
                    "div"
                );

            text.className =
                "ayah-text";

            text.dir = "rtl";
            text.lang = "ar";

            text.textContent =
                ayah.text.trim();

            cardHeader.appendChild(
                number
            );

            cardHeader.appendChild(
                playButton
            );

            card.appendChild(
                cardHeader
            );

            card.appendChild(text);

            ayahContainer.appendChild(
                card
            );
        });
    }

    async function loadSurahList() {
        setStatus(
            "Loading the list of surahs..."
        );

        try {
            const result =
                await fetchJson(
                    `${QURAN_API}/surah`
                );

            if (
                !result ||
                !Array.isArray(result.data)
            ) {
                throw new Error(
                    "The surah list was missing."
                );
            }

            surahList = result.data;

            surahSelect.innerHTML = "";

            surahList.forEach((surah) => {
                const option =
                    document.createElement(
                        "option"
                    );

                option.value =
                    String(surah.number);

                option.textContent =
                    `${surah.number}. ` +
                    `${surah.englishName} — ` +
                    `${surah.name}`;

                surahSelect.appendChild(
                    option
                );
            });

            const parameters =
                new URLSearchParams(
                    window.location.search
                );

            const requestedSurah =
                Number(
                    parameters.get("surah")
                );

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
                RECITER_SETTINGS[
                    requestedReciter
                ]
            ) {
                reciterSelect.value =
                    requestedReciter;
            }

            await loadSelectedSurah();
        } catch (error) {
            console.error(error);

            surahTitle.textContent =
                "Quran Reader could not load";

            surahSubtitle.textContent =
                "Please check your internet connection.";

            showError(
                "The Quran service could not be reached. Refresh the page and try again."
            );
        }
    }

    async function loadSelectedSurah() {
        const surahNumber =
            Number(surahSelect.value);

        if (
            !Number.isInteger(
                surahNumber
            ) ||
            surahNumber < 1 ||
            surahNumber > 114
        ) {
            showError(
                "Please select a valid surah."
            );

            return;
        }

        stopAudio();

        loadSurahButton.disabled = true;
        playSurahButton.disabled = true;

        surahTitle.textContent =
            "Loading surah...";

        surahSubtitle.textContent =
            "The Quran text is being downloaded.";

        ayahCount.textContent =
            "Loading...";

        showLoading(
            "Loading Quran text..."
        );

        setStatus(
            "Loading Quran text..."
        );

        updatePageUrl(
            surahNumber
        );

        try {
            const result =
                await fetchJson(
                    `${QURAN_API}/surah/${surahNumber}`
                );

            if (
                !result ||
                !result.data ||
                !Array.isArray(
                    result.data.ayahs
                )
            ) {
                throw new Error(
                    "The Quran text was missing."
                );
            }

            currentSurah =
                result.data;

            surahTitle.textContent =
                `${currentSurah.number}. ` +
                `${currentSurah.englishName}`;

            surahSubtitle.textContent =
                `${currentSurah.name} • ` +
                `${currentSurah.englishNameTranslation}`;

            ayahCount.textContent =
                `${currentSurah.ayahs.length} ayahs`;

            document.title =
                `${currentSurah.englishName} | QuranAcademy`;

            renderAyahs(
                currentSurah.ayahs
            );

            loadWholeSurahAudio();

            playSurahButton.disabled =
                false;

            setStatus(
                "Surah loaded successfully. Press Play Entire Surah or choose an ayah.",
                "success"
            );
        } catch (error) {
            console.error(error);

            currentSurah = null;

            surahTitle.textContent =
                "Could not load this surah";

            surahSubtitle.textContent =
                "Please refresh or try another surah.";

            ayahCount.textContent =
                "0 ayahs";

            showError(
                "The Quran text could not be loaded. Check your internet connection, wait a few seconds, and try again."
            );
        } finally {
            loadSurahButton.disabled =
                false;
        }
    }

    async function playEntireSurah() {
        if (!currentSurah) {
            setStatus(
                "Load a surah first.",
                "error"
            );

            return;
        }

        currentAudioMode = "surah";

        clearAyahHighlight();

        loadWholeSurahAudio();

        setStatus(
            `Playing ${currentSurah.englishName} at ${speedSelect.value}× speed.`
        );

        try {
            await quranAudio.play();
        } catch (error) {
            console.error(error);

            setStatus(
                "The audio could not start automatically. Press play on the audio player.",
                "error"
            );
        }
    }

    function goToPreviousSurah() {
        const currentNumber =
            Number(surahSelect.value);

        if (currentNumber <= 1) {
            setStatus(
                "You are already at the first surah."
            );

            return;
        }

        surahSelect.value =
            String(currentNumber - 1);

        loadSelectedSurah();
    }

    function goToNextSurah() {
        const currentNumber =
            Number(surahSelect.value);

        if (currentNumber >= 114) {
            setStatus(
                "You are already at the final surah."
            );

            return;
        }

        surahSelect.value =
            String(currentNumber + 1);

        loadSelectedSurah();
    }

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

    playSurahButton.addEventListener(
        "click",
        playEntireSurah
    );

    pauseAudioButton.addEventListener(
        "click",
        () => {
            quranAudio.pause();

            setStatus(
                "Audio paused."
            );
        }
    );

    restartAudioButton.addEventListener(
        "click",
        async () => {
            quranAudio.currentTime = 0;

            try {
                await quranAudio.play();

                setStatus(
                    "Audio restarted."
                );
            } catch (error) {
                setStatus(
                    "Press play on the audio player to restart.",
                    "error"
                );
            }
        }
    );

    stopAudioButton.addEventListener(
        "click",
        stopAudio
    );

    speedSelect.addEventListener(
        "change",
        () => {
            const speed =
                Number(speedSelect.value);

            quranAudio.playbackRate =
                speed;

            localStorage.setItem(
                "quranAcademyAudioSpeed",
                String(speed)
            );

            setStatus(
                `Playback speed changed to ${speed}×.`
            );
        }
    );

    reciterSelect.addEventListener(
        "change",
        () => {
            if (currentSurah) {
                loadWholeSurahAudio();
            }

            setStatus(
                "Reciter changed. Press play to hear the new reciter."
            );

            updatePageUrl(
                Number(
                    surahSelect.value
                ) || 1
            );
        }
    );

    surahSelect.addEventListener(
        "change",
        loadSelectedSurah
    );

    quranAudio.addEventListener(
        "ended",
        () => {
            clearAyahHighlight();

            if (
                currentAudioMode ===
                "surah"
            ) {
                setStatus(
                    "The complete surah has finished.",
                    "success"
                );
            } else {
                setStatus(
                    "The ayah has finished.",
                    "success"
                );
            }
        }
    );

    quranAudio.addEventListener(
        "error",
        () => {
            if (!quranAudio.src) {
                return;
            }

            setStatus(
                "This recording could not load. Try another reciter.",
                "error"
            );
        }
    );

    const savedSpeed =
        Number(
            localStorage.getItem(
                "quranAcademyAudioSpeed"
            )
        );

    if (
        [
            0.5,
            0.75,
            1,
            1.25,
            1.5,
            2
        ].includes(savedSpeed)
    ) {
        speedSelect.value =
            String(savedSpeed);
    }

    await loadSurahList();
}
