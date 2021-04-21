getQuizzes(); 

function getQuizzes(){
    const promess = axios.get("https://mock-api.bootcamp.respondeai.com.br/api/v2/buzzquizz/quizzes");
    promess.then(showQuizzes);
}

let arrayClick;

function showQuizzes(response){
    arrayClick = response;
    const eachQuizz = document.querySelector(".quizzes");
    
    eachQuizz.innerHTML = "";
    for(let i = 0; i < response.data.length; i++){
        eachQuizz.innerHTML +=`
        <div class="e-quizzes" id=${i+1} onclick="acessQuizz(this.id)">
        <img src="${response.data[i].image}">
        <p>${response.data[i].title}</p>
        </div>  
        `
    }
}

function acessQuizz(click){
    console.log(arrayClick.data);
    console.log(click);
    const aa = arrayClick.data[click-1]
    console.log(aa)
    console.log(aa.questions);

    const questionBody = document.querySelector(".container-quizz");
    questionBody.innerHTML = "";
    questionBody.innerHTML = `
        <div class="header">
            <img src="${aa.image}">
            <h2>${aa.title}</h2>
        </div>
    `
    for(let i=0; i<aa.questions.length ; i++){
        questionBody.innerHTML +=`
        <div class="each-question">
            <div style="background-color:${aa.questions[i].color};" class="title">${aa.questions[i].title}</div>
            <div class="alternatives">
                <div class="alternative">
                    <img src="https://criticalhits.com.br/wp-content/uploads/2020/10/estas-afirmacoes-hermione-granger-harry-potter-sao-verdadeiras.jpg">
                    <p>texto da alternativa</p>   
                </div>
                <div class="alternative">
                    <img src="https://criticalhits.com.br/wp-content/uploads/2020/10/estas-afirmacoes-hermione-granger-harry-potter-sao-verdadeiras.jpg">
                    <p>texto da alternativa</p>
                </div>
                <div class="alternative">
                    <img src="https://criticalhits.com.br/wp-content/uploads/2020/10/estas-afirmacoes-hermione-granger-harry-potter-sao-verdadeiras.jpg">
                    <p>texto da alternativa</p>   
                </div>
                <div class="alternative">
                    <img src="https://criticalhits.com.br/wp-content/uploads/2020/10/estas-afirmacoes-hermione-granger-harry-potter-sao-verdadeiras.jpg">
                    <p>texto da alternativa</p>   
                </div>
            </div>
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

function createFinalization(){
    const screen = document.querySelector(".container-finalization");
    screen.innerHTML = `
        <h1>Seu quizz está pronto!</h1>
        <div class="quizz-card">
            <img src="${questionModel.image}">
            <div class="gradient"></div>
            <p>${questionModel.title}</p>
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
    console.log(arrayLevels);
    if(checked)
        if(!existPercentageEqualsZero)
            alert(`É obrigatório existir pelo menos um nível igual a zero.`);
        else{
            questionModel.levels = arrayLevels;
            sendQuizzToServer(questionModel);
        }
            
}

function sendQuizzToServer(request){
    const promisse = axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v2/buzzquizz/quizzes", questionModel);
    promisse.catch(failToPost);
}
function failToPost(){
    console.log(questionModel);
    alert("Vefique seu código!")
}