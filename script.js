let addBtn=document.querySelector(".add-btn");
let removeBtn=document.querySelector(".remove-btn");
let modalCont=document.querySelector(".modal-cont");
let textareaCont=document.querySelector(".textarea-cont");
let mainCont=document.querySelector(".main-cont");
let toolboxColors = document.querySelectorAll(".color");

let addFlag = false;
let removeFlag = false;

let lockClass = "fa-lock";
let unlockClass = "fa-lock-open";

let ticketarr = [];

if(localStorage.getItem("jira_ticket"))
{
    //retrieve and display tickets
    ticketarr = JSON.parse( localStorage.getItem("jira_ticket") );

    ticketarr.forEach((ticketObj)=>{
        createTicket(ticketObj.ticketColor,ticketObj.ticketTask,ticketObj.ticketId);
    })
}

for(let i = 0;i< toolboxColors.length;i++)
{
    toolboxColors[i].addEventListener("click",(e)=>{
        let currentToolBoxColor=toolboxColors[i].classList[0];

        let filteredTickets = ticketarr.filter((ticketObj,idx)=>{
      
            return currentToolBoxColor===ticketObj.ticketColor;
        })

        let allTicketConts = document.querySelectorAll(".ticket-cont");
        for(let i=0;i<allTicketConts.length;i++)
        {
            allTicketConts[i].remove();
        }
      
        filteredTickets.forEach((ticketObj,idx)=>{
            createTicket(ticketObj.ticketColor,ticketObj.ticketTask,ticketObj.ticketId);
        })

    })

    toolboxColors[i].addEventListener("dblclick",(e)=>{
        let allTicketConts = document.querySelectorAll(".ticket-cont");
        for(let i=0;i<allTicketConts.length;i++)
        {
            allTicketConts[i].remove();
        }
      
        ticketarr.forEach((ticketObj,idx)=>{
            createTicket(ticketObj.ticketColor,ticketObj.ticketTask,ticketObj.ticketId);
        })
    })
}

let colors=["lightpink","lightblue","lightgreen","black"];
let modalPriorityColor = colors[colors.length-1];





let allPriorityColors=document.querySelectorAll(".priority-color");
allPriorityColors.forEach((colorElem,idx)=>{
   colorElem.addEventListener("click",(e)=>{
      allPriorityColors.forEach((priorityColorElem,idx)=>{
        priorityColorElem.classList.remove("border");
      })

      colorElem.classList.add("border");
      modalPriorityColor=colorElem.classList[0];
   })
})

removeBtn.addEventListener("click",(e)=>{
    removeFlag = !removeFlag;
})


addBtn.addEventListener("click",(e)=>{
    //display->modal
    //generate-ticket

    //addflag->true display
    //addflag->false not display

    addFlag=!addFlag;

    if(addFlag)
    {
        modalCont.style.display="flex";

    }

    else{
        modalCont.style.display="none";
        textareaCont.value="";//starMark
    }
})




//modal cont pe listener for ticket generation
modalCont.addEventListener("keydown",(e)=>{
    let key=e.key;
    if(key==="Shift")
    {
        createTicket(modalPriorityColor,textareaCont.value);
        modalCont.style.display="none";
        addFlag=false;
        textareaCont.value="";
    }
})



function createTicket(ticketColor,ticketTask,ticketId)
{
    let id= ticketId || shortid();
    let ticketCont=document.createElement("div");
    ticketCont.setAttribute("class","ticket-cont");

    ticketCont.innerHTML=`<div class="ticket-color ${ticketColor}"></div>
    <div class="ticket-id">${id}</div>
    <div class="task-area">${ticketTask}</div>
    <div class="ticket-lock"><i class="fa-solid fa-lock"></i></div>`;

    mainCont.appendChild(ticketCont);
    
    //create object of ticket and add to array
    if(!ticketId)
    {
        ticketarr.push({ticketColor,ticketTask,ticketId: id});
        localStorage.setItem("jira_ticket",JSON.stringify(ticketarr));
    }
    


    handleRemoval(ticketCont,id);
    handleLock(ticketCont,id);
    handleColor(ticketCont, id);
}

function handleRemoval(ticket,id)
{
    //removeFlag = true->remove

    ticket.addEventListener("click",(e)=>{
        if(removeFlag)
        {
        let index = getTicketIdx(id);
        ticketarr.splice(index , 1);
        let strTicketArr = JSON.stringify(ticketarr);
        localStorage.setItem("jira_ticket",strTicketArr);
        ticket.remove();
        }
    })
}

function handleLock(ticket,id)
{
    let ticketLockElem=ticket.querySelector(".ticket-lock");
    let ticketLock=ticketLockElem.children[0];
    let ticketTaskArea = ticket.querySelector(".task-area");
    ticketLock.addEventListener("click",(e)=>{
        let ticket_idx = getTicketIdx(id);
        if(ticketLock.classList.contains(lockClass))
        {
                ticketLock.classList.remove(lockClass);
                ticketLock.classList.add(unlockClass);
                ticketTaskArea.setAttribute("contenteditable","true");
        }
        else{
            ticketLock.classList.remove(unlockClass);
            ticketLock.classList.add(lockClass);
            ticketTaskArea.setAttribute("contenteditable","false");
        }

        //modify data in local storage->ticket task
        ticketarr[ticket_idx].ticketTask = ticketTaskArea.innerText;
        localStorage.setItem("jira_ticket",JSON.stringify(ticketarr));
    })
}

function handleColor(ticket , id )
{
    let ticketColor = ticket.querySelector(".ticket-color");
    ticketColor.addEventListener("click",(e)=>{

              let ticketIdx = getTicketIdx(id);

              let currentTicketColor = ticketColor.classList[1];

               //get ticketColor index

             let currentTicketColorIdx = colors.findIndex((color)=> {
                   return currentTicketColor===color;
                                       })

                 currentTicketColorIdx++;

            let newTicketColorIdx = currentTicketColorIdx%colors.length;

            let newTicketColor = colors[newTicketColorIdx];

            ticketColor.classList.remove(currentTicketColor);
           ticketColor.classList.add(newTicketColor);

           //modify data in local storage

           ticketarr[ticketIdx].ticketColor = newTicketColor;
           localStorage.setItem("jira_ticket",JSON.stringify(ticketarr));
  })
}

function getTicketIdx(id)
{
    let ticketIndex = ticketarr.findIndex((ticketObj)=>{
        return ticketObj.ticketId === id;
    })

    return ticketIndex;
}