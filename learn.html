const SURAH_LIST_URL = "https://api.alquran.cloud/v1/surah";
const SURAH_TEXT_URL = "https://api.alquran.cloud/v1/surah/";
const AUDIO_BASE_URL = "https://cdn.islamic.network/quran/audio-surah/128/";

document.addEventListener("DOMContentLoaded", () => {
    setupReader();
});

async function setupReader() {
    const surahSelect = document.getElementById("surahSelect");
    const reciterSelect = document.getElementById("reciterSelect");
    const speedSelect = document.getElementById("speedSelect");
    const loadButton = document.getElementById("loadSurahButton");
    const nextButton = document.getElementById("nextSurahButton");
    const surahAudio = document.getElementById("surahAudio");

    if (
        !surahSelect ||
        !reciterSelect ||
        !speedSelect ||
        !loadButton ||
        !nextButton ||
        !surahAudio
    ) {
        return;
    }

    let surahs = [];

    try {
        const response = await fetch(SURAH_LIST_URL);
        const result = await response.json();
        surahs = result.data || [];

        populateSurahSelect(surahs);

        const params = new URLSearchParams(window.location.search);
        const requestedSurah = Number(params.get("surah")) || 1;
        const requestedReciter = params.get("reciter");

        surahSelect.value = String(requestedSurah);

        if (requestedReciter) {
            reciterSelect.value = requestedReciter;
        }

        await loadSurahData();
    } catch (error) {
        showReaderError(
            "Could not load the surah list. Please check your internet connection and try again."
        );
        return;
    }

    loadButton.addEventListener("click", async () => {
        await loadSurahData();
    });

    nextButton.addEventListener("click", async () => {
        const current = Number(surahSelect.value);

        if (current < surahs.length) {
            surahSelect.value = String(current + 1);
            await loadSurahData();
        } else if (window.showSiteModal) {
            window.showSiteModal(
                "📖",
                "Last Surah",
                "You are already at the last surah."
            );
        }
    });

    speedSelect.addEventListener("change", () => {
        surahAudio.playbackRate = Number(speedSelect.value);
    });

    async function loadSurahData() {
        const surahNumber = Number(surahSelect.value);
        const reciter = reciterSelect.value;
        const speed = Number(speedSelect.value);

        updateReaderHeader("Loading...", "Please wait while the surah loads.");
        setAyahLoading();
        updateAudioSourceText("Loading surah audio and text...");

        updateUrl(surahNumber, reciter);

        try {
            const response = await fetch(
                `${SURAH_TEXT_URL}${surahNumber}/quran-uthmani`
            );

            const result = await response.json();

            if (!result.data) {
                throw new Error("No surah data returned");
            }

            const surah = result.data;

            updateReaderHeader(
                `${surah.number}. ${surah.englishName}`,
                `${surah.name} • ${surah.englishNameTranslation}`
            );

            renderAyahs(surah.ayahs);

            surahAudio.src = `${AUDIO_BASE_URL}${reciter}/${surahNumber}.mp3`;
            surahAudio.playbackRate = speed;
            surahAudio.load();

            updateAudioSourceText(
                `Streaming ${surah.englishName} from Al Quran Cloud using the selected reciter.`
            );
        } catch (error) {
            updateReaderHeader("Something went wrong", "We could not load the surah.");
            showReaderError(
                "Could not load this surah right now. Try another surah or another reciter."
            );
            updateAudioSourceText(
                "The audio or text could not be loaded right now."
            );
        }
    }
}

function populateSurahSelect(surahs) {
    const surahSelect = document.getElementById("surahSelect");
    surahSelect.innerHTML = "";

    surahs.forEach((surah) => {
        const option = document.createElement("option");
        option.value = String(surah.number);
        option.textContent = `${surah.number}. ${surah.englishName} (${surah.name})`;
        surahSelect.appendChild(option);
    });
}

function updateReaderHeader(title, subtitle) {
    document.getElementById("surahTitle").textContent = title;
    document.getElementById("surahSubtitle").textContent = subtitle;
}

function updateAudioSourceText(text) {
    document.getElementById("audioSourceText").textContent = text;
}

function setAyahLoading() {
    const container = document.getElementById("ayahContainer");
    container.innerHTML = `<p class="loading-text">Loading Quran text...</p>`;
}

function showReaderError(message) {
    const container = document.getElementById("ayahContainer");
    container.innerHTML = `<p class="error-text">${message}</p>`;
}

function renderAyahs(ayahs) {
    const container = document.getElementById("ayahContainer");
    container.innerHTML = "";

    ayahs.forEach((ayah) => {
        const card = document.createElement("article");
        card.className = "ayah-card";

        const number = document.createElement("span");
        number.className = "ayah-number";
        number.textContent = `Ayah ${ayah.numberInSurah}`;

        const text = document.createElement("div");
        text.className = "ayah-text";
        text.textContent = ayah.text;

        card.appendChild(number);
        card.appendChild(text);
        container.appendChild(card);
    });
}

function updateUrl(surahNumber, reciter) {
    const url = new URL(window.location.href);
    url.searchParams.set("surah", String(surahNumber));
    url.searchParams.set("reciter", reciter);
    window.history.replaceState({}, "", url);
}
