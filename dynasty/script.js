document.querySelector('.open-pack-btn').addEventListener('click', tryOpenPack);

// Função para gerar um número aleatório dentro de um intervalo
function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Função para determinar a raridade com base nas probabilidades
function determineRarity() {
    const randomValue = Math.random() * 100;

    if (randomValue <= 60) {
        return 'bronze'; // 60% de chance de ser bronze
    } else if (randomValue <= 90) {
        return 'silver'; // 30% de chance de ser prata
    } else {
        return 'gold'; // 10% de chance de ser ouro
    }
}

// Função para gerar a classificação da carta com base na raridade
function generateCardByRarity(rarity) {
    let rating, image;

    if (rarity === 'bronze') {
        rating = randomNumber(60, 69);
        image = 'bronze.png';  // Imagem para bronze
    } else if (rarity === 'silver') {
        rating = randomNumber(70, 79);
        image = 'prata.png';  // Imagem para prata
    } else if (rarity === 'gold') {
        rating = randomNumber(80, 89);
        image = 'ouro.png';    // Imagem para ouro
    }

    return { rating: rating, rarity: rarity, image: image };
}

// Função para gerar um pack com 3 cartas
function generatePack() {
    const pack = [];
    const cardContainer = document.querySelector('.cards');
    cardContainer.innerHTML = ''; // Limpa as cartas anteriores

    for (let i = 0; i < 3; i++) {
        const rarity = determineRarity();
        const card = generateCardByRarity(rarity);
        pack.push(card);

        const cardElement = document.createElement('div');
        cardElement.classList.add('card', card.rarity);
        cardElement.innerHTML = `
            <img src="${card.image}" alt="Carta ${card.rarity}">
            <span class="rating">${card.rating}</span>
        `;
        
        // Adicionar evento de clique para escolher a carta
        cardElement.addEventListener('click', () => selectCard(card, cardElement));
        cardContainer.appendChild(cardElement);
    }
}

// Função para salvar uma carta no Local Storage
function saveCardToLocalStorage(card) {
    let savedCards = JSON.parse(localStorage.getItem('teamCards')) || [];
    savedCards.push(card);
    localStorage.setItem('teamCards', JSON.stringify(savedCards));
}

// Função para selecionar uma carta e adicionar ao time
function selectCard(card, cardElement) {
    const teamContainer = document.querySelector('.team-cards');
    
    // Clonar o elemento da carta para adicionar ao time
    const selectedCard = cardElement.cloneNode(true);
    teamContainer.appendChild(selectedCard);

    // Salvar a carta no Local Storage
    saveCardToLocalStorage(card);

    // Remove as outras cartas do pack
    document.querySelector('.cards').innerHTML = ''; 
}

// Função para carregar as cartas salvas do Local Storage e exibi-las
function loadSavedCards() {
    const savedCards = JSON.parse(localStorage.getItem('teamCards')) || [];
    const teamContainer = document.querySelector('.team-cards');

    savedCards.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card', card.rarity);
        cardElement.innerHTML = `
            <img src="${card.image}" alt="Carta ${card.rarity}">
            <span class="rating">${card.rating}</span>
        `;
        teamContainer.appendChild(cardElement);
    });
}

// Função para verificar se o usuário pode abrir o pack
function canOpenPack() {
    const lastOpened = localStorage.getItem('lastPackOpened');
    
    if (!lastOpened) {
        return true; // Se nunca abriu o pack, pode abrir
    }

    const now = new Date();
    const lastOpenedTime = new Date(lastOpened);
    const hoursSinceLastOpen = (now - lastOpenedTime) / (1000 * 60 * 60);

    return hoursSinceLastOpen >= 20; // Verifica se se passaram 20 horas
}

// Função para mostrar quanto tempo falta para abrir o próximo pack
function timeUntilNextPack() {
    const lastOpened = localStorage.getItem('lastPackOpened');
    if (!lastOpened) {
        return 0;
    }

    const now = new Date();
    const lastOpenedTime = new Date(lastOpened);
    const hoursSinceLastOpen = (now - lastOpenedTime) / (1000 * 60 * 60);
    return 20 - hoursSinceLastOpen; // Retorna quantas horas faltam para 20h
}

// Função para exibir a contagem regressiva
function updateCountdown() {
    const countdownMessage = document.querySelector('.countdown-message');

    if (canOpenPack()) {
        countdownMessage.textContent = 'Você pode abrir um novo pack agora!';
    } else {
        const hoursRemaining = timeUntilNextPack();
        countdownMessage.textContent = `Próximo pack disponível em: ${hoursRemaining.toFixed(2)} horas.`;
    }
}

// Função que tenta abrir o pack, verificando o limite de 20 horas
function tryOpenPack() {
    if (canOpenPack()) {
        generatePack(); // Gera o pack
        localStorage.setItem('lastPackOpened', new Date().toISOString()); // Salva a hora da última abertura
    } else {
        const hoursRemaining = timeUntilNextPack();
        alert(`Você só pode abrir outro pack em ${hoursRemaining.toFixed(2)} horas.`);
    }
}

// Atualizar a contagem a cada segundo
setInterval(updateCountdown, 1000);

// Carregar as cartas salvas ao iniciar o site
window.onload = function() {
    loadSavedCards();  // Carrega as cartas salvas no time
    updateCountdown(); // Atualiza a contagem regressiva ao carregar
};