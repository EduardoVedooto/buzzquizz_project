

getQuizzes(); 

function getQuizzes(){
    const promess = axios.get("https://mock-api.bootcamp.respondeai.com.br/api/v2/buzzquizz/quizzes");
    promess.then(showQuizzes);
}

function showQuizzes(response){
    console.log(response.data)
    const eachQuizz = document.querySelector(".quizzes");
    
    eachQuizz.innerHTML = "";
    for(let i = 0; i < response.data.length; i++){
        eachQuizz.innerHTML +=`
        <div class="e-quizzes" onclick="acessQuizz(this)">
        <img src="${response.data[i].image}">
        <p>${response.data[i].title}</p>
        </div>  
        `
    }
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
    // }else if(getTitle.value.length < 20){
    //     alert("O titulo deve ter pelo menos 20 caracteres!");
    // }else if(getQntNumber.value <= 2){
    //     alert("Quantidade de perguntas deve ser pelo menos 3!");
    // } else if(getLevelNumber.value <=1){
    //     alert("Quantidade de níveis deve ser pelo menos 2!");
    // }else if((validURL(getUlrImage.value)) == false){
    //     alert("Não é um URL");
    }else {
        const createFeature = document.querySelector(".container-new-quiz");    
        const createQuestions = document.querySelector(".container-create-questions");
        createFeature.classList.add("hidden");
        createQuestions.classList.remove("hidden");
        createQuestion(getTitle.value, getUlrImage.value, getQntNumber.value, getLevelNumber.value);
    }
    // console.log(getTitle.value);
    // console.log(getUlrImage.value);
    // console.log(getQntNumber.value);
    // console.log(getLevelNumber.value);
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

function createQuestion(getTitle, getUlrImage, getQntNumber, getLevelNumber){
    let generateQuestions = document.querySelector(".container-create-questions");
    
    for(let i = 1; i <= getQntNumber; i++){
        generateQuestions.innerHTML +=`
        <div class="question${i} question">
            <h2>Pergunta ${i}</h2>
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
        <button class="next" onclick="validadeQuestionForms(${parseInt(getLevelNumber)}, '${getTitle}', '${getUlrImage}', '${getQntNumber}')">Prosseguir pra criar níveis</button>
        `;

    const displayCreateQuestion = document.querySelector(".container-create-questions");
    const hideCreateFeature = document.querySelector(".container-new-quiz");
    hideCreateFeature.classList.add("hidden");
    displayCreateQuestion.classList.remove("hidden");

}

function validadeQuestionForms(getTitle, getUlrImage, getQntNumber, getLevelNumber){

    let fail = false;
    let formsQuestions = [];
    for(let i = 1; i<=getQntNumber; i++){
    const questionTitle = document.querySelector(`.question${i} .question-text${i}`).value;
    const questionColor = document.querySelector(`.question${i} .color${i}`).value;
    const questionRightAnswer = document.querySelector(`.question${i} .right-answer${i}`).value;
    const questionRightImage = document.querySelector(`.question${i} .right-answer-img${i}`).value;
    const questionWrongAnswer = document.querySelector(`.question${i} .text-wrong${i}`).value;
    const questionWrongImage = document.querySelector(`.question${i} .image-wrong${i}`).value;
    const questionWrongAnswer2 = document.querySelector(`.question${i} .text-wrong2${i}`).value;
    const questionWrongImage2 = document.querySelector(`.question${i} .image-wrong2${i}`).value;
    const questionWrongAnswer3 = document.querySelector(`.question${i} .text-wrong3${i}`).value;
    const questionWrongImage3 = document.querySelector(`.question${i} .image-wrong3${i}`).value;

    if(questionTitle == "" && questionTitle.value < 20){
        fail = true;
        break
    }


    let questionModel = {
        title: getTitle,
        image: getUlrImage,
        questions: [
            {
                title: questionTitle,
                color: questionColor,
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
            }
        ] 
    }

    questionModel.questions[0].answers.push({
        text: questionWrongAnswer2,
        image: questionWrongImage2,
        isCorrectAnswer: false
    })

    questionModel.questions[0].answers.push({
        text: questionWrongAnswer3,
        image: questionWrongImage3,
        isCorrectAnswer: false
    })

    formsQuestions.push(questionModel);
}


if(fail == true){
    alert("Algum campo possui informações não aceitas, por favor verifique-as.");
    return
}
    createLevel(getLevelNumber, getTitle, getUlrImage);
}


function createLevel(levelNumber, quizzTitle, URLImage) {
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
    generateLevels.innerHTML += `<button onclick="verifyLevelInput('${quizzTitle}', '${URLImage}')">Finalizar Quizz</button>`;

    const displayCreateLevel = document.querySelector(".container-levels");
    const hideCreateQuestions = document.querySelector(".container-create-questions");
    displayCreateLevel.classList.remove("hidden");
    hideCreateQuestions.classList.add("hidden");
}

function createFinalization(Title, URLImage){
    const screen = document.querySelector(".container-finalization");
    screen.innerHTML = `
        <h1>Seu quizz está pronto!</h1>
        <div class="quizz-card">
            <img src="${URLImage}">
            <div class="gradient"></div>
            <p>${Title}</p>
        </div>
        <button>Acessar Quizz</button>
        <button onclick="backHomescreen()">Voltar pra Home</button>
    `;
    screen.classList.remove("hidden");
    const hideLevelScreen = document.querySelector(".container-levels");
    hideLevelScreen.classList.add("hidden");
}

function backHomescreen() {
    getQuizzes();
    const homescreen = document.querySelector(".container");
    const finalizationScreen = document.querySelector(".container-finalization");
    finalizationScreen.classList.add("hidden");
    homescreen.classList.remove("hidden");
}

function verifyLevelInput(title, URLImage) {
    const level = document.querySelectorAll(".container-levels .level");
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
        if(i === level.length-1) checked = true;
    }
    if(checked)
        if(!existPercentageEqualsZero)
            alert(`É obrigatório existir pelo menos um nível igual a zero.`);
        else
            createFinalization(title, URLImage);
}