
let auto_answer = true
async function getAnswer() {
    let response = await fetch(`https://api.quizit.online/quizizz/answers?pin=` + window.location.href);
    let data = await response.json()
    console.log('Total answerable question: ' + data.data.room.totalAnswerableQuestions)
    return data.data.answers;
}
var decodeEntities = (function () {
    var element = document.createElement('div');
    function decodeHTMLEntities(str) {
        if (str && typeof str === 'string') {
            str = str.replace(/<script[^>]*>([\S\s]*?)<\/script>/gmi, '');
            str = str.replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gmi, '');
            element.innerHTML = str;
            str = element.textContent;
            element.textContent = '';
        }
        return str;
    }
    return decodeHTMLEntities;
})();

var all_answers = await getAnswer()
var current_question = ''
setInterval(() => {
    setTimeout(() => {
        if (document.getElementsByClassName("resizeable question-text-color").length > 0) {
            let question = document.getElementsByClassName("resizeable question-text-color")[0].innerText
            if (current_question !== question) {
                all_answers.forEach(q => {
                    if (q.question.text.includes(question)) {
                        q.answers.forEach(a => {
                            console.log("Question: " + decodeEntities(q.question.text))
                            console.log("%c" + decodeEntities(a.text), "color:" + 'green');
                            options = document.getElementsByClassName("options-grid")[0].children;
                            options.forEach(o => {
                                if (o.textContent === decodeEntities(a.text)) {
                                    if (auto_answer) {
                                        o.children[0].children[0].children[0].click();
                                    }
                                    o.style.backgroundColor = "green";  
                                }
                            });
                            current_question = question
                        })
                    }
                });
            }
        }
    }, 500);
}, 1000);
