document.addEventListener('DOMContentLoaded', async function () {

    const response = await fetch(`/getCitasMedico/${id_medico}`);
    const data = await response.json();

    if (!data.success) {
        console.error("❌ No se pudieron cargar las citas");
        return;
    }

    console.log("📅 Citas recibidas:", data.citas);

    let request_calendar = data.citas; //Aqui se debe llamar a la logica para obtener el json de las citas del medico mediante su id_medico


                var calendarEl = document.getElementById('calendar');
                var calendar = new FullCalendar.Calendar(calendarEl, {
                    initialView: 'dayGridMonth',

                    
                    events:function( info, successCallback, failureCallback ){
                        console.log("Info:", info);
                        fetch( request_calendar )
                            .then( function(response){
                                return response.json();
                            } )
                            .then( function( data ){
                                console.log("Datos de citas recibidos:", data);
                                let events = data.events.map( function( event ){
                                    return {
                                        //En esta parte de seben de mapear los datos de las citas que obtuvimos en el json anterior
                                        title: event.eventTitle, 
                                        start: new Date( event.eventStartDate ), //para establecer fechas en calendario
                                        end: new Date( event.eventEndDate ), //para establecer fechas en calendario
                                        timeStart: event.eventStartTime,
                                        location: event.eventLocation,
                                        timeEnd: event.eventEndTime,
                                        url: event.eventURL
                                    }
                                })
                                console.log("Eventos procesados:", events);
                                successCallback( events );
                            })
                            .catch( function( err ){
                                failureCallback( err );
                            } );
                    },
                    eventContent: function( info ){   //Funcion para personalizar las citas en el calendario
                        console.log("Hola Doctor");
                        
                        return {
                            html:
                                `
                                <div style="overflow: hidden;  position:relative; 
                                    cursor:pointer; font-size: 12px; font-family: 'Inter', sans-serif;">
                                    <div><strong>${info.event.title}</strong></div>
                                    <div>Location: ${info.event.extendedProps.location}</div>
                                    <div>Date:${info.event.start.toLocaleDateString(
                                        "es-MX",
                                        {
                                            month: "long",
                                            day: "numeric",
                                            year: "numeric"
                                        }
                                    )}</div>
                                    <div>Time: ${info.event.extendedProps.timeStart}</div>
                                </div>
                                `
                        }
                    },
                    eventMouseEnter: function (info) {
                        const el = info.el;
                        const rect = el.getBoundingClientRect();

                        // Crear tooltip
                        const tooltip = document.createElement("div");
                        tooltip.classList.add("fc-tooltip");
                        tooltip.style.position = "fixed";
                        tooltip.style.zIndex = "9999";
                        tooltip.style.width = "260px";
                        tooltip.style.padding = "12px";
                        tooltip.style.background = "white";
                        tooltip.style.border = "1px solid #e2e8f0";
                        tooltip.style.borderRadius = "8px";
                        tooltip.style.fontSize = "14px";
                        tooltip.style.fontFamily = "Inter, sans-serif";
                        tooltip.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)";

                        tooltip.innerHTML = `
                            <strong>${info.event.title}</strong><br>
                            <div><strong>Location:</strong> ${info.event.extendedProps.location}</div>
                            <div><strong>Date:</strong> ${info.event.start.toLocaleDateString("es-MX", {
                                month: "long",
                                day: "numeric",
                                year: "numeric"
                            })}</div>
                            <div><strong>Time:</strong> ${info.event.extendedProps.timeStart}</div>
                        `;

                        document.body.appendChild(tooltip);

                        // ---- Posicionamiento inteligente ----
                        const tooltipRect = tooltip.getBoundingClientRect();

                        let top = rect.top - tooltipRect.height - 10; // por arriba del dia
                        let left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);

                        // Si se sale por arriba → ponlo abajo
                        if (top < 0) {
                            top = rect.bottom + 10;
                        }

                        // Ajustar si se sale por izquierda
                        if (left < 0) {
                            left = 5;
                        }

                        // Ajustar si se sale por derecha
                        if (left + tooltipRect.width > window.innerWidth) {
                            left = window.innerWidth - tooltipRect.width - 5;
                        }

                        tooltip.style.top = `${top}px`;
                        tooltip.style.left = `${left}px`;

                        // Guardar referencia para eliminarlo después
                        info.el.tooltipElement = tooltip;
                    },

                    eventMouseLeave: function (info) {
                        if (info.el.tooltipElement) {
                            info.el.tooltipElement.remove();
                            info.el.tooltipElement = null;
                        }
                    },
                });
                calendar.render();
            });