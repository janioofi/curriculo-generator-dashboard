document.getElementById('curriculoForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Impede o envio padrão do formulário

    // Captura os dados do formulário
    const curriculo = {
        nomeCompleto: document.getElementById('nomeCompleto').value,
        celular: document.getElementById('celular').value,
        bairro: document.getElementById('bairro').value,
        cidade: document.getElementById('cidade').value,
        estado: document.getElementById('estado').value,
        email: document.getElementById('email').value,
        linkedinUsername: document.getElementById('linkedinUsername').value,
        githubUsername: document.getElementById('githubUsername').value,
        titulo: document.getElementById('titulo').value,
        resumo: document.getElementById('resumo').value,
        habilidades: {
            idiomas: Array.from(document.querySelectorAll('#listaIdiomas li')).map(li => li.textContent),
            frontEnd: Array.from(document.querySelectorAll('#listaFrontEnd li')).map(li => li.textContent),
            backEnd: Array.from(document.querySelectorAll('#listaBackEnd li')).map(li => li.textContent),
            bancoDados: Array.from(document.querySelectorAll('#listaBancoDados li')).map(li => li.textContent),
            outros: Array.from(document.querySelectorAll('#listaOutros li')).map(li => li.textContent),
            pessoais: Array.from(document.querySelectorAll('#listaPessoais li')).map(li => li.textContent), // Nova linha para habilidades pessoais
        },
        experiencias: Array.from(document.querySelectorAll('#listaExperiencias li')).map(li => JSON.parse(li.dataset.experiencia)),
        educacao: Array.from(document.querySelectorAll('#listaEducacao li')).map(li => JSON.parse(li.dataset.educacao)),
        cursos: Array.from(document.querySelectorAll('#listaCurso li')).map(li => JSON.parse(li.dataset.cursos))
    };

    // Envia os dados para o back-end
    // fetch('https://curriculo-generator-backend.up.railway.app/api/v1/curriculo/gerar', {
    fetch('http://localhost:8080/api/v1/curriculo/gerar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(curriculo),
    })
    .then(response => {
        if (response.ok) {
            return response.blob(); // Retorna a resposta como um blob
        } else {
            throw new Error('Erro na requisição: ' + response.statusText);
        }
    })
    .then(blob => {
        const url = window.URL.createObjectURL(blob); // Cria um URL para o blob
        const a = document.createElement('a'); // Cria um elemento <a>
        const nome = curriculo.nomeCompleto.split(' ')[0];  
        a.style.display = 'none'; // Oculta o elemento
        a.href = url; // Define o href como o blob URL
        a.download = `${nome}-curriculo.docx`; // Define o nome do arquivo
        document.body.appendChild(a); // Adiciona o elemento ao DOM
        a.click(); // Simula um clique no elemento
        window.URL.revokeObjectURL(url); // Libera o blob URL
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('Erro ao enviar o currículo.');
    });
});

// Funções para adicionar habilidades, experiências e educação
function addListItem(inputId, listId) {
    const input = document.getElementById(inputId);
    const value = input.value.trim();
    if (value) {
        const listItem = document.createElement('li');
        listItem.textContent = value;
        document.getElementById(listId).appendChild(listItem);
        input.value = ''; // Limpa o campo
    }
}

// Adicionando habilidades
document.getElementById('addIdioma').addEventListener('click', () => addListItem('idioma', 'listaIdiomas'));
document.getElementById('addFrontEnd').addEventListener('click', () => addListItem('frontEnd', 'listaFrontEnd'));
document.getElementById('addBackEnd').addEventListener('click', () => addListItem('backEnd', 'listaBackEnd'));
document.getElementById('addBancoDados').addEventListener('click', () => addListItem('bancoDados', 'listaBancoDados'));
document.getElementById('addOutros').addEventListener('click', () => addListItem('outros', 'listaOutros'));
document.getElementById('addPessoais').addEventListener('click', () => addListItem('pessoais', 'listaPessoais')); // Nova linha para habilidades pessoais

