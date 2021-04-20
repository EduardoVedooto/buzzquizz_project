

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

    // console.log(getTitle.value);
    // console.log(getUlrImage.value);
    // console.log(getQntNumber.value);
    // console.log(getLevelNumber.value);
}