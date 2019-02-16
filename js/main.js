var config = {
    apiKey: "AIzaSyAIaOWhalF_R-E8BaCE8C3Tc-VHMb8BM-g",
    authDomain: "todo-35640.firebaseapp.com",
    databaseURL: "https://todo-35640.firebaseio.com",
    projectId: "todo-35640",
    storageBucket: "todo-35640.appspot.com",
    messagingSenderId: "214241045655"
  };
firebase.initializeApp(config);
var uid = localStorage.getItem('uid');
var provider = new firebase.auth.GoogleAuthProvider();

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      var user = firebase.auth().currentUser;
      uid = user.uid;
      localStorage.setItem('uid', uid);
      document.getElementById('sign').style.visibility = "hidden"; 
    } else {
      document.getElementById('sign').style.visibility = "visible"; 
    }
  });

function signIn(){
    firebase.auth().signInWithPopup(provider).then(function(result) {
        var user = result.user;
        uid = user.uid;
        update();
      }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
      });
}
var database = firebase.database();
function makeCompleted(element){
    var dataElement = element.parentNode;
    var key = dataElement.getAttribute('data-task');
    var obj = {};
    obj[key.replace(/-/g, ' ')] = 1;
    database.ref(`/${uid}/`).update(obj);
}
function addItem(){
    var text = document.getElementById('itemAdd').value;
    document.getElementById('itemAdd').value = '';
    var obj = {};
    obj[text] = 0;
    firebase.database().ref(`/${uid}/`).update(obj); 
    update();
}
function remove(element){
    var dataElement = element.parentNode;
    var key = dataElement.getAttribute('data-task');
    
    firebase.database().ref(`/${uid}/`+key.replace(/-/g, ' ') ).remove(); 
}
function getEvent(event){
    if(event.keyCode == 13)
        addItem();
}
function resetItems(){
    firebase.database().ref(`/${uid}/`).set({});
}
function removeCompleted(element){
    var dataElement = element.parentNode;
    var key = dataElement.getAttribute('data-task');
    var obj = {};
    obj[key.replace(/-/g, ' ')] = 0;
    database.ref('/suresh/').update(obj);
}
function makeChanges(snapval){
    var task = document.getElementById('tasks'); 
    var final = '';
    if(snapval)
    Object.keys(snapval).forEach(function(key){
        var hypenkey = key.replace(/\s+/g, '-');
        if (snapval[key] == 0){
            final = final + `<li data-task=${hypenkey} data-index=${key}><input type="checkbox" onClick="makeCompleted(this)" >` + key + '<span class="delete" onClick="remove(this)"><img src="./img/delete-16.png" /></span></li>';
        } else {
            final = final + `<li data-task=${hypenkey} data-index=${key}  style="text-decoration:line-through"><input type="checkbox" onClick="removeCompleted(this)" checked="true">` + key + '<span class="delete" onClick="remove(this)" ><img src="./img/delete-16.png" /></span></li>';
        }
    })         
    task.innerHTML = '<ul style="list-style-type:none" >' + final + '</ul>';
}
var

taskCountRef = firebase.database().ref(`/${uid}/`);
taskCountRef.on('value', function(snapshot) {
    makeChanges(snapshot.val())
});
function update(){
    database.ref(`/${uid}/`).once('value').then(function(snapshot){
        makeChanges(snapshot.val())
    })
    
}