getQuizzes(); 

function getQuizzes(){
    const promess = axios.get("https://mock-api.bootcamp.respondeai.com.br/api/v2/buzzquizz/quizzes");
    promess.then(showQuizzes);
}

let allQuizzes;
let count = 0;
let countAnsweredQuestions = 0;
let quizzIDFromFinalization;
let isNew = false;
let questionOpened = null;


function showQuizzes(response){
    console.log(response.data);
    //const loading = document.querySelector(".img-loading");
    //loading.classList.remove("img-loading");
    //loading.classList.add("hidden");
    allQuizzes = response;
    console.log(allQuizzes);
    if(localStorage.length === 0){
        localStorage.setItem("id", JSON.stringify({id: []})); // Se não existir nada no localStorage, criar a key id
        localStorage.setItem("secretKey", JSON.stringify({key: []}));
    } 
    if(!localStorage.id) {
        localStorage.setItem("id", JSON.stringify({id: []})); // Se já existir algo no localStorage, porém não for a key id, remover a antiga key e adicionar a nova
        localStorage.setItem("secretKey", JSON.stringify({key: []}));
    }
    myQuizzesID = JSON.parse(localStorage.id);
    if(myQuizzesID.id.length === 0) {
        const divFirstQuizz = document.querySelector(".create-quizz");
        divFirstQuizz.classList.remove("hidden");
    } else {
        const divMyQuizzes = document.querySelector(".container-my-quizzes");
        divMyQuizzes.classList.remove("hidden");
    }
    const serverQuizzes = document.querySelector(".quizzes");
    const myQuizzes = document.querySelector(".container-my-quizzes .my-quizzes");
    serverQuizzes.innerHTML = "";
    myQuizzes.innerHTML = "";
    let isMine = false; 
    for (let i = 0; i < response.data.length; i++) {
        for (let j = 0; j < myQuizzesID.id.length; j++) {
            if(response.data[i].id === myQuizzesID.id[j]){
                myQuizzes.innerHTML += `
                <div class="e-quizzes" id=${i+1} onclick="accessQuizz(this.id)">
                    <img src="${response.data[i].image}">
                    <p>${response.data[i].title}</p>
                </div>
                `;
                isMine = true;
                break;
            } 
        }
        if(!isMine){
            serverQuizzes.innerHTML +=`
            <div class="e-quizzes" id=${i+1} onclick="accessQuizz(this.id, ${false})">
                <img src="${response.data[i].image}">
                <p>${response.data[i].title}</p>
            </div>
            `;
        }
        isMine = false;
    }
}

let selectedQuizzGlobal;

function accessQuizz(click, isNew){
    let selectedQuizz;
    if(isNew === true){
        for (let i = 0; i < 100; i++) {
            if(allQuizzes.data[i].id === click){
                selectedQuizz = allQuizzes.data[i];
                break;
            }
        }
        const finalization = document.querySelector(".container-finalization");
        finalization.classList.add("hidden");
    } else {
        selectedQuizz = allQuizzes.data[click-1];
        const serverQuizzes = document.querySelector(".container");
        serverQuizzes.classList.add("hidden");
    }
    selectedQuizzGlobal = click;
    const questionBody = document.querySelector(".container-quizz");
    questionBody.classList.remove("hidden");
    questionBody.innerHTML = `
        <div class="header">
            <img src="${selectedQuizz.image}">
            <h2>${selectedQuizz.title}</h2>
        </div>
    `;
    
    for(let i=0; i<selectedQuizz.questions.length ; i++){
        questionBody.innerHTML +=`
        <div class="each-question${i} each-question">
            <div style="background-color:${selectedQuizz.questions[i].color};" class="title">${selectedQuizz.questions[i].title}</div>
            <div class="alternatives">
            </div>
        </div>
        `;
        const answersRandomized = selectedQuizz.questions[i].answers.sort(() => Math.random() - 0.5);
        for(let j=0; j<answersRandomized.length ; j++){
            const eachQuestionAlternative = document.querySelector(`.each-question${i} .alternatives`);
            eachQuestionAlternative.innerHTML +=`
            <div class="alternative ${answersRandomized[j].isCorrectAnswer}" onclick="userChoice(this, ${answersRandomized[j].isCorrectAnswer}, ${selectedQuizz.id}, ${selectedQuizz.questions.length})">
                <img src="${answersRandomized[j].image}">
                <p>${answersRandomized[j].text}</p>
            </div>
            `;
        }
    }
    
}

