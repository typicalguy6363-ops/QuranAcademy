const API_BASE_URL = "https://api.alquran.cloud/v1";

document.addEventListener("DOMContentLoaded", () => {
    startQuranReader();
});

async function startQuranReader() {
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

    const restartSurahButton =
        document.getElementById("restartSurahButton");

    const surahAudio =
        document.getElementById("surahAudio");

    const surahTitle =
        document.getElementById("surahTitle");

    const surahSubtitle =
        document.getElementById("surahSubtitle");

    const ayahContainer =
        document.getElementById("ayahContainer");

    const ayahCount =
        document.getElementById("ayahCount");

    const readerStatus =
        document.getElementById("readerStatus");

    const audioSourceText =
        document.getElementById("audioSourceText");

    if (
        !surahSelect ||
        !reciterSelect ||
        !speedSelect ||
        !loadSurahButton ||
        !previousSurahButton ||
        !nextSurahButton ||
        !playSurahButton ||
        !pauseAudioButton ||
        !restartSurahButton ||
        !surahAudio ||
        !surahTitle ||
        !surahSubtitle ||
        !ayahContainer ||
        !ayahCount ||
        !readerStatus ||
        !audioSourceText
    ) {
        console.error(
            "Quran Reader could not find all required page elements."
        );

        return;
    }

    let surahList = [];
    let currentAyahs = [];
    let currentAyahIndex = 0;
    let playingEntireSurah = false;
    let currentSurahNumber = 1;

    function setStatus(message, type = "") {
        readerStatus.textContent = message;

        readerStatus.classList.remove(
            "error",
            "success"
        );

        if (type) {
            readerStatus.classList.add(type);
        }
    }

    function showLoading(message) {
        ayahContainer.innerHTML = "";

        const loadingBox =
            document.createElement("div");

        loadingBox.className = "reader-loading";

        const spinner =
            document.createElement("div");

        spinner.className =
            "reader-loading-spinner";

        const loadingText =
            document.createElement("p");

        loadingText.textContent = message;

        loadingBox.appendChild(spinner);
        loadingBox.appendChild(loadingText);
        ayahContainer.appendChild(loadingBox);
    }

    function showReaderError(message) {
        ayahContainer.innerHTML = "";

        const errorText =
            document.createElement("p");

        errorText.className = "error-text";
        errorText.textContent = message;

        ayahContainer.appendChild(errorText);

        setStatus(message, "error");
    }

    function stopCurrentAudio() {
        playingEntireSurah = false;

        surahAudio.pause();

        surahAudio.removeAttribute("src");
        surahAudio.load();

        clearCurrentAyahHighlight();
    }

    function clearCurrentAyahHighlight() {
        document
            .querySelectorAll(".ayah-card.current-ayah")
            .forEach((card) => {
                card.classList.remove("current-ayah");
            });
    }

    function highlightAyah(index) {
        clearCurrentAyahHighlight();

        const card =
            document.querySelector(
                `[data-ayah-index="${index}"]`
            );

        if (!card) {
            return;
        }

        card.classList.add("current-ayah");

        card.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    }

    function updatePageAddress(
        surahNumber,
        reciter
    ) {
        const url =
            new URL(window.location.href);

        url.searchParams.set(
            "surah",
            String(surahNumber)
        );

        url.searchParams.set(
            "reciter",
            reciter
        );

        window.history.replaceState(
            {},
            "",
            url
        );
    }

    async function loadSurahList() {
        setStatus("Loading the list of surahs...");

        try {
            const response =
                await fetch(
                    `${API_BASE_URL}/surah`
                );

            if (!response.ok) {
                throw new Error(
                    `Surah list request failed: ${response.status}`
                );
            }

            const result =
                await response.json();

            if (
                !result.data ||
                !Array.isArray(result.data)
            ) {
                throw new Error(
                    "The API did not return a valid surah list."
                );
            }

            surahList = result.data;

            surahSelect.innerHTML = "";

            surahList.forEach((surah) => {
                const option =
                    document.createElement("option");

                option.value =
                    String(surah.number);

                option.textContent =
                    `${surah.number}. ${surah.englishName} — ${surah.name}`;

                surahSelect.appendChild(option);
            });

            const parameters =
                new URLSearchParams(
                    window.location.search
                );

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
                Array.from(
                    reciterSelect.options
                ).some((option) => {
                    return (
                        option.value ===
                        requestedReciter
                    );
                })
            ) {
                reciterSelect.value =
                    requestedReciter;
            }

            await loadSelectedSurah();
        } catch (error) {
            console.error(error);

            surahTitle.textContent =
                "Could not load Quran Reader";

            surahSubtitle.textContent =
                "Please check your internet connection.";

            showReaderError(
                "The list of surahs could not be loaded. Refresh the page and try again."
            );
        }
    }

    async function loadSelectedSurah() {
        const surahNumber =
            Number(surahSelect.value);

        const reciter =
            reciterSelect.value;

        if (
            !Number.isInteger(surahNumber) ||
            surahNumber < 1 ||
            surahNumber > 114
        ) {
            showReaderError(
                "Please choose a valid surah."
            );

            return;
        }

        stopCurrentAudio();

        currentSurahNumber = surahNumber;
        currentAyahIndex = 0;
        currentAyahs = [];

        loadSurahButton.disabled = true;
        playSurahButton.disabled = true;

        surahTitle.textContent =
            "Loading surah...";

        surahSubtitle.textContent =
            "Please wait while the text and audio load.";

        ayahCount.textContent = "Loading...";

        audioSourceText.textContent =
            "Connecting to the Quran audio source...";

        setStatus(
            "Loading Quran text and recitation..."
        );

        showLoading(
            "Loading Quran text and audio..."
        );

        updatePageAddress(
            surahNumber,
            reciter
        );

        try {
            const editions =
                `quran-uthmani,${reciter}`;

            const response =
                await fetch(
                    `${API_BASE_URL}/surah/${surahNumber}/editions/${editions}`
                );

            if (!response.ok) {
                throw new Error(
                    `Surah request failed: ${response.status}`
                );
            }

            const result =
                await response.json();

            if (
                !result.data ||
                !Array.isArray(result.data) ||
                result.data.length < 2
            ) {
                throw new Error(
                    "The API did not return both text and audio."
                );
            }

            const textEdition =
                result.data.find((edition) => {
                    return (
                        edition.edition &&
                        edition.edition.format ===
                            "text"
                    );
                }) || result.data[0];

            const audioEdition =
                result.data.find((edition) => {
                    return (
                        edition.edition &&
                        edition.edition.format ===
                            "audio"
                    );
                }) || result.data[1];

            if (
                !textEdition.ayahs ||
                !audioEdition.ayahs
            ) {
                throw new Error(
                    "Ayah text or audio was missing."
                );
            }

            currentAyahs =
                textEdition.ayahs.map(
                    (textAyah, index) => {
                        const audioAyah =
                            audioEdition.ayahs[index];

                        return {
                            numberInSurah:
                                textAyah.numberInSurah,
                            text: textAyah.text,
                            audio:
                                audioAyah &&
                                audioAyah.audio
                                    ? audioAyah.audio
                                    : ""
                        };
                    }
                );

            const surahName =
                textEdition.englishName ||
                `Surah ${surahNumber}`;

            const arabicName =
                textEdition.name || "";

            const translation =
                textEdition
                    .englishNameTranslation ||
                "";

            surahTitle.textContent =
                `${surahNumber}. ${surahName}`;

            surahSubtitle.textContent =
                `${arabicName} • ${translation}`;

            ayahCount.textContent =
                `${currentAyahs.length} ayahs`;

            document.title =
                `${surahName} | QuranAcademy`;

            renderAyahs();

            const reciterName =
                reciterSelect.options[
                    reciterSelect.selectedIndex
                ].textContent;

            audioSourceText.textContent =
                `Recitation: ${reciterName}. Streamed through Al Quran Cloud.`;

            setStatus(
                "Surah loaded. Press Play Entire Surah or choose an individual ayah.",
                "success"
            );

            playSurahButton.disabled = false;
        } catch (error) {
            console.error(error);

            surahTitle.textContent =
                "Could not load this surah";

            surahSubtitle.textContent =
                "Try another reciter or refresh the page.";

            ayahCount.textContent = "0 ayahs";

            audioSourceText.textContent =
                "Audio is currently unavailable.";

            showReaderError(
                "This surah or reciter could not be loaded. Try selecting another reciter and press Load Surah."
            );
        } finally {
            loadSurahButton.disabled = false;
        }
    }

    function renderAyahs() {
        ayahContainer.innerHTML = "";

        currentAyahs.forEach(
            (ayah, index) => {
                const card =
                    document.createElement(
                        "article"
                    );

                card.className = "ayah-card";

                card.dataset.ayahIndex =
                    String(index);

                const cardTop =
                    document.createElement(
                        "div"
                    );

                cardTop.className =
                    "ayah-card-top";

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
                    "▶ Play";

                playButton.setAttribute(
                    "aria-label",
                    `Play ayah ${ayah.numberInSurah}`
                );

                playButton.addEventListener(
                    "click",
                    () => {
                        playingEntireSurah =
                            false;

                        playAyah(index);
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
                    ayah.text;

                cardTop.appendChild(number);
                cardTop.appendChild(
                    playButton
                );

                card.appendChild(cardTop);
                card.appendChild(text);

                ayahContainer.appendChild(
                    card
                );
            }
        );
    }

    function playAyah(index) {
        if (
            index < 0 ||
            index >= currentAyahs.length
        ) {
            playingEntireSurah = false;

            setStatus(
                "The surah has finished.",
                "success"
            );

            clearCurrentAyahHighlight();

            return;
        }

        const ayah =
            currentAyahs[index];

        if (!ayah.audio) {
            playingEntireSurah = false;

            setStatus(
                `Audio is unavailable for ayah ${ayah.numberInSurah}.`,
                "error"
            );

            return;
        }

        currentAyahIndex = index;

        surahAudio.src = ayah.audio;

        surahAudio.playbackRate =
            Number(speedSelect.value);

        surahAudio.load();

        highlightAyah(index);

        setStatus(
            `Playing ayah ${ayah.numberInSurah} at ${speedSelect.value}× speed.`
        );

        const playPromise =
            surahAudio.play();

        if (
            playPromise &&
            typeof playPromise.catch ===
                "function"
        ) {
            playPromise.catch((error) => {
                console.error(error);

                playingEntireSurah = false;

                setStatus(
                    "The audio could not start. Press the audio player's play button and try again.",
                    "error"
                );
            });
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
        currentAyahIndex = 0;

        playAyah(currentAyahIndex);
    }

    function restartSurah() {
        if (!currentAyahs.length) {
            setStatus(
                "Load a surah first.",
                "error"
            );

            return;
        }

        playingEntireSurah = true;
        currentAyahIndex = 0;

        playAyah(0);
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
            surahAudio.pause();

            setStatus(
                "Audio paused."
            );
        }
    );

    restartSurahButton.addEventListener(
        "click",
        restartSurah
    );

    speedSelect.addEventListener(
        "change",
        () => {
            const newSpeed =
                Number(speedSelect.value);

            surahAudio.playbackRate =
                newSpeed;

            setStatus(
                `Playback speed changed to ${newSpeed}×.`
            );
        }
    );

    reciterSelect.addEventListener(
        "change",
        () => {
            setStatus(
                "Reciter changed. Press Load Surah to apply it."
            );
        }
    );

    surahSelect.addEventListener(
        "change",
        () => {
            setStatus(
                "Surah changed. Press Load Surah to open it."
            );
        }
    );

    surahAudio.addEventListener(
        "ended",
        () => {
            if (!playingEntireSurah) {
                setStatus(
                    `Ayah ${currentAyahIndex + 1} finished.`,
                    "success"
                );

                return;
            }

            const nextIndex =
                currentAyahIndex + 1;

            if (
                nextIndex <
                currentAyahs.length
            ) {
                playAyah(nextIndex);
            } else {
                playingEntireSurah =
                    false;

                clearCurrentAyahHighlight();

                setStatus(
                    "The complete surah has finished.",
                    "success"
                );
            }
        }
    );

    surahAudio.addEventListener(
        "error",
        () => {
            if (!surahAudio.src) {
                return;
            }

            playingEntireSurah = false;

            setStatus(
                "This audio could not be played. Try another reciter.",
                "error"
            );
        }
    );

    await loadSurahList();
}
