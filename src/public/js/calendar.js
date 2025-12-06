document.addEventListener('DOMContentLoaded', async function () {

    const id_medico = localStorage.getItem("id_medico");
    const idMedico = window.location.pathname.split("/").pop();

    if (!id_medico) {
        console.error("❌ No existe id_medico en localStorage");
        return;
    }

    const response = await fetch(`/getCitasMedico/${id_medico}`);
    const data = await response.json();

    if (!data.success) {
        console.error("❌ No se pudieron cargar las citas");
        return;
    }

    console.log("📅 Citas recibidas:", data.citas);

    var calendarEl = document.getElementById('calendar');

    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        locale: "es",

        // ⬇ AQUI VA LA LISTA DE EVENTOS DIRECTAMENTE
        events: data.citas,

        eventContent(info) {
            return {
                html: `
                <div style="overflow: hidden;">
                    <div><strong>${info.event.title}</strong></div>
                    <div>ID: ${info.event.id}</div>
                    <div>Time: ${info.event.extendedProps.timeStart} hrs.</div>
                    <div>Duración: ${info.event.extendedProps.duracion} min.</div>
                    <div>Nota: ${info.event.extendedProps.nota}</div>
                </div>`
            }
        },

        eventMouseEnter(info) {
            const el = info.el;
            const rect = el.getBoundingClientRect();

            const tooltip = document.createElement("div");
            tooltip.classList.add("fc-tooltip");
            tooltip.style.position = "fixed";
            tooltip.style.zIndex = "9999";
            tooltip.style.width = "240px";
            tooltip.style.padding = "10px";
            tooltip.style.background = "white";
            tooltip.style.border = "1px solid #ddd";
            tooltip.style.borderRadius = "6px";

            tooltip.innerHTML = `
                <div><strong>${info.event.title}</strong></div>
                <div>ID: ${info.event.id}</div>
                <div>Time: ${info.event.extendedProps.timeStart} hrs.</div>
                <div>Duración: ${info.event.extendedProps.duracion} min.</div>
                <div>Nota: ${info.event.extendedProps.nota}</div>
            `;

            document.body.appendChild(tooltip);

            const tooltipRect = tooltip.getBoundingClientRect();
            tooltip.style.top = (rect.top - tooltipRect.height - 10) + "px";
            tooltip.style.left = (rect.left + rect.width/2 - tooltipRect.width/2) + "px";

            info.el.tooltipElement = tooltip;
        },

        eventMouseLeave(info) {
            if (info.el.tooltipElement) {
                info.el.tooltipElement.remove();
                info.el.tooltipElement = null;
            }
        }

    });

    calendar.render();
});