function userChoice(clicked, isCorrect, quizzID, numberOfQuestions){
    const alternatives = clicked.parentNode;
    for(let i=0; i < alternatives.children.length; i++){
        alternatives.children[i].classList.add("filter");
        alternatives.children[i].setAttribute("onclick", "");
        alternatives.children[i].setAttribute("style", "cursor: default");
        if(alternatives.children[i].classList.contains("true")){
            alternatives.children[i].classList.add("question-green-color");            
        } else {
            alternatives.children[i].classList.add("question-red-color");
        }
    }
    if(isCorrect){
        count++;
    }
    countAnsweredQuestions++;
    clicked.classList.remove("filter");
    const question = alternatives.parentNode;
    const nextQuestion = question.nextElementSibling;
    setTimeout(() => {
        if(nextQuestion !== null && !(countAnsweredQuestions === numberOfQuestions)){
            nextQuestion.scrollIntoView();
        }
        if (countAnsweredQuestions === numberOfQuestions){
            getLevelsFromServer(quizzID);
        }
    }, 2000);
}

function getLevelsFromServer(quizzID){
    const promisse = axios.get(`https://mock-api.bootcamp.respondeai.com.br/api/v2/buzzquizz/quizzes/${quizzID}`);
    promisse.then((response)=> {
        const selectedQuizz = response.data;
        
        const percentageCorrectAnswers = Math.round((count/selectedQuizz.questions.length)*100);
        const allLevels = selectedQuizz.levels;
        const sortedMinValues = [];
        let levelReached;
        let foundLevel = false;
        




        for (let i = 0; i < allLevels.length; i++) {
            sortedMinValues.push(allLevels[i].minValue);
        }
        sortedMinValues.sort((a, b) => a - b); // Função que organiza em ordem crescente os números de um array


        for(let i = 0; i < allLevels.length; i++){
            if(percentageCorrectAnswers < sortedMinValues[i]){
                if(i === 0) {
                    levelReached = findLevel(sortedMinValues[i], allLevels);
            
                } else {
                    levelReached = findLevel(sortedMinValues[i-1], allLevels);
            
                }
                foundLevel = true;
                break;
            }
        }
        if(!foundLevel) {
            levelReached = findLevel(sortedMinValues[allLevels.length-1], allLevels);
    
        }

        displayLevel(levelReached, percentageCorrectAnswers);
    });
}

function findLevel(minValue, allLevels){
    return allLevels.find(level => level.minValue === minValue);
}

function displayLevel(level, percentageCorrectAnswers){
    const containerResult = document.querySelector(".container-result");
    containerResult.innerHTML = `
    <div class="quizz-result">
        <div class="header">
            <h2 class="result-title">${percentageCorrectAnswers}% de acertos: ${level.title}</h2>
        </div>
        <div class="content">
            <img src="${level.image}">
            <p class="description">${level.text}</p>
        </div>
    </div>
    <div class="buttons">
        <button class="restart-quizz" onclick="restartQuizz()">Reiniciar Quizz</button>
        <button class="home" onclick="backHomescreen()">Voltar pra home</button>
    </div>
    `;
    containerResult.classList.remove("hidden");
    containerResult.scrollIntoView();
    count = 0;
    countAnsweredQuestions = 0;
}


function createQuizz(){
    const containerQuizz = document.querySelector(".container");
    const createFeature = document.querySelector(".container-new-quiz");
    containerQuizz.classList.add("hidden");
    createFeature.classList.remove("hidden");
}

function getInputInfos(){
    const getTitle = document.querySelector(".inputs .title");
    const getUlrImage = document.querySelector(".inputs .ulr-img");
    const getQntNumber = document.querySelector(".inputs .questions-number");
    const getLevelNumber = document.querySelector(".inputs .level-number");
    
    if(getTitle.value == "" || getUlrImage.value == "" || getQntNumber.value == "" || getLevelNumber.value == ""){
        alert("Todos os campos precisam ser preenchidos!");
    }else if(getTitle.value.length < 20){
        alert("O titulo deve ter pelo menos 20 caracteres!");
    }else if(getQntNumber.value <= 2){
        alert("Quantidade de perguntas deve ser pelo menos 3!");
    } else if(getLevelNumber.value <=1){
        alert("Quantidade de níveis deve ser pelo menos 2!");
    }else if((validURL(getUlrImage.value)) == false){
        alert("Não é um URL");
    }else {
        const createFeature = document.querySelector(".container-new-quiz");    
        const createQuestions = document.querySelector(".container-create-questions");
        createFeature.classList.add("hidden");
        createQuestions.classList.remove("hidden");
        questionModel.title = getTitle.value
        questionModel.image = getUlrImage.value
        createQuestion(getQntNumber.value, getLevelNumber.value);
    }
}