// Função para adicionar experiência
document.getElementById('addExperiencia').addEventListener('click', function() {
    const experiencia = {
        cargo: document.getElementById('cargo').value,
        empresa: document.getElementById('empresa').value,
        mesAnoInicio: document.getElementById('mesAnoInicioExperiencia').value,
        mesAnoFinal: document.getElementById('mesAnoFinalExperiencia').value,
        descricao: document.getElementById('descricaoExperiencia').value,
        skills: [] // Adicione as skills se necessário
    };

    const listItem = document.createElement('li');
    listItem.textContent = `${experiencia.cargo} - ${experiencia.empresa} (${experiencia.mesAnoInicio} - ${experiencia.mesAnoFinal})`;
    listItem.dataset.experiencia = JSON.stringify(experiencia); // Armazena a experiência completa

    // Botão de remover
    const removeBtn = document.createElement('button');
    removeBtn.textContent = 'Remover';
    removeBtn.style.backgroundColor = 'red'; // Cor de fundo vermelha
    removeBtn.style.color = 'white'; // Texto branco
    removeBtn.style.border = 'none'; // Remove a borda padrão
    removeBtn.style.borderRadius = '5px'; // Bordas arredondadas
    removeBtn.style.padding = '5px 10px'; // Espaçamento interno
    removeBtn.style.cursor = 'pointer'; // Muda o cursor para indicar que é clicável
    removeBtn.onmouseover = function() {
        this.style.backgroundColor = 'darkred'; // Muda a cor ao passar o mouse
    };
    removeBtn.onmouseout = function() {
        this.style.backgroundColor = 'red'; // Retorna à cor original
    };
    removeBtn.onclick = function () {
        document.getElementById('listaExperiencias').removeChild(listItem);
    };

    listItem.appendChild(removeBtn);
    document.getElementById('listaExperiencias').appendChild(listItem);

    // Limpa os campos de experiência
    document.getElementById('cargo').value = '';
    document.getElementById('empresa').value = '';
    document.getElementById('mesAnoInicioExperiencia').value = '';
    document.getElementById('mesAnoFinalExperiencia').value = '';
    document.getElementById('descricaoExperiencia').value = '';
});

// Função para adicionar educação
document.getElementById('addEducacao').addEventListener('click', function() {
    const educacao = {
        descricao: document.getElementById('descricaoEducacao').value,
        lugar: document.getElementById('lugarEducacao').value,
        mesAnoInicio: document.getElementById('mesAnoInicioEducacao').value,
        mesAnoFinal: document.getElementById('mesAnoFinalEducacao').value
    };

    const listItem = document.createElement('li');
    listItem.textContent = `${educacao.descricao} - ${educacao.lugar} (${educacao.mesAnoInicio} - ${educacao.mesAnoFinal})`;
    listItem.dataset.educacao = JSON.stringify(educacao); // Armazena a educação completa

    // Botão de remover
    const removeBtn = document.createElement('button');
    removeBtn.textContent = 'Remover';
    removeBtn.style.backgroundColor = 'red'; // Cor de fundo vermelha
    removeBtn.style.color = 'white'; // Texto branco
    removeBtn.style.border = 'none'; // Remove a borda padrão
    removeBtn.style.borderRadius = '5px'; // Bordas arredondadas
    removeBtn.style.padding = '5px 10px'; // Espaçamento interno
    removeBtn.style.cursor = 'pointer'; // Muda o cursor para indicar que é clicável
    removeBtn.onmouseover = function() {
        this.style.backgroundColor = 'darkred'; // Muda a cor ao passar o mouse
    };
    removeBtn.onmouseout = function() {
        this.style.backgroundColor = 'red'; // Retorna à cor original
    };
    removeBtn.onclick = function () {
        document.getElementById('listaEducacao').removeChild(listItem);
    };

    listItem.appendChild(removeBtn);
    document.getElementById('listaEducacao').appendChild(listItem);

    // Limpa os campos de educação
    document.getElementById('descricaoEducacao').value = '';
    document.getElementById('lugarEducacao').value = '';
    document.getElementById('mesAnoInicioEducacao').value = '';
    document.getElementById('mesAnoFinalEducacao').value = '';
});

