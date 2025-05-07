/**
 * Script JavaScript principal pour l'interface développeur
 * Contient toutes les fonctionnalités demandées:
 * - Toggler de thème clair/sombre
 * - Simulation de chat
 * - Navigation dans l'arborescence de fichiers
 * - Éditeur de code avec numérotation de lignes
 * - Terminal simulé
 */

// Attendre que le DOM soit complètement chargé
document.addEventListener('DOMContentLoaded', () => {
    // Initialisation des fonctionnalités principales
    initThemeToggle();
    initChat();
    initFileExplorer();
    initCodeEditor();
    initTerminal();
  });
  
  /**
   * Toggler de thème (clair/sombre)
   * Change les variables CSS via classes et sauvegarde le choix dans localStorage
   */
  function initThemeToggle() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = themeToggleBtn.querySelector('i');
    
    // Charger le thème depuis localStorage s'il existe
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.className = `${savedTheme}-theme`;
    
    // Mettre à jour l'icône en fonction du thème actuel
    updateThemeIcon();
    
    // Gestionnaire d'événement pour le bouton de changement de thème
    themeToggleBtn.addEventListener('click', () => {
      // Basculer entre les classes de thème
      if (document.body.classList.contains('light-theme')) {
        document.body.classList.replace('light-theme', 'dark-theme');
        localStorage.setItem('theme', 'dark');
      } else {
        document.body.classList.replace('dark-theme', 'light-theme');
        localStorage.setItem('theme', 'light');
      }
      
      // Mettre à jour l'icône
      updateThemeIcon();
    });
    
    // Fonction pour mettre à jour l'icône en fonction du thème actuel
    function updateThemeIcon() {
      if (document.body.classList.contains('light-theme')) {
        themeIcon.className = 'bi bi-moon';
      } else {
        themeIcon.className = 'bi bi-sun';
      }
    }
  }
  
  /**
   * Initialisation du chat
   * Simule une conversation et permet d'envoyer des messages
   */
  function initChat() {
    const chatMessages = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chat-input');
    const sendButton = document.getElementById('send-button');
    
    // Messages d'exemple pré-remplis
    const initialMessages = [
      { text: "Bonjour ! Comment puis-je vous aider aujourd'hui ?", sender: 'system' },
      { text: "J'ai besoin d'aide avec mon projet React.", sender: 'user' },
      { text: "Bien sûr, je peux vous aider avec React. Quelle est votre question spécifique ?", sender: 'system' }
    ];
    
    // Afficher les messages initiaux
    initialMessages.forEach(msg => addMessage(msg.text, msg.sender));
    
    // Gestionnaire d'événement pour l'envoi de messages
    function sendMessage() {
      const messageText = chatInput.value.trim();
      if (messageText) {
        // Ajouter le message de l'utilisateur
        addMessage(messageText, 'user');
        
        // Simuler une réponse après un court délai
        setTimeout(() => {
          const responses = [
            "Je comprends votre question. Laissez-moi vous aider avec ça.",
            "Intéressant ! Voici comment vous pourriez résoudre ce problème...",
            "Bonne question ! Dans ce cas, je vous recommande de...",
            "D'après mon expérience, la meilleure approche serait..."
          ];
          
          const randomResponse = responses[Math.floor(Math.random() * responses.length)];
          addMessage(randomResponse, 'system');
        }, 1000);
        
        // Effacer l'input
        chatInput.value = '';
      }
    }
    
    // Ajouter un message au chat
    function addMessage(text, sender) {
      const messageElement = document.createElement('div');
      messageElement.className = `chat-message ${sender}`;
      messageElement.textContent = text;
      chatMessages.appendChild(messageElement);
      
      // Faire défiler vers le bas pour voir le nouveau message
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Écouteurs d'événements pour l'envoi de messages
    sendButton.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });
  }
  
  /**
   * Initialisation de l'explorateur de fichiers
   * Crée une arborescence de dossiers et fichiers avec fonctionnalité collapse
   */
  function initFileExplorer() {
    const fileExplorer = document.getElementById('file-explorer');
    
    // Structure de données simulant une arborescence de fichiers
    const fileStructure = {
      'src': {
        type: 'folder',
        children: {
          'components': {
            type: 'folder',
            children: {
              'Header.jsx': { type: 'file', icon: 'bi-file-earmark-code' },
              'Footer.jsx': { type: 'file', icon: 'bi-file-earmark-code' },
              'Sidebar.jsx': { type: 'file', icon: 'bi-file-earmark-code' }
            }
          },
          'pages': {
            type: 'folder',
            children: {
              'Home.jsx': { type: 'file', icon: 'bi-file-earmark-code' },
              'About.jsx': { type: 'file', icon: 'bi-file-earmark-code' },
              'Contact.jsx': { type: 'file', icon: 'bi-file-earmark-code' }
            }
          },
          'App.jsx': { type: 'file', icon: 'bi-file-earmark-code' },
          'index.js': { type: 'file', icon: 'bi-file-earmark-code' }
        }
      },
      'public': {
        type: 'folder',
        children: {
          'index.html': { type: 'file', icon: 'bi-file-earmark-code' },
          'favicon.ico': { type: 'file', icon: 'bi-file-earmark-image' },
          'styles': {
            type: 'folder',
            children: {
              'main.css': { type: 'file', icon: 'bi-file-earmark-code' },
              'reset.css': { type: 'file', icon: 'bi-file-earmark-code' }
            }
          }
        }
      },
      'package.json': { type: 'file', icon: 'bi-file-earmark-text' },
      'README.md': { type: 'file', icon: 'bi-file-earmark-text' }
    };
    
    // Générer l'arborescence HTML à partir de la structure
    fileExplorer.innerHTML = generateFileTree(fileStructure);
    
    // Ajouter des écouteurs d'événements pour plier/déplier les dossiers
    const folders = fileExplorer.querySelectorAll('.folder');
    folders.forEach(folder => {
      folder.addEventListener('click', (e) => {
        if (e.target === folder) {
          folder.classList.toggle('open');
        }
      });
    });
    
    // Fonction récursive pour générer l'arborescence HTML
    function generateFileTree(structure, isRoot = true) {
      let html = isRoot ? '' : '<div class="folder-contents">';
      
      // Parcourir tous les éléments de la structure
      for (const [name, item] of Object.entries(structure)) {
        if (item.type === 'folder') {
          html += `
            <div class="folder">
              <div class="folder-name">
                <i class="bi bi-chevron-right"></i>
                <i class="bi bi-folder"></i>
                ${name}
              </div>
              ${generateFileTree(item.children, false)}
            </div>
          `;
        } else if (item.type === 'file') {
          html += `
            <div class="file">
              <i class="${item.icon}"></i>
              <div class="file-name">${name}</div>
            </div>
          `;
        }
      }
      
      html += isRoot ? '' : '</div>';
      return html;
    }
  }
  
  /**
   * Initialisation de l'éditeur de code
   * Crée un éditeur simple avec numérotation des lignes
   */
  function initCodeEditor() {
    const codeEditor = document.getElementById('code-editor');
    const lineNumbers = document.getElementById('line-numbers');
    const fileTabs = document.getElementById('file-tabs');
    
    // Contenu d'exemple pour l'éditeur
    const sampleCode = `function HelloWorld() {
    console.log("Hello, world!");
    
    // Une boucle simple
    for (let i = 0; i < 5; i++) {
      console.log(\`Compteur: \${i}\`);
    }
    
    return "Terminé!";
  }
  
  // Appeler la fonction
  HelloWorld();`;
  
    codeEditor.value = sampleCode;
    
    // Générer les numéros de ligne
    updateLineNumbers();
    
    // Mettre à jour les numéros de ligne quand le contenu change
    codeEditor.addEventListener('input', updateLineNumbers);
    codeEditor.addEventListener('scroll', () => {
      // Synchroniser le défilement des numéros de ligne avec l'éditeur
      lineNumbers.scrollTop = codeEditor.scrollTop;
    });
    
    // Gestionnaire d'onglets de fichiers
    const tabs = fileTabs.querySelectorAll('.file-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        // Activer l'onglet sélectionné
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        // Simuler le changement de fichier
        const fileName = tab.textContent;
        let newContent = '';
        
        // Contenu fictif pour chaque onglet
        switch (fileName) {
          case 'index.html':
            newContent = '<!DOCTYPE html>\n<html>\n<head>\n  <title>Exemple</title>\n</head>\n<body>\n  <h1>Hello World</h1>\n</body>\n</html>';
            break;
          case 'styles.css':
            newContent = 'body {\n  font-family: sans-serif;\n  margin: 0;\n  padding: 20px;\n}\n\nh1 {\n  color: #0d6efd;\n}';
            break;
          case 'main.js':
            newContent = sampleCode;
            break;
        }
        
        codeEditor.value = newContent;
        updateLineNumbers();
      });
    });
    
    /**
     * Met à jour les numéros de ligne en fonction du contenu de l'éditeur
     */
    function updateLineNumbers() {
      // Compter les lignes
      const lines = codeEditor.value.split('\n');
      const lineCount = lines.length;
      
      // Générer les numéros de ligne
      let lineNumbersHtml = '';
      for (let i = 1; i <= lineCount; i++) {
        lineNumbersHtml += `<div>${i}</div>`;
      }
      
      lineNumbers.innerHTML = lineNumbersHtml;
    }
  }
  
  /**
   * Initialisation du terminal
   * Simule un terminal avec saisie de commandes et affichage des résultats
   */
  function initTerminal() {
    const terminal = document.getElementById('terminal');
    const terminalInput = document.getElementById('terminal-input');
    
    // Message d'accueil du terminal
    addTerminalLine('Bienvenue dans le terminal CodeLab v1.0.0', 'output');
    addTerminalLine('Tapez "help" pour afficher les commandes disponibles.', 'output');
    addTerminalPrompt();
    
    // Focus sur l'input quand on clique sur le terminal
    terminal.addEventListener('click', () => {
      terminalInput.focus();
    });
    
    // Traiter les commandes entrées
    terminalInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const command = terminalInput.value.trim();
        
        // Ajouter la commande au terminal
        addTerminalLine(`$ ${command}`, 'command');
        
        // Traiter la commande
        processCommand(command);
        
        // Réinitialiser l'input
        terminalInput.value = '';
      }
    });
    
    /**
     * Traite les commandes saisies dans le terminal
     * @param {string} command - La commande à traiter
     */
    function processCommand(command) {
      const cmd = command.toLowerCase();
      const args = cmd.split(' ');
      
      switch (args[0]) {
        case 'help':
          addTerminalLine('Commandes disponibles :', 'output');
          addTerminalLine('  help         - Affiche cette aide', 'output');
          addTerminalLine('  clear        - Efface le terminal', 'output');
          addTerminalLine('  ls           - Liste les fichiers du répertoire courant', 'output');
          addTerminalLine('  echo [texte] - Affiche le texte', 'output');
          addTerminalLine('  date         - Affiche la date et l\'heure actuelles', 'output');
          break;
          
        case 'clear':
          // Effacer tout le contenu du terminal sauf l'input
          terminal.innerHTML = '';
          break;
          
        case 'ls':
          // Simuler une liste de fichiers
          addTerminalLine('README.md  package.json  src/  public/', 'output');
          break;
          
        case 'echo':
          // Afficher le texte après "echo"
          const text = command.substring(5);
          addTerminalLine(text, 'output');
          break;
          
        case 'date':
          // Afficher la date et l'heure actuelles
          addTerminalLine(new Date().toString(), 'output');
          break;
          
        case '':
          // Ne rien faire si la commande est vide
          break;
          
        default:
          // Commande non reconnue
          addTerminalLine(`Commande non reconnue : ${args[0]}`, 'error');
          addTerminalLine('Tapez "help" pour afficher les commandes disponibles.', 'output');
      }
      
      // Ajouter un nouveau prompt
      addTerminalPrompt();
    }
    
    /**
     * Ajoute une ligne au terminal
     * @param {string} text - Le texte à afficher
     * @param {string} type - Le type de ligne (command, output, error)
     */
    function addTerminalLine(text, type) {
      const line = document.createElement('div');
      line.className = `terminal-line terminal-${type}`;
      line.textContent = text;
      terminal.appendChild(line);
      
      // Faire défiler vers le bas
      terminal.scrollTop = terminal.scrollHeight;
    }
    
    /**
     * Ajoute un prompt au terminal (uniquement visuel)
     */
    function addTerminalPrompt() {
      addTerminalLine('', 'prompt');
    }
  }