function validURL(str) {
    let pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
      '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return !!pattern.test(str);
}

function createQuestion(getQntNumber, getLevelNumber){
    let generateQuestions = document.querySelector(".container-create-questions");
    
    for(let i = 1; i <= getQntNumber; i++){
        generateQuestions.innerHTML +=`
        <div class="question${i} question">
            <div class="title">
                <h2>Pergunta ${i}</h2>
                <ion-icon onclick="collapseQuestion(this)" name="create-outline"></ion-icon>
            </div>
            <input type="text" placeholder="Texto da pergunta" class="question-text${i} minlength='20'">
            <input type="text" placeholder="Cor de fundo da pergunta" class="color${i}">
            <h2>Resposta correta</h2>
            <input type="text" placeholder="Resposta correta" class="right-answer${i}">
            <input type="url" placeholder="URL da imagem" class="right-answer-img${i}">
            <h2>Respostas incorretas</h2>
            <div class="wrong-answer">
                <input type="text" placeholder="Resposta incorreta 1" class="text-wrong${i}">
                <input type="url" placeholder="URL da imagem" class="image-wrong${i}">
            </div>
            <div class="wrong-answer2">
                <input type="text" placeholder="Resposta incorreta 2" class="text-wrong2${i}">
                <input type="url" placeholder="URL da imagem" class="image-wrong2${i}">
            </div>
            <div class="wrong-answer3">
                <input type="text" placeholder="Resposta incorreta 3" class="text-wrong3${i}">
                <input type="url" placeholder="URL da imagem" class="image-wrong3${i}">
            </div>
        </div>
        `;
    }

    generateQuestions.innerHTML += `
        <button class="next" onclick="validadeQuestionForms(${parseInt(getLevelNumber)}, '${getQntNumber}')">Prosseguir pra criar níveis</button>
    `;

    const displayCreateQuestion = document.querySelector(".container-create-questions");
    const hideCreateFeature = document.querySelector(".container-new-quiz");
    hideCreateFeature.classList.add("hidden");
    displayCreateQuestion.classList.remove("hidden");

}

let questionModel = {
    title: "",
    image: "",
    questions: [ 
       
    ],
    levels: [

    ]
}

let firstQuestion = null;

function collapseQuestion(click) {
    const question = click.parentNode.parentNode;

    if(firstQuestion === null) {
        firstQuestion = question;
        question.setAttribute("style", "height: auto");
        question.classList.add("opened");
        click.setAttribute("onclick", "");
        click.classList.add("hidden");
    } else {
        firstQuestion.setAttribute("style", "height: 65px");
        firstQuestion.classList.remove("opened");
        firstQuestion.children[0].children[1].setAttribute("onclick", "collapseQuestion(this)");
        firstQuestion.children[0].children[1].classList.remove("hidden");
        question.setAttribute("style", "height: auto");
        question.classList.add("opened");
        click.setAttribute("onclick", "");
        click.classList.add("hidden");
        firstQuestion = question;
    }
}

