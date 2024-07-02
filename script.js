const d = document,
  $template = d.querySelector(".am-template").content,
  $container = d.querySelector(".am-container"),
  fragment = d.createDocumentFragment(),
  $p = d.querySelector(".am-loader-container"),
  w = window;

let myUrl = "https://pokeapi.co/api/v2/pokemon",
  limit = "https://pokeapi.co/api/v2/pokemon?offset=640&limit=20",
  getNextLink = "",
  isLoading = false;

async function getPokemons(url) {
  if (isLoading) return;
  isLoading = true;

  let showError = (theError) => {
    console.error(theError);
    let statusM = theError.status || "",
      statusTextM = theError.statusText || "An Error Occurred";
    $p.innerHTML = `Error: ${statusM} ${statusTextM}`;
  };

  try {
    $p.innerHTML = `<img src="assets/pokemon.png" alt="pokemon-logo" class="logo-pokemon">`;

    let resp = await fetch(url),
      json = await resp.json();
    getNextLink = json.next;

    if (!resp.ok) throw { status: resp.status, statusText: resp.statusText };

    for (let i = 0; i < json.results.length; i++) {
      try {
        let rep = await fetch(json.results[i].url),
          pokemon = await rep.json();

        $template.querySelector("img").src =
          pokemon.sprites.other.dream_world.front_default;
        $template.querySelector("img").alt = pokemon.name;
        $template.querySelector("figcaption").textContent = pokemon.name;

        let clon = d.importNode($template, true);
        fragment.appendChild(clon);
      } catch (err) {
        showError(err);
      }
    }

    $p.innerHTML = "";
    $container.appendChild(fragment);
    fragment.innerHTML = "";
  } catch (error) {
    showError(error);
  } finally {
    isLoading = false;
  }
}

d.addEventListener("DOMContentLoaded", getPokemons(myUrl));

w.addEventListener("scroll", (e) => {
  const { scrollTop, clientHeight, scrollHeight } = d.documentElement;

  if (
    scrollTop + clientHeight >= scrollHeight - 900 &&
    getNextLink &&
    getNextLink !== limit
  ) {
    getPokemons(getNextLink);
  }
});
