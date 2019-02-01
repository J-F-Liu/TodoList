import queryString from "query-string";

export function getQuery() {
  return queryString.parse(window.location.search);
}

export function setQuery(query) {
  window.location.search = queryString.stringify(query);
}

export function getHashPath() {
  // We can't use window.location.hash here because it's not
  // consistent across browsers - Firefox will pre-decode it!
  const href = window.location.href;
  const hashIndex = href.indexOf("#");
  return hashIndex === -1 ? "" : href.substring(hashIndex + 1);
}

export function pushHashPath(path) {
  window.location.hash = path;
}
