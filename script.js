// =================================
// 1. QUIZ QUESTIONS
// =================================
const questions = {

    easy: [
        {
            question: "Which language is used to create webpages?",
            options: ["HTML", "Python", "Java", "C++"],
            answer: "HTML"
        },
        {
            question: "Which CSS property changes text color?",
            options: ["color", "margin", "padding", "width"],
            answer: "color"
        },
        {
            question: "Which symbol is used for JavaScript comments?",
            options: ["//", "##", "**", "!!"],
            answer: "//"
        },
        {
            question: "Which tag creates a paragraph?",
            options: ["<p>", "<h1>", "<br>", "<div>"],
            answer: "<p>"
        },
        {
            question: "Which keyword declares a variable?",
            options: ["let", "print", "show", "write"],
            answer: "let"
        }
    ],

    medium: [
        {
            question: "Which method adds an element to an array?",
            options: ["push()", "pop()", "shift()", "join()"],
            answer: "push()"
        },
        {
            question: "Which method selects an element by ID?",
            options: ["getElementById()", "getClass()", "getAll()", "selectId()"],
            answer: "getElementById()"
        },
        {
            question: "Which event occurs when a button is clicked?",
            options: ["click", "hover", "load", "change"],
            answer: "click"
        },
        {
            question: "Which loop runs while a condition is true?",
            options: ["while", "if", "switch", "return"],
            answer: "while"
        },
        {
            question: "Which property changes an element's text?",
            options: ["textContent", "src", "href", "style"],
            answer: "textContent"
        }
    ],

    hard: [
        {
            question: "Which method converts JSON text into a JavaScript object?",
            options: ["JSON.parse()", "JSON.stringify()", "JSON.convert()", "JSON.object()"],
            answer: "JSON.parse()"
        },
        {
            question: "What does Array.isArray() check?",
            options: ["Whether a value is an array", "Array length", "Array index", "Array value"],
            answer: "Whether a value is an array"
        },
        {
            question: "Which keyword creates a constant variable?",
            options: ["const", "let", "var", "static"],
            answer: "const"
        },
        {
            question: "Which method returns a new array after transforming elements?",
            options: ["map()", "push()", "pop()", "reverse()"],
            answer: "map()"
        },
        {
            question: "What does addEventListener() do?",
            options: [
                "Attaches an event handler",
                "Deletes an element",
                "Changes CSS",
                "Creates an array"
            ],
            answer: "Attaches an event handler"
        }
    ]

};

// =================================
// 2. GET HTML ELEMENTS
// =================================

const welcomeScreen = document.getElementById("welcome-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");

const startBtn = document.getElementById("start-btn");
const nextBtn = document.getElementById("next-btn");
const restartBtn = document.getElementById("restart-btn");

const questionText = document.getElementById("question-text");
const optionsContainer = document.getElementById("options-container");

const timerText = document.getElementById("timer");
const feedback = document.getElementById("feedback");
const progressBar = document.getElementById("progress-bar");

const confettiContainer =
    document.getElementById("confetti-container");

let selectedLevel = "medium"; 
const levelButtons = document.querySelectorAll(".level-btn");
levelButtons.forEach(function(buttons){
    buttons.addEventListener("click", function() {
        selectedLevel = buttons.dataset.level;
        levelButtons.forEach(function(btn) {
            btn.classList.remove("selected");
        });
        buttons.classList.add("selected");
    });
});

// =================================
// 3. VARIABLES
// =================================

let currentQuestion = 0;
let score = 0;
let timeLeft = 15;

let selectedAnswer = "";
let timerId = null;

let quizQuestions = [];
let userAnswers = [];


// =================================
// 4. SCREEN SWITCH FUNCTION
// =================================

function showScreen(screen) {

    welcomeScreen.classList.remove("active");
    quizScreen.classList.remove("active");
    resultScreen.classList.remove("active");

    screen.classList.add("active");
}


// =================================
// 5. RANDOM QUESTION FUNCTION
// =================================

