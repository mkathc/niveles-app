import router from "../router";
import store from "../store";

//const seconde_service = 'https://tesisapi.herokuapp.com'
const seconde_service = 'https://tesisapi.herokuapp.com'

function getApiUrl() {
  return process.env.VUE_APP_API_URL || "http://localhost:5000";
  // return "http://localhost:5000";
}

function getHeaders() {
  let token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

async function fetch_get(name) {
  let res = await fetch(`${getApiUrl()}/${name}`, {
    headers: getHeaders(),
  });
  let json = await res.json();
  if (res.status >= 400 && res.status < 600) {
    handlerCode(json.code);
    throw json;
  }

  return json;
}

async function fetch_post(name, data) {
  let res = await fetch(`${getApiUrl()}/${name}`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: getHeaders(),
  });
  let json = await res.json();
  if (res.status >= 400 && res.status < 600) {
    handlerCode(json.code);
    throw json;
  }

  return json;
}

function handlerCode(code) {
  if (code) {
    // TOKEN EXPIRED
    if (code == "1000") {
      localStorage.removeItem("token");
      store.commit("setUser", null);
      router.push("/").catch(() => { });
    }
  }
}

async function fetch_second_get(name) {
  let res = await fetch(`${seconde_service}/${name}`, { headers: getHeaders() })
  if (res.status >= 400 && res.status < 600)
    throw await res.json();

  return res.json()
}


async function fetch_second_post(name, data) {
  let res = await fetch(`${seconde_service}/${name}`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: getHeaders()
  })
  if (res.status >= 400 && res.status < 600)
    throw await res.json();

  return res.json()
}

export { fetch_get, fetch_post, getHeaders, fetch_second_get, fetch_second_post };
