// 页面加载完成后执行
document.addEventListener("DOMContentLoaded", () => {
  loadProjects();
});

async function loadProjects() {
  const grid = document.getElementById("project-grid");
  if (!grid) return;

  try {
    const response = await fetch("data/projects.json");
    if (!response.ok) {
      throw new Error("JSON 文件加载失败，状态码：" + response.status);
    }
    const data = await response.json();
    renderProjects(data.projects, grid);
  } catch (error) {
    console.error("加载项目数据出错：", error);
    grid.innerHTML =
      '<p style="color:#b91c1c;">项目数据加载失败。请确认你通过 Live Server 打开页面，而不是直接双击 HTML 文件。</p>';
  }
}

function renderProjects(projects, container) {
  if (!projects || projects.length === 0) {
    container.innerHTML = "<p>暂无项目，敬请期待。</p>";
    return;
  }

  container.innerHTML = projects
    .map((project) => createProjectCard(project))
    .join("");
}

function createProjectCard(project) {
  const techTags = project.tech
    .map((t) => `<span class="tech-tag">${escapeHtml(t)}</span>`)
    .join("");

  const demoLink = project.demo
    ? `<a href="${escapeHtml(project.demo)}" target="_blank" rel="noopener">在线演示 →</a>`
    : "";

  const githubLink = project.github
    ? `<a href="${escapeHtml(project.github)}" target="_blank" rel="noopener">源码 →</a>`
    : "";

  return `
    <article class="project-card">
      <img src="${escapeHtml(project.image)}" alt="${escapeHtml(project.title)} 截图" loading="lazy" />
      <div class="project-card-body">
        <h3>${escapeHtml(project.title)}</h3>
        <p class="project-summary">${escapeHtml(project.summary)}</p>
        <div class="tech-tags">${techTags}</div>
        <div class="project-links">
          ${demoLink}
          ${githubLink}
        </div>
      </div>
    </article>
  `;
}

// 简单的防 XSS 转义，保证数据里的特殊字符不会破坏页面
function escapeHtml(str) {
  if (str === null || str === undefined) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}