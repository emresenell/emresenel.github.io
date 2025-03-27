let answered = false; // Kullanıcının cevap verip vermediğini takip eder

// Yeni bir soru almak için API'ye istek gönderir
async function fetchQuestion() {
    answered = false;
    try {
        const response = await fetch("https://opentdb.com/api.php?amount=1&type=multiple");
        const data = await response.json(); // Gelen JSON verisini parse et
        const questionData = data.results[0]; // İlk (ve tek) soruyu al

        document.getElementById("question").innerHTML = questionData.question;

        let answers = [...questionData.incorrect_answers];
        const correctAnswer = questionData.correct_answer;
        answers.splice(Math.floor(Math.random() * (answers.length + 1)), 0, correctAnswer); // Doğru cevabı rastgele bir konuma ekle

        const optionsDiv = document.getElementById("options");
        optionsDiv.innerHTML = "";

        answers.forEach(answer => {
            const button = document.createElement("button");
            button.innerHTML = answer;
            button.className = "option bg-blue-500 text-white rounded p-2 w-full mt-2 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50";
            button.onclick = () => checkAnswer(answer === correctAnswer);
            optionsDiv.appendChild(button);
        });
    } catch (error) {
        console.error("Bir hata oluştu!", error);
        document.getElementById("question").innerHTML = "Soru yüklenirken hata oluştu!";
    }
}

// Cevap doğru mu diye kontrol eder
function checkAnswer(isCorrect) {
    if (answered) return; // Kullanıcı zaten cevap verdiyse işlemi durdur
    answered = true;

    const feedbackDiv = document.getElementById("feedback");
    const message = document.getElementById("message");
    const dogImage = document.getElementById("dog-image");
    const sadFace = document.getElementById("sad-face");

    document.querySelectorAll(".option").forEach(button => {
        button.classList.add("opacity-50", "pointer-events-none");
    });

    if (isCorrect) {
        message.innerHTML = "Harika!";
        dogImage.style.display = "block";
        sadFace.style.display = "none";
        showDogImage();
    } else {
        message.innerHTML = "Yanlış!";
        dogImage.style.display = "none";
        sadFace.style.display = "block";
        showFeedback();
    }
}

// Köpek resmini çekmek için API'yi çağırır
async function showDogImage() {
    try {
        const response = await fetch("https://dog.ceo/api/breeds/image/random");
        const data = await response.json();

        const dogImage = document.getElementById("dog-image");
        dogImage.src = data.message; // Gelen resmi img etiketine ekle
        showFeedback();
    } catch (error) {
        console.error("Köpek resmi yüklenirken hata oluştu!", error);
    }
}

// Geri bildirim ekranını gösterir ve yeni soru getirir
function showFeedback() {
    const feedbackDiv = document.getElementById("feedback");
    feedbackDiv.style.display = "block";

    setTimeout(() => {
        feedbackDiv.style.display = "none";
        document.querySelectorAll(".option").forEach(button => {
            button.classList.remove("opacity-50", "pointer-events-none");
        });
        fetchQuestion();
    }, 3500);     //  3sn ve altı ulaşma hatası veriyor.
}

fetchQuestion();
