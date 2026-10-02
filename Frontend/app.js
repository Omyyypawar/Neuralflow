const API_BASE_KEY = "nonlinear.apiBase";
const NODE_WIDTH = 260;
const NODE_HEIGHT = 142;

const icons = {
  refresh:
    '<svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M21 12a9 9 0 0 1-15.1 6.6"/><path d="M3 12A9 9 0 0 1 18.1 5.4"/><path d="M3 18v-5h5"/><path d="M21 6v5h-5"/></svg>',
  plus:
    '<svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M12 5v14"/><path d="M5 12h14"/></svg>',
  branch:
    '<svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M6 3v6a6 6 0 0 0 6 6h6"/><path d="M18 9l4 6-4 6"/><path d="M6 21V3"/></svg>',
  save:
    '<svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z"/><path d="M17 21v-8H7v8"/><path d="M7 3v5h8"/></svg>',
  target:
    '<svg viewBox="0 0 24 24" fill="none" stroke-width="2"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/><path d="M12 2v3"/><path d="M12 19v3"/><path d="M2 12h3"/><path d="M19 12h3"/></svg>',
  send:
    '<svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>',
  idea:
    '<svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M8.6 14.7A6 6 0 1 1 15.4 14.7c-.8.7-1.4 1.7-1.4 2.8h-4c0-1.1-.6-2.1-1.4-2.8Z"/></svg>',
  decision:
    '<svg viewBox="0 0 24 24" fill="none" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="m8 12 2.6 2.6L16 9"/></svg>',
  task:
    '<svg viewBox="0 0 24 24" fill="none" stroke-width="2"><rect x="4" y="4" width="16" height="16" rx="3"/><path d="m8 12 2.5 2.5L16 9"/></svg>',
  question:
    '<svg viewBox="0 0 24 24" fill="none" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.6 2.6 0 0 1 5 1c0 2-2.5 2-2.5 4"/><path d="M12 17h.01"/></svg>',
  pivot:
    '<svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M3 7h11a4 4 0 0 1 4 4v8"/><path d="m14 3 4 4-4 4"/><path d="M3 17h6"/></svg>',
  bug:
    '<svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M8 6.5A4 4 0 0 1 16 6.5"/><path d="M8 7h8v8a4 4 0 0 1-8 0Z"/><path d="M4 13h4"/><path d="M16 13h4"/><path d="M5 20l3-3"/><path d="M19 20l-3-3"/><path d="M5 4l3 3"/><path d="M19 4l-3 3"/></svg>',
};

const NODE_TYPES = [
  {
    id: "idea",
    label: "Idea",
    icon: icons.idea,
    rootTitle: "Core idea",
    branchTitle: "Idea branch",
    rootContent: "Capture the project direction, insight, or opportunity.",
    branchContent: "Capture the new angle or refinement.",
    prompts: [
      ["Value", "Why does this idea matter for the project?"],
      ["Risk", "What is the weakest part of this idea?"],
      ["Next", "What should we test next?"],
    ],
  },
  {
    id: "decision",
    label: "Decision",
    icon: icons.decision,
    rootTitle: "Key decision",
    branchTitle: "Decision branch",
    rootContent: "Record the choice, tradeoff, and why it matters.",
    branchContent: "Record the choice made from this branch.",
    prompts: [
      ["Why", "Why did we decide this?"],
      ["Tradeoff", "What tradeoff did this decision create?"],
      ["Reverse", "What would make us reverse this decision?"],
    ],
  },
  {
    id: "task",
    label: "Task",
    icon: icons.task,
    rootTitle: "Next task",
    branchTitle: "Task branch",
    rootContent: "Define the concrete work, owner, and done state.",
    branchContent: "Define the next action unlocked by this branch.",
    prompts: [
      ["Next", "What is the next concrete step?"],
      ["Blockers", "What could block this task?"],
      ["Done", "What does done look like?"],
    ],
  },
  {
    id: "question",
    label: "Question",
    icon: icons.question,
    rootTitle: "Open question",
    branchTitle: "Question branch",
    rootContent: "Write the unknown, why it matters, and how to resolve it.",
    branchContent: "Capture the follow-up question from this branch.",
    prompts: [
      ["Answer", "What can we answer from the current memory?"],
      ["Missing", "What information is still missing?"],
      ["Test", "How should we resolve this question?"],
    ],
  },
  {
    id: "pivot",
    label: "Pivot",
    icon: icons.pivot,
    rootTitle: "Pivot point",
    branchTitle: "Pivot branch",
    rootContent: "Describe what changed and what direction replaces the old one.",
    branchContent: "Describe the new direction and the reason for the shift.",
    prompts: [
      ["Changed", "What changed from the previous branch?"],
      ["Keep", "What should we keep from the old direction?"],
      ["Cost", "What does this pivot cost us?"],
    ],
  },
  {
    id: "bug",
    label: "Bug",
    icon: icons.bug,
    rootTitle: "Bug report",
    branchTitle: "Bug branch",
    rootContent: "Capture the symptom, suspected cause, and reproduction notes.",
    branchContent: "Capture the new clue, failed fix, or suspected cause.",
    prompts: [
      ["Cause", "What is the likely root cause?"],
      ["Repro", "What reproduction steps do we know?"],
      ["Fix", "What fix should we try first?"],
    ],
  },
];

