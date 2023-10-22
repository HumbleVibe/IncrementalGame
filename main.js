document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const tabs = document.querySelectorAll('.tab-item');
    const tabContents = document.querySelectorAll('.tab-content');
    const tooltip = document.getElementById('tooltip');
    const lootButton = document.getElementById('loot-button');
    const upgradeButton = document.getElementById('upgrade-button');
    const autoclickerButton = document.getElementById('autoclicker-button');
    const sellButton = document.getElementById('sell-button');
    const inventoryDiv = document.getElementById('inventory');
    const currencyDiv = document.getElementById('currency');
    const expBar = document.getElementById('exp-bar');
    const levelDiv = document.getElementById('level');
    const inventoryGridDiv = document.getElementById('inventory-grid'); // reference the new grid div
    
    let currency = 0;
    let level = 1;
    let experience = 0;
    let experienceToNextLevel = 100;

    // Set the initial display state of tab contents
    tabContents.forEach(content => {
      content.style.display = 'none';
    });

    // Display the first tab content by default
    document.getElementById('home').style.display = 'block';

    // Event listeners for Tabs
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('bg-blue-500', 'text-white', 'transform', 'scale-105'));
            tab.classList.add('bg-blue-500', 'text-white', 'transform', 'scale-105');

            tabContents.forEach(content => {
                content.style.display = 'none';
            });

            document.getElementById(tab.id.split('-')[0]).style.display = 'block';
        });
    });

    // ...

// ...

// Array of Monster Objects
let monsters = [
    {
      id: 1,
      name: "Monster 1",
      health: 100,
      maxHealth: 100,
      experienceReward: 20,
      lootReward: 10,
    },
    {
        id: 2,
        name: "Monster 2",
        health: 200,
        maxHealth: 100,
        experienceReward: 50,
        lootReward: 15,
      },
      {
        id: 3,
        name: "Monster 1",
        health: 100,
        maxHealth: 100,
        experienceReward: 20,
        lootReward: 10,
      },
      {
        id: 4,
        name: "Monster 1",
        health: 100,
        maxHealth: 100,
        experienceReward: 20,
        lootReward: 10,
      },
    // Add more monster objects as needed
  ];
  
  const monsterSection = document.getElementById('monster-section');
  
  // Update the monsters display
  function updateMonsterDisplay() {
    monsterSection.innerHTML = ''; // Clear existing monster elements
    monsters.forEach(monster => {
      const monsterDiv = document.createElement('div');
      monsterDiv.classList.add('monster');
      monsterDiv.innerHTML = `
        <div id="monster-name-${monster.id}" class="text-xl">${monster.name}</div>
        <div id="monster-health-${monster.id}" class="text-lg">Health: ${monster.health}</div>
        <button id="attack-button-${monster.id}" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
          Attack
        </button>
      `;
      monsterSection.appendChild(monsterDiv);
  
      // Add event listener to the attack button of each monster
      document.getElementById(`attack-button-${monster.id}`).addEventListener('click', () => {
        // Handle Attack
        monster.health -= 10; // Assume the player does 10 damage for now.
  
        // Check if the monster is dead
        if (monster.health <= 0) {
          gainExperience(monster.experienceReward);
          // Add the monster's loot to the inventory
          const loot = createLootItem(monster.lootReward);
          inventoryGridDiv.appendChild(loot);
          spawnNewMonster(monster.id); // Pass the id of the defeated monster
        }
  
        updateMonsterDisplay(); // Update display after attack
      });
    });
  }
  
  // Spawn a new monster
  function spawnNewMonster(monsterId) {
    // Find the monster with the given id and reset its health
    const monster = monsters.find(m => m.id === monsterId);
    if (monster) {
      monster.health = monster.maxHealth;
    }
  }
  
  // Call this function to set initial monsters display
  updateMonsterDisplay();
  
    // Loot Button Click Event
    lootButton.addEventListener('click', () => {
        if (inventoryGridDiv.children.length < 30) {
            const loot = createLootItem();
            inventoryGridDiv.appendChild(loot);
            gainExperience(10);
        } else {
            showInventoryFullTooltip();
        }
    });

    // Upgrade Button Click Event
    upgradeButton.addEventListener('click', () => {
        if (currency >= 50) {
            currency -= 50;
            updateCurrencyDisplay();
            gainExperience(50);
        } else {
            showTooltip();
        }
    });

    // AutoClicker Button Click Event
    autoclickerButton.addEventListener('click', () => {
        if (currency >= 100) {
            currency -= 100;
            updateCurrencyDisplay();
            setInterval(() => {
                lootButton.click();
            }, 1000);
        } else {
            showTooltip();
        }
    });
  
    function createLootItem() {
        const newItem = document.createElement('div');
        newItem.className = 'inventory-item';
        const tier = getRandomTier();
            newItem.textContent = 'Loot Tier ' + tier;
        newItem.dataset.tier = tier; // Store the tier information in the element
    return newItem;
}

// Sell Button Click Event
    sellButton.addEventListener('click', () => {
    const items = Array.from(inventoryGridDiv.children); // Adjusted to       reference the new inventory grid
    if (items.length > 0) {
        items.forEach(item => {
            const tier = parseInt(item.dataset.tier);
            currency += tier; // Award currency based on item tier
        });
        updateCurrencyDisplay();
        while (inventoryGridDiv.firstChild) {
            inventoryGridDiv.removeChild(inventoryGridDiv.firstChild);
        }
    } else {
        alert('No items to sell!');
    }
});


    function getRandomTier() {
        // Adjust the numbers in the array to change the likelihood of each tier.
        const tiers = [3, 1, 1, 1, 1, 1];
        const randomIndex = Math.floor(Math.random() * tiers.length);
        return tiers[randomIndex];
    }

    function updateCurrencyDisplay() {
        currencyDiv.textContent = 'Currency: ' + currency;
    }

    function showTooltip() {
        tooltip.style.display = 'block';
        setTimeout(() => {
            tooltip.style.display = 'none';
        }, 2000);
    }

    function gainExperience(amount) {
        experience += amount;
        if (experience >= experienceToNextLevel) {
            levelUp();
        }
        updateExperienceBar();
    }

    function updateExperienceBar() {
        const percentage = (experience / experienceToNextLevel) * 100;
        expBar.style.width = percentage + '%';
    }

    function levelUp() {
        level++;
        experience = 0;
        experienceToNextLevel = level * 100;
        levelDiv.textContent = 'Level: ' + level;
    }
});