function validadeQuestionForms(getLevelNumber, getQntNumber){
    let sucessAnswer2 = false;
    let sucessAnswer3 = false;
    


    for(let i = 0; i < getQntNumber; i++){
    const questionTitle = document.querySelector(`.question${i+1} .question-text${i+1}`).value;
    const questionColor = document.querySelector(`.question${i+1} .color${i+1}`).value;
    const questionRightAnswer = document.querySelector(`.question${i+1} .right-answer${i+1}`).value;
    const questionRightImage = document.querySelector(`.question${i+1} .right-answer-img${i+1}`).value;
    const questionWrongAnswer = document.querySelector(`.question${i+1} .text-wrong${i+1}`).value;
    const questionWrongImage = document.querySelector(`.question${i+1} .image-wrong${i+1}`).value;
    const questionWrongAnswer2 = document.querySelector(`.question${i+1} .text-wrong2${i+1}`).value;
    const questionWrongImage2 = document.querySelector(`.question${i+1} .image-wrong2${i+1}`).value;
    const questionWrongAnswer3 = document.querySelector(`.question${i+1} .text-wrong3${i+1}`).value;
    const questionWrongImage3 = document.querySelector(`.question${i+1} .image-wrong3${i+1}`).value;
    
    if(questionTitle == ""|| questionTitle.length < 20){
        alert(`O texto da pergunta ${i+1} não pode ser vazio ou precisa ter mais de 20 caracteres.`);
        return
    } 
    let hexa = /[0-9A-Fa-f]{6}/g;
    if(hexa.test(questionColor) == false){
        alert(`A cor da pergunta ${i+1} precisa conter 6 digitos entre eles números de 0 à 9 e letras de A à F.`);
        return
    }
    if(questionRightAnswer == ""){
        alert(`A resposta correta da pergunta ${i+1} não pode ser vazio.`);
        return
    }
    if((validURL(questionRightImage)) == false){
        alert(`Por favor insira um URL válido na resposta correta da pergunta ${i+1}.`);
        return
    }
    if(questionWrongAnswer == ""){
        alert(`A resposta incorreta 1 da pergunta ${i+1} não pode ser vazio.`);
        return
    }
    if((validURL(questionWrongImage)) == false){
        alert(`Por favor insira um URL válido na resposta incorreta 1 da pergunta ${i+1}.`);
        return
    }
    if(questionWrongAnswer2 !== ""){
        sucessAnswer2 = true
    }
    if(sucessAnswer2 == true){
        if((validURL(questionWrongImage2)[i+1]) == false){
            alert(`Por favor insira um URL válido na resposta incorreta 2 da pergunta ${i+1}.`);
        }
    }
    if(questionWrongAnswer3 !== ""){
        sucessAnswer3 = true
    }
    if(sucessAnswer3 == true){
        if((validURL(questionWrongImage3)[i+1]) == false){
            alert(`Por favor insira um URL válido na resposta incorreta 3 da pergunta ${i+1}.`);
        }
    }


    questionModel.questions.push({
        title: questionTitle,
        color: "#"+questionColor,
        answers: [
            {
                text: questionRightAnswer,
                image: questionRightImage,
                isCorrectAnswer: true
            },
            {
                text: questionWrongAnswer,
                image: questionWrongImage,
                isCorrectAnswer: false
            }
        ]
    })

    if(sucessAnswer2 == true){
        questionModel.questions[i].answers.push({
            text: questionWrongAnswer2,
            image: questionWrongImage2,
            isCorrectAnswer: false
        })
         sucessAnswer2 = false 
    }
    if(sucessAnswer3 == true){
        questionModel.questions[i].answers.push({
            text: questionWrongAnswer3,
            image: questionWrongImage3,
            isCorrectAnswer: false
        })
        sucessAnswer3 = false
    }

}

    createLevel(getLevelNumber); 
}

function createLevel(levelNumber) {
    const displayCreateQuestion = document.querySelector(".container-create-questions");
    const hideCreateFeature = document.querySelector(".container-new-quiz");
    hideCreateFeature.classList.add("hidden");
    displayCreateQuestion.classList.remove("hidden");
    let generateLevels = document.querySelector(".container-levels");
    for (let i = 1; i <= levelNumber; i++) {
        generateLevels.innerHTML += `
        <div class="level">
            <h2>Nível ${i}</h2>
            <input type="text" class="title" placeholder="Título do nível">
            <input type="number" class="percentage" placeholder="% de acerto mínima">
            <input type="url" class="imageURL" placeholder="URL da imagem do nível">
            <input type="text" class="description" placeholder="Descrição do nível">
        </div>
        `;
    }
    generateLevels.innerHTML += `<button onclick="verifyLevelInput()">Finalizar Quizz</button>`;

    const displayCreateLevel = document.querySelector(".container-levels");
    const hideCreateQuestions = document.querySelector(".container-create-questions");
    displayCreateLevel.classList.remove("hidden");
    hideCreateQuestions.classList.add("hidden");
}

function createFinalization(response){
    let myQuizzes = JSON.parse(localStorage.id);
    myQuizzes.id.push(response.data.id);
    localStorage.setItem("id", JSON.stringify(myQuizzes));

    myQuizzes = JSON.parse(localStorage.secretKey);
    myQuizzes.key.push(response.data.key);
    localStorage.setItem("secretKey", JSON.stringify(myQuizzes));

    const screen = document.querySelector(".container-finalization");
    screen.innerHTML = `
        <h1>Seu quizz está pronto!</h1>
        <div class="quizz-card">
            <img src="${questionModel.image}">
            <div class="gradient"></div>
            <p>${questionModel.title}</p>
        </div>
        <button onclick=accessQuizzFromFinalization(${response.data.id})>Acessar Quizz</button>
        <button onclick="backHomescreen()">Voltar pra Home</button>
    `;
    screen.classList.remove("hidden");
    const hideLevelScreen = document.querySelector(".container-levels");
    hideLevelScreen.classList.add("hidden");
}