function shuffleQuestions(array) {

    let shuffled = [...array];

    for (let i = shuffled.length - 1; i > 0; i--) {

        let j = Math.floor(Math.random() * (i + 1));

        [shuffled[i], shuffled[j]] =
            [shuffled[j], shuffled[i]];

    }

    return shuffled;
}


// =================================
// 6. START QUIZ FUNCTION
// =================================

function startQuiz() {

    clearInterval(timerId);

    currentQuestion = 0;
    score = 0;
    timeLeft = 15;

    userAnswers = [];

    quizQuestions = shuffleQuestions(questions[selectedLevel]);

    document.getElementById("live-score").textContent =
        "SCORE: 0";

    confettiContainer.innerHTML = "";

    showScreen(quizScreen);

    showQuestion();
}


// =================================
// 7. DISPLAY QUESTION
// =================================

function showQuestion() {

    clearInterval(timerId);

    selectedAnswer = "";

    nextBtn.disabled = true;

    nextBtn.textContent =
        currentQuestion === quizQuestions.length - 1
        ? "FINISH QUIZ →"
        : "NEXT QUESTION →";

    feedback.textContent = "";

    const current = quizQuestions[currentQuestion];

    questionText.textContent = current.question;

    document.getElementById("question-count").textContent =
        `QUESTION ${currentQuestion + 1} / ${quizQuestions.length}`;

    progressBar.style.width =
        `${((currentQuestion + 1) / quizQuestions.length) * 100}%`;

    // Remove old options

    optionsContainer.innerHTML = "";

    // Create new option buttons

    current.options.forEach(function(option) {

        const button = document.createElement("button");

        button.textContent = option;

        button.classList.add("option-btn");

        button.addEventListener("click", function() {

            selectAnswer(option, button);

        });

        optionsContainer.appendChild(button);

    });

    startTimer();
}


// =================================
// 8. TIMER FUNCTION
// =================================

function startTimer() {

    clearInterval(timerId);

    if (selectedLevel === "easy") {
        timeleft = 20;
    }
    else if (selectedLevel === "medium") {
        timeLeft = 15;
    }
    else {
        timeLeft = 10;
    }

    timerText.textContent = timeLeft;

    document.querySelector(".timer-box")
        .classList.remove("warning");

    timerId = setInterval(function() {

        timeLeft--;

        timerText.textContent = timeLeft;

        if (timeLeft <= 5) {

            document.querySelector(".timer-box")
                .classList.add("warning");

        }

        if (timeLeft <= 0) {

            clearInterval(timerId);

            if (selectedAnswer === "") {

                selectedAnswer = "No answer";

                userAnswers[currentQuestion] = "No answer";

                showFeedback(false, true);

            }

        }

    }, 1000);

}


// =================================
// 9. SELECT ANSWER
// =================================

function selectAnswer(option, clickedButton) {

    if (selectedAnswer !== "") {
        return;
    }

    clearInterval(timerId);

    selectedAnswer = option;

    userAnswers[currentQuestion] = option;

    const current = quizQuestions[currentQuestion];

    const buttons =
        optionsContainer.querySelectorAll(".option-btn");

    buttons.forEach(function(button) {

        button.disabled = true;

        if (button.textContent === current.answer) {

            button.classList.add("correct");

        }

    });

    if (option === current.answer) {

        score++;

        showFeedback(true, false);

        document.getElementById("live-score").textContent =
            `SCORE: ${score}`;

    } else {

        clickedButton.classList.add("incorrect");

        showFeedback(false, false);

    }

}


// =================================
// 10. FEEDBACK FUNCTION
// =================================

