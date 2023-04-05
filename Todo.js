//Tüm Elementleri Seçme
const form = document.querySelector("#todo-form"); //form'u seçme id ile
const todoInput = document.querySelector("#todo");  //Input seçme (textbox) id ile 
const todoList = document.querySelector(".list-group");  // ul etiketi seçme class ile
const firstCardBody = document.querySelectorAll(".card-body")[0]; // 1. card body seçme class ile
const secondCardBody = document.querySelectorAll(".card-body")[1]; // 2. card body seçme class ile
const filterInput = document.querySelector("#filter");  //Input seçme (textbox) id ile 
const clearButton = document.querySelector("#clear-todos"); //silme buttonu seçme id ile

eventListeners(); 

function eventListeners(){    //tüm eventListener lar
    form.addEventListener("submit",addTodo);   // form'a submit olma durumu ekleme
    //sayfa yenilendiğinde eklenen todo'lar kaybolmasın (DOMContentLoaded)
    //Todo'ları localstorage'dan alma
    document.addEventListener("DOMContentLoaded",loadAllTodosToUI);
    //Todo'ları UI'dan silmek
    secondCardBody.addEventListener("click",deleteTodo); // cardbody'e clik event'i atamak
     //Filtreleme
     filterInput.addEventListener("keyup",filterTodos);
     //Tüm Todo'ları Sil
     clearButton.addEventListener("click",clearAllTodos);
}
//Tüm Todo'ları Sil
function clearAllTodos(e){
if(confirm("Tüm Todoları Silmek İstediğinize Emin misiniz ?")){
    //Arayüzden Todo'ları Temizleme
    // todoList.innerHTML = ""; //yavaş çalışan yöntemdir.
    while(todoList.firstElementChild != null){  //hızlı çalışan yöntemdir.
 
        todoList.removeChild(todoList.firstElementChild);
    }
    //LocalStorage'dan Todo'ları Temizleme
    localStorage.removeItem("todos");    
}

}
//Filtreleme
function filterTodos(e){

    const filterValue = e.target.value.toLowerCase(); // küçük harfe çevirme
    const listItems = document.querySelectorAll(".list-group-item"); // tüm li leri sec

    listItems.forEach(function(listItem){

        const text = listItem.textContent.toLowerCase();
        if(text.indexOf(filterValue) === -1){
            //Bulamadı
            listItem.setAttribute("style","display : none !important");
        }
        else{
            listItem.setAttribute("style","display : block");
        }
    });
}

//Todo'ları UI'dan silmek
function deleteTodo(e){
    // console.log(e.target);  //cardbody'de nereye tıklandığını verir.
    if(e.target.className === "fa fa-remove"){  // tıkladığımız class name2i fa fa-remove ise
       // <i> = e.target  - <a> = parentElement  - <li> = parentElement
        e.target.parentElement.parentElement.remove();
        //Todo'ları LocalStorage'dan silmek
        deleteTodoFromStorage(e.target.parentElement.parentElement.textContent);
        showAlert("success","Silme İşlemi Başarı ile Gerçekleşti..."); 

    }
}
//Todo'ları LocalStorage'dan silmek
function deleteTodoFromStorage(deletetodo){    
    let todos = getTodosFromStorage();  //önceden alt tarafta oluşturduğumuz fonsiyon

    todos.forEach(function(todo,index){

        if(todo === deletetodo){
            todos.splice(index,1);  // Array'den değer silme (splice)
        }
    });
    localStorage.setItem("todos",JSON.stringify(todos));
}
function loadAllTodosToUI (){
    //Todo'ları localstorage'dan alma
    let todos = getTodosFromStorage(); //önceden alt tarafta oluşturduğumuz fonsiyon
    todos.forEach(function(todo){
 
        addTodoToUI(todo);   //önceden alt tarafta oluşturduğumuz fonsiyon
    })
    
}
//Yeni Todo Oluşturma
function addTodo(e){
    const newTodo = todoInput.value.trim();    // baştaki ve sondaki boşlukları silme ve new todo değerini ınputtan alma

    if(newTodo === ""){
        //bootstrap4 alert message 
        // <div class="alert alert-danger" role="alert">
        //                 This is a danger alert with <a href="#" class="alert-link">an example link</a>. Give it a click if you like.
        //               </div>   
        showAlert("danger","Lütfen bir Todo giriniz...Boş geçilemez!");  // type / message
    }
    else{
        addTodoToUI(newTodo);
        addTodoToStorage(newTodo); // Todo'ları storage ekleme
        showAlert("success","Todo başarıyla eklendi...");  // type / message
    }
   
    e.preventDefault();  // sayfa açıldığında direkt olarak form'a odaklanamayı engelleme 
}
// Todo'ları storage ekleme
function getTodosFromStorage(){  // Storage'dan tüm todo'ları alma
    let todos;
    if(localStorage.getItem("todos") === null){ //todos adında bir key yoksa.

        todos = []; // boş bir array olarak ekle
    }
    else{ // todos adında bir key var ise.

        todos = JSON.parse(localStorage.getItem("todos")); // string olarak geldiği için array'a çevirdik.        
    }
    return todos;
}
function addTodoToStorage(newTodo){
   let todos = getTodosFromStorage();
   todos.push(newTodo);

   localStorage.setItem("todos",JSON.stringify(todos));  // değerleri güncelleme
}


function showAlert(type,message){
 
    const alert = document.createElement("div"); // alert mesajını div içine oluşturmak için div etiketi oluşturduk
    alert.className = `alert alert-${type}`; // mesajın classname'i type=danger veya success olabilir
    alert.textContent = message;  //  message kısmı yukardan gelecek textcontent olarak ekledik

    firstCardBody.appendChild(alert); // cardbody'imizin içine bu div'i eklememiz gerekir.

 // alert mesajının 2 saniye sonra kaybolamasını istersek setTimeout metodunu kullanmalıyız ve alert.remove();
      setTimeout(function() {
          alert.remove();
      }, 2000);
  
}
//Oluşan Todo'Yu listeye(listItem'a )ekleme
function addTodoToUI(newTodo){  // aldığımız ınput değerini listeye ekleyecek
    //ListItem Oluşturma
    const listItem = document.createElement("li"); // sıfırdan li elemeti oluşturma
    //Link Oluşturma
    const link = document.createElement("a");  // sıfırdan a elemeti oluşturma
    link.href = "#";   // a link elementinin gideceği adres
    link.className = "delete-item"; // a link elementine class vermek
    link.innerHTML = "<i class = 'fa fa-remove'></i>";   //a elementi içinde i elementi oluşturma  x işareti vermek

    listItem.className = "list-group-item d-flex justify-content-between"; // li elementine class vermek
    listItem.appendChild(document.createTextNode(newTodo)); // ınput içindeki text'i li olarak ekleme
    listItem.appendChild(link);  // li'link olarak ekleme

    todoList.appendChild(listItem); // li'yi ul içine ekleme

    todoInput.value=""; //ınput'boşaltma

}
 
