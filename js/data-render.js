/* Six 7 Cup — Renderizador de datos dinámicos
   Carga los JSON de /data y pinta el contenido en cada página.
   Esto es lo que hace posible editar el sitio desde el dashboard (admin.html)
   sin tocar el HTML directamente. */
(function () {
    "use strict";

    function fetchJSON(path) {
        return fetch(path, { cache: "no-store" })
            .then(function (r) {
                if (!r.ok) throw new Error("No se pudo cargar " + path);
                return r.json();
            })
            .catch(function (err) {
                console.warn(err);
                return null;
            });
    }

    function escapeHTML(str) {
        if (str === null || str === undefined) return "";
        return String(str)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");
    }

    var STATUS_LABEL = { done: "Finalizada", next: "Próxima", upcoming: "Programada" };

    /* ---------- INDEX: tabla de pilotos ---------- */
    function renderDrivers(drivers) {
        var body = document.getElementById("tablaPilotos");
        if (!body) return;
        if (!drivers || !drivers.length) {
            body.innerHTML =
                '<tr class="empty-state"><td colspan="4"><div class="empty-content">' +
                '<div class="icon">\uD83C\uDFCE\uFE0F</div><h3>Aún no hay pilotos registrados</h3>' +
                "</div></td></tr>";
            return;
        }
        var top = drivers.slice(0, 5);
        body.innerHTML = top.map(function (d) {
            return "<tr><td>" + escapeHTML(d.pos) + "</td><td>" + escapeHTML(d.name) +
                "</td><td>" + escapeHTML(d.team) + "</td><td>" + escapeHTML(d.points) + "</td></tr>";
        }).join("");
    }

    /* ---------- INDEX: tabla de constructores ---------- */
    function renderConstructors(teams) {
        var body = document.getElementById("tablaConstructores");
        if (!body) return;
        if (!teams || !teams.length) {
            body.innerHTML = '<tr><td colspan="6">Aún no hay datos de constructores.</td></tr>';
            return;
        }
        body.innerHTML = teams.map(function (t) {
            return "<tr><td>" + escapeHTML(t.pos) + '</td><td class="team-name"><span>' + escapeHTML(t.team) +
                "</span></td><td>" + escapeHTML(t.played) + "</td><td>" + escapeHTML(t.wins) +
                "</td><td>" + escapeHTML(t.losses) + "</td><td>" + escapeHTML(t.points) + "</td></tr>";
        }).join("");
    }

    /* ---------- INDEX: popular posts (2 columnas) ---------- */
    function renderPopularNews(news) {
        var col1 = document.getElementById("popularNewsCol1");
        var col2 = document.getElementById("popularNewsCol2");
        if (!col1 || !col2) return;
        var items = (news || []).slice(0, 8);
        var half = Math.ceil(items.length / 2);
        var left = items.slice(0, half);
        var right = items.slice(half);

        function itemHTML(n, idx, tagClass) {
            if (idx === 0) {
                return '<div class="news-item popular-item set-bg" data-setbg="img/news/popular-b.jpg">' +
                    '<div class="ni-tag ' + tagClass + '">' + escapeHTML(n.tag || "Noticias") + '</div>' +
                    '<div class="ni-text"><h5><a href="#">' + escapeHTML(n.title) + '</a></h5>' +
                    '<ul><li><i class="fa fa-calendar"></i> ' + escapeHTML(n.date) + '</li></ul></div></div>';
            }
            return '<div class="news-item"><div class="ni-pic"><img src="img/news/ln-1.jpg" alt=""></div>' +
                '<div class="ni-text"><h5><a href="#">' + escapeHTML(n.title) + '</a></h5>' +
                '<ul><li><i class="fa fa-calendar"></i> ' + escapeHTML(n.date) + '</li></ul></div></div>';
        }

        col1.innerHTML = left.map(function (n, i) { return itemHTML(n, i, "tenis"); }).join("");
        col2.innerHTML = right.map(function (n, i) { return itemHTML(n, i, "football"); }).join("");
    }

    /* ---------- Footer: últimas noticias (en todas las páginas) ---------- */
    function renderFooterNews(news) {
        var el = document.getElementById("footerNewsContainer");
        if (!el) return;
        var items = (news || []).slice(-2);
        el.innerHTML = items.map(function (n) {
            return '<div class="fw-item"><h5><a href="#">' + escapeHTML(n.title) + '</a></h5>' +
                '<ul><li><i class="fa fa-calendar"></i> ' + escapeHTML(n.date) + '</li></ul></div>';
        }).join("");
    }

    /* ---------- SCHEDULE: tabla de calendario ---------- */
    function renderSchedule(races) {
        var body = document.getElementById("scheduleTableBody");
        if (!body) return;
        if (!races || !races.length) {
            body.innerHTML = '<tr><td colspan="4">Calendario por confirmar.</td></tr>';
            return;
        }
        body.innerHTML = races.map(function (r) {
            var label = STATUS_LABEL[r.status] || "Programada";
            return '<tr class="status-' + escapeHTML(r.status || "upcoming") + '">' +
                '<td class="race-round">' + escapeHTML(r.round) + '</td>' +
                '<td class="race-info"><h4>' + escapeHTML(r.gp) + '</h4><span>' + escapeHTML(r.circuit) + '</span></td>' +
                '<td class="race-date">' + escapeHTML(r.date) + '</td>' +
                '<td class="race-status"><span class="status-badge">' + label + '</span></td></tr>';
        }).join("");
    }

    /* ---------- RESULT: tabla de resultados ---------- */
    function renderResults(results) {
        var body = document.getElementById("resultsTableBody");
        if (!body) return;
        if (!results || !results.length) {
            body.innerHTML = '<tr><td colspan="4">Aún no hay resultados registrados.</td></tr>';
            return;
        }
        body.innerHTML = results.map(function (r) {
            return '<tr><td class="race-round">' + escapeHTML(r.round) + '</td>' +
                '<td class="race-info"><h4>' + escapeHTML(r.gp) + '</h4>' +
                '<span>Ganador: ' + escapeHTML(r.winner) + ' &middot; ' + escapeHTML(r.team) + '</span></td>' +
                '<td class="race-date">' + escapeHTML(r.time) + '</td>' +
                '<td class="race-status"><span class="status-badge">Finalizada</span></td></tr>';
        }).join("");
    }

    /* ---------- RESULT: mini clasificación lateral ---------- */
    function renderDriverStandingsMini(drivers) {
        var el = document.getElementById("driverStandingsMini");
        if (!el) return;
        if (!drivers || !drivers.length) {
            el.innerHTML = "<li>Aún no hay pilotos registrados.</li>";
            return;
        }
        el.innerHTML = drivers.map(function (d) {
            return '<li><a href="#"><span class="driver"><span class="pos">' + escapeHTML(d.pos) + '</span>' +
                escapeHTML(d.name) + '</span><span class="pts">' + escapeHTML(d.points) + ' pts</span></a></li>';
        }).join("");
    }

    /* ---------- CLUB: info general de la liga ---------- */
    function renderLeagueInfo(info) {
        if (!info) return;
        var map = {
            leagueDescription: info.description,
            leagueFounded: info.founded,
            leaguePlatform: info.platform,
            leagueDirector: info.director,
            leagueDrivers: info.driversRegistered,
            leagueVenue: info.venue
        };
        Object.keys(map).forEach(function (id) {
            var el = document.getElementById(id);
            if (el && map[id] !== undefined) el.textContent = map[id];
        });
    }

    /* ---------- CLUB: tabs de equipos ---------- */
    function slugify(str) {
        return "team-" + String(str).toLowerCase()
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    }

    function renderTeams(teams) {
        var nav = document.getElementById("teamTabsNav");
        var content = document.getElementById("teamTabsContent");
        if (!nav || !content) return;
        if (!teams || !teams.length) {
            content.innerHTML = "<p>Aún no hay equipos cargados.</p>";
            return;
        }
        nav.innerHTML = teams.map(function (t, i) {
            var id = slugify(t.name);
            return '<li class="nav-item"><a class="nav-link' + (i === 0 ? " active" : "") +
                '" data-toggle="tab" href="#' + id + '" role="tab">' + escapeHTML(t.name) + "</a></li>";
        }).join("");

        content.innerHTML = teams.map(function (t, i) {
            var id = slugify(t.name);
            var drivers = (t.drivers || []).map(function (d) {
                return '<div class="ct-item"><div class="ci-text"><img src="' + escapeHTML(d.image || "img/club/p-1.jpg") +
                    '" alt=""><h5>#' + escapeHTML(d.number) + ". " + escapeHTML(d.name) + '</h5></div>' +
                    '<div class="ci-name">' + escapeHTML(t.name) + "</div></div>";
            }).join("");
            return '<div class="tab-pane' + (i === 0 ? " active" : "") + '" id="' + id +
                '" role="tabpanel"><div class="club-tab-content">' + (drivers || "<p>Sin pilotos asignados aún.</p>") + "</div></div>";
        }).join("");
    }

    /* ---------- Carga general por página ---------- */
    document.addEventListener("DOMContentLoaded", function () {
        if (document.getElementById("tablaPilotos") || document.getElementById("tablaConstructores") || document.getElementById("popularNewsCol1")) {
            fetchJSON("data/drivers.json").then(renderDrivers);
            fetchJSON("data/constructors.json").then(renderConstructors);
            fetchJSON("data/news.json").then(renderPopularNews);
        }
        if (document.getElementById("scheduleTableBody")) {
            fetchJSON("data/schedule.json").then(renderSchedule);
        }
        if (document.getElementById("resultsTableBody") || document.getElementById("driverStandingsMini")) {
            fetchJSON("data/results.json").then(renderResults);
            fetchJSON("data/drivers.json").then(renderDriverStandingsMini);
        }
        if (document.getElementById("teamTabsNav")) {
            fetchJSON("data/league.json").then(renderLeagueInfo);
            fetchJSON("data/teams.json").then(renderTeams);
        }
        if (document.getElementById("footerNewsContainer")) {
            fetchJSON("data/news.json").then(renderFooterNews);
        }
    });
})();