function showFeedback(isCorrect, timeOut) {

    if (isCorrect) {

        feedback.textContent = "🎉 Excellent! Correct Answer!";

        feedback.style.color = "#48e2ae";

    }

    else if (timeOut) {

        feedback.textContent =
            "⏰ Time Up! Correct answer is shown in green.";

        feedback.style.color = "#f07cae";

        optionsContainer.querySelectorAll(".option-btn")
            .forEach(function(button) {

                button.disabled = true;

                if (
                    button.textContent ===
                    quizQuestions[currentQuestion].answer
                ) {

                    button.classList.add("correct");

                }

            });

    }

    else {

        feedback.textContent =
            "❌ Incorrect! Try your best next time.";

        feedback.style.color = "#f07cae";

    }

    nextBtn.disabled = false;

}


// =================================
// 11. NEXT QUESTION
// =================================

function goToNextQuestion() {

    if (selectedAnswer === "") {
        return;
    }

    clearInterval(timerId);

    currentQuestion++;

    if (currentQuestion < quizQuestions.length) {

        showQuestion();

    } else {

        showResult();

    }

}


// =================================
// 12. CONFETTI CELEBRATION
// =================================

function celebrate() {

    confettiContainer.innerHTML = "";

    for (let i = 0; i < 120; i++) {

        const piece = document.createElement("div");

        piece.classList.add("confetti");

        piece.style.left = Math.random() * 100 + "%";

        piece.style.animationDelay =
            Math.random() * 1.5 + "s";

        piece.style.animationDuration =
            (2 + Math.random() * 2) + "s";

        piece.style.background =
            Math.random() > 0.5 ? "#a855f7" : "#c084fc";

        piece.style.transform =
            `rotate(${Math.random() * 360}deg)`;

        confettiContainer.appendChild(piece);

    }

    // Remove celebration particles after animation

    setTimeout(function() {

        confettiContainer.innerHTML = "";

    }, 5000);

}


// =================================
// 13. FINAL RESULT FUNCTION
// =================================

function showResult() {

    clearInterval(timerId);

    showScreen(resultScreen);

    const total = quizQuestions.length;

    const wrong = total - score;

    const percentage =
        Math.round((score / total) * 100);

    document.getElementById("score").textContent =
        `${score}/${total}`;

    document.getElementById("percentage").textContent =
        `${percentage}%`;

    document.getElementById("correct-count").textContent =
        score;

    document.getElementById("wrong-count").textContent =
        wrong;


    // Performance Messages

    let message = "";

    if (percentage === 100) {

        message = "🏆 PERFECT SCORE! You are a Quiz Champion!";

    }

    else if (percentage >= 80) {

        message = "🎉 Outstanding! You did an amazing job!";

    }

    else if (percentage >= 50) {

        message = "👏 Good Work! Keep improving your knowledge!";

    }

    else {

        message = "💜 Keep Learning! Practice makes you better!";

    }

    document.getElementById("performance-message")
        .textContent = message;


    // Celebration for good performance

    if (percentage >= 50) {

        celebrate();

    }


    // Display Correct Answers

    const review =
        document.getElementById("answer-review");

    review.innerHTML = "";

    quizQuestions.forEach(function(item, index) {

        const userAnswer = userAnswers[index] || "No answer";

        const isCorrect = userAnswer === item.answer;

        const reviewItem = document.createElement("div");

        reviewItem.classList.add("review-item");

        const question = document.createElement("strong");

        question.textContent =
            `${index + 1}. ${item.question}`;

        const yourAnswer = document.createElement("p");

        yourAnswer.textContent =
            `Your Answer: ${userAnswer}`;

        yourAnswer.classList.add(
            isCorrect ? "right" : "wrong"
        );

        const correctAnswer = document.createElement("p");

        correctAnswer.textContent =
            `Correct Answer: ${item.answer}`;

        correctAnswer.classList.add("right");

        reviewItem.appendChild(question);

        reviewItem.appendChild(yourAnswer);

        reviewItem.appendChild(correctAnswer);

        review.appendChild(reviewItem);

    });

}


// =================================
// 14. EVENT LISTENERS
// =================================

startBtn.addEventListener("click", startQuiz);

nextBtn.addEventListener("click", goToNextQuestion);

restartBtn.addEventListener("click", startQuiz);