const NODE_TYPE_BY_ID = Object.fromEntries(NODE_TYPES.map((type) => [type.id, type]));

const state = {
  apiBase: localStorage.getItem(API_BASE_KEY) || "http://127.0.0.1:8000",
  projects: [],
  threads: [],
  selectedProjectId: null,
  selectedThreadId: null,
  newNodeType: "idea",
  answer: "",
  pathIds: new Set(),
  pathItems: [],
  busy: false,
  status: "",
  statusType: "",
  dragging: null,
};

const app = document.getElementById("app");

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function project() {
  return state.projects.find((item) => item.id === state.selectedProjectId) || null;
}

function selectedThread() {
  return state.threads.find((item) => item.id === state.selectedThreadId) || null;
}

function normalizeNodeType(value) {
  return NODE_TYPE_BY_ID[value] ? value : "idea";
}

function nodeTypeConfig(value) {
  return NODE_TYPE_BY_ID[normalizeNodeType(value)];
}

function normalizeThread(thread) {
  return {
    ...thread,
    node_type: normalizeNodeType(thread.node_type),
  };
}

function threadPosition(thread, index) {
  const x = Number.isFinite(thread.position_x) ? thread.position_x : 180 + (index % 4) * 330;
  const y = Number.isFinite(thread.position_y) ? thread.position_y : 120 + Math.floor(index / 4) * 230;
  return { x, y };
}

function apiUrl(path) {
  return `${state.apiBase.replace(/\/$/, "")}${path}`;
}

