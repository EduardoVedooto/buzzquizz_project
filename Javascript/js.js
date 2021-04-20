

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

    const createFeature = document.querySelector(".container-new-quiz");
    const createQuestions = document.querySelector(".container-create-questions");
    createFeature.classList.add("hidden");
    createQuestions.classList.remove("hidden");
    createQuestion(getTitle.value, getUlrImage.value, getQntNumber.value, getLevelNumber.value);
}

function createQuestion(getTitle, getUlrImage, getQntNumber, getLevelNumber){
    console.log(getQntNumber)
    let generateQuestions = document.querySelector(".container-create-questions");
    
    for(let i = 1; i <= getQntNumber; i++){
        generateQuestions.innerHTML +=`
        <div class="question">
            <h2>Pergunta ${[i]} </h2>
            <input type="text" placeholder="Texto da pergunta" class="question-text">
            <input type="text" placeholder="Cor de fundo da pergunta" class="color">
            <h2>Resposta correta</h2>
            <input type="text" placeholder="Resposta correta" class="right-answer">
            <input type="text" placeholder="URL da imagem" class="right-answer-img">
            <h2>Respostas incorretas</h2>
            <div class="wrong-answer">
                <input type="text" placeholder="Resposta incorreta 1">
                <input type="text" placeholder="URL da imagem" class="image">
            </div>
            <div class="wrong-answer2">
                <input type="text" placeholder="Resposta incorreta 2">
                <input type="text" placeholder="URL da imagem" class="image">
            </div>
            <div class="wrong-answer3">
                <input type="text" placeholder="Resposta incorreta 3">
                <input type="text" placeholder="URL da imagem" class="image">
            </div>
        </div>
        `
    }
    generateQuestions.innerHTML += `<button class="next">Prosseguir pra criar níveis</button>`
}