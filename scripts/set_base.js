const REPO_NAME = 'Nantetu-Server';
const isGitHubPages = window.location.pathname.includes(`/${REPO_NAME}/`);

if (isGitHubPages) {
    const baseTag = document.createElement('base');
    baseTag.href = `/${REPO_NAME}/`;
    document.head.prepend(baseTag);
}
