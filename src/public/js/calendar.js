document.addEventListener('DOMContentLoaded', function () {

    let request_calendar = './Html/pruebas.json'; //Aqui se debe llamar a la logica para obtener el json de las citas del medico mediante su id_medico


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
                    eventMouseEnter: function( mouseEnterInfo ){
                        let el = mouseEnterInfo.el;
                        el.classList.add('relative')

                        let newEl = document.createElement('div');
                        let newElTitle = mouseEnterInfo.event.title;
                        let newElLocation = mouseEnterInfo.event.extendedProps.location;
                        newEl.innerHTML =
                            `
                            <div class="fc-hoverable-event" style="position:absolute; bottom:100%; left:0; width: 300px; height:auto;
                                background-color: white; z-index: 50; border: 1px solid #e2e8f0; border-radius: 0.375rem;
                                padding: 0.75rem; font-size: 14px; font-family: 'Inter', sans-serif; cursor:pointer;">

                                <strong>${newElTitle}</strong>
                                <div>Location: ${newElLocation}</div>
                                <div>Date: ${mouseEnterInfo.event.start.toLocaleDateString(
                                    "es-MX",
                                    {
                                        month: "long",
                                        day: "numeric",
                                        year: "numeric"
                                    }
                                )}</div>
                                <div>Time: ${mouseEnterInfo.event.extendedProps.horaCita}</div>
                            </div>
                            `
                            el.after( newEl );
                    },

                    eventMouseLeave: function( mouseLeaveInfo ){
                        let el = document.querySelector('.fc-hoverable-event');
                        el.remove();
                    }
                });
                calendar.render();
            });