async function request(path, options = {}) {
  const response = await fetch(apiUrl(path), {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    let detail = response.statusText;
    try {
      const body = await response.json();
      detail = body.detail || detail;
    } catch {
      // Keep the HTTP status text.
    }
    throw new Error(Array.isArray(detail) ? detail[0]?.msg || "Request failed" : detail);
  }

  if (response.status === 204) return null;
  return response.json();
}

function setStatus(message, type = "") {
  state.status = message;
  state.statusType = type;
  render();
  if (message) {
    window.clearTimeout(setStatus.timer);
    setStatus.timer = window.setTimeout(() => {
      state.status = "";
      state.statusType = "";
      render();
    }, 2600);
  }
}

async function loadProjects() {
  state.busy = true;
  render();
  try {
    state.projects = await request("/projects/");
    if (!state.selectedProjectId && state.projects.length) {
      state.selectedProjectId = state.projects[0].id;
    }
    await loadThreads();
  } catch (error) {
    setStatus(error.message || "Unable to load projects", "error");
  } finally {
    state.busy = false;
    render();
  }
}

async function loadThreads() {
  if (!state.selectedProjectId) {
    state.threads = [];
    state.selectedThreadId = null;
    return;
  }

  state.threads = (await request(`/projects/${state.selectedProjectId}/threads/`)).map(normalizeThread);
  state.threads.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  if (state.selectedThreadId && !state.threads.some((item) => item.id === state.selectedThreadId)) {
    state.selectedThreadId = null;
  }
  state.pathIds = new Set();
  state.pathItems = [];
}

async function createProject(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const title = form.elements.title.value.trim();
  const description = form.elements.description.value.trim();
  if (!title) return;

  try {
    const created = await request("/projects/", {
      method: "POST",
      body: JSON.stringify({ title, description: description || null }),
    });
    form.reset();
    state.projects = [created, ...state.projects];
    state.selectedProjectId = created.id;
    state.selectedThreadId = null;
    state.answer = "";
    await loadThreads();
    setStatus("Project created");
  } catch (error) {
    setStatus(error.message || "Unable to create project", "error");
  }
}

async function selectProject(projectId) {
  state.selectedProjectId = projectId;
  state.selectedThreadId = null;
  state.answer = "";
  render();
  try {
    await loadThreads();
    render();
  } catch (error) {
    setStatus(error.message || "Unable to load threads", "error");
  }
}

async function createThread(parentId = null, nodeType = state.newNodeType) {
  if (!state.selectedProjectId) return;

  const normalizedType = normalizeNodeType(nodeType);
  const typeConfig = nodeTypeConfig(normalizedType);
  const parent = parentId ? state.threads.find((item) => item.id === parentId) : null;
  const parentIndex = parent ? state.threads.indexOf(parent) : state.threads.length;
  const parentPos = parent ? threadPosition(parent, parentIndex) : { x: 240, y: 160 };
  const title = parent ? typeConfig.branchTitle : typeConfig.rootTitle;
  const content = parent ? typeConfig.branchContent : typeConfig.rootContent;

  try {
    const created = await request(`/projects/${state.selectedProjectId}/threads/`, {
      method: "POST",
      body: JSON.stringify({
        title,
        content,
        node_type: normalizedType,
        parent_id: parentId,
        position_x: parent ? parentPos.x + 330 : parentPos.x,
        position_y: parent ? parentPos.y + 160 : parentPos.y,
      }),
    });
    state.threads.push(normalizeThread(created));
    state.selectedThreadId = created.id;
    state.answer = "";
    setStatus(parent ? `${typeConfig.label} branch created` : `${typeConfig.label} node created`);
    render();
  } catch (error) {
    setStatus(error.message || "Unable to create node", "error");
  }
}

async function saveSelectedThread(event) {
  event.preventDefault();
  const current = selectedThread();
  if (!current || !state.selectedProjectId) return;

  const form = event.currentTarget;
  const title = form.elements.title.value.trim() || "Untitled memory";
  const content = form.elements.content.value.trim();
  const nodeType = normalizeNodeType(form.elements.node_type.value);

  try {
    const updated = normalizeThread(await patchThread(current.id, { title, content, node_type: nodeType }));
    state.threads = state.threads.map((item) => (item.id === updated.id ? updated : item));
    setStatus("Node saved");
    render();
  } catch (error) {
    setStatus(error.message || "Unable to save node", "error");
  }
}

async function patchThread(threadId, data) {
  return request(`/projects/${state.selectedProjectId}/threads/${threadId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

async function askMemory(event) {
  event.preventDefault();
  if (!state.selectedProjectId) return;

  const form = event.currentTarget;
  const query = form.elements.query.value.trim();
  if (!query) return;

  state.busy = true;
  state.answer = "Thinking...";
  render();

  try {
    const body = {
      query,
      thread_id: state.selectedThreadId,
      include_debug: true,
    };
    const result = await request(`/projects/${state.selectedProjectId}/ask`, {
      method: "POST",
      body: JSON.stringify(body),
    });

    state.answer = result.answer || "";
    const pathThreads = result.context_graph?.threads || [];
    state.pathIds = new Set(pathThreads.map((item) => item.id));
    state.pathItems = pathThreads.map(normalizeThread);
    setStatus(`Answered from ${result.used_thread_count} node${result.used_thread_count === 1 ? "" : "s"}`);
  } catch (error) {
    state.answer = "";
    setStatus(error.message || "Unable to ask memory", "error");
  } finally {
    state.busy = false;
    render();
  }
}

function centerSelected() {
  const current = selectedThread();
  const wrap = document.querySelector(".canvas-wrap");
  if (!current || !wrap) return;

  const index = state.threads.indexOf(current);
  const pos = threadPosition(current, index);
  wrap.scrollTo({
    left: Math.max(0, pos.x - wrap.clientWidth / 2 + NODE_WIDTH / 2),
    top: Math.max(0, pos.y - wrap.clientHeight / 2 + NODE_HEIGHT / 2),
    behavior: "smooth",
  });
}

function bindEvents() {
  const projectForm = document.querySelector("[data-project-form]");
  if (projectForm) projectForm.addEventListener("submit", createProject);

  const inspectorForm = document.querySelector("[data-inspector-form]");
  if (inspectorForm) inspectorForm.addEventListener("submit", saveSelectedThread);

  const askForm = document.querySelector("[data-ask-form]");
  if (askForm) askForm.addEventListener("submit", askMemory);

  document.querySelector("[data-api-base]")?.addEventListener("change", (event) => {
    state.apiBase = event.currentTarget.value.trim() || "http://127.0.0.1:8000";
    localStorage.setItem(API_BASE_KEY, state.apiBase);
    loadProjects();
  });

  document.querySelector("[data-refresh]")?.addEventListener("click", loadProjects);
  document.querySelector("[data-new-root]")?.addEventListener("click", () => createThread(null));
  document
    .querySelector("[data-new-branch]")
    ?.addEventListener("click", () => createThread(state.selectedThreadId));
  document.querySelector("[data-center]")?.addEventListener("click", centerSelected);

  document.querySelectorAll("[data-new-node-type]").forEach((button) => {
    button.addEventListener("click", () => {
      state.newNodeType = normalizeNodeType(button.dataset.newNodeType);
      render();
    });
  });

  document.querySelectorAll("[data-node-type-choice]").forEach((button) => {
    button.addEventListener("click", () => {
      const nodeType = normalizeNodeType(button.dataset.nodeTypeChoice);
      const input = document.querySelector("[name='node_type']");
      if (input) input.value = nodeType;
      document.querySelectorAll("[data-node-type-choice]").forEach((choice) => {
        choice.classList.toggle("active", choice.dataset.nodeTypeChoice === nodeType);
      });
    });
  });

  document.querySelectorAll("[data-project-id]").forEach((button) => {
    button.addEventListener("click", () => selectProject(button.dataset.projectId));
  });

  document.querySelectorAll("[data-node-id]").forEach((node) => {
    node.addEventListener("pointerdown", beginDrag);
    node.addEventListener("click", () => {
      state.selectedThreadId = node.dataset.nodeId;
      render();
    });
  });

  document.querySelectorAll("[data-prompt]").forEach((button) => {
    button.addEventListener("click", () => {
      const input = document.querySelector("[name='query']");
      if (input) input.value = button.dataset.prompt;
    });
  });
}

function beginDrag(event) {
  const header = event.target.closest(".node-header");
  const node = event.currentTarget;
  if (!header || !node) return;

  const threadId = node.dataset.nodeId;
  const thread = state.threads.find((item) => item.id === threadId);
  if (!thread) return;

  const index = state.threads.indexOf(thread);
  const pos = threadPosition(thread, index);
  state.selectedThreadId = threadId;
  state.dragging = {
    threadId,
    startX: event.clientX,
    startY: event.clientY,
    originX: pos.x,
    originY: pos.y,
  };

  node.setPointerCapture(event.pointerId);
  node.addEventListener("pointermove", dragMove);
  node.addEventListener("pointerup", endDrag);
  node.addEventListener("pointercancel", endDrag);
}

function dragMove(event) {
  if (!state.dragging) return;

  const x = Math.max(20, state.dragging.originX + event.clientX - state.dragging.startX);
  const y = Math.max(20, state.dragging.originY + event.clientY - state.dragging.startY);
  const thread = state.threads.find((item) => item.id === state.dragging.threadId);
  if (!thread) return;

  thread.position_x = x;
  thread.position_y = y;
  const node = document.querySelector(`[data-node-id="${thread.id}"]`);
  if (node) {
    node.style.left = `${x}px`;
    node.style.top = `${y}px`;
    const footer = node.querySelector(".node-footer span:last-child");
    if (footer) footer.textContent = `${Math.round(x)}, ${Math.round(y)}`;
  }

  const edges = document.querySelector(".edges");
  if (edges) {
    edges.outerHTML = renderEdges();
  }
}

async function endDrag(event) {
  const node = event.currentTarget;
  node.releasePointerCapture?.(event.pointerId);
  node.removeEventListener("pointermove", dragMove);
  node.removeEventListener("pointerup", endDrag);
  node.removeEventListener("pointercancel", endDrag);

  if (!state.dragging) return;
  const thread = state.threads.find((item) => item.id === state.dragging.threadId);
  state.dragging = null;
  if (!thread) return;

  try {
    await patchThread(thread.id, {
      position_x: thread.position_x,
      position_y: thread.position_y,
    });
  } catch (error) {
    setStatus(error.message || "Unable to save position", "error");
  }
}

function render() {
  const currentProject = project();
  const currentThread = selectedThread();
  const nodeCount = state.threads.length;

  app.innerHTML = `
    <div class="app-shell">
      <header class="topbar">
        <div class="brand">
          <div class="mark">N</div>
          <div class="brand-name">Non Linear AI</div>
        </div>
        <div class="project-title">${escapeHtml(currentProject?.title || "No project selected")}</div>
        <div class="api-control">
          <label for="apiBase">API</label>
          <input id="apiBase" data-api-base value="${escapeHtml(state.apiBase)}" />
          <button class="icon-button" data-refresh title="Reload" aria-label="Reload">${icons.refresh}</button>
        </div>
      </header>

      <main class="workspace">
        <aside class="sidebar">
          <div class="panel-heading">
            <h2>Projects</h2>
          </div>
          <form class="project-form" data-project-form>
            <input name="title" placeholder="Project name" autocomplete="off" />
            <textarea name="description" placeholder="Description"></textarea>
            <button class="toolbar-button primary" type="submit">${icons.plus}<span>Create</span></button>
          </form>
          <div class="project-list">
            ${renderProjects()}
          </div>
        </aside>

        <section class="canvas-column">
          <div class="canvas-toolbar">
            ${renderTypePicker(state.newNodeType, "new-node-type")}
            <button class="toolbar-button primary" data-new-root ${!currentProject ? "disabled" : ""} title="New root">${icons.plus}<span>Root</span></button>
            <button class="toolbar-button" data-new-branch ${!currentThread ? "disabled" : ""} title="New branch">${icons.branch}<span>Branch</span></button>
            <button class="icon-button" data-center ${!currentThread ? "disabled" : ""} title="Center selected" aria-label="Center selected">${icons.target}</button>
            ${renderTypeCounts()}
            <div class="canvas-meta">${nodeCount} node${nodeCount === 1 ? "" : "s"}</div>
          </div>
          <div class="canvas-wrap">
            ${
              currentProject
                ? `<div class="canvas" data-canvas>${renderEdges()}${renderNodes()}</div>`
                : '<div class="empty">Create or select a project</div>'
            }
          </div>
        </section>

        <aside class="inspector">
          ${renderInspector(currentThread)}
        </aside>
      </main>
    </div>
    ${state.status ? `<div class="status ${state.statusType}">${escapeHtml(state.status)}</div>` : ""}
  `;

  bindEvents();
}

function renderProjects() {
  if (!state.projects.length) {
    return '<div class="muted">No projects</div>';
  }

  return state.projects
    .map(
      (item) => `
        <button class="project-row ${item.id === state.selectedProjectId ? "active" : ""}" data-project-id="${item.id}">
          <strong>${escapeHtml(item.title)}</strong>
          <span>${escapeHtml(item.description || "No description")}</span>
        </button>
      `,
    )
    .join("");
}

function renderTypePicker(activeType, dataAttribute) {
  const normalizedActive = normalizeNodeType(activeType);
  return `
    <div class="type-strip" role="group" aria-label="Memory type">
      ${NODE_TYPES.map((type) => {
        const active = type.id === normalizedActive;
        return `
          <button
            class="type-option type-${type.id} ${active ? "active" : ""}"
            type="button"
            data-${dataAttribute}="${type.id}"
            title="${type.label}"
            aria-label="${type.label}"
          >
            ${type.icon}<span>${type.label}</span>
          </button>
        `;
      }).join("")}
    </div>
  `;
}

function renderTypeCounts() {
  if (!state.threads.length) return "";

  const counts = state.threads.reduce((memo, thread) => {
    const nodeType = normalizeNodeType(thread.node_type);
    memo[nodeType] = (memo[nodeType] || 0) + 1;
    return memo;
  }, {});

  return `
    <div class="type-counts" aria-label="Memory counts">
      ${NODE_TYPES.filter((type) => counts[type.id])
        .map((type) => `<span class="type-count type-${type.id}">${type.icon}${counts[type.id]}</span>`)
        .join("")}
    </div>
  `;
}

function renderEdges() {
  const byId = new Map(state.threads.map((item) => [item.id, item]));
  const lines = state.threads
    .map((thread, index) => {
      if (!thread.parent_id || !byId.has(thread.parent_id)) return "";

      const parent = byId.get(thread.parent_id);
      const parentIndex = state.threads.indexOf(parent);
      const from = threadPosition(parent, parentIndex);
      const to = threadPosition(thread, index);
      const inPath = state.pathIds.has(thread.id) && state.pathIds.has(thread.parent_id);
      return `<line class="edge ${inPath ? "in-path" : ""}" x1="${from.x + NODE_WIDTH / 2}" y1="${from.y + 54}" x2="${to.x + NODE_WIDTH / 2}" y2="${to.y + 54}" />`;
    })
    .join("");

  return `<svg class="edges" aria-hidden="true">${lines}</svg>`;
}

function renderNodes() {
  if (!state.threads.length) {
    return '<div class="empty">No nodes</div>';
  }

  return state.threads
    .map((thread, index) => {
      const pos = threadPosition(thread, index);
      const selected = thread.id === state.selectedThreadId;
      const inPath = state.pathIds.has(thread.id);
      const hasParent = Boolean(thread.parent_id);
      const nodeType = normalizeNodeType(thread.node_type);
      const typeConfig = nodeTypeConfig(nodeType);
      return `
        <article
          class="node type-${nodeType} ${selected ? "selected" : ""} ${inPath ? "in-path" : ""}"
          data-node-id="${thread.id}"
          style="left: ${pos.x}px; top: ${pos.y}px;"
        >
          <header class="node-header">
            <div class="node-heading">
              <div class="node-kicker">${typeConfig.icon}<span>${typeConfig.label}</span></div>
              <div class="node-title">${escapeHtml(thread.title)}</div>
            </div>
            <div class="node-pill">${hasParent ? "branch" : "root"}</div>
          </header>
          <div class="node-content">${escapeHtml(thread.content || "Empty memory")}</div>
          <footer class="node-footer">
            <span>${new Date(thread.created_at).toLocaleDateString()}</span>
            <span>${Math.round(pos.x)}, ${Math.round(pos.y)}</span>
          </footer>
        </article>
      `;
    })
    .join("");
}

function renderInspector(currentThread) {
  if (!project()) {
    return '<div class="empty">No project</div>';
  }

  if (!currentThread) {
    return `
      <div class="panel-heading">
        <h2>Memory</h2>
      </div>
      ${renderTypePicker(state.newNodeType, "new-node-type")}
      <div class="button-row">
        <button class="toolbar-button primary" data-new-root>${icons.plus}<span>Root</span></button>
      </div>
      <div class="answer muted">Select a node</div>
    `;
  }

  const nodeType = normalizeNodeType(currentThread.node_type);
  const typeConfig = nodeTypeConfig(nodeType);

  return `
    <div class="panel-heading">
      <h2>Memory</h2>
      <button class="toolbar-button" data-new-branch title="New branch">${icons.branch}<span>Branch</span></button>
    </div>

    <form class="inspector-form" data-inspector-form>
      <div class="field">
        <label>Type</label>
        ${renderTypePicker(nodeType, "node-type-choice")}
        <input type="hidden" name="node_type" value="${nodeType}" />
      </div>
      <div class="field">
        <label for="nodeTitle">Title</label>
        <input id="nodeTitle" name="title" value="${escapeHtml(currentThread.title)}" autocomplete="off" />
      </div>
      <div class="field">
        <label for="nodeContent">Content</label>
        <textarea id="nodeContent" name="content">${escapeHtml(currentThread.content || "")}</textarea>
      </div>
      <button class="toolbar-button primary" type="submit">${icons.save}<span>Save</span></button>
    </form>

    <hr />

    <form class="ask-box" data-ask-form>
      <div class="field">
        <label for="query">Ask</label>
        <textarea id="query" name="query">${escapeHtml(typeConfig.prompts[0][1])}</textarea>
      </div>
      <div class="button-row">
        ${typeConfig.prompts
          .map(
            ([label, prompt]) =>
              `<button class="toolbar-button" type="button" data-prompt="${escapeHtml(prompt)}">${escapeHtml(label)}</button>`,
          )
          .join("")}
      </div>
      <button class="toolbar-button primary" type="submit" ${state.busy ? "disabled" : ""}>${icons.send}<span>Ask</span></button>
    </form>

    <div class="answer">${escapeHtml(state.answer || "No answer yet")}</div>
    ${renderPath()}
  `;
}

function renderPath() {
  if (!state.pathItems.length) return "";

  return `
    <div class="path-list">
      <div class="section-label">Path</div>
      ${state.pathItems
        .map((item) => {
          const typeConfig = nodeTypeConfig(item.node_type);
          return `<div class="path-item type-${normalizeNodeType(item.node_type)}">${typeConfig.icon}<span>${escapeHtml(item.title)}</span></div>`;
        })
        .join("")}
    </div>
  `;
}

loadProjects();
