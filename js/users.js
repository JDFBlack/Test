function registerUser(){
    var uname = $("#regusername").val();
    var pwd = $("#regpassword").val();

    if (uname !== "" && pwd !== ""){
      var isMale = $("#male").prop("checked");
      var isFemale = $("#female").prop("checked");
      var isInvestor = $("#investor").prop("checked");
      var isOthers = $("#other").prop("checked");
      var isSourcer = $("#sourcer").prop("checked");

      var regObj = {uname:uname,pwd:pwd,ismale:isMale,isfemale:isFemale,isinvestor:isInvestor,issourcer:isSourcer,isothers:isOthers};
      localStorage.regData = JSON.stringify(regObj); //converts javascript object to as a string which is stored in local storage

      $.mobile.back(); //at end of function returns to previous page, since function ran from button on /register it will return to /index
    }
  }

  function checkLogin(){
    var regObj = JSON.parse(localStorage.regData); //regObh is the data from local storage
    var registeredUname = regObj.uname; //checks for uname class stored in local storage and sets to registeredUname
    var registeredPwd = regObj.pwd;
    if($("#username").val() === registeredUname && $("#password").val() == registeredPwd){ //if user name entered and password entered already existing username & password function will allow, otherwise popup incorrect
      $("#username").val(""); //these clear the fields on each form so creds aren't filled out on login page when user has logged out.
      $("#password").val("");
      $.mobile.pageContainer.pagecontainer("change","#property_list_screen",{transition:"slide"});
      sessionStorage.isLogin = "YES"; //isLogin is now true, meaning other pages can be refreshed
    }else{
      $("#pwdalert").popup("open");
      sessionStorage.isLogin = "NO";
    }
  }

  function logout(){
      sessionStorage.isLogin = false;
      console.log("Called Logout");
      $.mobile.pageContainer.pagecontainer("change","#login_screen",{transition:"slide"});
      //$.mobile.back();
  }
  //END OF USER FUNCTIONS