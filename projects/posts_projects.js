let postsData = [];

async function fetchPosts() {
  try {
    const response = await fetch("https://tyranocode.com/wp-json/wp/v2/posts");
    if (!response.ok) {
      throw new Error(`Erro ${response.status} ${response.statusText}`);
    }
    const posts = await response.json();
    postsData = posts;

    displayPosts(postsData);
  } catch (error) {
    console.log(error);
  }
}

function displayPosts(posts) {
  let postsHTML = "";
  for (let post of posts) {
    const contentPreview = post.content.rendered.substring(0, 500);
    postsHTML += ` <div class="block-post-tyrano mb-100">
    <div class="post-title mb-10">
      <a href="${post.link}">
        <h4>${post.title.rendered}</h4>
      </a>
    </div>
    <ul class="post-meta mb-30">
      <li>
        <span class="entry-date">
          ${new Date(post.date).toLocaleDateString()}
        </span>
      </li>
      <li>
        <span class="entry-cat">
          <a href="#">Web design</a>
        </span>
      </li>
    </ul>
    <div class="post-media mb-30">
      <a href="${post.link}"><img alt="" src="img/blog/4.jpg"></a>
    </div>
    <div class="entry-content">
      ${contentPreview}...
    </div>
    <a class="but" href="${post.link}">Leia Mais</a>
  </div>`;
  }
  postsHTML +=
    '<a class="but" href="https://tyranocode.com/" target="_blank">See all blog posts<span class="right-arr">→</span></a>';
  document.querySelector(".block-posts").innerHTML = postsHTML;
}

function searchPosts() {
  const searchText = document.querySelector("#search-post").value.toLowerCase();
  const filteredPosts = postsData.filter((post) =>
    post.title.rendered.toLowerCase().includes(searchText)
  );

  displayPosts(filteredPosts);
}

function SearchPostHandler() {
  document
    .querySelector("#search-posts-form")
    .addEventListener("submit", (e) => {
      e.preventDefault();
      searchPosts();
    });

  document
    .querySelector("#search-posts-form .icon-search-7")
    .addEventListener("click", (e) => {
      e.preventDefault();
      searchPosts();
    });

  document.querySelector("#search-post").addEventListener("input", (e) => {
    searchPosts(); // Aqui não precisa de preventDefault
  });
}

/* end  posts*/

/*projects*/

async function fetchProjects() {
  try {
    const response = await fetch("projects/projects.json");
    if (!response.ok) {
      throw new Error(`Erro ${response.status} ${response.statusText}`);
    }
    const projetos = await response.json();
    displayProj(projetos);
  } catch (error) {
    console.error(error);
  }
}

function displayProj(projetos) {
  const workElement = document.querySelector(".work");
  if (!workElement) {
    console.error("Elemento .work não encontrado!");
    return;
  }

  let postsHTML = "";
  for (let proj of projetos.projetos) {
    postsHTML += `
       <li class="${proj.classe}">
    <div class="item ${proj.tipo}">
        <div class="desc">
            <h5 class="proj-desc">${proj.titulo}
                <span>${proj.categoria}</span>
            </h5>
        </div>
        <a data-fancybox="gallery"
            href="${proj.imagem}"
            data-caption="${proj.legenda}">
            <img src="${proj.imagem}" widht="300"
                height="300">
        </a>

    </div>

</li>`;
  }

  workElement.innerHTML = postsHTML;
}

// Uso

//! github repos
let reposData = [];

async function fetchRepos() {
  try {
    const response = await fetch(
      "https://api.github.com/users/lzhenry666/repos"
    );
    if (!response.ok) {
      throw new Error(`Erro ${response.status} ${response.statusText}`);
    }
    const repos = await response.json();
    reposData = repos;

    const sortedByDate = sortByDate(reposData);
    displayRepos(sortedByDate);
  } catch (error) {
    console.log(error);
  }
}
// Ordena os repositórios por data de criação (mais recentes primeiro)
function sortByDate(repos) {
  return repos.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
}

// Ordena os repositórios por número de estrelas (mais estrelas primeiro)
function sortByStars(repos) {
  return repos.sort((a, b) => b.stargazers_count - a.stargazers_count);
}

function displayRepos(repos) {
  let reposHTML = "";
  for (let repo of repos) {
    reposHTML += `<div class="block-post-g mb-100">
      <div class="post-title mb-10">
        <a href="${repo.html_url}">
          <h4>${repo.name}</h4>
        </a>
      </div>
      <ul class="post-meta mb-30">
        <li>
          <span class="entry-date">
            ${new Date(repo.created_at).toLocaleDateString()}
          </span>
        </li>
        <li>
          <span class="entry-cat">
            ${repo.language}
          </span>
        </li>
      </ul>
      <div class="entry-content">
        ${repo.description || "Sem descrição"}...
      </div>
      <a class="but" href="${repo.html_url}" target="_blank">Ver Mais</a>
    </div>`;
  }
  document.querySelector(".block-posts-github").innerHTML = reposHTML;
}

function searchRepos() {
  const searchText = document.querySelector("#search-repo").value.toLowerCase();
  const filteredRepos = reposData.filter((repo) =>
    repo.name.toLowerCase().includes(searchText)
  );
  displayRepos(filteredRepos);
}

function searchReposHandler() {
  const form = document.querySelector("#search-repos-form");
  const icon = document.querySelector("#search-repos-form .icon-search-7");
  const input = document.querySelector("#search-repo");

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      searchRepos();
    });
  }

  if (icon) {
    icon.addEventListener("click", (e) => {
      e.preventDefault();
      searchRepos();
    });
  }

  if (input) {
    input.addEventListener("input", () => {
      searchRepos(); // Aqui não precisa de preventDefault
    });
  }
}

function setupClearIcon(formId, inputId, clearIconId) {
  const form = document.getElementById(formId);
  const input = document.getElementById(inputId);
  const clearIcon = document.getElementById(clearIconId);

  if (form && input && clearIcon) {
    input.addEventListener("input", () => {
      if (input.value) {
        clearIcon.style.display = "block";
      } else {
        clearIcon.style.display = "none";
      }
    });

    clearIcon.addEventListener("click", () => {
      input.value = "";
      clearIcon.style.display = "none";
    });
  }
}

// Configurar para os dois formulários
// Adicione outra linha aqui para configurar o outro formulário, se você tiver um ID diferente para o ícone de limpar

// Configurar os ícones de "x" para ambos os campos de entrada

// Inicializa a busca de repositórios
export {
  SearchPostHandler,
  fetchPosts,
  fetchProjects,
  fetchRepos,
  searchReposHandler,
  setupClearIcon,
};