// Função para adicionar curso
document.getElementById('addCurso').addEventListener('click', function() {
    const curso = {
        descricao: document.getElementById('descricaoCurso').value,
        instituicao: document.getElementById('instituicaoCurso').value,
        anoConclusao: document.getElementById('anoConlusaoCurso').value
    };

    const listItem = document.createElement('li');
    listItem.textContent = `${curso.descricao} - ${curso.instituicao} (${curso.anoConclusao})`;
    listItem.dataset.cursos = JSON.stringify(curso); // Armazena o curso completo

    // Botão de remover
    const removeBtn = document.createElement('button');
    removeBtn.textContent = 'Remover';
    removeBtn.style.backgroundColor = 'red'; // Cor de fundo vermelha
    removeBtn.style.color = 'white'; // Texto branco
    removeBtn.style.border = 'none'; // Remove a borda padrão
    removeBtn.style.borderRadius = '5px'; // Bordas arredondadas
    removeBtn.style.padding = '5px 10px'; // Espaçamento interno
    removeBtn.style.cursor = 'pointer'; // Muda o cursor para indicar que é clicável
    removeBtn.onmouseover = function() {
        this.style.backgroundColor = 'darkred'; // Muda a cor ao passar o mouse
    };
    removeBtn.onmouseout = function() {
        this.style.backgroundColor = 'red'; // Retorna à cor original
    };
    removeBtn.onclick = function () {
        document.getElementById('listaCurso').removeChild(listItem);
    };

    listItem.appendChild(removeBtn);
    document.getElementById('listaCurso').appendChild(listItem);

    // Limpa os campos de curso
    document.getElementById('descricaoCurso').value = '';
    document.getElementById('instituicaoCurso').value = '';
    document.getElementById('anoConlusaoCurso').value = '';
});


// Controle dos passos dos formulários. 
let currentStep = 1;

const stepOne = document.getElementById('stepOne');
const stepTwo = document.getElementById('stepTwo');
const stepThree = document.getElementById('stepThree');
const stepFour = document.getElementById('stepFour');
const stepFive = document.getElementById('stepFive');
const stepSix = document.getElementById('stepSix');
const stepSeven = document.getElementById('stepSeven');

stepTwo.style.display = 'none';
stepThree.style.display = 'none';
stepFour.style.display = 'none';
stepFive.style.display = 'none';
stepSix.style.display = 'none'; 
stepSeven.style.display = 'none'; 

const stepController = {
    1: {
        element: stepOne,
        next: 2,
        previous: null
    },
    2: {
        element: stepTwo,
        next: 3,
        previous: 1
    },
    3: {
        element: stepThree,
        next: 4,
        previous: 2
    },
    4: {
        element: stepFour,
        next: 5,
        previous: 3
    },
    5: {
        element: stepFive,
        next: 6,
        previous: 4
    },
    6: {
        element: stepSix,
        next: 7,
        previous: 5
    },
    7: {
        element: stepSeven,
        next: null,
        previous: 6
    }
}

function nextStep() {
    if (currentStep === 7) return;
    const nextStep = stepController[currentStep].next;
    stepController[currentStep].element.style.display = 'none';
    stepController[nextStep].element.style.display = 'block';
    currentStep = nextStep;
}

function previousStep() {
    if (currentStep === 1) return;
    const previousStep = stepController[currentStep].previous;
    stepController[currentStep].element.style.display = 'none';
    stepController[previousStep].element.style.display = 'block';
    currentStep = previousStep;
}






