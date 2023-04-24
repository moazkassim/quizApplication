let countSpan = document.querySelector(".quiz-info .count span");
let bulletSpanContainer = document.querySelector(".bullets .spans");
let bullets = document.querySelector(".bullets");
let quizArea = document.querySelector(".quiz-area");
let answersArea = document.querySelector(".answers-area");
let submitButton = document.querySelector(".submit-button");
let resultsContainer = document.querySelector(".results");
let countdownElement = document.querySelector(".countdown");

// Set options
let currentIndex = 0;
let rightAnswers = 0;
let countdownInterval = 0;
function getQuestions() {
  let myRequest = new XMLHttpRequest();
  myRequest.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let questionsObject = JSON.parse(this.responseText);
      let qCount = questionsObject.length;
      //create bullets + set qusetions count
      createBullets(qCount);
      //Add qusetion data
      addQuestionData(questionsObject[currentIndex], qCount);
      //start count down
      countDown(3, qCount);
      // Click on submit
      submitButton.onclick = () => {
        let theRightAnswer = questionsObject[currentIndex].right_answer;
        currentIndex++;
        checkAnswer(theRightAnswer, qCount);
        // Remove Previous questions
        quizArea.innerHTML = "";
        answersArea.innerHTML = "";
        addQuestionData(questionsObject[currentIndex], qCount);
        // Handel bullets class

        handelBullets();
        clearInterval(countdownInterval);
        countDown(3, qCount);

        // Show Results
        showResults(qCount);
      };
    }
  };
  myRequest.open("GET", "html_questions.json", true);
  myRequest.send();
}
getQuestions();
function createBullets(num) {
  countSpan.innerHTML = num;
  //create spans
  for (let i = 0; i < num; i++) {
    let theBullet = document.createElement("span");
    if (i === 0) {
      theBullet.className = "on";
    }
    //append bullets to span container
    bulletSpanContainer.appendChild(theBullet);
  }
}
function addQuestionData(obj, count) {
  if (currentIndex < count) {
    if (currentIndex < count) {
      // Create H2 Question Title
      let questionTitle = document.createElement("h2");

      // Create Question Text
      let questionText = document.createTextNode(obj["title"]);

      // Append Text To H2
      questionTitle.appendChild(questionText);

      // Append The H2 To The Quiz Area
      quizArea.appendChild(questionTitle);

      // Create The Answers
      for (let i = 1; i <= 4; i++) {
        // Create Main Answer Div
        let mainDiv = document.createElement("div");

        // Add Class To Main Div
        mainDiv.className = "answer";

        // Create Radio Input
        let radioInput = document.createElement("input");

        // Add Type + Name + Id + Data-Attribute
        radioInput.name = "question";
        radioInput.type = "radio";
        radioInput.id = `answer_${i}`;
        radioInput.dataset.answer = obj[`answer_${i}`];

        // Make First Option Selected
        if (i === 1) {
          radioInput.checked = true;
        }

        // Create Label
        let theLabel = document.createElement("label");

        // Add For Attribute
        theLabel.htmlFor = `answer_${i}`;

        // Create Label Text
        let theLabelText = document.createTextNode(obj[`answer_${i}`]);

        // Add The Text To Label
        theLabel.appendChild(theLabelText);

        // Add Input + Label To Main Div
        mainDiv.appendChild(radioInput);
        mainDiv.appendChild(theLabel);

        // Append All Divs To Answers Area
        answersArea.appendChild(mainDiv);
      }
    }
  }
}
function checkAnswer(rAnswer, count) {
  let answers = document.getElementsByName("question");
  let theChoosenAnswer;

  for (let i = 0; i < answers.length; i++) {
    if (answers[i].checked) {
      theChoosenAnswer = answers[i].dataset.answer;
    }
  }

  if (rAnswer === theChoosenAnswer) {
    rightAnswers++;
  }
}
function handelBullets() {
  let bulletsSpans = document.querySelectorAll(".bullets .spans span");
  let arrayOfSpans = Array.from(bulletsSpans);
  arrayOfSpans.forEach((span, index) => {
    if (currentIndex === index) {
      span.className = "on";
    }
  });
}
function showResults(count) {
  let theResults;
  if (currentIndex === count) {
    quizArea.remove();
    answersArea.remove();
    submitButton.remove();
    bullets.remove();

    if (rightAnswers > count / 2 && rightAnswers < count) {
      theResults = `<span class="good">Good </span>${rightAnswers} from ${count}`;
    } else if (rightAnswers === count) {
      theResults = `<span class="perfect">Perfect</span> All Answers Is Good`;
    } else {
      theResults = `<span class="bad">Bad </span>${rightAnswers} from ${count}`;
    }
    resultsContainer.innerHTML = theResults;
    resultsContainer.style.padding = "10px";
    resultsContainer.style.backgroundColor = "white";
    resultsContainer.style.marginTop = "10px";
  }
}
function countDown(duration, count) {
  if (currentIndex < count) {
    let minutes, seconds;
    countdownInterval = setInterval(function () {
      minutes = parseInt(duration / 60);
      seconds = parseInt(duration % 60);

      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;
      countdownElement.innerHTML = `${minutes}:${seconds}`;

      if (--duration < 0) {
        clearInterval(countdownInterval);
        submitButton.click();
      }
    }, 1000);
  }
}
