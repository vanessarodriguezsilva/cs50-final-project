$(document).ready(function () {
    $('.alert').alert();
    var link = window.location.pathname.split('/').pop();
    var element = document.getElementsByClassName(link);
    if (element.length > 0) {
        $("li a.nav-link").removeClass("active bg-dark text-white");
        $("li a." + link).addClass('active bg-dark text-white');
    }

    if (link == 'practice') {
        document.onkeypress = function (e) {
            e = e || window.event;
            var image_src, image_alt, text;
            // use e.keyCode
            var key = e.keyCode

            if (key > 64 && key < 91) {
                image_src = '/static/letters/' + String.fromCharCode(key).toLowerCase() + '.png';
                image_alt = 'letter ' + String.fromCharCode(key);
                text = 'This is the letter <b>' + String.fromCharCode(key) + '</b>';
            } else if (key > 96 && key < 123) {
                image_src = '/static/letters/' + String.fromCharCode(key) + '.png';
                image_alt = 'letter ' + String.fromCharCode(key);
                key -= 32;
                text = 'This is the letter <b>' + String.fromCharCode(key) + '</b>';
            } else {
                image_src = 'http://memegen.link/custom/REALLY~q.jpg?alt=https://i.imgflip.com/4ceau.jpg';
                image_alt = 'wrong key';
                text = 'It was not a letter! try again :)';
            }

            $('img.card-img-top').attr('src', image_src);
            $('img.card-img-top').attr('alt', image_alt);
            $('p.card-text strong').html(text);
        };
    }
    else if (link == 'consonants' || link == 'vowels') {
        // Gets the video src from the data-src on each button    
        var $videoSrc;
        $('.video-btn').click(function () {
            $videoSrc = $(this).data("src");
            $videoTitle = $(this).data("title");
        });

        // when the modal is opened autoplay it  
        $('#video_pop').on('shown.bs.modal', function (e) {

            $("#videoModalLabel").html("Learn how is the letter <b>" + $videoTitle.toUpperCase() + "</b> in sign language");
            // set the video src to autoplay and not to show related video. Youtube related video is like a box of chocolates... you never know what you're gonna get
            $("#video").attr('src', $videoSrc +
                "?rel=0&amp;showinfo=0&amp;modestbranding=1&amp;autoplay=1");
        })
        // stop playing the youtube video when I close the modal
        $('#video_pop').on('hide.bs.modal', function (e) {
            $("#video").attr('src', $videoSrc);
        });
    }
    else if (link == 'quiz') {
        $('#start-quiz').click(function () {
            $('.init').addClass('d-none');
            $('.question').removeClass('d-none').addClass('d-block');
        });

        class Question {
            constructor(image, text, choices, answer) {
                this.image = image;
                this.text = text;
                this.choices = choices;
                this.answer = answer;
            }
            isCorrectAnswer(choice) {
                return this.answer === choice;
            }
        }
        let get_questions = [], questions = [], options = [
            new Question(["m"], "This sign is?", ["vowel", "H", "M", "T"], "M"),
            new Question(["a"], "This sign is?", ["G", "Y", "A", "I"], "A"),
            new Question(["g", "i"], "This sign are?", ["M and N", "not any", "consonant and vowel", "I and G"], "consonant and vowel"),
            new Question(["j"], "This sign is?", ["W", "K", "Z", "J"], "J"),
            new Question(["p", "q"], "This sign are?", ["not any", "H and I", "U and O", "O and U"], "not any"),
            new Question(["u"], "This sign is?", ["A", "U", "O", "consonant"], "U"),
            new Question(["e", "i"], "This sign are?", ["vowels", "consonant", "E and F", "H and I"], "vowels"),
            new Question(["r"], "This sign is?", ["N", "B", "D", "R"], "R"),
            new Question(["u"], "This sign is?", ["not any", "V", "S", "Q"], "not any"),
            new Question(["t", "u"], "This sign are?", ["vowels", "consonant", "A and B", "T and U"], "T and U"),
            new Question(["e"], "This sign is?", ["X", "P", "vowel", "T"], "vowel"),
            new Question(["h", "i"], "This sign are?", ["vowel and consonant", "H and I", "U and O", "O and U"], "H and I"),
        ];

        /* $.getJSON('/questions', {
            a: 5
        }, function (data) {
            data.result.forEach(element => {
                get_questions.push(new Question(element[0], element[1], element[2], element[3]));
            });
            questions = [];
            for (var a = get_questions, i = 5; i--;) {
                var random = a.splice(Math.floor(Math.random() * (i + 1)), 1)[0];
                questions.push(random);
            }
            console.log(questions);
        }); */

        for (var a = options, i = 5; i--;) {
            var random = a.splice(Math.floor(Math.random() * (i + 1)), 1)[0];
            questions.push(random);
        }

        class Quiz {
            constructor(questions) {
                this.score = 0;
                this.questions = questions;
                this.currentQuestionIndex = 0;
            }
            getCurrentQuestion() {
                return this.questions[this.currentQuestionIndex];
            }
            guess(answer) {
                if (this.getCurrentQuestion().isCorrectAnswer(answer)) {
                    this.score++;
                }
                this.currentQuestionIndex++;
            }
            hasEnded() {
                return this.currentQuestionIndex >= this.questions.length;
            }
        }

        // Regroup all  functions relative to the App Display
        const display = {
            elementShown: function (id, text) {
                let element = document.getElementById(id);
                element.innerHTML = text;
            },
            endQuiz: function () {
                $this = this;
                $.ajax({
                    data: {
                        score: quiz.score,
                    },
                    type: 'POST',
                    url: '/save_score'
                })
                    .done(function (data) {
                        console.log(data);
                        endQuizHTML = `
                    <div class="alert alert-success alert-dismissible fade show" role="alert">
                        <strong>${data}</strong>
                        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <h2>Quiz ended!</h2>
                    <h3>You score is : ${quiz.score} / ${quiz.questions.length}</h3>`;
                        $this.elementShown("quiz", endQuizHTML);
                    });
            },
            question: function () {
                quizHTML = `<div class="d-flex justify-content-center mb-3">`;
                quiz.getCurrentQuestion().image.forEach(element => {
                    quizHTML += `
                    <img alt="${element}" class="img-thumbnail" style="width: 18rem;"
                    src="/static/letters/${element}.png">
                    `;
                });
                quizHTML += `</div><p class="text-uppercase font-weight-bold mt-3" style="font-size:1.5rem">${quiz.getCurrentQuestion().text}</p>`;
                this.elementShown("question", quizHTML);
            },
            choices: function () {
                let choices = quiz.getCurrentQuestion().choices;

                guessHandler = (id, guess) => {
                    document.getElementById(id).onclick = function () {
                        quiz.guess(guess);
                        quizApp();
                    }
                }
                // display choices and handle guess
                for (let i = 0; i < choices.length; i++) {
                    this.elementShown("choice" + i, choices[i]);
                    guessHandler("guess" + i, choices[i]);
                }
            },
            progress: function () {
                let currentQuestionNumber = quiz.currentQuestionIndex + 1;
                this.elementShown("progress", "Question " + currentQuestionNumber + " of " + quiz.questions.length);
            },
        };

        // Game logic
        quizApp = () => {
            if (quiz.hasEnded()) {
                display.endQuiz();
            } else {
                display.question();
                display.choices();
                display.progress();
            }
        }
        // Create Quiz
        let quiz = new Quiz(questions);
        quizApp();
        console.log(quiz);
    }
});