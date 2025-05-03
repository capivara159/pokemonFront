import { pokemonService, tokenManager } from './api.js';

document.addEventListener('DOMContentLoaded', async () => {
    if (!window.location.pathname.includes('pokemons.html')) return;

    // Verificar autenticação
    if (!tokenManager.exists()) {
        window.location.href = 'index.html';
        return;
    }

    await loadPokemons();
    setupForm();
});

async function loadPokemons() {
    try {
        const pokemons = await pokemonService.getAll();
        renderPokemons(pokemons);
    } catch (error) {
        console.error('Erro ao carregar Pokémons:', error);
        showAlert('error', 'Falha ao carregar Pokémons');
    }
}

function renderPokemons(pokemons) {
    const tableBody = document.querySelector('#pokemonTable tbody');
    tableBody.innerHTML = pokemons.map(pokemon => `
        <tr data-id="${pokemon.id}">
            <td>${pokemon.nome}</td>
            <td>${pokemon.tipo}</td>
            <td>${pokemon.poder}</td>
            <td>${pokemon.nivel}</td>
            <td class="actions">
                <button class="edit-btn">Editar</button>
                <button class="delete-btn">Excluir</button>
            </td>
        </tr>
    `).join('');

    // Adicionar event listeners aos botões
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.closest('tr').dataset.id;
            deletePokemon(id);
        });
    });

    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.closest('tr').dataset.id;
            prepareEditForm(id);
        });
    });
}

function setupForm() {
    const form = document.getElementById('pokemonForm');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const pokemon = {
            nome: form.nome.value,
            tipo: form.tipo.value,
            poder: parseInt(form.poder.value),
            nivel: parseInt(form.nivel.value)
        };

        try {
            if (form.dataset.editId) {
                await pokemonService.update(form.dataset.editId, pokemon);
                showAlert('success', 'Pokémon atualizado!');
            } else {
                await pokemonService.create(pokemon);
                showAlert('success', 'Pokémon criado!');
            }
            
            form.reset();
            delete form.dataset.editId;
            form.querySelector('button[type="submit"]').textContent = 'Adicionar Pokémon';
            await loadPokemons();
        } catch (error) {
            showAlert('error', 'Erro: ' + error.message);
        }
    });
}

async function prepareEditForm(id) {
    try {
        const pokemon = await pokemonService.getById(id);
        const form = document.getElementById('pokemonForm');
        
        form.nome.value = pokemon.nome;
        form.tipo.value = pokemon.tipo;
        form.poder.value = pokemon.poder;
        form.nivel.value = pokemon.nivel;
        
        form.dataset.editId = id;
        form.querySelector('button[type="submit"]').textContent = 'Atualizar Pokémon';
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
        showAlert('error', 'Erro ao editar: ' + error.message);
    }
}

async function deletePokemon(id) {
    if (!confirm('Tem certeza que deseja excluir este Pokémon?')) return;
    
    try {
        await pokemonService.delete(id);
        showAlert('success', 'Pokémon excluído!');
        await loadPokemons();
    } catch (error) {
        showAlert('error', 'Erro ao excluir: ' + error.message);
    }
}

function showAlert(type, message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert ${type}`;
    alertDiv.textContent = message;
    document.body.prepend(alertDiv);
    setTimeout(() => alertDiv.remove(), 3000);
}