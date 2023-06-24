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
    postsHTML += ` <div class="block-post mb-100">
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
    '<a class="but" href="https://tyranocode.com/" target="_blank">Veja Todos os Posts do Blog<span class="right-arr">→</span></a>';
  document.querySelector(".block-posts").innerHTML = postsHTML;
}

function searchPosts() {
  const searchText = document
    .querySelector('.search-form input[name="s"]')
    .value.toLowerCase();
  const filteredPosts = postsData.filter((post) =>
    post.title.rendered.toLowerCase().includes(searchText)
  );
  displayPosts(filteredPosts);
}

function SearhPostHandler(event) {
  document
    .querySelector(".search-form")
    .addEventListener("submit", searchPosts);

  document
    .querySelector(".icon-search-7")
    .addEventListener("click", searchPosts);
  document
    .querySelector('.search-form input[name="s"]')
    .addEventListener("input", searchPosts);
}

/* end  posts*/

/*projects*/

async function fetchProjects() {
  try {
    const response = await fetch("projects/projects.json");
    if (!response.ok) {
      throw new Error(`Erro ${response.status} ${response.statusText}`);
    }
    const posts = await response.json();
    postsData = posts;
    displayProj(postsData);
  } catch (error) {
    console.log(error);
  }
}
function displayProj(projetos) {
  console.log(projetos);
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
            href="${proj.imagem}}"
            data-caption="${proj.legenda}">
            <img src="${proj.imagem}" widht=""
                height="300">
        </a>

    </div>

</li>`;
  }

  document.querySelector(".work").innerHTML = postsHTML;
}
exports = {
  fetchPosts,
  fetchProjects,
  SearhPostHandler,
};