function accessQuizzFromFinalization(quizzID){
    quizzIDFromFinalization = quizzID;
    const promisse = axios.get(`https://mock-api.bootcamp.respondeai.com.br/api/v2/buzzquizz/quizzes`);
    promisse.then((response) => {
        allQuizzes = response;


        isNew = true;
        accessQuizz(quizzIDFromFinalization, true);
    });
}

function backHomescreen() {
    getQuizzes();
    isNew = false;
    selectedQuizzGlobal = undefined;
    const homescreen = document.querySelector(".container");
    const finalizationScreen = document.querySelector(".container-finalization");
    const quizzScreen = document.querySelector(".container-quizz");
    const quizzScrenRemove = document.querySelector(".container-result");
    quizzScreen.classList.add("hidden");
    finalizationScreen.classList.add("hidden");
    homescreen.classList.remove("hidden");
    quizzScrenRemove.classList.add("hidden");
    
    const createFirstQuizz = document.querySelector(".create-quizz");
    const myQuizzes = JSON.parse(localStorage.length);
    if(myQuizzes > 0 ){
        createFirstQuizz.classList.add("hidden");
    }
}

function restartQuizz(){
    accessQuizz(selectedQuizzGlobal, isNew);
    const targetTop = document.querySelector(".container-quizz .header");
    targetTop.scrollIntoView();
    const containerResult = document.querySelector(".container-result");
    containerResult.classList.add("hidden");
}

function verifyLevelInput() {
    const level = document.querySelectorAll(".container-levels .level");
    const arrayLevels = [];
    let existPercentageEqualsZero = false;
    let checked = false; // Variável que mudará para true no final do último loop dentro do for, para informar que tudo foi verificado
    for (let i = 0; i < level.length; i++) {
        const inputs = level[i].querySelectorAll("input");
        /*
         * A variável Inputs criada na linha anterior é um array que contém os 4 campos input de um nível,
         * seguindo a ordem:
         * inputs[0] === Título
         * inputs[1] === % de acerto
         * inputs[2] === URL da imagem do nível
         * inputs[3] === Descrição do nível
         */
        if(inputs[0].value.length < 10){ 
            alert(`O título deve possuir no mínimo 10 caracteres (Nível - ${i+1})`);
            inputs[0].value = "";
            break;
        }
        if(Number(inputs[1].value) < 0 || Number(inputs[1].value) > 100){
            alert(`A porcentagem de acerto mínima precisa ser um número entre 0 e 100 (Nível - ${i+1})`);
            inputs[1].value = "";
            break;
        } else if(inputs[1].value === ""){
            alert(`A porcentagem de acerto mínima não pode estar vazia (Nível - ${i+1})`);
            break;
        } else if(Number(inputs[1].value) === 0){
            existPercentageEqualsZero = true;
        }
        if(!validURL(inputs[2].value)){
            alert(`A URL da imagem não é válida (Nível - ${i+1})`);
            break;
        }
        if(inputs[3].value === ""){
            alert(`A descrição do nível não pode estar vazia (Nível ${i+1})`);
            break;
        } else if(inputs[3].value.length < 30) {
            alert(`A descrição do nível precisa ter no mínimo 30 caracteres (Nível ${i+1})`);
            break;
        }
        arrayLevels.push({
            title: inputs[0].value,
            image: inputs[2].value,
            text: inputs[3].value,
            minValue: Number(inputs[1].value)
        });
        if(i === level.length-1) checked = true;
    }
    if(checked)
        if(!existPercentageEqualsZero)
            alert(`É obrigatório existir pelo menos um nível igual a zero.`);
        else{
            questionModel.levels = arrayLevels;
            sendQuizzToServer();
        }
            
}

function sendQuizzToServer(){
    const promisse = axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v2/buzzquizz/quizzes", questionModel);
    promisse.then(createFinalization);
    promisse.catch(failToPost);
}

function failToPost(){
    alert("Vefique seu código!");
}